import axios from 'axios';
import React from 'react'

function MonthAudit({setdebtors, setdate, setenddate, setsort, setsort1, setgetPatient, setgetComplete, setexpenses, setstaffs, setpending, setawaiting, sort, staff, handlePeriodByMonth1}) {

  const cip = window.location.hostname

    const handlePeriodByMonth = async(e) => {
        const month = Number(e.target.value);
        const year = new Date().getFullYear();

        const start = new Date(year, month - 1, 1).getTime();
        const end = new Date(year, month, 0, 23, 59, 59, 999).getTime();

        setdate(start);
        setenddate(end);
        setsort(prev => prev);
        setsort1(prev => prev);
        handlePeriodByMonth1(e.target.value)
        
        await axios.post(`http://${cip || 'localhost'}:7700/auditmonth`, { year, month, sorts: sort, id: staff })
        .then(res => {
            if (res.data.status === 'success') {
                setgetPatient(res.data.patients);
                setgetComplete(res.data.paidBills);
                setexpenses(res.data.expense)
                setstaffs(res.data.staffs)
                // setpending(res.data.pendingBills)
                setawaiting(res.data.pharmBills)
                setdebtors(res.data.debtBills)
            }
        });
        
    };

  return (
    <div>
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
    </div>
  )
}

export default MonthAudit