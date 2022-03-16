import React from 'react'
import { nanoid } from 'nanoid'
import Select from 'react-select'

import Question from './components/Question'

import customizeAPI from './customizeAPI'

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

  ////////////////////////////////////////////
  // STATES 

  // state to determine the quiz array of objects, containing the questions and options
  const [quiz, setQuiz] = React.useState([{}])

  // state to handle if the game is being played
  const [isPlaying, setIsPlaying] = React.useState(true)

  // state to determine if the selection menu screen or the game is displayed
  const [setup, setSetup] = React.useState(true);

  // Select menu states

  // state to handle the amount of questions
  const [amount, setAmount] = React.useState("amount=5")

  // generates an array of up to 10 objects necessary to create the amount of questions selection menu
  function questionsAmount() {
    let questionsAmount = []
    for (let i = 1; i <= 10; i++) {
      questionsAmount.push({ label: `${i}`, value: `amount=${i}` })
    }
    return questionsAmount
  }
  let amountOptions = questionsAmount()

  function handleAmount(e) {
    setAmount(e.value)
  }

  // state to handle the difficulty
  const [category, setCategory] = React.useState("")

  function handleCategory(e) {
    setCategory(e.value)
  }

  // state to handle the difficulty
  const [difficulty, setDifficulty] = React.useState("")

  function handleDifficulty(e) {
    setDifficulty(e.value)
  }

  // state to handle the type
  const [type, setType] = React.useState("")

  function handleType(e) {
    setType(e.value)
  }

  ////////////////////////////////////////////

  // function to convert HTML entities to UTF-8. 
  // Called in fetchRequest-React.useCallback when fetching the question string 
  // Called in allOptions() when fetching the options array 
  function decodeHTMLEntities(str) {
    var txt = document.createElement("textarea");
    txt.innerHTML = str;
    return txt.value;
  }

  // function to create the options objects array - called in React.useEffect to create a new quiz array state
  function allOptions(correct_answer, incorrect_answers) {
    const optionElement = []

    // adds the correct option object to the options array
    optionElement.push(
      { option: decodeHTMLEntities(correct_answer), checked: false, isCorrect: true, id: nanoid() }
    )

    // adds the incorrect options objects to the options array
    incorrect_answers.map(option => {
      optionElement.push(
        { option: decodeHTMLEntities(option), checked: false, isCorrect: false, id: nanoid() }
      )
    })

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
  const fetchRequest = React.useCallback(() => {
    fetch(`https://opentdb.com/api.php?${amount}${category}${difficulty}${type}`)
      .then(res => res.json())
      .then(data => setQuiz(data.results.map(item => {
        return {
          question: decodeHTMLEntities(item.question),
          options: allOptions(item.correct_answer, [...item.incorrect_answers]),
          category: item.category,
          difficulty: item.difficulty,
          type: item.type,
          answered: false,
          key: nanoid()
        }
      })))
  }, [amount, category, difficulty, type]);


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

    // Checks if the game will display the categories selection or the game
    setup == true ?

      // Select options menu
      <form style={backgroundImages}>

        <Select
          options={amountOptions}
          placeholder={`Number of questions: 5`}
          onChange={(e) => { handleAmount(e) }}
          className="select"
        />

        <Select
          options={customizeAPI.category}
          placeholder={"Select a category"}
          onChange={(e) => { handleCategory(e) }}
          className="select"
        />

        <Select
          options={customizeAPI.difficulty}
          placeholder={"Select a difficulty"}
          onChange={(e) => { handleDifficulty(e) }}
          className="select"
        />

        <Select
          options={customizeAPI.type}
          placeholder={"Select a type"}
          onChange={(e) => { handleType(e) }}
          className="select"
        />

        <button
          className='button'
          type='submit'
          onClick={(e) => { handleSetup(e); fetchRequest() }}
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
              style={{ opacity: quiz.every(question => question.answered) ? '1' : '0.5' }}
              onClick={(e) => { handleIsPlaying(e) }}
            >Check Answers</button>

          </div>

          :

          // Displays your results
          <div className="answersChecked">

            <h3>You scored {handleCorrectAnswers()}/{quiz.length} correct answers</h3>

            <button
              className='button'
              type='submit'
              onClick={(e) => { handleIsPlaying(e); handleSetup(e); setQuiz([{}]); setAmount("amount=5"); setCategory(""); setDifficulty(""); setType("") }}
            >Play Again</button>

          </div>
        }
      </form>
  );
}

export default App;