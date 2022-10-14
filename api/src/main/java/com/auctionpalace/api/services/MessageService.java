package com.auctionpalace.api.services;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.auctionpalace.api.entities.Message;
import com.auctionpalace.api.repositories.MessageRepository;
import com.auctionpalace.api.repositories.UserRepository;

@Service
public class MessageService {
    @Autowired MessageRepository messageRepo;
    @Autowired UserRepository userRepo;

    
    public List<Message> getAll() {
        return messageRepo.findAll();
    }

    public List<Message> getReceived(int receiver_id) {
        return messageRepo.findAllByReceiverId(receiver_id);
    }
    
    public List<Message> getSent(int sender_id) {
        return messageRepo.findAllBySenderId(sender_id);
    }
    
    public Message createOrUpdateMessage(Message message) {
        return messageRepo.save(message);
    }
    
    public Message getById(int id) {
        return messageRepo.findById(id).orElse(null);
    }
    
    public Message deleteById(int id){
        Message message = null;

        try{
            message = messageRepo.findById(id).orElse(null);
            
            if(message==null){
                throw new Exception("message not available");
            }
            else{
                messageRepo.deleteById(id);
            }
        }
        catch(Exception e){
            System.out.println(e.getMessage());
        }
        return message;
    }
}
