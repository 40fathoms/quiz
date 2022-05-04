import React from 'react'
import { nanoid } from 'nanoid'

import Options from './Options'

const Question = (props) => {

    let currentElement = []
    if (props.options !== undefined) {
        (props.options).map(item => currentElement.push(item))     
    }
    
    const optionsElements = currentElement.map(item =>
        <Options
            // currentElement items array
            key={nanoid()}
            option={item.option}
            isCorrect={item.isCorrect}
            checked={item.checked}

            // inherited props used Options.js
            question={props.question}
            isPlaying={props.isPlaying}

            // idQuestion and idOption will be used for handleChecked
            idQuestion={props.idQuestion}
            idOption={item.id}
            handleChecked={(e) => props.handleChecked(e, props.idQuestion, item.id)}
        />
    )

    return (
        <div className="question">
            <h2>{props.question}</h2>

            <div className="question-options">
                {optionsElements}
            </div>
        </div>
    )
}

export default Question