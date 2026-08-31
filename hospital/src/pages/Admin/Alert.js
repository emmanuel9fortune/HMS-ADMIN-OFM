import React from 'react'
import { useSelector } from 'react-redux'
import { selectinfo } from '../../features/infoSlice'
import { MdNotificationImportant } from 'react-icons/md'

function Alert({item, count, batch}) { 

    const info = useSelector(selectinfo)
    const date = new Date(Number(item?.expireDate * 1000))
    const day = date.getDate()
    const month = date.getMonth() + 1
    const year = date.getFullYear()

    const getAlert = info?.utilsQty?.length > 0 ? info?.utilsQty?.find((items)=> items?._id === item?._id) : null

    const now = new Date()
    const start = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime()
    const end = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1).getTime() - 1

    const expires = item?.expireDate * 1000
    const today = expires >= start && expires <= end || expires < start


  return ( 
    <>
        {  
            !getAlert && count === 0 ?
            <div className='recentpatientdashcard' style={{border:'.3px solid red', width:'100%'}}>
                <div className='recentpatientdashcard_desc'>
                    <h4>{item?.name}</h4> 
                    {
                        today ?
                        <h4>Drugs Expired</h4>
                        :
                        <p>Drugs will expire {`${day}-${month}-${year}`}</p>
                    }
                </div>

                <div className='Patientqueuecard_button'>
                    <MdNotificationImportant size={22} color='red' />
                </div>
            </div>
        :
                <div className='recentpatientdashcard' style={{border:'.3px solid red', width:'100%'}}>
                    <div className='recentpatientdashcard_desc'>
                        <h4>{item?.name}</h4> 
                        Running Out of Stock {item?.quantity} left
                    </div>

                    <div className='Patientqueuecard_button'>
                        <MdNotificationImportant size={22} color='red' />
                    </div>
                </div>
        }
    </>
  )
}

export default Alert