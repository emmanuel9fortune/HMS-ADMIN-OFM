import axios from 'axios'
import React, { useState } from 'react'
import { FaChevronLeft } from 'react-icons/fa'
import { useSelector } from 'react-redux'
import { selectantenatal } from '../../../features/antenatalSlice'
import { selectip } from '../../../features/ipSlice'

function AnteNatal6({handlePrevious, handleNext, setreload, reload}) {

    //axios.defaults.withCredentials = true
            const ip = useSelector(selectip)

  const antenatal = useSelector(selectantenatal)
    const uid = sessionStorage.getItem('patient')
    const [comments, setcomments] = useState(antenatal?.comments || '')
    const [pelvicAssessment, setpelvicAssessment] = useState(antenatal?.pelvicAssessment || '')

    const handleSubmit =async()=>{

        try {   
            await axios.post(`http://${'localhost'}:7700/antenatal6`, {
                comments,
                pelvicAssessment,
                uid
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
                    <h4>COMMENTS</h4>
                    <textarea value={comments} onChange={(e)=>setcomments(e.target.value)} />
                </div>
            </div>
            <div className='patient_details_input_field1' >
                <div className='patient_details_input_field1_'>
                    <h4>PELVIC ASSESSMENT AT 36 WEEKS</h4>
                    <textarea value={pelvicAssessment} onChange={(e)=>setpelvicAssessment(e.target.value)} />
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

export default AnteNatal6