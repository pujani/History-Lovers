import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PostService from '../services/PostService';

const CreatePostComponent = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const navigate = useNavigate();

  //save the post
  const savePost = (e) => {
    e.preventDefault();
    const post = { title, content };

    PostService.createPost(post)
      .then(response => {
        console.log(response.data);
        // Display your success pop-up message here
        alert('Post created successfully!'); // Example pop-up
        navigate('/posts');
      })
      .catch(error => {
        console.log(error);
        // Display your error pop-up message here
        alert('Failed to create post.'); // Example pop-up
      });
  };

  const cancelHandler = () => {
    navigate('/posts');
  };

  return (
    <div>
      <br />
      <div className="container">
        <div className="row">
          <div className="card col-md-6 offset-md-3 offset-md-3">
            <h3 className="text-center">Add Post</h3>
            <div className="card-body">
              <form onSubmit={savePost}>
                <div className="form-group">
                  <label htmlFor="title"> Post Title: </label>
                  <input
                    type="text"
                    placeholder="Post Title"
                    name="title"
                    className="form-control"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    id="title"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="content"> Content: </label>
                  <textarea
                    placeholder="Content"
                    name="content"
                    className="form-control"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    id="content"
                  />
                </div>
                <button className="btn btn-success" type="submit">Save</button>
                <button className="btn btn-danger" onClick={cancelHandler} style={{ marginLeft: '10px' }}>Cancel</button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreatePostComponent;
