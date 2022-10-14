package com.auctionpalace.api.services;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

import javax.transaction.Transactional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.util.Pair;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

import com.auctionpalace.api.dto.CardDTO;
import com.auctionpalace.api.dto.CardInfoDTO;
import com.auctionpalace.api.dto.ItemCreationDTO;
import com.auctionpalace.api.dto.ItemDTO;
import com.auctionpalace.api.dto.ItemInfo;
import com.auctionpalace.api.dto.BidInfo;
import com.auctionpalace.api.dto.BidOverview;
import com.auctionpalace.api.dto.MessageCreationDTO;
import com.auctionpalace.api.dto.MessageDTO;
import com.auctionpalace.api.dto.PageResponse;
import com.auctionpalace.api.dto.RatingConfirmation;
import com.auctionpalace.api.dto.UserCreation;
import com.auctionpalace.api.dto.UserStats;
import com.auctionpalace.api.entities.Authority;
import com.auctionpalace.api.entities.Bid;
import com.auctionpalace.api.entities.Card;
import com.auctionpalace.api.entities.Deal;
import com.auctionpalace.api.entities.Item;
import com.auctionpalace.api.entities.Message;
import com.auctionpalace.api.entities.User;
import com.auctionpalace.api.entities.Visitation;
import com.auctionpalace.api.repositories.BidRepository;
import com.auctionpalace.api.repositories.CardRepository;
import com.auctionpalace.api.repositories.CategoryRepository;
import com.auctionpalace.api.repositories.DealRepository;
import com.auctionpalace.api.repositories.ItemRepository;
import com.auctionpalace.api.repositories.MessageRepository;
import com.auctionpalace.api.repositories.UserRepository;
import com.auctionpalace.api.repositories.VisitationRepository;
import com.auctionpalace.api.utils.CustomPasswordEncoder;
import com.auctionpalace.api.utils.JwtUtil;
import com.auctionpalace.api.utils.MatrixFactorization;

@Service
public class UserService {
    
    @Autowired private UserRepository userRepository;
    @Autowired private AuthorityService authorityService;
    @Autowired private CustomPasswordEncoder encoder;
    @Autowired AuthenticationManager authenticationManager;
    @Autowired private CategoryRepository categoryRepository;
    @Autowired private ItemRepository itemRepository;
    @Autowired private BidRepository bidRepository;
    @Autowired private MessageRepository messageRepository;
    @Autowired private JwtUtil jwtUtil;
    @Autowired private CardRepository cardRepository;
    @Autowired private DealRepository dealRepository;
    @Autowired private VisitationRepository visitationRepository;
    @Autowired private MatrixFactorization mf;

    
    public ItemDTO recommend(String full_token) throws Exception{
        User user = getUserFromJWT(full_token);

        return new ItemDTO(
            mf.predict(user.getId())
        );
    }

    public Visitation userVisitsItem(String full_token, int item_id) throws Exception{
        User user = getUserFromJWT(full_token);
        Item item = itemRepository.findById(item_id).orElse(null);

        if(item == null)
            throw new Exception("Item with id " + item_id + " does not exist");

        //todo : don't store twice visitation
        Visitation temp = visitationRepository.findByUser_IdAndItem_Id(user.getId(), item_id);
        if(temp != null){
            System.out.println("found visitation");
            return temp;
        }

        Visitation visitation = new Visitation();
        visitation.setItem(item);
        visitation.setUser(user);

        return visitationRepository.save(visitation);
    }

    @Transactional
    public List<BidOverview> getItemBids(String full_token, int item_id) throws Exception{

        User seller = getUserFromJWT(full_token);
        Item item = itemRepository.findById(item_id).orElse(null);
        
        if(item == null)
            throw new Exception("No item with id " + item_id + " exists");
        if(item.getUser().getId() != seller.getId())
            throw new Exception("User " + seller.getUsername() + " did not auction item with id " + item_id);

        List<Bid> bids = item.getBids();
        return bids
            .stream()
            .map(
                bid -> new BidOverview(bid)
            ).collect(Collectors.toList());
    }

