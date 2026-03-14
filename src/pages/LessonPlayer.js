import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import '../styles/LessonPlayer.css';

function LessonPlayer() {
  const { lessonId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [lesson, setLesson] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isCompleted, setIsCompleted] = useState(false);

  useEffect(() => {
    const fetchLesson = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(
          `http://localhost:5000/api/lessons/${lessonId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setLesson(response.data);
      } catch (err) {
        setError('Failed to load lesson');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchLesson();
  }, [lessonId]);

  const handleMarkComplete = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.post(
        `http://localhost:5000/api/lessons/${lessonId}/complete`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setIsCompleted(true);
    } catch (err) {
      console.error('Failed to mark lesson complete:', err);
    }
  };

  if (loading) return <div className="loading">Loading lesson...</div>;
  if (error) return <div className="error">{error}</div>;
  if (!lesson) return <div className="error">Lesson not found</div>;

  return (
    <div className="lesson-player">
      <button className="back-btn" onClick={() => navigate(-1)}>
        ← Back
      </button>

      <div className="player-container">
        <div className="video-player">
          {lesson.videoUrl ? (
            <video 
              controls 
              width="100%"
              src={lesson.videoUrl}
            >
              Your browser does not support the video tag.
            </video>
          ) : (
            <div className="no-video">No video available</div>
          )}
        </div>

        <div className="lesson-content">
          <h1>{lesson.title}</h1>
          <p className="lesson-duration">⏱️ {lesson.duration} minutes</p>
          
          <div className="lesson-description">
            <h2>About this lesson</h2>
            <p>{lesson.description}</p>
          </div>

          {lesson.resources && lesson.resources.length > 0 && (
            <div className="resources-section">
              <h2>Resources</h2>
              <ul>
                {lesson.resources.map((resource, index) => (
                  <li key={index}>
                    <a href={resource.url} target="_blank" rel="noopener noreferrer">
                      {resource.title}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <button 
            className={`complete-btn ${isCompleted ? 'completed' : ''}`}
            onClick={handleMarkComplete}
            disabled={isCompleted}
          >
            {isCompleted ? '✓ Completed' : 'Mark as Complete'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default LessonPlayer;
