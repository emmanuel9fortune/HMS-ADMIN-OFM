import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { FaChevronLeft } from 'react-icons/fa'
import { useSelector } from 'react-redux';
import { selectid } from '../../features/idSlice';
import { selectip } from '../../features/ipSlice'

function Vitals({handleBack, setCurrentIndex, currenIndex}) {
    //axios.defaults.withCredentials = true

      const id = useSelector(selectid);
          const ip = useSelector(selectip)
      const uid = id?.id;
    
      const staffID = sessionStorage.getItem('staffID');
      const getDep = JSON.parse(staffID);
    
      const [formData, setFormData] = useState([]);
    
      useEffect(() => {
        const fetchVitals = async () => {
          try {
            const res = await axios.post(`http://${'localhost'}:7700/getvitals`, { uid });
            if (res.data.status === 'success') {
              const vitals = res.data.vitals?.vitals || [];
    
            const formatted = vitals.length > 0
              ? vitals.map(item => ({
                  _id: item?._id,
                  date: item?.date || '',
                  BP: item?.BP || '',
                  pulse: item?.pulse || '',
                  temperature: item?.temperature || '',
                  weight: item?.weight || '',
                  height: item?.height || '',
                  BMI: item?.BMI || '',
                  spo: item?.spo || '',
                  repiratory: item?.repiratory || '',
                  RBS: item?.RBS || '',
                  staffID: item?.staffID || getDep?._id, 
                }))
              : [{
                  date: '',
                  BP: '',
                  pulse: '',
                  temperature: '',
                  weight: '',
                  height: '',
                  BMI: '',
                  spo: '',
                  repiratory: '',
                  RBS: '',
                  staffID: getDep?._id,
                }];
    
              setFormData(formatted);
            }
          } catch (error) {
            console.error(error);
          }
        };
    
        if (uid) fetchVitals();
      }, [uid]);

  return (
      <div className='dashboard_body' >
          
          <div className='back_btn_' onClick={handleBack}>
              <FaChevronLeft />
              <h4>BACK</h4>
          </div>
        <div className='dashboard_body_patient_details_btns'>
            <button onClick={()=>setCurrentIndex(0)}>PATIENT DETAILS</button>
            <button className={currenIndex === 1 && 'dashboard_body_patient_details_btns_'} >VITALS</button>
            <button onClick={()=>setCurrentIndex(2)}>LAB RESULTS | SCAN</button>
            <button onClick={()=>setCurrentIndex(3)}>PRESCRIPTION</button>
            <button onClick={()=>setCurrentIndex(5)}>MEDICATION CHART</button>
            <button onClick={()=>setCurrentIndex(4)}>TRANSACTION HISTORY</button>
            
        </div>
          <p className='custome_table_guide'>Edit table details, Click Add button to add new table row and Click the button "Save changes" to save</p>
          
      <table className="custome_table">
        <thead>
          <tr>
            <th>DATE</th>
            <th>B.P.</th>
            <th>PULSE</th>
            <th>TEMPERATURE</th>
            <th>HEIGHT</th>
            <th>WEIGHT</th>
            <th>BMI</th>
            <th>SPO²</th>
            <th>REPIRATORY RATE</th>
            <th>RBS</th>
          </tr>
        </thead>
        <tbody>
          {formData.map((row, index) => {
            
            const getBPhigh = ( input, high='120/80' )=>{
              const [refh, refhdia] = high.split('/').map(Number)
              const [refin, refindia] = input.split('/').map(Number)

              return refin > refh || (refin === refhdia && refindia > refhdia)
            }

            const getBPlow = ( input, low = '90/60' )=>{
              const [refl, refldia] = low.split('/').map(Number)
              const [refin, refindia] = input.split('/').map(Number)

              return refin < refl || (refin === refldia && refindia < refldia)
            }

            const gethighs = getBPhigh(row.BP)
            const getlowss = getBPlow(row.BP)

            return(
            <tr key={index}>
              <td>
                <p>{row.date}</p>
              </td>
              <td>
                  <p style={gethighs || getlowss ? {color: 'red'} : {}}  >{row.BP} mmHg</p>
              </td>
              <td>
                  <p style={row.pulse >= 100 || row.pulse <= 60 ? {color: 'red'} : {}} >{row.pulse} B/M</p>
              </td>
              <td>
                  <p style={row.temperature >= 37 || row.temperature <= 35 ? {color: 'red'} : {}} >{row.temperature} C°</p>
              </td>
              <td>
                  <p>{row.height} m</p>
              </td>
              <td>
                  <p>{row.weight} kg
                  <br/>
                  <small>{row.weight * 2.205} Pound</small>
                  </p>
              </td>
              <td>
                <p>{row.BMI} kg/m²</p>
              </td>
              <td>
                <p>{row.spo} %</p>
              </td>
              <td>
                <p>{row.repiratory} c/m</p>
              </td>
              <td>
                <p>{row.RBS} mg/dl</p>
              </td>
            </tr>
          )})}
        </tbody>
      </table>
      </div>
  )
}

export default Vitals