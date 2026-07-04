import axios from 'axios'
import React, { useState } from 'react'
import { FaChevronLeft } from 'react-icons/fa'
import { useSelector } from 'react-redux'
import { selectantenatal } from '../../../features/antenatalSlice'
import { selectip } from '../../../features/ipSlice'

function AnteNatal8({handlePrevious, setcurrentIndex}) {

    //axios.defaults.withCredentials = true
            const ip = useSelector(selectip)

    const uid = sessionStorage.getItem('patient')
  const antenatal = useSelector(selectantenatal)
    const [specialInstruction, setspecialInstruction] = useState(antenatal?.specialInstruction || '')

    const handleSubmit =async()=>{

        try {   
            await axios.post(`http://${'localhost'}:7700/antenatal8`, {
                specialInstruction,
                uid
            }).then((res)=>{
                if(res.data.status === 'success'){
                    setcurrentIndex(0)
                    sessionStorage.removeItem('patient')
                    sessionStorage.removeItem('index')
                }
            })
        } catch (error) {
            console.log(error);
        }
    }
  return (
    <>
      <div className='sidebar_spacer' ></div>
      <div className='previouse_medicals_textareas_NOTE' >
          <div >
              <h4>SPECIAL INSTRUCTIONS</h4>
              <textarea value={specialInstruction} onChange={(e)=>setspecialInstruction(e.target.value)} />
          </div>
      </div>

      <div className='custome_table_btn' >
          <div className='back_btn_' onClick={handlePrevious}>
              <FaChevronLeft />
              <h4>BACK</h4>
          </div>
          <button className='custome_table_btn2' onClick={handleSubmit}>SUBMIT</button>
      </div>
    </>
  )
}

export default AnteNatal8