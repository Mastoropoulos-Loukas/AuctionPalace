package com.auctionpalace.api.controllers;

import java.util.List;

import com.auctionpalace.api.entities.Message;
import com.auctionpalace.api.services.MessageService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/messages")
public class MessageController {
    
    @Autowired MessageService messageService;

    @GetMapping("")
    public ResponseEntity<List<Message>> readAll(){
        return new ResponseEntity<List<Message>> (messageService.getAll(), HttpStatus.OK);
    }

    @GetMapping("/received/{receiver_id}")
    public ResponseEntity<List<Message>> getReceivedMessages (@PathVariable int receiver_id){
        return new ResponseEntity<List<Message>> (messageService.getReceived(receiver_id), HttpStatus.OK);
    }

    @GetMapping("/sent/{sender_id}")
    public ResponseEntity<List<Message>> getSentMessages (@PathVariable int sender_id){
        return new ResponseEntity<List<Message>> (messageService.getSent(sender_id), HttpStatus.OK);
    }

    @PostMapping("")
    public ResponseEntity<Message> createNewMessage(@RequestBody Message message){
        return new ResponseEntity<Message>(messageService.createOrUpdateMessage(message), HttpStatus.OK);
    }

    @PostMapping("/{message_id}/seen")
    public ResponseEntity<Message> messageSeen(@PathVariable int message_id) {
        Message message = messageService.getById(message_id);
        message.setSeen(true);

        return new ResponseEntity<Message>(messageService.createOrUpdateMessage(message), HttpStatus.OK);
    }

    @PostMapping("/{message_id}/deleted_by_sender")
    public ResponseEntity<Message> messageDeletedBySender(@PathVariable int message_id) {
        Message message = messageService.getById(message_id);

        if(message.getDeletedForReceiver())
            return new ResponseEntity<Message>(messageService.deleteById(message_id), HttpStatus.OK);
        else{
            message.setDeletedForSender(true);
            return new ResponseEntity<Message>(messageService.createOrUpdateMessage(message), HttpStatus.OK);
        }
    }

    @PostMapping("/{message_id}/deleted_by_receiver")
    public ResponseEntity<Message> messageDeletedByReceiver(@PathVariable int message_id) {
        Message message = messageService.getById(message_id);

        if(message.getDeletedForSender())
            return new ResponseEntity<Message>(messageService.deleteById(message_id), HttpStatus.OK);
        else{
            message.setDeletedForReceiver(true);
            return new ResponseEntity<Message>(messageService.createOrUpdateMessage(message), HttpStatus.OK);
        }
    }
    
}
