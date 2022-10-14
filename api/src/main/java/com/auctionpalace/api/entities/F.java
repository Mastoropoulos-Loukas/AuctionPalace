package com.auctionpalace.api.entities;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;

@Entity
@AllArgsConstructor @NoArgsConstructor @Data
public class F {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;
    
    private int row_num;
    
    @ManyToOne
    @JoinColumn(
        name = "items_id",
        referencedColumnName = "id",
        nullable = false
    )
    private Item item;

    private double value;

    public String myString(){
        return "(" + this.id + ", "
            + this.row_num + ", "
            + this.item.getId() + ", "
            + this.value + ")";
    }
}
