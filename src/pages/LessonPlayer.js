import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { lessonService, quizService } from '../services/api';
import '../styles/LessonPlayer.css';

function LessonPlayer() {
  const { lessonId } = useParams();
  const navigate = useNavigate();
  const [lesson, setLesson] = useState(null);
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showQuiz, setShowQuiz] = useState(false);
  const [quizAnswers, setQuizAnswers] = useState({});

  useEffect(() => {
    fetchLessonData();
  }, [lessonId]);

  const fetchLessonData = async () => {
    try {
      const lessonRes = await lessonService.getLessonById(lessonId);
      setLesson(lessonRes.data);
      
      if (lessonRes.data.courseId) {
        const quizzesRes = await quizService.getQuizzesByCourse(lessonRes.data.courseId);
        setQuizzes(quizzesRes.data);
      }
    } catch (err) {
      setError('Failed to load lesson');
    } finally {
      setLoading(false);
    }
  };

  const handleAnswerChange = (questionId, answer) => {
    setQuizAnswers({
      ...quizAnswers,
      [questionId]: answer,
    });
  };

  const handleSubmitQuiz = async (quizId) => {
    try {
      await quizService.submitQuiz(quizId, { answers: quizAnswers });
      alert('Quiz submitted successfully!');
      setShowQuiz(false);
      setQuizAnswers({});
    } catch (err) {
      setError('Failed to submit quiz');
    }
  };

  if (loading) return <div className="lesson-player-container">Loading...</div>;
  if (error) return <div className="error-message">{error}</div>;

  return (
    <div className="lesson-player-container">
      <button className="back-button" onClick={() => navigate(-1)}>
        ← Back
      </button>

      <div className="lesson-content">
        <h1>{lesson?.title}</h1>
        <p className="lesson-description">{lesson?.description}</p>

        {lesson?.videoUrl && (
          <div className="video-container">
            <iframe
              width="100%"
              height="500"
              src={lesson.videoUrl}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              title={lesson.title}
            ></iframe>
          </div>
        )}

        <div className="lesson-text">
          {lesson?.content}
        </div>
      </div>

      {quizzes.length > 0 && (
        <section className="quiz-section">
          <h2>Take a Quiz</h2>
          {!showQuiz ? (
            <button onClick={() => setShowQuiz(true)} className="quiz-button">
              Start Quiz
            </button>
          ) : (
            <div className="quiz-container">
              {quizzes.map((quiz) => (
                <div key={quiz.id} className="quiz">
                  <h3>{quiz.title}</h3>
                  {quiz.questions.map((question) => (
                    <div key={question.id} className="quiz-question">
                      <p>{question.text}</p>
                      {question.options.map((option) => (
                        <label key={option.id}>
                          <input
                            type="radio"
                            name={`question-${question.id}`}
                            value={option.id}
                            onChange={() => handleAnswerChange(question.id, option.id)}
                          />
                          {option.text}
                        </label>
                      ))}
                    </div>
                  ))}
                  <button 
                    onClick={() => handleSubmitQuiz(quiz.id)}
                    className="submit-quiz-button"
                  >
                    Submit Quiz
                  </button>
                </div>
              ))}
            </div>
          )}
        </section>
      )}
    </div>
  );
}

export default LessonPlayer;
