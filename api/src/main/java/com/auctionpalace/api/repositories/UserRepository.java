package com.auctionpalace.api.repositories;


import com.auctionpalace.api.entities.User;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserRepository extends CrudRepository<User, Integer>{
    public Optional<User> findByUsername(String username);

    @Query(
        value = "select id from users order by id asc",
        nativeQuery =  true
    )
    public ArrayList<Integer> findUserIds();

    @Query(
        value = "select  count(*) from users u, messages m where m.receiver_id = u.id and u.id = ?1 and m.seen = 0 and m.deleted_for_receiver = 0",
        nativeQuery = true
    )
    public int getUserUnreadMessages(int id);

    @Query(
        value = "select  count(distinct(i.id)) from users u, items i, bids b where b.item_id = i.id and b.users_id = u.id and u.id = ?1 and i.ends >= ?2 and i.currently != i.buy_price",
        nativeQuery = true
    )
    public int getTotalAuctionsUserIsParticipating(int id, LocalDate date);

    @Query(
        value = "select  count(*) from users u, items i, bids b where b.item_id = i.id and b.users_id = u.id and u.id = ?1 and i.ends >= ?2 and b.amount = i.currently and b.buy_now = 0",
        nativeQuery = true
    )
    public int getTotalAuctionsUserIsWinning(int id, LocalDate date);


    @Query(
        value = "select count(*) from bids b, items i where b.item_id = i.id and b.amount = i.currently and b.users_id = ?1 and i.id = ?2",
        nativeQuery = true
    )
    public int areYaWinningSon(int user_id, int item_id);

    @Query(
        value = "select b.users_id from bids b, items i where b.item_id = i.id and b.amount = i.currently and i.id = ?1",
        nativeQuery = true
    )
    public Optional<Integer> winningUserId(int item_id); 

    public Page<User> findAllByStatus(String status, Pageable page);

}
