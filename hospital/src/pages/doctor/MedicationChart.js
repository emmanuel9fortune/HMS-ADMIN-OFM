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

  const [formData, setFormData] = useState([]);

  useEffect(() => {
    const fetchVitals = async () => {
      try {
        const res = await axios.post(`http://${'localhost'}:7700/getmedications`, { uid });
        if (res.data.status === 'success') {
          const medication = res.data.medication?.medications || [];

          const formatted = medication.length > 0
            ? medication.map(item => ({
                _id: item?._id,
                timeStamp: item?.timeStamp || '',
                medication: item?.medication || '',
                dosage: item?.dosage || '',
                route: item?.route || '',
                oxygen: item?.oxygen , 
                staffID: item?.staffID || `${staffName}`, 
                remark: item?.remark , 
              }))
            : [{
                timeStamp: new Date().getTime(),
                medication: '',
                dosage: '',
                route: '',
                oxygen: '',
                staffID: `${staffName}`,
                remark: '',
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
        timeStamp: new Date().getTime(),
        medication: '',
        dosage: '',
        route: '',
        oxygen: '',
        staffID: `${staffName}`,
        remark: '',
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
      const res = await axios.post(`http://${'localhost'}:7700/medications`, {
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
            <button onClick={()=>setcurrentIndex(0)}>PATIENT DETAILS</button> 
            <button onClick={()=>setcurrentIndex(1)}>VITALS</button> 
            <button onClick={()=>setcurrentIndex(2)}>LAB RESULTS | SCAN</button>
            <button onClick={()=>setcurrentIndex(3)}>PRESCRIPTION</button>
            <button className={currentIndex === 5 && 'dashboard_body_patient_details_btns_'}>MEDICATION CHART</button>
            <button onClick={()=>setcurrentIndex(4)}>TRANSACTION HISTORY</button>
        </div>
      <h2 style={{margin:'10px 0'}} >MEDICATION CHART</h2>
      <p className="custome_table_guide">
        Edit table details, click Add to add new row, then click "Save changes".
      </p>
      <table className="custome_table">
        <thead>
          <tr>
            <th>DATE</th>
            <th>MEDICATIONS </th>
            <th>DOSAGE</th>
            <th>ROUTE</th>
            <th>OXYGEN</th>
            <th>SIGN</th>
            <th>REMARK</th>
            <th>ACTION</th>
          </tr>
        </thead>
        <tbody >
          {formData.map((row, index) => {
                        
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

            return (
            <tr key={index}  >
              <td style={{height:'70px'}} >
                <div style={{display:'flex', flexDirection:'column'}} className='test_nurse'>
                    <p style={{width:'100px'}} >{day} | {month} | {year}</p>
                    <p>{timeString}</p>
                </div>
              </td>
              <td style={{height:'70px'}} >
                  <input
                    disabled 
                    name="medication" 
                    style={{height:'70px'}}
                    value={row.medication} 
                    onChange={e => 
                    handleChange(index, e)} 
                    placeholder="details" />
              </td>
              <td style={{height:'70px'}} >
                  <input
                    disabled 
                    name="dosage" 
                    value={row.dosage} 
                    onChange={e => handleChange(index, e)} 
                    placeholder="details" 
                    style={{height:'70px'}}
                  />
              </td>
              <td style={{height:'70px'}} >
                  <select disabled name='route' style={{height:'70px'}} value={row.route} onChange={(e) => handleChange(index, e)} >
                    <option value=''>SELECT ROUTE</option>
                    <option value='INTRADERMAL'>INTRADERMAL</option>
                    <option value='INTRAMUSCULAR'>INTRAMUSCULAR</option>
                    <option value='INTRAVENOUS'>INTRAVENOUS</option>
                    <option value='P|0-ORAL'>P|O-ORAL</option>
                    <option value='INTRAVAGINAL'>INTRAVAGINAL</option>
                    <option value='RECTAL'>RECTAL</option>
                    <option value='SUBTANGUAL'>SUBTANGUAL</option>
                    <option value='INTRALATIONAL'>INTRALATIONAL</option>
                    <option value='SUBCUTANEOUS'>SUBCUTANEOUS</option>
                  </select>
              </td>
              <td style={{height:'70px'}} >
                  <input
                    disabled 
                    name="oxygen" 
                    value={row.oxygen} 
                    onChange={e => handleChange(index, e)} 
                    placeholder="details" 
                    style={{height:'70px'}}
                  />
              </td>
              <td style={{height:'70px'}} >
                  <p style={{width:'100px'}}>{row.staffID}</p>
              </td>
              <td style={{height:'70px'}} >
                <input
                    disabled 
                    name="remark" 
                    value={row.remark} 
                    onChange={e => handleChange(index, e)} 
                    placeholder="details"   
                    style={{height:'70px'}}
                />
              </td>
              <td style={{height:'70px'}} >
                {
                    !row.staffID &&
                    <button 
                        style={{height:'70px'}} className="delete_btn" onClick={() => removeRow({ index })}>
                    Delete
                    </button>
                }
              </td>
            </tr>
          )}
          )}
        </tbody>
      </table>
    </div>
  );
}

export default Medications