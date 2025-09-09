import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle } from '@fortawesome/free-solid-svg-icons';
import { availableMajors, questionsToAsk } from './majorsData.js';
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import './MajorChooser.css';

/**
  * Sorts majors list by affinity and retrieves the major with highest affinity.
  * @note If affinities are equal when sorting, precedence goes to item1.
  * @function
  * @returns The major with the highest affinity score.
  */
const getHighestAffinityMajor = () => {
  availableMajors.sort((item1, item2) => (item1.affinity >= item2.affinity) ? -1 : 1);

  return availableMajors[0];
};

/**
  * Updates current affinity score depending on answer received for current question.
  * If user answered yes, affinities increase; responding no decreases affinities.
  * @function
  * @param {boolean} uinput - True if user answered yes; False for no.
  */
const updateAffinities = (uinput, currentQuestion) => {
    if (uinput) {
      availableMajors.forEach((majorItem) => {
        majorItem.affinity += questionsToAsk[currentQuestion].weights[majorItem.id - 1]
      });
    } else {
      availableMajors.forEach((majorItem) => {
        majorItem.affinity -= questionsToAsk[currentQuestion].weights[majorItem.id - 1]
      });
    }
}

/**
  * Resets major affinities to their baseline, which is 10.
  * @function
  */
const resetAffinities = () => {
  availableMajors.forEach((major) => {
    major.affinity = 10;
  });
}

/**
 * Main function for generating the web app HTML.
 * @function
 * @returns HTML components generated from React.
 */
const MajorChooser = () => {

  // Major currently selected by the user
  const [choseMaj, setchoseMaj] = useState(null);
  // Holds the index of the current question
  const [currentQuestion, setCurrentQuestion] = useState(0);
  // Holds user response to current question
  const [answer, setAnswer] = useState(false);

  /**
   * Resets quiz state when 'Attempt Again' is clicked.
   * @function
   */
  const reSelect = () => {
    setchoseMaj(null);
    setCurrentQuestion(0);
    setAnswer(false);
    resetAffinities();
  };

  /**
   * Sets the state for whichever major the user has selected from the map.
   * @function
   * @param {Object} majorItem - The currently selected major object.
   */
  const pickMaj = (majorItem) => {
    setchoseMaj(majorItem);
  }

  /**
   * Called when either button is selected by the user.
   * @function
   * @param {boolean} uinput - True if user answered yes; False for no.
   */
  const answerQuestion = (uinput) => {
    setAnswer(uinput);
    updateAffinities(uinput, currentQuestion);
    setCurrentQuestion(currentQuestion + 1);
  };

  /**
   * Presents quiz questions for the user to answer and the results of 
   * the quiz.
   * @function
   * @returns Content for each question in the quiz if any are left; The 
   *     results screen once all questions have been answered.
   */
  const renderContent = () => {
    if (questionsToAsk.length > currentQuestion) { 
      return (
        <motion.div
          beginingg = {{opacity: 0, y: -20}}
          alivee = {{opacity: 1, y: 0}}
          movingprt={{duration: 0.5}}
          className="quest-box"
        >
          <h2 className="quest-text">
            <FontAwesomeIcon icon={faCheckCircle} className="question-icon" />{questionsToAsk[currentQuestion].text}
          </h2>
          <div className="ans-push">
            <button className="ans-but" type="button" onClick={() => answerQuestion(true)}>YES</button>
            <button className="ans-but" type="button" onClick={() => answerQuestion(false)}>NO</button>
          </div>
        </motion.div>
      );
    } else { 
      // Recommend a major once all quiz questions have been answered
      const recommendedMajor = getHighestAffinityMajor();
      return (
        <motion.div  // Animation framer
          beg={{opacity: 0, y: -20}}
          alive={{opacity: 1, y: 0}}
          movingprt={{duration: 0.5}}
          className="rec-maj-box"
        >
          <h2 className="result-header">Major Simulation Result:</h2>
          <h3 className="rec-maj-name">{recommendedMajor.name}</h3>
          <h4 className="rec-maj-college">{recommendedMajor.college}</h4>
          <p className="rec-maj-desc">{recommendedMajor.description.academics}</p>
          <button className="resetb" onClick={reSelect}>Attempt Again</button>
        </motion.div>
      );
    }
  };

  return (
    // Overall interface
    <div className="major-chooser">
      <div className="topofpage">
        <h1 className="title">Choosing Your Major</h1>
      </div>
      <div className="container">
        <div className="prog-cont"></div>
        {renderContent()}
        <ul className="majs-list">
          {availableMajors.map((majorItem) => (
            <motion.li
              beg={{opacity: 0, x: -20}}
              alive={{opacity: 1, x: 0}}
              movingprt={{duration: 0.5}}
              onClick={() => pickMaj(majorItem)}
              className={`major-Na ${choseMaj === majorItem ? 'selected' : ''}`}
            >
              <span className="major-name">{majorItem.name}</span> 
              {choseMaj === majorItem && <FontAwesomeIcon icon={faCheckCircle} className="check-icon"/>}
            </motion.li>))}
        </ul>
        {choseMaj && (
          <motion.div
            beginingg={{opacity: 0, y: -20}}
            alivee={{opacity: 1, y: 0}}
            movingprt={{duration: 0.5}}
            className="click-box"
          >
            <h2 className="click-name">Selected Major:</h2>
            <h3 className="click-name">{choseMaj.name}</h3>
            <h4 className="click-name">Academics</h4>
            <p className="click-description">{choseMaj.description.academics}</p>
            <h4 className="click-name">Experience</h4>
            <p className="click-description">{choseMaj.description.experience}</p>
            <h4 className="click-name">Opportunities</h4>
            <p className="click-description">{choseMaj.description.opportunities}</p>
          </motion.div>
        )} 
      </div>
    </div>
  );
};

export default MajorChooser;
