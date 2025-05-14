// Src/Services/PostService.js
import axios from 'axios';

const API_BASE_URL = 'http://localhost:8081/api/v1';

class PostService {
  getPosts() {
    return axios.get(API_BASE_URL + '/posts')
      .catch(error => {
        console.error("Error fetching posts:", error);
        throw error;
      });
  }

  createPost(title, content) {
    const formData = new FormData();
    formData.append('title', title);
    formData.append('content', content);
    return axios.post(API_BASE_URL + '/posts', formData)
      .catch(error => {
        console.error("Error creating post:", error);
        throw error;
      });
  }

  getPostById(postId) {
    return axios.get(`${API_BASE_URL}/posts/${postId}`)
      .catch(error => {
        console.error("Error fetching post by ID:", error);
        throw error;
      });
  }

  updatePost(postId, title, content) {
    return axios.put(`${API_BASE_URL}/posts/${postId}`, { title, content })
      .catch(error => {
        console.error("Error updating post:", error);
        throw error;
      });
  }

  deletePost(postId) { // Ensure this method is present and correctly implemented
    return axios.delete(`${API_BASE_URL}/posts/${postId}`)
      .catch(error => {
        console.error("Error deleting post:", error);
        throw error;
      });
  }

  likePost(postId) {
    return axios.post(`${API_BASE_URL}/posts/${postId}/like`)
      .catch(error => {
        console.error("Error liking post:", error);
        throw error;
      });
  }

  unlikePost(postId) {
    return axios.post(`${API_BASE_URL}/posts/${postId}/unlike`)
      .catch(error => {
        console.error("Error unliking post:", error);
        throw error;
      });
  }
}

export default new PostService();
