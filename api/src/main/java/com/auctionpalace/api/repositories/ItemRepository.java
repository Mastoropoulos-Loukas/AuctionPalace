package com.auctionpalace.api.repositories;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.auctionpalace.api.entities.Item;
import com.auctionpalace.api.entities.User;

@Repository
public interface ItemRepository extends JpaRepository<Item, Integer>{
    Page<Item> findAllByUserAndEndsBefore(User user, LocalDateTime now, Pageable page);
    Page<Item> findAllByUserAndEndsAfter(User user, LocalDateTime now, Pageable page);

    @Query(
        value = "select id from items order by id asc",
        nativeQuery =  true
    )
    public ArrayList<Integer> findAllIds();

    @Query(
        value = "select count(distinct(id)) from items where id in (select i.id from items i, item_has_category t, categories c where i.id = t.item_id and t.category_id = c.id and c.name in ?1 and i.currently <= ?2 and i.first_bid <= ?2 and (i.name like ?3 or description like ?3) and i.currently < i.buy_price and location like ?4) limit ?5, ?6",
        nativeQuery = true
    )
    public int searchItemsCount(List<String> categories, int max_price, String text, String location, int page_base, int page_size);

    @Query(
        value = "select count(distinct(id)) from items where id in (select i.id from items i, item_has_category t, categories c where i.id = t.item_id and t.category_id = c.id and c.name in ?1 and i.currently <= ?2 and i.first_bid <= ?2 and (i.name like ?3 or description like ?3) and i.currently < i.buy_price and location like ?4 and i.starts < ?5 and i.ends > ?5) limit ?6, ?7",
        nativeQuery = true
    )
    public int searchItemsCount(List<String> categories, int max_price, String text, String location, LocalDateTime now, int page_base, int page_size);
    
    @Query(
        value = "select * from items where id in (select i.id from items i, item_has_category t, categories c where i.id = t.item_id and t.category_id = c.id and c.name in ?1 and i.currently <= ?2 and i.first_bid <= ?2 and (i.name like ?3 or description like ?3) and i.currently < i.buy_price and location like ?4 and i.currently < i.buy_price) limit ?5, ?6",
        nativeQuery = true
    )
    public List<Item> searchItems(List<String> categories, int max_price, String text, String location, int page_base, int page_size);

    @Query(
        value = "select * from items where id in (select i.id from items i, item_has_category t, categories c where i.id = t.item_id and t.category_id = c.id and c.name in ?1 and i.currently <= ?2 and i.first_bid <= ?2 and (i.name like ?3 or description like ?3) and i.currently < i.buy_price and location like ?4 and i.starts < ?5 and i.ends > ?5 and i.currently < i.buy_price) limit ?6, ?7",
        nativeQuery = true
    )
    public List<Item> searchItems(List<String> categories, int max_price, String text, String location, LocalDateTime now, int page_base, int page_size);

    @Query(
        value = "select distinct i.id from items i where i.users_id = ?1 and (i.ends < ?2 or i.currently = i.buy_price) limit ?3, ?4",
        nativeQuery = true    
    )
    public List<Integer> getCompletedItemsIds(int user_id, LocalDateTime now, int pageStart, int pageSize);

    @Query(
        value = "select count(distinct i.id) from items i where i.users_id = ?1 and (i.ends < ?2 or i.currently = i.buy_price)",
        nativeQuery = true    
    )
    public int countCompletedItems(int user_id, LocalDateTime now);

    @Query(
        value = "select distinct i.id from items i where i.users_id = ?1 and i.ends > ?2 and i.currently < i.buy_price limit ?3, ?4",
        nativeQuery = true    
    )
    public List<Integer> getOngoingItemsIds(int user_id, LocalDateTime now, int pageStart, int pageSize);

    @Query(
        value = "select count(distinct i.id) from items i where i.users_id = ?1 and i.ends > ?2 and i.currently < i.buy_price",
        nativeQuery = true    
    )
    public int countOngoingItems(int user_id, LocalDateTime now);

    @Query(
        value = "select count(*) from bids b, items i where b.item_id = i.id and i.id = ?1 and b.buy_now = 1",
        nativeQuery = true
    )
    public int isBoughtNow(int item_id);

    @Query(
        value = "select count(*) from bids b, items i where b.item_id = i.id and i.id = ?1",
        nativeQuery = true
    )
    public int countBids(int item_id);

    public Optional<Item> findByUserAndId(User user, int id);

    @Query(
        value = "select b.users_id from bids b, items i where b.item_id = i.id and i.id = ?1 order by b.time desc limit 1",
        nativeQuery = true
    )
    public int getUserWon(int item_id);

}
