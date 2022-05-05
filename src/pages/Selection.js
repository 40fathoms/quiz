import React from 'react'
import Select from 'react-select'
import { Link } from 'react-router-dom'

import customizeAPI from '../customizeAPI'

const Selection = (props) => {

    // generates an array of up to 10 objects necessary to create the amount of questions selection menu
    function questionsAmount() {
        let questionsAmount = []
        for (let i = 1; i <= 10; i++) {
            questionsAmount.push({ label: `${i}`, value: i })
        }
        return questionsAmount
    }

    let amountOptions = questionsAmount()

   
    return (
        // Select options menu
        <form>

            <Select
                options={amountOptions}
                placeholder={`Number of questions: 5`}
                onChange={e => {props.handleSettings(e.value, 'amount')}}
                className="select"
            />

            <Select
                options={customizeAPI.category}
                placeholder={"Select a category"}
                onChange={e => {props.handleSettings(e.value, 'category')}}
                className="select"
            />

            <Select
                options={customizeAPI.difficulty}
                placeholder={"Select a difficulty"}
                onChange={e => {props.handleSettings(e.value, 'difficulty')}}
                className="select"
            />

            <Select
                options={customizeAPI.type}
                placeholder={"Select a type"}
                onChange={e => {props.handleSettings(e.value, 'type')}}
                className="select"
            />

            <button
                className='button'
                type='submit'
            >
                <Link to='/quiz'>Start Quiz</Link>
            </button>

        </form>
    )
}

export default Selection