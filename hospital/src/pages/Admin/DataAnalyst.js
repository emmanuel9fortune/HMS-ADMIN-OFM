import React from 'react'
import AdminBar from '../../components/AdminBar'
import { useState } from 'react'
import { useEffect } from 'react'
import axios from 'axios'
import { FaChevronLeft } from 'react-icons/fa'
import { Link } from 'react-router-dom'
import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'
import { toast } from 'react-toastify'
import { DataReport } from './DataReport'

function DataAnalyst() {
  const cip = window.location.hostname

    const [getPatient, setgetPatient] = useState([])
    const [diagnos, setdiagnos] = useState([])
    const [sex, setsex] = useState('')
    const [age, setage] = useState('')
    const [diagnosis, setdiagnosis] = useState('')
    const [date, setdate] = useState('')
    const [enddate, setenddate] = useState('')
    const [type, settype] = useState('')
    const [address, setaddress] = useState('')
    const [mnth, setmnth] = useState('')
    const [yr, setyr] = useState('')

    useEffect(()=>{
        const raw = 7
        const now = Date.now()

        const DaysAgo = now - raw * 24 * 60 * 60 * 1000

        setdate(DaysAgo);
        setenddate(now);
    },[])


    useEffect(()=>{
        const controller = new AbortController()
        const func =async()=>{            
            try {
                await axios.post(`http://${cip || 'localhost'}:7700/datadiagnosis`, {location: address, unix: date, eunix: enddate, sex, age, type, diagnosis, signal: controller.signal}).then((res)=>{
                    if(res.data.status === 'success'){
                        setgetPatient(res.data.patients)
                        setdiagnos(res.data.diagnos)
                    }
                })
            } catch (error) {
                console.log(error);
            }
        }
        func()
        return ()=> controller.abort()
    },[address, cip, date, enddate, sex, age, type, diagnosis])

    const handleDate = async(e) => {
        const raw = e.target.value;
        setaddress(raw);

        if(mnth){
            try {
                await axios.post(`http://${cip || 'localhost'}:7700/datadiagnosis/month`, {unix: date, eunix: enddate, sex, location: raw, age, type, diagnosis}).then((res)=>{
                    if(res.data.status === 'success'){
                        setgetPatient(res.data.patients)
                        setdiagnos(res.data.diagnos)
                    }
                })
            } catch (error) {
                console.log(error)
            }
        }else if(yr){
            try {
                await axios.post(`http://${cip || 'localhost'}:7700/datadiagnosis/year`, {unix: date, eunix: enddate, sex, location: raw, age, type, diagnosis}).then((res)=>{
                    if(res.data.status === 'success'){
                        setgetPatient(res.data.patients)
                        setdiagnos(res.data.diagnos)
                    }
                })
            } catch (error) {
                console.log(error)
            }
        }else{
            try {
                await axios.post(`http://${cip || 'localhost'}:7700/datadiagnosis`, {unix: date, eunix: enddate, sex, location: raw, age, type, diagnosis}).then((res)=>{
                    if(res.data.status === 'success'){
                        setgetPatient(res.data.patients)
                        setdiagnos(res.data.diagnos)
                    }
                })
            } catch (error) {
                console.log(error)
            }
        }
    };


    // ============================================================= //
    // ||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||| //
    // ============================================================= //

    // ============================================================= //
    // ||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||| //
    // ============================================================= //
    

    const handlePeriod =(e) => {
        const raw = e.target.value;
        const now = Date.now()

        const DaysAgo = now - raw * 24 * 60 * 60 * 1000

        setdate(DaysAgo);
        setenddate(now);
    }


    const handlePeriodByMonth = async(e) => {
        const month = Number(e.target.value);
        setmnth(month)
        const year = new Date().getFullYear();

        const start = new Date(year, month - 1, 1).getTime();
        const end = new Date(year, month, 0, 23, 59, 59, 999).getTime();

        setdate(start);
        setenddate(end);
        // Then fetch uses effect or you can call manually:
        await axios.post(`http://${cip || 'localhost' }:7700/datadiagnosis/month`, { year, month, sex, location: address, age, type, diagnosis})
        .then((res)=>{
            if(res.data.status === 'success'){
                setgetPatient(res.data.patients)
                setdiagnos(res.data.diagnos)
            }
        })
    };

    const handlePeriodByyEAR = async(e) => {
        const year = Number(e.target.value); // e.g., 2025 selected from dropdown
        setyr(year)
        // Define full year range
        const start = new Date(year, 0, 1).getTime(); // Jan 1, 00:00
        const end = new Date(year, 11, 31, 23, 59, 59, 999).getTime(); // Dec 31, 23:59:59

        setdate(start);
        setenddate(end);

        try {
            const res = await axios.post(`http://${cip || 'localhost'}:7700/datadiagnosis/year`, { year, sex, location: address, age, type, diagnosis});
            if(res.data.status === 'success'){
                setgetPatient(res.data.patients)
                setdiagnos(res.data.diagnos)
            }
        } catch (err) {
            console.error('Error fetching yearly data:', err);
        }
    };

  
    

    const currentYear = new Date().getFullYear();
    const startYear = 2025; // or the first year your app started saving data
    const years = [];

    for (let y = currentYear; y >= startYear; y--) {
        years.push(y);
    }

    
    const [search, setsearch] = useState([])
    const [getsearch, setgetsearch] = useState('')

    const handleSearch = async(e) => {
        
        const searchQuery = typeof e === 'string' ? e : e?.target?.value || '';
        setgetsearch(searchQuery);

        if (searchQuery.trim().length === 0) {
            setsearch([]);
            setdiagnosis('');
            return;
        }
        
        
        if (searchQuery.length > 0) {
            try {
                const value = {     
                    search : searchQuery
                }

                const response = await axios.post(`http://${cip || 'localhost'}:7700/searchDiagnosis`, value);                
                setsearch(response.data.patients)                 
                
            } catch (err) {
                console.error('Error fetching search results', err);
            }
        } else {
            setsearch([]);
        }
    }


    // Dynamic summary generator
    const generateSummary = () => {
        const parts = [];

        // if (!diagnosis || !getsearch) return `Enter a Diagnosis.`;

        if (sex) parts.push(sex.toLowerCase());

        // Age group
        if (age) {
            const groupMap = {
            new: 'newborn',
            under: 'under-five children',
            child: 'children',
            adolescence: 'adolescents',
            adult: 'adults',
            middle: 'middle-aged adults',
            elder: 'elderly patients',
            };
            parts.push(groupMap[age]);
        }

        // Location
        if (address) parts.push(`from ${address}`);

        // Diagnosis
        if (diagnosis) parts.push(`that had ${diagnosis}`);

        // Diagnosis Type
        if (type) parts.push(`confirmed through ${type.toLowerCase()}`);

        // Handle time-based filtering
        let periodDescription = '';
        if (mnth) {
            const monthNames = [
            '', 'January', 'February', 'March', 'April', 'May', 'June',
            'July', 'August', 'September', 'October', 'November', 'December'
            ];
            periodDescription = `in the month of ${monthNames[mnth]}`;
        } else if (yr) {
            periodDescription = `in the year ${yr}`;
        } else {
            // derive relative period based on unix timestamps (7 days, 31 days etc.)
            const diffDays = Math.round((enddate - date) / (1000 * 60 * 60 * 24));
            if (diffDays <= 7) periodDescription = 'in the last 7 days';
            else if (diffDays <= 31) periodDescription = 'in the last month';
            else if (diffDays <= 62) periodDescription = 'in the last two months';
            else if (diffDays <= 186) periodDescription = 'in the last six months';
            else if (diffDays >= 356) periodDescription = 'in the last year';
        }

        if (periodDescription) parts.push(periodDescription);

        if (parts.length === 0) return 'Showing all patient diagnoses.';
        return `Here are the Patients ${parts.join(' ')}`;
    };

    const summary = generateSummary();

    
    const handleDownload = () => { 
        DataReport(diagnos, getPatient, summary);
    };
    

  return (
    <div className='dashboard_container'>
        <AdminBar/> 

        <div className='dashboard_body' >
            
            <Link to={'/'} className='back_btn_' >
                <FaChevronLeft />
                <h4>BACK</h4>
            </Link>

            <div style={{display:'flex', alignItems:'center', width:'100%', margin:'20px 0'}}>
                <div className='patient_details_input_field1_' style={{margin:'0 5px', position:'relative'}}>
                    <h4>SEARCH DIAGNOSIS</h4>
                    <input placeholder='Enter Diagnosis' value={getsearch} onChange={handleSearch} type='text' />

                    {   search?.length > 0 &&
                        <div style={{width:'280px', height:'450px', overflowY:'scroll', position:'absolute', bottom:'-450px', backgroundColor:'#e7e7e7ff', zIndex:20000}} >
                            {
                                search?.map((srch, i)=>(
                                    <div key={i} onClick={()=> {setdiagnosis(srch?.name); setgetsearch(srch?.name); setsearch([])}} style={{width:'100%', backgroundColor:'#d1d1d1ff', cursor:'pointer', margin:'5px 0', padding:'10px'}}>
                                        <div >
                                            <p style={{fontWeight:'800', fontSize:'18px'}}>Name: {srch?.name}</p>
                                            <p>Type: {srch?.type}</p>
                                        </div>
                                    </div>
                                ))
                            }
                        </div>
                    }
                    
                </div>  

                <div className='patient_details_input_field1_' style={{margin:'0 5px', width:'70%'}}>
                    <h4>ENTER LOCATION</h4>
                    <input placeholder='Enter Location' value={address} onChange={handleDate} type='text' />
                </div>  
                
                <button onClick={handleDownload} className={'dashboard_body_patient_details_btns_'} style={{marginTop:'30px'}}>DOWNLOAD</button>
            </div>

            <div style={{display:'flex', alignItems:'center', width:'100%'}}>
                <div className='patient_details_input_field1_in_' >

                    <div className='patient_details_input_field1_' style={{margin:'0 5px'}}>
                        <h4>CHOOSE AGE GROUP</h4>
                        <select value={age} onChange={(e)=>setage(e.target.value)} >
                            <option value={''}>SELECT GROUP</option>
                            <option value={'new'}>NEW BORN</option>
                            <option value={'under'}>UNDER FIVE</option>
                            <option value={'child'}>CHILDREN</option>
                            <option value={'adolescence'}>ADOLESCENCE</option>
                            <option value={'adult'}>ADULT</option>
                            <option value={'middle'}>MIDDLE AGE</option>
                            <option value={'elder'}>ELDERLY</option>
                        </select>
                    </div>

                    <div className='patient_details_input_field1_' style={{margin:'0 5px'}}>
                        <h4>DIAGNOSIS TYPE</h4>
                        <select value={type} onChange={(e)=> settype(e.target.value)} >
                            <option value={''}>Select Type</option>
                            <option value={'TEST'} >TEST</option>
                            <option value={'HISTORY'}>HISTORY</option>
                        </select>
                    </div>
                    
                    <div className='patient_details_input_field1_' style={{margin:'0 5px'}}>
                        <h4>CHOOSE SEX</h4>
                        <select onChange={(e)=> setsex(e.target.value)} >
                            <option value={''}>ALL</option>
                            <option value={'male'} >MALE</option>
                            <option value={'female'}>FEMALE </option>
                        </select>
                    </div>
                </div>
                
                <div className='patient_details_input_field1_in_'>
                    <div className='patient_details_input_field1_' style={{margin:'0 5px'}}>
                        <h4>CHOOSE PERIOD</h4>
                        <select onChange={handlePeriod} >
                            <option value={7} >SELECT PERIOD</option>
                            <option value={7} >LAST WEEK</option>
                            <option value={31} >LAST MONTH </option>
                            <option value={62}>LAST TWO MONTH</option>
                            <option value={186}>LAST SIX MONTHS</option>
                            <option value={356}>YEAR</option>
                        </select>
                    </div>
                    <div className='patient_details_input_field1_' style={{margin:'0 5px'}}>
                        <h4>CHOOSE MONTH</h4>
                        <select onChange={handlePeriodByMonth} >
                            <option value={1}>SELECT MONTH</option>
                            <option value={1}>JANUARY</option>
                            <option value={2}>FEBUARY</option>
                            <option value={3}>MARCH</option>
                            <option value={4}>APRIL</option>
                            <option value={5}>MAY</option>
                            <option value={6}>JUNE</option>
                            <option value={7}>JULY</option>
                            <option value={8}>AUGUST</option>
                            <option value={9}>SEPTEMBER</option>
                            <option value={10}>OCTOBER</option>
                            <option value={11}>NOVEMBER</option>
                            <option value={12}>DECEMBER</option>
                        </select>
                    </div>
                    
                    <div className='patient_details_input_field1_' style={{margin:'0 5px'}}>
                        <h4>CHOOSE YEAR</h4>
                        <select onChange={handlePeriodByyEAR} >
                            <option>CHOOSE YEAR</option>
                                {years?.map((year) => (
                                <option key={year} value={year}>
                                {year}
                                </option>
                            ))}
                        </select>
                    </div>
                    


                   
                </div>
            </div>

            <div id='pdf-content' style={{padding:'10px'}} >
                <h3>OFM MEDICAL CENTER</h3>
                <h1 style={{margin:'10px 0 20px 0', textTransform:'uppercase'}}>{summary}. {diagnos?.length} in total</h1>

                
                <table className='custome_table'>
                    <thead>
                        <tr>
                            <th>DATE | TIME</th>
                            <th>SEX</th>
                            <th>AGE</th>
                            <th>PATIENT NAME</th>
                            <th>ADDRESS</th>
                            <th>DIAGNOSIS</th>
                            <th>MODE OF CONFIRMATION</th>
                        </tr>
                    </thead>

                    { diagnos?.length > 0 &&
                        diagnos?.map((item, i)=>{

                            const date = new Date(Number(item?.timeStamp))
                            const day = date.getDate() 
                            const month = date.getMonth() + 1
                            const year = date.getFullYear()
                            const date1 = new Date(Number(item?.timeStamp))

                            let hours = date1.getHours()
                            const minutes = date1.getMinutes()
                            const ampm = hours >= 12 ? "PM" : "AM"

                            hours = hours % 12
                            hours = hours ? hours : 12

                            const pad = (n) => n.toString().padStart(2, '0')

                            const timeString = `${pad(hours)}:${pad(minutes)} ${ampm}`

                            const getPatientInfo = getPatient?.find((itm)=> itm?._id === item?.uid)

                            if(getPatientInfo?.name){
                                return(
                                    <tbody key={i}>
                                        <tr>
                                            <td><p>{timeString}, {`${day}-${month}-${year}`}</p></td>
                                            <td><p>{getPatientInfo?.sex}</p></td>
                                            <td><p>{getPatientInfo?.age} {getPatientInfo?.AgeType}</p></td>
                                            <td><p>{getPatientInfo?.name}</p></td>
                                            <td><p>{getPatientInfo?.address}</p></td>
                                            <td><p>{item?.name}</p></td>
                                            <td><p>{item?.type}</p></td>
                                        </tr>
                                    </tbody>
                                )
                            }else{
                                return null
                            }
                        })
                    }
                </table>
            </div>
        </div>
    </div>
  )
}

export default DataAnalyst