import React, { useState } from 'react';

// Simple demo: toggle this to true to show admin features
const isAdmin = true;

const initialQuizzes = [];

const QuizPlatform = () => {
  const [quizzes, setQuizzes] = useState(initialQuizzes);
  const [showCreation, setShowCreation] = useState(false);
  const [currentQuiz, setCurrentQuiz] = useState(null);
  const [userAnswers, setUserAnswers] = useState([]);
  const [quizResult, setQuizResult] = useState(null);
  const [leaderboard, setLeaderboard] = useState({});
  const [timer, setTimer] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [timerActive, setTimerActive] = useState(false);

  // Admin: Create a new quiz
  const handleCreateQuiz = (quiz) => {
    setQuizzes([...quizzes, quiz]);
    setShowCreation(false);
  };

  // Admin: Cancel quiz creation
  const handleCancelCreate = () => {
    setShowCreation(false);
  };

  // Admin: Delete a quiz
  const handleDeleteQuiz = (idx) => {
    setQuizzes(quizzes.filter((_, i) => i !== idx));
  };

  // User: Start a quiz
  const handleStartQuiz = (quiz) => {
    setCurrentQuiz(quiz);
    setUserAnswers(Array(quiz.questions.length).fill(null));
    setQuizResult(null);
    setTimeLeft(quiz.timer || 60);
    setTimerActive(true);
  };

  // User: Submit quiz
  const handleSubmitQuiz = () => {
    if (!currentQuiz) return;
    let score = 0;
    currentQuiz.questions.forEach((q, idx) => {
      if (userAnswers[idx] === q.correct) score++;
    });
    setQuizResult({ score, total: currentQuiz.questions.length });
    setTimerActive(false);
    // Update leaderboard
    setLeaderboard((prev) => {
      const quizId = currentQuiz.title;
      const entry = { score, time: (currentQuiz.timer || 60) - timeLeft };
      const updated = prev[quizId] ? [...prev[quizId], entry] : [entry];
      return { ...prev, [quizId]: updated };
    });
  };

  // Timer effect
  React.useEffect(() => {
    if (timerActive && timeLeft > 0) {
      const interval = setInterval(() => setTimeLeft((t) => t - 1), 1000);
      return () => clearInterval(interval);
    } else if (timerActive && timeLeft === 0) {
      handleSubmitQuiz();
    }
  }, [timerActive, timeLeft]);

  // Quiz creation form (admin only)
  const QuizCreationForm = ({ onCreate }) => {
    const [title, setTitle] = useState('');
    const [timer, setTimer] = useState(60);
    const [questions, setQuestions] = useState([
      { text: '', options: ['', '', '', ''], correct: 0 },
    ]);

    const handleQuestionChange = (idx, field, value) => {
      const updated = [...questions];
      if (field === 'text') updated[idx].text = value;
      else if (field.startsWith('option')) {
        const optIdx = parseInt(field.split('-')[1], 10);
        updated[idx].options[optIdx] = value;
      } else if (field === 'correct') {
        updated[idx].correct = parseInt(value, 10);
      }
      setQuestions(updated);
    };

    const addQuestion = () => {
      setQuestions([...questions, { text: '', options: ['', '', '', ''], correct: 0 }]);
    };

    const handleSubmit = (e) => {
      e.preventDefault();
      onCreate({ title, timer, questions });
    };

    return (
      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Create New Quiz</h2>
        <div className="mb-4">
          <label className="block mb-1 font-medium">Quiz Title</label>
          <input className="border rounded px-2 py-1 w-full" value={title} onChange={e => setTitle(e.target.value)} required />
        </div>
        <div className="mb-4">
          <label className="block mb-1 font-medium">Timer (seconds)</label>
          <input type="number" className="border rounded px-2 py-1 w-full" value={timer} onChange={e => setTimer(Number(e.target.value))} min={10} required />
        </div>
        {questions.map((q, idx) => (
          <div key={idx} className="mb-4 border-b pb-4">
            <label className="block mb-1 font-medium">Question {idx + 1}</label>
            <input className="border rounded px-2 py-1 w-full mb-2" value={q.text} onChange={e => handleQuestionChange(idx, 'text', e.target.value)} placeholder="Question text" required />
            <div className="grid grid-cols-2 gap-2 mb-2">
              {q.options.map((opt, oidx) => (
                <input key={oidx} className="border rounded px-2 py-1" value={opt} onChange={e => handleQuestionChange(idx, `option-${oidx}`, e.target.value)} placeholder={`Option ${oidx + 1}`} required />
              ))}
            </div>
            <label className="block mb-1 font-medium">Correct Option</label>
            <select className="border rounded px-2 py-1 w-full" value={q.correct} onChange={e => handleQuestionChange(idx, 'correct', e.target.value)}>
              {q.options.map((_, oidx) => (
                <option key={oidx} value={oidx}>{`Option ${oidx + 1}`}</option>
              ))}
            </select>
          </div>
        ))}
        <button type="button" className="bg-blue-500 text-white px-3 py-1 rounded mr-2" onClick={addQuestion}>Add Question</button>
        <button type="submit" className="bg-green-600 text-white px-3 py-1 rounded mr-2">Create Quiz</button>
        <button type="button" className="bg-gray-400 text-white px-3 py-1 rounded" onClick={handleCancelCreate}>Cancel</button>
      </form>
    );
  };

  // Quiz list for users
  const QuizList = () => (
    <div className="mb-6">
      <h2 className="text-xl font-semibold mb-4">Available Quizzes</h2>
      {quizzes.length === 0 ? (
        <p className="text-gray-500">No quizzes available yet.</p>
      ) : (
        <ul className="space-y-2">
          {quizzes.map((quiz, idx) => (
            <li key={idx} className="flex items-center justify-between bg-gray-100 rounded px-4 py-2">
              <span className="font-medium">{quiz.title}</span>
              <div className="flex gap-2">
                <button className="bg-blue-500 text-white px-3 py-1 rounded" onClick={() => handleStartQuiz(quiz)}>Attempt</button>
                {isAdmin && (
                  <button className="bg-red-500 text-white px-3 py-1 rounded" onClick={() => handleDeleteQuiz(idx)}>Delete</button>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );

  // Quiz attempt component
  const QuizAttempt = () => (
    <div className="bg-white rounded-lg shadow p-6 mb-6">
      <h2 className="text-xl font-semibold mb-4">Quiz: {currentQuiz.title}</h2>
      <div className="mb-4 text-right text-red-600 font-bold">Time Left: {timeLeft}s</div>
      {currentQuiz.questions.map((q, idx) => (
        <div key={idx} className="mb-4">
          <div className="font-medium mb-2">Q{idx + 1}: {q.text}</div>
          <div className="grid grid-cols-2 gap-2">
            {q.options.map((opt, oidx) => (
              <label key={oidx} className={`border rounded px-2 py-1 cursor-pointer ${userAnswers[idx] === oidx ? 'bg-blue-100 border-blue-500' : ''}`}>
                <input
                  type="radio"
                  name={`q${idx}`}
                  checked={userAnswers[idx] === oidx}
                  onChange={() => setUserAnswers(ans => { const copy = [...ans]; copy[idx] = oidx; return copy; })}
                  className="mr-2"
                />
                {opt}
              </label>
            ))}
          </div>
        </div>
      ))}
      <button className="bg-green-600 text-white px-4 py-2 rounded" onClick={handleSubmitQuiz}>Submit Quiz</button>
    </div>
  );

  // Quiz result
  const QuizResult = () => (
    <div className="bg-green-100 rounded-lg shadow p-6 mb-6 text-center">
      <h2 className="text-xl font-semibold mb-2">Quiz Result</h2>
      <div className="text-2xl font-bold mb-2">Score: {quizResult.score} / {quizResult.total}</div>
      <button className="bg-blue-500 text-white px-3 py-1 rounded" onClick={() => { setCurrentQuiz(null); setQuizResult(null); }}>Back to Quizzes</button>
    </div>
  );

  // Leaderboard
  const Leaderboard = ({ quiz }) => {
    const entries = leaderboard[quiz.title] || [];
    const sorted = [...entries].sort((a, b) => b.score - a.score || a.time - b.time);
    return (
      <div className="bg-yellow-100 rounded-lg shadow p-6 mb-6">
        <h2 className="text-xl font-semibold mb-2">Leaderboard</h2>
        {sorted.length === 0 ? <p className="text-gray-500">No attempts yet.</p> : (
          <table className="w-full text-left">
            <thead>
              <tr>
                <th className="py-1">Rank</th>
                <th className="py-1">Score</th>
                <th className="py-1">Time (s)</th>
              </tr>
            </thead>
            <tbody>
              {sorted.map((entry, idx) => (
                <tr key={idx} className="border-t">
                  <td className="py-1">{idx + 1}</td>
                  <td className="py-1">{entry.score}</td>
                  <td className="py-1">{entry.time}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    );
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-6 text-center">Quiz Platform</h1>
      {isAdmin && !showCreation && (
        <button className="bg-blue-600 text-white px-4 py-2 rounded mb-6" onClick={() => setShowCreation(true)}>
          + Create New Quiz
        </button>
      )}
      {isAdmin && showCreation && (
        <QuizCreationForm onCreate={handleCreateQuiz} />
      )}
      {!currentQuiz && <QuizList />}
      {currentQuiz && !quizResult && <QuizAttempt />}
      {quizResult && <QuizResult />}
      {currentQuiz && <Leaderboard quiz={currentQuiz} />}
    </div>
  );
};

export default QuizPlatform; 