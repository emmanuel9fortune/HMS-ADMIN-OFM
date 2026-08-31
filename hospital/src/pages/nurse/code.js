import React, { useEffect, useState } from 'react';
import { FaChevronLeft } from 'react-icons/fa';
import { useSelector } from 'react-redux';
import { selectid } from '../../features/idSlice';
import axios from 'axios';
import { selectip } from '../../features/ipSlice'
import { toast } from 'react-toastify';

function Medications({ handleBack, currentIndex, setcurrentIndex }) {
  //axios.defaults.withCredentials = true;
      const ip = useSelector(selectip)

  const id = useSelector(selectid);
  const uid = id?.id;

  const staffID = sessionStorage.getItem('staffID');
  const getDep = JSON.parse(staffID);

  const staffName = getDep?.name

 
    const [getIn, setgetIn] = useState([])
    const [staffs, setstaffs] = useState([])

    useEffect(()=>{
        const func =async()=>{
            try {
                await axios.post(`http://${'localhost'}:7700/getPrevPrescrition`, {uid}).then((res)=>{     
                    console.log(res);
                               
                    if(res.data.status === 'success'){
                        setgetIn(res.data.prescribe)
                        setstaffs(res.data.getStaffDetails)
                    }
                })
            } catch (error) {
                console.log(error);
            }
        }
        func()
    },[ip, uid])    

  return (
    <div className="dashboard_body">
      <div className="back_btn_" onClick={handleBack}>
        <FaChevronLeft />
        <h4>BACK</h4>
      </div>
        <div className='dashboard_body_patient_details_btns'>
            <button onClick={()=>setcurrentIndex(1)}>PATIENT DETAILS</button> 
            <button onClick={()=>setcurrentIndex(2)}>PATIENT VITALS</button> 
            <button onClick={()=>setcurrentIndex(3)}>UTILITIES | CONSUMABLES</button>
            <button onClick={()=>setcurrentIndex(4)}>LAB RESULTS | SCAN</button>
            <button className={currentIndex === 5 && 'dashboard_body_patient_details_btns_'}>MEDICATIONS</button>
            <button onClick={()=>setcurrentIndex(6)}>PRESCRIPTIONS</button>
        </div>
      <h2 style={{margin:'10px 0'}} >PATIENT MEDICATIONS</h2>
      <table className="custome_table">
        <thead>
          <tr>
            <th>DATE</th>
            <th>MEDICATIONS </th>
            <th>DOSAGE</th>
            <th>ROUTE</th>
            <th>SIGN</th>
            <th>ACTION</th>
          </tr>
        </thead>
        <tbody >
          { getIn?.map((item)=>{

              return item?.prescribe?.map((row, index) => {
                          
              const date = new Date(Number(row?.timeStamp))
              const day = date.getDate()
              const month = date.getMonth()
              const year = date.getFullYear()
              const date1 = new Date(Number(row?.timeStamp))
          
              let hours = date1.getHours()
              const minutes = date1.getMinutes()
              const ampm = hours >= 12 ? "PM" : "AM"
          
              hours = hours % 12
              hours = hours ? hours : 12
          
              const pad = (n) => n.toString().padStart(2, '0')
          
              const timeString = `${pad(hours)}:${pad(minutes)} ${ampm}`

              const getTimes = row?.time === '8hr' ? 3 : row?.time === '12hr' ?  2 : row?.time === '24hr' ? 1 : 1

              const repaetCount = (row?.days && getTimes) ? row.days * getTimes : 0
              

              return (
                [...Array(repaetCount)].map((_, i)=>(
                    <tr key={`${index}-${i}`} >
                        <td></td>
                        <td><p style={{fontSize:'19px'}}>{row?.drugs}</p></td>
                        <td><p style={{fontSize:'19px'}}  >{row?.time}</p></td>
                        <td><p style={{fontSize:'19px'}}  >{row?.time}</p></td>
                        <td><p style={{fontSize:'19px'}}  >{row?.time}</p></td>
                    </tr>
                  ))
              )
            }
            )
          })
          }
        </tbody>
      </table>
    </div>
  );
}

export default Medications