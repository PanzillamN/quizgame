import React, { useState, useEffect } from "react";
import Confetti from "react-confetti";
import { getRandomQuestions } from "../data/questions";

export default function QuizGame() {
  const [questions, setQuestions] = useState([]);
  const [current, setCurrent] = useState(0);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);
  const [name, setName] = useState("");
  const [scores, setScores] = useState([]);
  const [timeLeft, setTimeLeft] = useState(15);
  const dingSound = new Audio("/sounds/ding.mp3");
  const buzzSound = new Audio("/sounds/buzz.mp3");
  const winMusic = new Audio("/sounds/win.mp3");

    useEffect(() => {
    if (finished) return;

    if (timeLeft === 0) {
      handleNext();
    }

    const timer = setTimeout(() => {
      setTimeLeft(timeLeft - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [timeLeft, finished]);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("scores")) || [];
    setScores(saved);
  }, []);

  useEffect(() => {
    setQuestions(getRandomQuestions(10));
  }, []);

  const handleAnswer = (option) => {
    if (option === questions[current].answer) {
      setScore(score + 1);
      dingSound.play();
    } else {
      buzzSound.play();
    }
    const next = current + 1;
    if (next < questions.length) {
      setCurrent(next);
    } else {
      setFinished(true);
    }
  };
const handleNext = () => {
    const next = current + 1;
    if (next < questions.length) {
      setCurrent(next);
      setTimeLeft(15);
    } else {
      setFinished(true);
      winMusic.play();
    }
  };
  const handleSaveScore = () => {
    if (!name.trim()) return;
    const newScores = [...scores, { name, score }];
    setScores(newScores);
    localStorage.setItem("scores", JSON.stringify(newScores));
    setName("");
  };

  const restartGame = () => {
    setScore(0);
    setCurrent(0);
    setFinished(false);
    setQuestions(getRandomQuestions(10));
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-blue-100 to-blue-200 p-6 relative">
      {finished && <Confetti />} {/* 🎆 Fireworks */}

      <div className="bg-white shadow-2xl rounded-2xl p-8 w-full max-w-md">
        {!finished && questions.length > 0 ? (
          <>
            <h2 className="text-2xl font-bold mb-6 text-blue-700 text-center">
              {questions[current].question}
            </h2>
            <div className="grid gap-4">
              {questions[current].options.map((option, i) => (
                <button
                  key={i}
                  onClick={() => handleAnswer(option)}
                  className="p-3 bg-blue-500 text-white font-medium rounded-xl hover:bg-blue-600 transition"
                >
                  {option}
                </button>
              ))}
            </div>
            <p className="mt-6 text-gray-500 text-center">
              Асуулт {current + 1} / {questions.length}
            </p>
          </>
        ) : finished ? (
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4 text-green-600">
              Тоглоом дууслаа! 🎉
            </h2>
            <p className="text-lg mb-6">
              Таны оноо:{" "}
              <span className="font-bold text-blue-700">
                {score} / {questions.length}
              </span>
            </p>

          
            <input
              type="text"
              placeholder="Нэрээ оруулна уу"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="border p-2 w-full rounded mb-2"
            />
            <button
              onClick={handleSaveScore}
              className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
            >
              Оноогоо хадгалах
            </button>

          
            <h3 className="text-xl font-bold mt-6">🏆 Scoreboard</h3>
            <ul className="mt-2 text-left">
              {scores.map((s, i) => (
                <li key={i} className="border-b py-1">
                  {s.name} — {s.score}
                </li>
              ))}
            </ul>

            <button
              onClick={restartGame}
              className="mt-6 px-6 py-3 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition"
            >
              Дахин тоглох
            </button>
          </div>
        ) : (
          <p>Асуултуудыг ачаалж байна...</p>
        )}
      </div>
    </div>
  );
}