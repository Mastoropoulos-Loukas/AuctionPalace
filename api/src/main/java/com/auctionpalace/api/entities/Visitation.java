package com.auctionpalace.api.entities;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@AllArgsConstructor @NoArgsConstructor @Data
public class Visitation {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
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
}
