import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { FaChevronLeft } from 'react-icons/fa';
import { useSelector } from 'react-redux';
import { selectpatient } from '../../../features/patientSlice';
import { selectip } from '../../../features/ipSlice'
import { toast } from 'react-toastify';

function AnteNatal7({ handlePrevious, handleNext, setreload, reload }) {
  //axios.defaults.withCredentials = true;
          const ip = useSelector(selectip)
  const patient = useSelector(selectpatient);
  const uid = sessionStorage.getItem('patient');

  const [formData, setFormData] = useState([]);

  useEffect(() => {
    if (patient?.anteNatalRecords?.length > 0) {
      const formattedData = patient.anteNatalRecords.map(item => ({
        _id: item?._id,
        date: item?.date || '',
        heightOfFundus: item?.heightOfFundus || '',
        presentingPartToBrim: item?.presentingPartToBrim || '',
        presentationAndPosition: item?.presentationAndPosition || '',
        oedema: item?.oedema || '',
        foetalHeart: item?.foetalHeart || '',
        urine: item?.urine || '',
        BP: item?.BP || '',
        weight: item?.weight || '',
        HB: item?.HB || '',
        remark: item?.remark || '',
        initialOfExaminer: item?.initialOfExaminer || '',
        Return: item?.Return || '',
      }));
      setFormData(formattedData);
    } else {
      setFormData([{
        date: '',
        heightOfFundus: '',
        presentingPartToBrim: '',
        presentationAndPosition: '',
        oedema: '',
        foetalHeart: '',
        urine: '',
        BP: '',
        weight: '',
        HB: '',
        remark: '',
        initialOfExaminer: '',
        Return: '',
      }]);
    }
  }, [patient]);

  const handleChange = (index, e) => {
    const { name, value } = e.target;
    const updated = [...formData];
    updated[index][name] = value;
    setFormData(updated);
  };

  const addRow = () => {
    setFormData(prev => [
      ...prev,
      {
        date: '',
        heightOfFundus: '',
        presentingPartToBrim: '',
        presentationAndPosition: '',
        oedema: '',
        foetalHeart: '',
        urine: '',
        BP: '',
        weight: '',
        HB: '',
        remark: '',
        initialOfExaminer: '',
        Return: '',
      },
    ]);
  };

  const removeRow = async (index, _id) => {
    if (formData.length === 1) return toast.error('At least one row is required.');
    const updatedRows = formData.filter((_, i) => i !== index);
    setFormData(updatedRows);

    if (_id) {
      try {
        await axios.post(`http://${'localhost'}:7700/deleteTable`, { uid, Id: _id });
      } catch (error) {
        console.log(error);
      }
    }
  };

  const handleSubmit = async () => {
    try {
      await axios.post(`http://${'localhost'}:7700/antenatal7`, {
        uid,
        formFields: formData,
      }).then((res) => {
        if (res.data.status === 'success') {
          handleNext();
          setreload(reload + 1);
        }
      });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <div className='back_btn_' onClick={handlePrevious}>
        <FaChevronLeft />
        <h4>BACK</h4>
      </div>

      <div className='sidebar_spacer'></div>
      <p className='custome_table_guide'>
        Edit table details, Click Add button to add new table row and Click "Next" to save
      </p>

      <table className='custome_table'>
        <thead>
          <tr>
            <th>DATE</th>
            <th>HEIGHT OF FUNDUS</th>
            <th>PART TO BRIM</th>
            <th>PRESENTATION</th>
            <th>FOETAL HEART</th>
            <th>URINE</th>
            <th>B.P.</th>
            <th>WEIGHT</th>
            <th>HB</th>
            <th>OEDEMA</th>
            <th>REMARK</th>
            <th>EXAMINER</th>
            <th>RETURN</th>
            <th>ACTION</th>
          </tr>
        </thead>
        <tbody>
          {formData.map((row, index) => (
            <tr key={index}>
              <td><input type='date' name='date' value={row.date} onChange={(e) => handleChange(index, e)} /></td>
              <td><input name='heightOfFundus' value={row.heightOfFundus} onChange={(e) => handleChange(index, e)} /></td>
              <td><input name='presentingPartToBrim' value={row.presentingPartToBrim} onChange={(e) => handleChange(index, e)} /></td>
              <td><input name='presentationAndPosition' value={row.presentationAndPosition} onChange={(e) => handleChange(index, e)} /></td>
              <td><input name='foetalHeart' value={row.foetalHeart} onChange={(e) => handleChange(index, e)} /></td>
              <td><input name='urine' value={row.urine} onChange={(e) => handleChange(index, e)} /></td>
              <td><input name='BP' value={row.BP} onChange={(e) => handleChange(index, e)} /></td>
              <td><input name='weight' value={row.weight} onChange={(e) => handleChange(index, e)} /></td>
              <td><input name='HB' value={row.HB} onChange={(e) => handleChange(index, e)} /></td>
              <td><input name='oedema' value={row.oedema} onChange={(e) => handleChange(index, e)} /></td>
              <td><input name='remark' value={row.remark} onChange={(e) => handleChange(index, e)} /></td>
              <td><input name='initialOfExaminer' value={row.initialOfExaminer} onChange={(e) => handleChange(index, e)} /></td>
              <td><input name='Return' value={row.Return} onChange={(e) => handleChange(index, e)} /></td>
              <td>
                <button onClick={() => removeRow(index, row._id)} className='delete_btn'>Delete</button>
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

export default AnteNatal7;
