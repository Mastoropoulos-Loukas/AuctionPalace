package com.auctionpalace.api.repositories;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;

import com.auctionpalace.api.entities.V;

public interface VRepository extends CrudRepository<V, Integer>{
    
    @Query(
        value = "SELECT value FROM v WHERE users_id = ?1 ORDER BY col ASC",
        nativeQuery = true
    )
    public double[] getUserRow(int user_id);

    @Query(
        value = "SELECT count(*) FROM v WHERE users_id = ?1",
        nativeQuery = true
    )
    public int countRowElements(int user_id);
}
