import React from 'react'
import { MdWifiOff } from 'react-icons/md'

function Network() {
  return (
      <div className='login_container'>
          <div className='login_container_body' >
              <MdWifiOff style={{margin:'60px 0'}} size={180} color='grey' />
  
              <h1 style={{color:'grey'}} >NETWORK ERROR</h1>
              <p style={{color:'grey', fontSize:'20px', margin:'10px 0'}}>Something went wrong</p>

              <button onClick={()=>window.location.reload()} >RELOAD</button>
          </div>
      </div>
  )
}

export default Network