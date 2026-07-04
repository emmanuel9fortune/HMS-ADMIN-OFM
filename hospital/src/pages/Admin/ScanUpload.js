import React, { useState, useEffect, useRef } from 'react'
import { useSelector } from 'react-redux';
import { selectid } from '../../features/idSlice';
import { selectinfo } from '../../features/infoSlice';
import axios from 'axios';
import { toast } from 'react-toastify';
import { FaChevronLeft } from 'react-icons/fa';


function ScanUpload({handleBack}) {

    const id = useSelector(selectid)
    const info = useSelector(selectinfo)
    const [price, setprice] = useState(0)
    const [type, settype] = useState('')
  const cip = window.location.hostname

    
    const [testOptions, setTestOptions] = useState([])

    useEffect(()=>{
    const controller = new AbortController()
        const func =async()=>{
        try{
            await axios.post(`http://${cip || 'localhost'}:7700/getTestScan`,{signal: controller.signal}).then((res)=>{
            if(res.data.status === 'success'){
                setTestOptions(res.data.scan)
            }
            })
        }catch(error){
            //console.log(error)
        }
        }
        func()
      return ()=> controller.abort()
    },[cip])
    
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

    
      const editorRef = useRef(null);
      const [content, setContent] = useState('');
      const [rows, setRows] = useState(2);
      const [cols, setCols] = useState(2);
    
      useEffect(() => {
        adjustHeight(); // Set height on initial render
      }, []);
    
      const handleInput = () => {
        setContent(editorRef.current.innerHTML);
        adjustHeight();
      };
    
      const adjustHeight = () => {
        const editor = editorRef.current;
        if (!editor) return;
        editor.style.height = 'auto';
        editor.style.height = editor.scrollHeight + 'px';
      };
    
      const insertTable = () => {
        if (!editorRef.current) return;
    
        let tableHTML = `<table style="border-collapse: collapse; width: 100%; margin-top: 10px;">`;
    
        // Table Header
        tableHTML += "<thead><tr>";
        for (let c = 0; c < cols; c++) {
          tableHTML += `<th contenteditable="true" style="border: 1px solid black; padding: 4px;">Header ${c + 1}</th>`;
        }
        tableHTML += "</tr></thead>";
    
        // Table Body
        tableHTML += "<tbody>";
        for (let r = 0; r < rows; r++) {
          tableHTML += "<tr>";
          for (let c = 0; c < cols; c++) {
            tableHTML += `<td contenteditable="true" style="border: 1px solid black; padding: 4px;">Row ${r + 1} Col ${c + 1}</td>`;
          }
          tableHTML += "</tr>";
        }
        tableHTML += "</tbody></table><br/>";
    
        // Append at bottom
        editorRef.current.innerHTML += tableHTML;
        editorRef.current.scrollTop = editorRef.current.scrollHeight;
        handleInput();
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
                uid: id,
                results: content,
                request: 'scan',
                staffID: getid?._id,
                docID: getrequest?.staffID,
                
            }
            let serialString = JSON.stringify(value);
            formdata.append('value', serialString)
    
           await axios.post(`http://${cip || 'localhost'}:7700/uploadScan`, formdata).then((res)=>{
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
        <div className='payment_desk' style={{height:'500px'}}>
            <h3 style={{margin:'10px 0'}} >SCAN REQUESTED</h3>
            <div className='payment_desk_input_fields' >

                <p style={{margin:'10px 0', color:'red'}} >Note: ones test is saved it can not be edited anymore</p>

                <h3>UPLAOD SCAN RESULTS </h3>

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

            
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', padding:'10px 0', backgroundColor:'#e8e8e8e8', }} >
        {/* Formatting Controls */}
        <div style={{display: 'flex', alignItems: 'center'}}>
          <div className='patient_details_input_field1_' style={{margin:'0 5px'}}>
            <h4>Text Weight: </h4>
            <button onClick={() => document.execCommand('bold')} style={{width:'100px', padding:10}} >Bold</button>
          </div>
          
          <div className='patient_details_input_field1_' style={{margin:'0 5px'}}>
            <h4>Font Size: </h4>
            <select
              defaultValue="3"
              onChange={(e) => document.execCommand('fontSize', false, e.target.value)}
              style={{width:'100px', padding:10}}
            >
              <option value="1">Small</option>
              <option value="2">Normal</option>
              <option value="4">Large</option>
              <option value="6">Huge</option>
            </select>
          </div>
          
          <div className='patient_details_input_field1_' style={{margin:'0 5px'}}>
            <h4>Text Color: </h4>
            <input
              type="color"
              onChange={(e) => document.execCommand('foreColor', false, e.target.value)}
              style={{width:'100px', padding:0, height:50}}
            />
          </div>

          <div className='patient_details_input_field1_' style={{margin:'0 5px'}}>
            <h4>Rows: </h4>
            <input
              type="number"
              value={rows}
              onChange={(e) => setRows(parseInt(e.target.value) || '')}
              min="0"
              style={{width:'90px', padding:5, height:40}}
            />
          </div>
          
          <div className='patient_details_input_field1_' style={{margin:'0 5px'}}>
            <h4>Columns: </h4>
            <input
              type="number"
              value={cols}
              onChange={(e) => setCols(parseInt(e.target.value) || '')}
              min="0"
              style={{width:'90px', padding:5, height:40}}
            />
          </div>
          <div className='patient_details_input_field1_' style={{margin:'0 5px'}}>
            <button onClick={insertTable} style={{width:'100px', padding:10}} >INSERT</button>
          </div>
        </div>

      </div>

      {/* Editable Content Area */}
      <div
        ref={editorRef}
        contentEditable
        suppressContentEditableWarning
        onInput={handleInput}
        style={{
          border: '1px solid #ccc',
          borderRadius: '5px',
          minHeight: '200px',
          padding: '10px',
          backgroundColor: '#fff',
          width: '100%',
          overflow: 'hidden',
          fontSize: '16px',
          whiteSpace: 'pre-wrap',
        }}
      >
        {/* Editable content here */}
      </div>


      <div className='custome_table_btn'>
        <button
          onClick={senduploadedimageServer}
          style={{
            marginTop: '20px',
            padding: '10px 20px',
            fontSize: '16px',
            cursor: 'pointer',
            backgroundColor: '#007bff',
            color: '#fff',
            border: 'none',
            borderRadius: '4px'
          }}
        >
          SUBMIT SCAN RESULT
        </button>
        </div>

    </div>
  )
}

export default ScanUpload