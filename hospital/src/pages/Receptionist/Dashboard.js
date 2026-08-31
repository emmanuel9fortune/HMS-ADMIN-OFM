import React, { useEffect, useState } from 'react'
import SideBar from '../../components/SideBar'
import '../dashboard.css'
import { FaPeopleCarry, FaSearch} from 'react-icons/fa'
import { MdGroup, MdNotifications } from 'react-icons/md'
import Recentpatientdashcard from '../../components/Recentpatientdashcard'
import { useDispatch, useSelector } from 'react-redux'
import axios from 'axios'
import { useNavigate } from 'react-router'
import { setids } from '../../features/idSlice'
import { selectip } from '../../features/ipSlice'

function Dashboard() {
  //axios.defaults.withCredentials = true

  

  const staffID = sessionStorage.getItem('staffID')
  const getid = JSON.parse(staffID)

  const token = sessionStorage.getItem('refreshToken')
  const reload = useSelector((state) => state.reload.reload);

  const [latest, setlatest] = useState([])
  const [patientToday, setpatientToday] = useState([])
  const [queue, setqueue] = useState([])
  const [bill, setbill] = useState([])
  const [staffs, setstaffs] = useState([])
  const [patients, setpatients] = useState([])

  useEffect(()=>{
    const func =async()=>{
      try {
        await axios.post(`http://${'localhost'}:7700/receptionistDashBoard`, {staffID: getid?._id, token}).then((res)=>{
          console.log(res);
          
          if(res.data.status === 'success'){ 
              setlatest(res.data?.latestPatient)
              setpatientToday(res.data?.patientsTodayCount?.length)
              setqueue(res.data?.queue)
              setbill(res.data?.getBills)
              setstaffs(res.data?.getstaffs)
              setpatients( res.data?.getpatients)
              const accessToken = res.data.accessToken
              sessionStorage.setItem('accessToken', accessToken);
          }
        })
      } catch (error) {
        console.log(error);
      }
    }
    func()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[reload])

  const ip = useSelector(selectip)    
  const [search, setsearch] = useState([])
  const [getsearch, setgetsearch] = useState('')

  
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
  
  
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const navigateToPaymentDesk =(id)=>{
    dispatch(
      setids({
        uid: id
      })
    )
    navigate('/paymentdesk')
  }


  return (
    <div className='dashboard_container'>
        <SideBar/>
        <div className='dashboard_body' >
          <h1>Receptionist | Cashier Dashboard</h1>
          <div className='dashboard_body_header' >
            <div className='dashboard_body_header_search'>
              <FaSearch/>
              <input value={getsearch} onChange={handleSearch} placeholder='Search' />
            </div>

            <div className='dashboard_body_header_displays' >
              <div className='dashboard_body_header_displays_icon' >
                <FaPeopleCarry size={25} color="#0463ca" />
              </div>
              <div className='dashboard_body_header_displays_text'>
                <h1>{patientToday}</h1>
                <p>Patients Today</p>
              </div>
            </div>
            
            <div className='dashboard_body_header_displays'>
              <div className='dashboard_body_header_displays_icon'>
                <MdGroup size={25} color="#0463ca" />
              </div>
              <div className='dashboard_body_header_displays_text'>
                <h1>{queue}</h1>
                <p>Patients In Queue</p>
              </div>
            </div>
          </div>

          <div>
            <div className='dashboard_searchpatient_card'>

              <div className='dashboard_search_results'>
                <div className='Dashboardresultcard'>
                    {
                      search?.length > 0 ? 
                        <h2>SEARCH RESULTS</h2>
                      :
                        <h2>RECENT PATIENTS</h2>
                    }
                    
                <div className='patient_details_ labdash' >
                  <div className='patient_details_input_field1' >
                    <div className='drug_top_label'>
                        <h4>PATIENT NAME</h4>
                        <h4>DATE CREATED</h4>
                    </div>
                    <div className='recentpatient_dashCard_container'>
                        { search?.length > 0 ?
                            search?.map((srch, i)=>(
                              <Recentpatientdashcard key={i} res={srch} />
                            ))
                          :
                          latest?.length > 0 ?
                            latest?.map((res, i)=>(
                              <Recentpatientdashcard key={i} res={res} />
                            ))
                          : null 
                        }
                    </div>
                  </div>

                  <div className='patient_details_input_field1' >
                    <h4>NOTIFICATION</h4>                  
                        <div className='task_bar' >
                          {
                            bill?.length > 0 ?
                              bill?.sort((a,b)=> a.timeStamp - b.timeStamp).map((item, i)=>{

                                const getstaff = staffs?.length > 0 ? staffs?.find((res)=> res?._id === item?.staffID) : []
                                const getpatient = patients?.length > 0 ? patients?.find((res)=> res?._id === item?.uid) : []
 
                                return(
                                <div key={i} style={{cursor:'pointer'}} onClick={()=>navigateToPaymentDesk(item?.uid)} className='recentpatientdashcard'>
                                    <div className='recentpatientdashcard_desc'>
                                        <h4>Bill Sent from {getstaff?.title}</h4>
                                        <p><strong>( {getpatient?.name} )</strong> is charged with a bill</p>
                                    </div>

                                    <div className='Patientqueuecard_button'>
                                        <MdNotifications size={22} color='#0463ca' />
                                    </div>
                                </div>
                                )
                              })
                            : null
                          }
                    </div>
                  </div>
                </div>
                </div>
              </div>
            </div>
          </div>
        </div>
    </div>
  )
}

export default Dashboard