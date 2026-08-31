import React, { useState } from 'react'
import { FaSearch } from 'react-icons/fa';
import axios from 'axios';
import { useSelector } from 'react-redux'
import { selectip } from '../../features/ipSlice'
import NurseBar from '../../components/NurseBar';
import PatientDetails from './PatientDetails';
import Searchpatientresulttab from './SearchReuslt';

function Searchpatient() {
    //axios.defaults.withCredentials = true
        const ip = useSelector(selectip)

    const [search, setsearch] = useState([])
    const [getsearch, setgetsearch] = useState('')

    const [view, setview] = useState(false)

    
    const handleSearch = async(e) => {
        e.preventDefault()
        const searchQuery = e.target.value;
        setgetsearch(searchQuery)
        if (searchQuery.length > 0) {
            try {
                const value = {     
                    search : searchQuery
                }

                const response = await axios.post(`http://${'localhost'}:7700/search`, value);
                setsearch(response.data.patients) 
                
            } catch (err) {
                console.error('Error fetching search results', err);
            }
        } else {
            setsearch([]);
        }
    }
 
  return (
    <div className='dashboard_container'>
        <NurseBar/>

        {
            !view ?
            <div className='dashboard_body' >
                <div className='dashboard_body_header' >
                    <div className='dashboard_body_header_search'>
                        <FaSearch/>
                        <input value={getsearch} onChange={handleSearch} placeholder='Search' />
                    </div>
                </div>

                <h3>SEARCH RESULTS</h3>
                <div>
                    {
                        search?.length > 0 ?
                            search?.map((srch, i)=>(
                                <Searchpatientresulttab key={i} srch={srch} setview={setview} />
                            ))
                        : null
                    }
                </div>
            </div>
            :
            <PatientDetails setview={setview} />
        }


    </div>
  )
}

export default Searchpatient;