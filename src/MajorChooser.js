import{FontAwesomeIcon}from'@fortawesome/react-fontawesome';//using font awesome library
import{faCheckCircle}from'@fortawesome/free-solid-svg-icons';//using font awesome library
import{availableMajors,questionsToAsk}from './majorsData.js';//importing questions/majors from majorData.js
import React,{useState}from'react';// import useState from react for reselect/pickMaj/ansQuestion
import'./MajorChooser.css';
import{motion}from'framer-motion';
const MajorChooser=()=>{
  const majLogic=()=>{
    //logic Stage
    const scoreBoard=availableMajors.map((majorItem) => {
      let pointz=0;
      if(majorItem.name==='Business Admin'&&uinput[2]==='yes'){pointz=pointz+2;}
      if(majorItem.name==='Computer Science'&&uinput[0]==='yes'){pointz=pointz+2;}
      if(majorItem.name==='Psychology'&&uinput[1]==='yes'){pointz=pointz+2;}
      return{majorItem,pointz};});
       scoreBoard.sort((test1, test2)=>test2.pointz-test1.pointz);return scoreBoard[0].majorItem;};     

  // Usage of state hooks below / react

  // Holds currently selected major
  const[choseMaj,setchoseMaj]=useState(null);
  // Holds the index of the current question I'm on
  const[currentQuestion,setCurrentQuestion]=useState(0);
  // Holds user answers to questions
  const[uinput,setAnswers]=useState([]);
  // Whenever I click a function, these reset the selections
  const reSelect=()=>{setchoseMaj(null);setCurrentQuestion(0);setAnswers([]) };
  //Reset the choseMaj, curr index, and answer array
  const pickMaj=(majorItem)=>{setchoseMaj(majorItem);};
  //
  const answerQuestion=(uinput)=>{setAnswers([...uinput,uinput]);setCurrentQuestion(currentQuestion+1);};
 

  // Rendering the content based on the state

  //QUESTION BOX
  const renderContent=()=>{
    if(questionsToAsk.length>currentQuestion){ return(
        <motion.div
        beginingg={{opacity:0,y:-20 }}
        alivee={{opacity:1,y:0 }}
        movingprt={{duration:0.5 }}
        className="quest-box"
      >
       <h2 className="quest-text"><FontAwesomeIcon icon={faCheckCircle} className="question-icon" />{questionsToAsk[currentQuestion].text} </h2>
       <div className="ans-push">
       <button className="ans-but" onClick={()=>answerQuestion('yes')}>YES</button><button className="ans-but" onClick={()=>answerQuestion('no')}>NO</button></div>
        </motion.div>
  // Rendering content based on the state
      
  );

  //Do logic and set recommended major
  }else{const recommendedMajor=majLogic();
      return(
  //POST QUESTION BOX
  //POST QUESTION BOX
  //RESET BUTTON
        <motion.div //animation framer
        beg={{opacity:0,y:-20}}alive={{opacity:1,y: 0}}movingprt={{duration:0.5}}
  className="rec-maj-box">
  <h2 className="rec-maj-name">Major Simulation Result:</h2>
  <h3 className="rec-maj-name">{recommendedMajor.name}</h3>
  <p className="rec-maj-desc">{recommendedMajor.description}</p>
  <button className="resetb" onClick={reSelect}>Attempt Again</button>
        </motion.div>);}};

  return(

// Overall interface
<div className="major-chooser">
<div className="topofpage">
<h1 className="title">Choosing Your Major</h1></div>
<div className="container">
<div className="prog-cont"></div>
{renderContent()}
<ul className="majs-list">
{availableMajors.map((majorItem)=>(
      <motion.li
      beg={{opacity:0,x:-20 }} alive={{ opacity:1,x:0 }}movingprt={{duration:0.5}}onClick={()=>pickMaj(majorItem)}
      className={`major-Na ${choseMaj===majorItem?'selected':''}`}>
      <span className="major-name">{majorItem.name}</span> 
      {choseMaj===majorItem&&<FontAwesomeIcon icon={faCheckCircle}className="check-icon"/>}
      </motion.li>))}
        </ul>
        {choseMaj&&(
  // OUR 
      <motion.div
      beginingg={{opacity:0,y:-20 }}alivee={{opacity:1,y:0}}movingprt={{duration:0.5}}
      className="click-box">
      <h2 className="click-name">Selected Major:</h2>
      <h3 className="click-name">{choseMaj.name}</h3>
      <p className="click-description">{choseMaj.description}</p>
      </motion.div>
        )} </div></div>);};

export default MajorChooser;
