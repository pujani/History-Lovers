import React, { useState, useEffect } from 'react';
import CommentService from '../services/CommentService';
import { useParams, useNavigate } from 'react-router-dom';

const UpdateCommentComponent = () => {
  const { id: postId, commentId } = useParams(); // Rename 'id' to 'postId' for clarity
  const [commentText, setCommentText] = useState('');
  const [name, setName] = useState(''); // Changed from author
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    setError(null);
    if (postId && commentId) {
      CommentService.getCommentById(postId, commentId)
        .then(res => {
          const commentData = res.data;
          setCommentText(commentData.comment);
          setName(commentData.userId); // assuming userId in your backend is the name
          setLoading(false);
        })
        .catch(err => {
          console.error("Error fetching comment:", err);
          setError("Failed to load comment details.");
          setLoading(false);
        });
    } else {
      setError("Post ID or Comment ID not found in the URL.");
      setLoading(false);
    }
  }, [postId, commentId]);

  const updateComment = (e) => {
    e.preventDefault();
    const updatedComment = {
      comment: commentText,
      userId: name // Using name for userId in the update
    };
    console.log('updatedComment => ' + JSON.stringify(updatedComment));

    CommentService.updateComment(postId, commentId, updatedComment)
      .then(res => {
        // Display your success pop-up message here
        alert('Comment updated successfully!'); // Example pop-up
        navigate(`/posts`); // Redirect back to the posts list
      })
      .catch(err => {
        console.error("Error updating comment:", err);
        setError("Failed to update comment.");
        // Display your error pop-up message here
        alert('Failed to update comment.'); // Example pop-up
      });
  };

  const changeCommentHandler = (event) => {
    setCommentText(event.target.value);
  };

  const changeNameHandler = (event) => {
    setName(event.target.value);
  };

  const cancel = () => {
    navigate(`/posts`);
  };

  if (loading) {
    return <div>Loading comment details...</div>;
  }

  if (error) {
    return <div className="alert alert-danger">{error}</div>;
  }

  return (
    <div>
      <br />
      <div className="container">
        <div className="row">
          <div className="card col-md-6 offset-md-3 offset-md-3">
            <h3 className="text-center">Update Comment</h3>
            <div className="card-body">
              <form onSubmit={updateComment}>
                <div className="form-group">
                  <label htmlFor="comment"> Comment: </label>
                  <textarea
                    placeholder="Comment"
                    name="comment"
                    className="form-control"
                    id="comment"
                    value={commentText}
                    onChange={changeCommentHandler}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="name"> Name: </label>
                  <input
                    type="text"
                    placeholder="Your Name"
                    name="name"
                    className="form-control"
                    id="name"
                    value={name}
                    onChange={changeNameHandler}
                  />
                </div>

                <button className="btn btn-success" type="submit">Save</button>
                <button className="btn btn-danger" onClick={cancel}>Cancel</button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpdateCommentComponent;
