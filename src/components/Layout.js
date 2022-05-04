import React from 'react'

import Blue from '../images/blue.png'
import Yellow from '../images/yellow.png'

const Layout = (props) => {

  // sets the background images styles
  const backgroundImages = {
    background: `url(${Blue}), url(${Yellow})`,
    backgroundSize: "20%",
    backgroundRepeat: "no-repeat",
    backgroundPosition: "0% 100%, 100% 0%"
  }

  return (
        <main style={backgroundImages}>
            {props.children}
        </main>
  )
}

export default Layout