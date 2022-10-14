package com.auctionpalace.api.repositories;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;

import com.auctionpalace.api.entities.F;


public interface FRepository extends CrudRepository<F, Integer>{
    
    @Query(
        value = "SELECT DISTINCT items_id FROM f WHERE items_id IN (SELECT i.id FROM items i WHERE i.starts < ?1 AND i.ends > ?1 AND i.currently < i.buy_price) ORDER BY items_id ASC",
        nativeQuery = true
    )
    public ArrayList<Integer> getLiveItemIds(LocalDateTime now);

    @Query(
        value = "SELECT * FROM f WHERE items_id IN (SELECT i.id FROM items i WHERE i.starts < ?1 AND i.ends > ?1 AND i.currently < i.buy_price)",
        nativeQuery = true
    )
    public List<F> findAllLive(LocalDateTime now);
}
