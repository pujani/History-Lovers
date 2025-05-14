import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Home() {
  const [userId, setUserId] = useState("");
  const [isHovered, setIsHovered] = useState(false);
  const navigate = useNavigate();

  function handleCreateLearningPlanButton() {
    if (userId.trim()) {
      navigate(`create_a_learning_plan/${userId}`);
    } else {
      alert("Please enter a User ID first");
    }
  }
  
   function handleCreateLearningPlanButton(){
        navigate(`retriveAllUser/${userId}`);
    }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8 space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Learning Journey</h1>
          <p className="text-gray-600 mb-6">Enter your User ID to get started with your personalized learning plan</p>
        </div>
        
        <div className="space-y-6">
          <div>
            <label htmlFor="userId" className="block text-sm font-medium text-gray-700 mb-1">User ID</label>
            <input
              id="userId"
              type="text"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              placeholder="Enter your User ID"
            />
          </div>
          
          <button
            onClick={handleCreateLearningPlanButton}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            className={`w-full px-6 py-3 text-white font-medium rounded-lg transition-all duration-300 ${
              isHovered ? 'bg-indigo-700 shadow-lg' : 'bg-indigo-600 shadow'
            }`}
          >
            Create Learning Plan
          </button>
          
          <div className="text-center text-sm text-gray-500">
            <p>New here? <a href="#" className="text-indigo-600 hover:text-indigo-800 font-medium">Create an account</a></p>
          </div>
        </div>
      </div>
      
      <div className="mt-8 text-center">
        <h2 className="text-xl font-semibold text-gray-700 mb-4">Why create a learning plan?</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl">
          <div className="bg-white p-4 rounded-lg shadow">
            <div className="font-bold text-indigo-600 mb-2">Personalized</div>
            <p className="text-gray-600">Tailored to your specific goals and learning style</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <div className="font-bold text-indigo-600 mb-2">Structured</div>
            <p className="text-gray-600">Clear steps to follow and track your progress</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <div className="font-bold text-indigo-600 mb-2">Effective</div>
            <p className="text-gray-600">Proven methods to help you achieve mastery</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;