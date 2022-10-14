package com.auctionpalace.api.controllers;

import com.auctionpalace.api.entities.Card;
import com.auctionpalace.api.services.CardService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/cards")
public class CardController {
    
    @Autowired CardService cardService;

    @PostMapping("")
    public ResponseEntity<Card> saveCard(@RequestBody Card card) throws Exception{
        Card c = null;
        try {
            c = cardService.createOrUpdateCard(card);
        } catch (Exception e) {
            throw e;
        }

        return new ResponseEntity<Card>(c, HttpStatus.OK);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Card> deleteCard(@PathVariable int id) throws Exception{
        Card card = null;
        try {
            card = cardService.deleteCard(id);
        } catch (Exception e) {
            throw e;
        }

        return new ResponseEntity<Card>(card, HttpStatus.OK);
    }
}
