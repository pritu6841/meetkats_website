import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

// Hardcoded quiz data
const hardcodedQuiz = {
  title: 'Marvel Cinematic Universe Challenge',
  timer: 600, // 10 minutes in seconds
  questions: [
    // Easy (8 Questions)
    {
      text: 'What is the name of Tony Stark’s company in Iron Man (2008)?',
      options: ['Stark Enterprises', 'Stark Industries', 'Stark Tech', 'Stark Solutions'],
      correct: 1,
    },
    {
      text: 'What does S.H.I.E.L.D. stand for?',
      options: [
        'Super Heroes International Law Division',
        'Strategic Homeland Intervention, Enforcement, and Logistics Division',
        'Supreme Headquarters for International Espionage and Law Division',
        'Security Headquarters In International Law Division',
      ],
      correct: 1,
    },
    {
      text: 'Who is the villain in Iron Man 2?',
      options: ['Justin Hammer', 'Mandarin', 'Ivan Vanko (Whiplash)', 'Obadiah Stane'],
      correct: 2,
    },
    {
      text: 'What is the name of the alien race that attacks New York in The Avengers?',
      options: ['Skrulls', 'Chitauri', 'Kree', 'Symbiotes'],
      correct: 1,
    },
    {
      text: 'Who creates Ultron in Avengers: Age of Ultron?',
      options: ['Bruce Banner', 'Tony Stark', 'Hank Pym', 'Nick Fury'],
      correct: 1,
    },
    {
      text: 'How many infinity stones are there?',
      options: ['5', '6', '7', '8'],
      correct: 1,
    },
    {
      text: 'Who takes up the Captain America mantle at the end of Endgame?',
      options: ['Bucky Barnes', 'Sam Wilson', 'Sharon Carter', 'Clint Barton'],
      correct: 1,
    },
    {
      text: 'What’s the name of AI that replaces J.A.R.V.I.S. after Age of Ultron?',
      options: ['EDITH', 'FRIDAY', 'KAREN', 'HOMER'],
      correct: 1,
    },
    // Medium (7 Questions)
    {
      text: 'What realm is Thor originally from?',
      options: ['Midgard', 'Jotunheim', 'Asgard', 'Nidavellir'],
      correct: 2,
    },
    {
      text: 'What is the name of Scott Lang’s daughter?',
      options: ['Cindy', 'Cassie', 'Carol', 'Katie'],
      correct: 1,
    },
    {
      text: 'Who recruits Spider-Man in Captain America: Civil War?',
      options: ['Captain America', 'Hawkeye', 'Black Widow', 'Iron Man'],
      correct: 3,
    },
    {
      text: 'What is the name of Black Panther’s country?',
      options: ['Zamunda', 'Wakanda', 'Genosha', 'Sokovia'],
      correct: 1,
    },
    {
      text: 'What’s the name of Thanos’s home planet?',
      options: ['Titan', 'Xandar', 'Vormir', 'Hala'],
      correct: 0,
    },
    {
      text: 'How many years pass between the snap and the Avengers’ time heist?',
      options: ['3', '5', '7', '10'],
      correct: 1,
    },
    {
      text: 'Who is revealed to be behind the TVA in Loki?',
      options: ['Time-Keepers', 'Loki himself', 'Kang the Conqueror', 'Ravonna Renslayer'],
      correct: 2,
    },
    // Difficult (5 Questions)
    {
      text: 'Who mentors Kamala in her heroic journey?',
      options: ['Nick Fury', 'Iron Man', 'Captain Marvel', 'Monica Rambeau'],
      correct: 2,
    },
    {
      text: 'What powerful entity do the Ten Rings connect to in Shang-Chi?',
      options: ['Mandarin', 'Fin Fang Foom', 'Dweller-in-Darkness', 'K’un-Lun'],
      correct: 2,
    },
    {
      text: 'What causes the multiverse to crack in No Way Home?',
      options: ['Kang’s intervention', 'Doctor Strange’s spell', 'Thanos using the Gauntlet', 'Loki’s escape'],
      correct: 1,
    },
    {
      text: 'What was the first MCU project where Ironheart appeared?',
      options: ['Ironheart (TV series)', 'Ms. Marvel', 'Black Panther: Wakanda Forever', 'Spider-Man: No Way Home'],
      correct: 2,
    },
    {
      text: 'What character dies twice in Infinity War?',
      options: ['Loki', 'Vision', 'Gamora', 'Iron Man'],
      correct: 1,
    },
  ],
};

