import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { FaChevronLeft } from 'react-icons/fa'
import { useSelector } from 'react-redux'
import { selectid } from '../../features/idSlice'
import { selectip } from '../../features/ipSlice'

function LabResult({ handleBack, setcurrentIndex, currentIndex }) {
    const ip = useSelector(selectip)

  const [labresults, setLabResults] = useState([])
  const [scan, setScan] = useState([])
  const [staff, setStaff] = useState([])
  const [patient, setpatient] = useState({})

  const id = useSelector(selectid)
  const uid = id?.id

    useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.post(`http://${'localhost'}:7700/viewScanLab`, { uid })
        //console.log(res);
        
        if (res.data.status === 'success') {
          setLabResults(res.data.getlabs || [])
          setScan(res.data.getscan || [])
          setStaff(res.data.staffs || [])
          setpatient(res.data.patient || [])
        }
      } catch (err) {
        console.error('Error fetching scan/lab data:', err)
      }
    }

    if (uid) {
      fetchData()
    }
  }, [uid, ip])

  // Combine results uniquely
  const combineObj = [...new Set([...labresults, ...scan])]
  
    const [req1, setReq1] = useState(false)
    const [imgs, setimgs] = useState('')

  return (
    <div className='dashboard_body'>
        <div className='back_btn_' onClick={handleBack}>
          <FaChevronLeft />
          <h4>BACK</h4>
        </div>
        <div className='dashboard_body_patient_details_btns'>
            <button onClick={()=>setcurrentIndex(1)}>PATIENT DETAILS</button> 
            <button onClick={()=>setcurrentIndex(2)}>PATIENT VITALS</button> 
            <button onClick={()=>setcurrentIndex(3)}>UTILITIES | CONSUMABLES</button>
            <button className={currentIndex === 4 && 'dashboard_body_patient_details_btns_'} >LAB RESULTS | SCAN</button>
            <button onClick={()=>setcurrentIndex(5)}>MEDICATION CHART</button>
            <button onClick={()=>setcurrentIndex(6)}>PRESCRIPTIONS</button>
        </div>

      <div className='lab_result_container'>
        {combineObj.length > 0 ? 
          combineObj.map((obj, i) => {
            const getdoc = staff?.length > 0 ? 
              staff?.find((item)=> obj?.lab?.some((obg)=> obg?.doctorID === item?._id) ) 
            : []

            const getlab = staff?.length > 0 ? 
              staff?.find((item)=> obj?.lab?.some((obg)=> obg?.labID === item?._id) ) 
            : []

            const getscan = staff?.length > 0 ? 
              staff?.find((item)=> obj?.scan?.some((obg)=> obg?.scanID === item?._id) ) 
            : []
            return (
             <div key={i} className='lab_result_container_l'>
                {
                  obj?.scan?.length > 0 ?
                    obj?.scan?.map((item, i)=>{
                        const photo =[
                          {img: item?.photo1},
                          {img: item?.photo2},
                          {img: item?.photo3},
                          {img: item?.photo4},
                          {img: item?.photo5},
                          {img: item?.photo6},
                        ]
                      return(
                        <div key={i} className='lab_result_container_'>
                          <h3>SCAN RESULTS</h3>
                          <div className='lab_result_header'>
                            <div>
                              {/* <div>
                                <h4>REQUEST DATE : </h4>
                                <p></p>
                              </div> */}
                              {
                                getdoc?.name &&
                                <div>
                                  <h4>DOCTOR :  </h4>
                                  <p>{getdoc?.name}</p>
                                </div>
                              }
                              
                              <div>
                                <h4>LAB SCIENTIST : </h4>
                                <p>{getlab?.name || getscan?.name}</p>
                              </div>
                            </div>

                            <div>
                              <div>
                                <h4>CLINIC : </h4>
                                <p>O.F.M Medical Centre</p>
                              </div>
                            </div>
                          </div>

                          <h4>PATIENT INFORMATION</h4>
                          
                          <div className='lab_result_header'>
                            <div>
                              <div>
                                <h4>PATIENT NAME : </h4>
                                <p>{patient?.name} </p>
                              </div>
                              <div>
                                <h4>DATE OF BIRTH : </h4>
                                <p>{patient?.dateOfBirth}</p>
                              </div>
                            </div>

                            <div>
                              <div>
                                <h4>SEX : </h4>
                                <p>{patient?.sex || 'Female'}</p>
                              </div>
                              <div >
                                  <h4>ADDRESS : </h4>
                                  <p>{patient?.address}</p>
                              </div>
                            </div>


                          </div>

                          <div className='scan_images' >
                              {
                                photo?.map((item, i)=>( 
                                  item?.img &&
                                  <img key={i} style={{cursor:'pointer'}} onClick={()=>[setimgs(item?.img), setReq1(true)]} src={`http://${'localhost'}:7700/uploads/scans/${item?.img}`} alt='' />
                                ))
                              }
                          </div>

                          {req1 && (
                            <div className='popt_request'>
                              <div className='over_lay_pop_up' onClick={() => setReq1(false)}></div>
                              <div className='pop_up_request_display1'>
                                <img src={`http://${'localhost'}:7700/uploads/scans/${imgs}`} alt='' />
                              </div>
                            </div>
                          )}
                        </div>
                      )
                    })
                  :
                  <div key={i} className='lab_result_container_'>
                    <h2>MEDICAL REPORT</h2>
                  
                  <div className='lab_result_header'>
                    <div>
                      {/* <div>
                        <h4>REQUEST DATE : </h4>
                        <p></p>
                      </div> */}
                      {
                        getdoc?.name &&
                        <div>
                          <h4>DOCTOR :  </h4>
                          <p>{getdoc?.name}</p>
                        </div>
                      }
                      
                      <div>
                        <h4>LAB SCIENTIST :</h4>
                        <p> {getlab?.name || getscan?.name}</p>
                      </div>
                    </div>

                    <div>
                      <div>
                        <h4>CLINIC : </h4>
                        <p>O.F.M Medical Centre</p>
                      </div>
                    </div>
                  </div>

                  <h4>PATIENT INFORMATION</h4>
                  
                  <div className='lab_result_header'>
                    <div>
                      <div>
                        <h4>PATIENT NAME : </h4>
                        <p>{patient?.name} </p>
                      </div>
                      <div>
                        <h4>DATE OF BIRTH : </h4>
                        <p>{patient?.dateOfBirth}</p>
                      </div>
                    </div>

                    <div>
                      <div>
                        <h4>SEX : </h4>
                        <p>{patient?.sex || 'Female'}</p>
                      </div>

                      <div >
                          <h4>ADDRESS : </h4>
                          <p>{patient?.address}</p>
                      </div>
                    </div>

                  </div>

                  <h4>TEST RESULTS</h4>
                  
                  <table className='custome_table'>
                      <thead>
                          <tr>
                              <th>DATE</th>
                              <th>NAME OF TEST</th>
                              <th>SPECIMEN TYPE</th>
                              <th>TEST RESULT</th>
                              <th>PRICE</th>
                          </tr>
                      </thead>
                      <tbody>
                        {
                          obj?.lab &&
                          obj?.lab?.map((item, i)=>(
                          <tr key={i} >
                              <td><p>{item?.date}</p></td>
                              <td><p>{item?.testname}</p></td>
                              <td><p>{item?.specimen}</p></td>
                              <td><p>{item?.results}</p></td>
                              <td><p>{item?.price}</p></td>
                          </tr>
                          ))
                        }
                      </tbody>
                  </table>
                  </div>
                }
              </div>
            )
          })
        : (
          <div className='add_new_patient_container make_request'>
            <h2>NO LAB RESULTS OR SCAN FOUND</h2>
          </div>
        )}
      </div>
    </div>
  )
}

export default LabResult
