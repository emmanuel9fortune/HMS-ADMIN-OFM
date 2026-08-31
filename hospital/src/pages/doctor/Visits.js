import React from 'react'
import { FaChevronLeft } from 'react-icons/fa'

function Visits({handleBack, setCurrentIndex, currenIndex}) {
  return (
        <div className='dashboard_body' >
          <div className='dashboard_body_patient_details_btns'>
              <button onClick={()=>setCurrentIndex(0)}>PATIENT DETAILS</button>
              <button onClick={()=>setCurrentIndex(1)}>VITALS</button>
              <button onClick={()=>setCurrentIndex(2)}>LAB RESULTS</button>
              <button className={currenIndex === 3 && 'dashboard_body_patient_details_btns_'}>PREVIOUS VISITS</button>
              <button onClick={()=>setCurrentIndex(4)}>PRESCRIPTION</button>
        </div>
        
        <div className='back_btn_' onClick={handleBack}>
            <FaChevronLeft />
            <h4>BACK</h4>
        </div>

        
        <div className='recentpatientdashcard'>
            <div className='recentpatientdashcard_desc'>
                <h4>Staff</h4>
                <p>message</p>
            </div>
        </div>
    </div>
  )
}

export default Visits