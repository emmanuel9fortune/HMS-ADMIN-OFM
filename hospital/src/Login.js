import React, { useState } from 'react'
import logo from '../src/img/logo.jpg'
import axios from 'axios'
import io from "socket.io-client"
import { useSelector } from 'react-redux'
import { selectip } from './features/ipSlice'
import { toast } from 'react-toastify'
import { FiEye } from 'react-icons/fi'


function Login({setreload, reload, serverIP}) {

    //axios.defaults.withCredentials = true
    const ip = useSelector(selectip)
    const socket = io.connect(`http://${serverIP || 'localhost'}:7700`)

    const [passkey, setpasskey] = useState(0)
    const handleLogin =async()=>{
        try {
            localStorage.setItem('log', JSON.stringify({key: passkey, set: true}))
            window.location.reload()
        } catch (error) {
            console.log(error);
        } 
    }
    const log = localStorage.getItem('log')
    const getvalues =JSON.parse(log)

    const handleLogin2 =async()=>{
        try {
            if(getvalues?.key === `${passkey}`){
                localStorage.setItem('log', JSON.stringify({key: getvalues?.key, set: true}))
                window.location.reload()
            }else{
                toast.error('WRONG LOGIN DETAILS')
            }
            
        } catch (error) {
            console.log(error);
        } 
    }


  return (
    <div className='login_container'>
        <div className='login_container_body' >
            <img src={logo} alt='' />

            <h3>ENTER STAFF PASSKEY</h3>

                <input onChange={(e)=>setpasskey(e.target.value)} type='number' placeholder='Enter Your Passkey'  />

            {
                !getvalues?.key ?
                <button onClick={handleLogin} >CREATE</button>
                :
                <button onClick={handleLogin2} >LOGIN</button>
            }
        </div>
    </div>
  )
}

export default Login