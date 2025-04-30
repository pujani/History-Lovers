import React, { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import axios from "axios";
import PlanSubHeader from '../components/PlanSubHeader';

function Create_A_Learning_Plan() {
    const { userId } = useParams();
    const navigate = useNavigate();
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);

    function createPlan() {
      if (!title.trim() || !description.trim()) {
        // Simple validation - both fields required
        alert("Please fill in all fields");
        return;
      }
      
      setIsLoading(true);
      const savePlan = {
        userId,
        title,
        description
      };

      axios.post("http://localhost:8080/api/learningplans/addLearningPlan", savePlan)
        .then(() => {
          setIsLoading(false);
          setShowSuccess(true);
          setTimeout(() => {
            setShowSuccess(false);
          }, 3000);
          setTitle("");
          setDescription("");
        })
        .catch((err) => {
          setIsLoading(false);
          alert(err);
        });
    }

    function handleViewplanButton() {
      navigate(`/viewPlans/${userId}`);
    }

    return (
      <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 to-indigo-50 p-6">
        <PlanSubHeader />
        
        <div className="flex-grow flex flex-col items-center justify-center w-full">
          <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-lg border border-gray-100">
            <h2 className="text-3xl font-bold mb-2 text-center text-indigo-700">
              Create Learning Plan
            </h2>
            <p className="text-gray-500 text-center mb-8">Design your personalized learning journey</p>

            <div className="mb-6">
              <label className="block text-gray-700 font-medium mb-2">Plan Title</label>
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g., 'Advanced JavaScript Mastery'"
                className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-gray-50"
              />
            </div>

            <div className="mb-8">
              <label className="block text-gray-700 font-medium mb-2">Description & Goals</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe what you want to learn and your goals..."
                rows={4}
                className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-gray-50"
              />
            </div>

            <div className="flex flex-col space-y-4">
              <button
                onClick={createPlan}
                disabled={isLoading}
                className={`w-full py-3 rounded-lg font-medium transition duration-300 ${
                  isLoading 
                    ? "bg-indigo-300 cursor-not-allowed" 
                    : "bg-indigo-600 hover:bg-indigo-700 text-white shadow-md hover:shadow-lg"
                }`}
              >
                {isLoading ? "Creating..." : "Create Plan"}
              </button>
              
              <button
                onClick={handleViewplanButton}
                className="w-full py-3 bg-white border border-indigo-600 text-indigo-600 rounded-lg font-medium hover:bg-indigo-50 transition duration-300"
              >
                View My Plans
              </button>
            </div>
            
            {showSuccess && (
              <div className="mt-6 p-3 bg-green-50 border border-green-200 text-green-700 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Plan created successfully!
              </div>
            )}

            <div className="mt-8 pt-4 border-t border-gray-100">
              <p className="text-center text-sm text-gray-500">
                Logged in as User <span className="text-indigo-600 font-semibold">{userId}</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    );
}

export default Create_A_Learning_Plan;