package net.javaguides.springboot.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import net.javaguides.springboot.model.Post;

public interface PostRepository extends JpaRepository<Post, Long> {
}
