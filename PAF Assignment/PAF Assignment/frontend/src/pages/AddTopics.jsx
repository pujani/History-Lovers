import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import axios from "axios";

function AddTopics() {
    const { planId } = useParams();
    const [showDeletePopup, setShowDeletePopup] = useState(false);
    const [selectedTopicId, setSelectedTopicId] = useState(null);
    const [planDetails, setPlanDetails] = useState(null);
    const navigate = useNavigate();
    const [showForm, setShowForm] = useState(false);
    const [existingLectures, setExistingLectures] = useState([]);
    const [topicData, setTopicData] = useState({
        title: '',
        content: '',
        url: '',
        planId: planId
    });

    useEffect(() => {
        axios.get(`http://localhost:8080/api/learningplans/getPlanByPlanId/${planId}`)
          .then((res) => {
            if (Array.isArray(res.data) && res.data.length > 0) {
              setPlanDetails(res.data[0]);    
            } else {
              console.warn("No plan found");
            }
          })
          .catch((err) => {
            console.error(err);
          });
    }, [planId]);

    useEffect(() => {
        axios.get(`http://localhost:8080/api/topics/getLectures/${planId}`)
          .then((res) => {
            setExistingLectures(res.data);
            console.log(res.data);
          })
          .catch((err) => {
            console.error(err);
          });
    }, [planId]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setTopicData(prevState => ({
          ...prevState,
          [name]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        axios.post(`http://localhost:8080/api/topics/addTopics`, {
          ...topicData,
          topicId: 0, // backend auto-generates
        })
        .then(() => {
          alert("Topic added successfully!");
          navigate(-1); // 👈 Go back to previous page
        })
        .catch(err => {
          console.error(err);
          alert("Failed to add topic!");
        });
    };

    const handleAddLectureClick = () => {
        setShowForm(true);
    };

    const extractYouTubeId = (url) => {
        try {
          if (url.includes("youtube.com")) {
            const urlParams = new URLSearchParams(new URL(url).search);
            return urlParams.get("v");
          } else if (url.includes("youtu.be")) {
            return url.split("/").pop();
          }
        } catch (error) {
          console.error("Invalid URL");
        }
        return null;
    };

    const handleDeleteLecture = (topicId) => {
        setSelectedTopicId(topicId);
        setShowDeletePopup(true);
    };
      
    //Delete Topic by TopicId 
    const confirmDeleteLecture = () => {
        axios.delete(`http://localhost:8080/api/topics/removeItem/${selectedTopicId}`)
          .then(() => {
            alert("Lecture deleted successfully!");
            setExistingLectures(prev => prev.filter(lecture => lecture.topicId !== selectedTopicId));
          })
          .catch(err => {
            console.error(err);
            alert("Failed to delete lecture!");
          })
          .finally(() => {
            setShowDeletePopup(false);
            setSelectedTopicId(null);
          });
    };
      
    const cancelDeleteLecture = () => {
        setShowDeletePopup(false);
        setSelectedTopicId(null);
    };
      
    const handleUpdateLecture = (lecture) => {
        navigate(`/updateLecture/${lecture.topicId}`, { state: { lecture } });
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-6xl mx-auto">
                {/* Header with animated underline */}
                <div className="text-center mb-12">
                    <h2 className="text-4xl font-extrabold text-indigo-700 mb-2 tracking-tight">
                        Learning Plan Details
                    </h2>
                    <div className="h-1 w-24 bg-gradient-to-r from-indigo-500 to-purple-500 mx-auto rounded-full"></div>
                </div>

                {planDetails ? (
                    <div className="bg-white rounded-2xl shadow-xl overflow-hidden transition-all duration-300 hover:shadow-2xl mb-12">
                        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 h-2"></div>
                        <div className="p-8">
                            {/* Plan Info with decorative elements */}
                            <h3 className="text-3xl font-bold text-gray-800 mb-3 flex items-center">
                                <span className="mr-3">📚</span> {planDetails.title}
                            </h3>
                            
                            <p className="text-gray-600 text-lg mb-6 italic border-l-4 border-indigo-300 pl-4">
                                {planDetails.description}
                            </p>
                            
                            <div className="flex flex-wrap gap-4 text-sm text-gray-500 mb-8">
                                <p className="bg-gray-100 px-3 py-1 rounded-full flex items-center">
                                    <span className="font-medium text-indigo-600 mr-1">Plan ID:</span> {planDetails.planId}
                                </p>
                                <p className="bg-gray-100 px-3 py-1 rounded-full flex items-center">
                                    <span className="font-medium text-indigo-600 mr-1">User ID:</span> {planDetails.userId}
                                </p>
                            </div>

                            {/* Add Lecture Section */}
                            {!showForm ? (
                                <div className="text-center mt-8">
                                    <button
                                        onClick={handleAddLectureClick}
                                        className="group relative inline-flex items-center justify-center px-8 py-3 overflow-hidden rounded-full bg-indigo-600 text-white font-medium shadow-lg transition-all duration-300 hover:bg-indigo-700 hover:shadow-indigo-200 hover:shadow-lg"
                                    >
                                        <span className="absolute right-0 flex h-10 w-10 translate-x-7 transform items-center justify-center rounded-full bg-white text-indigo-600 group-hover:translate-x-9 duration-300">
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                                            </svg>
                                        </span>
                                        <span className="pr-6">Add New Lecture</span>
                                    </button>
                                </div>
                            ) : (
                                <div className="bg-gray-50 p-6 rounded-xl shadow-inner">
                                    <form onSubmit={handleSubmit} className="mt-2">
                                        <h4 className="text-xl font-bold text-indigo-700 mb-6 flex items-center justify-center">
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 mr-2">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                            New Lecture Details
                                        </h4>

                                        <div className="mb-5">
                                            <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="title">Lecture Title</label>
                                            <input
                                                type="text"
                                                id="title"
                                                name="title"
                                                value={topicData.title}
                                                onChange={handleChange}
                                                required
                                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                                                placeholder="Enter lecture title"
                                            />
                                        </div>

                                        <div className="mb-5">
                                            <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="content">Lecture Content</label>
                                            <textarea
                                                id="content"
                                                name="content"
                                                value={topicData.content}
                                                onChange={handleChange}
                                                required
                                                rows="4"
                                                placeholder="Describe the lecture content"
                                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                                            ></textarea>
                                        </div>

                                        <div className="mb-6">
                                            <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="url">Reference URL</label>
                                            <input
                                                type="url"
                                                id="url"
                                                name="url"
                                                value={topicData.url}
                                                onChange={handleChange}
                                                placeholder="https://example.com"
                                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                                            />
                                        </div>

                                        <div className="flex gap-4">
                                            <button
                                                type="submit"
                                                className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 text-white py-3 rounded-lg hover:from-green-600 hover:to-emerald-700 transition-all font-medium shadow-md hover:shadow-lg"
                                            >
                                                Save Lecture
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => setShowForm(false)}
                                                className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-all"
                                            >
                                                Cancel
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            )}
                        </div>
                    </div>
                ) : (
                    <div className="text-center py-12">
                        <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600 mb-4"></div>
                        <p className="text-lg text-gray-600">Loading plan details...</p>
                    </div>
                )}

                {/* Lectures List */}
                {existingLectures.length > 0 && (
                    <div className="mb-8">
                        <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 mr-2 text-indigo-600">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 12h16.5m-16.5 3.75h16.5M3.75 19.5h16.5M5.625 4.5h12.75a1.875 1.875 0 010 3.75H5.625a1.875 1.875 0 010-3.75z" />
                            </svg>
                            Available Lectures ({existingLectures.length})
                        </h3>
                    </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {existingLectures.map((lecture, index) => {
                        const youtubeId = lecture.url ? extractYouTubeId(lecture.url) : null;
                        return (
                            <div key={index} className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden">
                                <div className="p-6">
                                    <div className="flex items-center mb-4">
                                        <div className="bg-indigo-100 text-indigo-700 rounded-full w-8 h-8 flex items-center justify-center font-bold mr-3">
                                            {index + 1}
                                        </div>
                                        <h3 className="text-xl font-bold text-gray-800">
                                            {lecture.title}
                                        </h3>
                                    </div>
                                    
                                    <p className="text-gray-600 mb-5 line-clamp-3">{lecture.content}</p>

                                    {youtubeId ? (
                                        <a href={lecture.url} target="_blank" rel="noopener noreferrer" className="block mb-5 group">
                                            <div className="relative rounded-lg overflow-hidden shadow-md group-hover:shadow-lg transition-all duration-300">
                                                <img
                                                    src={`https://img.youtube.com/vi/${youtubeId}/hqdefault.jpg`}
                                                    alt="YouTube Thumbnail"
                                                    className="w-full object-cover transform group-hover:scale-105 transition-transform duration-300"
                                                />
                                                <div className="absolute inset-0 bg-black bg-opacity-20 group-hover:bg-opacity-30 flex items-center justify-center transition-all duration-300">
                                                    <div className="bg-red-600 rounded-full p-3 shadow-lg transform group-hover:scale-110 transition-transform duration-300">
                                                        <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                                                            <path d="M8 5v14l11-7z" />
                                                        </svg>
                                                    </div>
                                                </div>
                                            </div>
                                        </a>
                                    ) : (
                                        lecture.url && (
                                            <a
                                                href={lecture.url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="inline-flex items-center text-indigo-600 hover:text-indigo-800 mb-5 group"
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-2">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m13.35-.622l1.757-1.757a4.5 4.5 0 00-6.364-6.364l-4.5 4.5a4.5 4.5 0 001.242 7.244" />
                                                </svg>
                                                <span className="group-hover:underline">Visit Reference Link</span>
                                            </a>
                                        )
                                    )}

                                    {/* Action Buttons */}
                                    <div className="flex gap-3 mt-4">
                                        <button
                                            onClick={() => handleUpdateLecture(lecture)}
                                            className="flex-1 flex items-center justify-center bg-blue-100 text-blue-700 px-4 py-2 rounded-lg hover:bg-blue-200 transition-colors font-medium"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-1">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                                            </svg>
                                            Update
                                        </button>
                                        <button
                                            onClick={() => handleDeleteLecture(lecture.topicId)}
                                            className="flex-1 flex items-center justify-center bg-red-100 text-red-700 px-4 py-2 rounded-lg hover:bg-red-200 transition-colors font-medium"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-1">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                                            </svg>
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Delete Confirmation Modal */}
                {showDeletePopup && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 backdrop-blur-sm">
                        <div className="bg-white p-8 rounded-xl shadow-2xl text-center max-w-md mx-4 transform transition-all duration-300 scale-100">
                            <div className="bg-red-100 p-3 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-8 h-8 text-red-600">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                                </svg>
                            </div>
                            <h2 className="text-2xl font-bold text-gray-800 mb-2">Confirm Delete</h2>
                            <p className="text-gray-600 mb-6">Are you sure you want to delete this lecture? This action cannot be undone.</p>
                            <div className="flex flex-col sm:flex-row justify-center gap-3 mt-6">
                                <button
                                    onClick={confirmDeleteLecture}
                                    className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition-colors duration-300 shadow-md hover:shadow-lg"
                                >
                                    Yes, Delete
                                </button>
                                <button
                                    onClick={cancelDeleteLecture}
                                    className="bg-gray-200 text-gray-800 px-6 py-2 rounded-lg hover:bg-gray-300 transition-colors duration-300"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

export default AddTopics