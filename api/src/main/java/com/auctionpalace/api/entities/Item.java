package com.auctionpalace.api.entities;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import javax.persistence.CascadeType;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.JoinTable;
import javax.persistence.ManyToMany;
import javax.persistence.ManyToOne;
import javax.persistence.OneToMany;
import javax.persistence.Table;

import com.fasterxml.jackson.annotation.JsonIgnore;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity @Table(name = "items")
@Data @AllArgsConstructor @NoArgsConstructor
public class Item {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @ManyToOne
    @JoinColumn(
        name = "users_id",
        referencedColumnName = "id",
        nullable = false
    )
    private User user;
    private String name;

    @ManyToMany(
        cascade = CascadeType.PERSIST,
        fetch = FetchType.EAGER
    )
    @JoinTable(
        name = "item_has_category",
        joinColumns = @JoinColumn(name = "item_id"), 
        inverseJoinColumns = @JoinColumn(name = "category_id")
    )
    private List<Category> categories;

    private int currently;
    private int buyPrice;
    private int firstBid;
    private int numberOfBids;

    private LocalDateTime starts;
    private LocalDateTime ends;
    private String description;

    private int sellerRating = 0;
    private int bidderRating = 0;

    private String location;
    private Double latitude;
    private Double longitude;
    private String country;

    @OneToMany(mappedBy = "item", fetch = FetchType.LAZY)
    @JsonIgnore
    private List<Bid> bids;
}
