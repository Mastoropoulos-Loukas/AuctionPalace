package com.auctionpalace.api.dto;

import com.auctionpalace.api.entities.User;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data @AllArgsConstructor @NoArgsConstructor
public class UserOverview {
    private int id;
    private String username;
    private String email;
    private String afm;
    private String phone;
    private Double balance;

    public UserOverview(User user){
        this.id = user.getId();
        this.username = user.getUsername();
        this.email = user.getEmail();
        this.afm = user.getAfm();
        this.phone = user.getPhone();
        this.balance = user.getBalance();
    }
}
