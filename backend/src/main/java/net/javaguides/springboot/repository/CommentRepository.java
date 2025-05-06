package net.javaguides.springboot.repository;

import net.javaguides.springboot.model.Comment;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface CommentRepository extends JpaRepository<Comment, Long> {
    // ✅ Get all comments by post ID
    List<Comment> findByPostId(Long postId);
}
