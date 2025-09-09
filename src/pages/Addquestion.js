import React, { useState, useEffect } from "react";
import { availableMajors, questionsToAsk } from "../Data/majorsData.js";

const QuestionManager = () => {
  // localStorage에서 불러오기 (없으면 원본 사용)
  const loadQuestions = () => {
    const saved = localStorage.getItem("questions");
    if (saved) return JSON.parse(saved);

    const obj = {};
    questionsToAsk.forEach((q) => {
      obj[q.id] = { ...q };
    });
    return obj;
  };

  const [questions, setQuestions] = useState(loadQuestions());
  const [expanded, setExpanded] = useState({}); // weight 보이기 토글

  // 자동 저장
  useEffect(() => {
    localStorage.setItem("questions", JSON.stringify(questions));
  }, [questions]);

  // 질문 텍스트 업데이트
  const updatedQuestionText = (id, newText) => {
    setQuestions((prev) => ({
      ...prev,
      [id]: { ...prev[id], text: newText },
    }));
  };

  // 특정 weight 업데이트
  const updatedWeight = (id, index, newValue) => {
    setQuestions((prev) => {
      const updatedWeights = [...prev[id].weights];
      updatedWeights[index] = Number(newValue);
      return {
        ...prev,
        [id]: { ...prev[id], weights: updatedWeights },
      };
    });
  };

  // weight 토글
  const toggleWeights = (id) => {
    setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  // 질문 추가
  const addQuestion = () => {
    const newId = Math.max(...Object.keys(questions).map(Number)) + 1;
    setQuestions((prev) => ({
      ...prev,
      [newId]: {
        id: newId,
        text: "New Question",
        weights: Array(questionsToAsk[0].weights.length).fill(0),
      },
    }));
  };

  // 질문 삭제 + reindex
  const deleteQuestion = (id) => {
    const copy = { ...questions };
    delete copy[id];

    // reindex: id를 1부터 순서대로 다시 매김
    const reindexed = {};
    Object.values(copy)
      .sort((a, b) => a.id - b.id)
      .forEach((q, idx) => {
        reindexed[idx + 1] = { ...q, id: idx + 1 };
      });

    setQuestions(reindexed);
  };

  return (
    <div style={{ maxWidth: "700px", margin: "20px auto", fontFamily: "Arial, sans-serif" }}>
      <h2 style={{ textAlign: "center" }}>Question Manager</h2>
      <div style={{ textAlign: "center", marginBottom: "15px" }}>
        <button
          onClick={addQuestion}
          style={{
            padding: "8px 16px",
            backgroundColor: "#4CAF50",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          ➕ Add Question
        </button>
      </div>
      <ul style={{ listStyle: "none", padding: 0 }}>
        {Object.values(questions).map((q) => (
          <li
            key={q.id}
            style={{
              border: "1px solid #ddd",
              borderRadius: "8px",
              padding: "15px",
              marginBottom: "10px",
              backgroundColor: "#f9f9f9",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <input
                style={{ flex: 1, padding: "8px", marginRight: "10px", borderRadius: "5px", border: "1px solid #ccc" }}
                value={q.text}
                onChange={(e) => updatedQuestionText(q.id, e.target.value)}
              />
              <button
                onClick={() => toggleWeights(q.id)}
                style={{
                  padding: "5px 10px",
                  marginRight: "5px",
                  border: "none",
                  borderRadius: "5px",
                  cursor: "pointer",
                  backgroundColor: "#2196F3",
                  color: "white",
                }}
              >
                {expanded[q.id] ? "Hide Weights" : "Show Weights"}
              </button>
              <button
                onClick={() => deleteQuestion(q.id)}
                style={{
                  padding: "5px 10px",
                  border: "none",
                  borderRadius: "5px",
                  cursor: "pointer",
                  backgroundColor: "#f44336",
                  color: "white",
                }}
              >
                ❌ Delete
              </button>
            </div>
            {expanded[q.id] && (
              <ul style={{ marginTop: "10px", paddingLeft: "20px" }}>
                {q.weights.map((w, index) => (
                  <li key={index} style={{ marginBottom: "5px", display: "flex", alignItems: "center" }}>
                    <span style={{ width: "150px", fontSize: "0.9em" }}>{availableMajors[index].name}:</span>
                    <input
                      type="number"
                      value={w}
                      style={{
                        width: "40px",
                        padding: "2px 4px",
                        fontSize: "0.8em",
                        borderRadius: "3px",
                        border: "1px solid #ccc",
                        textAlign: "center",
                      }}
                      onChange={(e) => updatedWeight(q.id, index, Number(e.target.value))}
                    />
                  </li>
                ))}
              </ul>

            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default QuestionManager;
