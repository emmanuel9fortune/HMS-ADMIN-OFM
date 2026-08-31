import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux';
import { selectid } from '../../features/idSlice';
import { selectinfo } from '../../features/infoSlice';
import axios from 'axios';
import { toast } from 'react-toastify';
import { selectip } from '../../features/ipSlice'
import { FaChevronLeft } from 'react-icons/fa';


function ScanUpload({handleBack}) {

    const id = useSelector(selectid)
    const info = useSelector(selectinfo)
    const [price, setprice] = useState(0)
    const [type, settype] = useState('')
    const [result, setresult] = useState('')
    const ip = useSelector(selectip)

    
    const [testOptions, setTestOptions] = useState([])

    useEffect(()=>{
        const func =async()=>{
        try{
            await axios.post(`http://${'localhost'}:7700/getTestScan`).then((res)=>{
            if(res.data.status === 'success'){
                setTestOptions(res.data.scan)
            }
            })
        }catch(error){
            console.log(error)
        }
        }
        func()
    },[ip])
    
    const formatted = new Intl.NumberFormat('en-NG', {
        style: 'currency',
        currency: 'NGN',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(price);

    const handleChannge=(e)=>{
        const name = e.target.value
        settype(name)
        const getprice = testOptions.find((item)=> item?.name === name)

        setprice(getprice?.price)
    }

    
    const [photo, setphoto] = useState(null)

    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);
        if (files.length > 6) {
          toast.error('You can only upload a maximum of 6 images.');
          return;
        }
        setphoto(files);
    };

    const getrequest = info?.getrequest?.length > 0 ? info?.getrequest?.find((item)=> item?.uid === id?.id) : []
    
    const staffID = sessionStorage.getItem('staffID')
    const getid = JSON.parse(staffID)
    
    const senduploadedimageServer = async() => {
        if (photo) {
            const formdata = new FormData();
            photo.forEach((photo) => {
                formdata.append('img', photo);
            });    
            const value ={
                uid: id?.id,
                results: result,
                request: type,
                staffID: getid?._id,
                docID: getrequest?.staffID,
                price: price,
                testname: type,
            }
            let serialString = JSON.stringify(value);
            formdata.append('value', serialString)
    
           await axios.post(`http://${'localhost'}:7700/uploadScan`, formdata).then((res)=>{
                if(res.data.status === 'success'){
                    toast.success('SCAN UPLOAD SUCCESSFUL')
                    setimgs(null)
                }
           })
        }
    };
    
  const [req, setReq] = useState(false)
  const [imgs, setimgs] = useState('')

  return (
    <div className='dashboard_body'>
          <div className='back_btn_' onClick={handleBack}>
            <FaChevronLeft />
            <h4>BACK</h4>
          </div>
        <div className='payment_desk' >
            <h3>UPLAOD SCAN RESULTS </h3>
            <div className='payment_desk_input_fields' >
                <div className='patient_details_input_field1_' >
                    <h4>SCAN TYPE</h4> 
                    <select onChange={handleChannge} >
                        <option>SELECT SCAN TYPE</option>
                        {
                            testOptions?.map((item, i)=>(
                                <option key={i} value={item.name} >{item?.name}</option>
                            ))
                        }
                    </select>
                </div>
                
                <div style={{margin:'20px 0'}} className='cart_checkout_price' >
                    <h3 style={{margin:'7px 0'}}>TOTAL PRICE</h3>
                    <h3 style={{margin:'7px 0'}}>{formatted}</h3>
                </div>
                
                <div className='patient_details_input_field1_' >
                    <h4>UPLOAD SCAN IMAGES</h4>
                    <input  
                        style={{backgroundColor:'#e8e8e8', cursor:'pointer'}} 
                        type='file' 
                        accept="image/*"
                        multiple 
                        onChange={handleImageChange}
                    />
                </div>

                <div style={{margin:'20px 0'}} className='patient_details_input_field1_' >
                    <h4>SCAN RESULTS</h4>
                    <textarea placeholder='Enter Scan Reults' value={result} onChange={(e)=>setresult(e.target.value)} />
                </div>

            </div>
           
            
          <div className='payment_desk_input_fields add_utilities' >
            {photo &&
                photo?.map((photo, index)=>(
                    <img key={index} alt='' onClick={()=>[setReq(true), setimgs(URL.createObjectURL(photo))]} src={URL.createObjectURL(photo)} style={{width: '48%',margin:'5px', height:'120px', objectFit:'fit-content'}}/>
                ))
            }

             {req && (
                <div className='popt_request'>
                <div className='over_lay_pop_up' onClick={() => setReq(false)}></div>
                <div className='pop_up_request_display1'>
                    <img src={imgs} alt='' />
                </div>
                </div>
            )}

            {
                photo &&
                <button onClick={senduploadedimageServer} className='upload_scan_btn'>UPLOAD SCAN IMAGES</button>
            }
          </div>
        </div>
    </div>
  )
}

export default ScanUpload