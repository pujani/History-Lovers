package com.example.pafbackend.repositories;

import com.example.pafbackend.models.Message;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.Optional;

public interface MessageRepository extends MongoRepository<Message, String> {
    
    Optional<Message> findByIdAndSenderId(String id, String senderId);
}