const QuizPlatform = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  React.useEffect(() => {
    if (!loading && !user) {
      navigate('/login', { replace: true });
    }
  }, [user, loading, navigate]);

  const [currentQuiz] = useState(hardcodedQuiz);
  const [userAnswers, setUserAnswers] = useState(Array(hardcodedQuiz.questions.length).fill(null));
  const [quizResult, setQuizResult] = useState(null);
  const [leaderboard, setLeaderboard] = useState([]);
  const [timeLeft, setTimeLeft] = useState(hardcodedQuiz.timer);
  const [timerActive, setTimerActive] = useState(false);
  const [step, setStep] = useState('intro'); // intro | quiz | result | leaderboard

  // Start quiz
  const handleStartQuiz = () => {
    setUserAnswers(Array(currentQuiz.questions.length).fill(null));
    setQuizResult(null);
    setTimeLeft(currentQuiz.timer);
    setTimerActive(true);
    setStep('quiz');
  };

  // Submit quiz
  const handleSubmitQuiz = () => {
    let score = 0;
    currentQuiz.questions.forEach((q, idx) => {
      if (userAnswers[idx] === q.correct) score++;
    });
    setQuizResult({ score, total: currentQuiz.questions.length });
    setTimerActive(false);
    // Update leaderboard (still store for admin/future use)
    setLeaderboard((prev) => {
      const entry = { score, time: currentQuiz.timer - timeLeft, date: new Date().toLocaleString() };
      return [...prev, entry];
    });
    setStep('thankyou'); // Go to thank you page instead of result
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

  // Format time mm:ss
  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  // Quiz attempt component
  const QuizAttempt = () => (
    <div className="bg-white rounded-xl shadow-lg p-8 mb-8 animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-blue-700">{currentQuiz.title}</h2>
        <div className="text-lg font-semibold text-red-600 bg-red-100 px-4 py-1 rounded-full shadow">Time Left: {formatTime(timeLeft)}</div>
      </div>
      <div className="space-y-8">
        {currentQuiz.questions.map((q, idx) => (
          <div key={idx} className="mb-4">
            <div className="font-semibold mb-2 text-lg text-gray-800">Q{idx + 1}: {q.text}</div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {q.options.map((opt, oidx) => (
                <label key={oidx} className={`flex items-center border rounded-lg px-4 py-2 cursor-pointer transition-all duration-150 shadow-sm hover:shadow-md ${userAnswers[idx] === oidx ? 'bg-blue-100 border-blue-500' : 'bg-gray-50 border-gray-200'}`}>
                  <input
                    type="radio"
                    name={`q${idx}`}
                    checked={userAnswers[idx] === oidx}
                    onChange={() => setUserAnswers(ans => { const copy = [...ans]; copy[idx] = oidx; return copy; })}
                    className="mr-3 accent-blue-600"
                  />
                  <span className="text-gray-700">{opt}</span>
                </label>
              ))}
            </div>
          </div>
        ))}
      </div>
      <div className="flex justify-end mt-8">
        <button
          className="bg-gradient-to-r from-blue-500 to-blue-700 text-white px-6 py-2 rounded-lg font-semibold shadow hover:from-blue-600 hover:to-blue-800 transition-all"
          onClick={handleSubmitQuiz}
        >
          Submit Quiz
        </button>
      </div>
    </div>
  );

  // Quiz result
  const QuizResult = () => (
    <div className="bg-green-50 rounded-xl shadow-lg p-8 mb-8 text-center animate-fade-in">
      <h2 className="text-2xl font-bold text-green-700 mb-4">Quiz Result</h2>
      <div className="text-4xl font-extrabold mb-2">{quizResult.score} / {quizResult.total}</div>
      <div className="text-lg text-gray-700 mb-6">{quizResult.score === quizResult.total ? 'Perfect Score! 🎉' : quizResult.score > quizResult.total / 2 ? 'Great job!' : 'Keep practicing!'}</div>
      <button
        className="bg-gradient-to-r from-blue-500 to-blue-700 text-white px-6 py-2 rounded-lg font-semibold shadow hover:from-blue-600 hover:to-blue-800 transition-all mr-4"
        onClick={() => setStep('leaderboard')}
      >
        View Leaderboard
      </button>
      <button
        className="bg-gray-300 text-gray-800 px-6 py-2 rounded-lg font-semibold shadow hover:bg-gray-400 transition-all"
        onClick={() => setStep('intro')}
      >
        Back to Home
      </button>
    </div>
  );

  // Leaderboard
  const Leaderboard = () => {
    const sorted = [...leaderboard].sort((a, b) => b.score - a.score || a.time - b.time);
    return (
      <div className="bg-yellow-50 rounded-xl shadow-lg p-8 mb-8 animate-fade-in">
        <h2 className="text-2xl font-bold text-yellow-700 mb-4">Leaderboard</h2>
        {sorted.length === 0 ? <p className="text-gray-500">No attempts yet.</p> : (
          <table className="w-full text-left">
            <thead>
              <tr>
                <th className="py-2 px-2">Rank</th>
                <th className="py-2 px-2">Score</th>
                <th className="py-2 px-2">Time (mm:ss)</th>
                <th className="py-2 px-2">Date</th>
              </tr>
            </thead>
            <tbody>
              {sorted.map((entry, idx) => (
                <tr key={idx} className="border-t">
                  <td className="py-2 px-2 font-semibold">{idx + 1}</td>
                  <td className="py-2 px-2">{entry.score}</td>
                  <td className="py-2 px-2">{formatTime(entry.time)}</td>
                  <td className="py-2 px-2 text-xs text-gray-500">{entry.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        <div className="flex justify-center mt-6">
          <button
            className="bg-gradient-to-r from-blue-500 to-blue-700 text-white px-6 py-2 rounded-lg font-semibold shadow hover:from-blue-600 hover:to-blue-800 transition-all"
            onClick={() => setStep('intro')}
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  };

  // Intro/landing
  const Intro = () => (
    <div className="bg-white rounded-xl shadow-lg p-10 mb-8 text-center animate-fade-in">
      <h1 className="text-4xl font-extrabold mb-4 text-blue-700">Welcome to the Quiz Platform!</h1>
      <p className="text-lg text-gray-700 mb-8">Test your knowledge with our 10-question General Knowledge Challenge. You have <span className="font-bold text-blue-600">10 minutes</span> to complete the quiz. Good luck!</p>
      <button
        className="bg-gradient-to-r from-green-500 to-green-700 text-white px-8 py-3 rounded-lg font-bold text-lg shadow hover:from-green-600 hover:to-green-800 transition-all"
        onClick={handleStartQuiz}
      >
        Start Quiz
      </button>
      {/* Leaderboard button removed for users */}
    </div>
  );

  // Thank you page after quiz submission
  const ThankYou = () => (
    <div className="bg-white rounded-xl shadow-lg p-10 mb-8 text-center animate-fade-in">
      <h2 className="text-3xl font-bold text-green-700 mb-4">Thank You for Attempting the Quiz!</h2>
      <p className="text-lg text-gray-700 mb-6">Your responses have been recorded. Results and winners will be announced soon. Stay tuned!</p>
      <button
        className="bg-gradient-to-r from-blue-500 to-blue-700 text-white px-8 py-3 rounded-lg font-bold text-lg shadow hover:from-blue-600 hover:to-blue-800 transition-all"
        onClick={() => setStep('intro')}
      >
        Back to Home
      </button>
      {/* Leaderboard button removed for users */}
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 flex flex-col items-center justify-start py-10 px-2">
      <div className="w-full max-w-3xl">
        {step === 'intro' && <Intro />}
        {step === 'quiz' && <QuizAttempt />}
        {step === 'thankyou' && <ThankYou />}
        {/* Leaderboard is not accessible to users anymore */}
      </div>
    </div>
  );
};

export default QuizPlatform; 
// export default QuizPlatform; 