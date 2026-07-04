import React from 'react'
import logo from '../src/img/logo.jpg'

function Loader() {
  return (
    <div className='login_container'>
        <div className='login_container_body' >
            <img src={logo} alt='' />

            <h3>Connecting to server...</h3>
        </div>
    </div>
  )
}

export default Loader