import React from 'react'
import { nanoid } from 'nanoid'

import Question from '../components/Question'
import IsPlaying from '../components/IsPlaying';
import LoadingSpinner from '../components/LoadingSpinner';


// function to convert HTML entities to UTF-8. 
// Called in fetchRequest when fetching the question string 
// Called in allOptions() when fetching the options array 
function decodeHTMLEntities(str) {
    var txt = document.createElement("textarea");
    txt.innerHTML = str;
    return txt.value;
}

// function to create the options objects array - called in fetchRequest to create a new quiz array state
function allOptions(correct_answer, incorrect_answers) {
    const optionElement = []

    // adds the correct option object to the options array
    optionElement.push(
        { option: decodeHTMLEntities(correct_answer), checked: false, isCorrect: true, id: nanoid() }
    )

    // adds the incorrect options objects to the options array
    incorrect_answers.forEach(option => {
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


const Game = (props) => {

    //destructuring the quizSettings prop
    const { amount, category, difficulty, type } = props.quizSettings;

    // state to determine the quiz array of objects, containing the questions and options
    const [quiz, setQuiz] = React.useState([{
        question: "",
        options: [""],
        category: "",
        difficulty: "",
        type: "",
        answered: "",
        key: null
    }])

    // state to handle if the game is being played
    const [isPlaying, setIsPlaying] = React.useState(true)

    function handleIsPlaying(e) {
        e.preventDefault()
        setIsPlaying(prev => !prev)
    }

    // state to handle the loading feedback to the user
    const [isLoading, setIsLoading] = React.useState(false)

    // fetch api for the trivia questions
    React.useEffect(() => {

        const fetchRequest = async () => {
            setIsLoading(true)

            fetch(`https://opentdb.com/api.php?${amount}${category}${difficulty}${type}`)
                .then(response => {
                    setIsLoading(false)

                    if (response.ok) {
                        return response.json()
                    }
                    else {
                        return response.json().then(data => {                    
                            throw new Error("Failed to load questions")
                        })
                    }
                })
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
                .catch((err) => {
                    alert(err.message)
                })
        };

        fetchRequest()

    }, [amount, category, difficulty, type])


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

    // calls the Question component, using the quiz state data
    const questionElement = quiz.map(item => {
        return (
            <Question
                // quiz related items
                key={nanoid()}
                question={item.question}
                options={item.options}
                idQuestion={item.key}

                //isPlaying state and a function to handle if the options are checked
                isPlaying={isPlaying}
                handleChecked={handleChecked}
            />
        )
    })

    if(isLoading){
        return(
            <LoadingSpinner />
        )
    }

    return (
        <form>

            <section className="questions">
                {questionElement}
            </section>

            <IsPlaying
                quiz={quiz}
                isPlaying={isPlaying}
                handleIsPlaying={handleIsPlaying}

                handleSettings={props.handleSettings}
            />

        </form>
    )
}

export default Game