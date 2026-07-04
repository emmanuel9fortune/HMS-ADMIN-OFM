import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import React, { useEffect, useRef, useState } from 'react'
import { selectip } from '../../features/ipSlice';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { toast } from 'react-toastify';

function ScanDisplay({item, patient, photo, obj, setimgs, setReq, view, id, reload, setreload}) {
    const editorRef = useRef(null);
    const ip = useSelector(selectip)

    const [text, settext] = useState('')
  
    useEffect(() => {
      if (item?.results) {
        settext(item.results);
      }
    }, [item]);
    
    
    const initializedRef = useRef(false);
    useEffect(() => {
      if (!editorRef.current || !item?.results || initializedRef.current) return;
  
      editorRef.current.innerHTML = item?.results;
      settext(item?.results);
      adjustHeight();
      initializedRef.current = true;
    }, [item]);
  
    const handleInput = () => {
      if (editorRef.current) {
        settext(editorRef.current.innerHTML);
        adjustHeight();
      }
    };

    const cip = window.location.hostname
    useEffect(() => {
        adjustHeight(); 
    }, []);

    const adjustHeight = () => {
        const editor = editorRef.current;
        if (!editor) return;
        editor.style.height = 'auto';
        editor.style.height = editor.scrollHeight + 'px';
    };

    const refs = useRef([]);
    const [ready, setReady] = useState(false);

    // Ensure refs are available for each result
    useEffect(() => {
        refs.current = obj.map((_, i) => refs.current[i] || React.createRef());
        setReady(true);
    }, [obj]);

    const downloadSinglePDF = async () => {
        const ref = refs.current[id];
        if (!ref?.current) return;

        // Take a high-res screenshot of the element
        const canvas = await html2canvas(ref.current, { scale: 2, useCORS: true });
        const imgData = canvas.toDataURL('image/png');

        // Initialize jsPDF (portrait, mm, A4)
        const pdf = new jsPDF('p', 'mm', 'a4');
        const pageWidth = pdf.internal.pageSize.getWidth();
        const pageHeight = pdf.internal.pageSize.getHeight();

        // Optionally: draw a green rectangle using your hex color (#06b36b)
        pdf.setFillColor(6, 179, 107); // RGB for #06b36b
        pdf.rect(0, 0, pageWidth, pageHeight, 'F'); // Example rectangle

        // Calculate image dimensions for PDF
        const imgProps = pdf.getImageProperties(imgData);
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

        // Add the image of the React component
        pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);

        // Save with a dynamic filename
        pdf.save(`patient-${id + 1}.pdf`);
    };

    
  const handleEditTest =async()=>{
    try {
      const result = await axios.post(`http://${cip || 'localhost'}:7700/editscan`, {id: item?._id, uid: patient?._id, text: text})
      // console.log(result);
      
      if(result.data.status === 'success'){
        toast.success('Text Edited Successfully')
        setreload(reload + 1)
      }else{
        toast.error(result?.data.message)
      }
    } catch (error) {
      console.log(error);
      
    }
  }

  return (
    <>
    <div className='lab_result_container_' ref={refs.current[id]}>
      <div style={{width:'100%'}} >
        <h2>SCAN RESULTS</h2>
        <div className='lab_result_header'>
          <div>
            <div>
              <h4>CLINIC : </h4>
              <p>O.F.M Medical Centre</p>
            </div>
          </div>
        </div> 

        <h4>PATIENT INFORMATION</h4>
        
        <div className='lab_result_header'>
          <div>
            <div>
              <h4>PATIENT NAME : </h4>
              <p>{patient?.name} </p>
            </div>
            <div>
              <h4>DATE OF BIRTH : </h4>
              <p>{patient?.dateOfBirth}</p>
            </div>
          </div>

          <div>
            <div>
              <h4>SEX : </h4>
              <p>{patient?.sex || 'Female'}</p>
            </div>
            {
              patient?.phone &&
              <div>
                <h4>CONTACT NUMBER : {patient?.phone}</h4>
                <p></p>
              </div>
            }
          </div>

          <div className='lab_result_address'>
              <h4>ADDRESS : {patient?.address}</h4>
              <p></p>
          </div>

        </div>

        <div className='scan_images' >
            {
              photo?.map((item, i)=>( 
                item?.img &&
                <img key={i} style={{cursor:'pointer'}} onClick={()=>[setimgs(item?.img), setReq(true)]} src={`http://${cip || 'localhost'}:7700/uploads/scans/${item?.img}`} alt='' crossOrigin="anonymous" />
              ))
            } 
        </div>

        
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
                backgroundColor: 'transparent',
                width: '100%',
                overflow: 'hidden',
                fontSize: '16px',
                whiteSpace: 'pre-wrap',
              }}
            ></div>
      {/* Editable content here */}
      </div>
    </div>

    {
        view &&
        <div className='custome_table_btn'>
          {text !== item?.results ? 
            <button
                className='custome_table_btn2'
                onClick={handleEditTest}
              >
                SAVE EDIT
              </button>
              :
              <div></div>
          }
          <button className='custome_table_btn2' onClick={() => downloadSinglePDF()}>DOWNLOAD RESULT</button>
        </div>
    }
  </>
  )
}

export default ScanDisplay