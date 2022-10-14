package com.auctionpalace.api.dto;

import java.time.LocalDateTime;

import com.auctionpalace.api.entities.Message;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data @AllArgsConstructor @NoArgsConstructor
public class MessageDTO {
    private int message_id;
    private String sender_username;
    private String receiver_username;
    private LocalDateTime date;
    private String subject;
    private String text;
    private Boolean seen;

    public MessageDTO(Message message){
        this.message_id = message.getId();
        this.sender_username = message.getSender().getUsername();
        this.receiver_username = message.getReceiver().getUsername();
        this.date = message.getDate();
        this.subject = message.getSubject();
        this.text = message.getText();
        this.seen = message.getSeen();
    }
}
