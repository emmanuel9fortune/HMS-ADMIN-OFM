import axios from 'axios'
import React, { useState } from 'react'
import { FaChevronLeft } from 'react-icons/fa'
import { useSelector } from 'react-redux'
import { selectantenatal } from '../../../features/antenatalSlice'
import { selectip } from '../../../features/ipSlice'

function AnteNatal9({handlePrevious, handleNext, setreload, reload}) {

    //axios.defaults.withCredentials = true
            const ip = useSelector(selectip)
    const antenatal = useSelector(selectantenatal)

    const uid = sessionStorage.getItem('patient')
    const [urinarySymptoms, seturinarySymptoms] = useState(antenatal?.urinarySymptoms || '')
    const [historyPreg, sethistoryPreg] = useState(antenatal?.historyPreg || '')
    const [vomiting, setvomiting] = useState(antenatal?.vomiting || '')
    const [vaginalDischarge, setvaginalDischarge] = useState(antenatal?.vaginalDischarge || '')
    const [swellingOfAnkles, setswellingOfAnkles] = useState(antenatal?.swellingOfAnkles || '')
    const [bleeding, setbleeding] = useState(antenatal?.bleeding || '')
    const [otherSymptoms, setotherSymptoms] = useState(antenatal?.otherSymptoms || '')

    const handleSubmit =async()=>{

        try {   
            await axios.post(`http://${'localhost'}:7700/antenatal4`, {
                urinarySymptoms,
                historyPreg,
                vomiting,
                vaginalDischarge,
                swellingOfAnkles,
                bleeding,
                otherSymptoms,
                uid: uid
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
      <div className='patient_details_' >
        <div className='patient_details_input_field1' >
          <h3>PRIMARY ASSESSMENT</h3>
          <div className='patient_details_input_field1_' >
              <h4>HISTORY OF PREGNANCY</h4>
              <input value={historyPreg} onChange={(e)=>sethistoryPreg(e.target.value)} />
          </div>
          <div className='patient_details_input_field1_' >
              <h4>URINARY SYMPTOMS</h4>
              <input value={urinarySymptoms} onChange={(e)=>seturinarySymptoms(e.target.value)} />
          </div>
          <div className='patient_details_input_field1_' >
              <h4>VOMITING</h4>
              <input value={vomiting} onChange={(e)=>setvomiting(e.target.value)} />
          </div>
          <div className='patient_details_input_field1_' > 
              <h4>VAGINAL DISCHARGE</h4>
              <input value={vaginalDischarge} onChange={(e)=>setvaginalDischarge(e.target.value)} />
          </div>
      </div>

      <div className='patient_details_input_field1'>
          <div className='patient_details_input_field1_' >
              <h4>SWELLING OF ANKLES</h4>
              <input value={swellingOfAnkles} onChange={(e)=>setswellingOfAnkles(e.target.value)} />
          </div>
          <div className='patient_details_input_field1_' >
              <h4>BLEEDING</h4>
              <input value={bleeding} onChange={(e)=>setbleeding(e.target.value)} />
          </div>
          <div className='patient_details_input_field1_' >
              <h4>OTHER SYMPTOMS</h4>
              <input value={otherSymptoms} onChange={(e)=>setotherSymptoms(e.target.value)} />
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

export default AnteNatal9