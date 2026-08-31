import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { FaChevronLeft } from 'react-icons/fa';
import { useSelector } from 'react-redux';
import { selectpatient } from '../../../features/patientSlice';
import { selectip } from '../../../features/ipSlice'
import { toast } from 'react-toastify';

function AnteNatal3({ handleNext, handlePrevious, reload, setreload }) {
  //axios.defaults.withCredentials = true;

  const patient = useSelector(selectpatient);
  const uid = sessionStorage.getItem('patient');
  const ip = useSelector(selectip)

  const emptyRow = {
    dateOfBirth: '',
    durationOfPregnancy: '',
    birthWeight: '',
    complicationInPregnancy: '',
    complicationInLabour: '',
    puerPremium: '',
    ageAtDeath: '',
    causeOfDeath: '',
  };

  const [formData, setFormData] = useState([emptyRow]);

  useEffect(() => {
    if (patient?.operations?.length > 0) {
      const formatted = patient.operations.map(item => ({
        dateOfBirth: item?.dateOfBirth || '',
        durationOfPregnancy: item?.durationOfPregnancy || '',
        birthWeight: item?.birthWeight || '',
        complicationInPregnancy: item?.complicationInPregnancy || '',
        complicationInLabour: item?.complicationInLabour || '',
        puerPremium: item?.puerPremium || '',
        ageAtDeath: item?.ageAtDeath || '',
        causeOfDeath: item?.causeOfDeath || '',
        opId: item?._id || null, // Assuming backend gives an _id for deletion
        _id: item?._id || null // Assuming backend gives an _id for deletion
      }));
      setFormData(formatted);
    }
  }, [patient]);

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
      return toast.error("At least one row is required.");
    }

    const updated = formData.filter((_, i) => i !== index);
    setFormData(updated);

    if (opId) {
      try {
        await axios.post(`http://${'localhost'}:7700/deleteTable`, { opId, uid });
      } catch (error) {
        console.error(error);
      }
    }
  };

  const handleSubmit = async () => {
    try {
      const res = await axios.post(`http://${'localhost'}:7700/operations`, {
        formFields: formData,
        uid
      });

      if (res.data.status === 'success') {
        handleNext();
        setreload(reload + 1);
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <div className='back_btn_' onClick={handlePrevious}>
        <FaChevronLeft />
        <h4>BACK</h4>
      </div>

      <div className='sidebar_spacer'></div>

      <h3>RECENT CHILD BIRTHS</h3>

      <p className='custome_table_guide'>
        Edit table details, click "Add" to insert a new row and "Save changes" to proceed.
      </p>

      <table className='custome_table'>
        <thead>
          <tr>
            <th>DATE OF BIRTH</th>
            <th>DURATION OF PREGNANCY</th>
            <th>BIRTH WEIGHT</th>
            <th>COMPLICATION IN PREGNANCY</th>
            <th>COMPLICATION IN LABOUR</th>
            <th>PUERPERIUM</th>
            <th>AGE AT DEATH</th>
            <th>CAUSE OF DEATH</th>
            <th>ACTION</th>
          </tr>
        </thead>
        <tbody>
          {formData.map((row, index) => (
            <tr key={index}>
              <td><input name='dateOfBirth' type='date' value={row.dateOfBirth} onChange={e => handleChange(index, e)} /></td>
              <td><input name='durationOfPregnancy' value={row.durationOfPregnancy} onChange={e => handleChange(index, e)} /></td>
              <td><input name='birthWeight' value={row.birthWeight} onChange={e => handleChange(index, e)} /></td>
              <td><input name='complicationInPregnancy' value={row.complicationInPregnancy} onChange={e => handleChange(index, e)} /></td>
              <td><input name='complicationInLabour' value={row.complicationInLabour} onChange={e => handleChange(index, e)} /></td>
              <td><input name='puerPremium' value={row.puerPremium} onChange={e => handleChange(index, e)} /></td>
              <td><input name='ageAtDeath' value={row.ageAtDeath} onChange={e => handleChange(index, e)} /></td>
              <td><input name='causeOfDeath' value={row.causeOfDeath} onChange={e => handleChange(index, e)} /></td>
              <td>
                <button
                  className='delete_btn'
                  onClick={() => removeRow({ index, opId: row.opId })}
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
        <button className='custome_table_btn2' onClick={handleSubmit}>NEXT</button>
      </div>
    </>
  );
}

export default AnteNatal3;
