import React, { useEffect, useState } from 'react';
import { FaChevronLeft } from 'react-icons/fa';
import { useSelector } from 'react-redux';
import { selectid } from '../../features/idSlice';
import axios from 'axios';
import { selectip } from '../../features/ipSlice'
import { toast } from 'react-toastify';

function EditPatientTests({ handleBack, currentIndex, setcurrentIndex }) {
  //axios.defaults.withCredentials = true;
      const ip = useSelector(selectip)

  const id = useSelector(selectid);
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
                _id: item?._id ,
                date: item?.date || new Date().getTime(),
                BP: item?.BP || '',
                pulse: item?.pulse || '',
                temperature: item?.temperature || '',
                weight: item?.weight || '',
                height: item?.height || '',
                BMI: item?.BMI || '',
                spo: item?.spo || '',
                oxygen: item?.oxygen || '',
                repiratory: item?.repiratory || '',
                RBS: item?.RBS || '',
                staffID: item?.staffID || getDep?.name, 
              }))
            : [{
                date: new Date().getTime(),
                BP: '',
                pulse: '',
                temperature: '',
                weight: '',
                height: '',
                BMI: '',
                spo: '',
                oxygen: '',
                repiratory: '',
                RBS: '',
                staffID: getDep?.name,
              }];

          setFormData(formatted);
        }
      } catch (error) {
        console.error(error);
      }
    };

    if (uid) fetchVitals();
  }, [uid]);

  const handleChange = (index, e) => {
    const { name, value } = e.target;
    setFormData(prev => {
      const updated = [...prev];
      updated[index][name] = value;
      const weight = name === 'weight' ?
      value : 
      updated[index].weight
      const height = updated[index].height
      updated[index].BMI = weight / (height * height)

      return updated;
    });
  };

  const addRow = () => {
    setFormData(prev => [
      ...prev,
      {
        date: new Date().getTime(),
        BP: '',
        pulse: '',
        temperature: '',
        weight: '',
        height: '',
        BMI: '',
        spo: '',
        oxygen: '',
        repiratory: '',
        RBS: '',
        staffID: getDep?.name,
      },
    ]);
  };

  const removeRow = ({ index }) => {
    if (formData.length === 1) {
      return toast.error('At least one row is required.');
    }
    setFormData(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    try {
      const res = await axios.post(`http://${'localhost'}:7700/setvitals`, {
        uid,
        formFields: formData,
      });
      if (res.data.status === 'success') {
        toast.success('Upload successful');
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="dashboard_body">
      <div className="back_btn_" onClick={handleBack}>
        <FaChevronLeft />
        <h4>BACK</h4>
      </div>
        <div className='dashboard_body_patient_details_btns'>
            <button onClick={()=>setcurrentIndex(1)}>PATIENT DETAILS</button> 
            <button className={currentIndex === 2 && 'dashboard_body_patient_details_btns_'}>PATIENT VITALS</button> 
            <button onClick={()=>setcurrentIndex(3)}>UTILITIES | CONSUMABLES</button>
            <button onClick={()=>setcurrentIndex(4)}>LAB RESULTS | SCAN</button>
            <button onClick={()=>setcurrentIndex(5)}>MEDICATION CHART</button>
            <button onClick={()=>setcurrentIndex(6)}>PRESCRIPTIONS</button>
        </div>
      <h2 style={{margin:'10px 0'}} >PATIENT VITALS</h2> 
      <p className="custome_table_guide">
        Edit table details, click Add to add new row, then click "Save changes".
      </p>
      <table className="custome_table">
        <thead>
          <tr>
            <th>DATE</th>
            <th>B.P. (mmHg) </th>
            <th>PULSE (B/M)</th>
            <th>TEMPERATURE (C°)</th>
            <th>HEIGHT (m) </th>
            <th>WEIGHT (kg) </th>
            <th>BMI (kg/m²) </th>
            <th>SPO² (%)</th>
            <th>OXYGEN</th>
            <th>REPIRATORY RATE (c/m) </th>
            <th>RBS</th>
            <th>SIGN</th>
            <th>ACTION</th>
          </tr>
        </thead>
        <tbody >
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
            
            const date = new Date(Number(row?.date))
            const day = date.getDate()
            const month = date.getMonth()
            const year = date.getFullYear()
            const date1 = new Date(Number(row?.date))
        
            let hours = date1.getHours()
            const minutes = date1.getMinutes()
            const ampm = hours >= 12 ? "PM" : "AM"
        
            hours = hours % 12
            hours = hours ? hours : 12
        
            const pad = (n) => n.toString().padStart(2, '0')
        
            const timeString = `${pad(hours)}:${pad(minutes)} ${ampm}`

            return (
            <tr key={index}  >
              <td>
                <div style={{display:'flex', flexDirection:'column'}} className='test_nurse'>
                    <p style={{width:'100px'}} >{day} | {month} | {year}</p>
                    <p>{timeString}</p>
                </div>
              </td>
              <td>
                  <input 
                    name="BP" 
                    style={gethighs || getlowss ? {color: 'red'} : {}} 
                    value={row.BP} 
                    onChange={e => 
                    handleChange(index, e)} 
                    placeholder="details" />
              </td>
              <td>
                  <input 
                    name="pulse" 
                    type='number' 
                    style={row.pulse >= 100 || row.pulse <= 60 ? {color: 'red'} : {}} 
                    value={row.pulse} 
                    onChange={e => handleChange(index, e)} 
                    placeholder="details" 
                  />
              </td>
              <td>
                  <input 
                    name="temperature" 
                    type='number' 
                    style={row.temperature >= 37 || row.temperature <= 35 ? {color: 'red'} : {}} 
                    value={row.temperature} 
                    onChange={e => handleChange(index, e)} 
                    placeholder="details"     
                  />
              </td>
              <td>
                  <input 
                    name="height" 
                    type='number'
                    value={row.height} 
                    onChange={e => handleChange(index, e)} 
                    placeholder="details"   
                  />
              </td>
              <td>
                <div className='test_nurse'>
                  <input 
                    name="weight" 
                    type='number'
                    value={row.weight} 
                    onChange={e => handleChange(index, e)} 
                    placeholder="details"   
                  />
                </div>
                <div className='test_nurse' >
                  <p>{row.weight * 2.205}</p>
                  <p style={{margin:'15px'}} >Pound</p>
                </div>
              </td>
              <td>
                  <input 
                    name="BMI" 
                    value={row.BMI} 
                    onChange={e => handleChange(index, e)} 
                    placeholder="details" />
              </td>
              <td>
                  <input 
                    name="spo"
                    type='number'
                    style={row.spo >= 100 || row.spo <= 88 ? {color: 'red'} : {}} 
                    value={row.spo} 
                    onChange={e => 
                    handleChange(index, e)} 
                    placeholder="details" />
              </td>
              <td>
                  <input 
                    name="oxygen"
                    type='number'
                    value={row.oxygen} 
                    onChange={e => 
                    handleChange(index, e)} 
                    placeholder="details" />
              </td>
              <td>
                  <input 
                  name="repiratory"
                  type='number'
                  style={row.repiratory >= 25 || row.repiratory <= 12 ? {color: 'red'} : {}} 
                  value={row.repiratory} 
                  onChange={e => 
                  handleChange(index, e)} 
                  placeholder="details" />
              </td>
              <td>
                  <input 
                  name="RBS"
                  value={row.RBS} 
                  onChange={e => 
                  handleChange(index, e)} 
                  placeholder="details" />
              </td>
              <td>
                <div style={{display:'flex', flexDirection:'column'}} className='test_nurse'>
                    <p style={{width:'100px', wordBreak: 'break-all'}} >{row.staffID}</p>
                </div>
              </td>
              <td>
                <button className="delete_btn" onClick={() => removeRow({ index })}>
                  Delete
                </button>
              </td>
            </tr>
          )}
          )}
        </tbody>
      </table>

      <div className="custome_table_btn">
        <button className="custome_table_btn1" onClick={addRow}>ADD</button>
        <button className="custome_table_btn2" onClick={handleSubmit}>SAVE CHANGES</button>
      </div>
    </div>
  );
}

export default EditPatientTests;
