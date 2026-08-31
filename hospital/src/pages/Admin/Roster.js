import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import { selectip } from '../../features/ipSlice';
import AdminBar from '../../components/AdminBar';
import { toast } from 'react-toastify';

function Roster() {
  const ip = useSelector(selectip)

    const emptyRow = {
        time: '', 
        mon: '', 
        tue: '',
        wed: '',
        thu: '',
        fri: '',
        set: '',
        sun: '',
    };

  const [formData, setFormData] = useState([emptyRow]);
  const [getinfo, setgetinfo] = useState(0);
  const cip = window.location.hostname

  useEffect(()=>{
    const func =async()=>{
        await axios.post(`http://${cip || 'localhost'}:7700/getroster`).then((res)=>{            
            if(res.data.status === 'success'){
                setgetinfo(res.data.roster)
            }
        })
    }
    func()
  },[ip])

  useEffect(() => {
    console.log(getinfo?.roster);
    
    if (getinfo?.roster?.length > 0) {
      const formatted = getinfo.roster.map(item => ({
        time: item?.time || '',
        mon: item?.mon || '',
        tue: item?.tue || '',
        wed: item?.wed || '',
        thu: item?.thu || '',
        fri: item?.fri || '',
        set: item?.set || '',
        sun: item?.sun || '',
        _id: item?._id || null // Assuming backend gives an _id for deletion
      }));
      setFormData(formatted);
    }
  }, [getinfo]);

  const handleChange = (index, e) => {
    const { name, value } = e.target;
    const updated = [...formData];
    updated[index][name] = value;
    setFormData(updated);
  };

  const addRow = () => {
    setFormData(prev => [...prev, emptyRow]);
  };

  const removeRow = async ({ index, opId }) => {
    if (formData.length === 1) {
      return alert("At least one row is required.");
    }

    const updated = formData.filter((_, i) => i !== index);
    setFormData(updated);

    if (opId) {
      try {
        await axios.post(`http://${cip || 'localhost'}:7700/deleteRoster`, { id: opId });
      } catch (error) {
        console.error(error);
      }
    }
  };

  const handleSubmit = async () => {
    try {
      const res = await axios.post(`http://${cip || 'localhost'}:7700/addroster`, {
        formFields: formData,
      });      

      if (res.data.status === 'success') {
        toast.success('ROSTER UPDATED')
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className='dashboard_container'>
         <AdminBar/> 
        <div className='dashboard_body' >
            <table className='custome_table'>
                <thead>
                <tr>
                    <th>TIME</th>
                    <th>MON</th>
                    <th>TUE</th>
                    <th>WED</th>
                    <th>THU</th>
                    <th>FRI</th>
                    <th>SAT</th>
                    <th>SUN</th>
                    <th>ACTION</th>
                </tr>
                </thead>
                <tbody>
                {formData.map((row, index) => (
                    <tr key={index}>
                    <td><input name='time' type='time' value={row.time} onChange={e => handleChange(index, e)} /></td>
                    <td><input name='mon' value={row.mon} onChange={e => handleChange(index, e)} /></td>
                    <td><input name='tue' value={row.tue} onChange={e => handleChange(index, e)} /></td>
                    <td><input name='wed' value={row.wed} onChange={e => handleChange(index, e)} /></td>
                    <td><input name='thu' value={row.thu} onChange={e => handleChange(index, e)} /></td>
                    <td><input name='fri' value={row.fri} onChange={e => handleChange(index, e)} /></td>
                    <td><input name='set' value={row.set} onChange={e => handleChange(index, e)} /></td>
                    <td><input name='sun' value={row.sun} onChange={e => handleChange(index, e)} /></td>
                    <td>
                        <button
                        className='delete_btn'
                        onClick={() => removeRow({ index, opId: row._id })}
                        >
                        Delete
                        </button>
                    </td>
                    </tr>
                ))}
                </tbody>
            </table>

            <div className='custome_table_btn'>
                <button className='custome_table_btn1' onClick={addRow}>ADD</button>
                <button className='custome_table_btn2' onClick={handleSubmit}>SAVE</button>
            </div>
        </div>
    </div>
  )
}

export default Roster