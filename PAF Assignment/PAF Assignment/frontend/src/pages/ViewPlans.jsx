import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from "axios";
import { FaPencilAlt, FaTrash, FaBook, FaSearch, FaTimes } from "react-icons/fa";
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

    useEffect(() => {
        axios.get(`http://localhost:8080/api/learningplans/getLearningPlans/${userId}`).then((res) => {
            setPlansForUserId(res.data);
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
                alert("Plan updated successfully!");
            })
            .catch(error => {
                console.error("Error updating plan:", error);
                alert("Failed to update the plan.");
            });
    };

    const handleDelete = (planId) => {
        setPlanToDelete(planId);
        setShowDeleteModal(true);
    };

    const confirmDelete = () => {
        if (planToDelete) {
            axios.delete(`http://localhost:8080/api/learningplans/removePlan/${planToDelete}`)
                .then(() => {
                    setPlansForUserId(plansForUserId.filter(plan => plan.planId !== planToDelete));
                    setShowDeleteModal(false);
                    alert("Plan deleted successfully!");
                })
                .catch(error => {
                    console.error("Error deleting plan:", error);
                    alert("Failed to delete the plan.");
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
                ? <span key={i} className="bg-yellow-200 font-semibold">{part}</span>
                : part
        );
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 py-12 px-4 sm:px-6 lg:px-8">
            <PlanSubHeader />
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-8">
                    <h2 className="text-3xl font-extrabold text-indigo-800 mb-2">Learning Plans</h2>
                    <p className="text-lg text-indigo-600">
                        User ID: <span className="font-semibold">{userId}</span>
                    </p>
                </div>

                {/* Search Bar */}
                <div className="mb-10 flex items-center max-w-md mx-auto">
                    <div className="relative w-full">
                        <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">
                            <FaSearch />
                        </span>
                        <input
                            type="text"
                            placeholder="Search plans by title..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10 pr-12 py-3 w-full rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                        {searchTerm && (
                            <button
                                onClick={() => setSearchTerm('')}
                                className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
                            >
                                <FaTimes />
                            </button>
                        )}
                    </div>
                </div>

                {filteredPlans.length === 0 ? (
                    <div className="bg-white p-12 rounded-xl shadow-md text-center">
                        <div className="inline-flex justify-center items-center w-20 h-20 bg-indigo-100 rounded-full mb-6">
                            <FaBook className="h-10 w-10 text-indigo-500" />
                        </div>
                        <h3 className="text-xl font-medium text-gray-800 mb-2">No Plans Found</h3>
                        <p className="text-gray-500">Try searching with a different title.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {filteredPlans.map((plan) => (
                            <div
                                key={plan.planId}
                                className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition duration-300 transform hover:-translate-y-1"
                            >
                                <div className="h-3 bg-gradient-to-r from-indigo-500 to-purple-600"></div>
                                <div className="p-6">
                                    <div className="flex items-start justify-between mb-4">
                                        <h3 className="text-xl font-bold text-gray-800 line-clamp-2">
                                            {highlightMatch(plan.title)}
                                        </h3>
                                        <div className="flex space-x-2">
                                            <button
                                                onClick={() => openEditPopup(plan)}
                                                className="p-2 rounded-full bg-amber-50 text-amber-500 hover:bg-amber-100 transition duration-200"
                                            >
                                                <FaPencilAlt size={16} />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(plan.planId)}
                                                className="p-2 rounded-full bg-red-50 text-red-500 hover:bg-red-100 transition duration-200"
                                            >
                                                <FaTrash size={16} />
                                            </button>
                                        </div>
                                    </div>
                                    <div className="h-24 overflow-hidden mb-6">
                                        <p className="text-gray-600">{plan.description}</p>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="inline-block py-1 px-3 rounded-full bg-indigo-100 text-indigo-600 text-xs font-medium">
                                            ID: {plan.planId.toString().substring(0, 8)}
                                        </span>
                                        <button
                                            onClick={() => handleModify(plan.planId)}
                                            className="inline-flex items-center px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition duration-200 shadow-md"
                                        >
                                            <FaBook className="mr-2" size={16} />
                                            Add Lectures
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Edit Modal */}
                {isEditing && (
                    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
                        <div className="bg-white rounded-2xl p-8 w-full max-w-md shadow-2xl" onClick={e => e.stopPropagation()}>
                            <h2 className="text-2xl font-bold mb-6 text-indigo-800">Edit Plan</h2>
                            <div className="mb-6">
                                <label className="block mb-2 font-medium text-gray-700">Title</label>
                                <input
                                    type="text"
                                    name="title"
                                    value={currentPlan.title}
                                    onChange={handleEditChange}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
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
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
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
                                    className="px-6 py-3 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-medium transition duration-200 shadow-md"
                                >
                                    Update
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Delete Confirmation Modal */}
                {showDeleteModal && (
                    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
                        <div className="bg-white rounded-2xl p-8 w-full max-w-md shadow-2xl" onClick={e => e.stopPropagation()}>
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
                                    className="px-6 py-3 rounded-lg bg-red-600 hover:bg-red-700 text-white font-medium transition duration-200 shadow-md w-1/2"
                                >
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

export default ViewPlans;
