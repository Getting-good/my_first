import React, { useState } from "react";// import useState from react for reselect/pickMaj/ansQuestion
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";//using font awesome library
import { faCheckCircle } from "@fortawesome/free-solid-svg-icons";//using font awesome library
import { availableMajors, questionsToAsk } from "../Data/majorsData.js"; // //importing majors from majorData.js , questions are from localStorage
import { motion } from "framer-motion";

/**
 * Loads questions by getting them from the localStorage.
 * @returns All questions from storage. 
 */
const loadQuestions = () => {
  const saved = localStorage.getItem("questions");
  let questionsObj;
  if (saved) {
    questionsObj = JSON.parse(saved);
  } else {
    // 저장된 게 없으면 기본 questionsToAsk 사용
    questionsObj = {};
    questionsToAsk.forEach((q) => {
      questionsObj[q.id] = { ...q };
    });
  }
  // 객체 -> 배열 변환, id순 정렬
  return Object.values(questionsObj).sort((a, b) => a.id - b.id);
};

/**
  * Sorts majors list by affinity and retrieves the major with highest affinity.
  * @note If affinities are equal when sorting, precedence goes to item1.
  * @function
  * @returns The major with the highest affinity score.
  */
const getHighestAffinityMajor = (majors) => {
  const sorted = [...majors].sort((a, b) => (a.affinity >= b.affinity ? -1 : 1));
  return sorted[0];
};

const MajorChooser = () => {
  // available Majors
  const [majors, setMajors] = useState(availableMajors.map((m) => ({ ...m })));
  // Major currently selected by the user
  const [choseMaj, setChoseMaj] = useState(null);
  // Holds the index of the current question
  const [currentQuestion, setCurrentQuestion] = useState(0);
  // Holds user answers to current questions ,, 필요없음
  // const [answer, setAnswer] = useState(true);

  // localStorage에서 questions 로드
const [questions, setQuestions] = useState(loadQuestions());



    /**
    * Updates current affinity score depending on answer received for current question.
    * If user answered yes, affinities increase; responding no decreases affinities.
    * @function
    * @param {boolean} uinput - True if user answered yes; False for no.
    */
  const updateAffinities = (uinput, currentQ) => {
    const updatedMajors = majors.map((m) => {
      const weight = questions[currentQ]?.weights[m.id - 1] || 0;
      return {
        ...m,
        affinity: uinput ? m.affinity + weight : m.affinity - weight,
      };
    });
    setMajors(updatedMajors);
  };

    /**
   * Resets quiz state when 'Attempt Again' is clicked.
   * @function
   */
  const reSelect = () => {
    setMajors(majors.map((m) => ({ ...m, affinity: 10 })));
    setChoseMaj(null);
    setCurrentQuestion(0);
    // setAnswer(false);
  };

  /**
   * Sets the state for whichever major the user has selected from the map.
   * @function
   * @param {Object} majorItem - The currently selected major object.
   */
  const pickMaj = (majorItem) => {
    setChoseMaj(majorItem);
  };

  /**
   * Called when either button is selected by the user.
   * @function
   * @param {boolean} uinput - True if user answered yes; False for no.
   */
  const answerQuestion = (uinput) => {
    // setAnswer(uinput);
    updateAffinities(uinput, currentQuestion);
    setCurrentQuestion(currentQuestion + 1);
  };

  // Rendering the content based on the state
  //QUESTION BOX //container
  const renderContent = () => {
    if (questions.length > currentQuestion) {
      return (
        <div>
          <motion.div className="quest-box">
            <h2 className="quest-text"> <FontAwesomeIcon icon={faCheckCircle} className="question-icon" /> {questions[currentQuestion].text} </h2>
            <h3 className="quest-num"> ({currentQuestion + 1}/{questions.length}) </h3>
            <div className="ans-push">
              <button className="ans-but" onClick={() => answerQuestion(true)}> YES </button>
              <button className="ans-but" onClick={() => answerQuestion(false)}> NO </button>
            </div>
          </motion.div>
          <div className="affinity-box">
            <h3>Affinity Scores</h3>
            <ul>
              {majors.map((m) => (
                <li key={m.id}> {m.name}: {m.affinity} </li>
              ))}
            </ul>
          </div>
        </div>
      );
      //when finished questions, do logic and set recommended major 
    } else {
      const recommendedMajor = getHighestAffinityMajor(majors);
      return (
        <motion.div className="rec-maj-box">
          <h2 className="rec-maj-name">Major Simulation Result:</h2>
          <h3 className="rec-maj-name">{recommendedMajor.name}</h3>
          <h4 className="rec-maj-college">{recommendedMajor.college}</h4>
          <p className="rec-maj-desc">{recommendedMajor.description.academics}</p>
          <button className="resetb" onClick={reSelect}> Attempt Again </button>
        </motion.div>
      );
    }
  };

  return (
    <div className="container">
      {renderContent()}
      <div className="ForTextPosi">
        <h2>Choose a major:</h2>
      </div>
      
      <div className="majs-boxes-container">
        <ul className="majs-list">
          {availableMajors.map((majorItem) => (
            <motion.li
              key={majorItem.id}
              onClick={() => pickMaj(majorItem)}
              className={`major-boxes ${choseMaj === majorItem ? "selected" : ""}`}
            >
              <span className="major-name">{majorItem.name}</span>
              {choseMaj === majorItem && (
                <FontAwesomeIcon icon={faCheckCircle} className="check-icon" />
              )}
            </motion.li>
          ))}
        </ul>
      </div>
      {choseMaj && (
        // click a major on a website
        <motion.div className="click-box">
          <div className="ForTextPosi">
            <h2 className="click-name">Selected Major:</h2>
            <h3 className="click-name">{choseMaj.name}</h3>
            <h4 className="click-name">Academics</h4>
            <p className="click-description">{choseMaj.description.academics}</p>
            <h4 className="click-name">Experience</h4>
            <p className="click-description">{choseMaj.description.experience}</p>
            <h4 className="click-name">Opportunities</h4>
            <p className="click-description">{choseMaj.description.opportunities}</p>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default MajorChooser;
