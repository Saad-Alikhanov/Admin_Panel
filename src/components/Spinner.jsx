// src/components/Spinner.jsx
import React from 'react'
import '../css/spinner.css' // Make sure to create and style this CSS file

const Spinner = () => {
  return (
    <div className='spinner'>
      <div className='double-bounce1'></div>
      <div className='double-bounce2'></div>
    </div>
  )
}

export default Spinner
