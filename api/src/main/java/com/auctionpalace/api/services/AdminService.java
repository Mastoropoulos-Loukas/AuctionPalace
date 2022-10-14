package com.auctionpalace.api.services;

import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import com.auctionpalace.api.dto.ItemOverview;
import com.auctionpalace.api.dto.PageResponse;
import com.auctionpalace.api.dto.UserOverview;
import com.auctionpalace.api.entities.Item;
import com.auctionpalace.api.entities.User;
import com.auctionpalace.api.repositories.ItemRepository;
import com.auctionpalace.api.repositories.UserRepository;
import com.auctionpalace.api.utils.JwtUtil;

@Service
public class AdminService {

    @Autowired private JwtUtil jwtUtil;
    @Autowired private UserRepository userRepository;
    @Autowired private ItemRepository itemRepository;

    public Item getItem(String full_token, int item_id) throws Exception{

        getAdminFromJWT(full_token);

        Item item = itemRepository.findById(item_id).orElse(null);
        if(item == null)
            throw new Exception("No item with id " + item_id);

        return item;
    }

    public PageResponse<ItemOverview> getItems(String full_token, int pageNumber, int pageSize) throws Exception{
        getAdminFromJWT(full_token);

        Page<Item> page = itemRepository.findAll(
            PageRequest.of(pageNumber - 1, pageSize, Sort.by("Ends").descending())
        );

        return new PageResponse<ItemOverview>(
            page.getContent()
                .stream()
                .map(
                    item -> new ItemOverview(item)
                ).collect(Collectors.toList()), 
            pageNumber, 
            page.getTotalPages()
        );
    }

    public PageResponse<UserOverview> getWaitingUsers(String full_token, int pageNumber, int pageSize) throws Exception{
        getAdminFromJWT(full_token);

        Page<User> page = userRepository.findAllByStatus("waiting", getPage(pageNumber, pageSize));

        return new PageResponse<UserOverview>(
            page.getContent()
                .stream()
                .map(
                    user -> new UserOverview(user)
                ).collect(Collectors.toList()), 
            pageNumber, 
            page.getTotalPages()
        );
    }

    public User approveUser(String full_token, int user_id) throws Exception{

        getAdminFromJWT(full_token);

        User user = userRepository.findById(user_id).orElse(null);
        if(user == null)
            throw new Exception("User with id " + user_id + " does not exist");
        if(user.getStatus().equals("approved"))
            throw new Exception("User with id " + user_id + " is already approved");
        if(user.getStatus().equals("admin"))
            throw new Exception("User with id " + user_id + " is admin");
        

        user.setStatus("approved");
        return userRepository.save(user);
    }

    public User blockUser(String full_token, int user_id) throws Exception{

        getAdminFromJWT(full_token);

        User user = userRepository.findById(user_id).orElse(null);
        if(user == null)
            throw new Exception("User with id " + user_id + " does not exist");
        if(user.getStatus().equals("blocked"))
            throw new Exception("User with id " + user_id + " is already blocked");
        if(user.getStatus().equals("admin"))
            throw new Exception("User with id " + user_id + " is admin");

        user.setStatus("blocked");
        return userRepository.save(user);
    }

    public User getUser(String full_token, int user_id) throws Exception{

        getAdminFromJWT(full_token);

        User user = userRepository.findById(user_id).orElse(null);
        if(user == null)
            throw new Exception("User with id " + user_id + " does not exist");

        return user;
    }
    
    public PageResponse<UserOverview> getUsers(String full_token, int pageNumber, int pageSize) throws Exception{

        getAdminFromJWT(full_token);

        Page<User> page = userRepository.findAllByStatus(
            "approved", 
            getPage(pageNumber, pageSize)
        );

        return new PageResponse<UserOverview>(
            page.getContent()
                .stream()
                .map(
                    user -> new UserOverview(user)
                ).collect(Collectors.toList()), 
            pageNumber, 
            page.getTotalPages()
        );
    }

    private Pageable getPage(int pageNumber, int pageSize){
        return PageRequest.of(pageNumber - 1, pageSize);
    }

    private User getAdminFromJWT(String full_token) throws Exception{

        String token = full_token.split(" ")[1];
        String username = jwtUtil.getUsernameFromToken(token);
        User user = userRepository.findByUsername(username).orElse(null);

        if(user == null)throw new Exception("No user with username " + username);
        if(!user.getStatus().equals("admin"))
            throw new Exception("User " + username + " is not the admin");
        return user;
    }
}
