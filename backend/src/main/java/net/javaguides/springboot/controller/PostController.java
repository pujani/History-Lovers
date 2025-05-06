package net.javaguides.springboot.controller;

import net.javaguides.springboot.model.Post;
import net.javaguides.springboot.repository.PostRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.bind.annotation.CrossOrigin;

import java.util.List;
import java.util.Optional;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/api/v1")
public class PostController {

    @Autowired
    private PostRepository postRepository;

    // Create a new post
    @PostMapping("/posts")
    public ResponseEntity<Post> createPost(
            @RequestParam("title") String title,
            @RequestParam("content") String content) {

        Post post = new Post(title, content); // Removed image parameter
        Post savedPost = postRepository.save(post);
        return new ResponseEntity<>(savedPost, HttpStatus.CREATED);
    }

    // Get all posts
    @GetMapping("/posts")
    public List<Post> getAllPosts() {
        return postRepository.findAll();
    }

    // Get post by ID
    @GetMapping("/posts/{id}")
    public ResponseEntity<Post> getPostById(@PathVariable Long id) {
        Optional<Post> post = postRepository.findById(id);
        return post.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @DeleteMapping("/posts/{id}")
    public ResponseEntity<HttpStatus> deletePost(@PathVariable Long id) {
        try {
            if (postRepository.existsById(id)) {
                postRepository.deleteById(id);
                return new ResponseEntity<>(HttpStatus.NO_CONTENT); // 204 No Content for successful deletion
            } else {
                return new ResponseEntity<>(HttpStatus.NOT_FOUND); // 404 Not Found if the post doesn't exist
            }
        } catch (Exception e) {
            e.printStackTrace();
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR); // 500 Internal Server Error
        }
    }
}