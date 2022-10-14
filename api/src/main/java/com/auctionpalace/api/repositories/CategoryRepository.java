package com.auctionpalace.api.repositories;

import com.auctionpalace.api.entities.Category;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface CategoryRepository extends JpaRepository<Category,Integer>{    

    @Query(
        value = "select id from categories",
        nativeQuery = true
    )
    public List<Integer> getAllIds();

    @Query(
        value = "select name from categories",
        nativeQuery = true
    )
    public List<String> getAllNames();

    

    @Query(
        value = "select count(*) from categories cat, item_has_category ihc where cat.name = ?1 and cat.id = ihc.category_id",
        nativeQuery = true
    )
    public int getCategoryCountByName(String name);

    @Query(
        value = "select count(*) from categories cat, item_has_category ihc where cat.id = ?1 and cat.id = ihc.category_id",
        nativeQuery = true
    )
    public int getCategoryCountById(int id);
    
    @Query(
        value = "select  min(i.currently) from categories cat, item_has_category ihc, items i where cat.id = ?1 and cat.id = ihc.category_id and i.id = ihc.item_id",
        nativeQuery = true
    )
    public int getCategoryMinPriceById(int id);

    
    @Query(
        value = "select  max(i.currently) from categories cat, item_has_category ihc, items i where cat.id = ?1 and cat.id = ihc.category_id and i.id = ihc.item_id",
        nativeQuery = true
    )
    public int getCategoryMaxPriceById(int id);

    public Optional<Category> findByName(String name);
    public List<Category> findAllByIdIn(List<Integer> ids);
    public List<Category> findAllByNameIn(List<String> names);
}
