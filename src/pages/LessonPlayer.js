import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './LessonPlayer.css';

const API_URL = 'https://blackbot-academy-backend-production.up.railway.app/api';

export default function LessonPlayer() {
  const { lessonId } = useParams();
  const [lesson, setLesson] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchLesson = async () => {
      try {
        const response = await axios.get(
          `${API_URL}/lessons/${lessonId}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
          }
        );
        setLesson(response.data);
      } catch (error) {
        console.error('Error fetching lesson:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchLesson();
  }, [lessonId]);

  const completeLesson = async () => {
    try {
      await axios.post(
        `${API_URL}/lessons/${lessonId}/complete`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      alert('Lesson completed!');
      navigate(-1);
    } catch (error) {
      console.error('Error completing lesson:', error);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (!lesson) return <div>Lesson not found</div>;

  return (
    <div className="lesson-player">
      <button onClick={() => navigate(-1)}>← Back</button>
      <h1>{lesson.title}</h1>
      <div className="video-container">
        <video controls width="100%">
          <source src={lesson.videoUrl} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </div>
      <p>{lesson.description}</p>
      <button onClick={completeLesson} className="complete-btn">
        Mark as Complete
      </button>
    </div>
  );
}
