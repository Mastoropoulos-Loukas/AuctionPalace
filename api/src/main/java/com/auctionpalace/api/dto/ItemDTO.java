package com.auctionpalace.api.dto;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

import com.auctionpalace.api.entities.Item;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data @AllArgsConstructor @NoArgsConstructor
public class ItemDTO {

    private int id;
    private String name;
    private List<String> categories;
    private LocalDateTime starts;
    private LocalDateTime ends;
    
    public ItemDTO(Item item){
        this.id = item.getId();
        this.name = item.getName();
        this.categories = item.getCategories().stream().map(
            cat -> cat.getName()
        ).collect(Collectors.toList());
        this.starts = item.getStarts();
        this.ends = item.getEnds();
    }
}
