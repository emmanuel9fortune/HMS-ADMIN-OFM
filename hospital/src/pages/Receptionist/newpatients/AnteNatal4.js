import axios from 'axios'
import React, { useState } from 'react'
import { FaChevronLeft } from 'react-icons/fa'
import { useSelector } from 'react-redux'
import { selectantenatal } from '../../../features/antenatalSlice'
import { selectip } from '../../../features/ipSlice'

function AnteNatal4({handlePrevious, handleNext, setreload, reload}) {

    //axios.defaults.withCredentials = true
  const antenatal = useSelector(selectantenatal)
          const ip = useSelector(selectip)
  

    const uid = sessionStorage.getItem('patient')
    const [letter, setletter] = useState(antenatal?.letter || '')
    const [specialInvestigation, setspecialInvestigation] = useState(antenatal?.specialInvestigation || '')

    const handleSubmit =async()=>{ 
        try {   
            await axios.post(`http://${'localhost'}:7700/antenatal3`,{
                letter,
                specialInvestigation,
                uid,
                }).then((res)=>{
                if(res.data.status === 'success'){
                    handleNext()
                    setreload(reload + 1)
                }
            })
        } catch (error) {
            console.log(error);
        }
    }

  return (
    <>
        <div className='sidebar_spacer' ></div>
      <div className='previouse_medicals_textareas' >
          <div className='patient_details_input_field1' >
              <div className='patient_details_input_field1_'>
                  <h4>ATTACH LETTER AND SUMMARIES HERE</h4>
                  <textarea value={letter} onChange={(e)=>setletter(e.target.value)} />
              </div>
          </div>
          <div className='patient_details_input_field1' >
              <div className='patient_details_input_field1_'>
                  <h4>ATTACH REPORT OF SPECIAL INVESTIGATION HERE</h4>
                  <textarea value={specialInvestigation} onChange={(e)=>setspecialInvestigation(e.target.value)} />
              </div>
          </div>
      </div>

      
      <div className='custome_table_btn' >
          <div className='back_btn_' onClick={handlePrevious}>
              <FaChevronLeft />
              <h4>BACK</h4>
          </div>
          <button className='custome_table_btn2' onClick={handleSubmit}>NEXT</button>
      </div>
    </>
  )
}

export default AnteNatal4