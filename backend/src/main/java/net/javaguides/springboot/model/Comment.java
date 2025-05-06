package net.javaguides.springboot.model;

import jakarta.persistence.*;
import com.fasterxml.jackson.annotation.JsonIgnore;

//Entity for This
@Entity
@Table(name = "comments")
public class Comment {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private long id;

	@Column(name = "comment")
	private String comment;

	@Column(name = "last_name")
	private String description;

	@Column(name = "user_id")
	private String userId;

	// Many comments belong to one post
	@JsonIgnore
	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "post_id", nullable = false)
	private Post post;

	public Comment() {
	}

	public Comment(String comment, String description, String userId, Post post) {
		this.comment = comment;
		this.description = description;
		this.userId = userId;
		this.post = post;
	}

	public long getId() {
		return id;
	}

	public void setId(long id) {
		this.id = id;
	}

	public String getComment() {
		return comment;
	}

	public void setComment(String comment) {
		this.comment = comment;
	}

	public String getDescription() {
		return description;
	}

	public void setDescription(String description) {
		this.description = description;
	}

	public String getUserId() {
		return userId;
	}

	public void setUserId(String userId) {
		this.userId = userId;
	}

	public Post getPost() {
		return post;
	}

	public void setPost(Post post) {
		this.post = post;
	}
}
