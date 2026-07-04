import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { selectid } from '../../features/idSlice'
import { selectip } from '../../features/ipSlice'

function LabResults() {
    const ip = useSelector(selectip)

  const [labresults, setLabResults] = useState([])
  const [scan, setScan] = useState([])
  const [staff, setStaff] = useState([])
  const [patient, setpatient] = useState({})

  
  const id = useSelector(selectid);
  const uid = id?.id;
  

    useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.post(`http://${'localhost'}:7700/viewScanLab`, { uid })
        console.log(res);
        
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
  const combineObj = [...(labresults || []), ...(scan || [])]  
  

  return (
      <div className='lab_result_container'>
        
        {combineObj?.length > 0 ?
          combineObj?.map((obj, i) => {
            const getdoc = staff?.length > 0 ? 
              staff?.find((item)=> obj?.lab.some((obg)=> obg?.doctorID === item?._id) ) 
            : []

            const getlab = staff?.length > 0 ? 
              staff?.find((item)=> obj?.lab.some((obg)=> obg?.labID === item?._id) ) 
            : []

            return (
            <div key={i} className='lab_result_container_'>
              <h2>MEDICAL REPORT</h2>
            
            <div className='lab_result_header'>
              <div>
                {/* <div>
                  <h4>REQUEST DATE : </h4>
                  <p></p>
                </div> */}
                <div>
                  <h4>DOCTOR :  </h4>
                  <p>{getdoc?.name}</p>
                </div>
                
                <div>
                  <h4>LAB SCIENTIST : {getlab?.name}</h4>
                  <p></p>
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
                  <p>{patient?.sex ? patient?.sex : 'Female'}</p>
                </div>
                {
                  patient?.phone ?
                  <div>
                    <h4>CONTACT NUMBER : {patient?.phone}</h4>
                    <p></p>
                  </div>
                  : null
                }
              </div>

              <div className='lab_result_address'>
                  <h4>ADDRESS : {patient?.address}</h4>
                  <p></p>
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
          )})

          :
          <h3>No Results</h3>
        }
      </div>
  )
}

export default LabResults