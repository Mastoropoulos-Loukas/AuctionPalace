package com.auctionpalace.api.repositories;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.auctionpalace.api.entities.Bid;

@Repository
public interface BidRepository extends JpaRepository<Bid, Integer>{
    
    @Query(
        value = "SELECT * FROM bids b WHERE b.users_id = ?1 AND b.item_id = ?2 AND b.buy_now = 1",
        nativeQuery = true
    )
    public List<Bid> getBuyNow(int user_id, int item_id);

    @Query(
        value = "SELECT * FROM bids b WHERE b.users_id = ?1 AND b.item_id = ?2 AND b.buy_now = 0",
        nativeQuery = true
    )
    public List<Bid> getBids(int user_id, int item_id);

    @Query(
        value = "select distinct i.id from bids b, items i where i.id = b.item_id and b.users_id = ?1 and (i.ends < ?2 or i.currently = i.buy_price) limit ?3, ?4",
        nativeQuery = true    
    )
    public List<Integer> getCompletedBidsIds(int user_id, LocalDateTime now, int pageStart, int pageSize);

    @Query(
        value = "select count(distinct i.id) from bids b, items i where i.id = b.item_id and b.users_id = ?1 and (i.ends < ?2 or i.currently = i.buy_price)",
        nativeQuery = true    
    )
    public int countCompletedBids(int user_id, LocalDateTime now);

    @Query(
        value = "select distinct i.id from bids b, items i where i.id = b.item_id and b.users_id = ?1 and i.ends > ?2 and i.currently < i.buy_price limit ?3, ?4",
        nativeQuery = true    
    )
    public List<Integer> getOngoingBidsIds(int user_id, LocalDateTime now, int pageStart, int pageSize);

    @Query(
        value = "select count(distinct i.id) from bids b, items i where i.id = b.item_id and b.users_id = ?1 and i.ends > ?2 and i.currently < i.buy_price",
        nativeQuery = true    
    )
    public int countOngoingBids(int user_id, LocalDateTime now);
}
