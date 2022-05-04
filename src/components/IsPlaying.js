import React from 'react'
import { Link } from 'react-router-dom'

const isPlaying = (props) => {

    // function to count how many correct answers
    function handleCorrectAnswers() {
        let correctAnswers = 0

        function countCorrectAnswers(optionsArray) {
            return optionsArray.some(item => (item.checked && item.isCorrect)) ?
                correctAnswers += 1 : correctAnswers += 0
        }

        props.quiz.forEach(item => countCorrectAnswers(item.options))

        return correctAnswers
    }


    //Determines if you checked the correct answers or not. That is done through the isPlaying status    
    if (props.isPlaying) {
        return (
            // Once you answer all questions, you can check if they are correct
            <div className="answersChecked">

                {/* solution to avoid checking options when the game isn't finished */}
                {!props.quiz.every(question => question.answered) &&
                    <div></div>
                }

                <button
                    className='button'
                    type='submit'
                    style={{ opacity: props.quiz.every(question => question.answered) ? '1' : '0.5' }}
                    onClick={(e) => { props.handleIsPlaying(e) }}
                >Check Answers</button>

            </div>
        )
    }
    else {
        return (
            // Displays your results
            <div className="answersChecked">

                <h3>You scored {handleCorrectAnswers()}/{props.quiz.length} correct answers</h3>

                <button
                    className='button'
                    type='submit'
                    onClick={(e) => { props.handleIsPlaying(e); props.handleSettings("","",true) }}
                >
                    <Link to='/'>Play Again</Link>
                </button>

            </div>
        )
    }
}

export default isPlaying