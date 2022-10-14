package com.auctionpalace.api.repositories;

import java.util.List;

import com.auctionpalace.api.entities.Message;
import com.auctionpalace.api.entities.User;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface MessageRepository extends JpaRepository<Message, Integer>{
    public List<Message> findAllByReceiverId(int receiver_id);
    public List<Message> findAllBySenderId(int sender_id);

    public Page<Message> findBySenderAndDeletedForSenderFalse(User sender, Pageable pageable);
    public Page<Message> findByReceiverAndDeletedForReceiverFalse(User receiver, Pageable pageable);
    
    public int countByReceiverAndSeenFalseAndDeletedForReceiverFalse(User receiver);
}
