package net.javaguides.springboot.repository;

import net.javaguides.springboot.model.Like;
import net.javaguides.springboot.model.Post;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.List;

@Repository
public interface LikeRepository extends JpaRepository<Like, Long> {
    Optional<Like> findByPostAndUserId(Post post, String userId);
    List<Like> findByPost(Post post);
    Long countByPost(Post post);
}