import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { courseService, enrollmentService } from '../services/api';
import '../styles/Dashboard.css';

function Dashboard() {
  const [courses, setCourses] = useState([]);
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [coursesRes, enrollmentsRes] = await Promise.all([
        courseService.getAllCourses(),
        enrollmentService.getMyEnrollments(),
      ]);
      setCourses(coursesRes.data);
      setEnrollments(enrollmentsRes.data);
    } catch (err) {
      setError('Failed to load courses');
    } finally {
      setLoading(false);
    }
  };

  const handleEnroll = async (courseId) => {
    try {
      await enrollmentService.enrollCourse(courseId);
      fetchData();
    } catch (err) {
      setError('Failed to enroll in course');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (loading) return <div className="dashboard-container">Loading...</div>;

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h1>Black Bot Academy</h1>
        <div className="user-info">
          <span>Welcome, {user?.firstName}</span>
          <button onClick={handleLogout}>Logout</button>
        </div>
      </header>

      {error && <div className="error-message">{error}</div>}

      <section className="dashboard-section">
        <h2>My Courses</h2>
        <div className="courses-grid">
          {enrollments.length > 0 ? (
            enrollments.map((enrollment) => (
              <div key={enrollment.id} className="course-card">
                <h3>{enrollment.course.title}</h3>
                <p>{enrollment.course.description}</p>
                <div className="progress-bar">
                  <div
                    className="progress-fill"
                    style={{ width: `${enrollment.progress || 0}%` }}
                  ></div>
                </div>
                <p className="progress-text">{enrollment.progress || 0}% Complete</p>
                <button onClick={() => navigate(`/course/${enrollment.course.id}`)}>
                  Continue Learning
                </button>
              </div>
            ))
          ) : (
            <p>You haven't enrolled in any courses yet.</p>
          )}
        </div>
      </section>

      <section className="dashboard-section">
        <h2>Available Courses</h2>
        <div className="courses-grid">
          {courses.map((course) => (
            <div key={course.id} className="course-card">
              <h3>{course.title}</h3>
              <p>{course.description}</p>
              <button onClick={() => handleEnroll(course.id)}>Enroll Now</button>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

export default Dashboard;
