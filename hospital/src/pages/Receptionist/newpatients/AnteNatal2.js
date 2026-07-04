import axios from 'axios'
import React, { useState } from 'react'
import { FaChevronLeft } from 'react-icons/fa'
import { useSelector } from 'react-redux'
import { selectpatient } from '../../../features/patientSlice'
import { selectip } from '../../../features/ipSlice'

function AnteNatal2({handlePrevious, handleNext, reload, setreload}) {

    //axios.defaults.withCredentials = true
            const ip = useSelector(selectip)
    const patient = useSelector(selectpatient)

    const [heartDisease, setheartDisease] = useState(patient?.heartDisease || '')
    const [kidneyDisease, setkidneyDisease] = useState(patient?.kidneyDisease || '')
    const [Diabetes, setDiabetes] = useState(patient?.Diabetes || '')
    const [ChestDisease, setChestDisease] = useState(patient?.ChestDisease || '')
    const [Covid, setCovid] = useState(patient?.Covid || '')
    const [PreviousePregnancies, setPreviousePregnancies] = useState(patient?.PreviousePregnancies || '')
    const [NoOfLivingChildren, setNoOfLivingChildren] = useState(patient?.NoOfLivingChildren || '')
    const [NumberOfOperations, setNumberOfOperations] = useState(patient?.NumberOfOperations || '')

    const uid = sessionStorage.getItem('patient')

    const handleSubmit =async()=>{
        const value ={
            heartDisease, 
            kidneyDisease, 
            Diabetes, 
            ChestDisease, 
            Covid, 
            PreviousePregnancies, 
            NoOfLivingChildren,
            NumberOfOperations,
            uid
        }
        try {
            await axios.post(`http://${'localhost'}:7700/antenatal1`, value).then((res)=>{
                if(res.data.status === 'success'){
                    handleNext()
                    setreload(reload + 1)
                    handleNext()
                }else{
                    console.log(res.data);
                }
            })
        } catch (error) {
            console.log(error);
        }
    }


  return (
    <>
        <div className='sidebar_spacer' ></div>
      <h3>PREVIOUS MEDICAL HISTORY</h3>

      <div className='previouse_medicals_checkbox' >
          <div className='previouse_medicals_checkbox_text'>
              <h4>HEART DISEASE</h4>
              <div>
                  <div>
                      <p>Yes</p>
                      <input checked={heartDisease === 'yes' ? true : false} onChange={(e)=> setheartDisease('yes')} type='checkbox' />
                  </div>
                  
                  <div>
                      <p>No</p>
                      <input checked={heartDisease === 'no' ? true : false} onChange={(e)=> setheartDisease('no')} type='checkbox' />
                  </div>
              </div>
          </div>
          <div className='previouse_medicals_checkbox_text'>
              <h4>KIDNEY DISEASE</h4>
              <div>
                  <div>
                      <p>Yes</p>
                      <input checked={kidneyDisease === 'yes' ? true : false} onChange={(e)=> setkidneyDisease('yes')} type='checkbox' />
                  </div>
                  
                  <div>
                      <p>No</p>
                      <input type='checkbox' checked={kidneyDisease === 'no' ? true : false} onChange={(e)=> setkidneyDisease('no')} />
                  </div>
              </div>
          </div>
          <div className='previouse_medicals_checkbox_text'>
              <h4>DIABETES</h4>
              <div>
                  <div>
                      <p>Yes</p>
                      <input checked={Diabetes === 'yes' ? true : false} onChange={(e)=> setDiabetes('yes')} type='checkbox' />
                  </div>
                  
                  <div>
                      <p>No</p>
                      <input checked={Diabetes === 'no' ? true : false} onChange={(e)=> setDiabetes('no')} type='checkbox' />
                  </div>
              </div>
          </div>
          <div className='previouse_medicals_checkbox_text'>
              <h4>CHEST DISEASE</h4>
              <div>
                  <div>
                      <p>Yes</p>
                      <input checked={ChestDisease === 'yes' ? true : false} onChange={(e)=> setChestDisease('yes')} type='checkbox' />
                  </div>
                  
                  <div>
                      <p>No</p>
                      <input checked={ChestDisease === 'no' ? true : false} onChange={(e)=> setChestDisease('no')} type='checkbox' />
                  </div>
              </div>
          </div>
          <div className='previouse_medicals_checkbox_text'>
              <h4>COVID</h4>
              <div>
                  <div>
                      <p>Yes</p>
                      <input checked={Covid === 'yes' ? true : false} onChange={(e)=> setCovid('yes')} type='checkbox' />
                  </div>
                  
                  <div>
                      <p>No</p>
                      <input checked={Covid === 'no' ? true : false} onChange={(e)=> setCovid('no')} type='checkbox' />
                  </div>
              </div>
          </div>
      </div>

      <div className='patient_details_input_field1_operations'>
          <div className='patient_details_input_field1_' >
              <h4>OPERATIONS</h4>
              <input value={NumberOfOperations} onChange={(e)=>setNumberOfOperations(e.target.value)} />
          </div>
          <div className='patient_details_input_field1_' >
              <h4>PREVIOUS PREGNANCIES TOTAL</h4>
              <input value={PreviousePregnancies} onChange={(e)=>setPreviousePregnancies(e.target.value)} />
          </div>
          <div className='patient_details_input_field1_' >
              <h4>NO. OF LIVING CHILDREN</h4>
              <input value={NoOfLivingChildren} onChange={(e)=>setNoOfLivingChildren(e.target.value)} />
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

export default AnteNatal2