    public User getWinningUser(String full_token, int item_id) throws Exception{
        
        User seller = getUserFromJWT(full_token);
        Item item = itemRepository.findById(item_id).orElse(null);
        
        if(item == null)
            throw new Exception("No item with id " + item_id + " exists");
        if(item.getUser().getId() != seller.getId())
            throw new Exception("User " + seller.getUsername() + " did not auction item with id " + item_id);

        int user_id = userRepository.winningUserId(item_id).orElse(0);
        return user_id == 0
            ? null
            : userRepository.findById(user_id).orElse(null);
    }

    @Transactional
    public ItemDTO saveItem(String full_token, ItemCreationDTO req) throws Exception{

        return new ItemDTO(
            itemRepository.save(
                req.buildItem(
                    getUserFromJWT(full_token), 
                    categoryRepository.findAllByNameIn(req.getCategories())
                )
            )
        );
    }

    public Boolean isUserWinning(String full_token, int item_id) throws Exception{

        User user = getUserFromJWT(full_token);
        return isUserWinning(user.getId(), item_id);
    }

    public User getDeal(String full_token, int deal_id) throws Exception{

        User user = getUserFromJWT(full_token);

        Deal deal = dealRepository.findById(deal_id).orElse(null);
        if(deal == null)
            throw new Exception("No deal with id " + deal_id);
        
        /*
        Do we check if user has a card on the front-end??? 
        if(isCardExpired(card.getExpiration_date()))
            throw new Exception("Card is expired");
        */

        user.setBalance(user.getBalance() + deal.getPoints());
        return userRepository.save(user);
    }

    public User cashOut(String full_token, int card_id, int amount) throws Exception{
        
        User user = getUserFromJWT(full_token);

        Card card = cardRepository.findById(card_id).orElse(null);
        if(card == null)
            throw new Exception("No card with id " + card_id);
        if(!card.getUser().getUsername().equals(user.getUsername()))
            throw new Exception("User " + user.getUsername() + " does not own card with id " + card_id);
        
        if(isCardExpired(card.getExpiration_date()))
            throw new Exception("Card is expired");

        double left = user.getBalance() - amount;
        if(left < 0)
            throw new Exception("User does not have enough points");
        
        user.setBalance(left);
        return userRepository.save(user);
    }

    public List<CardInfoDTO> getUserCards(String full_token) throws Exception{
        User user = getUserFromJWT(full_token);

        return cardRepository.findAllByUser(user)
            .stream()
            .map(
                card -> new CardInfoDTO(card)
            ).collect(Collectors.toList());
    }

    public CardInfoDTO saveCard(String full_token, CardDTO card) throws Exception{

        User user = getUserFromJWT(full_token);

        if(card.getCard_number().length() != 16)
            throw new Exception("Card number must be 16 digit number");
        
        if(card.getCvv() < 100 || card.getCvv() > 999)
            throw new Exception("CVV number must be 3 digits long");

        if(card.getExpiration_date().charAt(2) != '/' || card.getExpiration_date().length() != 5)
            throw new Exception("Expiration date must be of the format MM/YY");

        //check if card is expired
        if(isCardExpired(card.getExpiration_date()))
            throw new Exception("Card is expired");

        Card new_card = new Card();
        new_card.setCard_number(card.getCard_number());
        new_card.setCvv(card.getCvv());
        new_card.setExpiration_date(card.getExpiration_date());
        new_card.setUser(user);

        return new CardInfoDTO(
            cardRepository.save(new_card)
        );
    }

    public int seeMessage(String full_token, int message_id) throws Exception{

        User receiver = getUserFromJWT(full_token);

        Message message = messageRepository.findById(message_id).orElse(null);
        if(message == null)
            throw new Exception("No message with id " + message_id + " exists");

        if(message.getReceiver().getId() != receiver.getId())
            throw new Exception("User " + receiver.getUsername() + " is not the receiver of message  with id " + message_id);
        
        if(message.getSeen())
            throw new Exception("Message with id " + message_id + " has already been seen by its receiver");

        message.setSeen(true);
        messageRepository.save(message);

        return messageRepository.countByReceiverAndSeenFalseAndDeletedForReceiverFalse(receiver);
    }

