import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { FaChevronLeft } from 'react-icons/fa';
import { useSelector } from 'react-redux';
import { selectid } from '../../features/idSlice';
import { toast } from 'react-toastify';

function ReunTest({ handleBack }) {
  const id = useSelector(selectid);
  const uid = id?.id;
  const cip = window.location.hostname

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

  

  const handleSubmit = async () => {
    if (!content || content.trim() === '') {
      toast.warning('Please enter some test result content.');
      return;
    }

    try {
      const res = await axios.post(`http://${cip || 'localhost'}:7700/runtest`, {
        content,
        uid,
      });
      console.log(res);
      

      if (res.data.status === 'success') {
        toast.success('TEST RESULT SUBMITTED SUCCESSFULLY');
        window.location.reload();
      } else {
        toast.error(res.data.message || 'Submission failed');
      }
    } catch (error) {
      console.error('Submission Error:', error);
      toast.error('Submission failed');
    }
  };



// console.log(getID)

  return (
    <div className="dashboard_body" style={{ padding: '20px' }}>
      <div className="back_btn_" onClick={handleBack} style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
        <FaChevronLeft />
        <h4 style={{ marginLeft: '10px' }}>BACK</h4>
      </div>


      <p style={{margin:'10px 0', color:'red'}} >Note: ones test is saved it can not be edited anymore</p>

      <h3 style={{margin:'20px 0'}} >RUN TESTS</h3>

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

      <p style={{margin:'10px 0', color:'red'}} >Note: ones test is saved it can not be edited anymore</p>

      <button
        onClick={handleSubmit}
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
        Submit Test Result
      </button>
    </div>
  );
}

export default ReunTest;
