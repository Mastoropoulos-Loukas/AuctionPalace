package com.auctionpalace.api.services;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.auctionpalace.api.entities.Authority;
import com.auctionpalace.api.repositories.AuthorityRepository;

@Service
public class AuthorityService {
    
    @Autowired private AuthorityRepository authorityRepository;

    public List<Authority> getAuthorities(){
        return authorityRepository.findAll();
    }

    public Authority getAuthority(String role){
        return authorityRepository.findByAuthority(role).orElse(null);
    }
}
