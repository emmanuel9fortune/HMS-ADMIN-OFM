import React from 'react'
import { setids } from '../../features/idSlice'
import { useDispatch } from 'react-redux'

function Searchpatientresulttab({setview, srch, admin}) {

  //axios.defaults.withCredentials = true

  const dispatch = useDispatch()

  const handleView =()=>{
    dispatch(
      setids({
        uid: srch?._id,
        id: srch?._id,
      })
    )
    if(admin){
      setview(1) 
    }else{
      setview(true)
    }
  }
  

  return (
    <div className='recentpatientdashcard'>
        <div className='recentpatientdashcard_desc'>
            <h4>{srch?.name}</h4>
            <p>{srch?.center ? 'Ante Natal Patient' : 'Regular Patient'}</p>
        </div>

        <div className='Patientqueuecard_button'>
            <button className='searchresultcard_view' onClick={handleView}>VIEW</button>
        </div>
    </div>
  )
}

export default Searchpatientresulttab;