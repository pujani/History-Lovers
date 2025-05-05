import axios from 'axios';

const BASE_URL = "http://localhost:8081/api/v1";

const CommentService = {
  getComments(postId) {
    return axios.get(`${BASE_URL}/posts/${postId}/comments`);
  },

  createComment(postId, comment) {
    return axios.post(`${BASE_URL}/posts/${postId}/comments`, comment);
  },

  getCommentById(postId, commentId) {
    return axios.get(`${BASE_URL}/posts/${postId}/comments/${commentId}`);
  },

  updateComment(postId, commentId, updatedComment) {
    return axios.put(`${BASE_URL}/posts/${postId}/comments/${commentId}`, updatedComment);
  },

  deleteComment(postId, commentId) {
    return axios.delete(`${BASE_URL}/posts/${postId}/comments/${commentId}`);
  }
};

export default CommentService;
