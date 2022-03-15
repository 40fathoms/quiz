import React from 'react'

const Options = (props) => {

    // handle the styling of the options buttons according to the game status
    let situationStyle

    if(props.isCorrect && !props.isPlaying){
        situationStyle="correct"
    }
    else if(!props.isCorrect && props.checked && !props.isPlaying){
        situationStyle="incorrect"
    }
    else if(props.checked && props.isPlaying){
        situationStyle="chosen"
    }
    else if(!props.isCorrect && !props.checked && !props.isPlaying){
        situationStyle="notChosen"
    }    

    return (
        <>
            <input
                type="radio"
                name={props.question}
                value={props.option}
                id={props.idOption}
                onChange={(e)=>{props.handleChecked(e, props.idQuestion, props.idOption)}}
            />
            <label className={situationStyle} htmlFor={props.idOption}>{props.option}</label>
            
            {/* solution to avoid changing options when the game is finished */}
            <div 
                style={{display: (!props.isPlaying) ? 'block' : 'none'}}
            ></div>
        </>
    )
}

export default Options