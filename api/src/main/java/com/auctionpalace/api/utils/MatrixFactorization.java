package com.auctionpalace.api.utils;

import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Random;
import java.util.stream.Collectors;

import javax.transaction.Transactional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.web.context.request.FacesWebRequest;

import com.auctionpalace.api.dto.FDTO;
import com.auctionpalace.api.entities.Bid;
import com.auctionpalace.api.entities.F;
import com.auctionpalace.api.entities.Item;
import com.auctionpalace.api.entities.User;
import com.auctionpalace.api.entities.V;

import com.auctionpalace.api.repositories.BidRepository;
import com.auctionpalace.api.repositories.FRepository;
import com.auctionpalace.api.repositories.ItemRepository;
import com.auctionpalace.api.repositories.UserRepository;
import com.auctionpalace.api.repositories.VRepository;
import com.auctionpalace.api.repositories.VisitationRepository;


@Component
@EnableScheduling
public class MatrixFactorization implements RecommendationSystem{

    @Autowired private ItemRepository itemRepository;
    @Autowired private UserRepository userRepository;
    @Autowired private VisitationRepository visitationRepository;
    @Autowired private BidRepository bidRepository;
    @Autowired private VRepository vRepository;
    @Autowired private FRepository fRepository;
    
    Random rand = new Random(LocalTime.now().getSecond());

    private double tol = 0.0001;
    private int K = 4;
    private double l = 0.05;

    @Override

    @Scheduled(cron =  "${cron.expression}")
    public void train() {

        // System.out.println(LocalDateTime.now());
        int N = numberOfUsers();
        ArrayList<Integer> userIds = getUserIds();

        int M = numberOfItems();
        ArrayList<Integer> itemIds = getItemIds();

        double[][] X = zeros(N, M);
        double[][] V = random(N, K);
        double[][] F = random(K, M);

        //get current ratings
        for(int i = 0; i < N; i++){
            for(int j = 0; j < M; j++){

                int user_id = userIds.get(i);
                int item_id = itemIds.get(j);
                int rating = 0;

                int buy_now = (bidRepository.getBuyNow(user_id, item_id).size() == 0) ? 0 : 5;
                List<Bid> bidList = bidRepository.getBids(user_id, item_id);
                int bids = (bidList == null) ? 0 : bidList.size();

                rating += buy_now + bids;
                rating  = rating > 10 ? 10 : rating;
                if(rating == 0){
                    rating = visitationRepository.getVisits(user_id, item_id).size() == 0 ? 0 : 1;
                }
                X[i][j] = rating;
            }
        }         
        X = normalize(X, N, M);

        double rmse = 0.0;
        double rmse_prev = 0.0;   
        int total_known_ratings = totalKnownRatings(X, N, M);
        do{
            rmse_prev = rmse;
            rmse = 0.0;

            for(int i = 0; i < N; i++){
                for(int j = 0; j < M; j++){
                    if(X[i][j] != 0.0){
            
                        //calculate error
                        double predicted = dot(V, F, i, j, K);
                        double actual = X[i][j];
                        double error = actual - predicted;
                        double error_squared = error * error;
                        rmse += error_squared;

                        double[] v_i = new double[K];
                        double[] f_j = new double[K];

                        //adjust V and F tables
                        for(int k = 0; k < K; k++){
                            v_i[k] = V[i][k] + l*2*error*F[k][j];
                            f_j[k] = F[k][j] + l*2*error*V[i][k];
                        }
                        for(int k = 0; k < K; k++){
                            V[i][k] = v_i[k];
                            F[k][j] = f_j[k];
                        }

                    }
                }
            }

            rmse = Math.sqrt(rmse / total_known_ratings);

        }while(Math.abs(rmse - rmse_prev) > tol);
        
        //store tables
        storeVTable(V, userIds, K);
        storeFTable(F, itemIds, K);
    }

    private void storeVTable(double[][] table, ArrayList<Integer> userIds, int K) {
        
        int N = userIds.size();
        List<V> list = new ArrayList<>();

        for(int i = 0; i < N; i++)
            for(int k = 0; k < K; k++){
                list.add(new V(
                        (i * K) + k + 1, 
                        userRepository.findById(userIds.get(i)).orElse(null), 
                        k, 
                        table[i][k]
                    )
                );
            }
        vRepository.saveAll(list);
    }

    private void storeFTable(double[][] table, ArrayList<Integer> itemIds, int K) {
        
        int M = itemIds.size();
        List<F> list = new ArrayList<>();

        for(int k = 0; k < K; k++)
            for(int j = 0; j < M; j++){
                list.add(new F(
                    (k * M) + j + 1, 
                    k, 
                    itemRepository.findById(itemIds.get(j)).orElse(null), 
                    table[k][j]
                ));
            }
        fRepository.saveAll(list);
    }

