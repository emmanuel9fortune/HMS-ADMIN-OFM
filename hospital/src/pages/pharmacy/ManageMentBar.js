import React from 'react'

function ManageMentBar({item, sort, batch}) {
    
    const formatted = new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    })

    const date = new Date(Number(item?.expireDate * 1000))
    const day = date.getDate()
    const month = date.getMonth()
    const year = date.getFullYear()

    const sold = item?.originalQuantity - item?.quantity

    const profit = (item?.sellingPrice * sold) - (item?.originalPrice * sold)

    const actualcost = item?.originalPrice * sold
    const sellingcost = item?.sellingPrice * sold
    
    const now = new Date()
    const start = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime()
    const end = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1).getTime() - 1

    const expires = item?.expireDate * 1000
    const today = expires >= start && expires <= end || expires < start
    

  return (
      <>
        {
            sort === '' || sort === item?.type ?
            batch === '' || batch === item?.batch ?
                <div className='recentpatientdashcard'>
                    <div className='recentpatientdashcard_desc' style={{width:'25%', textAlign:'center'}}>
                        <h4>{`${day}-${month}-${year}`}</h4>
                        
                            {
                            today ?
                            <p style={{color:'red'}} >Expired</p>
                            :
                            <p>Day-Month-Year</p>
                            }
                    </div>
            
                    <div className='recentpatientdashcard_desc' style={{width:'25%', textAlign:'center'}}>
                        <h4>{item?.name}</h4>
                    </div>
            
                    <div className='recentpatientdashcard_desc' style={{width:'25%', textAlign:'center'}}>
                        <h4>{formatted.format(item?.originalPrice)}</h4>
                    </div>
            
                    <div className='recentpatientdashcard_desc' style={{width:'25%', textAlign:'center'}}>
                        <h4>{formatted.format(item?.sellingPrice)}</h4>
                    </div>
            
                    <div className='recentpatientdashcard_desc' style={{width:'25%', textAlign:'center'}}>
                        <h4>{item?.quantity}</h4>
                    </div> 
            
                    <div className='recentpatientdashcard_desc' style={{width:'25%', textAlign:'center'}}>
                        <h4>{sold}</h4>
                    </div>
            
                    <div className='recentpatientdashcard_desc' style={{width:'25%', textAlign:'center'}}>
                        <h4 style={{color:'blue'}} >{formatted.format(sellingcost)}</h4>
                    </div>
            
                    <div className='recentpatientdashcard_desc' style={{width:'25%', textAlign:'center'}}>
                        <h4 style={{color:'orange'}} >{formatted.format(actualcost)}</h4>
                    </div>
            
                    <div className='recentpatientdashcard_desc' style={{width:'25%', textAlign:'center'}}>
                        <h4 style={{color:'green'}} >{formatted.format(profit)}</h4>
                    </div>
            
                    <div className='recentpatientdashcard_desc' style={{width:'25%', textAlign:'center'}}>
                        <h4 style={{color:'red'}} >{profit < 0 ? profit : '-'}</h4>
                    </div>
            
                    <div className='recentpatientdashcard_desc' style={{width:'25%', textAlign:'center'}}>
                        <h4 style={{color:'black'}} >{item?.batch}</h4>
                    </div>
            
                </div>
            :
                null
            :
            sort === item?.type ?
                batch === item?.batch ?
                <div className='recentpatientdashcard'>
                    <div className='recentpatientdashcard_desc' style={{width:'25%', textAlign:'center'}}>
                        <h4>{`${day}-${month}-${year}`}</h4>
                        
                            {
                            today ?
                            <p style={{color:'red'}} >Expired</p>
                            :
                            <p>Day-Month-Year</p>
                            }
                    </div>
            
                    <div className='recentpatientdashcard_desc' style={{width:'25%', textAlign:'center'}}>
                        <h4>{item?.name}</h4>
                    </div>
            
                    <div className='recentpatientdashcard_desc' style={{width:'25%', textAlign:'center'}}>
                        <h4>{formatted.format(item?.originalPrice)}</h4>
                    </div>
            
                    <div className='recentpatientdashcard_desc' style={{width:'25%', textAlign:'center'}}>
                        <h4>{formatted.format(item?.sellingPrice)}</h4>
                    </div>
            
                    <div className='recentpatientdashcard_desc' style={{width:'25%', textAlign:'center'}}>
                        <h4>{item?.quantity}</h4>
                    </div> 
            
                    <div className='recentpatientdashcard_desc' style={{width:'25%', textAlign:'center'}}>
                        <h4>{sold}</h4>
                    </div>
            
                    <div className='recentpatientdashcard_desc' style={{width:'25%', textAlign:'center'}}>
                        <h4 style={{color:'blue'}} >{formatted.format(sellingcost)}</h4>
                    </div>
            
                    <div className='recentpatientdashcard_desc' style={{width:'25%', textAlign:'center'}}>
                        <h4 style={{color:'orange'}} >{formatted.format(actualcost)}</h4>
                    </div>
            
                    <div className='recentpatientdashcard_desc' style={{width:'25%', textAlign:'center'}}>
                        <h4 style={{color:'green'}} >{formatted.format(profit)}</h4>
                    </div>
            
                    <div className='recentpatientdashcard_desc' style={{width:'25%', textAlign:'center'}}>
                        <h4 style={{color:'red'}} >{profit < 0 ? profit : '-'}</h4>
                    </div>
            
                </div>
                :
                null
            : null
        }
      </>
  )
}

export default ManageMentBar