    public int numberOfUnseenMessages(String full_token) throws Exception{

        User receiver = getUserFromJWT(full_token);

        return messageRepository.countByReceiverAndSeenFalseAndDeletedForReceiverFalse(receiver);
    }

    @Transactional
    public MessageDTO deleteUserMessage(String full_token, int message_id) throws Exception{

        Message message = messageRepository.findById(message_id).orElse(null);
        if(message == null)
            throw new Exception("No message with id " + message_id + " exists");

        User user = getUserFromJWT(full_token);
        int user_id = user.getId() ;
        int sender_id = message.getSender().getId();
        int receiver_id = message.getReceiver().getId();

        if(user_id != sender_id && user_id != receiver_id)
            throw new Exception("User " + user.getUsername() + " is neither the sender nor the receiver of this message");

        if(user_id == sender_id)
            message.setDeletedForSender(true);
        else
            message.setDeletedForReceiver(true);
        
        if(message.getDeletedForReceiver() && message.getDeletedForSender())
            messageRepository.deleteById(message_id);
        else
            messageRepository.save(message);
        
        return new MessageDTO(message);
    }

    public MessageDTO getUserMessage(String full_token, int message_id) throws Exception{
        
        Message message = messageRepository.findById(message_id).orElse(null);
        if(message == null)
            throw new Exception("No message with id " + message_id + " exists");

        User user = getUserFromJWT(full_token);
        if(user.getId() != message.getSender().getId() && user.getId() != message.getReceiver().getId())
            throw new Exception("User " + user.getUsername() + " is neither the sender nor the receiver of this message");

        return new MessageDTO(message);  
    }

    public MessageDTO composeMessage(String full_token, MessageCreationDTO req) throws Exception{

        //get sender
        User sender = getUserFromJWT(full_token);

        //get receiver
        User receiver = getUserByUN(req.getReceiver_username());
        if(receiver == null)
            throw new Exception("User with username " + req.getReceiver_username() + " does not exist");

        //compose message
        Message message = new Message();
        message.setSender(sender);
        message.setReceiver(receiver);
        message.setSubject(req.getSubject());
        message.setText(req.getText());
        message.setDate(LocalDateTime.now());

        //save message
        return new MessageDTO(
            messageRepository.save(message)
        );
    }

    public PageResponse<MessageDTO> getInbox(String full_token, int pageNumber, int pageSize) throws Exception{

        //get user requesting inbox
        User receiver = getUserFromJWT(full_token);

        Page<Message> page = messageRepository.findByReceiverAndDeletedForReceiverFalse(
            receiver, 
            getPage(pageNumber, pageSize, "Date")
        );

        return new PageResponse<MessageDTO>(
            page.getContent().stream().map(m -> new MessageDTO(m)).collect(Collectors.toList()), 
            pageNumber, 
            page.getTotalPages()
        );

    }

    public PageResponse<MessageDTO> getSent(String full_token, int pageNumber, int pageSize) throws Exception{

        //get user requesting inbox
        User sender = getUserFromJWT(full_token);

        Page<Message> page = messageRepository.findBySenderAndDeletedForSenderFalse(
            sender, 
            getPage(pageNumber, pageSize, "Date")
        );

        return new PageResponse<MessageDTO>(
            page.getContent().stream().map(m -> new MessageDTO(m)).collect(Collectors.toList()), 
            pageNumber, 
            page.getTotalPages()
        );

    }

