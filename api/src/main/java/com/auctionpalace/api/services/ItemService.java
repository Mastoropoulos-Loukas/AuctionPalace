package com.auctionpalace.api.services;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.auctionpalace.api.dto.ItemDTO;
import com.auctionpalace.api.dto.PageResponse;
import com.auctionpalace.api.entities.Item;
import com.auctionpalace.api.repositories.CategoryRepository;
import com.auctionpalace.api.repositories.ItemRepository;

@Service
public class ItemService {
    
    @Autowired private ItemRepository itemRepository;
    @Autowired private CategoryRepository categoryRepository;

    public List<Item> getItems(){
        return itemRepository.findAll();
    }

    public List<Item> getSomeItems(List<Integer> ids){
        return itemRepository.findAllById(ids);
    }

    public Item getItem(int id){
        return itemRepository.findById(id).orElse(null);
    }

    public PageResponse<ItemDTO> searchItems(
        int max_price,
        String text,
        String location,
        List<String> categories,
        int ignore_time,
        int pageNumber,
        int pageSize
    ) throws Exception{

        if(max_price < 0)
            throw new Exception("Max price must be positive value if given. (max_price = " + max_price + ")");
        if(max_price == 0)
            max_price = Integer.MAX_VALUE - 1;
            if(text == null)
                text = "%";
            else
                text = "%" + text + "%";
        if(location == null)
            location = "%";
        else
            location = "%" + location + "%";
        if(categories == null)
            categories = categoryRepository.getAllNames();

        int page_base = (pageNumber - 1) * pageSize;
        int page_size = pageSize;

        List<Item> items = ignore_time == 0
        ? itemRepository.searchItems(categories, max_price, text, location, LocalDateTime.now(), page_base, page_size)
        : itemRepository.searchItems(categories, max_price, text, location, page_base, page_size);
        
        int count = ignore_time == 0
        ? itemRepository.searchItemsCount(categories, max_price, text, location, LocalDateTime.now(), page_base, page_size)
        : itemRepository.searchItemsCount(categories, max_price, text, location, page_base, page_size);

        int total_pages = (int)Math.ceil(count / (double) pageSize);

        return new PageResponse<ItemDTO>(
            items
                .stream()
                .map(
                    item -> new ItemDTO(item)
                ).collect(Collectors.toList()), 
            pageNumber, 
            total_pages);
    }

}
