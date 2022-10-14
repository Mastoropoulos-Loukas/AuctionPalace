package com.auctionpalace.api.entities;

import java.time.LocalDateTime;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "messages")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Message {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @ManyToOne()
    @JoinColumn(
        name = "sender_id",
        referencedColumnName = "id",
        nullable = false
    )
    private User sender;
    
    @ManyToOne()
    @JoinColumn(
        name = "receiver_id",
        referencedColumnName = "id",
        nullable = false
    )
    private User receiver;

    private String subject;
    private String text;
    private Boolean seen = false;
    private Boolean deletedForReceiver = false;
    private Boolean deletedForSender = false;

    @Column(name = "date", columnDefinition = "TIMESTAMP")
    private LocalDateTime date;


}