    @Transactional
    public RatingConfirmation rateBidder(String full_token, int rating, int item_id) throws Exception{

        //get rating user
        User seller = getUserFromJWT(full_token);

        //check if user has item with item id
        Item item = itemRepository.findByUserAndId(seller, item_id).orElse(null);
        if(item == null)
            throw new Exception("User " + seller.getUsername() + " did not sell the item with id " + item_id);

        //check if item's bidder has already been rated
        if(item.getBidderRating() > 0)
            throw new Exception("Item's (" + item.getName() + ") buyer has already been rated with rating of " + item.getBidderRating());

        //check if item auction has ended
        if(item.getEnds().isAfter(LocalDateTime.now()))
            throw new Exception("Item " + item.getName() + " (id = " + item.getId() + ") has not yet ended");

        //check if rating is valid
        if(rating > 5 || rating < 1)
            throw new Exception("Rating must be integer between 1 and 5. Rating given: " + rating);

        //get user object that won the item
        User bidder = getBidder(item);

        if(bidder == null)
            throw new Exception("No user bought item " + item.getName() + " (id = " + item.getId() + ")");

        //update item bidder rating
        item.setBidderRating(rating);
        itemRepository.save(item);

        //update total rating and number of rating of bidder
        int temp = bidder.getTotalRatingsBuyer();

        bidder.setTotalRatingsBuyer(
            temp + 1
        );

        bidder.setRatingBuyer(
            ((bidder.getRatingBuyer() * temp) + rating) / (temp + 1)
        );

        //save user object
        userRepository.save(bidder);

        //return rating object
        return new RatingConfirmation(
            seller.getId(),
            bidder.getId(),
            rating
        );
    }

    @Transactional 
    public RatingConfirmation rateSeller(String full_token, int rating, int item_id) throws Exception{

        //get rating user
        User bidder = getUserFromJWT(full_token);

        //check if user bought item with item id
        Item item = itemRepository.findById(item_id).orElse(null);
        if(item == null)
            throw new Exception("Item with id " + item_id + " does not exist");

        //check if item's seller has already been rated
        if(item.getSellerRating() > 0)
            throw new Exception("Item's (" + item.getName() + ") seller has already been rated with rating of " + item.getSellerRating());

        User winner = getBidder(item);

        if(winner == null)
            throw new Exception("No one won item with id " + item.getId());

        if(getBidder(item).getId() != bidder.getId())
            throw new Exception("User " + bidder.getUsername() + " did not bought item " + item.getName());

        //check if rating is valid
        if(rating > 5 || rating < 1)
        throw new Exception("Rating must be integer between 1 and 5. Rating given: " + rating);


        //get user object that sold the item
        User seller = item.getUser();

        //update item seller rating
        item.setSellerRating(rating);
        itemRepository.save(item);

        //update total rating and number of rating of seller
        int temp = seller.getTotalRatingsSeller();

        seller.setTotalRatingsSeller(
            temp + 1
        );

        seller.setRatingSeller(
            ((bidder.getRatingSeller() * temp) + rating) / (temp + 1)
        );

        //save user object
        userRepository.save(seller);

        //return rating object
        return new RatingConfirmation(
            bidder.getId(),
            seller.getId(), 
            rating
        );
    }

    public Bid makeBid(String full_token, int amount, int item_id) throws Exception{


        //get user
        User user = getUserFromJWT(full_token);

        //check user status (only approved users can bid)
        if(!user.getStatus().equals("approved"))
            throw new Exception("User " + user.getUsername() + " is not an approved user");

        //get item
        Item item = itemRepository.findById(item_id).orElse(null);
        if(item == null)
            throw new Exception("Item with items.id = " + item_id + " does not exist");

        if(item.getFirstBid() > amount)
            throw new Exception(
                "Bid must be greater or equal to seller defined \'First Bid\'. Offer was " + 
                amount + 
                " and seller defined \'First Bid\' is "  + 
                item.getFirstBid()
            );

        return makeBid(user, amount, item); //make the bid
    }

    public Bid buyNow(String full_token, int item_id) throws Exception{

        //get user
        User user = getUserFromJWT(full_token);

        //check user status (only approved users can bid)
        if(!user.getStatus().equals("approved"))
            throw new Exception("User " + user.getUsername() + " is not an approved user");

        //get item
        Item item = itemRepository.findById(item_id).orElse(null);
        if(item == null)
            throw new Exception("Item with items.id = " + item_id + " does not exist");

        return makeBid(user, item.getBuyPrice(), item); //make the bid
    }

