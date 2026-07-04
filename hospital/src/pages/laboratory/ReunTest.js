import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { FaChevronLeft } from 'react-icons/fa';
import { useSelector } from 'react-redux';
import { selectid } from '../../features/idSlice';
import { toast } from 'react-toastify';
import { selectip } from '../../features/ipSlice'

//axios.defaults.withCredentials = true;

function ReunTest({ handleBack }) {
  const id = useSelector(selectid);
  const ip = useSelector(selectip)
  
  const uid = id?.id;
  const docID = id?.docID;

  const staffID = sessionStorage.getItem('staffID');
  const getid = staffID ? JSON.parse(staffID) : null;

  const [testOptions, setTestOptions] = useState([])

  useEffect(()=>{
    const func =async()=>{
      try{
        await axios.post(`http://${'localhost'}:7700/getTestScan`).then((res)=>{
          if(res.data.status === 'success'){
            setTestOptions(res.data.lab)
          }
        })
      }catch(error){
        console.log(error)
      }
    }
    func()
  },[ip])

  const [formData, setFormData] = useState([
    {
      date: '',
      testname: '',
      specimen: '',
      results: '',
      price: 0,
      labID: getid?._id,
      doctorID: docID,
      timeStamp: new Date().getTime()
    }
  ]);

  const handleChange = (index, e) => {
    const { name, value } = e.target;
    const updatedRows = [...formData];
    updatedRows[index][name] = value;

    if (name === 'testname') {
      const selectedTest = testOptions.find(test => test.name === value);
      updatedRows[index]['price'] = selectedTest?.price || 0;
    }

    setFormData(updatedRows);
  };

  const addRow = () => {
    setFormData(prev => [
      ...prev,
      {
        date: '',
        testname: '',
        specimen: '',
        results: '',
        price: 0,
        labID: getid?._id,
        doctorID: docID,
        timeStamp: new Date().getTime()
      }
    ]);
  };

  const handleSubmit = async () => {
    try {
      const res = await axios.post(`http://${'localhost'}:7700/runtest`, {
        formFields: formData,
        uid,
        staffID: getid?._id
      });

      if (res.data.status === 'success') {
        toast.success('TEST RESULT SUBMITTED SUCCESSFULLY');
        window.location.reload()
      } else {
        toast.error(res.data.message || 'Submission failed');
      }
    } catch (error) {
      console.error('Submission Error:', error);
      toast.error('Submission failed');
    }
  };
  

  const removeRow = async ({ index }) => {
    if (formData.length === 1) {
      return toast.error("At least one row is required.");
    }

    const updated = formData.filter((_, i) => i !== index);
    setFormData(updated);
  };


  return (
    <div className='dashboard_body'>
      <div className='back_btn_' onClick={handleBack}>
        <FaChevronLeft />
        <h4>BACK</h4>
      </div>

      <h3>TEST RESULTS</h3>
      <p className='custome_table_guide'>
        Edit table details, click "Add" to add a new row and "Submit" to save.
      </p>

      <table className='custome_table'>
        <thead>
          <tr>
            <th>DATE</th>
            <th>NAME OF TEST</th>
            <th>SPECIMEN TYPE</th>
            <th>RESULT</th>
            <th>PRICE (₦)</th>
            <th>ACTION</th>
          </tr>
        </thead>
        <tbody>
          {formData.map((row, index) => (
            <tr key={index}>
              <td>
                <input
                  name='date'
                  type='date'
                  value={row.date}
                  onChange={(e) => handleChange(index, e)}
                />
              </td>
              <td>
                <select
                  name='testname'
                  value={row.testname}
                  onChange={(e) => handleChange(index, e)}
                >
                  <option value=''>-- Select Test --</option>
                  {testOptions.map((test, i) => (
                    <option key={i} value={test.name}>
                      {test.name} (₦{test.price})
                    </option>
                  ))}
                </select>
              </td>
              <td>
                <input
                  name='specimen'
                  value={row.specimen}
                  onChange={(e) => handleChange(index, e)}
                  placeholder='Enter specimen type'
                />
              </td>
              <td>
                <textarea
                  name='results'
                  value={row.results}
                  onChange={(e) => handleChange(index, e)}
                  placeholder='Enter test result'
                />
              </td>
              <td>
                <input
                  type='number'
                  value={row.price}
                  readOnly
                />
              </td>
              <td>
                <button
                  className='delete_btn'
                  onClick={() => removeRow({ index})}
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
        <button className='custome_table_btn2' onClick={handleSubmit}>SUBMIT</button>
      </div>
    </div>
  );
}

export default ReunTest;
