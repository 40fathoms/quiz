import React from 'react'
import { nanoid } from 'nanoid'

import Question from './components/Question'

import Blue from './images/blue.png'
import Yellow from './images/yellow.png'

function App() {

  // sets the background images
  const backgroundImages = {
    background: `url(${Blue}), url(${Yellow})`,
    backgroundSize: "20%",
    backgroundRepeat: "no-repeat",
    backgroundPosition: "0% 100%, 100% 0%"
  }

  //quiz questions & answers state
  const [quiz, setQuiz] = React.useState([{}])

  // state to handle if the game is being played
  const [isPlaying, setIsPlaying] = React.useState(true)

  // function to create the options objects array    
  function allOptions(correct_answer, incorrect_answers) {
    const optionElement = []

    // adds the correct option object to the options array
    optionElement.push(
      { option: correct_answer, checked: false, isCorrect: true, id: nanoid() }
    )

    // adds the incorrect options objects to the options array
    {
      incorrect_answers !== undefined &&

        incorrect_answers.map(option => {
          optionElement.push(
            { option: option, checked: false, isCorrect: false, id: nanoid() }
          )
        })

    }

    // shuffles the options array
    function shuffleArray(array) {
      for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
      }
    }
    shuffleArray(optionElement)

    return optionElement
  }

  // fetch api for the trivia questions
  React.useEffect(() => {
    fetch(`https://opentdb.com/api.php?amount=10`)
      .then(res => res.json())
      .then(data => setQuiz(data.results.map(item => {
        return {
          question: item.question,
          options: allOptions(item.correct_answer, [...item.incorrect_answers]),
          key: nanoid()
        }
      })))
  }, [])

  // function to handle if the option is checked or not
  function handleChecked(e, idQuestion, idOption) {

    // function that handles the options array, for a specific question element
    function handleOptions (question){

      let newOptionsArray = question   

      newOptionsArray.options = question.options.map(item => {
        return idOption == item.id ?
          {...item, checked: true} :
          {...item, checked: false}        
      })
      
      return newOptionsArray
    }

    setQuiz(prevQuestions => prevQuestions.map(item => {
      return idQuestion == item.key ? 
        handleOptions(item) :
        {...item}        
    }))  
    
  }

  // handle the game current status
  function handleStatus(e) {
    e.preventDefault()
    setIsPlaying(prev => !prev)
  }


  // calls the Question component, using the quiz state data
  const questionElement = quiz.map(item => {
    return (
      <Question
        question={item.question}
        options={item.options}
        handleChecked={handleChecked}
        isPlaying={isPlaying}
        idQuestion={item.key}
      />
    )
  })

  return (
    <form style={backgroundImages}>
      <section className="questions">
        {questionElement}  
      </section>

      <button className='button' type='submit' onClick={handleStatus}>Check Answers</button>
    </form>
  );
}

export default App;