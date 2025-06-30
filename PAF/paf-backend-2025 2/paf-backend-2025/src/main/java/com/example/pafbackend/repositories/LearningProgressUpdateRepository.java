package com.example.pafbackend.repositories;

import com.example.pafbackend.models.LearningProgressUpdate;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface LearningProgressUpdateRepository extends MongoRepository<LearningProgressUpdate, String> {
    List<LearningProgressUpdate> findByUserIdAndDeleteStatusFalse(String userId);
    List<LearningProgressUpdate> findByDeleteStatusFalse();
    LearningProgressUpdate findByIdAndDeleteStatusFalse(String id);
}