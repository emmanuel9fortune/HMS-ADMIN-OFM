import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import { selectip } from '../../features/ipSlice';
import axios from 'axios';
import NurseBar from '../../components/NurseBar';

function Roster() {

    const ip = useSelector(selectip)
    const [getinfo, setgetinfo] = useState(0);

    useEffect(()=>{
        const func =async()=>{
            await axios.post(`http://${'localhost'}:7700/getroster`).then((res)=>{
                //console.log(res);
                
                if(res.data.status === 'success'){
                    setgetinfo(res.data.roster)
                }
            })
        }
        func()
    },[ip])

  return (
    <div className='dashboard_container'>
         <NurseBar/> 
        <div className='dashboard_body' >
            <h3>ROSTER</h3>
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
                </tr>
                </thead>
                <tbody>
                {getinfo?.roster?.map((row, index) => (
                    <tr key={index}>
                    <td><p>{row.time}</p></td>
                    <td><p>{row.mon}</p></td>
                    <td><p>{row.tue}</p></td>
                    <td><p>{row.wed}</p></td>
                    <td><p>{row.thu}</p></td>
                    <td><p>{row.fri}</p></td>
                    <td><p>{row.set}</p></td>
                    <td><p>{row.sun}</p></td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    </div>
  )
}

export default Roster