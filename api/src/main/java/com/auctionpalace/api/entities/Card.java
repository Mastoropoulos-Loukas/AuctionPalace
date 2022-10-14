package com.auctionpalace.api.entities;

import javax.persistence.CascadeType;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "cards")
public class Card {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;
    private String card_number;
    private int cvv;
    private String expiration_date;
    
    @ManyToOne(
        cascade = CascadeType.MERGE,
        fetch = FetchType.EAGER,
        optional = false
    )
    @JoinColumn(
        name = "user_id",
        referencedColumnName = "id"
    )
    private User user;
}
