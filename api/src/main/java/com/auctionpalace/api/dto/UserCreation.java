package com.auctionpalace.api.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data @AllArgsConstructor @NoArgsConstructor
public class UserCreation {
    String username;
    String password;
    String email;
    String name;
    String lastname;
    String afm;
    String address;
    Double latitude;
    Double longitude;
    String phone;
}
