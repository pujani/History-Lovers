import React from 'react';

const ViewPostComponent = ({ post }) => {
  return (
    <div className="view-post">
      <h2>{post.title}</h2>
      <p>{post.content}</p>
      {/* Add more post details as needed  */}
    </div>
  );
};

export default ViewPostComponent;
