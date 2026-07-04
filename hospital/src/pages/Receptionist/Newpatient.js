import React, { useEffect, useState } from 'react';
import SideBar from '../../components/SideBar';
import NewPatients1 from './newpatients/NewPatients1';
import RegularPatient from './newpatients/RegularPatient';
import AnteNatal1 from './newpatients/AnteNatal1';
import AnteNatal2 from './newpatients/AnteNatal2';
import AnteNatal3 from './newpatients/AnteNatal3';
import AnteNatal4 from './newpatients/AnteNatal4';
import AnteNatal5 from './newpatients/AnteNatal5';
import AnteNatal6 from './newpatients/AnteNatal6';
import AnteNatal7 from './newpatients/AnteNatal7';
import AnteNatal8 from './newpatients/AnteNatal8';
import AnteNatal9 from './newpatients/AnteNatal9';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { setpatients } from '../../features/patientSlice';
import { setantenatals } from '../../features/antenatalSlice';
import { useSelector } from 'react-redux'
import { selectip } from '../../features/ipSlice'

function Newpatient() {

  //axios.defaults.withCredentials = true
    const ip = useSelector(selectip)

  const getIndex = sessionStorage.getItem('index')
  const num = Number(getIndex)

  const [currentIndex, setcurrentIndex] = useState(num || 0)

  const handleNext =()=>{
    setcurrentIndex(currentIndex + 1)
    sessionStorage.setItem('index', currentIndex + 1)
  }

  const handlePrevious =()=>{
    setcurrentIndex(currentIndex - 1)
    sessionStorage.setItem('index', currentIndex - 1)
  }

  const uid = sessionStorage.getItem('patient')
  const [patientInfo, setPatientInfo] = useState([])
  const [reload, setreload] = useState(0)

  const dispatch = useDispatch()

  useEffect(()=>{
    const func =async()=>{
      try {
        await axios.post(`http://${'localhost'}:7700/getPatientDetails`,{uid} ).then((res)=>{
          //console.log(res);
          
          if(res.data.status === 'success'){
            setPatientInfo(res.data.getPatient)
            dispatch(
              setpatients(res.data.getPatient)
            )
            dispatch(
              setantenatals(res.data.getantenatal)
            )
            setreload(0)
          }
        })
      } catch (error) {
        console.log(error);
      }
    }
    func()
  },[reload, uid, dispatch, currentIndex, ip])

  return (
    <div className='dashboard_container'>
        <SideBar/>
        <div className='dashboard_body' >
          {
            currentIndex === 0 &&
            <NewPatients1 handleNext={handleNext} setcurrentIndex={setcurrentIndex} currentIndex={currentIndex} />
          }

          {
            currentIndex === 1 &&
            <RegularPatient handlePrevious={handlePrevious} />
          }

          {
            currentIndex === 2 &&
            <AnteNatal1 reload={reload} setreload={setreload} patientInfo={patientInfo} handlePrevious={handlePrevious} handleNext={handleNext} setcurrentIndex={setcurrentIndex} />
          }

          {
            currentIndex === 3 &&
            <AnteNatal2 reload={reload} setreload={setreload} patientInfo={patientInfo} handlePrevious={handlePrevious} handleNext={handleNext} />
          }

          {
            currentIndex === 4 &&
            <AnteNatal3 reload={reload} setreload={setreload} patientInfo={patientInfo} handlePrevious={handlePrevious} handleNext={handleNext} />
          }

          {
            currentIndex === 5 &&
            <AnteNatal4 reload={reload} setreload={setreload} patientInfo={patientInfo} handlePrevious={handlePrevious} handleNext={handleNext} />
          }

          {
            currentIndex === 6 &&
            <AnteNatal9 reload={reload} setreload={setreload} patientInfo={patientInfo} handlePrevious={handlePrevious} handleNext={handleNext} />
          }

          {
            currentIndex === 7 &&
            <AnteNatal5 reload={reload} setreload={setreload} patientInfo={patientInfo} handlePrevious={handlePrevious} handleNext={handleNext} />
          }

          {
            currentIndex === 8 &&
            <AnteNatal6 reload={reload} setreload={setreload} patientInfo={patientInfo} handlePrevious={handlePrevious} handleNext={handleNext} />
          }

          {
            currentIndex === 9 &&
            <AnteNatal7 reload={reload} setreload={setreload} patientInfo={patientInfo} handlePrevious={handlePrevious} handleNext={handleNext} />
          }

          {
            currentIndex === 10 &&
            <AnteNatal8 reload={reload} setreload={setreload} patientInfo={patientInfo} handlePrevious={handlePrevious} setcurrentIndex={setcurrentIndex} />
          }
        </div>
    </div>
  )
}

export default Newpatient;