package com.example.pafbackend.dtos;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class MessageResponseDTO {
    private String id;
    private String content;
    private String senderId;
    private Date timestamp;
}