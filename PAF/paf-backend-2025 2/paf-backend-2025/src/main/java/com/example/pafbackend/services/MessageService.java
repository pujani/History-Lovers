package com.example.pafbackend.services;

import com.example.pafbackend.dtos.MessageDTO;
import com.example.pafbackend.dtos.MessageResponseDTO;
import com.example.pafbackend.models.Message;
import com.example.pafbackend.repositories.MessageRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;

@Service
@RequiredArgsConstructor
public class MessageService {

    private final MessageRepository messageRepository;

    
    public MessageResponseDTO createMessage(MessageDTO messageDTO) {
        Message message = new Message();
        message.setContent(messageDTO.getContent());
        message.setSenderId(messageDTO.getSenderId());
        message.setTimestamp(new Date());
        Message savedMessage = messageRepository.save(message);
        return convertToResponseDTO(savedMessage);
    }

   
    public List<MessageResponseDTO> getAllMessages() {
        return messageRepository.findAll().stream()
                .map(this::convertToResponseDTO)
                .toList();
    }

  
    public MessageResponseDTO updateMessage(String id, MessageDTO messageDTO) {
    
        Message message = messageRepository.findByIdAndSenderId(id, messageDTO.getSenderId())
                .orElseThrow(() -> new RuntimeException("පණිවුඩය හමු නොවීය හෝ අවසර නැත"));

        message.setContent(messageDTO.getContent());
        Message updatedMessage = messageRepository.save(message);
        return convertToResponseDTO(updatedMessage);
    }

   
    public void deleteMessage(String id) {
        messageRepository.deleteById(id); 
    }

 
    private MessageResponseDTO convertToResponseDTO(Message message) {
        return new MessageResponseDTO(
                message.getId(),
                message.getContent(),
                message.getSenderId(),
                message.getTimestamp()
        );
    }
}