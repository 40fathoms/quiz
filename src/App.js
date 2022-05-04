import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'

import Layout from './components/Layout'

import Selection from './pages/Selection'
import Game from './pages/Game'


function App() {

  // state that controls the quiz settings
  const [quizSettings, setQuizSettings] = React.useState({
    amount: "amount=5",
    category: "",
    difficulty: "",
    type: ""
  })

  function handleSettings(value, configType, reset = false) {
    if (reset) {
      setQuizSettings({
        amount: "amount=5",
        category: "",
        difficulty: "",
        type: ""
      })
    }
    else {
      setQuizSettings(previousSettings => {
        return ({
          ...previousSettings,
          [configType]: value
        })
      })
    }
  }

  return (
    <Layout>
      <Routes>

        <Route path="/" element={
          <Selection
            handleSettings={handleSettings}
          />
        } />

        <Route path="/quiz" element={
          <Game
            quizSettings={quizSettings}
            handleSettings={handleSettings}
          />
        } />

        <Route path="*" element={<Navigate to='/' />} />

      </Routes>
    </Layout>
  );
}

export default App;