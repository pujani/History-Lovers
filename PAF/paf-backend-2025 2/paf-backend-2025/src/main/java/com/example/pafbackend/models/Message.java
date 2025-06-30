package com.example.pafbackend.models;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.Date;

@Document(collection = "messages") 
@Data 
@NoArgsConstructor 
@AllArgsConstructor 
public class Message {
    @Id 
    private String id;
    private String content; 
    private String senderId;
    private Date timestamp;}