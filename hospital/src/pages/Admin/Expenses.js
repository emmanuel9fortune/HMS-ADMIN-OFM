import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'
import html2canvas from 'html2canvas'
import jsPDF from 'jspdf'
import { ExpensesReport } from './ExpensesReport'

function Expenses() {
    const cip = window.location.hostname
    const [reload, setreload] = useState(0)

    const [date, setdate] = useState('')
    const [enddate, setenddate] = useState('')
    const [xdate, setxdate] = useState('')
    const [staff, setstaff] = useState('')

    useEffect(()=>{
        const toady = new Date()
        const formattedDate = toady.toISOString().split('T')[0]
        setxdate(formattedDate)
        const setToday = new Date().setHours(0, 0, 0, 0)
        const now = Date.now()
        setdate(setToday);
        setenddate(now);
    },[])

    const [getexpens, setgetexpens] = useState([])
    const [getstaff, setgetstaff] = useState([])

    useEffect(()=>{
        const controller = new AbortController()
        const func=async()=>{
            try {
                axios.post(`http://${cip || 'localhost' }:7700/expenses/getexpenses`,{unix: date, eunix: enddate, staff, signal: controller.signal}).then((res)=>{                                        
                    if(res.data.status === 'success'){
                        setgetexpens(res.data.expense)
                        setgetstaff(res.data.getStaffs)
                        setreload(0)
                    }
                })
            } catch (error) {
                console.log(error);
            }
        }
        func()
      return ()=> controller.abort()
    }, [cip, reload, date, enddate, staff])

    const handleDeleteExpense = (row) => async () => {
        try {
            await axios.post(`http://${cip || 'localhost' }:7700/expenses/deleteexpense`, {id: row._id}).then((res)=>{
                if(res.data.status === 'success'){
                    toast.success('Expense Deleted Successfully')
                    setreload(reload + 1)
                }
            })
        } catch (error) {
            console.log(error);
        }
    }

    const [Total, setTotal] = useState()
    
    useEffect(()=>{
        let fsttotal = 0
        getexpens?.forEach(obj =>{ 
            fsttotal += obj.approve;
        })
        
        setTotal(fsttotal)
    },[getexpens])

    const totalFormatted = new Intl.NumberFormat('en-NG', {
        style: 'currency',
        currency: 'NGN',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    })

    const handleStaff = async(e) => {
            const staff = e.target.value
    
            setstaff(staff);
            // Then fetch uses effect or you can call manually:
            await axios.post(`http://${cip || 'localhost' }:7700/expenses/getexpenses`, {staff, unix: date, eunix: enddate})
            .then(res => {
                console.log(res);
                
                if (res.data.status === 'success') {
                    setgetexpens(res.data.expense)
                    setgetstaff(res.data.getStaffs)
                }
            });
        };

    const handleDate = (e) => {
        const raw = e.target.value;
        setxdate(raw);

        const start = new Date(raw);
        const end = new Date(raw);
        end.setHours(23, 59, 59, 999);

        setdate(start.getTime());
        setenddate(end.getTime());
    };

    const handlePeriod =(e) => {
        const raw = e.target.value;
        const now = Date.now()

        const DaysAgo = now - raw * 24 * 60 * 60 * 1000

        setdate(DaysAgo);
        setenddate(now);
    }
    
    const [month, setmonth] = useState('')
    const [year, setyear] = useState('')

    const handlePeriodByMonth = async(e) => {
        const month = Number(e.target.value);
        const year = new Date().getFullYear();

        setmonth(month)
        setyear(year)

        const start = new Date(year, month - 1, 1).getTime();
        const end = new Date(year, month, 0, 23, 59, 59, 999).getTime();

        setdate(start);
        setenddate(end);
        // Then fetch uses effect or you can call manually:
        await axios.post(`http://${cip || 'localhost' }:7700/expenses/month`, { year, month, id: staff})
        .then(res => {
            if (res.data.status === 'success') {
                setgetexpens(res.data.expense)
                setgetstaff(res.data.getStaffs)
            }
        });
    };

    
    const handleCatalog =async(e)=>{
        try {
            await axios.post(`http://${cip || 'localhost' }:7700/expenses/catalog`, {catalog: e.target.value, year, month, id: staff})
            .then(res => {                
                // console.log(res);
                
                if (res.data.status === 'success') {
                    setgetexpens(res.data.expense)
                    setgetstaff(res.data.getStaffs)
                }
            });
        } catch (error) {
            console.log(error);
        }
    }

    
    const handleDownload1 = async () => {
        const input = document.getElementById("pdf-content");
        const pageHeight = 295; // A4 height in mm
        const pageWidth = 210;  // A4 width in mm

        // Render HTML to canvas
        const canvas = await html2canvas(input, { scale: 2 });
        const imgData = canvas.toDataURL("image/png");

        const pdf = new jsPDF("p", "mm", "a4");
        const imgProps = pdf.getImageProperties(imgData);
        const imgHeight = (imgProps.height * pageWidth) / imgProps.width;
        const totalPages = Math.ceil(imgHeight / pageHeight);

        console.log("Total estimated pages:", totalPages);

        const pagesPerFile = 10; // You can adjust this (e.g. 5, 10, 20)
        const totalFiles = Math.ceil(totalPages / pagesPerFile);

        let currentPage = 0;

        for (let fileIndex = 1; fileIndex <= totalFiles; fileIndex++) {
            const pdfChunk = new jsPDF("p", "mm", "a4");

            for (let p = 0; p < pagesPerFile && currentPage < totalPages; p++) {
            const position = -pageHeight * currentPage;

            if (p > 0) pdfChunk.addPage();

            pdfChunk.addImage(imgData, "PNG", 0, position, pageWidth, imgHeight);
                currentPage++;
            }

            const partName = `ExpensesReport_Part${fileIndex}.pdf`;
            pdfChunk.save(partName);

            console.log(`Downloaded: ${partName}`);
    }

        toast.success(`All ${totalPages/10} PDF parts have been downloaded successfully!`);
    };

    const handleDownload = () => {
        ExpensesReport(getexpens, getstaff, Total);
    };

  return (
    <div id='pdf-content' style={{width:'100%'}}>
    
        <div style={{display:'flex', alignItems:'center', width:'100%'}}>
            <div className='patient_details_input_field1_in_' >
                <div className='patient_details_input_field1_' style={{margin:'0 5px'}}>
                    <h4>CHOOSE DATE</h4>
                    <input value={xdate} onChange={handleDate} type='date' />
                </div>  
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
                    <h4>CHOOSE CATALOG</h4>
                    <select onChange={handleCatalog} >
                        <option>SELECT CATALOG</option>
                        <option value={"BACKLOG PAYMENT"}>BACKLOG PAYMENT</option>
                        <option value={"TRANSPORTATION & LOGISTICS"}>TRANSPORTATION & LOGISTICS</option>
                        <option value={"DRUGS & MEDICAL CONSUMABLES"}>DRUGS & MEDICAL CONSUMABLES</option>
                        <option value={"MEDICAL EQUIPMENTS"}>MEDICAL EQUIPMENTS</option>
                        <option value={"FUEL"}>FUEL</option>
                        <option value={"REPAIRS & MAINTENANCE"}>REPAIRS & MAINTENANCE</option>
                        <option value={"STAFF WELFARE & FEEDING"}>STAFF WELFARE & FEEDING</option>
                        <option value={"PATIENT WELFARE & REFUNDS"}>PATIENT WELFARE & REFUNDS</option>
                        <option value={"OFFICE EQUIPMENTS & ASSETS"}>OFFICE EQUIPMENTS & ASSETS</option>
                        <option value={"OFFICE STATIONARY & PRINTING"}>OFFICE STATIONARY & PRINTING</option>
                        <option value={"COMMUNICATION ICT"}>COMMUNICATION ICT</option>
                        <option value={"CLEANING, UTILITIES & GENERAL OPERATIONS"}>CLEANING, UTILITIES & GENERAL OPERATIONS</option>
                        <option value={"SALARY"}>SALARY</option>
                    </select>
                </div>

                <div className='patient_details_input_field1_' style={{margin:'0 5px'}}>
                    <h4>CHOOSE STAFF</h4>
                    <select onChange={handleStaff} >
                        <option value={''} >SELECT STAFF</option>
                        {
                            getstaff?.length > 0 &&
                            getstaff?.map((itm, i)=>(
                                <option value={itm?._id} key={i} >{itm?.name}</option>
                            ))
                        }
                    </select>
                </div>
            </div>
        </div>
            <div style={{display:'flex', alignItems:'center', width:'100%'}}>
                <button onClick={handleDownload} className={'dashboard_body_patient_details_btns_'} style={{marginTop:'30px'}}>DOWNLOAD</button>                
            </div>

        <h3 style={{color:'green', margin:'20px 0'}} >Total Expenses {totalFormatted.format(Total)}</h3>

        <>
            <table className='custome_table'>
                <thead>
                <tr>
                    <th>DATE</th>
                    <th>STAFF NAME</th>
                    <th>PURPOSE OF REQUEST</th>
                    <th>AMOUNT REQUESTED</th>
                    <th>AMOUNT APPROVED</th>
                    <th>ALLOWANCE</th>
                    <th>RECEIVER NAME</th>
                    <th>STAFF NAME</th>
                    <th>CATALOGUE</th>
                    <th>ACTION</th>
                </tr>
                </thead>

                <tbody>                  
                    {getexpens?.map((row, index) => {

                        const staffname = getstaff.find((staff) => staff._id === row.staffID);

                        return (
                            <tr key={index}>
                                <td><p>{row?.date}</p></td>
                                <td><p>{row?.name}</p></td>
                                <td><p>{row?.purpose}</p></td>
                                <td><p>{totalFormatted.format(row?.amount)}</p></td>
                                <td><p>{totalFormatted.format(row?.approve)}</p></td>
                                <td><p>{row.allowance}</p></td>
                                <td><p>{row?.receiver}</p></td>
                                <td><p>{staffname?.name}</p></td>
                                <td><p>{row?.catalog}</p></td>
                                <td>
                                <button className='delete_btn' onClick={handleDeleteExpense(row)} >Delete</button>
                                </td>
                            </tr>
                        )
                    })}
                </tbody>
            </table>
        </>
    </div>
  )
}

export default Expenses