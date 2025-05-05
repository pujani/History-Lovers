import React, { useState, useEffect } from 'react';
import PostService from '../services/PostService';
import { useParams, useNavigate } from 'react-router-dom'; // Import useNavigate

const UpdatePostComponent = () => {
  const [id, setId] = useState('');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const { postId } = useParams(); // Get the post ID from the URL
  const navigate = useNavigate(); // Get the navigate function

  useEffect(() => {
    PostService.getPostById(postId)
      .then(res => {
        setId(res.data.id);
        setTitle(res.data.title);
        setContent(res.data.content);
      })
      .catch(error => {
        console.error("Error fetching post:", error);
      });
  }, [postId]);

  const updatePost = (e) => {
    e.preventDefault();
    const post = { id, title, content };

    PostService.updatePost(postId, title, content)
      .then(res => {
        navigate('/posts'); // Use navigate to go back to the list
      })
      .catch(error => {
        console.error("Error updating post:", error);
      });
  }

  const cancel = () => {
    navigate('/posts'); // Use navigate to go back to the list
  }

  return (
    <div>
      <h2>Update Post</h2>
      <form>
        <div>
          <label>Title:</label>
          <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} />
        </div>
        <div>
          <label>Content:</label>
          <textarea value={content} onChange={(e) => setContent(e.target.value)} />
        </div>
        <button onClick={updatePost}>Save</button>
        <button onClick={cancel}>Cancel</button>
      </form>
    </div>
  );
};

export default UpdatePostComponent;