    private int totalKnownRatings(double[][] X, int N, int M) {
        int total = 0;
        for(int i = 0; i < N; i++)
            for(int j = 0; j < M; j++)
                if(X[i][j] != 0.0) total += 1;

        return total;
    }

    private double[][] normalize(double[][] x, int n, int m) {
        //max rating is 10

        for(int i = 0; i < n; i++)
            for(int j = 0; j < m; j++)
                x[i][j] /= 10;
        
        return x;
    }

    private double[][] zeros(int N, int M){
        double[][] X = new double[N][M];
        for(int i = 0; i < N; i++)
            for(int j = 0; j < M; j++)
                X[i][j] = 0.0;
        return X;
    }

    private double[][] random(int N, int M){
        double[][] X = new double[N][M];
        for(int i = 0; i < N; i++)
            for(int j = 0; j < M; j++)
                X[i][j] = rand.nextGaussian();
        return X;
    }

    private void print2DTable(double[][]X, int x, int y){
        for(int i = 0; i < x; i++){
            for(int j = 0; j < y; j++)
                System.out.printf("%3.1f \t", X[i][j]);
            System.out.println();
        }
    }

    private ArrayList<Integer> getItemIds() {
        return itemRepository.findAllIds();
    }

    private int numberOfItems() {
        return (int) itemRepository.count();
    }

    private ArrayList<Integer> getUserIds() {

        return userRepository.findUserIds();
    }

    private int numberOfUsers() {
        return (int) userRepository.count();
    }

    @Override
    public Item predict(int user_id) throws Exception{
        
        User user = userRepository.findById(user_id).orElse(null);
        if(user == null)
            throw new Exception("User with id " + user_id + " does not exist");

        int countRowElements = vRepository.countRowElements(user_id);
        if(countRowElements == 0)
            throw new Exception("User with id " + user_id + " does not have a row in table V");

        double[] v_i = getUserRow(user_id);
        ArrayList<Integer> itemIds = fRepository.getLiveItemIds(LocalDateTime.now());
        int M = itemIds.size();
        double[][] F = getFTable(itemIds);

        double[] product = matrixProduct(v_i, F, M);
        
        int id = itemIds.get(getMaxIndex(product, M));
        return itemRepository.findById(id).orElse(null);
    }

    private int getMaxIndex(double[] v, int size){

        int index = 0;
        double max = v[0];

        for(int i = 0; i < size; i++)
            if(v[i] > max){
                max = v[i];
                index = i;
            }

        return index;
    }

    private double[] matrixProduct(double[] v_i, double[][] F, int M) {
        double[] res = new double[M];
        double sum = 0.0;
        for(int j = 0; j < M; j++){
            sum = 0.0;
            for(int k = 0; k < K; k++)sum += F[k][j] * v_i[k];
            res[j] = sum;
        }

        return res;
    }

    private void printVector(double[] v, int size){
        System.out.printf("(");
        for(int i = 0; i < size; i++)
            System.out.printf("%.2f%s", v[i], ( (i == size - 1) ? ")\n" : ", " ));
    }

    private double[][] getFTable(ArrayList<Integer> itemIds) {
        
        int M = itemIds.size();
        double[][] F = new double[K][M];
        List<F> list = fRepository.findAllLive(LocalDateTime.now());
        List<FDTO> elements = list.stream().map(f -> new FDTO(f)).collect(Collectors.toList());
        
        for(int i = 0; i < elements.size(); i++){
            FDTO element = elements.get(i);
            int k = element.getRow_num();
            int j = itemIds.indexOf(element.getItems_id());
            F[k][j] = element.getValue();
        }

        // print2DTable(F, K, M);
        return F;
    }

    private double[] getUserRow(int user_id) {
        return vRepository.getUserRow(user_id);
    }

    private void printUserRow(int id, double[] v_i){
        System.out.printf("user (id = " + id + ") row : (");
        for(int i = 0; i < K; i++)
            System.out.printf("%.2f%s", 
                v_i[i],
                (i == K-1) ? ")\n" : ", ");
    }

    private double dot(double[][] V, double[][] F, int i, int j, int K){
        double sum = 0.0;

        for(int k = 0; k < K; k++)
            sum += V[i][k] * F[k][j];

        /*Check result
        ArrayList<Double> row = new ArrayList<>();
        ArrayList<Double> col = new ArrayList<>();
        
        for(int k = 0; k < K; k++)row.add(V[i][k]);
        for(int k = 0; k < K; k++)col.add(F[k][j]);

        System.out.println("Row: " + row);
        System.out.println("Col: " + col);
        System.out.println("(Row, Col): " + sum);
        */

        return sum;
    }
    
}