    public ItemDTO deleteItem(String full_token, int item_id) throws Exception{

        //get user
        User user = getUserFromJWT(full_token);

        //get item
        Item item = itemRepository.findById(item_id).orElse(null);
        if(item == null)
            throw new Exception("Item with items.id = " + item_id + " does not exist");

        //check if user posted item
        if(!user.getUsername().equals(item.getUser().getUsername()))
            throw new Exception("User " + user.getUsername() + " did not post item " + item.getName());

        //check if item's auction hasn't yet started
        Boolean isLive = true;
        try {
            itemIsLive(item);
        } catch (Exception e) {
            isLive = false;
            if(item.getEnds().isBefore(LocalDateTime.now()))
                throw new Exception("Cannot delete an item that its auction has ended");   
        }
        if(isLive)    
            throw new Exception("Cannot delete an item that is in a live auction");
        

        //delete item
        itemRepository.delete(item);

        //return item
        return new ItemDTO(item);
    }

    public List<User> getAllUsers() {
        return (List<User>) userRepository.findAll();
    }
    
    public User deleteUser(int id) throws Exception{
        User user = null;

        try{
            user = userRepository.findById(id).orElse(null);
            
            if(user==null){
                throw new Exception("user not available");
            }
            else{
                userRepository.deleteById(id);
            }
        }
        catch(Exception e){
            throw e;
        }
        return user;
    }
    
    public User createOrUpdateUser(User user) {
        return userRepository.save(user);
    }

    public Pair<User, String> quickLogin(String token) throws BadCredentialsException{

        User user = getUserByUN(jwtUtil.getUsernameFromToken(token));

        if(user == null)
            throw new BadCredentialsException("no user with credential specified by given token");     
        if(jwtUtil.validateToken(token, user) == false)
            throw new BadCredentialsException("Token not valid");

        return Pair.of(user, token);
    }
    
    public Pair<User, String> login(String username, String password) throws BadCredentialsException{
        Authentication authenticate = authenticationManager
                .authenticate(
                    new UsernamePasswordAuthenticationToken(
                        username, password
                    )
                );

            User user = (User) authenticate.getPrincipal();
            String token = jwtUtil.generateToken(user);

            return Pair.of(user, token);     
    }
    
    @Transactional
    public Pair<User, String> signup(UserCreation req) throws Exception{

        Authority authority = authorityService.getAuthority("ROLE_USER");

        if(getUserByUN(req.getUsername()) != null)
            throw new Exception("username already exists");

        User user = new User();
        user.setAuthority(authority);
        user.setUsername(req.getUsername());
        user.setPassword(encoder.getPasswordEncoder().encode(req.getPassword()));
        user.setName(req.getName());
        user.setSurname(req.getLastname());
        user.setAddress(req.getAddress());
        user.setLatitude(req.getLatitude());
        user.setLongitude(req.getLongitude());
        user.setEmail(req.getEmail());
        user.setPhone(req.getPhone());
        user.setAfm(req.getAfm());
        user.setBalance(0.0);
        user.setRatingSeller(0);
        user.setTotalRatingsSeller(0);
        user.setRatingBuyer(0);
        user.setTotalRatingsBuyer(0);
        user.setStatus("waiting");

        createOrUpdateUser(user);

        String token = jwtUtil.generateToken(user);
        return Pair.of(user, token);
    }

    public User getUserById(int id) {
        return userRepository.findById(id).orElse(null);
    }
    
    public User getUserByUN(String username){
        return userRepository.findByUsername(username).orElse(null);
    }

    public UserStats getUserStatsFromJWT(String full_token) throws Exception{
        User user;
        try {
            user = getUserFromJWT(full_token);
        } catch (Exception e) {
            throw e;
        } 
        UserStats stats = new UserStats();
        int id = user.getId();

        stats.setAverage_buyer_rating(user.getRatingBuyer());
        stats.setAverage_seller_rating(user.getRatingSeller());
        stats.setTotal_auctions_participating(getTotalAuctionsUserIsParticipating(id));
        stats.setTotal_auctions_winning(getTotalAuctionsUserIsWinning(id));
        stats.setTotal_unread_messages(getTotalUserUnreadMessages(id));

        return stats;
    }

