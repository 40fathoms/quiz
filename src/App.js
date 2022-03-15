import React from 'react'
import { nanoid } from 'nanoid'

import Question from './components/Question'

import Blue from './images/blue.png'
import Yellow from './images/yellow.png'

function App() {

  // sets the background images styles
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

  // state to restart the game (determines if it displays the selection menu screen or the questions)
  const [setup, setSetup] = React.useState(true);

  // function to create the options objects array - called in React.useEffect to create a new quiz array state
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
  // the [setup] condition allows the user to restart the game with new questions
  React.useEffect(() => {
    if (setup) {
      fetch(`https://opentdb.com/api.php?amount=2`)
        .then(res => res.json())
        .then(data => setQuiz(data.results.map(item => {
          return {
            question: item.question,
            options: allOptions(item.correct_answer, [...item.incorrect_answers]),
            answered: false,
            key: nanoid()
          }
        })))
    }
  }, [setup])

  // function to handle if the option is checked or not
  function handleChecked(e, idQuestion, idOption) {

    // function that handles the options array, for a specific question element
    function handleOptions(question) {

      // changing the quiz[current question index].answered status to true
      let newOptionsArray = { ...question, answered: true }

      // changing the clicked option status as checked:true
      newOptionsArray.options = question.options.map(item => {
        return idOption === item.id ?
          { ...item, checked: true } :
          { ...item, checked: false }
      })

      return newOptionsArray
    }

    setQuiz(prevQuestions => prevQuestions.map(item => {
      return idQuestion === item.key ?
        handleOptions(item) :
        { ...item }
    }))

  }

  // handle the game current status 
  function handleIsPlaying(e) {
    e.preventDefault()
    setIsPlaying(prev => !prev)
  }

  // handles the game current setup
  function handleSetup(e) {
    e.preventDefault()
    setSetup(prev => !prev)
  }

  // function to count how many correct answers
  function handleCorrectAnswers() {
    let correctAnswers = 0

    function countCorrectAnswers(optionsArray) {
      return optionsArray.some(item => (item.checked && item.isCorrect)) ?
        correctAnswers += 1 : correctAnswers += 0
    }

    quiz.forEach(item => countCorrectAnswers(item.options))

    return correctAnswers
  }

  // calls the Question component, using the quiz state data
  const questionElement = quiz.map(item => {
    return (
      <Question
        // quiz related items
        question={item.question}
        options={item.options}
        idQuestion={item.key}

        //isPlaying state and a function to handle if the options are checked
        isPlaying={isPlaying}
        handleChecked={handleChecked}
      />
    )
  })

  return (

    // Checks if the game will display the categories selection or the questions
    setup == true ?

      // Select options menu
      <form style={backgroundImages}>

        <button
          className='button'
          type='submit'
          onClick={(e) => {handleSetup(e)}}
        >Start Quiz</button>

      </form>

      :

      // Game
      <form style={backgroundImages}>

        {/* Questions */}
        <section className="questions">
          {questionElement}
        </section>

        {/* 
        Determines if you checked the correct answers or not.
        That is done through the isPlaying status
        */}
        {isPlaying ?

          // Once you answer all questions, you can check if they are correct
          <div className="answersChecked">

            {/* solution to avoid checking options when the game isn't finished */}
            {!quiz.every(question => question.answered) &&
              <div></div>
            }

            <button
              className='button'
              type='submit'
              onClick={(e) => {handleIsPlaying(e)}}
            >Check Answers</button>

          </div>

          :

          // Displays your results
          <div className="answersChecked">

            <h3>You scored {handleCorrectAnswers()}/{quiz.length} correct answers</h3>

            <button
              className='button'
              type='submit'
              onClick={(e) => { handleIsPlaying(e); handleSetup(e) }}
            >Play Again</button>

          </div>
        }
      </form>
  );
}

export default App;