package net.javaguides.springboot.controller;

import net.javaguides.springboot.model.Comment;
import net.javaguides.springboot.model.Post;
import net.javaguides.springboot.repository.CommentRepository;
import net.javaguides.springboot.repository.PostRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.bind.annotation.CrossOrigin;

import java.util.List;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/api/v1")
public class CommentController {

	@Autowired
	private CommentRepository commentRepository;

	@Autowired
	private PostRepository postRepository;

	// Create comment for a post
	@PostMapping("/posts/{postId}/comments")
	public ResponseEntity<Comment> createComment(
			@PathVariable Long postId,
			@RequestBody Comment commentRequest) {

		Post post = postRepository.findById(postId)
				.orElseThrow(() -> new RuntimeException("Post not found with id " + postId));

		commentRequest.setPost(post);
		Comment savedComment = commentRepository.save(commentRequest);
		return new ResponseEntity<>(savedComment, HttpStatus.CREATED);
	}

	// ✅ Get all comments for a specific post
	@GetMapping("/posts/{postId}/comments")
	public ResponseEntity<List<Comment>> getCommentsByPostId(@PathVariable Long postId) {
		List<Comment> comments = commentRepository.findByPostId(postId);
		return new ResponseEntity<>(comments, HttpStatus.OK);
	}

	// ✅ Get a specific comment by ID
	@CrossOrigin(origins = "http://localhost:3000") // Explicitly allow CORS for this method
	@GetMapping("/posts/{postId}/comments/{commentId}")
	public ResponseEntity<Comment> getCommentById(@PathVariable Long postId, @PathVariable Long commentId) {
		Comment comment = commentRepository.findById(commentId)
				.orElseThrow(() -> new RuntimeException("Comment not found with id " + commentId));
		if (!comment.getPost().getId().equals(postId)) {
			throw new RuntimeException("Comment not found for post with id " + postId);
		}
		return new ResponseEntity<>(comment, HttpStatus.OK);
	}

	// ✅ Update a comment
	@PutMapping("/posts/{postId}/comments/{commentId}")
	public ResponseEntity<Comment> updateComment(@PathVariable Long postId, @PathVariable Long commentId, @RequestBody Comment commentDetails) {
		Comment comment = commentRepository.findById(commentId)
				.orElseThrow(() -> new RuntimeException("Comment not found with id " + commentId));
		if (!comment.getPost().getId().equals(postId)) {
			throw new RuntimeException("Comment not found for post with id " + postId);
		}
		comment.setComment(commentDetails.getComment());
		comment.setUserId(commentDetails.getUserId()); // Assuming userId is the name
		Comment updatedComment = commentRepository.save(comment);
		return new ResponseEntity<>(updatedComment, HttpStatus.OK);
	}

	// ✅ Delete a comment
	@DeleteMapping("/posts/{postId}/comments/{commentId}")
	public ResponseEntity<Void> deleteComment(@PathVariable Long postId, @PathVariable Long commentId) {
		Comment comment = commentRepository.findById(commentId)
				.orElseThrow(() -> new RuntimeException("Comment not found with id " + commentId));
		if (!comment.getPost().getId().equals(postId)) {
			throw new RuntimeException("Comment not found for post with id " + postId);
		}
		commentRepository.delete(comment);
		return new ResponseEntity<>(HttpStatus.NO_CONTENT);
	}
}
