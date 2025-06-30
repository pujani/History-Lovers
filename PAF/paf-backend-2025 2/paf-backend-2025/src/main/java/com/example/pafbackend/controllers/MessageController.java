package com.example.pafbackend.controllers;

import com.example.pafbackend.dtos.MessageDTO;
import com.example.pafbackend.dtos.MessageResponseDTO;
import com.example.pafbackend.services.MessageService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/messages") 
@RequiredArgsConstructor
public class MessageController {

    private final MessageService messageService;

   
    @PostMapping
    public ResponseEntity<MessageResponseDTO> createMessage(@RequestBody MessageDTO messageDTO) {
        MessageResponseDTO response = messageService.createMessage(messageDTO);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    
    @GetMapping
    public ResponseEntity<List<MessageResponseDTO>> getAllMessages() {
        List<MessageResponseDTO> messages = messageService.getAllMessages();
        return ResponseEntity.ok(messages);
    }

 
    @PutMapping("/{id}")
    public ResponseEntity<?> updateMessage(
            @PathVariable String id,
            @RequestBody MessageDTO messageDTO) {
        try {
            MessageResponseDTO updatedMessage = messageService.updateMessage(id, messageDTO);
            return ResponseEntity.ok(updatedMessage);
        } catch (RuntimeException ex) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ex.getMessage());
        }
    }
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteMessage(
            @PathVariable String id

    ) {
        try {
            messageService.deleteMessage(id);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException ex) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ex.getMessage());
        }
    }
}