import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

import '../styles/CourseDetail.css';

function CourseDetail() {
  const { courseId } = useParams();
  const navigate = useNavigate();
  
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(
          `http://localhost:5000/api/courses/${courseId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setCourse(response.data);
      } catch (err) {
        setError('Failed to load course');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchCourse();
  }, [courseId]);

  if (loading) return <div className="loading">Loading course...</div>;
  if (error) return <div className="error">{error}</div>;
  if (!course) return <div className="error">Course not found</div>;

  return (
    <div className="course-detail">
      <button className="back-btn" onClick={() => navigate('/dashboard')}>
        ← Back to Dashboard
      </button>
      
      <div className="course-header">
        <h1>{course.title}</h1>
        <p className="course-instructor">By {course.instructor}</p>
      </div>

      <div className="course-info">
        <p className="course-description">{course.description}</p>
        <div className="course-meta">
          <span className="meta-item">📚 {course.lessons?.length || 0} Lessons</span>
          <span className="meta-item">⏱️ {course.duration}</span>
          <span className="meta-item">📊 {course.level}</span>
        </div>
      </div>

      <div className="lessons-section">
        <h2>Lessons</h2>
        <div className="lessons-list">
          {course.lessons && course.lessons.length > 0 ? (
            course.lessons.map((lesson) => (
              <div key={lesson._id} className="lesson-card">
                <div className="lesson-info">
                  <h3>{lesson.title}</h3>
                  <p className="lesson-duration">{lesson.duration} min</p>
                </div>
                <button 
                  className="play-btn"
                  onClick={() => navigate(`/lesson/${lesson._id}`)}
                >
                  ▶ Play
                </button>
              </div>
            ))
          ) : (
            <p>No lessons available yet</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default CourseDetail;