    public String getUserStatus(String full_token) throws Exception{
        return getUserFromJWT(full_token).getStatus();
    }

    public PageResponse<BidInfo> getCompletedBids(String full_token, int pageNumber, int pageSize) throws Exception{

        User user = getUserFromJWT(full_token);
        List<Integer> ids = bidRepository.getCompletedBidsIds(
            user.getId(),
            LocalDateTime.now(),
            pageSize * (pageNumber - 1),
            pageSize
        );

        int total_pages = numberOfPages(
            pageSize, 
            bidRepository.countCompletedBids(
                user.getId(),
                LocalDateTime.now()
            ) 
        );

        List<BidInfo> itemOverviews =  ids.stream().map(
            id -> new BidInfo(
                itemRepository.findById(id).orElse(null),
                isUserWinning(user.getId(), id)
            )
        ).collect(Collectors.toList());

        return new PageResponse<BidInfo>(itemOverviews, pageNumber, total_pages);
    }

    public PageResponse<BidInfo> getOngoingBids(String full_token, int pageNumber, int pageSize) throws Exception{

        User user = getUserFromJWT(full_token);

        List<Integer> ids =  bidRepository.getOngoingBidsIds(
            user.getId(),
            LocalDateTime.now(),
            pageSize * (pageNumber - 1),
            pageSize
        );

        int total_pages = numberOfPages(
            pageSize, 
            bidRepository.countOngoingBids(
                user.getId(),
                LocalDateTime.now()
            ) 
        );

        List<BidInfo> itemOverviews =  ids.stream().map(
            id -> new BidInfo(
                itemRepository.findById(id).orElse(null),
                isUserWinning(user.getId(), id)
            )
        ).collect(Collectors.toList());

        return new PageResponse<BidInfo>(itemOverviews, pageNumber, total_pages);

    }

    public PageResponse<ItemInfo> getCompletedItems(String full_token, int pageNumber, int pageSize) throws Exception{
        User user = getUserFromJWT(full_token);
        List<Integer> ids = itemRepository.getCompletedItemsIds(
            user.getId(),
            LocalDateTime.now(),
            pageSize * (pageNumber - 1),
            pageSize
        );

        int total_pages = numberOfPages(
            pageSize, 
            itemRepository.countCompletedItems(
                user.getId(),
                LocalDateTime.now()
            ) 
        );

        List<ItemInfo> itemInfos =  ids.stream().map(
            id -> new ItemInfo(
                itemRepository.findById(id).orElse(null),
                getAuctionEnding(id)
            )
        ).collect(Collectors.toList());

        return new PageResponse<ItemInfo>(itemInfos, pageNumber, total_pages);
    }

    public PageResponse<ItemInfo> getOngoingItems(String full_token, int pageNumber, int pageSize) throws Exception{
        User user = getUserFromJWT(full_token);
        List<Integer> ids = itemRepository.getOngoingItemsIds(
            user.getId(),
            LocalDateTime.now(),
            pageSize * (pageNumber - 1),
            pageSize
        );

        int total_pages = numberOfPages(
            pageSize, 
            itemRepository.countOngoingItems(
                user.getId(),
                LocalDateTime.now()
            ) 
        );

        List<ItemInfo> itemInfos =  ids.stream().map(
            id -> new ItemInfo(
                itemRepository.findById(id).orElse(null),
                getAuctionEnding(id)
            )
        ).collect(Collectors.toList());

        return new PageResponse<ItemInfo>(itemInfos, pageNumber, total_pages);
    }

    private User getBidder(Item item){
        if(itemRepository.countBids(item.getId()) == 0)
            return null;

        int user_id = itemRepository.getUserWon(item.getId());
        return userRepository.findById(user_id).orElse(null);
    }

