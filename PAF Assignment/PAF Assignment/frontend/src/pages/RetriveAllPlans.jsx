import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

function RetriveAllPlans() {
  const { userId } = useParams();
  const [allPlans, setAllLearningPlans] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredPlans, setFilteredPlans] = useState([]);
  const [activeFilter, setActiveFilter] = useState('all');
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchPlansAndTopics() {
      setIsLoading(true);
      try {
        const plansResponse = await axios.get(`http://localhost:8080/api/learningplans/getAllPlans`);
        const plansData = plansResponse.data;

        const plansWithTopics = await Promise.all(
          plansData.map(async (plan) => {
            const topicsResponse = await axios.get(
              `http://localhost:8080/api/topics/getLectures/${plan.planId}`
            );
            return {
              ...plan,
              topics: topicsResponse.data,
            };
          })
        );

        setAllLearningPlans(plansWithTopics);
        setFilteredPlans(plansWithTopics);
      } catch (error) {
        console.error('Error fetching plans or topics:', error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchPlansAndTopics();
  }, []);

  // Handle search functionality
  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredPlans(allPlans);
    } else {
      const lowercaseQuery = searchQuery.toLowerCase();
      const filtered = allPlans.filter(plan => {
        const matchesTitle = plan.title.toLowerCase().includes(lowercaseQuery);
        const matchesDescription = plan.description.toLowerCase().includes(lowercaseQuery);
        const matchesTopic = plan.topics && plan.topics.some(topic => 
          topic.title.toLowerCase().includes(lowercaseQuery) || 
          topic.content.toLowerCase().includes(lowercaseQuery)
        );
        return matchesTitle || matchesDescription || matchesTopic;
      });
      setFilteredPlans(filtered);
    }
  }, [searchQuery, allPlans]);

  // Handle filtering by era
  const handleFilterChange = (filter) => {
    setActiveFilter(filter);
    
    if (filter === 'all') {
      setFilteredPlans(allPlans);
    } else {
      // This is a simple implementation - in a real app, you would have era data in your learning plans
      const filtered = allPlans.filter(plan => 
        plan.title.toLowerCase().includes(filter.toLowerCase()) || 
        plan.description.toLowerCase().includes(filter.toLowerCase())
      );
      setFilteredPlans(filtered);
    }
  };

  // Helper function to extract YouTube video ID
  const getYouTubeId = (url) => {
    const match = url.match(/(?:https?:\/\/)?(?:www\.)?youtube\.com\/watch\?v=([^&]+)/);
    return match ? match[1] : null;
  };

  function handleCreateNewLearningPlan() {
    navigate(`/create_a_learning_plan/${userId}`);
  }

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center">
          <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-indigo-600 border-r-transparent"></div>
          <p className="mt-4 text-lg font-medium text-gray-700">Loading your learning plans...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row md:justify-between md:items-center">
            <div className="mb-4 md:mb-0">
              <h1 className="text-3xl font-bold text-gray-800">History Lovers Learning Platform</h1>
              <p className="text-gray-600">Discover and explore fascinating historical journeys</p>
            </div>
            <button
              onClick={handleCreateNewLearningPlan}
              className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition-all duration-300 transform hover:scale-105 shadow"
            >
              Create New Learning Plan
            </button>
          </div>
        </div>
      </header>

      {/* Search and Filter Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
            <div className="w-full md:w-1/2">
              <label htmlFor="search" className="sr-only">Search learning plans</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
                  <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                  </svg>
                </div>
                <input
                  id="search"
                  name="search"
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="Search by title, description, or topic"
                />
              </div>
            </div>
            
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-700">
            {filteredPlans.length === 0 
              ? 'No learning plans found' 
              : filteredPlans.length === 1 
                ? '1 Learning Plan' 
                : `${filteredPlans.length} Learning Plans`}
          </h2>
        </div>

        {/* Learning Plans Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {filteredPlans.map((plan) => (
            <div
              key={plan.planId}
              className="bg-white rounded-xl shadow-lg overflow-hidden transform transition hover:shadow-xl hover:translate-y-[-5px]"
            >
              {/* Plan Header */}
              <div className="bg-gradient-to-r from-indigo-600 to-indigo-800 px-6 py-5">
                <h2 className="text-2xl font-bold text-white">{plan.title}</h2>
              </div>
              
              {/* Plan Content */}
              <div className="p-6">
                <p className="text-gray-700 mb-6">{plan.description}</p>
                
                {/* Topics List */}
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
                    <svg className="w-5 h-5 mr-2 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
                    </svg>
                    Topics in this learning path
                  </h3>
                  
                  {plan.topics && plan.topics.length > 0 ? (
                    <div className="space-y-4">
                      {plan.topics.map((topic) => {
                        const videoId = getYouTubeId(topic.url);
                        const thumbnailUrl = videoId
                          ? `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`
                          : null;
                        
                        return (
                          <div key={topic.topicId} className="bg-blue-50 rounded-lg overflow-hidden border border-blue-100">
                            <div className="flex flex-col sm:flex-row">
                              {thumbnailUrl && (
                                <div className="sm:w-1/3 relative">
                                  <a
                                    href={topic.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="block relative"
                                  >
                                    <img
                                      src={thumbnailUrl}
                                      alt="YouTube Thumbnail"
                                      className="w-full h-32 sm:h-full object-cover"
                                    />
                                    <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center">
                                      <div className="bg-white bg-opacity-80 rounded-full p-2">
                                        <svg className="w-6 h-6 text-indigo-600" fill="currentColor" viewBox="0 0 20 20">
                                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                                        </svg>
                                      </div>
                                    </div>
                                  </a>
                                </div>
                              )}
                              <div className={`p-4 ${thumbnailUrl ? 'sm:w-2/3' : 'w-full'}`}>
                                <h4 className="font-medium text-gray-800 mb-1">{topic.title}</h4>
                                <p className="text-sm text-gray-600">{topic.content}</p>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <p className="text-gray-500 italic">No topics available for this learning plan yet.</p>
                  )}
                </div>
                

              </div>
            </div>
          ))}
        </div>
        
        {/* No results */}
        {filteredPlans.length === 0 && (
          <div className="text-center py-16">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            <h3 className="mt-2 text-lg font-medium text-gray-900">No learning plans found</h3>
            <p className="mt-1 text-gray-500">Try adjusting your search or filter criteria.</p>
            <div className="mt-6">
              <button 
                onClick={() => {
                  setSearchQuery('');
                  setActiveFilter('all');
                }} 
                className="px-4 py-2 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700"
              >
                Clear filters
              </button>
            </div>
          </div>
        )}

        {/* Create New Plan Button (Bottom) */}
        <div className="flex justify-center mt-12 mb-8">
          <button
            onClick={handleCreateNewLearningPlan}
            className="px-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg shadow-lg transition transform hover:scale-105"
          >
            Create Your Own Learning Plan
          </button>
        </div>
      </div>
      
      {/* Why Create a Learning Plan Section */}
      <div className="bg-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-center text-gray-800 mb-8">Why Create a History Learning Plan?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-blue-50 p-6 rounded-xl shadow">
              <div className="text-xl font-bold text-indigo-600 mb-3">Personalized</div>
              <p className="text-gray-700">Tailor your historical journey to your specific interests and learning style.</p>
            </div>
            <div className="bg-blue-50 p-6 rounded-xl shadow">
              <div className="text-xl font-bold text-indigo-600 mb-3">Structured</div>
              <p className="text-gray-700">Follow a clear historical timeline with carefully curated resources.</p>
            </div>
            <div className="bg-blue-50 p-6 rounded-xl shadow">
              <div className="text-xl font-bold text-indigo-600 mb-3">Engaging</div>
              <p className="text-gray-700">Dive deep into captivating historical narratives through interactive content.</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Footer */}
      <footer className="bg-indigo-900 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-lg font-bold mb-4">History Lovers Platform</h3>
              <p className="text-indigo-200">Your gateway to exploring the rich tapestry of human history.</p>
            </div>
            <div>
              <h3 className="text-lg font-bold mb-4">Popular Eras</h3>
              <ul className="space-y-2 text-indigo-200">
                <li>Ancient Civilizations</li>
                <li>Medieval Europe</li>
                <li>Renaissance</li>
                <li>Industrial Revolution</li>
                <li>Modern History</li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-bold mb-4">Connect With Us</h3>
              <div className="flex space-x-4">
                <a href="#" className="text-indigo-200 hover:text-white">
                  <span className="sr-only">Facebook</span>
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                  </svg>
                </a>
                <a href="#" className="text-indigo-200 hover:text-white">
                  <span className="sr-only">Instagram</span>
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" />
                  </svg>
                </a>
                <a href="#" className="text-indigo-200 hover:text-white">
                  <span className="sr-only">Twitter</span>
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
          <div className="border-t border-indigo-800 mt-8 pt-6 text-center text-indigo-200">
            <p>&copy; {new Date().getFullYear()} History Lovers Learning Platform. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default RetriveAllPlans;