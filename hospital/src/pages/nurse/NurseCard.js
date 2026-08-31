import React from 'react'
import { useDispatch } from 'react-redux'
import { setids } from '../../features/idSlice'

function NurseCard({item, currentIndex, setcurrentIndex, nurse}) {

    
    const dispatch = useDispatch()

    const handleView =(id)=>{
        setcurrentIndex(currentIndex + 1)
        dispatch(
            setids({
                id:id
            })
        )
    }

  return (
    <div className='recentpatientdashcard'>
        <div className='recentpatientdashcard_desc'>
            <h4>{item?.name}</h4>
            <p>{item?.center ? "Ante Natal Patient" : "Regular Patient"}</p>
        </div>

            <div style={{margin:'0 20px', display:'flex', flexDirection:'column'}} className='Patientqueuecard_button'>
                {
                    !nurse &&
                    <button onClick={()=>handleView(item?._id)} >View</button>
                }
                <p>{item?.status === 'admitted' ? 'In Patient' : 'Out Patient'}</p>
            </div>
    </div>
  )
}

export default NurseCard