import axios from 'axios'
import React, { useEffect, useRef, useState } from 'react'
import { FaChevronLeft } from 'react-icons/fa'
import { useSelector } from 'react-redux'
import { selectid } from '../../features/idSlice'
import TestDisplay from './TestDisplay'
import ScanDisplay from './ScanDisplay'

function LabResults({handleBack}) {
  const [staff, setStaff] = useState([])
  const [patient, setpatient] = useState({})
  const [combineObj, setcombineObj] = useState([])
  const [reload, setreload] = useState(0)
  const cip = window.location.hostname

  
  const id = useSelector(selectid);
  const uid = id?.id;
  

  useEffect(() => {
    const controller = new AbortController()
    const fetchData = async () => {
      try {
        const res = await axios.post(`http://${cip || 'localhost'}:7700/viewScanLab`, { uid, signal: controller.signal })
        // console.log(res);
        
        if (res.data.status === 'success') {
          setStaff(res.data.staffs || [])
          setpatient(res.data.patient || [])
          setcombineObj([...(res.data.getlabs || []), ...(res.data.getscan || [])]  )
        }
        setreload(0)
      } catch (err) {
        console.error('Error fetching scan/lab data:', err)
      }
    } 

    if (uid) {
      fetchData()
    }
    return ()=> controller.abort()
  }, [uid, cip, reload])
  

  // Combine results uniquely  

  const refs = useRef([]);
  const [ready, setReady] = useState(false);

  // Ensure refs are available for each result
  useEffect(() => {
    refs.current = combineObj.map((_, i) => refs.current[i] || React.createRef());
    setReady(true);
  }, [combineObj]);
  
  const [req, setReq] = useState(false)
  const [imgs, setimgs] = useState('')

  

  return (
    <div className='dashboard_body' >
        
      <div className='back_btn_' onClick={handleBack}>
          <FaChevronLeft />
          <h4>BACK</h4>
      </div>

      <div className='lab_result_container'>
        
        {combineObj?.length > 0 ?
          ready && combineObj?.map((obj, i) => {
            const view = true

            return (
              <div className='lab_result_container_l'  key={i}>
                <div style={{width:'100%'}}>
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
                           <ScanDisplay reload={reload} setreload={setreload} setimgs={setimgs} key={i} patient={patient} photo={photo} item={item} obj={obj?.scan} id={i} view={view}  setReq={setReq} />
                        )
                      })
                    :
                    obj?.lab?.map((res, i)=>(
                      <TestDisplay reload={reload} setreload={setreload} key={i} patient={patient} res={res} obj={obj?.lab} id={i} view={view} />
                    ))
                  }
                </div>
              </div>
          )})

          :
          <h3>No Results</h3>
        }

        {req && (
        <div className='popt_request'>
          <div className='over_lay_pop_up' onClick={() => setReq(false)}></div>
          <div className='pop_up_request_display1'>
            <img src={`http://${cip || 'localhost'}:7700/uploads/scans/${imgs}`} alt='' />
          </div>
        </div>
      )}
      </div>
    </div>
  )
}

export default LabResults