package com.auctionpalace.api.dto;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data @AllArgsConstructor @NoArgsConstructor
public class PageResponse<T>{
    List<T> page;
    int current_page;
    int total_pages;
}
