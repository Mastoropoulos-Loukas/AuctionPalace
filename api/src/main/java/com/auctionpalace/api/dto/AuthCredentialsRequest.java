package com.auctionpalace.api.dto;

import lombok.Data;

@Data
public class AuthCredentialsRequest {
    
    private String username;
    private String password;
}
