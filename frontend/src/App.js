import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HeaderComponent from './components/HeaderComponent';
import CreatePostComponent from './components/CreatePostComponent';
import UpdatePostComponent from './components/UpdatePostComponent';
import ViewPostComponent from './components/ViewPostComponent';
import PostListComponent from './components/PostListComponent';
import UpdateCommentComponent from './components/UpdateCommentComponent'; // make sure this import 
import ViewCommentComponent from './components/ViewCommentComponent';

function App() {
  return (
    <div>
      <Router>
        <HeaderComponent />
        <div className="container">
          <Routes>
            {/* Post Routes */}
            <Route path="/posts" exact element={<PostListComponent />} />
            <Route path="/add-post" element={<CreatePostComponent />} />
            <Route path="/edit-post/:id" element={<UpdatePostComponent />} />
            <Route path="/view-post/:id" element={<ViewPostComponent />} />

            {/* Comment Routes - Nested under posts */}
            <Route path="/posts/:id/edit-comment/:commentId" element={<UpdateCommentComponent />} /> {/* THIS LINE IS CRUCIAL */}
            <Route path="/posts/:id/view-comment/:commentId" element={<ViewCommentComponent />} />

            {/* Redirect root to posts */}
            <Route path="/" exact element={<PostListComponent />} />
          </Routes>
        </div>
      </Router>
    </div>
  );
}

export default App;
