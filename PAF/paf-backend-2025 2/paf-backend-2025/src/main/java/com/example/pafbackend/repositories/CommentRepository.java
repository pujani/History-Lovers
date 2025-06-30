package com.example.pafbackend.repositories;

import com.example.pafbackend.models.Comment;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CommentRepository extends MongoRepository<Comment, String> {
    List<Comment> findByPostIdAndDeleteStatusFalse(String postId);
    List<Comment> findByUserIdAndDeleteStatusFalse(String userId);
    Optional<Comment> findByIdAndDeleteStatusFalse(String id);
}