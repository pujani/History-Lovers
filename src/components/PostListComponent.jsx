// src/components/PostListComponent.jsx
import React, { Component } from 'react';
import PostService from '../services/PostService';
import CommentService from '../services/CommentService';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashAlt, faThumbsUp, faThumbsDown, faEdit } from '@fortawesome/free-solid-svg-icons';
import './ConfirmationModal.css'; // Import the CSS file

class ConfirmationModal extends Component {
  render() {
    return (
      <div className="confirmation-modal">
        <div className="modal-content">
          <span className="close-button" onClick={this.props.onCancel}>&times;</span>
          <div className="icon-container">
            <div className="icon">
              <FontAwesomeIcon icon={faTrashAlt} />
            </div>
          </div>
          <h2>{this.props.title}</h2>
          <p>{this.props.message}</p>
          <div className="button-container">
            <button className="cancel-button" onClick={this.props.onCancel}>Cancel</button>
            <button className="delete-button" onClick={this.props.onConfirm}>Delete</button>
          </div>
        </div>
      </div>
    );
  }
}

class PostListComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      posts: [],
      newComment: '',
      commentingPostId: null,
      likedPosts: new Set(),
      showPostDeleteModal: false,
      postIdToDelete: null,
      showCommentDeleteModal: false,
      commentToDelete: null,
      postToDeleteForComment: null,
      showCommentConfirmation: false, // New state for comment confirmation
    };
    this.handleCommentChange = this.handleCommentChange.bind(this);
    this.postComment = this.postComment.bind(this);
    this.deleteComment = this.deleteComment.bind(this);
    this.getPosts = this.getPosts.bind(this);
    this.handleLike = this.handleLike.bind(this);
    this.handleUnlike = this.handleUnlike.bind(this);
    this.openPostDeleteModal = this.openPostDeleteModal.bind(this);
    this.closePostDeleteModal = this.closePostDeleteModal.bind(this);
    this.confirmDeletePost = this.confirmDeletePost.bind(this);
    this.openCommentDeleteModal = this.openCommentDeleteModal.bind(this);
    this.closeCommentDeleteModal = this.closeCommentDeleteModal.bind(this);
    this.confirmDeleteComment = this.confirmDeleteComment.bind(this);
    this.deletePost = this.deletePost.bind(this);
  }

  componentDidMount() {
    console.log("PostListComponent mounted");
    this.getPosts();
  }

  getPosts() {
    console.log("Attempting to fetch posts...");
    PostService.getPosts()
      .then((res) => {
        console.log("Posts data received:", res.data);
        this.setState({ posts: res.data });
      })
      .catch((error) => {
        console.error("Error fetching posts:", error);
        if (error.response) {
          console.error("Server responded with status:", error.response.status);
          console.error("Server response data:", error.response.data);
        } else if (error.request) {
          console.error("No response received from server:", error.request);
        } else {
          console.error("Error setting up the request:", error.message);
        }
      });
  }

  handleCommentChange = (event) => {
    this.setState({ newComment: event.target.value });
  }

  postComment = (postId) => {
    const comment = { comment: this.state.newComment, userId: 'user123' }; // Replace with actual user info
    CommentService.createComment(postId, comment)
      .then(res => {
        this.setState({ newComment: '', commentingPostId: null, showCommentConfirmation: true }); // Show confirmation
        setTimeout(() => {
          this.setState({ showCommentConfirmation: false });
          this.getPosts(); // Refresh posts to show the new comment
        }, 1500);
      })
      .catch(error => {
        console.error("Error posting comment:", error);
      });
  }

  deleteComment = (postId, commentId) => {
    CommentService.deleteComment(postId, commentId)
      .then(res => {
        this.getPosts(); // Refresh posts after deletion
      })
      .catch(error => {
        console.error("Error deleting comment:", error);
      });
  }

  handleLike = (postId) => {
    PostService.likePost(postId)
      .then(res => {
        this.setState(prevState => ({
          posts: prevState.posts.map(post =>
            post.id === postId ? { ...post, likeCount: res.data.likeCount } : post
          ),
          likedPosts: new Set(prevState.likedPosts).add(postId)
        }));
      })
      .catch(error => {
        console.error("Error liking post:", error);
      });
  }

  handleUnlike = (postId) => {
    PostService.unlikePost(postId)
      .then(res => {
        this.setState(prevState => ({
          posts: prevState.posts.map(post =>
            post.id === postId ? { ...post, likeCount: res.data.likeCount } : post
          ),
          likedPosts: new Set(prevState.likedPosts)
        }));
        this.state.likedPosts.delete(postId); // Remove from liked set
        this.setState({ likedPosts: this.state.likedPosts }); // Force re-render
      })
      .catch(error => {
        console.error("Error unliking post:", error);
      });
  }

  deletePost(id) {
    PostService.deletePost(id) // Ensure this call matches the method in PostService
      .then(res => {
        this.setState({ posts: this.state.posts.filter(post => post.id !== id) }, () => {
          console.log(`Post with ID ${id} deleted successfully. Refreshing posts.`);
          this.getPosts(); // Refresh the list after successful deletion
        });
      })
      .catch(error => {
        console.error("Error deleting post:", error);
      });
  }

  openPostDeleteModal = (postId) => {
    this.setState({ showPostDeleteModal: true, postIdToDelete: postId });
  };

  closePostDeleteModal = () => {
    this.setState({ showPostDeleteModal: false, postIdToDelete: null });
  };

  confirmDeletePost = () => {
    this.deletePost(this.state.postIdToDelete);
    this.closePostDeleteModal();
  };

  openCommentDeleteModal = (postId, commentId) => {
    this.setState({
      showCommentDeleteModal: true,
      commentToDelete: commentId,
      postToDeleteForComment: postId,
    });
  };

  closeCommentDeleteModal = () => {
    this.setState({ showCommentDeleteModal: false, commentToDelete: null, postToDeleteForComment: null });
  };

  confirmDeleteComment = () => {
    this.deleteComment(this.state.postToDeleteForComment, this.state.commentToDelete);
    this.closeCommentDeleteModal();
  };

  render() {
    return (
      <div className="container">
        <h2 className="text-center">Posts</h2>
        <Link to="/add-post" className="btn btn-primary mb-2">Add Post</Link>

        {this.state.showPostDeleteModal && (
          <ConfirmationModal
            title="Delete Post"
            message="Are you sure you want to delete this post? This action cannot be undone."
            onConfirm={this.confirmDeletePost}
            onCancel={this.closePostDeleteModal}
          />
        )}

        {this.state.showCommentDeleteModal && (
          <ConfirmationModal
            title="Delete Comment"
            message="Are you sure you want to delete this comment? This action cannot be undone."
            onConfirm={this.confirmDeleteComment}
            onCancel={this.closeCommentDeleteModal}
          />
        )}

        {this.state.showCommentConfirmation && (
          <div className="confirmation-popup">
            <div className="confirmation-content">
              <div className="icon-container">
                <div className="icon success">✓</div>
              </div>
              <h2>Thank You!</h2>
              <p>Your comment has been successfully added. Thanks!</p>
            </div>
          </div>
        )}

        {this.state.posts.length === 0 ? (
          <p>No posts available.</p>
        ) : (
          this.state.posts.map(post => (
            <div className="card mb-3" key={post.id}>
              <div className="card-body">
                <h5 className="card-title">{post ? post.title : 'Undefined Title'}</h5>
                <p className="card-text">{post ? post.content : 'Undefined Content'}</p>
                <div className="mb-2">
                  <button
                    className="btn btn-sm btn-outline-primary mr-2"
                    onClick={() => this.state.likedPosts.has(post.id) ? this.handleUnlike(post.id) : this.handleLike(post.id)}
                  >
                    <FontAwesomeIcon icon={this.state.likedPosts.has(post.id) ? faThumbsDown : faThumbsUp} className="mr-1" />
                    {post.likeCount} Likes
                  </button>
                  <button onClick={() => this.openPostDeleteModal(post.id)} className="btn btn-danger btn-sm ml-2">
                    <FontAwesomeIcon icon={faTrashAlt} />
                  </button>
                </div>
                <div>
                  <strong>Comments:</strong>
                  {post.comments && post.comments.map(comment => (
                    <div className="card mb-2" key={comment.id}>
                      <div className="card-body">
                        {comment.comment} - {comment.userId}
                        <Link to={`/posts/${post.id}/edit-comment/${comment.id}`} className="btn btn-info btn-sm ml-2">
                          <FontAwesomeIcon icon={faEdit} />
                        </Link>
                        <button onClick={() => this.openCommentDeleteModal(post.id, comment.id)} className="btn btn-danger btn-sm ml-2">
                          <FontAwesomeIcon icon={faTrashAlt} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-2">
                  <textarea
                    className="form-control"
                    value={this.state.newComment}
                    onChange={this.handleCommentChange}
                    placeholder="Write a comment..."
                  />
                  <button onClick={() => this.postComment(post.id)} className="btn btn-primary mt-1">
                    Post Comment
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    );
  }
}

export default PostListComponent;