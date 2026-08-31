import React from 'react'

function NewPatients1({handleNext, currentIndex, setcurrentIndex}) {

    const handleAnte =()=>{
        setcurrentIndex(currentIndex + 2)
        sessionStorage.setItem('index', currentIndex + 2)
    }

  return (
    <div className='payment_desk' >
        <div className='add_new_patient_container'>
            <h2>ADD NEW PATIENTS</h2>

            <div className='add_new_patient_container_btns' >
                <button className='add_new_patient_container_btns1' onClick={handleNext}>ADD REGULAR PATIENT</button>
                <button className='add_new_patient_container_btns2' onClick={handleAnte} >ADD ANTE NATAL PATIENT</button>
            </div>
        </div>
    </div>
  )
}

export default NewPatients1