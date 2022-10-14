package com.auctionpalace.api.repositories;

import java.util.List;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import com.auctionpalace.api.entities.Visitation;

@Repository
public interface VisitationRepository extends CrudRepository<Visitation, Integer>{
    

    @Query(
        value = "SELECT * FROM visitation v WHERE v.users_id = ?1 AND v.item_id = ?2",
        nativeQuery = true
    )
    public List<Visitation> getVisits(int user_id, int item_id);

    public Visitation findByUser_IdAndItem_Id(int user_id, int item_id);
}
