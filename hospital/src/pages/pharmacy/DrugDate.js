import React from 'react'
import PharmacyBar from '../../components/PharmacyBar'
import { FaSearch } from 'react-icons/fa'

function DrugDate() {
  return (
      <div className='dashboard_container'>
          <PharmacyBar/> 
          <div className='dashboard_body' >
              <div className='dashboard_body_header' >
                  <div className='dashboard_body_header_search'>
                      <FaSearch/>
                      <input placeholder='Search' />
                  </div>
              </div>
  
              <h3>SEARCH RESULTS</h3>
              <div className='drug_top_label'>
                  <h4>UTILITY NAME</h4>
                  <h4>EXPIRING DATE</h4>
              </div>
              
                <div className='recentpatientdashcard'>
                    <div className='recentpatientdashcard_desc'>
                        <h4>Drug Name</h4>
                    </div>

                    <div className='recentpatientdashcard_desc'>
                        <p>DATE</p>
                    </div>
                </div>
          </div>
    </div>
  )
}

export default DrugDate