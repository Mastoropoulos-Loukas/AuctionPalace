package com.auctionpalace.api.services;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.auctionpalace.api.dto.CategoryStats;
import com.auctionpalace.api.entities.Category;
import com.auctionpalace.api.repositories.CategoryRepository;

@Service
public class CategoryService {
    @Autowired private CategoryRepository categoryRepository;

    public List<Category> getAllCategories() {
        return categoryRepository.findAll();
    }

    public Category getCategoryById(int id) {
        return categoryRepository.findById(id).orElse(null);
    }

    public List<CategoryStats> getCategoriesWithStats(List<Integer> ids) throws Exception{
    
        return ids.stream().map(
            id -> {
                try {
                    return getCategoryStats(id);
                } catch (Exception e) {
                    System.out.println(e.getMessage());
                    return null;
                }
            }
        ).collect(Collectors.toList());

    }

    public CategoryStats getCategoryStats(int id) throws Exception{
        CategoryStats stats = new CategoryStats();
        Category category = categoryRepository.findById(id).orElse(null);
        if(category == null)throw new Exception("No category with id " + id);

        stats.setCategory_id(id);
        stats.setName(category.getName());
        stats.setTotal_auctions(getCategoryCount(id));
        stats.setMax_price(getCategoryMaxPrice(id));
        stats.setMin_price(getCategoryMinPrice(id));

        return stats;
    }

    public CategoryStats getCategoryStats(String name) throws Exception{
        CategoryStats stats = new CategoryStats();
        Category category = categoryRepository.findByName(name).orElse(null);
        if(category == null)throw new Exception("No category " + name);

        int id = category.getId();
        stats.setCategory_id(id);
        stats.setName(name);
        stats.setTotal_auctions(getCategoryCount(name));
        stats.setMax_price(getCategoryMaxPrice(id));
        stats.setMin_price(getCategoryMinPrice(id));

        return stats;
    }

    public int getCategoryMinPrice(int id){
        return categoryRepository.getCategoryMinPriceById(id);
    }

    public int getCategoryMaxPrice(int id){
        return categoryRepository.getCategoryMaxPriceById(id);
    }

    public int getCategoryCount(String name){
        return categoryRepository.getCategoryCountByName(name);
    }

    public int getCategoryCount(int id){
        return categoryRepository.getCategoryCountById(id);
    }
}
