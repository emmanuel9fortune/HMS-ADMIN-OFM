import axios from 'axios'
import React, { useEffect, useRef, useState } from 'react'
import { FaChevronLeft } from 'react-icons/fa'
import { useSelector } from 'react-redux'
import { selectid } from '../../features/idSlice'
import { selectip } from '../../features/ipSlice'
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

function LabResults({handleBack}) {
  const [staff, setStaff] = useState([])
  const [patient, setpatient] = useState({})
  const [combineObj, setcombineObj] = useState([])

  
  const id = useSelector(selectid);
      const ip = useSelector(selectip)
  const uid = id?.id;
  

    useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.post(`http://${'localhost'}:7700/viewScanLab`, { uid })
        console.log(res);
        
        if (res.data.status === 'success') {
          setStaff(res.data.staffs || [])
          setpatient(res.data.patient || [])
          setcombineObj([...(res.data.getlabs || []), ...(res.data.getscan || [])]  )
        }
      } catch (err) {
        console.error('Error fetching scan/lab data:', err)
      }
    }

    if (uid) {
      fetchData()
    }
  }, [uid, ip])
  

  // Combine results uniquely  

  const refs = useRef([]);
  const [ready, setReady] = useState(false);

  // Ensure refs are available for each result
  useEffect(() => {
    refs.current = combineObj.map((_, i) => refs.current[i] || React.createRef());
    setReady(true);
  }, [combineObj]);

  const downloadSinglePDF = async (i) => {
    const ref = refs.current[i];
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
    pdf.save(`patient-${i + 1}.pdf`);
  };
  
  const [req, setReq] = useState(false)
  const [imgs, setimgs] = useState('')

  return (
    <div className='dashboard_body' >
        
      <div className='back_btn_' onClick={handleBack}>
          <FaChevronLeft />
          <h4>BACK</h4>
      </div>

      <div className='lab_result_container'>
        
        {combineObj?.length > 0 ?
          ready && combineObj?.map((obj, i) => {
            const getdoc = staff?.length > 0 ? 
              staff?.find((item)=> obj?.lab?.some((obg)=> obg?.doctorID === item?._id) ) 
            : []

            const getlab = staff?.length > 0 ? 
              staff?.find((item)=> obj?.lab?.some((obg)=> obg?.labID === item?._id) ) 
            : []

            const getscan = staff?.length > 0 ? 
              staff?.find((item)=> obj?.scan?.some((obg)=> obg?.scanID === item?._id) ) 
            : []

            return (
              <div className='lab_result_container_l'  key={i}>
                <div style={{width:'100%'}} ref={refs.current[i]}>
                  {
                    obj?.scan?.length > 0 ?
                      obj?.scan?.map((item, i)=>{
                          const photo =[
                            {img: item?.photo1},
                            {img: item?.photo2},
                            {img: item?.photo3},
                            {img: item?.photo4},
                            {img: item?.photo5},
                            {img: item?.photo6},
                          ]
                        return(
                          <div key={i} className='lab_result_container_'>
                            <div style={{width:'100%'}} ref={refs.current[i]}>
                              <h2>SCAN RESULTS</h2>
                              <div className='lab_result_header'>
                                <div>
                                  {/* <div>
                                    <h4>REQUEST DATE : </h4>
                                    <p></p>
                                  </div> */}
                                  {
                                    getdoc?.name &&
                                    <div>
                                      <h4>DOCTOR :  </h4>
                                      <p>{getdoc?.name}</p>
                                    </div>
                                  }
                                  
                                  <div>
                                    <h4>LAB SCIENTIST : </h4>
                                    <p>{getlab?.name || getscan?.name}</p>
                                  </div>
                                </div>

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
                                      <img key={i} style={{cursor:'pointer'}} onClick={()=>[setimgs(item?.img), setReq(true)]} src={`http://${'localhost'}:7700/uploads/scans/${item?.img}`} alt='' crossOrigin="anonymous" />
                                    ))
                                  }
                              </div>
                            </div>
                            <div className='custome_table_btn'>
                              <div></div>
                              <button className='custome_table_btn2' onClick={() => downloadSinglePDF(i)}>DOWNLOAD RESULT</button>
                            </div>
                          </div>
                        )
                      })
                    :
                    <div className='lab_result_container_'>
                      <h2>MEDICAL REPORT</h2>
                    
                      <div className='lab_result_header'>
                        <div>
                          {/* <div>
                            <h4>REQUEST DATE : </h4>
                            <p></p>
                          </div> */}
                          {
                            getdoc?.name &&
                            <div>
                              <h4>DOCTOR :  </h4>
                              <p>{getdoc?.name}</p>
                            </div>
                          }
                          
                          <div>
                            <h4>LAB SCIENTIST : </h4>
                            <p>{getlab?.name || getscan?.name}</p>
                          </div>
                        </div>

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
                      
                      <table className='custome_table'>
                          <thead>
                              <tr>
                                  <th>DATE</th>
                                  <th>NAME OF TEST</th>
                                  <th>SPECIMEN TYPE</th>
                                  <th>TEST RESULT</th>
                                  <th>PRICE</th>
                              </tr>
                          </thead>
                          <tbody>
                            {
                              obj?.lab &&
                              obj?.lab?.map((item, i)=>(
                              <tr key={i} >
                                  <td><p>{item?.date}</p></td>
                                  <td><p>{item?.testname}</p></td>
                                  <td><p>{item?.specimen}</p></td>
                                  <td><p>{item?.results}</p></td>
                                  <td><p>{item?.price}</p></td>
                              </tr>
                              ))
                            }
                          </tbody>
                      </table>
                    </div>
                  }
                </div>
                
                {
                  obj?.scan?.length > 0 ?
                  null
                  :
                  <div className='custome_table_btn'>
                    <div></div>
                    <button className='custome_table_btn2' onClick={() => downloadSinglePDF(i)}>DOWNLOAD RESULT</button>
                  </div>
                }
              </div>
          )})

          :
          <h3>No Results</h3>
        }

        {req && (
        <div className='popt_request'>
          <div className='over_lay_pop_up' onClick={() => setReq(false)}></div>
          <div className='pop_up_request_display1'>
            <img src={`http://${'localhost'}:7700/uploads/scans/${imgs}`} alt='' />
          </div>
        </div>
      )}
      </div>
    </div>
  )
}

export default LabResults