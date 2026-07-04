import React from 'react'
import logo from '../src/img/logo.jpg'

function Connection() {
  return (
      <div className='login_container'>
          <div className='login_container_body' >
              <img src={logo} alt='' />
  
              <h3>Connection error Not connected to the server</h3>

              <button onClick={()=>window.location.reload} >RELOAD</button>
          </div>
      </div>
  )
}

export default Connection