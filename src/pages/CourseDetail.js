import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './CourseDetail.css';

const API_URL = 'https://blackbot-academy-backend-production.up.railway.app/api';

export default function CourseDetail() {
  const { courseId } = useParams();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const response = await axios.get(
          `${API_URL}/courses/${courseId}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
          }
        );
        setCourse(response.data);
      } catch (error) {
        console.error('Error fetching course:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchCourse();
  }, [courseId]);

  if (loading) return <div>Loading...</div>;
  if (!course) return <div>Course not found</div>;

  return (
    <div className="course-detail">
      <button onClick={() => navigate(-1)}>← Back</button>
      <h1>{course.title}</h1>
      <p>{course.description}</p>
      <div className="lessons">
        <h2>Lessons</h2>
        {course.lessons && course.lessons.map((lesson) => (
          <div key={lesson._id} className="lesson-item">
            <h3>{lesson.title}</h3>
            <button onClick={() => navigate(`/lesson/${lesson._id}`)}>
              Start Lesson
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
