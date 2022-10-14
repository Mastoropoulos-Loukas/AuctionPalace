package com.auctionpalace.api.repositories;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.auctionpalace.api.entities.Authority;

@Repository
public interface AuthorityRepository extends JpaRepository<Authority, Integer>{
    
    Optional<Authority> findByAuthority(String authority);
}
