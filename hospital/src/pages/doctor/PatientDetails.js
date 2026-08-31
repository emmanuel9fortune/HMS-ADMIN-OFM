import React, { useEffect, useState } from 'react'
import { FaChevronLeft } from 'react-icons/fa'
import Vitals from './Vitals'
import LabResult from './LabResult'
import Prescriptions from './Prescriptions'
import axios from 'axios'
import { useSelector } from 'react-redux'
import { selectid } from '../../features/idSlice'
import { selectip } from '../../features/ipSlice'
import TransactionHistory from './TransactionHistory'
import { toast } from 'react-toastify'
import LabourChart from '../nurse/LabourChart'
import BabyVitals from '../nurse/BabyVitals'
import Medications from './MedicationChart'

function PatientDetails({handleBack, admin}) {

    const [currenIndex, setCurrentIndex] = useState(0)
        const ip = useSelector(selectip)

    
        //axios.defaults.withCredentials = true
    
        const [notes, setnotes] = useState('')
        const [timeStamp, settimeStamp] = useState('')
        const [hop, sethop] = useState('')
        const [sex, setsex] = useState('')
        const [phone, setphone] = useState('')
        const [name, setname] = useState('')
        const [religion, setreligion] = useState('')
        const [address, setaddress] = useState( '')
        const [specialPoints, setspecialPoints] = useState( '')
        const [dateOfBirth, setdateOfBirth] = useState('')
        const [sect, setsect] = useState('')
        const [tribe, settribe] = useState('')
        const [spousePhone, setspousePhone] = useState('')
        const [nextOfKinAddress, setnextOfKinAddress] = useState('')
        const [nextOfKin, setnextOfKin] = useState('')
        const [age, setage] = useState('')
        const [AgeType, setAgeType] = useState('')
        const [nextOfKinPhone, setnextOfKinPhone] = useState('')
        const [center, setcenter] = useState('')
        const [dateOfBooking, setdateOfBooking] = useState('')
        const [occupation, setoccupation] = useState('')
        const [educationLevel, seteducationLevel] = useState('')
        const [maritalStatus, setmaritalStatus] = useState('')
        const [ageAtMarriage, setageAtMarriage] = useState('')
        const [LMP, setLMP] = useState('')
        const [eddByUss, seteddByUss] = useState('')
        const [eddDate, seteddDate] = useState('')
        const [AverageMonthlyFamilyIncome, setAverageMonthlyFamilyIncome] = useState('')
        
        const [heartDisease, setheartDisease] = useState('')
        const [kidneyDisease, setkidneyDisease] = useState('')
        const [Diabetes, setDiabetes] = useState('')
        const [ChestDisease, setChestDisease] = useState('')
        const [Covid, setCovid] = useState('')
        const [PreviousePregnancies, setPreviousePregnancies] = useState('')
        const [NoOfLivingChildren, setNoOfLivingChildren] = useState('')
        const [NumberOfOperations, setNumberOfOperations] = useState('')
    
        const [letter, setletter] = useState('')
        const [specialInvestigation, setspecialInvestigation] = useState('')
        const [generalCondition, setgeneralCondition] = useState('')
    
        const [urinarySymptoms, seturinarySymptoms] = useState('')
        const [historyPreg, sethistoryPreg] = useState('')
        const [vomiting, setvomiting] = useState('')
        const [vaginalDischarge, setvaginalDischarge] = useState('')
        const [swellingOfAnkles, setswellingOfAnkles] = useState('')
        const [bleeding, setbleeding] = useState('')
        const [otherSymptoms, setotherSymptoms] = useState('')
    
        const [oedema, setoedema] = useState('')
        const [anaemia, setanaemia] = useState('')
        const [respiratorySystem, setrespiratorySystem] = useState('')
        const [cardiovascularSystem, setcardiovascularSystem] = useState('')
        const [abdomen, setabdomen] = useState('')
        const [spleen, setspleen] = useState('')
        const [liver, setliver] = useState('')
        const [preliminary, setpreliminary] = useState('')
        const [height, setheight] = useState('')
        const [weight, setweight] = useState('')
        const [feet, setfeet] = useState('')
        const [inches, setinches] = useState('')
        const [ST, setST] = useState('')
        const [LBS, setLBS] = useState('')
        const [BP, setBP] = useState('')
        const [albumin, setalbumin] = useState('')
        const [sugar, setsugar] = useState('')
        const [breastNipples, setbreastNipples] = useState('')
        const [HB, setHB] = useState('')
        const [RB, setRB] = useState('')
        const [genotype, setgenotype] = useState('')
        const [USS, setUSS] = useState('')
        const [bloodGroup, setbloodGroup] = useState('')
        const [chestXray, setchestXray] = useState('')
        
        const [comments, setcomments] = useState('')
        const [pelvicAssessment, setpelvicAssessment] = useState('')
        const [specialInstruction, setspecialInstruction] = useState('')
        const [operation, setoperation] = useState([])
        const [antenatal, setantenatal] = useState([])
        const [reload, setreload] = useState(0)
    
        const handlePrevious=()=>{
            handleBack()
        }
    
        const id = useSelector(selectid)
    
        const [originalValues, setOriginalValues] = useState({})
        const [originalValuee2, setOriginalValuee2] = useState({})
        const cip = window.location.hostname
        
    
        useEffect(()=>{
            const func=async()=>{
                try {
                    await axios.post(`http://${cip || 'localhost'}:7700/getPatientDetails`, {uid: id?.id}).then((res)=>{
                        //console.log(res);
                        
                        if(res.data.status === 'success'){
                            const getpatient = res.data?.getPatient
                            const getantenatal = res.data?.getantenatal
                            setOriginalValues(getpatient)
                            setOriginalValuee2(getantenatal)
    
                            setname(res.data?.getPatient?.name || '')
                            settimeStamp(res.data?.getPatient?.timeStamp || '')
                            setnotes(res.data?.getPatient?.notes || '')
                            sethop(res.data?.getPatient?.hop || '')
                            setsex(res.data?.getPatient?.sex || '')
                            setphone(res.data?.getPatient?.phone || '')
                            setreligion(res.data?.getPatient?.religion || '')
                            setaddress(res.data?.getPatient?.address || '')
                            setspecialPoints(res.data?.getPatient?.specialPoints || '')
                            setdateOfBirth(res.data?.getPatient?.dateOfBirth || '')
                            setsect(res.data?.getPatient?.sect || '')
                            settribe(res.data?.getPatient?.tribe || '')
                            setspousePhone(res.data?.getPatient?.spousePhone || '')
                            setnextOfKinAddress(res.data?.getPatient?.nextOfKinAddress || '')
                            setnextOfKin(res.data?.getPatient?.nextOfKin || '')
                            setage(res.data?.getPatient?.age || '')
                            setAgeType(res.data?.getPatient?.AgeType || '')
                            setnextOfKinPhone(res.data?.getPatient?.nextOfKinPhone || '')
                            setcenter(res.data?.getPatient?.center || '')
                            setdateOfBooking(res.data?.getPatient?.dateOfBooking || '')
                            setoccupation(res.data?.getPatient?.occupation || '')
                            seteducationLevel(res.data?.getPatient?.educationLevel || '')
                            setmaritalStatus(res.data?.getPatient?.maritalStatus || '')
                            setageAtMarriage(res.data?.getPatient?.ageAtMarriage || '')
                            setLMP(res.data?.getPatient?.LMP || '')
                            seteddByUss(res.data?.getPatient?.eddByUss || '')
                            seteddDate(res.data?.getPatient?.eddDate || '')
                            setAverageMonthlyFamilyIncome(res.data?.getPatient?.AverageMonthlyFamilyIncome || '')
                            
                            setheartDisease(res.data?.getPatient?.heartDisease || '')
                            setkidneyDisease(res.data?.getPatient?.kidneyDisease || '')
                            setDiabetes(res.data?.getPatient?.Diabetes || '')
                            setChestDisease(res.data?.getPatient?.ChestDisease || '')
                            setCovid(res.data?.getPatient?.Covid || '')
                            setPreviousePregnancies(res.data?.getPatient?.PreviousePregnancies || '')
                            setNoOfLivingChildren(res.data?.getPatient?.NoOfLivingChildren || '')
                            setNumberOfOperations(res.data?.getPatient?.NumberOfOperations || '')
    
                            setletter(res.data?.getantenatal?.letter || '')
                            setspecialInvestigation(res.data?.getantenatal?.specialInvestigation || '')
                            setgeneralCondition(res.data?.getantenatal?.generalCondition || '')
    
                            seturinarySymptoms(res.data?.getantenatal?.urinarySymptoms || '')
                            sethistoryPreg(res.data?.getantenatal?.historyPreg || '')
                            setvomiting(res.data?.getantenatal?.vomiting || '')
                            setvaginalDischarge(res.data?.getantenatal?.vaginalDischarge || '')
                            setswellingOfAnkles(res.data?.getantenatal?.swellingOfAnkles || '')
                            setbleeding(res.data?.getantenatal?.bleeding || '')
                            setotherSymptoms(res.data?.getantenatal?.otherSymptoms || '')
    
                            setoedema(res.data?.getantenatal?.oedema || '')
                            setanaemia(res.data?.getantenatal?.anaemia || '')
                            setrespiratorySystem(res.data?.getantenatal?.respiratorySystem || '')
                            setcardiovascularSystem(res.data?.getantenatal?.cardiovascularSystem || '')
                            setabdomen(res.data?.getantenatal?.abdomen || '')
                            setspleen(res.data?.getantenatal?.spleen || '')
                            setliver(res.data?.getantenatal?.liver || '')
                            setpreliminary(res.data?.getantenatal?.preliminary || '')
                            setheight(res.data?.getantenatal?.height || '')
                            setweight(res.data?.getantenatal?.weight || '')
                            setfeet(res.data?.getantenatal?.feet || '')
                            setinches(res.data?.getantenatal?.inches || '')
                            setST(res.data?.getantenatal?.ST || '')
                            setLBS(res.data?.getantenatal?.LBS || '')
                            setBP(res.data?.getantenatal?.BP || '')
                            setalbumin(res.data?.getantenatal?.albumin || '')
                            setsugar(res.data?.getantenatal?.sugar || '')
                            setbreastNipples(res.data?.getantenatal?.breastNipples || '')
                            setHB(res.data?.getantenatal?.HB || '')
                            setRB(res.data?.getantenatal?.RH || '')
                            setgenotype(res.data?.getantenatal?.genotype || '')
                            setUSS(res.data?.getantenatal?.USS || '')
                            setbloodGroup(res.data?.getantenatal?.bloodGroup || '')
                            setchestXray(res.data?.getantenatal?.chestXray || '')
                            
                            setcomments(res.data?.getantenatal?.comments || '')
                            setpelvicAssessment(res.data?.getantenatal?.pelvicAssessment || '')
                            setspecialInstruction(res.data?.getantenatal?.specialInstruction || '')
                            setoperation(res.data?.getPatient?.operations || '')
                            setantenatal(res.data?.getPatient?.anteNatalRecords || '')
                            setreload(0)
                        }
                    })
                } catch (error) {
                    console.log(error);
                }
            }
            func()
        },[id, reload, ip])
    
    
        const hasChanges = () => {
            const changes = {};
    
            if (name && name !== originalValues.name) changes.name = name;
            if (notes && notes !== originalValues.notes) changes.notes = notes;
            if (hop && hop !== originalValues.hop) changes.hop = hop;
            if (phone && phone !== originalValues.phone) changes.phone = phone;
            if (sex && sex !== originalValues.sex) changes.sex = sex;
            if (religion && religion !== originalValues.religion) changes.religion = religion;
            if (address && address !== originalValues.address) changes.address = address;
            if (specialPoints && specialPoints !== originalValues.specialPoints) changes.specialPoints = specialPoints;
            if (dateOfBirth && dateOfBirth !== originalValues.dateOfBirth) changes.dateOfBirth = dateOfBirth;
            if (sect && sect !== originalValues.sect) changes.sect = sect;
            if (tribe && tribe !== originalValues.tribe) changes.tribe = tribe;
            if (spousePhone && spousePhone !== originalValues.spousePhone) changes.spousePhone = spousePhone;
            if (nextOfKinAddress && nextOfKinAddress !== originalValues.nextOfKinAddress) changes.nextOfKinAddress = nextOfKinAddress;
            if (nextOfKin && nextOfKin !== originalValues.nextOfKin) changes.nextOfKin = nextOfKin;
            if (age && age !== originalValues.age) changes.age = age;
            if (AgeType && AgeType !== originalValues.AgeType) changes.AgeType = AgeType;
            if (nextOfKinPhone && nextOfKinPhone !== originalValues.nextOfKinPhone) changes.nextOfKinPhone = nextOfKinPhone;
            if (center && center !== originalValues.center) changes.center = center;
            if (dateOfBooking && dateOfBooking !== originalValues.dateOfBooking) changes.dateOfBooking = dateOfBooking;
            if (occupation && occupation !== originalValues.occupation) changes.occupation = occupation;
            if (educationLevel && educationLevel !== originalValues.educationLevel) changes.educationLevel = educationLevel;
            if (maritalStatus && maritalStatus !== originalValues.maritalStatus) changes.maritalStatus = maritalStatus;
            if (ageAtMarriage && ageAtMarriage !== originalValues.ageAtMarriage) changes.ageAtMarriage = ageAtMarriage;
            if (LMP && LMP !== originalValues.LMP) changes.LMP = LMP;
            if (eddByUss && eddByUss !== originalValues.eddByUss) changes.eddByUss = eddByUss;
            if (eddDate && eddDate !== originalValues.eddDate) changes.eddDate = eddDate;
            if (AverageMonthlyFamilyIncome && AverageMonthlyFamilyIncome !== originalValues.AverageMonthlyFamilyIncome) changes.AverageMonthlyFamilyIncome = AverageMonthlyFamilyIncome;
            if (heartDisease && heartDisease !== originalValues.heartDisease) changes.heartDisease = heartDisease;
            if (kidneyDisease && kidneyDisease !== originalValues.kidneyDisease) changes.kidneyDisease = kidneyDisease;
            if (Diabetes && Diabetes !== originalValues.Diabetes) changes.Diabetes = Diabetes;
            if (ChestDisease && ChestDisease !== originalValues.ChestDisease) changes.ChestDisease = ChestDisease;
            if (Covid && Covid !== originalValues.Covid) changes.Covid = Covid;
            if (PreviousePregnancies && PreviousePregnancies !== originalValues.PreviousePregnancies) changes.PreviousePregnancies = PreviousePregnancies;
            if (NoOfLivingChildren && NoOfLivingChildren !== originalValues.NoOfLivingChildren) changes.NoOfLivingChildren = NoOfLivingChildren;
            if (NumberOfOperations && NumberOfOperations !== originalValues.NumberOfOperations) changes.NumberOfOperations = NumberOfOperations;
            if (letter && letter !== originalValuee2.letter) changes.letter = letter;
            if (specialInvestigation && specialInvestigation !== originalValuee2.specialInvestigation) changes.specialInvestigation = specialInvestigation;
            if (generalCondition && generalCondition !== originalValuee2.generalCondition) changes.generalCondition = generalCondition;
            if (urinarySymptoms && urinarySymptoms !== originalValuee2.urinarySymptoms) changes.urinarySymptoms = urinarySymptoms;
            if (historyPreg && historyPreg !== originalValuee2.historyPreg) changes.historyPreg = historyPreg;
            if (vomiting && vomiting !== originalValuee2.vomiting) changes.vomiting = vomiting;
            if (vaginalDischarge && vaginalDischarge !== originalValuee2.vaginalDischarge) changes.vaginalDischarge = vaginalDischarge;
            if (swellingOfAnkles && swellingOfAnkles !== originalValuee2.swellingOfAnkles) changes.swellingOfAnkles = swellingOfAnkles;
            if (bleeding && bleeding !== originalValuee2.bleeding) changes.bleeding = bleeding;
            if (otherSymptoms && otherSymptoms !== originalValuee2.otherSymptoms) changes.otherSymptoms = otherSymptoms;
            if (oedema && oedema !== originalValuee2.oedema) changes.oedema = oedema;
            if (anaemia && anaemia !== originalValuee2.anaemia) changes.anaemia = anaemia;
            if (respiratorySystem && respiratorySystem !== originalValuee2.respiratorySystem) changes.respiratorySystem = respiratorySystem;
            if (cardiovascularSystem && cardiovascularSystem !== originalValuee2.cardiovascularSystem) changes.cardiovascularSystem = cardiovascularSystem;
            if (abdomen && abdomen !== originalValuee2.abdomen) changes.abdomen = abdomen;
            if (spleen && spleen !== originalValuee2.spleen) changes.spleen = spleen;
            if (liver && liver !== originalValuee2.liver) changes.liver = liver;
            if (preliminary && preliminary !== originalValuee2.preliminary) changes.preliminary = preliminary;
            if (height && height !== originalValuee2.height) changes.height = height;
            if (weight && weight !== originalValuee2.weight) changes.weight = weight;
            if (feet && feet !== originalValuee2.feet) changes.feet = feet;
            if (inches && inches !== originalValuee2.inches) changes.inches = inches;
            if (ST && ST !== originalValuee2.ST) changes.ST = ST;
            if (LBS && LBS !== originalValuee2.LBS) changes.LBS = LBS;
            if (BP && BP !== originalValuee2.BP) changes.BP = BP;
            if (albumin && albumin !== originalValuee2.albumin) changes.albumin = albumin;
            if (sugar && sugar !== originalValuee2.sugar) changes.sugar = sugar;
            if (breastNipples && breastNipples !== originalValuee2.breastNipples) changes.breastNipples = breastNipples;
            if (HB && HB !== originalValuee2.HB) changes.HB = HB;
            if (RB && RB !== originalValuee2.RH) changes.RB = RB;
            if (genotype && genotype !== originalValuee2.genotype) changes.genotype = genotype;
            if (USS && USS !== originalValuee2.USS) changes.USS = USS;
            if (bloodGroup && bloodGroup !== originalValuee2.bloodGroup) changes.bloodGroup = bloodGroup;
            if (chestXray && chestXray !== originalValuee2.chestXray) changes.chestXray = chestXray;
            if (comments && comments !== originalValuee2.comments) changes.comments = comments;
            if (pelvicAssessment && pelvicAssessment !== originalValuee2.pelvicAssessment) changes.pelvicAssessment = pelvicAssessment;
            if (specialInstruction && specialInstruction !== originalValuee2.specialInstruction) changes.specialInstruction = specialInstruction;
    
            return changes;
        };
    
    
        const changes = hasChanges()
    
        
    
        const handleSave =async()=>{
            try {
                await axios.post(`http://${cip || 'localhost'}:7700/editPatientDetails`, {changes: changes, uid: id?.id}).then((res)=>{
                    if(res.data.status === 'success'){
                        setreload(reload + 1)
                        toast.success('Changes Saved')
                    }
                })
            } catch (error) {
                console.log(error);
            }
        }
    
    
    // ======================================================================//
    // ||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||//
    // ======================================================================//

    const emptyRow = {
        dateOfBirth: '',
        durationOfPregnancy: '',
        birthWeight: '',
        complicationInPregnancy: '',
        complicationInLabour: '',
        puerPremium: '',
        ageAtDeath: '',
        causeOfDeath: '',
    };

    const [formData, setFormData] = useState([emptyRow]);

    useEffect(() => {
        if (operation?.length > 0) {
        const formatted = operation.map(item => ({
            dateOfBirth: item?.dateOfBirth || '',
            durationOfPregnancy: item?.durationOfPregnancy || '',
            birthWeight: item?.birthWeight || '',
            complicationInPregnancy: item?.complicationInPregnancy || '',
            complicationInLabour: item?.complicationInLabour || '',
            puerPremium: item?.puerPremium || '',
            ageAtDeath: item?.ageAtDeath || '',
            causeOfDeath: item?.causeOfDeath || '',
            opId: item?._id || null, // Assuming backend gives an _id for deletion
            _id: item?._id || null // Assuming backend gives an _id for deletion
        }));
        setFormData(formatted);
        }
    }, [operation]);

    const handleChange = (index, e) => {
        const { name, value } = e.target;
        const updated = [...formData];
        updated[index][name] = value;
        setFormData(updated);
    };
  
    const uid = id?.id

    const addRow = () => {
        setFormData(prev => [...prev, emptyRow]);
    };

    const removeRow = async ({ index, opId }) => {
        if (formData.length === 1) {
        return toast.error("At least one row is required.");
        }

        const updated = formData.filter((_, i) => i !== index);
        setFormData(updated);

        if (opId) {
        try {
            await axios.post(`http://${cip || 'localhost'}:7700/deleteTable`, { opId, uid });
        } catch (error) {
            console.error(error);
        }
        }
    };

    
    const handleSubmit = async () => {
        try {
        const res = await axios.post(`http://${cip || 'localhost'}:7700/operations`, {
            formFields: formData,
            uid
        });

        if (res.data.status === 'success') {
            setreload(reload + 1);
        }
        } catch (error) {
        console.error(error);
        }
    };

    // ======================================================================//
    // ||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||//
    // ======================================================================//
    
    
      
    
      
    const [formData1, setFormData1] = useState([]);

    useEffect(() => {
    if (antenatal?.length > 0) {
        const formattedData = antenatal.map(item => ({
        _id: item?._id,
        date: item?.date || '',
        heightOfFundus: item?.heightOfFundus || '',
        presentingPartToBrim: item?.presentingPartToBrim || '',
        presentationAndPosition: item?.presentationAndPosition || '',
        oedema: item?.oedema || '',
        foetalHeart: item?.foetalHeart || '',
        urine: item?.urine || '',
        BP: item?.BP || '',
        weight: item?.weight || '',
        HB: item?.HB || '',
        remark: item?.remark || '',
        initialOfExaminer: item?.initialOfExaminer || '',
        Return: item?.Return || '',
        }));
        setFormData1(formattedData);
    } else {
        setFormData1([{
        date: '',
        heightOfFundus: '',
        presentingPartToBrim: '',
        presentationAndPosition: '',
        oedema: '',
        foetalHeart: '',
        urine: '',
        BP: '',
        weight: '',
        HB: '',
        remark: '',
        initialOfExaminer: '',
        Return: '',
        }]);
    }
    }, [antenatal]);

    const handleChange1 = (index, e) => {
    const { name, value } = e.target;
    const updated = [...formData1];
    updated[index][name] = value;
    setFormData1(updated);
    };

    const addRow1 = () => {
    setFormData1(prev => [
        ...prev,
        {
        date: '',
        heightOfFundus: '',
        presentingPartToBrim: '',
        presentationAndPosition: '',
        oedema: '',
        foetalHeart: '',
        urine: '',
        BP: '',
        weight: '',
        HB: '',
        remark: '',
        initialOfExaminer: '',
        Return: '',
        },
    ]);
    };

    const removeRow1 = async (index, _id) => {
        if (formData1.length === 1) return toast.error('At least one row is required.');
        const updatedRows = formData1.filter((_, i) => i !== index);
        setFormData1(updatedRows);

        if (_id) {
        try {
            await axios.post(`http://${cip || 'localhost'}:7700/deleteTable`, { uid, Id: _id });
        } catch (error) {
            console.log(error);
        }
        }
    };

    const handleSubmit1 = async () => {
        try {
        await axios.post(`http://${cip || 'localhost'}:7700/antenatal7`, {
            uid,
            formFields: formData1,
        }).then((res) => {
            //console.log(res);
            
            if (res.data.status === 'success') {
            setreload(reload + 1);
            }
        });
        } catch (error) {
        console.log(error); 
        }
    };

    
    const date = new Date(Number(timeStamp))
    const day = date.getDate()
    const month = date.getMonth()
    const year = date.getFullYear()
    const date1 = new Date(Number(timeStamp))

    let hours = date1.getHours()
    const minutes = date1.getMinutes()
    const ampm = hours >= 12 ? "PM" : "AM"

    hours = hours % 12
    hours = hours ? hours : 12

    const pad = (n) => n.toString().padStart(2, '0')

    const timeString = `${pad(hours)}:${pad(minutes)} ${ampm}` 
 
    const [patientIndex, setpatientIndex] = useState(0)

  return (
    <>
        {   
            center ?
                currenIndex === 0 &&
                <div className='dashboard_body' >
                    <div className='back_btn_' onClick={handlePrevious}>
                        <FaChevronLeft />
                        <h4>BACK</h4>
                    </div>
                    <div className='dashboard_body_patient_details_btns'>
                        <button className={currenIndex === 0 && 'dashboard_body_patient_details_btns_'}>PATIENT DETAILS</button>
                        <button onClick={()=>setCurrentIndex(1)} >VITALS</button>
                        <button onClick={()=>setCurrentIndex(2)}>LAB RESULTS | SCAN</button>
                        {/* <button onClick={()=>setCurrentIndex(3)}>PREVIOUS VISITS</button> */}
                        <button onClick={()=>setCurrentIndex(3)}>PRESCRIPTION</button>
                        <button onClick={()=>setCurrentIndex(5)}>MEDICATION CHART</button>
                        <button onClick={()=>setCurrentIndex(4)}>TRANSACTION HISTORY</button>
                    </div>

                    
                    {
                        Object.keys(changes)?.length > 0 &&
                        <div className='changes_count' >
                            <p>{Object.keys(changes)?.length} Changes detected. Click to save changes</p>
                            <button onClick={handleSave} >SAVE</button>
                        </div> 
                    }
                    
                    <div className='dashboard_body_header' style={{width:'100%', display:'flex', alignItems:'center', justifyContent:'space-between'}} >
                        <div style={{margin:'20px 0'}}>
                            <h4>CARD CREATED AT:</h4>
                            <h4>{timeString}, {day} | {month} | {year}</h4>
                        </div>
                
                        <div className='dashboard_body_patient_details_btns' style={{justifyContent:'flex-end', width:'50%', display:'flex'}}>
                            { patientIndex === 1 || patientIndex === 2 ?
                                <button onClick={()=>setpatientIndex(0)}>
                                    VIEW CARD
                                </button>
                                : 
                                <div style={{flex:1}} ></div>
                            }
                            <button onClick={()=>setpatientIndex(1)} className={patientIndex === 1 && 'dashboard_body_patient_details_btns_'}>
                                LABOUR CHART
                            </button>
                            <button onClick={()=>setpatientIndex(2)} className={patientIndex === 2 && 'dashboard_body_patient_details_btns_'}>
                                BABY VITALS
                            </button>
                        </div>
                    </div>

                    {
                        patientIndex === 0 &&
                        <>
                            {/* //////////////////////////////////////////////////////////////////////// */}
                            {/* ------------------------------------------------------------------------ */}
                            {/* //////////////////////////////////////////////////////////////////////// */}
                            <div className='patient_details_' >
                                <div className='patient_details_input_field1' >
                                    <div className='patient_details_input_field1_' >
                                        <h4>PATIENT NAME</h4>
                                        <input placeholder='Enter Patient Name' value={name} onChange={(e)=>setname(e.target.value)} />
                                    </div>
                                    <div className='patient_details_input_field1_' >
                                        <h4>CENTER</h4>
                                        <input placeholder='Enter center' value={center} onChange={(e)=>setcenter(e.target.value)} />
                                    </div>
                                    <div className='patient_details_input_field1_' >
                                        <h4>SPECIAL POINTS</h4>
                                        <input placeholder='Enter special Point' value={specialPoints} onChange={(e)=>setspecialPoints(e.target.value)} />
                                    </div>
                                    <div className='patient_details_input_field1_' >
                                        <h4>ADDRESS</h4>
                                        <input value={address} onChange={(e)=>setaddress(e.target.value)} />
                                    </div>
                                    <div className='patient_details_input_field1_'>
                                        <h4>RELIGION</h4>
                                        <select value={religion} onChange={(e)=> setreligion(e.target.value)} >
                                            <option >Select Religion</option>
                                            <option value={'christian'} >Christian</option>
                                            <option value={'islam'}>Islam</option>
                                            <option value={'other'}>Other</option>
                                        </select>
                                    </div>
                                    <div className='patient_details_input_field1_' >
                                        <h4>SECT</h4>
                                        <input value={sect} onChange={(e)=>setsect(e.target.value)} />
                                    </div>
                                    <div className='patient_details_input_field1_' >
                                        <h4>DATE OF BIRTH</h4>
                                        <input type='date' value={dateOfBirth} onChange={(e)=>setdateOfBirth(e.target.value)} />
                                    </div>
                                    
                                    <div className='patient_details_input_field1_in_'>
                                        <div className='patient_details_input_field1_in' >
                                            <h4>AGE</h4>
                                            <input type='number' value={age} onChange={(e)=>setage(e.target.value)} />
                                        </div>
                                        <div className='patient_details_input_field1_in' >
                                            <h4>TRIBE</h4>
                                            <input value={tribe} onChange={(e)=>settribe(e.target.value)} />
                                        </div>
                                    </div>

                                    <div className='patient_details_input_field1_' >
                                        <h4>SPOUSE PHONE NUMBER</h4>
                                        <input type='number' value={spousePhone} onChange={(e)=>setspousePhone(e.target.value)} />
                                    </div>
                                    <div className='patient_details_input_field1_' >
                                        <h4>NEXT OF KIN</h4>
                                        <input value={nextOfKin} onChange={(e)=>setnextOfKin(e.target.value)} />
                                    </div>
                                    <div className='patient_details_input_field1_' >
                                        <h4>NEXT OF KIN'S PHONE</h4>
                                        <input value={nextOfKinPhone} onChange={(e)=>setnextOfKinPhone(e.target.value)} />
                                    </div>
                                </div>
                                
                                <div className='patient_details_input_field1'>
                                    <div className='patient_details_input_field1_' >
                                        <h4>NEXT OF KIN'S ADDRESS</h4>
                                        <input value={nextOfKinAddress} onChange={(e)=>setnextOfKinAddress(e.target.value)} />
                                    </div>
                                    <div className='patient_details_input_field1_' >
                                        <h4>DATE OF BOOKING</h4>
                                        <input type='date' value={dateOfBooking} onChange={(e)=>setdateOfBooking(e.target.value)} />
                                    </div>
                                    <div className='patient_details_input_field1_' >
                                        <h4>OCCUPATION</h4>
                                        <input value={occupation} onChange={(e)=>setoccupation(e.target.value)} />
                                    </div>
                                    <div className='patient_details_input_field1_' >
                                        <h4>LEVEL OF EDUCATION</h4>
                                        <input value={educationLevel} onChange={(e)=>seteducationLevel(e.target.value)} />
                                    </div>
                                    <div className='patient_details_input_field1_' >
                                        <h4>MARITA STATUS</h4>
                                        <select value={maritalStatus} onChange={(e)=>setmaritalStatus(e.target.value)}>
                                            <option>Select Marital status</option>
                                            <option value={'married'}>Married</option>
                                            <option value={'divorce'}>Divorce</option>
                                            <option value={'single'}>Single</option>
                                            <option value={'widow'}>Widow</option>
                                        </select>
                                    </div>
                                    <div className='patient_details_input_field1_' >
                                        <h4>AGE AT MARRIAGE</h4>
                                        <input value={ageAtMarriage} onChange={(e)=>setageAtMarriage(e.target.value)} />
                                    </div>
                                    <div className='patient_details_input_field1_' >
                                        <h4>L.M.P</h4>
                                        <input value={LMP} onChange={(e)=>setLMP(e.target.value)} />
                                    </div>
                                    <div className='patient_details_input_field1_' >
                                        <h4>EDD BY USS</h4>
                                        <input value={eddByUss} onChange={(e)=>seteddByUss(e.target.value)} />
                                    </div>

                                    <div className='patient_details_input_field1_' >
                                        <h4>EDD DATE</h4>
                                        <input value={eddDate} onChange={(e)=>seteddDate(e.target.value)} />
                                    </div>
                                    <div className='patient_details_input_field1_' >
                                        <h4>AVERAGE MONTHLY FAMILY INCOME</h4>
                                        <input value={AverageMonthlyFamilyIncome} onChange={(e)=>setAverageMonthlyFamilyIncome(e.target.value)} />
                                    </div>
                                </div>
                            </div>
                            {/* //////////////////////////////////////////////////////////////////////// */}
                            {/* ------------------------------------------------------------------------ */}
                            {/* //////////////////////////////////////////////////////////////////////// */}

                            <div className='sidebar_spacer' ></div>

                            <h3>PREVIOUS MEDICAL HISTORY</h3>

                            {/* //////////////////////////////////////////////////////////////////////// */}
                            {/* ------------------------------------------------------------------------ */}
                            {/* //////////////////////////////////////////////////////////////////////// */}
                            <div className='previouse_medicals_checkbox' >
                                <div className='previouse_medicals_checkbox_text'>
                                    <h4>HEART DISEASE</h4>
                                    <div>
                                        <div>
                                            <p>Yes</p>
                                            <input checked={heartDisease === 'yes' ? true : false} onChange={(e)=> setheartDisease('yes')} type='checkbox' />
                                        </div>
                                        
                                        <div>
                                            <p>No</p>
                                            <input checked={heartDisease === 'no' ? true : false} onChange={(e)=> setheartDisease('no')} type='checkbox' />
                                        </div>
                                    </div>
                                </div>
                                <div className='previouse_medicals_checkbox_text'>
                                    <h4>KIDNEY DISEASE</h4>
                                    <div>
                                        <div>
                                            <p>Yes</p>
                                            <input checked={kidneyDisease === 'yes' ? true : false} onChange={(e)=> setkidneyDisease('yes')} type='checkbox' />
                                        </div>
                                        
                                        <div>
                                            <p>No</p>
                                            <input type='checkbox' checked={kidneyDisease === 'no' ? true : false} onChange={(e)=> setkidneyDisease('no')} />
                                        </div>
                                    </div>
                                </div>
                                <div className='previouse_medicals_checkbox_text'>
                                    <h4>DIABETES</h4>
                                    <div>
                                        <div>
                                            <p>Yes</p>
                                            <input checked={Diabetes === 'yes' ? true : false} onChange={(e)=> setDiabetes('yes')} type='checkbox' />
                                        </div>
                                        
                                        <div>
                                            <p>No</p>
                                            <input checked={Diabetes === 'no' ? true : false} onChange={(e)=> setDiabetes('no')} type='checkbox' />
                                        </div>
                                    </div>
                                </div>
                                <div className='previouse_medicals_checkbox_text'>
                                    <h4>CHEST DISEASE</h4>
                                    <div>
                                        <div>
                                            <p>Yes</p>
                                            <input checked={ChestDisease === 'yes' ? true : false} onChange={(e)=> setChestDisease('yes')} type='checkbox' />
                                        </div>
                                        
                                        <div>
                                            <p>No</p>
                                            <input checked={ChestDisease === 'no' ? true : false} onChange={(e)=> setChestDisease('no')} type='checkbox' />
                                        </div>
                                    </div>
                                </div>
                                <div className='previouse_medicals_checkbox_text'>
                                    <h4>COVID</h4>
                                    <div>
                                        <div>
                                            <p>Yes</p>
                                            <input checked={Covid === 'yes' ? true : false} onChange={(e)=> setCovid('yes')} type='checkbox' />
                                        </div>
                                        
                                        <div>
                                            <p>No</p>
                                            <input checked={Covid === 'no' ? true : false} onChange={(e)=> setCovid('no')} type='checkbox' />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className='patient_details_input_field1_operations'>
                                <div className='patient_details_input_field1_' >
                                    <h4>OPERATIONS</h4>
                                    <input value={NumberOfOperations} onChange={(e)=>setNumberOfOperations(e.target.value)} />
                                </div>
                                <div className='patient_details_input_field1_' >
                                    <h4>PREVIOUS PREGNANCIES TOTAL</h4>
                                    <input value={PreviousePregnancies} onChange={(e)=>setPreviousePregnancies(e.target.value)} />
                                </div>
                                <div className='patient_details_input_field1_' >
                                    <h4>NO. OF LIVING CHILDREN</h4>
                                    <input value={NoOfLivingChildren} onChange={(e)=>setNoOfLivingChildren(e.target.value)} />
                                </div>
                            </div>
                            {/* //////////////////////////////////////////////////////////////////////// */}
                            {/* ------------------------------------------------------------------------ */}
                            {/* //////////////////////////////////////////////////////////////////////// */}
                            <div className='sidebar_spacer' ></div>

                            {/* ===================================================================== */}
                            {/* ||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||| */}
                            {/* ===================================================================== */}

                            <table className='custome_table'>
                                <thead>
                                <tr>
                                    <th>DATE OF BIRTH</th>
                                    <th>DURATION OF PREGNANCY</th>
                                    <th>BIRTH WEIGHT</th>
                                    <th>COMPLICATION IN PREGNANCY</th>
                                    <th>COMPLICATION IN LABOUR</th>
                                    <th>PUER PERIUM</th>
                                    <th>AGE AT DEATH</th>
                                    <th>CAUSE OF DEATH</th>
                                    <th>ACTION</th>
                                </tr>
                                </thead>
                                <tbody>
                                {
                                    formData?.map((row, index) => (
                                    <tr key={index}>
                                    <td><input name='dateOfBirth' value={row.dateOfBirth} onChange={(e) => handleChange(index, e)} type='date' /></td>
                                    <td><input name='durationOfPregnancy' value={row.durationOfPregnancy} onChange={(e) => handleChange(index, e)} placeholder='details' /></td>
                                    <td><input name='birthWeight' value={row.birthWeight} onChange={(e) => handleChange(index, e)} placeholder='details' /></td>
                                    <td><input name='complicationInPregnancy' value={row.complicationInPregnancy} onChange={(e) => handleChange(index, e)} placeholder='details' /></td>
                                    <td><input name='complicationIInLabour' value={row.complicationIInLabour} onChange={(e) => handleChange(index, e)} placeholder='details' /></td>
                                    <td><input name='puerPremium' value={row.puerPremium} onChange={(e) => handleChange(index, e)} placeholder='details' /></td>
                                    <td><input name='ageAtDeath' value={row.ageAtDeath} onChange={(e) => handleChange(index, e)} placeholder='details' /></td>
                                    <td><input name='causeOfDeath' value={row.causeOfDeath} onChange={(e) => handleChange(index, e)} placeholder='details' /></td>
                                    <td>
                                        <button onClick={() => removeRow({ index, opId: row.opId })} className='delete_btn'>Delete</button>
                                    </td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>

                            <div className='custome_table_btn'>
                                <button className='custome_table_btn1' onClick={addRow}>ADD</button>
                                <button className='custome_table_btn2' onClick={handleSubmit}>NEXT</button>
                            </div>
                            
                            {/* ===================================================================== */}
                            {/* ||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||| */}
                            {/* ===================================================================== */}

                            <div className='sidebar_spacer' ></div>

                            {/* //////////////////////////////////////////////////////////////////////// */}
                            {/* ________________________________________________________________________ */}
                            {/* //////////////////////////////////////////////////////////////////////// */}
                            <div className='previouse_medicals_textareas' >
                                <div className='patient_details_input_field1' >
                                    <div className='patient_details_input_field1_'>
                                        <h4>ATTACH LETTER AND SUMMARIES HERE</h4>
                                        <textarea value={letter} onChange={(e)=>setletter(e.target.value)} />
                                    </div>
                                </div>
                                <div className='patient_details_input_field1' >
                                    <div className='patient_details_input_field1_'>
                                        <h4>ATTACH REPORT OF SPECIAL INVESTIGATION HERE</h4>
                                        <textarea value={specialInvestigation} onChange={(e)=>setspecialInvestigation(e.target.value)} />
                                    </div>
                                </div>
                            </div>
                            {/* //////////////////////////////////////////////////////////////////////// */}
                            {/* ________________________________________________________________________ */}
                            {/* //////////////////////////////////////////////////////////////////////// */}
                            
                        
                            {/* //////////////////////////////////////////////////////////////////////// */}
                            {/* ------------------------------------------------------------------------ */}
                            {/* //////////////////////////////////////////////////////////////////////// */}
                            <div className='patient_details_' >
                                <div className='patient_details_input_field1' >
                                <h3>PRIMARY ASSESSMENT</h3>
                                <div className='patient_details_input_field1_' >
                                    <h4>HISTORY OF PREGNANCY</h4>
                                    <input value={historyPreg} onChange={(e)=>sethistoryPreg(e.target.value)} />
                                </div>
                                <div className='patient_details_input_field1_' >
                                    <h4>URINARY SYMPTOMS</h4>
                                    <input value={urinarySymptoms} onChange={(e)=>seturinarySymptoms(e.target.value)} />
                                </div>
                                <div className='patient_details_input_field1_' >
                                    <h4>VOMITING</h4>
                                    <input value={vomiting} onChange={(e)=>setvomiting(e.target.value)} />
                                </div>
                                <div className='patient_details_input_field1_' > 
                                    <h4>VAGINAL DISCHARGE</h4>
                                    <input value={vaginalDischarge} onChange={(e)=>setvaginalDischarge(e.target.value)} />
                                </div>
                            </div>

                            <div className='patient_details_input_field1'>
                                <div className='patient_details_input_field1_' >
                                    <h4>SWELLING OF ANKLES</h4>
                                    <input value={swellingOfAnkles} onChange={(e)=>setswellingOfAnkles(e.target.value)} />
                                </div>
                                <div className='patient_details_input_field1_' >
                                    <h4>BLEEDING</h4>
                                    <input value={bleeding} onChange={(e)=>setbleeding(e.target.value)} />
                                </div>
                                <div className='patient_details_input_field1_' >
                                    <h4>OTHER SYMPTOMS</h4>
                                    <input value={otherSymptoms} onChange={(e)=>setotherSymptoms(e.target.value)} />
                                </div>
                            </div>
                            </div>
                            {/* //////////////////////////////////////////////////////////////////////// */}
                            {/* ------------------------------------------------------------------------ */}
                            {/* //////////////////////////////////////////////////////////////////////// */}
                            <div className='sidebar_spacer' ></div>

                            {/* //////////////////////////////////////////////////////////////////////// */}
                            {/* ------------------------------------------------------------------------ */}
                            {/* //////////////////////////////////////////////////////////////////////// */}
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
                                            <input value={feet} onChange={(e)=>setfeet(e.target.value)} />
                                        </div>
                                        <div className='patient_details_input_field1_in' >
                                            <h4>INS</h4>
                                            <input value={inches} onChange={(e)=>setinches(e.target.value)} />
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
                            {/* //////////////////////////////////////////////////////////////////////// */}
                            {/* ------------------------------------------------------------------------ */}
                            {/* //////////////////////////////////////////////////////////////////////// */}
                            
                            <div className='sidebar_spacer' ></div>
                        
                            <h3>OTHER ABNORMALITIES</h3>

                            {/* //////////////////////////////////////////////////////////////////////// */}
                            {/* ________________________________________________________________________ */}
                            {/* //////////////////////////////////////////////////////////////////////// */}
                            <div className='previouse_medicals_textareas' >
                                <div className='patient_details_input_field1' >
                                    <div className='patient_details_input_field1_'>
                                        <h4>COMMENTS</h4>
                                        <textarea value={comments} onChange={(e)=>setcomments(e.target.value)} />
                                    </div>
                                </div>
                                <div className='patient_details_input_field1' >
                                    <div className='patient_details_input_field1_'>
                                        <h4>PELVIC ASSESSMENT AT 36 WEEKS</h4>
                                        <textarea value={pelvicAssessment} onChange={(e)=>setpelvicAssessment(e.target.value)} />
                                    </div>
                                </div>
                            </div>
                            {/* //////////////////////////////////////////////////////////////////////// */}
                            {/* ________________________________________________________________________ */}
                            {/* //////////////////////////////////////////////////////////////////////// */}
                            
                            <div className='sidebar_spacer' ></div>

                            {/* ===================================================================== */}
                            {/* ||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||| */}
                            {/* ===================================================================== */}

                            <h3>ANTE NATAL RECORDS</h3>
                            
                            <p className='custome_table_guide'>Edit table details, Click Add button to add new table row and Click the button "Save changes" to save</p>
                            <table className='custome_table'>
                                <thead>
                                    <tr>
                                        <th>DATE</th>
                                        <th>HEIGHT OF FUNFUS ABOVE PUBIS</th>
                                        <th>RELATION OF PRESENTING PART TO BRIM</th>
                                        <th>PRESENTATION AND POSITION</th>
                                        <th>FOETAL HEART</th>
                                        <th>URINE</th>
                                        <th>B.P.</th>
                                        <th>WEIGHT</th>
                                        <th>HB</th>
                                        <th>OEDEMA</th>
                                        <th>REMARKS</th>
                                        <th>INITIAL OF EXAMINER</th>
                                        <th>RETURN</th>
                                        <th>ACTION</th>
                                    </tr>
                                </thead>
                                <tbody>                  
                                    {formData1.map((row, index) => (
                                    <tr key={index}>
                                        <td><input name='date' value={row.date} onChange={(e) => handleChange1(index, e)} type='date' /></td>
                                        <td><input name='heightOfFundus' value={row.heightOfFundus} onChange={(e) => handleChange1(index, e)} placeholder='details' /></td>
                                        <td><input name='presentingPartToBrim' value={row.presentingPartToBrim} onChange={(e) => handleChange1(index, e)} placeholder='details' /></td>
                                        <td><input name='presentationAndPosition' value={row.presentationAndPosition} onChange={(e) => handleChange1(index, e)} placeholder='details' /></td>
                                        <td><input name='foetalHeart' value={row.foetalHeart} onChange={(e) => handleChange1(index, e)} placeholder='details' /></td>
                                        <td><input name='urine' value={row.urine} onChange={(e) => handleChange1(index, e)} placeholder='details' /></td>
                                        <td><input name='BP' value={row.BP} onChange={(e) => handleChange1(index, e)} placeholder='details' /></td>
                                        <td><input name='weight' value={row.weight} onChange={(e) => handleChange1(index, e)} placeholder='details' /></td>
                                        <td><input name='HB' value={row.HB} onChange={(e) => handleChange1(index, e)} placeholder='details' /></td>
                                        <td><input name='oedema' value={row.oedema} onChange={(e) => handleChange1(index, e)} placeholder='details' /></td>
                                        <td><input name='remark' value={row.remark} onChange={(e) => handleChange1(index, e)} placeholder='details' /></td>
                                        <td><input name='initialOfExaminer' value={row.initialOfExaminer} onChange={(e) => handleChange1(index, e)} placeholder='details' /></td>
                                        <td><input name='Return' value={row.Return} onChange={(e) => handleChange1(index, e)} placeholder='details' /></td>
                                        <td>
                                        <button onClick={() => removeRow1({index, Id:row?._id})} className='delete_btn'>Delete</button>
                                        </td>
                                    </tr>
                                    ))}
                                </tbody>
                            </table>

                            <div className='custome_table_btn'>
                                <button className='custome_table_btn1' onClick={addRow1}>ADD</button>
                                <button className='custome_table_btn2' onClick={handleSubmit1}>SAVE</button>
                            </div>
                            
                            {/* ===================================================================== */}
                            {/* ||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||| */}
                            {/* ===================================================================== */}

                            <div className='sidebar_spacer' ></div>

                            <div className='previouse_medicals_textareas_NOTE' >
                                <div >
                                    <h4>SPECIAL INSTRUCTIONS</h4>
                                    <textarea value={specialInstruction} onChange={(e)=>setspecialInstruction(e.target.value)} />
                                </div>
                            </div>
                        </>
                    }

                    {
                        patientIndex === 1 &&
                        <LabourChart/>
                    }

                    {
                        patientIndex === 2 &&
                        <BabyVitals/>
                    }
                    
                    <div className='sidebar_spacer' ></div>
                </div>
            : 
            currenIndex === 0 &&
            <div className='dashboard_body'>
                <div className='back_btn_' onClick={handlePrevious}>
                    <FaChevronLeft />
                    <h4>BACK</h4>
                </div>
                <div className='dashboard_body_patient_details_btns'>
                    <button className={currenIndex === 0 && 'dashboard_body_patient_details_btns_'}>PATIENT DETAILS</button>
                    <button onClick={()=>setCurrentIndex(1)} >VITALS</button>
                    <button onClick={()=>setCurrentIndex(2)}>LAB RESULTS</button>
                    {/* <button onClick={()=>setCurrentIndex(3)}>PREVIOUS VISITS</button> */}
                    <button onClick={()=>setCurrentIndex(3)}>PRESCRIPTION</button>
                    <button onClick={()=>setCurrentIndex(5)}>MEDICATION CHART</button>
                    <button onClick={()=>setCurrentIndex(4)}>TRANSACTION HISTORY</button>
                </div>
                <h3>PATIENT RECORDS</h3>

                {
                    Object.keys(changes)?.length > 0 &&
                    <div className='changes_count' >
                        <p>{Object.keys(changes)?.length} Changes detected. Click to save changes</p>
                        <button onClick={handleSave} >SAVE</button>
                    </div>
                }
                 
                <div className='patient_details_' >
                    <div className='patient_details_input_field1' >
                        <div className='patient_details_input_field1_'>
                            <h4>PATIENT NAME</h4>
                            <input value={name} onChange={(e)=> setname(e.target.value)} placeholder='Enter Patient Name' />
                        </div>
                        <div className='patient_details_input_field1_'>
                            <h4>ADDRESS</h4>
                            <input value={address} onChange={(e)=> setaddress(e.target.value)} placeholder='Enter Patient Address' />
                        </div>
                        <div className='patient_details_input_field1_'>
                            <h4>RELIGION</h4>
                            <select value={religion} onChange={(e)=> setreligion(e.target.value)} >
                                <option >Select Religion</option>
                                <option value={'christian'} >Christian</option>
                                <option value={'islam'}>Islam</option>
                                <option value={'other'}>Other</option>
                            </select>
                        </div>
                        <div className='patient_details_input_field1_'>
                            <h4>HOD NO.</h4>
                            <input placeholder='Enter Hod Number' type='number'  value={hop} onChange={(e)=> sethop(e.target.value)}  />
                        </div>
                    </div>

                    <div className='patient_details_input_field1' >
                        <div className='patient_details_input_field1_in_'>
                            <div className='patient_details_input_field1_in' >
                                <h4>DATE OF BIRTH</h4>
                                <input  value={dateOfBirth} onChange={(e)=> setdateOfBirth(e.target.value)}  type='date'/>
                            </div>
                            <div className='patient_details_input_field1_in' >
                                <h4>AGE</h4>
                                <input type='number' placeholder='Enter Patient Age'  value={age} onChange={(e)=> setage(e.target.value)}  />
                            </div>
                            <div className='patient_details_input_field1_'>
                                <h4>AGE TYPE</h4>
                                <select value={AgeType} onChange={(e)=> setAgeType(e.target.value)} >
                                    <option >Select Age Type</option>
                                    <option value={'days'} >days</option>
                                    <option value={'weeks'}>weeks</option>
                                    <option value={'months'}>months</option>
                                    <option value={'years'}>years</option>
                                </select>
                            </div>
                        </div>
                        <div className='patient_details_input_field1_in_'>
                            <div className='patient_details_input_field1_in1' >
                                <div className='previouse_medicals_checkbox_text'>
                                    <h4>SEX</h4>
                                    <div>
                                        <div>
                                            <p>Male</p>
                                            <input checked={sex === 'male' ? true : false} onChange={(e)=> setsex('male')}  type='checkbox' />
                                        </div>
                                        
                                        <div>
                                            <p>Female</p>
                                            <input checked={sex === 'female' ? true : false} onChange={(e)=> setsex('female')} type='checkbox' />
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className='patient_details_input_field1_in' >
                                <h4>PATIENT PHONE NUMBER</h4>
                                <input type='number' placeholder='Enter Patient Phone Number'  value={phone} onChange={(e)=> setphone(e.target.value)}  />
                            </div>
                        </div>
                        <div className='patient_details_input_field1_in_'>
                            <div className='patient_details_input_field1_in' >
                                <h4>NEXT OF KIN</h4>
                                <input placeholder='Enter Next Kin'  value={nextOfKin} onChange={(e)=> setnextOfKin(e.target.value)}  />
                            </div>
                            <div className='patient_details_input_field1_in' >
                                <h4>NEXT OF KIN PHONE NUMBER</h4>
                                <input type='number' placeholder='Enter Next of kin Phone Number'  value={nextOfKinPhone} onChange={(e)=> setnextOfKinPhone(e.target.value)}  />
                            </div>
                        </div>
                    </div>
                </div>

                
                <div className='previouse_medicals_textareas_NOTE' >
                    <div >
                        <h4>CLINICAL NOTES</h4>
                        <textarea placeholder='Enter Clinical Notes'  value={notes} onChange={(e)=>setnotes(e.target.value)} />
                    </div>
                </div>
            </div>
        }

        {
            currenIndex === 1 &&
            <Vitals handleBack={handleBack} currenIndex={currenIndex} setCurrentIndex={setCurrentIndex} />
        }

        {
            currenIndex === 2 &&
            <LabResult handleBack={handleBack} currenIndex={currenIndex} setCurrentIndex={setCurrentIndex} />
        }

        {
            currenIndex === 3 &&
            <Prescriptions admin={admin} handleBack={handleBack} currenIndex={currenIndex} setCurrentIndex={setCurrentIndex} />
        }

        {
            currenIndex === 4 &&
            <TransactionHistory handleBack={handleBack} currenIndex={currenIndex} setCurrentIndex={setCurrentIndex} />
        }
        
        {
            currenIndex === 5 &&
            <Medications currentIndex={currenIndex} setcurrentIndex={setCurrentIndex} handleBack={handleBack}/>
        }
    </>
  )
}

export default PatientDetails