    private int getAuctionEnding(int id){
        if(itemRepository.countBids(id) == 0) return 2;
        if(itemRepository.isBoughtNow(id) == 1) return 1;
        return 0;
    }

    private int getTotalAuctionsUserIsWinning(int id){
        return userRepository.getTotalAuctionsUserIsWinning(id, LocalDate.now());
    }

    private int getTotalAuctionsUserIsParticipating(int id){
        return userRepository.getTotalAuctionsUserIsParticipating(id, LocalDate.now());
    }

    private int getTotalUserUnreadMessages(int id){
        return userRepository.getUserUnreadMessages(id);
    }

    private  User getUserFromJWT(String full_token) throws Exception{

        String token = full_token.split(" ")[1];
        String username = jwtUtil.getUsernameFromToken(token);
        User user = getUserByUN(username);

        if(user == null)throw new Exception("No user with username " + username);
        return user;
    }

    private Boolean itemIsLive(Item item) throws Exception{

        int item_id = item.getId();

        //check if item hasn't been bought already
        if(item.getCurrently() == item.getBuyPrice())
            throw new Exception("Item with items.id = " +  item_id + " has already been bought");

        //check if item auction is live
        if(item.getStarts().isAfter(LocalDateTime.now()))
            throw new Exception(
                "Item auction hasn't yet started."
                + "Item starts at: " + item.getStarts()
                + ". Current date and time: " + LocalDateTime.now()
            );

        if(LocalDateTime.now().isAfter(item.getEnds()))
            throw new Exception(
                "Item auction has ended."
                + "Item ended at: " + item.getEnds()
                + ". Current date and time: " + LocalDateTime.now()
            );

        return true;
    }

    private Pageable getPage(int pageNumber, int pageSize){
        return PageRequest.of(pageNumber - 1, pageSize);
    }

    private int numberOfPages(int pageSize, double totalItems){
        return  (int)Math.ceil(totalItems / pageSize);
    }

    private Pageable getPage(int pageNumber, int pageSize, String property){
        return PageRequest.of(pageNumber - 1, pageSize, Sort.by(property).descending());
    }

    private Boolean isUserWinning(int user_id, int item_id){
        return (userRepository.areYaWinningSon(user_id, item_id) > 0);
    }

    private Boolean isCardExpired(String expirationDate){

        int nowYear = LocalDate.now().getYear() - 2000;
        int nowMonth = LocalDate.now().getMonthValue();
        int cardYear = Integer.parseInt(expirationDate.split("/")[1]);
        int cardMonth = Integer.parseInt(expirationDate.split("/")[0]);

        Boolean res = ((cardYear < nowYear) || ( (cardYear == nowYear) && (cardMonth < nowMonth) ));
        return res;
    }

    @Transactional
    private Bid makeBid(User user, int amount, Item item) throws Exception{

        Boolean buy_now = false;

        //check if bid is more than the current one
        if(amount <= item.getCurrently())
            throw new Exception("New bid must be higher than the current one. New bid: " + amount + ". Current bid: " + item.getCurrently());


        //if bid more or equal to buy now price, buy the item
        if(amount >= item.getBuyPrice()){
            buy_now = true;
            amount = item.getBuyPrice();
        }

        //check if user has enough
        if(user.getBalance() < amount)
            throw new Exception(
                "User does not hava enough money to make bid. User balance: " + user.getBalance() 
                + ". Bid amount: " + amount
            );

        itemIsLive(item);   //check if item is live

        //make purchase
        user.setBalance(user.getBalance() - amount);    //decrease user balance
        userRepository.save(user);

        item.setCurrently(amount);  //update current bid for item
        item.setNumberOfBids(item.getNumberOfBids() + 1);   //update number of bids for item
        itemRepository.save(item);

        Bid bid = new Bid();                    //make bid
        double am = amount;
        bid.setAmount(am);
        bid.setUser(user);
        bid.setItem(item);
        bid.setTime(LocalDateTime.now());
        bid.setBuyNow(buy_now);
        bidRepository.save(bid);

        return bid;
    }
}
