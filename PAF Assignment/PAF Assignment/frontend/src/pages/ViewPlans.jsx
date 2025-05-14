import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from "axios";
import { 
  FaPencilAlt, FaTrash, FaBook, FaSearch, FaTimes, 
  FaPlus, FaAngleRight, FaCalendarAlt, FaChalkboardTeacher
} from "react-icons/fa";
import PlanSubHeader from '../components/PlanSubHeader';

function ViewPlans() {
    const { userId } = useParams();
    const navigate = useNavigate();
    const [plansForUserId, setPlansForUserId] = useState([]);
    const [isEditing, setIsEditing] = useState(false);
    const [currentPlan, setCurrentPlan] = useState({ planId: '', title: '', description: '' });
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [planToDelete, setPlanToDelete] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        setIsLoading(true);
        axios.get(`http://localhost:8080/api/learningplans/getLearningPlans/${userId}`)
            .then((res) => {
                setPlansForUserId(res.data);
                setIsLoading(false);
            })
            .catch(err => {
                console.error("Error fetching plans:", err);
                setIsLoading(false);
            });
    }, [userId]);

    const handleModify = (planId) => {
        navigate(`/addTopics/${planId}`);
    };

    const openEditPopup = (plan) => {
        setCurrentPlan(plan);
        setIsEditing(true);
    };

    const handleEditChange = (e) => {
        const { name, value } = e.target;
        setCurrentPlan(prev => ({ ...prev, [name]: value }));
    };

    const handleUpdatePlan = () => {
        axios.put(`http://localhost:8080/api/learningplans/updatePlan`, {
            planId: currentPlan.planId,
            title: currentPlan.title,
            description: currentPlan.description
        })
            .then(() => {
                setPlansForUserId(plansForUserId.map(plan => (
                    plan.planId === currentPlan.planId ? { ...plan, title: currentPlan.title, description: currentPlan.description } : plan
                )));
                setIsEditing(false);
                
                // Show toast notification instead of alert
                showToast("Plan updated successfully!");
            })
            .catch(error => {
                console.error("Error updating plan:", error);
                showToast("Failed to update the plan.", "error");
            });
    };

    const handleDelete = (planId, e) => {
        e.stopPropagation();
        setPlanToDelete(planId);
        setShowDeleteModal(true);
    };

    const confirmDelete = () => {
        if (planToDelete) {
            axios.delete(`http://localhost:8080/api/learningplans/removePlan/${planToDelete}`)
                .then(() => {
                    setPlansForUserId(plansForUserId.filter(plan => plan.planId !== planToDelete));
                    setShowDeleteModal(false);
                    showToast("Plan deleted successfully!");
                })
                .catch(error => {
                    console.error("Error deleting plan:", error);
                    showToast("Failed to delete the plan.", "error");
                });
        }
    };

    const cancelDelete = () => {
        setShowDeleteModal(false);
        setPlanToDelete(null);
    };

    const filteredPlans = plansForUserId.filter(plan =>
        plan.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const highlightMatch = (text) => {
        if (!searchTerm) return text;
        const regex = new RegExp(`(${searchTerm})`, 'gi');
        return text.split(regex).map((part, i) =>
            part.toLowerCase() === searchTerm.toLowerCase()
                ? <span key={i} className="bg-indigo-100 text-indigo-800 font-semibold">{part}</span>
                : part
        );
    };

    // Simple toast notification system
    const [toast, setToast] = useState({ show: false, message: '', type: 'success' });
    
    const showToast = (message, type = 'success') => {
        setToast({ show: true, message, type });
        setTimeout(() => setToast({ show: false, message: '', type: 'success' }), 3000);
    };

    // Card click handler
    const handleCardClick = (planId) => {
        handleModify(planId);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 pb-24">
            <PlanSubHeader />
            
            {/* Hero section */}
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-12 px-4 sm:px-6 lg:px-8 mb-8 shadow-lg">
                <div className="max-w-7xl mx-auto">
                    <div className="flex flex-col md:flex-row md:items-end justify-between">
                        <div className="mb-6 md:mb-0">
                            <h2 className="text-4xl md:text-5xl font-bold mb-2">History Lovers Learning Plans</h2>
                            
                            <p className="text-indigo-100 flex items-center">
                                <span className="inline-block bg-white/20 px-3 py-1 rounded-full text-sm">
                                    User ID: {userId}
                                </span>
                            </p>
                        </div>
                        
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Stats card */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                    <div className="bg-white rounded-2xl shadow-md p-6 flex items-center border-l-4 border-indigo-500">
                        <div className="p-3 bg-indigo-100 rounded-full mr-4">
                            <FaBook className="text-indigo-600 w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-gray-500 text-sm">Total Plans</p>
                            <p className="text-2xl font-bold text-gray-800">{plansForUserId.length}</p>
                        </div>
                    </div>
                    <div className="bg-white rounded-2xl shadow-md p-6 flex items-center border-l-4 border-purple-500">
                        <div className="p-3 bg-purple-100 rounded-full mr-4">
                            <FaChalkboardTeacher className="text-purple-600 w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-gray-500 text-sm">Active Plans</p>
                            <p className="text-2xl font-bold text-gray-800">{plansForUserId.length}</p>
                        </div>
                    </div>
                    <div className="bg-white rounded-2xl shadow-md p-6 flex items-center border-l-4 border-blue-500">
                        <div className="p-3 bg-blue-100 rounded-full mr-4">
                            <FaCalendarAlt className="text-blue-600 w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-gray-500 text-sm">Created Today</p>
                            <p className="text-2xl font-bold text-gray-800">2</p>
                        </div>
                    </div>
                    <div className="bg-white rounded-2xl shadow-md p-6 flex items-center border-l-4 border-green-500">
                        <div className="p-3 bg-green-100 rounded-full mr-4">
                            <FaSearch className="text-green-600 w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-gray-500 text-sm">Search Results</p>
                            <p className="text-2xl font-bold text-gray-800">{filteredPlans.length}</p>
                        </div>
                    </div>
                </div>

                {/* Search Bar */}
                <div className="mb-10">
                    <div className="relative max-w-2xl mx-auto">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <FaSearch className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                            type="text"
                            placeholder="Search plans by title..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-12 pr-14 py-4 w-full rounded-xl border-0 shadow-lg focus:ring-2 focus:ring-indigo-500 transition-all duration-200"
                        />
                        {searchTerm && (
                            <button
                                onClick={() => setSearchTerm('')}
                                className="absolute right-4 top-4 text-gray-400 hover:text-gray-600"
                            >
                                <FaTimes className="h-5 w-5" />
                            </button>
                        )}
                    </div>
                </div>
                
                {/* Loading State */}
{isLoading ? (
    <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-indigo-600"></div>
    </div>
) : filteredPlans.length === 0 ? (
    <div className="bg-white p-12 rounded-xl shadow-lg text-center max-w-lg mx-auto border border-gray-100">
        <div className="inline-flex justify-center items-center w-24 h-24 bg-indigo-100 rounded-full mb-6 animate-pulse">
            <FaBook className="h-10 w-10 text-indigo-600" />
        </div>
        <h3 className="text-2xl font-semibold text-gray-800 mb-3">No Plans Found</h3>
        <p className="text-gray-600 mb-8">Try searching with a different title or create your first learning plan.</p>
        <button 
            onClick={() => navigate('/create-plan')}
            className="inline-flex items-center px-8 py-4 rounded-lg bg-gradient-to-r from-indigo-600 to-indigo-700 text-white hover:from-indigo-700 hover:to-indigo-800 transition duration-300 shadow-md"
        >
            <FaPlus className="mr-2" />
            Create New Plan
        </button>
    </div>
) : (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredPlans.map((plan) => (
            <div
                key={plan.planId}
                onClick={() => handleCardClick(plan.planId)}
                className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 cursor-pointer group border border-gray-100"
            >
                <div className="h-2 bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-600 group-hover:h-3 transition-all duration-200"></div>
                <div className="p-7">
                    <div className="flex items-start justify-between mb-5">
                        <h3 className="text-xl font-bold text-gray-800 group-hover:text-indigo-700 transition-all duration-200 line-clamp-2">
                            {highlightMatch(plan.title)}
                        </h3>
                        <div className="flex space-x-3 ml-2">
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    openEditPopup(plan);
                                }}
                                className="p-2 rounded-full bg-amber-50 text-amber-500 hover:bg-amber-100 hover:text-amber-600 transition-all duration-200 transform hover:scale-110 shadow-sm"
                                aria-label="Edit plan"
                            >
                                <FaPencilAlt size={14} />
                            </button>
                            <button
                                onClick={(e) => handleDelete(plan.planId, e)}
                                className="p-2 rounded-full bg-red-50 text-red-500 hover:bg-red-100 hover:text-red-600 transition-all duration-200 transform hover:scale-110 shadow-sm"
                                aria-label="Delete plan"
                            >
                                <FaTrash size={14} />
                            </button>
                        </div>
                    </div>
                    <div className="h-24 overflow-hidden mb-6 relative">
                        <p className="text-gray-600">{plan.description}</p>
                        <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-white to-transparent"></div>
                    </div>
                    <div className="flex items-center justify-between mt-2">
                        <span className="inline-block py-1.5 px-3 rounded-full bg-indigo-100 text-indigo-700 text-xs font-medium shadow-sm">
                            ID: {plan.planId.toString().substring(0, 8)}
                        </span>
                        <div className="inline-flex items-center text-indigo-600 font-medium group-hover:translate-x-2 transition-all duration-200">
                            <span>Add Lectures</span>
                            <FaAngleRight className="ml-1.5 group-hover:ml-2 transition-all duration-200" size={16} />
                        </div>
                    </div>
                </div>
            </div>
        ))}
    </div>
)}
                
                {/* Toast Notification */}
                {toast.show && (
                    <div className={`fixed bottom-8 right-8 px-6 py-4 rounded-lg shadow-xl text-white ${toast.type === 'success' ? 'bg-green-500' : 'bg-red-500'} flex items-center animate-fade-in-up`}>
                        {toast.type === 'success' ? (
                            <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                            </svg>
                        ) : (
                            <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                            </svg>
                        )}
                        {toast.message}
                    </div>
                )}

                {/* Edit Modal */}
                {isEditing && (
                    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50" onClick={() => setIsEditing(false)}>
                        <div 
                            className="bg-white rounded-2xl p-8 w-full max-w-md shadow-2xl animate-modal-appear"
                            onClick={e => e.stopPropagation()}
                        >
                            <h2 className="text-2xl font-bold mb-6 text-indigo-800 border-b pb-2">Edit Plan</h2>
                            <div className="mb-6">
                                <label className="block mb-2 font-medium text-gray-700">Title</label>
                                <input
                                    type="text"
                                    name="title"
                                    value={currentPlan.title}
                                    onChange={handleEditChange}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                    placeholder="Enter plan title"
                                />
                            </div>
                            <div className="mb-6">
                                <label className="block mb-2 font-medium text-gray-700">Description</label>
                                <textarea
                                    name="description"
                                    value={currentPlan.description}
                                    onChange={handleEditChange}
                                    rows="4"
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                    placeholder="Enter plan description"
                                />
                            </div>
                            <div className="flex justify-end space-x-4">
                                <button
                                    onClick={() => setIsEditing(false)}
                                    className="px-6 py-3 rounded-lg bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium transition duration-200"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleUpdatePlan}
                                    className="px-6 py-3 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-medium transition duration-200 shadow-md flex items-center"
                                >
                                    <FaPencilAlt className="mr-2" size={14} />
                                    Update
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Delete Confirmation Modal */}
                {showDeleteModal && (
                    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50" onClick={cancelDelete}>
                        <div 
                            className="bg-white rounded-2xl p-8 w-full max-w-md shadow-2xl animate-modal-appear" 
                            onClick={e => e.stopPropagation()}
                        >
                            <div className="text-center mb-6">
                                <div className="inline-flex justify-center items-center w-16 h-16 bg-red-100 rounded-full mb-4">
                                    <FaTrash className="h-6 w-6 text-red-500" />
                                </div>
                                <h2 className="text-2xl font-bold text-gray-800">Delete Plan</h2>
                                <p className="mt-2 text-gray-600">Are you sure you want to delete this plan? This action cannot be undone.</p>
                            </div>
                            <div className="flex justify-center space-x-4">
                                <button
                                    onClick={cancelDelete}
                                    className="px-6 py-3 rounded-lg bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium transition duration-200 w-1/2"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={confirmDelete}
                                    className="px-6 py-3 rounded-lg bg-red-600 hover:bg-red-700 text-white font-medium transition duration-200 shadow-md w-1/2 flex items-center justify-center"
                                >
                                    <FaTrash className="mr-2" size={14} />
                                    Delete
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

// Add these animations to your CSS or tailwind.config.js
// tailwind.config.js
// module.exports = {
//   theme: {
//     extend: {
//       animation: {
//         'fade-in-up': 'fadeInUp 0.5s ease-out',
//         'modal-appear': 'modalAppear 0.3s ease-out',
//       },
//       keyframes: {
//         fadeInUp: {
//           '0%': { opacity: 0, transform: 'translateY(10px)' },
//           '100%': { opacity: 1, transform: 'translateY(0)' },
//         },
//         modalAppear: {
//           '0%': { opacity: 0, transform: 'scale(0.95)' },
//           '100%': { opacity: 1, transform: 'scale(1)' },
//         },
//       },
//     },
//   },
//   // rest of your config
// };

export default ViewPlans;