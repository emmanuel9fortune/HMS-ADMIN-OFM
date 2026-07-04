import axios from 'axios';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import React, { useEffect, useRef, useState } from 'react'
import { toast } from 'react-toastify';

function TestDisplay({patient, res, obj, id, view, reload, setreload}) {

  const [text, settext] = useState('')
  const editorRef = useRef(null);

  useEffect(() => {
    if (res?.content) {
      settext(res.content);
    }
  }, [res]);

  const adjustHeight = () => {
    const editor = editorRef.current;
    if (!editor) return;
    editor.style.height = 'auto';
    editor.style.height = editor.scrollHeight + 'px';
  };

  const initializedRef = useRef(false);
  useEffect(() => {
    if (!editorRef.current || !res?.content || initializedRef.current) return;

    editorRef.current.innerHTML = res.content;
    settext(res.content);
    adjustHeight();
    initializedRef.current = true;
  }, [res]);

  const handleInput = () => {
    if (editorRef.current) {
      settext(editorRef.current.innerHTML);
      adjustHeight();
    }
  };

  const refs = useRef([]);

  // Ensure refs are available for each result
  useEffect(() => {
    refs.current = obj.map((_, i) => refs.current[i] || React.createRef());
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
  
  const cip = window.location.hostname

  // console.log(text);
  

  const handleEditTest =async()=>{
    try {
      const result = await axios.post(`http://${cip || 'localhost'}:7700/edittest`, {id: res?._id, uid: patient?._id, text: text})
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
            <h2>MEDICAL REPORT</h2>
        
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
            <div >
                <h4>ADDRESS : {patient?.address}</h4>
                <p></p>
            </div>
            </div>


            </div>

            <h4>TEST RESULTS</h4>
            
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

            
        </div>
        {
            view &&
            <div className='custome_table_btn'>
                {text !== res?.content ? 
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

export default TestDisplay