import axios from 'axios'
import React, { useState } from 'react'
import { FaChevronLeft } from 'react-icons/fa'
import { useSelector } from 'react-redux'
import { selectantenatal } from '../../../features/antenatalSlice'
import { selectip } from '../../../features/ipSlice'

function AnteNatal5({handlePrevious, handleNext, setreload, reload}) {

    //axios.defaults.withCredentials = true
            const ip = useSelector(selectip)
  const antenatal = useSelector(selectantenatal)  

    const uid = sessionStorage.getItem('patient')
    const [generalCondition, setgeneralCondition] = useState(antenatal?.generalCondition || '')
    const [oedema, setoedema] = useState(antenatal?.oedema || '')
    const [anaemia, setanaemia] = useState(antenatal?.anaemia || '')
    const [respiratorySystem, setrespiratorySystem] = useState(antenatal?.respiratorySystem || '')
    const [cardiovascularSystem, setcardiovascularSystem] = useState(antenatal?.cardiovascularSystem || '')
    const [abdomen, setabdomen] = useState(antenatal?.abdomen || '')
    const [spleen, setspleen] = useState(antenatal?.spleen || '')
    const [liver, setliver] = useState(antenatal?.liver || '')
    const [preliminary, setpreliminary] = useState(antenatal?.preliminary || '')
    const [height, setheight] = useState(antenatal?.height || '')
    const [weight, setweight] = useState(antenatal?.weight || '')
    const [feet, setfeet] = useState(antenatal?.feet || '')
    const [inches, setinches] = useState(antenatal?.inches || '')
    const [ST, setST] = useState(antenatal?.ST || '')
    const [LBS, setLBS] = useState(antenatal?.LBS || '')
    const [BP, setBP] = useState(antenatal?.BP || '')
    const [albumin, setalbumin] = useState(antenatal?.albumin || '')
    const [sugar, setsugar] = useState(antenatal?.sugar || '')
    const [breastNipples, setbreastNipples] = useState(antenatal?.breastNipples || '')
    const [HB, setHB] = useState(antenatal?.HB || '')
    const [RB, setRB] = useState(antenatal?.RH || '')
    const [genotype, setgenotype] = useState(antenatal?.genotype || '')
    const [USS, setUSS] = useState(antenatal?.USS || '')
    const [bloodGroup, setbloodGroup] = useState(antenatal?.bloodGroup || '')
    const [chestXray, setchestXray] = useState(antenatal?.chestXray || '')

    const handleSubmit =async()=>{

        try {   
            await axios.post(`http://${'localhost'}:7700/antenatal5`, { 
                generalCondition,
                oedema,
                anaemia,
                respiratorySystem,
                cardiovascularSystem,
                abdomen,
                spleen,
                liver,
                preliminary,
                height, 
                weight,
                feet,
                inches,
                ST,
                LBS,
                BP,
                albumin,
                sugar,
                breastNipples,
                HB,
                RB,
                genotype,
                USS,
                bloodGroup,
                chestXray,
                uid
            }).then((res)=>{
                if(res.data.status === 'success'){
                    handleNext()
                    setreload(reload + 1)
                }
            })
        } catch (error) {
            console.log(error);
        }
    }

  return (
    <>
      <div className='patient_details_' >
          <div className='patient_details_input_field1' >
              <h3>PHYSICAL EXAMINATION</h3>
              <div className='patient_details_input_field1_' >
                  <h4>GENERAL CONDITION</h4>
                  <input value={generalCondition} onChange={(e)=>setgeneralCondition(e.target.value)} />
              </div>
              <div className='patient_details_input_field1_' >
                  <h4>OEDEMA</h4>
                  <input value={oedema} onChange={(e)=>setoedema(e.target.value)} />
              </div>
              <div className='patient_details_input_field1_' >
                  <h4>ANAEMIA</h4>
                  <input value={anaemia} onChange={(e)=>setanaemia(e.target.value)} />
              </div>
              <div className='patient_details_input_field1_' >
                  <h4>RESPIRATORY SYSTEM</h4>
                  <input value={respiratorySystem} onChange={(e)=>setrespiratorySystem(e.target.value)} />
              </div>
              <div className='patient_details_input_field1_' >
                  <h4>CARDIOVASCULAR SYSTEM</h4>
                  <input value={cardiovascularSystem} onChange={(e)=>setcardiovascularSystem(e.target.value)} />
              </div>
              <div className='patient_details_input_field1_' >
                  <h4>ABDOMEN</h4>
                  <input value={abdomen} onChange={(e)=>setabdomen(e.target.value)} />
              </div>
              <div className='patient_details_input_field1_' >
                  <h4>SPLEEN</h4>
                  <input value={spleen} onChange={(e)=>setspleen(e.target.value)} />
              </div>
              <div className='patient_details_input_field1_' >
                  <h4>LIVER</h4>
                  <input value={liver} onChange={(e)=>setliver(e.target.value)} />
              </div>
              <div className='patient_details_input_field1_' >
                  <h4>PRELIMINARY PELVIC ASSESSMENT</h4>
                  <input value={preliminary} onChange={(e)=>setpreliminary(e.target.value)} />
              </div>
              <div className='patient_details_input_field1_' >
                  <h4>HEIGHT</h4>
                  <input value={height} onChange={(e)=>setheight(e.target.value)} />
              </div>
              
              <div className='patient_details_input_field1_in_'>
                  <div className='patient_details_input_field1_in' >
                      <h4>FT</h4>
                      <input type='number' value={feet} onChange={(e)=>setfeet(e.target.value)} />
                  </div>
                  <div className='patient_details_input_field1_in' >
                      <h4>INS</h4>
                      <input type='number' value={inches} onChange={(e)=>setinches(e.target.value)} />
                  </div>
              </div>
          </div>
          
          <div className='patient_details_input_field1'>

              <div className='patient_details_input_field1_' >
                  <h4>WEIGHT</h4>
                  <input value={weight} onChange={(e)=>setweight(e.target.value)} />
              </div>
              
              <div className='patient_details_input_field1_in_'>
                  <div className='patient_details_input_field1_in' >
                      <h4>ST</h4>
                      <input value={ST} onChange={(e)=>setST(e.target.value)} />
                  </div>
                  <div className='patient_details_input_field1_in' >
                      <h4>IBS</h4>
                      <input value={LBS} onChange={(e)=>setLBS(e.target.value)} />
                  </div>
              </div>

              <div className='patient_details_input_field1_' >
                  <h4>B.P</h4>
                  <input value={BP} onChange={(e)=>setBP(e.target.value)} />
              </div>
              <div className='patient_details_input_field1_' >
                  <h4>URINE</h4>
                  
                  <div className='patient_details_input_field1_in_'>
                      <div className='patient_details_input_field1_in' >
                          <h4>ALBUMIN</h4>
                          <input value={albumin} onChange={(e)=>setalbumin(e.target.value)} />
                      </div>
                      <div className='patient_details_input_field1_in' >
                          <h4>SUGAR</h4>
                          <input value={sugar} onChange={(e)=>setsugar(e.target.value)} />
                      </div>
                  </div>
              </div>

              <div className='patient_details_input_field1_' >
                  <h4>BREAST AND NIPPLES</h4>
                  <input value={breastNipples} onChange={(e)=>setbreastNipples(e.target.value)} />
              </div>
              <div className='patient_details_input_field1_' >
                  <h4>HB</h4>
                  <input value={HB} onChange={(e)=>setHB(e.target.value)} />
              </div>
              <div className='patient_details_input_field1_' >
                  <h4>GENOTYPE</h4>
                  <input value={genotype} onChange={(e)=>setgenotype(e.target.value)} />
              </div>
              <div className='patient_details_input_field1_' >
                  <h4>USS</h4>
                  <input value={USS} onChange={(e)=>setUSS(e.target.value)} />
              </div>
              <div className='patient_details_input_field1_' >
                  <h4>BLOOD GROUP</h4>
                  <input value={bloodGroup} onChange={(e)=>setbloodGroup(e.target.value)} />
              </div>
              <div className='patient_details_input_field1_' >
                  <h4>RH</h4>
                  <input value={RB} onChange={(e)=>setRB(e.target.value)} />
              </div>
              <div className='patient_details_input_field1_' >
                  <h4>CHEST X-RAY</h4>
                  <input value={chestXray} onChange={(e)=>setchestXray(e.target.value)} />
              </div>
          </div>
      </div>

      
      <div className='custome_table_btn' >
          <div className='back_btn_' onClick={handlePrevious}>
              <FaChevronLeft />
              <h4>BACK</h4>
          </div>
          <button className='custome_table_btn2' onClick={handleSubmit}>NEXT</button>
      </div>
    </>
  )
}

export default AnteNatal5 