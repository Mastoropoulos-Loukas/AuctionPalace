package com.auctionpalace.api.dto;

import com.auctionpalace.api.entities.F;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor @NoArgsConstructor @Data
public class FDTO {

    private int id;
    private double value;
    private int items_id;
    private int row_num;

    public FDTO(F f){
        this.id = f.getId();
        this.value = f.getValue();
        this.items_id = f.getItem().getId();
        this.row_num = f.getRow_num();
    }
    
}
