package com.auctionpalace.api.services;

import com.auctionpalace.api.entities.Card;
import com.auctionpalace.api.repositories.CardRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class CardService {

    @Autowired CardRepository cardRepo;

    public Card deleteCard(int id) throws Exception{
        Card card = null;

        try{
            card = cardRepo.findById(id).orElse(null);
            
            if(card==null){
                throw new Exception("user not available");
            }
            else{
                cardRepo.deleteById(id);
            }
        }
        catch(Exception e){
            throw e;
        }
        return card;
    }

    public Card createOrUpdateCard(Card user) {
        return cardRepo.save(user);
    }
}
