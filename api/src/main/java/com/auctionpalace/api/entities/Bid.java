package com.auctionpalace.api.entities;

import java.time.LocalDate;
import java.time.LocalDateTime;

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

@Entity @Table(name = "bids")
@Data @AllArgsConstructor @NoArgsConstructor
public class Bid {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @ManyToOne
    @JoinColumn(
        name = "item_id",
        referencedColumnName = "id",
        nullable = false
    )
    private Item item;

    @ManyToOne
    @JoinColumn(
        name = "users_id",
        referencedColumnName = "id",
        nullable = false
    )
    private User user;

    private LocalDateTime time;
    private Double amount;
    private Boolean buyNow;
}
