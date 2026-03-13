import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { courseService, lessonService } from '../services/api';
import '../styles/CourseDetail.css';

function CourseDetail() {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchCourseData();
  }, [courseId]);

  const fetchCourseData = async () => {
    try {
      const [courseRes, lessonsRes] = await Promise.all([
        courseService.getCourseById(courseId),
        lessonService.getLessonsByCourse(courseId),
      ]);
      setCourse(courseRes.data);
      setLessons(lessonsRes.data);
    } catch (err) {
      setError('Failed to load course');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="course-detail-container">Loading...</div>;
  if (error) return <div className="error-message">{error}</div>;

  return (
    <div className="course-detail-container">
      <button className="back-button" onClick={() => navigate('/dashboard')}>
        ← Back to Dashboard
      </button>

      <h1>{course?.title}</h1>
      <p className="course-description">{course?.description}</p>

      <section className="lessons-section">
        <h2>Lessons</h2>
        <div className="lessons-list">
          {lessons.map((lesson) => (
            <div key={lesson.id} className="lesson-item">
              <h3>{lesson.title}</h3>
              <p>{lesson.description}</p>
              <button onClick={() => navigate(`/lesson/${lesson.id}`)}>
                View Lesson
              </button>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

export default CourseDetail;
