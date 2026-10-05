import React, { useEffect, useState } from 'react'
import axios from 'axios'
import "jspdf-autotable";
import { generatePaymentReportPDF } from './Generate'
import MonthAudit from './MonthAudit';
import { useMemo } from 'react';


function Audits({setenddate1, setdate1, getPending1, setsort1, getPatient1, handlePeriodByMonth1}) {
  const cip = window.location.hostname

    const [expenses, setexpenses] = useState([])
    const [getComplete, setgetComplete] = useState([])
    const [pending, setpending] = useState([])
    const [awaiting, setawaiting] = useState([])
    const [debtors, setdebtors] = useState([])
    const [getPatient, setgetPatient] = useState([])
    const [mode, setmode] = useState('')
    const [date, setdate] = useState('')
    const [enddate, setenddate] = useState('')
    const [xdate, setxdate] = useState('')
    const [staffs, setstaffs] = useState([])
    const [staff, setstaff] = useState('')
    const [status, setstatus] = useState('PAID')
    

    useEffect(()=>{
        setpending(getPending1)
    },[getPending1])

    useEffect(()=>{
        const toady = new Date()
        const formattedDate = toady.toISOString().split('T')[0]
        setxdate(formattedDate)
        const setToday = new Date().setHours(0, 0, 0, 0)
        const now = Date.now()
        setdate(setToday);
        setenddate(now);
    },[])

    const [sort, setsort] = useState('')
    const [categories, setcategories] = useState('')

    const [isLoadingData, setIsLoadingData] = useState(false);
    const [isCalculating, setIsCalculating] = useState(false);

    const isBusy = isLoadingData || isCalculating;

    useEffect(() => {
        const controller = new AbortController();

        const fetchAuditData = async () => {
            // Don't make request until dates exist
            if (!date || !enddate) return;

            setIsLoadingData(true);

            try {
                const res = await axios.post(
                    `http://${cip || 'localhost'}:7700/audit`,
                    {
                        unix: date,
                        eunix: enddate,
                        sorts: sort,
                        serviceCategory: categories,
                        mode,
                        staff
                    },
                    {
                        signal: controller.signal
                    }
                );

                if (res.data.status === 'success') {
                    setgetPatient(res.data.getPatients || []);

                    if(sort === 'service'){
                        setgetComplete(res.data.bills || []);
                    }else{
                        setgetComplete(res.data.paidBlls || []);
                    }

                    setexpenses(res.data.expense || []);
                    setstaffs(res.data.staffs || []);
                    setdebtors(res.data.debtBills || []);
                    setawaiting(res.data.pharmBills || []);
                }
                // console.log('Audit data fetched successfully:', res.data);

            } catch (error) {
                if (error.name !== 'CanceledError' && error.name !== 'AbortError') {
                    console.error('Error fetching audit data:', error);
                }
            } finally {
                if (!controller.signal.aborted) {
                    setIsLoadingData(false);
                }
            }
        };

        fetchAuditData();

        return () => controller.abort();

    }, [date, enddate, cip, sort, mode, staff, categories]);

    const handleDate = (e) => {
        const raw = e.target.value;
        setxdate(raw);

        const start = new Date(raw);
        const end = new Date(raw);
        end.setHours(23, 59, 59, 999);

        setdate(start.getTime());
        setenddate(end.getTime());
    };

    const [totalPrice, setTotalPrice] = useState(0)
    const [totalPrice1, setTotalPrice1] = useState(0)
    const [totalPrice2, setTotalPrice2] = useState(0)
    const [totalPrice3, setTotalPrice3] = useState(0)

    useEffect(() => {
        let cancelled = false;

        setIsCalculating(true);

        const calculateTotals = () => {

            if (cancelled) return;

            // =========================
            // COMPLETED
            // =========================

            let total = 0;

            getComplete?.forEach((entry) => {
                try {
                    const parsed = JSON.parse(entry.services);

                    if (Array.isArray(parsed)) {

                        parsed.forEach(service => {
                            if (service.totalPrice) {
                                total += service.totalPrice;
                            } else if (service.price) {
                                total += service.price;
                            }
                        });

                    } else if (parsed && typeof parsed === 'object') {

                        if (parsed.totalPrice) {
                            total += parsed.totalPrice;
                        } else if (parsed.actualPrice) {
                            total += parsed.actualPrice;
                        } else if (parsed.price) {
                            total += parsed.price;
                        }
                    }

                } catch (e) {
                    console.warn(
                        `Invalid JSON in services for ID ${entry._id}`
                    );
                }
            });

            setTotalPrice(total);


            // =========================
            // PENDING
            // =========================

            let total1 = 0;

            pending?.forEach((entry) => {
                try {
                    const parsed = JSON.parse(entry.services);

                    if (Array.isArray(parsed)) {

                        parsed.forEach(service => {
                            if (service.totalPrice) {
                                total1 += service.totalPrice;
                            } else if (service.price) {
                                total1 += service.price;
                            }
                        });

                    } else if (parsed && typeof parsed === 'object') {

                        if (parsed.totalPrice) {
                            total1 += parsed.totalPrice;
                        } else if (parsed.actualPrice) {
                            total1 += parsed.actualPrice;
                        } else if (parsed.price) {
                            total1 += parsed.price;
                        }
                    }

                } catch (e) {
                    console.warn(
                        `Invalid JSON in services for ID ${entry._id}`
                    );
                }
            });

            setTotalPrice1(total1);


            // =========================
            // AWAITING
            // =========================

            let total2 = 0;

            awaiting?.forEach((entry) => {
                try {
                    const parsed = JSON.parse(entry.services);

                    if (Array.isArray(parsed)) {

                        parsed.forEach(service => {
                            if (service.totalPrice) {
                                total2 += service.totalPrice;
                            } else if (service.price) {
                                total2 += service.price;
                            }
                        });

                    } else if (parsed && typeof parsed === 'object') {

                        if (parsed.totalPrice) {
                            total2 += parsed.totalPrice;
                        } else if (parsed.actualPrice) {
                            total2 += parsed.actualPrice;
                        } else if (parsed.price) {
                            total2 += parsed.price;
                        }
                    }

                } catch (e) {
                    console.warn(
                        `Invalid JSON in services for ID ${entry._id}`
                    );
                }
            });

            setTotalPrice2(total2);


            // =========================
            // DEBTORS
            // =========================

            let total3 = 0;

            debtors?.forEach((entry) => {
                try {
                    const parsed = JSON.parse(entry.services);

                    if (Array.isArray(parsed)) {

                        parsed.forEach(service => {
                            if (service.totalPrice) {
                                total3 += service.totalPrice;
                            } else if (service.price) {
                                total3 += service.price;
                            }
                        });

                    } else if (parsed && typeof parsed === 'object') {

                        if (parsed.totalPrice) {
                            total3 += parsed.totalPrice;
                        } else if (parsed.actualPrice) {
                            total3 += parsed.actualPrice;
                        } else if (parsed.price) {
                            total3 += parsed.price;
                        }
                    }

                } catch (e) {
                    console.warn(
                        `Invalid JSON in services for ID ${entry._id}`
                    );
                }
            });

            setTotalPrice3(total3);

            if (!cancelled) {
                setIsCalculating(false);
            }
        };

        // Give React/browser time to display "Calculating..."
        const timer = setTimeout(calculateTotals, 0);

        return () => {
            cancelled = true;
            clearTimeout(timer);
        };

    }, [getComplete, pending, awaiting, debtors]);



    // ============================================================= //
    // ||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||| //
    // ============================================================= //

    // ============================================================= //
    // ||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||| //
    // ============================================================= //
    
    const totalFormatted = new Intl.NumberFormat('en-NG', {
        style: 'currency',
        currency: 'NGN',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    })
    

    const handlePeriod =(e) => {
        const raw = e.target.value;
        const now = Date.now()

        const DaysAgo = now - raw * 24 * 60 * 60 * 1000

        setdate(DaysAgo);
        setenddate(now);
        setdate1(DaysAgo);
        setenddate1(now);
    }

    const handleService=(e)=>{
        setsort(e.target.value)
    }

    const handleService1=(e)=>{
        setcategories(e.target.value)
    }


    const handlePeriodByyEAR = async(e) => {
       const year = Number(e.target.value); // e.g., 2025 selected from dropdown

        // Define full year range
        const start = new Date(year, 0, 1).getTime(); // Jan 1, 00:00
        const end = new Date(year, 11, 31, 23, 59, 59, 999).getTime(); // Dec 31, 23:59:59

        setdate(start);
        setenddate(end);
        setsort(prev => prev); // keep sort value unchanged

        setIsLoadingData(true);

        try {
            const res = await axios.post(`http://${cip || 'localhost'}:7700/audit/year`, { year, sorts: sort, id: staff });
            if (res.data.status === 'success') {
                setgetPatient(res.data.patients);
                setgetComplete(res.data.paidBills);
                setexpenses(res.data.expense);
                setstaffs(res.data.staffs)
                // setpending(res.data.pendingBills)
                setdebtors(res.data.debtBills)
                setawaiting(res.data.pharmBills)
            }
        } catch (err) {
            console.error('Error fetching yearly data:', err);
        }finally {
            setIsLoadingData(false);
        }
    };

  
    const [cardTotal, setcardTotal] = useState()
    const [consultationTotal, setconsultationTotal] = useState()
    const [othersTotal, setothersTotal] = useState()
    const [utilsTotal, setutilsTotal] = useState()
    const [consumeTotal, setconsumeTotal] = useState()
    const [docTotal, setdocTotal] = useState()
    const [churchTotal, setchurchTotal] = useState()

  
    const [cardTotal1, setcardTotal1] = useState()
    const [consultationTotal1, setconsultationTotal1] = useState()
    const [othersTotal1, setothersTotal1] = useState()
    const [utilsTotal1, setutilsTotal1] = useState()
    const [consumeTotal1, setconsumeTotal1] = useState()
    const [docTotal1, setdocTotal1] = useState()
    const [churchTotal1, setchurchTotal1] = useState()

  
    const [cardTotal2, setcardTotal2] = useState()
    const [consultationTotal2, setconsultationTotal2] = useState()
    const [othersTotal2, setothersTotal2] = useState()
    const [utilsTotal2, setutilsTotal2] = useState()
    const [consumeTotal2, setconsumeTotal2] = useState()
    const [docTotal2, setdocTotal2] = useState()
    const [churchTotal2, setchurchTotal2] = useState()
  
    const [cardTotal3, setcardTotal3] = useState()
    const [consultationTotal3, setconsultationTotal3] = useState()
    const [othersTotal3, setothersTotal3] = useState()
    const [utilsTotal3, setutilsTotal3] = useState()
    const [consumeTotal3, setconsumeTotal3] = useState()
    const [docTotal3, setdocTotal3] = useState()
    const [churchTotal3, setchurchTotal3] = useState()

    const [Total, setTotal] = useState()
    
    useEffect(()=>{
        let fsttotal = 0
        expenses?.forEach(obj =>{ 
            fsttotal += obj.approve;
        })
        
        setTotal(fsttotal)
    },[expenses])
    
    useEffect(()=>{
        let fsttotal = 0
        let sectotal = 0
        let trdtotal = 0
        let frttotal = 0
        let fiftotal = 0
        let sixtotal = 0
        let sevtotal = 0

        getComplete?.forEach(obj =>{
            const items = typeof obj.services === "string"
                    ? JSON.parse(obj.services)
                    : obj.services;
            
            items?.items?.forEach(item => {
                const name = item?.name ? item?.name?.toLowerCase() : item?.drugs?.toLowerCase()
                
                if(name.includes('card')){
                    fsttotal += item?.totalPrice
                }else if(name.includes('consultation')){
                    sectotal += item?.totalPrice
                }else if(items?.profit === 0 && items?.actualPrice === 0){
                    frttotal += item?.price * item?.quantity
                }else if(items?.profit !== 0 && items?.actualPrice !== 0 && sort === 'consumables'){
                    fiftotal += item?.price * item?.quantity
                }else if(sort === 'drugs' && item?.day){
                    sixtotal += item?.totalPrice
                }else{
                    if (item.totalPrice) {
                        trdtotal += item.totalPrice;
                    } else if (item.actualPrice) {
                        trdtotal += item.actualPrice;
                    } else if (item.price) {
                        trdtotal += item.price * item?.quantity;
                    }
                }
            })
        })
        
        setcardTotal(fsttotal)
        setutilsTotal(frttotal)
        setconsumeTotal(fiftotal)
        setconsultationTotal(sectotal)
        setothersTotal(trdtotal)
        setdocTotal(sixtotal)
        setchurchTotal(sevtotal)
    },[getComplete, sort])
    
    useEffect(()=>{
        let fsttotal = 0
        let sectotal = 0
        let trdtotal = 0
        let frttotal = 0
        let fiftotal = 0
        let sixtotal = 0
        let sevtotal = 0

        pending?.forEach(obj =>{
            const items = typeof obj.services === "string"
                    ? JSON.parse(obj.services)
                    : obj.services;
            
            items?.items?.forEach(item => {
                const name = item?.name ? item?.name?.toLowerCase() : item?.drugs?.toLowerCase()
                
                if(name.includes('card')){
                    fsttotal += item?.totalPrice
                }else if(name.includes('consultation')){
                    sectotal += item?.totalPrice
                }else if(items?.profit === 0 && items?.actualPrice === 0){
                    frttotal += item?.price * item?.quantity
                }else if(items?.profit !== 0 && items?.actualPrice !== 0 && sort === 'consumables'){
                    fiftotal += item?.price * item?.quantity
                }else if(sort === 'drugs' && item?.day){
                    sixtotal += item?.totalPrice
                }else{
                    if (item.totalPrice) {
                        trdtotal += item.totalPrice;
                    } else if (item.actualPrice) {
                        trdtotal += item.actualPrice;
                    } else if (item.price) {
                        trdtotal += item.price * item?.quantity;
                    }
                }
            })
        })
        
        setcardTotal1(fsttotal)
        setutilsTotal1(frttotal)
        setconsumeTotal1(fiftotal)
        setconsultationTotal1(sectotal)
        setothersTotal1(trdtotal)
        setdocTotal1(sixtotal)
        setchurchTotal1(sevtotal)
    },[pending, sort, status])
    
    useEffect(()=>{
        let fsttotal = 0
        let sectotal = 0
        let trdtotal = 0
        let frttotal = 0
        let fiftotal = 0
        let sixtotal = 0
        let sevtotal = 0

        awaiting?.forEach(obj =>{
            const items = typeof obj.services === "string"
                    ? JSON.parse(obj.services)
                    : obj.services;

            items?.items?.forEach(item => {
                const name = item?.name ? item?.name?.toLowerCase() : item?.drugs?.toLowerCase()
                
                if(name.includes('card')){
                    fsttotal += item?.totalPrice
                }else if(name.includes('consultation')){
                    sectotal += item?.totalPrice
                }else if(items?.profit === 0 && items?.actualPrice === 0){
                    frttotal += item?.price * item?.quantity
                }else if(items?.profit !== 0 && items?.actualPrice !== 0 && sort === 'consumables'){
                    fiftotal += item?.price * item?.quantity
                }else if(sort === 'drugs' && item?.day){
                    sixtotal += item?.totalPrice
                }else{
                    if (item.totalPrice) {
                        trdtotal += item.totalPrice;
                    } else if (item.actualPrice) {
                        trdtotal += item.actualPrice;
                    } else if (item.price) {
                        trdtotal += item.price * item?.quantity;
                    }
                }
            })
        })
        
        setcardTotal2(fsttotal)
        setutilsTotal2(frttotal)
        setconsumeTotal2(fiftotal)
        setconsultationTotal2(sectotal)
        setothersTotal2(trdtotal)
        setdocTotal2(sixtotal)
        setchurchTotal2(sevtotal)
    },[awaiting, sort, status])
    
    useEffect(()=>{
        let fsttotal = 0
        let sectotal = 0
        let trdtotal = 0
        let frttotal = 0
        let fiftotal = 0
        let sixtotal = 0
        let sevtotal = 0

        debtors?.forEach(obj =>{
            const items = typeof obj.services === "string"
                ? JSON.parse(obj.services)
                : obj.services;

            items?.items?.forEach(item => {
                const name = item?.name ? item?.name?.toLowerCase() : item?.drugs?.toLowerCase()
                
                if(name.includes('card')){
                    fsttotal += item?.totalPrice
                }else if(name.includes('consultation')){
                    sectotal += item?.totalPrice
                }else if(items?.profit === 0 && items?.actualPrice === 0){
                    frttotal += item?.price * item?.quantity
                }else if(items?.profit !== 0 && items?.actualPrice !== 0 && sort === 'consumables'){
                    fiftotal += item?.price * item?.quantity
                }else if(sort === 'drugs' && item?.day){
                    sixtotal += item?.totalPrice
                }else{
                    if (item.totalPrice) {
                        trdtotal += item.totalPrice;
                    } else if (item.actualPrice) {
                        trdtotal += item.actualPrice;
                    } else if (item.price) {
                        trdtotal += item.price * item?.quantity;
                    }
                }
            })
        })
        
        setcardTotal3(fsttotal)
        setutilsTotal3(frttotal)
        setconsumeTotal3(fiftotal)
        setconsultationTotal3(sectotal)
        setothersTotal3(trdtotal)
        setdocTotal3(sixtotal)
        setchurchTotal3(sevtotal)
    },[debtors, sort, status])

    const serviceCategoryTotal = useMemo(() => {
        if (sort !== 'service') return 0;

        return (getComplete || []).reduce((grandTotal, bill) => {
            let services = bill?.services;

            try {
                if (typeof services === 'string') {
                    services = JSON.parse(services);
                }
            } catch {
                return grandTotal;
            }

            if (!Array.isArray(services)) return grandTotal;

            const billTotal = services.reduce((total, service) => {
                const price = Number(service?.totalPrice ?? service?.price ?? 0);
                const quantity = Number(service?.quantity ?? 1);

                // If totalPrice already represents the line total,
                // don't multiply it again.
                const amount = service?.totalPrice != null
                    ? price
                    : price * quantity;

                return total + (Number.isFinite(amount) ? amount : 0);
            }, 0);

            return grandTotal + billTotal;
        }, 0);
    }, [getComplete, sort]);

    const displayTotal =
    sort === 'service'
        ? serviceCategoryTotal
        : status === 'PAID'
        ? totalPrice
        : status === 'PENDING'
        ? totalPrice1
        : status === 'AWAITING'
        ? totalPrice2
        : totalPrice3;

    const currentYear = new Date().getFullYear();
    const startYear = 2025; // or the first year your app started saving data
    const years = [];

    for (let y = currentYear; y >= startYear; y--) {
        years.push(y);
    }

    const income = totalPrice
    const income1 = totalPrice1
    const income2 = totalPrice2
    const expense = Total
    const profit = income - expense
    const expense1 = 0
    const profit1 = 0
    const expense2 = 0
    const profit2 = 0

    const handleDownload = () => {
        console.log(status);
        
        if(status === 'PAID'){
           return generatePaymentReportPDF(getComplete, getPatient, sort, totalFormatted, cardTotal, consultationTotal, othersTotal, utilsTotal, consumeTotal, docTotal, churchTotal, income, expense, profit, status);
        }
        
        if(status === 'PENDING'){
           return generatePaymentReportPDF(pending, getPatient, sort, totalFormatted, cardTotal, consultationTotal, othersTotal, utilsTotal, consumeTotal, docTotal, churchTotal, income1, expense1, profit1, status);
        }
        
        if(status === 'AWAITING'){
            return generatePaymentReportPDF(awaiting, getPatient, sort, totalFormatted, cardTotal, consultationTotal, othersTotal, utilsTotal, consumeTotal, docTotal, churchTotal, income2, expense2, profit2, status);
        }
        
        if(status === 'DEBTORS'){
            return generatePaymentReportPDF(debtors, getPatient, sort, totalFormatted, cardTotal, consultationTotal, othersTotal, utilsTotal, consumeTotal, docTotal, churchTotal, totalPrice3, expense2, profit2, status);
        }
    };
    
    const handleStaff = async(e) => {
        const staff = e.target.value

        setstaff(staff);
        // Then fetch uses effect or you can call manually:
        await axios.post(`http://${cip || 'localhost'}:7700/audit`, {staff, unix: date, eunix: enddate, sorts: sort, mode})
        .then(res => {
            console.log(res);
            
            if (res.data.status === 'success') {
                setgetPatient(res.data.patients);
                setgetComplete(res.data.paidBills);
                setstaffs(res.data.staffs)
                // setpending(res.data.pendingBills)
                setawaiting(res.data.pharmBills)
                setdebtors(res.data.debtBills)
            }
        });
    }; 

    const handleStatus =async(e)=>{
        setstatus(e.target.value)
    }

    const [searchText, setsearchText] = useState('')
    const serviceCategoryNames = {
        BLOOD: 'Blood Service',
        OXYGEN: 'Oxygen Services',
        PROFESSIONAL: 'Professional Fees',
        NURSING: 'Nursing Care',
        BED: 'Bed Fees',
        'DELIVERY FEES': 'Delivery Fees',
        'PROCEDURE FEES': 'Procedure Fees',
        discount: 'Discount'
    };

    const serviceNames = {
        '': 'All Services',
        drugs: 'Drugs',
        utils: 'Utilities',
        consumables: 'Consumables',
        cards: 'Cards',
        consultation: 'Consultations',
        lab: 'Tests',
        scan: 'Scans',
        payout: 'Pay Outs',
        CHURCH: 'Church',
        service: 'Services'
    };

    const statusNames = {
        PAID: 'Paid',
        PENDING: 'Pending',
        DEBTORS: 'Debtors',
        AWAITING: 'Pharmacy'
    };

    const activeServiceName =
        sort === 'service'
            ? serviceCategoryNames[categories] || 'All Service Categories'
            : serviceNames[sort] || 'All Services';

    const currentData =
        sort === 'service'
            ? getComplete
            : status === 'PAID'
            ? getComplete
            : status === 'PENDING'
            ? pending
            : status === 'AWAITING'
            ? awaiting
            : status === 'DEBTORS'
            ? debtors
            : [];

    const auditTransactionCount = currentData?.length || 0;

    const data = getComplete?.length > 0 ? getComplete : pending?.length > 0 ? pending : awaiting?.length > 0 ? awaiting : debtors?.length > 0 ? debtors : []


    const [filteredData, setfilteredData] = useState([])

    const normalizedOrders = useMemo(() => {
    return data.map(order => ({
        ...order,
        serviceItems: (() => {
        try {
            if (!order.services) return [];

            if (typeof order.services === "object") {
            return Array.isArray(order.services.items)
                ? order.services.items
                : [];
            }

            const parsed = JSON.parse(order.services);
            return Array.isArray(parsed.items) ? parsed.items : [];
        } catch {
            return [];
        }
        })()
    }));
    }, [data]);


    const handleFiltered = () => {
        const query = searchText.trim().toLowerCase();

        // If the search box is empty, show all orders
        if (!query) {
            setfilteredData(normalizedOrders);
            return;
        }

        // Search through the service items in each order
        const result = normalizedOrders.filter(order => {
            const serviceItems = order?.serviceItems;

            if (!Array.isArray(serviceItems)) {
                return false;
            }

            return serviceItems.some(item => {
                const itemName = String(item?.name || '').toLowerCase();

                return itemName.includes(query);
            });
        });

        setfilteredData(result);
    };


    // console.log(getComplete);
    const [currentPage, setCurrentPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    
    // =========================
    // FRONTEND TABLE PAGINATION
    // =========================

    const getPaginationSource = () => {
        // Keep the same logic your table currently uses

        if (filteredData?.length > 0) {
            return filteredData;
        }

        if (status === 'PAID') {
            return getComplete || [];
        }

        if (status === 'PENDING') {
            return pending || [];
        }

        if (status === 'AWAITING') {
            return awaiting || [];
        }

        if (status === 'DEBTORS') {
            return debtors || [];
        }

        return [];
    };  

    const paginationSource = getPaginationSource();

    const sortedPaginationSource = [...paginationSource].sort(
        (a, b) => Number(b?.timeStamp || 0) - Number(a?.timeStamp || 0)
    );

    const totalPages = Math.ceil(
        sortedPaginationSource.length / rowsPerPage
    );

    const startIndex = (currentPage - 1) * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;

    const paginatedData = sortedPaginationSource.slice(
        startIndex,
        endIndex
    );

    // Keep page valid when data/filter/status changes
    useEffect(() => {
        setCurrentPage(1);
    }, [
        status,
        sort,
        categories,
        mode,
        staff,
        date,
        enddate,
        filteredData.length,
        getComplete.length,
        pending.length,
        awaiting.length,
        debtors.length
    ]);

    useEffect(() => {
        if (currentPage > totalPages && totalPages > 0) {
            setCurrentPage(totalPages);
        }
    }, [currentPage, totalPages]);

    
  return (
        <div style={{width:'100%'}} >
            <h3>COMPLETED TRANSACTION HISTORY</h3>

            {/* <div style={{display:'flex', alignItems:'center', width:'100%'}}>
                <div className='patient_details_input_field1_in_' >
                    <div className='patient_details_input_field1_' style={{margin:'0 5px'}}>
                        <h4>CHOOSE DATE</h4>
                        <input value={xdate} onChange={handleDate} type='date' />
                    </div>  
                    <div className='patient_details_input_field1_' style={{margin:'0 5px'}}>
                        <h4>CHOOSE PERIOD</h4>
                        <select onChange={handlePeriod} >
                            <option value={7} >SELECT PERIOD</option>
                            <option value={7} >LAST WEEK</option>
                            <option value={31} >LAST MONTH </option>
                            <option value={62}>LAST TWO MONTH</option>
                            <option value={186}>LAST SIX MONTHS</option>
                            <option value={356}>YEAR</option>
                        </select>
                    </div>

                    <MonthAudit setdebtors={setdebtors} setdate={setdate} setenddate={setenddate} setsort={setsort} setdate1={setdate1} setenddate1={setenddate1} setsort1={setsort1} setgetPatient={setgetPatient} setgetComplete={setgetComplete} setexpenses={setexpenses} setstaffs={setstaffs} setpending={setpending} setawaiting={setawaiting} sort={sort} staff={staff} handlePeriodByMonth1={handlePeriodByMonth1} />
                    
                    <div className='patient_details_input_field1_' style={{margin:'0 5px'}}>
                        <h4>CHOOSE STAFF</h4>
                        <select onChange={handleStaff} >
                            <option value={''} >SELECT STAFF</option>
                            {
                                staffs?.length > 0 &&
                                staffs?.map((itm, i)=>(
                                    <option value={itm?._id} key={i} >{itm?.name}</option>
                                ))
                            }
                        </select>
                    </div>
                    
                </div>
                
                <div className='patient_details_input_field1_in_'>
                    
                    <div className='patient_details_input_field1_' style={{margin:'0 5px'}}>
                        <h4>CHOOSE YEAR</h4>
                        <select onChange={handlePeriodByyEAR} >
                            <option>CHOOSE YEAR</option>
                             {years?.map((year) => (
                                <option key={year} value={year}>
                                {year}
                                </option>
                            ))}
                        </select>
                    </div>
                    
                    <div className='patient_details_input_field1_' style={{margin:'0 5px'}}>
                        <h4>CHOOSE SERVICES</h4>
                        <select onChange={handleService} >
                            <option value={''}>ALL</option>
                            <option value={'drugs'} >DRUGS</option>
                            <option value={'utils'}>UTILITIES </option>
                            <option value={'consumables'}>CONSUMABLES</option>
                            <option value={'cards'}>CARDS</option>
                            <option value={'consultation'}>CONSULTATIONS</option>
                            <option value={'lab'} >TESTS</option>
                            <option value={'scan'}>SCANS</option>
                            <option value={'payout'}>PAY OUTS</option>
                            <option value={'CHURCH'}>CHURCH</option>
                            <option value={'service'}>SERVICES</option>
                        </select>
                    </div>
                    
                    {
                        sort === 'service' &&
                        <div className='patient_details_input_field1_' style={{margin:'0 5px'}}>
                            <h4>CHOOSE CATEGORIES</h4>
                            <select onChange={handleService1} >
                                <option value={''}>ALL</option>
                                <option value={'BLOOD'}>BLOOD SERVICE</option>
                                <option value={'OXYGEN'}>OXYGEN SERVICES</option>
                                <option value={'PROFESSIONAL'}>PROFESSIONAL FEES</option>
                                <option value={'NURSING'}>NURSING CARE</option>
                                <option value={'BED'}>BED FEES</option>
                                <option value={'DELIVERY FEES'}>DELIVERY FEES</option>
                                <option value={'PROCEDURE FEES'}>PROCEDURE FEES</option>
                                <option value={'discount'}>DISCOUNT</option>
                            </select>
                        </div>
                    }

                    <div className='patient_details_input_field1_' style={{margin:'0 5px'}}>
                        <h4>MODE OF PAYMENT</h4>
                        <select onChange={(e)=> setmode(e.target.value)} >
                            <option value={''}>ALL</option>
                            <option value={'pos'} >POS</option>
                            <option value={'transfer'}>TRANSFER </option>
                            <option value={'cash'}>CASH</option>
                        </select>
                    </div>

                    <div className='patient_details_input_field1_' style={{margin:'0 5px'}}>
                        <h4>CHOOSE STATUS</h4>
                        <select onChange={handleStatus} >
                            <option value={'PAID'} >PAID</option>
                            <option value={'PENDING'}>PENDING </option>
                            <option value={'DEBTORS'}>DEBTORS </option>
                            <option value={'AWAITING'}>PHARMACY</option>
                        </select>
                    </div>

                </div>
            </div> */}

            

            
            {/* <div style={{display:'flex', alignItems:'center', width:'100%', marginTop:'30px'}}>
                <button onClick={handleDownload} className={'dashboard_body_patient_details_btns_'} style={{}}>DOWNLOAD</button>          

                <div style={{display:'flex', margin:'0 20px', alignItems:'center'}} >
                    <input style={{padding:'15px'}} value={searchText} onChange={(e)=> setsearchText(e.target.value)} placeholder='Enter Search' />
                    <button style={{padding:'15px'}} onClick={handleFiltered} >SEARCH</button>
                </div>      
            </div> */}

            <div className="audit-page">

                {/* HEADER */}
                <div className="audit-header">
                    <div>
                        <span className="audit-eyebrow">FINANCIAL MANAGEMENT</span>
                        <h2>Audit & Transactions</h2>
                        <p>
                            Review, filter and analyze transaction activity across the facility.
                        </p>
                    </div>

                    <button
                        onClick={handleDownload}
                        className="audit-download-btn"
                    >
                        <span>↓</span>
                        Download Report
                    </button>
                </div>


                {/* FILTER PANEL */}
                <div className="audit-filter-card">

                    <div className="audit-filter-heading">
                        <div>
                            <h3>Filter Transactions</h3>
                            <p>Choose the criteria you want to review.</p>
                        </div>

                        <div className="audit-filter-status">
                            <span className="audit-status-dot"></span>
                            Filters Active
                        </div>
                    </div>


                    <div className="audit-filter-grid">

                        {/* DATE */}
                        <div className="audit-field">
                            <label>DATE</label>
                            <input
                                value={xdate}
                                onChange={handleDate}
                                type="date"
                            />
                        </div>


                        {/* PERIOD */}
                        <div className="audit-field">
                            <label>PERIOD</label>
                            <select onChange={handlePeriod}>
                                <option value={7}>SELECT PERIOD</option>
                                <option value={7}>LAST WEEK</option>
                                <option value={31}>LAST MONTH</option>
                                <option value={62}>LAST TWO MONTHS</option>
                                <option value={186}>LAST SIX MONTHS</option>
                                <option value={356}>YEAR</option>
                            </select>
                        </div>


                        {/* MONTH */}
                        <div className="audit-field audit-month-field">
                            <label>MONTH</label>

                            <MonthAudit
                                setdebtors={setdebtors}
                                setdate={setdate}
                                setenddate={setenddate}
                                setsort={setsort}
                                setdate1={setdate1}
                                setenddate1={setenddate1}
                                setsort1={setsort1}
                                setgetPatient={setgetPatient}
                                setgetComplete={setgetComplete}
                                setexpenses={setexpenses}
                                setstaffs={setstaffs}
                                setpending={setpending}
                                setawaiting={setawaiting}
                                sort={sort}
                                staff={staff}
                                handlePeriodByMonth1={handlePeriodByMonth1}
                            />
                        </div>


                        {/* STAFF */}
                        <div className="audit-field">
                            <label>STAFF</label>
                            <select onChange={handleStaff}>
                                <option value="">ALL STAFF</option>

                                {staffs?.map((itm, i) => (
                                    <option value={itm?._id} key={i}>
                                        {itm?.name}
                                    </option>
                                ))}
                            </select>
                        </div>


                        {/* YEAR */}
                        <div className="audit-field">
                            <label>YEAR</label>
                            <select onChange={handlePeriodByyEAR}>
                                <option>CHOOSE YEAR</option>

                                {years?.map((year) => (
                                    <option key={year} value={year}>
                                        {year}
                                    </option>
                                ))}
                            </select>
                        </div>


                        {/* SERVICE */}
                        <div className="audit-field">
                            <label>SERVICE TYPE</label>
                            <select onChange={handleService}>
                                <option value="">ALL SERVICES</option>
                                <option value="drugs">DRUGS</option>
                                <option value="utils">UTILITIES</option>
                                <option value="consumables">CONSUMABLES</option>
                                <option value="cards">CARDS</option>
                                <option value="consultation">CONSULTATIONS</option>
                                <option value="lab">TESTS</option>
                                <option value="scan">SCANS</option>
                                <option value="payout">PAY OUTS</option>
                                <option value="CHURCH">CHURCH</option>
                                <option value="service">SERVICES</option>
                            </select>
                        </div>


                        {/* CATEGORY */}
                        {sort === 'service' && (
                            <div className="audit-field audit-category-field">
                                <label>SERVICE CATEGORY</label>

                                <select onChange={handleService1}>
                                    <option value="">ALL CATEGORIES</option>
                                    <option value="BLOOD">BLOOD SERVICE</option>
                                    <option value="OXYGEN">OXYGEN SERVICES</option>
                                    <option value="PROFESSIONAL">
                                        PROFESSIONAL FEES
                                    </option>
                                    <option value="NURSING">NURSING CARE</option>
                                    <option value="BED">BED FEES</option>
                                    <option value="DELIVERY FEES">
                                        DELIVERY FEES
                                    </option>
                                    <option value="PROCEDURE FEES">
                                        PROCEDURE FEES
                                    </option>
                                    <option value="discount">DISCOUNT</option>
                                </select>
                            </div>
                        )}


                        {/* PAYMENT MODE */}
                        <div className="audit-field">
                            <label>PAYMENT MODE</label>

                            <select
                                onChange={(e) => setmode(e.target.value)}
                            >
                                <option value="">ALL MODES</option>
                                <option value="pos">POS</option>
                                <option value="transfer">TRANSFER</option>
                                <option value="cash">CASH</option>
                            </select>
                        </div>


                        {/* STATUS */}
                        <div className="audit-field">
                            <label>STATUS</label>

                            <select onChange={handleStatus}>
                                <option value="PAID">PAID</option>
                                <option value="PENDING">PENDING</option>
                                <option value="DEBTORS">DEBTORS</option>
                                <option value="AWAITING">PHARMACY</option>
                            </select>
                        </div>

                    </div>


                    {/* ACTIVE FILTERS */}
                    <div className="audit-active-filters">

                        <span className="active-filter-title">
                            Current view:
                        </span>

                        <span className="filter-chip">
                            {serviceNames[sort] || 'All Services'}
                        </span>

                        {sort === 'service' && categories && (
                            <span className="filter-chip">
                                {serviceCategoryNames[categories]}
                            </span>
                        )}

                        {mode && (
                            <span className="filter-chip">
                                {mode.toUpperCase()}
                            </span>
                        )}

                        <span className="filter-chip">
                            {statusNames[status]}
                        </span>

                        {staff && (
                            <span className="filter-chip">
                                Staff selected
                            </span>
                        )}

                    </div>

                </div>


                {/* SEARCH */}
                <div className="audit-search-row">

                    <div className="audit-search-box">

                        <span className="audit-search-icon">⌕</span>

                        <input
                            value={searchText}
                            onChange={(e) => setsearchText(e.target.value)}
                            placeholder="Search bill..."
                        />

                        {searchText && (
                            <button
                                onClick={() => {
                                    setsearchText('');
                                    setfilteredData([]);
                                }}
                                className="audit-clear-search"
                            >
                                ×
                            </button>
                        )}

                    </div>

                    <button
                        onClick={handleFiltered}
                        className="audit-search-btn"
                    >
                        Search
                    </button>

                </div>


                {/* SUMMARY */}
                <div className="audit-summary-grid">

                    <div className="audit-summary-card audit-summary-main">

                        <div className="audit-summary-icon">
                            ₦
                        </div>

                        <div style={{display:'flex', flexDirection:'column', alignItems:'flex-start'}} >
                            <span>Total Amount</span>

                            <strong>
                                {totalFormatted.format(displayTotal || 0)}
                            </strong>

                            <small>
                                {sort === 'service'
                                    ? activeServiceName
                                    : statusNames[status]
                                }
                            </small>
                        </div>

                    </div>


                    <div className="audit-summary-card">

                        <span>Transactions</span>

                        <strong>
                            {auditTransactionCount}
                        </strong>

                        <small>
                            Records found
                        </small>

                    </div>


                    <div className="audit-summary-card">

                        <span>Status</span>

                        <strong className="audit-summary-status">
                            {statusNames[status]}
                        </strong>

                        <small>
                            Current report
                        </small>

                    </div>


                    <div className="audit-summary-card">

                        <span>Service</span>

                        <strong className="audit-service-value">
                            {activeServiceName}
                        </strong>

                        <small>
                            Selected category
                        </small>

                    </div>

                </div>
            </div>    

            {isBusy && (
                <div className="audit_results_loading">
                    <div className="audit_loading_box">

                        <div className="audit_spinner"></div>

                        <h4>
                            {isLoadingData
                                ? 'Loading data...'
                                : 'Calculating results...'
                            }
                        </h4>

                        <p>
                            {isLoadingData
                                ? 'Please wait while we retrieve the selected records.'
                                : 'Please wait while we calculate the final totals.'
                            }
                        </p>

                    </div>
                </div>
            )}

            <div id='pdf-content' style={{padding:'10px'}} >
                <div style={{padding:'10px 0', borderBottom:'.3px solid #c3c3c3', color:'green'}}>
                    {   status === 'PAID' ?
                        sort === 'cards' ?
                            <h4>Total Income Made {totalFormatted.format(cardTotal)}</h4>
                        : sort === 'consultation' ?
                            <h4>Total Income Made {totalFormatted.format(consultationTotal)}</h4>
                        : sort === 'drugs' ?
                            <h4>Total Income Made {totalFormatted.format(othersTotal)}</h4>
                        : sort === 'utils' ? 
                            <h4>Total Income Made {totalFormatted.format(utilsTotal)}</h4>
                        : sort === 'consumables' ?
                            <h4>Total Income Made {totalFormatted.format(consumeTotal)}</h4>
                        : sort === 'drugs' ?
                            <h4>Total Income Made {totalFormatted.format(docTotal)}</h4>
                        : <div style={{width:'100%', display:'flex', alignItems:'center'}}>
                            <h4 style={{margin:'0 10px'}}>Total Income Made {totalFormatted.format(totalPrice > 0 ? totalPrice : displayTotal)}</h4>
                            <h4 style={{color:'red', margin:'0 10px'}}>Total Expenses {totalFormatted.format(Total)}</h4>
                            <h4 style={{margin:'0 10px'}}>Total Profit {totalFormatted.format(totalPrice - Total)}</h4>
                        </div>
                        : null
                    }
                    {   status === 'PENDING' ?
                        sort === 'cards' ?
                            <h4>Total Income Made {totalFormatted.format(cardTotal1)}</h4>
                        : sort === 'consultation' ?
                            <h4>Total Income Made {totalFormatted.format(consultationTotal1)}</h4>
                        : sort === 'drugs' ?
                            <h4>Total Income Made {totalFormatted.format(othersTotal1)}</h4>
                        : sort === 'utils' ?
                            <h4>Total Income Made {totalFormatted.format(utilsTotal1)}</h4>
                        : sort === 'consumables' ?
                            <h4>Total Income Made {totalFormatted.format(consumeTotal1)}</h4>
                        : sort === 'drugs' ?
                            <h4>Total Income Made {totalFormatted.format(docTotal1)}</h4>
                        : <div style={{width:'100%', display:'flex', alignItems:'center'}}>
                            <h4 style={{margin:'0 10px'}}>Total Pending {totalFormatted.format(totalPrice1)}</h4>
                        </div>
                        : null
                    }
                    {   status === 'AWAITING' ?
                        sort === 'cards' ?
                            <h4>Total Income Made {totalFormatted.format(cardTotal2)}</h4>
                        : sort === 'consultation' ?
                            <h4>Total Income Made {totalFormatted.format(consultationTotal2)}</h4>
                        : sort === 'drugs' ?
                            <h4>Total Income Made {totalFormatted.format(othersTotal2)}</h4>
                        : sort === 'utils' ?
                            <h4>Total Income Made {totalFormatted.format(utilsTotal2)}</h4>
                        : sort === 'consumables' ?
                            <h4>Total Income Made {totalFormatted.format(consumeTotal2)}</h4>
                        : sort === 'drugs' ?
                            <h4>Total Income Made {totalFormatted.format(docTotal2)}</h4>
                        : <div style={{width:'100%', display:'flex', alignItems:'center'}}>
                            <h4 style={{margin:'0 10px'}}>Total In Pharmacy {totalFormatted.format(totalPrice2)}</h4>
                        </div>
                        : null
                    }
                    {   status === 'DEBTORS' ?
                            sort === 'cards' ?
                                <h4>Total Card debt {totalFormatted.format(cardTotal3)}</h4>
                            : sort === 'consultation' ?
                                <h4>Total consultation debt {totalFormatted.format(consultationTotal3)}</h4>
                            : sort === 'drugs' ?
                                <h4>Total drugs debt {totalFormatted.format(othersTotal3)}</h4>
                            : sort === 'utils' ?
                                <h4>Total utils debt {totalFormatted.format(utilsTotal3)}</h4>
                            : sort === 'consumables' ?
                                <h4>Total consumables debt {totalFormatted.format(consumeTotal3)}</h4>
                            : sort === 'drugs' ?
                                <h4>Total drugs debt {totalFormatted.format(docTotal3)}</h4>
                            : <div style={{width:'100%', display:'flex', alignItems:'center'}}>
                                <h4 style={{margin:'0 10px'}}>Total Debt {totalFormatted.format(totalPrice3)}</h4>
                            </div>
                        : null
                    }
                </div>   

                {paginationSource.length > 0 && (
                    <div className="audit-pagination">

                        <div className="audit-pagination-info">
                            <span>
                                Showing{" "}
                                <strong>
                                    {Math.min(startIndex + 1, sortedPaginationSource.length)}
                                </strong>
                                {" "}–{" "}
                                <strong>
                                    {Math.min(endIndex, sortedPaginationSource.length)}
                                </strong>
                                {" "}of{" "}
                                <strong>{sortedPaginationSource.length}</strong>
                            </span>
                        </div>

                        <div className="audit-pagination-controls">

                            <button
                                type="button"
                                className="audit-page-arrow"
                                disabled={currentPage === 1}
                                onClick={() =>
                                    setCurrentPage(prev => Math.max(prev - 1, 1))
                                }
                            >
                                ‹
                            </button>

                            {Array.from(
                                { length: totalPages },
                                (_, index) => index + 1
                            )
                                .filter(page => {
                                    return (
                                        page === 1 ||
                                        page === totalPages ||
                                        Math.abs(page - currentPage) <= 1
                                    );
                                })
                                .map((page, index, pages) => {

                                    const previousPage = pages[index - 1];

                                    return (
                                        <React.Fragment key={page}>

                                            {previousPage &&
                                                page - previousPage > 1 && (
                                                    <span className="audit-page-dots">
                                                        ...
                                                    </span>
                                                )}

                                            <button
                                                type="button"
                                                className={`audit-page-number ${
                                                    currentPage === page
                                                        ? "active"
                                                        : ""
                                                }`}
                                                onClick={() => setCurrentPage(page)}
                                            >
                                                {page}
                                            </button>

                                        </React.Fragment>
                                    );
                                })}

                            <button
                                type="button"
                                className="audit-page-arrow"
                                disabled={currentPage === totalPages}
                                onClick={() =>
                                    setCurrentPage(prev =>
                                        Math.min(prev + 1, totalPages)
                                    )
                                }
                            >
                                ›
                            </button>

                        </div>

                        <div className="audit-rows-selector">

                            <span>Rows</span>

                            <select
                                value={rowsPerPage}
                                onChange={(e) => {
                                    setRowsPerPage(Number(e.target.value));
                                    setCurrentPage(1);
                                }}
                            >
                                <option value={10}>10</option>
                                <option value={20}>20</option>
                                <option value={30}>30</option>
                                <option value={50}>50</option>
                                <option value={100}>100</option>
                            </select>

                        </div>

                    </div>
                )}

                <table border="1" className='custome_table'>
                    <thead>
                    <tr>
                        <th>TIME</th>
                        <th>Patient Name</th>
                        <th>PURPOSE OF PAYMENT</th>
                        <th>AMOUNT PAID</th>
                        <th>MODE OF PAID</th>
                    </tr>
                    </thead>
                    { filteredData?.length === 0 ?
                        <>
                            {   status === 'PAID' &&
                                    getComplete?.length > 0 ?
                                    paginatedData?.sort((a, b)=> b.timeStamp - a.timeStamp).map((item, i)=>{

                                        if(item?.type !== 'lab' && item?.type !== 'scan'){
                                            
                                            const getBill = typeof item.services === "string"
                                                ? JSON.parse(item.services)
                                                : item.services;

                                            const formatted = new Intl.NumberFormat('en-NG', {
                                                style: 'currency',
                                                currency: 'NGN',
                                                minimumFractionDigits: 0,
                                                maximumFractionDigits: 0
                                            })

                                            const date = new Date(Number(item?.timeStamp))
                                            const day = date.getDate() 
                                            const month = date.getMonth() + 1
                                            const year = date.getFullYear()
                                            const date1 = new Date(Number(item?.timeStamp))

                                            let hours = date1.getHours()
                                            const minutes = date1.getMinutes()
                                            const ampm = hours >= 12 ? "PM" : "AM"

                                            hours = hours % 12
                                            hours = hours ? hours : 12

                                            const pad = (n) => n.toString().padStart(2, '0')

                                            const timeString = `${pad(hours)}:${pad(minutes)} ${ampm}`

                                            const patient = getPatient?.find((pat)=> pat?._id === item?.uid) 

                                            const getcard = getBill?.items?.filter((items)=> items?.name?.toLowerCase().includes('card'))
                                            const getconsult = getBill?.items?.filter((items)=> items?.name?.toLowerCase().includes('consultation'))
                                            const getdrugs = getBill?.items?.filter((items)=> !items?.name?.toLowerCase().includes('consultation') && !items?.name?.toLowerCase().includes('card'))

                                            const parsed = typeof item.services === "string"
                                                ? JSON.parse(item.services)
                                                : item.services;

                                            const serviceItems = parsed?.items || [];

                                            const selectedServiceItems = serviceItems.filter(
                                                serviceItem =>
                                                    serviceItem?.name?.toLowerCase() === sort?.toLowerCase()
                                            );

                                            const selectedServiceTotal = selectedServiceItems.reduce(
                                                (total, serviceItem) =>
                                                    total + Number(serviceItem?.totalPrice || 0),
                                                0
                                            );

                                            const getTotal = Array.isArray(getBill)
                                                ? getBill.reduce((sum, service) => {
                                                    const price = Number(service?.price);

                                                    return sum + (Number.isFinite(price) ? price : 0);
                                                }, 0)
                                                : 0;
                                            
                                                                                        

                                            if(getcard?.length > 0 && sort === 'cards'){
                                                return(
                                                    <tbody key={i}>
                                                        <tr>
                                                            
                                                            <td><p>{timeString}, {`${day}-${month}-${year}`}</p></td>
                                                            <td><p>{item?.name || patient?.name}</p></td>
                                                            <td>
                                                                {getBill?.items?.map((items, index) => (
                                                                    <span key={index} style={{margin:'5px 0'}}>{items?.name || items?.drugs}, </span>
                                                                ))}
                                                            </td>
                                                            <td><p>{!getBill?.totalPrice ? formatted.format(getBill?.items[0]?.totalPrice) : formatted.format(getBill?.totalPrice)}</p></td>
                                                            <td><p>{item?.mode}</p></td>
                                                        </tr>
                                                    </tbody>
                                                )  
                                            }else if(getconsult?.length > 0 && sort === 'consultation'){
                                                return(
                                                    <tbody key={i}>
                                                        <tr>
                                                            
                                                            <td><p>{timeString}, {`${day}-${month}-${year}`}</p></td>
                                                            <td><p>{item?.name || patient?.name}</p></td>
                                                            <td>
                                                                {getBill?.items?.map((items, index) => (
                                                                    <span key={index} style={{margin:'5px 0'}}>{items?.name || items?.drugs}, </span>
                                                                ))}
                                                            </td>
                                                            <td><p>{!getBill?.totalPrice ? formatted.format(getBill?.items[0]?.totalPrice) : formatted.format(getBill?.totalPrice)}</p></td>
                                                            <td><p>{item?.mode}</p></td>
                                                        </tr>
                                                    </tbody>
                                                )  
                                            }else if(sort === 'payout'){
                                                return(
                                                    <tbody key={i}>
                                                        <tr>
                                                            
                                                            <td><p>{timeString}, {`${day}-${month}-${year}`}</p></td>
                                                            <td><p>{item?.name || patient?.name}</p></td>
                                                            <td>
                                                                {getBill?.items?.map((items, index) => (
                                                                    <span key={index} style={{margin:'5px 0'}}>{items?.name || items?.drugs}, </span>
                                                                ))}
                                                            </td>
                                                            <td><p>{!getBill?.totalPrice ? formatted.format(getBill?.items[0]?.totalPrice) : formatted.format(getBill?.totalPrice)}</p></td>
                                                            <td><p>{item?.mode}</p></td>
                                                        </tr>
                                                    </tbody>
                                                )  
                                            }else if(getdrugs?.length > 0 && sort === 'drugs' && item?.doctorID){
                                                return(
                                                    <tbody key={i}>
                                                        <tr>
                                                            
                                                            <td><p>{timeString}, {`${day}-${month}-${year}`}</p></td>
                                                            <td><p>{item?.name || patient?.name}</p></td>
                                                            <td>
                                                                {getBill?.items?.map((items, index) => (
                                                                    <span key={index} style={{margin:'2px 0'}}>{items?.name || items?.drugs}, </span>
                                                                ))}
                                                            </td>
                                                            <td><p>{!getBill?.totalPrice ? formatted.format(getBill?.items[0]?.totalPrice) : formatted.format(getBill?.totalPrice)}</p></td>
                                                            <td><p>{item?.mode}</p></td>
                                                        </tr>
                                                    </tbody>
                                                )  
                                            }else if(sort === 'utils' && getBill?.profit === 0){
                                                return(
                                                    <tbody key={i}>
                                                        <tr>
                                                            
                                                            <td><p>{timeString}, {`${day}-${month}-${year}`}</p></td>
                                                            <td><p>{item?.name || patient?.name}</p></td>
                                                            <td>
                                                                {getBill?.items?.map((items, index) => (
                                                                    <span key={index} style={{margin:'5px 0'}}>{items?.name || items?.drugs}, </span>
                                                                ))}
                                                            </td>
                                                            <td><p>{!getBill?.totalPrice ? formatted.format(getBill?.items[0]?.totalPrice) : formatted.format(getBill?.totalPrice)}</p></td>
                                                            <td><p>{item?.mode}</p></td>
                                                        </tr>
                                                    </tbody>
                                                )  
                                            }else if(sort === 'consumables' && getBill?.profit !== 0){
                                                return(
                                                    <tbody key={i}>
                                                        <tr>
                                                            
                                                            <td><p>{timeString}, {`${day}-${month}-${year}`}</p></td>
                                                            <td><p>{item?.name || patient?.name}</p></td>
                                                            <td>
                                                                {getBill?.items?.map((items, index) => (
                                                                    <span key={index} style={{margin:'5px 0'}}>{items?.name || items?.drugs}, </span>
                                                                ))}
                                                            </td>
                                                            <td><p>{!getBill?.totalPrice ? formatted.format(getBill?.items[0]?.totalPrice) : formatted.format(getBill?.totalPrice)}</p></td>
                                                            <td><p>{item?.mode}</p></td>
                                                        </tr>
                                                    </tbody>
                                                )  
                                            }else if(sort === 'CHURCH'){
                                                return(
                                                    <tbody key={i}>
                                                        <tr>
                                                            
                                                            <td><p>{timeString}, {`${day}-${month}-${year}`}</p></td>
                                                            <td><p>{item?.name || patient?.name}</p></td>
                                                            <td>
                                                                {getBill?.items?.map((items, index) => (
                                                                    <span key={index} style={{margin:'5px 0'}}>{items?.name || items?.drugs}, </span>
                                                                ))}
                                                            </td>
                                                            <td><p>{!getBill?.totalPrice ? formatted.format(getBill?.items[0]?.totalPrice) : formatted.format(getBill?.totalPrice)}</p></td>
                                                            <td><p>{item?.mode}</p></td>
                                                        </tr>
                                                    </tbody>
                                                )  
                                            }else if(sort === 'service'){
                                                return(
                                                    <tbody key={i}>
                                                        <tr>
                                                            
                                                            <td><p>{timeString}, {`${day}-${month}-${year}`}</p></td>
                                                            <td><p>{item?.name || patient?.name}</p></td>
                                                            <td>
                                                                {parsed?.length && parsed?.map((items, index) => (
                                                                    <span key={index} style={{margin:'5px 0'}}>{items?.name || items?.drugs}, </span>
                                                                ))}
                                                            </td>
                                                            <td><p>{!getBill?.totalPrice ? formatted.format(getTotal) : formatted.format(getBill?.totalPrice)}</p></td>
                                                            <td><p>{item?.mode}</p></td>
                                                        </tr>
                                                    </tbody>
                                                )  
                                            }else if( sort === 'CHURCH' && selectedServiceItems.length > 0
                                            ){
                                                return(
                                                    <tbody key={i}>
                                                        <tr>

                                                            <td>
                                                                <p>
                                                                    {timeString}, {`${day}-${month}-${year}`}
                                                                </p>
                                                            </td>

                                                            <td>
                                                                <p>
                                                                    {item?.name || patient?.name}
                                                                </p>
                                                            </td>

                                                            <td>
                                                                {selectedServiceItems.map((serviceItem, index) => (
                                                                    <span
                                                                        key={index}
                                                                        style={{margin:'5px 0'}}
                                                                    >
                                                                        {serviceItem?.name},
                                                                    </span>
                                                                ))}
                                                            </td>

                                                            <td>
                                                                <p>
                                                                    {formatted.format(selectedServiceTotal)}
                                                                </p>
                                                            </td>

                                                            <td>
                                                                <p>{item?.mode}</p>
                                                            </td>

                                                        </tr>
                                                    </tbody>
                                            )}else if(
                                                [
                                                    'CHURCH',
                                                    'BLOOD',
                                                    'OXYGEN',
                                                    'PROFESSIONAL',
                                                    'NURSING',
                                                    'BED',
                                                    'DELIVERY FEES',
                                                    'PROCEDURE FEES',
                                                    'discount'
                                                ].includes(sort) &&
                                                selectedServiceItems.length > 0
                                            ){
                                                return(
                                                    <tbody key={i}>
                                                        <tr>

                                                            <td>
                                                                <p>
                                                                    {timeString}, {`${day}-${month}-${year}`}
                                                                </p>
                                                            </td>

                                                            <td>
                                                                <p>
                                                                    {item?.name || patient?.name}
                                                                </p>
                                                            </td>

                                                            <td>
                                                                {selectedServiceItems.map((serviceItem, index) => (
                                                                    <span
                                                                        key={index}
                                                                        style={{margin:'5px 0'}}
                                                                    >
                                                                        {serviceItem?.name},
                                                                    </span>
                                                                ))}
                                                            </td>

                                                            <td>
                                                                <p>
                                                                    {formatted.format(selectedServiceTotal)}
                                                                </p>
                                                            </td>

                                                            <td>
                                                                <p>{item?.mode}</p>
                                                            </td>

                                                        </tr>
                                                    </tbody>
                                                )
                                            }else{
                                                return(
                                                    <tbody key={i}>
                                                        <tr>

                                                            <td>
                                                                <p>
                                                                    {timeString}, {`${day}-${month}-${year}`}
                                                                </p>
                                                            </td>

                                                            <td>
                                                                <p>
                                                                    {item?.name || patient?.name}
                                                                </p>
                                                            </td>

                                                            <td>
                                                                {getBill.items?.length && getBill.items?.map((items, index) => (
                                                                    <p key={index} style={{margin:'5px 0'}}>{items?.name || items?.drugs}, </p>
                                                                ))}
                                                            </td>
                                                                
                                                            <td><p>{!getBill?.totalPrice ? formatted.format(getTotal) : formatted.format(getBill?.totalPrice)}</p></td>

                                                            <td>
                                                                <p>{item?.mode}</p>
                                                            </td>

                                                        </tr>
                                                    </tbody>
                                                )
                                            }

                                                                
                                        }else if(item?.type === 'lab'){
                                            const getBill = typeof item.services === "string"
                                                ? JSON.parse(item.services)
                                                : item.services;
                                            const getTotal = Array.isArray(getBill)
                                                ? getBill.reduce((sum, service) => {
                                                    const price = Number(service?.price);

                                                    return sum + (Number.isFinite(price) ? price : 0);
                                                }, 0)
                                                : 0;
                                            
                                                // console.log("SERVICES:", getBill);
                                                // console.log("PRICES:", getBill?.map(x => x?.price));
                                                // console.log("NUMBERS:", getBill?.map(x => Number(x?.price)));
                                                

                                            const formatted5 = new Intl.NumberFormat("en-NG", {
                                                style: "currency",
                                                currency: "NGN",
                                                minimumFractionDigits: 0,
                                                maximumFractionDigits: 0
                                            }).format(getTotal);


                                            const date = new Date(Number(item?.timeStamp))
                                            const day = date.getDate()
                                            const month = date.getMonth() + 1
                                            const year = date.getFullYear()
                                            const date1 = new Date(Number(item?.timeStamp))

                                            let hours = date1.getHours()
                                            const minutes = date1.getMinutes()
                                            const ampm = hours >= 12 ? "PM" : "AM"

                                            hours = hours % 12
                                            hours = hours ? hours : 12

                                            const pad = (n) => n.toString().padStart(2, '0')

                                            const timeString = `${pad(hours)}:${pad(minutes)} ${ampm}`
                                            const patient = getPatient?.find((pat)=> pat?._id === item?.uid) 
                                            return(
                                                <tbody key={i}>
                                                    <tr>
                                                        
                                                        <td><p>{timeString}, {`${day}-${month}-${year}`}</p></td>
                                                        <td><p>{item?.name || patient?.name}</p></td>
                                                        <td>
                                                            {   getBill?.length > 0 &&
                                                                getBill?.map((items, index) => (
                                                                    <span key={index} style={{margin:'5px 0'}}>{items?.testname}, </span>
                                                                ))
                                                            }
                                                        </td>
                                                        <td><p>{formatted5}</p></td>
                                                        <td><p>{item?.mode}</p></td>
                                                    </tr>
                                                </tbody>
                                            ) 
                                        }else if(item.type === 'scan'){
                                            const getBill = JSON.parse(item?.services) 
                                            const getTotal = getBill?.length > 0  ? getBill?.reduce((sum, item)=> sum + item.price, 0) : getBill?.price

                                            const formatted5 = new Intl.NumberFormat('en-NG', {
                                                style: 'currency',
                                                currency: 'NGN',
                                                minimumFractionDigits: 0,
                                                maximumFractionDigits: 0
                                            }).format(getTotal);
                                            
                                            const date = new Date(Number(item?.timeStamp))
                                            const day = date.getDate()
                                            const month = date.getMonth() + 1
                                            const year = date.getFullYear()
                                            const date1 = new Date(Number(item?.timeStamp))

                                            let hours = date1.getHours()
                                            const minutes = date1.getMinutes()
                                            const ampm = hours >= 12 ? "PM" : "AM"

                                            hours = hours % 12
                                            hours = hours ? hours : 12

                                            const pad = (n) => n.toString().padStart(2, '0')

                                            const timeString = `${pad(hours)}:${pad(minutes)} ${ampm}`
                                            const patient = getPatient?.find((pat)=> pat?._id === item?.uid) 

                                            return(
                                                <tbody key={i}>
                                                    <tr>
                                                        
                                                        <td><p>{timeString}, {`${day}-${month}-${year}`}</p></td>
                                                        <td><p>{item?.name || patient?.name}</p></td>
                                                        <td>
                                                            <div>
                                                                {   getBill?.length > 0 ?
                                                                    getBill?.map((items, index) => (
                                                                        <span key={index} style={{margin:'5px 0'}}>{items?.testname}, </span>
                                                                    ))
                                                                    :
                                                                    <span>{getBill?.testname}</span>
                                                                }
                                                            </div>
                                                        </td>
                                                        <td><p>{formatted5}</p></td>
                                                        <td><p>{item?.mode}</p></td>
                                                    </tr>
                                                </tbody>
                                            )  
                                        }
                                    })
                                : null
                            }
                            {   status === 'PENDING' &&
                                    pending?.length > 0 ?
                                    paginatedData?.sort((a, b)=> b.timeStamp - a.timeStamp).map((item, i)=>{

                                        if(item?.type !== 'lab' && item?.type !== 'scan'){
                                            
                                            const getBill = JSON.parse(item?.services) 

                                            const formatted = new Intl.NumberFormat('en-NG', {
                                                style: 'currency',
                                                currency: 'NGN',
                                                minimumFractionDigits: 0,
                                                maximumFractionDigits: 0
                                            })

                                            const date = new Date(Number(item?.timeStamp))
                                            const day = date.getDate() 
                                            const month = date.getMonth() + 1
                                            const year = date.getFullYear()
                                            const date1 = new Date(Number(item?.timeStamp))

                                            let hours = date1.getHours()
                                            const minutes = date1.getMinutes()
                                            const ampm = hours >= 12 ? "PM" : "AM"

                                            hours = hours % 12
                                            hours = hours ? hours : 12

                                            const pad = (n) => n.toString().padStart(2, '0')

                                            const timeString = `${pad(hours)}:${pad(minutes)} ${ampm}`

                                            const patient = getPatient1?.find((pat)=> pat?._id === item?.uid) 

                                            const getcard = getBill?.items?.filter((items)=> items?.name?.toLowerCase().includes('card'))
                                            const getconsult = getBill?.items?.filter((items)=> items?.name?.toLowerCase().includes('consultation'))
                                            const getdrugs = getBill?.items?.filter((items)=> !items?.name?.toLowerCase().includes('consultation') && !items?.name?.toLowerCase().includes('card'))

                                            if(getcard?.length > 0 && sort === 'cards'){
                                                return(
                                                    <tbody key={i}>
                                                        <tr>
                                                            
                                                            <td><p>{timeString}, {`${day}-${month}-${year}`}</p></td>
                                                            <td><p>{item?.name || patient?.name}</p></td>
                                                            <td>
                                                                {getBill?.items?.map((items, index) => (
                                                                    <span key={index} style={{margin:'5px 0'}}>{items?.name || items?.drugs}, </span>
                                                                ))}
                                                            </td>
                                                            <td><p>{!getBill?.totalPrice ? formatted.format(getBill?.items[0]?.totalPrice) : formatted.format(getBill?.totalPrice)}</p></td>
                                                            <td><p>{item?.mode}</p></td>
                                                        </tr>
                                                    </tbody>
                                                )  
                                            }else if(getconsult?.length > 0 && sort === 'consultation'){
                                                return(
                                                    <tbody key={i}>
                                                        <tr>
                                                            
                                                            <td><p>{timeString}, {`${day}-${month}-${year}`}</p></td>
                                                            <td><p>{item?.name || patient?.name}</p></td>
                                                            <td>
                                                                {getBill?.items?.map((items, index) => (
                                                                    <span key={index} style={{margin:'5px 0'}}>{items?.name || items?.drugs}, </span>
                                                                ))}
                                                            </td>
                                                            <td><p>{!getBill?.totalPrice ? formatted.format(getBill?.items[0]?.totalPrice) : formatted.format(getBill?.totalPrice)}</p></td>
                                                            <td><p>{item?.mode}</p></td>
                                                        </tr>
                                                    </tbody>
                                                )  
                                            }else if(sort === 'payout'){
                                                return(
                                                    <tbody key={i}>
                                                        <tr>
                                                            
                                                            <td><p>{timeString}, {`${day}-${month}-${year}`}</p></td>
                                                            <td><p>{item?.name || patient?.name}</p></td>
                                                            <td>
                                                                {getBill?.items?.map((items, index) => (
                                                                    <span key={index} style={{margin:'5px 0'}}>{items?.name || items?.drugs}, </span>
                                                                ))}
                                                            </td>
                                                            <td><p>{!getBill?.totalPrice ? formatted.format(getBill?.items[0]?.totalPrice) : formatted.format(getBill?.totalPrice)}</p></td>
                                                            <td><p>{item?.mode}</p></td>
                                                        </tr>
                                                    </tbody>
                                                )  
                                            }else if(getdrugs?.length > 0 && sort === 'drugs' && item?.doctorID){
                                                return(
                                                    <tbody key={i}>
                                                        <tr>
                                                            
                                                            <td><p>{timeString}, {`${day}-${month}-${year}`}</p></td>
                                                            <td><p>{item?.name || patient?.name}</p></td>
                                                            <td>
                                                                {getBill?.items?.map((items, index) => (
                                                                    <span key={index} style={{margin:'2px 0'}}>{items?.name || items?.drugs}, </span>
                                                                ))}
                                                            </td>
                                                            <td><p>{!getBill?.totalPrice ? formatted.format(getBill?.items[0]?.totalPrice) : formatted.format(getBill?.totalPrice)}</p></td>
                                                            <td><p>{item?.mode}</p></td>
                                                        </tr>
                                                    </tbody>
                                                )  
                                            }else if(sort === 'utils' && getBill?.profit === 0){
                                                return(
                                                    <tbody key={i}>
                                                        <tr>
                                                            
                                                            <td><p>{timeString}, {`${day}-${month}-${year}`}</p></td>
                                                            <td><p>{item?.name || patient?.name}</p></td>
                                                            <td>
                                                                {getBill?.items?.map((items, index) => (
                                                                    <span key={index} style={{margin:'5px 0'}}>{items?.name || items?.drugs}, </span>
                                                                ))}
                                                            </td>
                                                            <td><p>{!getBill?.totalPrice ? formatted.format(getBill?.items[0]?.totalPrice) : formatted.format(getBill?.totalPrice)}</p></td>
                                                            <td><p>{item?.mode}</p></td>
                                                        </tr>
                                                    </tbody>
                                                )  
                                            }else if(sort === 'consumables' && getBill?.profit !== 0){
                                                return(
                                                    <tbody key={i}>
                                                        <tr>
                                                            
                                                            <td><p>{timeString}, {`${day}-${month}-${year}`}</p></td>
                                                            <td><p>{item?.name || patient?.name}</p></td>
                                                            <td>
                                                                {getBill?.items?.map((items, index) => (
                                                                    <span key={index} style={{margin:'5px 0'}}>{items?.name || items?.drugs}, </span>
                                                                ))}
                                                            </td>
                                                            <td><p>{!getBill?.totalPrice ? formatted.format(getBill?.items[0]?.totalPrice) : formatted.format(getBill?.totalPrice)}</p></td>
                                                            <td><p>{item?.mode}</p></td>
                                                        </tr>
                                                    </tbody>
                                                )  
                                            }else if(sort === 'CHURCH'){
                                                return(
                                                    <tbody key={i}>
                                                        <tr>
                                                            
                                                            <td><p>{timeString}, {`${day}-${month}-${year}`}</p></td>
                                                            <td><p>{item?.name || patient?.name}</p></td>
                                                            <td>
                                                                {getBill?.items?.map((items, index) => (
                                                                    <span key={index} style={{margin:'5px 0'}}>{items?.name || items?.drugs}, </span>
                                                                ))}
                                                            </td>
                                                            <td><p>{!getBill?.totalPrice ? formatted.format(getBill?.items[0]?.totalPrice) : formatted.format(getBill?.totalPrice)}</p></td>
                                                            <td><p>{item?.mode}</p></td>
                                                        </tr>
                                                    </tbody>
                                                )  
                                            }else if(sort === ''){
                                                return(
                                                    <tbody key={i}>
                                                        <tr>
                                                            
                                                            <td><p>{timeString}, {`${day}-${month}-${year}`}</p></td>
                                                            <td><p>{item?.name || patient?.name}</p></td>
                                                            <td>
                                                                {getBill?.items?.map((items, index) => (
                                                                    <span key={index} style={{margin:'5px 0'}}>{items?.name || items?.drugs}, </span>
                                                                ))}
                                                            </td>
                                                            <td><p>{!getBill?.totalPrice ? formatted.format(getBill?.items[0]?.totalPrice) : formatted.format(getBill?.totalPrice)}</p></td>
                                                            <td><p>{item?.mode}</p></td>
                                                        </tr>
                                                    </tbody>
                                                )  
                                            }else{
                                                return null
                                            }

                                                                
                                        }else if(item?.type === 'lab'){
                                            const getBill = JSON.parse(item?.services) 
                                            const getTotal = getBill?.length > 0  ? getBill?.reduce((sum, item)=> sum + item.price, 0) : 0

                                            const formatted5 = new Intl.NumberFormat('en-NG', {
                                                style: 'currency',
                                                currency: 'NGN',
                                                minimumFractionDigits: 0,
                                                maximumFractionDigits: 0
                                            }).format(getTotal);


                                            const date = new Date(Number(item?.timeStamp))
                                            const day = date.getDate()
                                            const month = date.getMonth() + 1
                                            const year = date.getFullYear()
                                            const date1 = new Date(Number(item?.timeStamp))

                                            let hours = date1.getHours() 
                                            const minutes = date1.getMinutes()
                                            const ampm = hours >= 12 ? "PM" : "AM"

                                            hours = hours % 12
                                            hours = hours ? hours : 12

                                            const pad = (n) => n.toString().padStart(2, '0')

                                            const timeString = `${pad(hours)}:${pad(minutes)} ${ampm}`
                                            const patient = getPatient1?.find((pat)=> pat?._id === item?.uid) 
                                            return(
                                                <tbody key={i}>
                                                    <tr>
                                                        <td><p>{timeString}, {`${day}-${month}-${year}`}</p></td>
                                                        <td><p>{item?.name || patient?.name}</p></td>
                                                        <td>
                                                            {   getBill?.length > 0 &&
                                                                getBill?.map((items, index) => (
                                                                    <span key={index} style={{margin:'5px 0'}}>{items?.testname}, </span>
                                                                ))
                                                            }
                                                        </td>
                                                        <td><p>{formatted5}</p></td>
                                                        <td><p>{item?.mode}</p></td>
                                                    </tr>
                                                </tbody>
                                            ) 
                                        }else if(item.type === 'scan'){
                                            const getBill = JSON.parse(item?.services) 
                                            const getTotal = getBill?.length > 0  ? getBill?.reduce((sum, item)=> sum + item.price, 0) : getBill?.price

                                            const formatted5 = new Intl.NumberFormat('en-NG', {
                                                style: 'currency',
                                                currency: 'NGN',
                                                minimumFractionDigits: 0,
                                                maximumFractionDigits: 0
                                            }).format(getTotal);
                                            
                                            const date = new Date(Number(item?.timeStamp))
                                            const day = date.getDate()
                                            const month = date.getMonth() + 1
                                            const year = date.getFullYear()
                                            const date1 = new Date(Number(item?.timeStamp))

                                            let hours = date1.getHours()
                                            const minutes = date1.getMinutes()
                                            const ampm = hours >= 12 ? "PM" : "AM"

                                            hours = hours % 12
                                            hours = hours ? hours : 12

                                            const pad = (n) => n.toString().padStart(2, '0')

                                            const timeString = `${pad(hours)}:${pad(minutes)} ${ampm}`
                                            const patient = getPatient1?.find((pat)=> pat?._id === item?.uid) 

                                            return(
                                                <tbody key={i}>
                                                    <tr>
                                                        
                                                        <td><p>{timeString}, {`${day}-${month}-${year}`}</p></td>
                                                        <td><p>{item?.name || patient?.name}</p></td>
                                                        <td>
                                                            <div>
                                                                {   getBill?.length > 0 ?
                                                                    getBill?.map((items, index) => (
                                                                        <span key={index} style={{margin:'5px 0'}}>{items?.testname}, </span>
                                                                    ))
                                                                    :
                                                                    <span>{getBill?.testname}</span>
                                                                }
                                                            </div>
                                                        </td>
                                                        <td><p>{formatted5}</p></td>
                                                        <td><p>{item?.mode}</p></td>
                                                    </tr>
                                                </tbody>
                                            )  
                                        }
                                    })
                                : null
                            }
                            {   status === 'AWAITING' &&
                                    awaiting?.length > 0 ?
                                    paginatedData?.sort((a, b)=> b.timeStamp - a.timeStamp).map((item, i)=>{

                                        if(item?.type !== 'lab' && item?.type !== 'scan'){
                                            
                                            const getBill = JSON.parse(item?.services) 

                                            const formatted = new Intl.NumberFormat('en-NG', {
                                                style: 'currency',
                                                currency: 'NGN',
                                                minimumFractionDigits: 0,
                                                maximumFractionDigits: 0
                                            })

                                            const date = new Date(Number(item?.timeStamp))
                                            const day = date.getDate() 
                                            const month = date.getMonth() + 1
                                            const year = date.getFullYear()
                                            const date1 = new Date(Number(item?.timeStamp))

                                            let hours = date1.getHours()
                                            const minutes = date1.getMinutes()
                                            const ampm = hours >= 12 ? "PM" : "AM"

                                            hours = hours % 12
                                            hours = hours ? hours : 12

                                            const pad = (n) => n.toString().padStart(2, '0')

                                            const timeString = `${pad(hours)}:${pad(minutes)} ${ampm}`

                                            const patient = getPatient?.find((pat)=> pat?._id === item?.uid) 

                                            const getcard = getBill?.items?.filter((items)=> items?.name?.toLowerCase().includes('card'))
                                            const getconsult = getBill?.items?.filter((items)=> items?.name?.toLowerCase().includes('consultation'))
                                            const getdrugs = getBill?.items?.filter((items)=> !items?.name?.toLowerCase().includes('consultation') && !items?.name?.toLowerCase().includes('card'))

                                            if(getcard?.length > 0 && sort === 'cards'){
                                                return(
                                                    <tbody key={i}>
                                                        <tr>
                                                            
                                                            <td><p>{timeString}, {`${day}-${month}-${year}`}</p></td>
                                                            <td><p>{item?.name || patient?.name}</p></td>
                                                            <td>
                                                                {getBill?.items?.map((items, index) => (
                                                                    <span key={index} style={{margin:'5px 0'}}>{items?.name || items?.drugs}, </span>
                                                                ))}
                                                            </td>
                                                            <td><p>{!getBill?.totalPrice ? formatted.format(getBill?.items[0]?.totalPrice) : formatted.format(getBill?.totalPrice)}</p></td>
                                                            <td><p>{item?.mode}</p></td>
                                                        </tr>
                                                    </tbody>
                                                )  
                                            }else if(getconsult?.length > 0 && sort === 'consultation'){
                                                return(
                                                    <tbody key={i}>
                                                        <tr>
                                                            
                                                            <td><p>{timeString}, {`${day}-${month}-${year}`}</p></td>
                                                            <td><p>{item?.name || patient?.name}</p></td>
                                                            <td>
                                                                {getBill?.items?.map((items, index) => (
                                                                    <span key={index} style={{margin:'5px 0'}}>{items?.name || items?.drugs}, </span>
                                                                ))}
                                                            </td>
                                                            <td><p>{!getBill?.totalPrice ? formatted.format(getBill?.items[0]?.totalPrice) : formatted.format(getBill?.totalPrice)}</p></td>
                                                            <td><p>{item?.mode}</p></td>
                                                        </tr>
                                                    </tbody>
                                                )  
                                            }else if(sort === 'payout'){
                                                return(
                                                    <tbody key={i}>
                                                        <tr>
                                                            
                                                            <td><p>{timeString}, {`${day}-${month}-${year}`}</p></td>
                                                            <td><p>{item?.name || patient?.name}</p></td>
                                                            <td>
                                                                {getBill?.items?.map((items, index) => (
                                                                    <span key={index} style={{margin:'5px 0'}}>{items?.name || items?.drugs}, </span>
                                                                ))}
                                                            </td>
                                                            <td><p>{!getBill?.totalPrice ? formatted.format(getBill?.items[0]?.totalPrice) : formatted.format(getBill?.totalPrice)}</p></td>
                                                            <td><p>{item?.mode}</p></td>
                                                        </tr>
                                                    </tbody>
                                                )  
                                            }else if(getdrugs?.length > 0 && sort === 'drugs' && item?.doctorID){
                                                return(
                                                    <tbody key={i}>
                                                        <tr>
                                                            
                                                            <td><p>{timeString}, {`${day}-${month}-${year}`}</p></td>
                                                            <td><p>{item?.name || patient?.name}</p></td>
                                                            <td>
                                                                {getBill?.items?.map((items, index) => (
                                                                    <span key={index} style={{margin:'2px 0'}}>{items?.name || items?.drugs}, </span>
                                                                ))}
                                                            </td>
                                                            <td><p>{!getBill?.totalPrice ? formatted.format(getBill?.items[0]?.totalPrice) : formatted.format(getBill?.totalPrice)}</p></td>
                                                            <td><p>{item?.mode}</p></td>
                                                        </tr>
                                                    </tbody>
                                                )  
                                            }else if(sort === 'utils' && getBill?.profit === 0){
                                                return(
                                                    <tbody key={i}>
                                                        <tr>
                                                            
                                                            <td><p>{timeString}, {`${day}-${month}-${year}`}</p></td>
                                                            <td><p>{item?.name || patient?.name}</p></td>
                                                            <td>
                                                                {getBill?.items?.map((items, index) => (
                                                                    <span key={index} style={{margin:'5px 0'}}>{items?.name || items?.drugs}, </span>
                                                                ))}
                                                            </td>
                                                            <td><p>{!getBill?.totalPrice ? formatted.format(getBill?.items[0]?.totalPrice) : formatted.format(getBill?.totalPrice)}</p></td>
                                                            <td><p>{item?.mode}</p></td>
                                                        </tr>
                                                    </tbody>
                                                )  
                                            }else if(sort === 'consumables' && getBill?.profit !== 0){
                                                return(
                                                    <tbody key={i}>
                                                        <tr>
                                                            
                                                            <td><p>{timeString}, {`${day}-${month}-${year}`}</p></td>
                                                            <td><p>{item?.name || patient?.name}</p></td>
                                                            <td>
                                                                {getBill?.items?.map((items, index) => (
                                                                    <span key={index} style={{margin:'5px 0'}}>{items?.name || items?.drugs}, </span>
                                                                ))}
                                                            </td>
                                                            <td><p>{!getBill?.totalPrice ? formatted.format(getBill?.items[0]?.totalPrice) : formatted.format(getBill?.totalPrice)}</p></td>
                                                            <td><p>{item?.mode}</p></td>
                                                        </tr>
                                                    </tbody>
                                                )  
                                            }else if(sort === 'CHURCH'){
                                                return(
                                                    <tbody key={i}>
                                                        <tr>
                                                            
                                                            <td><p>{timeString}, {`${day}-${month}-${year}`}</p></td>
                                                            <td><p>{item?.name || patient?.name}</p></td>
                                                            <td>
                                                                {getBill?.items?.map((items, index) => (
                                                                    <span key={index} style={{margin:'5px 0'}}>{items?.name || items?.drugs}, </span>
                                                                ))}
                                                            </td>
                                                            <td><p>{!getBill?.totalPrice ? formatted.format(getBill?.items[0]?.totalPrice) : formatted.format(getBill?.totalPrice)}</p></td>
                                                            <td><p>{item?.mode}</p></td>
                                                        </tr>
                                                    </tbody>
                                                )  
                                            }else if(sort === ''){
                                                return(
                                                    <tbody key={i}>
                                                        <tr>
                                                            
                                                            <td><p>{timeString}, {`${day}-${month}-${year}`}</p></td>
                                                            <td><p>{item?.name || patient?.name}</p></td>
                                                            <td>
                                                                {getBill?.items?.map((items, index) => (
                                                                    <span key={index} style={{margin:'5px 0'}}>{items?.name || items?.drugs}, </span>
                                                                ))}
                                                            </td>
                                                            <td><p>{!getBill?.totalPrice ? formatted.format(getBill?.items[0]?.totalPrice) : formatted.format(getBill?.totalPrice)}</p></td>
                                                            <td><p>{item?.mode}</p></td>
                                                        </tr>
                                                    </tbody>
                                                )  
                                            }else{
                                                return null
                                            }

                                                                
                                        }else if(item?.type === 'lab'){
                                            const getBill = JSON.parse(item?.services) 
                                            const getTotal = getBill?.length > 0  ? getBill?.reduce((sum, item)=> sum + item.price, 0) : 0

                                            const formatted5 = new Intl.NumberFormat('en-NG', {
                                                style: 'currency',
                                                currency: 'NGN',
                                                minimumFractionDigits: 0,
                                                maximumFractionDigits: 0
                                            }).format(getTotal);


                                            const date = new Date(Number(item?.timeStamp))
                                            const day = date.getDate()
                                            const month = date.getMonth() + 1
                                            const year = date.getFullYear()
                                            const date1 = new Date(Number(item?.timeStamp))

                                            let hours = date1.getHours()
                                            const minutes = date1.getMinutes()
                                            const ampm = hours >= 12 ? "PM" : "AM"

                                            hours = hours % 12
                                            hours = hours ? hours : 12

                                            const pad = (n) => n.toString().padStart(2, '0')

                                            const timeString = `${pad(hours)}:${pad(minutes)} ${ampm}`
                                            const patient = getPatient?.find((pat)=> pat?._id === item?.uid) 
                                            return(
                                                <tbody key={i}>
                                                    <tr>
                                                        
                                                        <td><p>{timeString}, {`${day}-${month}-${year}`}</p></td>
                                                        <td><p>{item?.name || patient?.name}</p></td>
                                                        <td>
                                                            {   getBill?.length > 0 &&
                                                                getBill?.map((items, index) => (
                                                                    <span key={index} style={{margin:'5px 0'}}>{items?.testname}, </span>
                                                                ))
                                                            }
                                                        </td>
                                                        <td><p>{formatted5}</p></td>
                                                        <td><p>{item?.mode}</p></td>
                                                    </tr>
                                                </tbody>
                                            ) 
                                        }else if(item.type === 'scan'){
                                            const getBill = JSON.parse(item?.services) 
                                            const getTotal = getBill?.length > 0  ? getBill?.reduce((sum, item)=> sum + item.price, 0) : getBill?.price

                                            const formatted5 = new Intl.NumberFormat('en-NG', {
                                                style: 'currency',
                                                currency: 'NGN',
                                                minimumFractionDigits: 0,
                                                maximumFractionDigits: 0
                                            }).format(getTotal);
                                            
                                            const date = new Date(Number(item?.timeStamp))
                                            const day = date.getDate()
                                            const month = date.getMonth() + 1
                                            const year = date.getFullYear()
                                            const date1 = new Date(Number(item?.timeStamp))

                                            let hours = date1.getHours()
                                            const minutes = date1.getMinutes()
                                            const ampm = hours >= 12 ? "PM" : "AM"

                                            hours = hours % 12
                                            hours = hours ? hours : 12

                                            const pad = (n) => n.toString().padStart(2, '0')

                                            const timeString = `${pad(hours)}:${pad(minutes)} ${ampm}`
                                            const patient = getPatient?.find((pat)=> pat?._id === item?.uid) 

                                            return(
                                                <tbody key={i}>
                                                    <tr>
                                                        
                                                        <td><p>{timeString}, {`${day}-${month}-${year}`}</p></td>
                                                        <td><p>{item?.name || patient?.name}</p></td>
                                                        <td>
                                                            <div>
                                                                {   getBill?.length > 0 ?
                                                                    getBill?.map((items, index) => (
                                                                        <span key={index} style={{margin:'5px 0'}}>{items?.testname}, </span>
                                                                    ))
                                                                    :
                                                                    <span>{getBill?.testname}</span>
                                                                }
                                                            </div>
                                                        </td>
                                                        <td><p>{formatted5}</p></td>
                                                        <td><p>{item?.mode}</p></td>
                                                    </tr>
                                                </tbody>
                                            )  
                                        }
                                    })
                                : null
                            }
                            {   status === 'DEBTORS' &&
                                    debtors?.length > 0 ?
                                    paginatedData?.sort((a, b)=> b.timeStamp - a.timeStamp).map((item, i)=>{

                                        if(item?.type !== 'lab' && item?.type !== 'scan'){
                                            
                                            const getBill = JSON.parse(item?.services) 

                                            const formatted = new Intl.NumberFormat('en-NG', {
                                                style: 'currency',
                                                currency: 'NGN',
                                                minimumFractionDigits: 0,
                                                maximumFractionDigits: 0
                                            })

                                            const date = new Date(Number(item?.timeStamp))
                                            const day = date.getDate() 
                                            const month = date.getMonth() + 1
                                            const year = date.getFullYear()
                                            const date1 = new Date(Number(item?.timeStamp))

                                            let hours = date1.getHours()
                                            const minutes = date1.getMinutes()
                                            const ampm = hours >= 12 ? "PM" : "AM"

                                            hours = hours % 12
                                            hours = hours ? hours : 12

                                            const pad = (n) => n.toString().padStart(2, '0')

                                            const timeString = `${pad(hours)}:${pad(minutes)} ${ampm}`

                                            const patient = getPatient?.find((pat)=> pat?._id === item?.uid) 

                                            const getcard = getBill?.items?.filter((items)=> items?.name?.toLowerCase().includes('card'))
                                            const getconsult = getBill?.items?.filter((items)=> items?.name?.toLowerCase().includes('consultation'))
                                            const getdrugs = getBill?.items?.filter((items)=> !items?.name?.toLowerCase().includes('consultation') && !items?.name?.toLowerCase().includes('card'))

                                            if(getcard?.length > 0 && sort === 'cards'){
                                                return(
                                                    <tbody key={i}>
                                                        <tr>
                                                            
                                                            <td><p>{timeString}, {`${day}-${month}-${year}`}</p></td>
                                                            <td><p>{item?.name || patient?.name}</p></td>
                                                            <td>
                                                                {getBill?.items?.map((items, index) => (
                                                                    <span key={index} style={{margin:'5px 0'}}>{items?.name || items?.drugs}, </span>
                                                                ))}
                                                            </td>
                                                            <td><p>{!getBill?.totalPrice ? formatted.format(getBill?.items[0]?.totalPrice) : formatted.format(getBill?.totalPrice)}</p></td>
                                                            {/* <td><p>{item?.mode}</p></td> */}
                                                            <td><p></p></td>
                                                        </tr>
                                                    </tbody>
                                                )  
                                            }else if(getconsult?.length > 0 && sort === 'consultation'){
                                                return(
                                                    <tbody key={i}>
                                                        <tr>
                                                            
                                                            <td><p>{timeString}, {`${day}-${month}-${year}`}</p></td>
                                                            <td><p>{item?.name || patient?.name}</p></td>
                                                            <td>
                                                                {getBill?.items?.map((items, index) => (
                                                                    <span key={index} style={{margin:'5px 0'}}>{items?.name || items?.drugs}, </span>
                                                                ))}
                                                            </td>
                                                            <td><p>{!getBill?.totalPrice ? formatted.format(getBill?.items[0]?.totalPrice) : formatted.format(getBill?.totalPrice)}</p></td>
                                                            {/* <td><p>{item?.mode}</p></td> */}
                                                            <td><p></p></td>
                                                        </tr>
                                                    </tbody>
                                                )  
                                            }else if(sort === 'payout'){
                                                return(
                                                    <tbody key={i}>
                                                        <tr>
                                                            
                                                            <td><p>{timeString}, {`${day}-${month}-${year}`}</p></td>
                                                            <td><p>{item?.name || patient?.name}</p></td>
                                                            <td>
                                                                {getBill?.items?.map((items, index) => (
                                                                    <span key={index} style={{margin:'5px 0'}}>{items?.name || items?.drugs}, </span>
                                                                ))}
                                                            </td>
                                                            <td><p>{!getBill?.totalPrice ? formatted.format(getBill?.items[0]?.totalPrice) : formatted.format(getBill?.totalPrice)}</p></td>
                                                            {/* <td><p>{item?.mode}</p></td> */}
                                                            <td><p></p></td>
                                                        </tr>
                                                    </tbody>
                                                )  
                                            }else if(getdrugs?.length > 0 && sort === 'drugs' && item?.doctorID){
                                                return(
                                                    <tbody key={i}>
                                                        <tr>
                                                            
                                                            <td><p>{timeString}, {`${day}-${month}-${year}`}</p></td>
                                                            <td><p>{item?.name || patient?.name}</p></td>
                                                            <td>
                                                                {getBill?.items?.map((items, index) => (
                                                                    <span key={index} style={{margin:'2px 0'}}>{items?.name || items?.drugs}, </span>
                                                                ))}
                                                            </td>
                                                            <td><p>{!getBill?.totalPrice ? formatted.format(getBill?.items[0]?.totalPrice) : formatted.format(getBill?.totalPrice)}</p></td>
                                                            {/* <td><p>{item?.mode}</p></td> */}
                                                            <td><p></p></td>
                                                        </tr>
                                                    </tbody>
                                                )  
                                            }else if(sort === 'utils' && getBill?.profit === 0){
                                                return(
                                                    <tbody key={i}>
                                                        <tr>
                                                            
                                                            <td><p>{timeString}, {`${day}-${month}-${year}`}</p></td>
                                                            <td><p>{item?.name || patient?.name}</p></td>
                                                            <td>
                                                                {getBill?.items?.map((items, index) => (
                                                                    <span key={index} style={{margin:'5px 0'}}>{items?.name || items?.drugs}, </span>
                                                                ))}
                                                            </td>
                                                            <td><p>{!getBill?.totalPrice ? formatted.format(getBill?.items[0]?.totalPrice) : formatted.format(getBill?.totalPrice)}</p></td>
                                                            {/* <td><p>{item?.mode}</p></td> */}
                                                            <td><p></p></td>
                                                        </tr>
                                                    </tbody>
                                                )  
                                            }else if(sort === 'consumables' && getBill?.profit !== 0){
                                                return(
                                                    <tbody key={i}>
                                                        <tr>
                                                            
                                                            <td><p>{timeString}, {`${day}-${month}-${year}`}</p></td>
                                                            <td><p>{item?.name || patient?.name}</p></td>
                                                            <td>
                                                                {getBill?.items?.map((items, index) => (
                                                                    <span key={index} style={{margin:'5px 0'}}>{items?.name || items?.drugs}, </span>
                                                                ))}
                                                            </td>
                                                            <td><p>{!getBill?.totalPrice ? formatted.format(getBill?.items[0]?.totalPrice) : formatted.format(getBill?.totalPrice)}</p></td>
                                                            {/* <td><p>{item?.mode}</p></td> */}
                                                            <td><p></p></td>
                                                        </tr>
                                                    </tbody>
                                                )  
                                            }else if(sort === 'CHURCH'){
                                                return(
                                                    <tbody key={i}>
                                                        <tr>
                                                            
                                                            <td><p>{timeString}, {`${day}-${month}-${year}`}</p></td>
                                                            <td><p>{item?.name || patient?.name}</p></td>
                                                            <td>
                                                                {getBill?.items?.map((items, index) => (
                                                                    <span key={index} style={{margin:'5px 0'}}>{items?.name || items?.drugs}, </span>
                                                                ))}
                                                            </td>
                                                            <td><p>{!getBill?.totalPrice ? formatted.format(getBill?.items[0]?.totalPrice) : formatted.format(getBill?.totalPrice)}</p></td>
                                                            {/* <td><p>{item?.mode}</p></td> */}
                                                            <td><p></p></td>
                                                        </tr>
                                                    </tbody>
                                                )  
                                            }else if(sort === ''){
                                                return(
                                                    <tbody key={i}>
                                                        <tr>
                                                            
                                                            <td><p>{timeString}, {`${day}-${month}-${year}`}</p></td>
                                                            <td><p>{item?.name || patient?.name}</p></td>
                                                            <td>
                                                                {getBill?.items?.map((items, index) => (
                                                                    <span key={index} style={{margin:'5px 0'}}>{items?.name || items?.drugs}, </span>
                                                                ))}
                                                            </td>
                                                            <td><p>{!getBill?.totalPrice ? formatted.format(getBill?.items[0]?.totalPrice) : formatted.format(getBill?.totalPrice)}</p></td>
                                                            {/* <td><p>{item?.mode}</p></td> */}
                                                            <td><p></p></td>
                                                        </tr>
                                                    </tbody>
                                                )  
                                            }else{
                                                return null
                                            }

                                                                
                                        }else if(item?.type === 'lab'){
                                            const getBill = JSON.parse(item?.services) 
                                            const getTotal = getBill?.length > 0  ? getBill?.reduce((sum, item)=> sum + item.price, 0) : 0

                                            const formatted5 = new Intl.NumberFormat('en-NG', {
                                                style: 'currency',
                                                currency: 'NGN',
                                                minimumFractionDigits: 0,
                                                maximumFractionDigits: 0
                                            }).format(getTotal);


                                            const date = new Date(Number(item?.timeStamp))
                                            const day = date.getDate()
                                            const month = date.getMonth() + 1
                                            const year = date.getFullYear()
                                            const date1 = new Date(Number(item?.timeStamp))

                                            let hours = date1.getHours()
                                            const minutes = date1.getMinutes()
                                            const ampm = hours >= 12 ? "PM" : "AM"

                                            hours = hours % 12
                                            hours = hours ? hours : 12

                                            const pad = (n) => n.toString().padStart(2, '0')

                                            const timeString = `${pad(hours)}:${pad(minutes)} ${ampm}`
                                            const patient = getPatient?.find((pat)=> pat?._id === item?.uid) 
                                            return(
                                                <tbody key={i}>
                                                    <tr>
                                                        
                                                        <td><p>{timeString}, {`${day}-${month}-${year}`}</p></td>
                                                        <td><p>{item?.name || patient?.name}</p></td>
                                                        <td>
                                                            {   getBill?.length > 0 &&
                                                                getBill?.map((items, index) => (
                                                                    <span key={index} style={{margin:'5px 0'}}>{items?.testname}, </span>
                                                                ))
                                                            }
                                                        </td>
                                                        <td><p>{formatted5}</p></td>
                                                        {/* <td><p>{item?.mode}</p></td> */}
                                                        <td><p></p></td>
                                                    </tr>
                                                </tbody>
                                            ) 
                                        }else if(item.type === 'scan'){
                                            const getBill = JSON.parse(item?.services) 
                                            const getTotal = getBill?.length > 0  ? getBill?.reduce((sum, item)=> sum + item.price, 0) : getBill?.price

                                            const formatted5 = new Intl.NumberFormat('en-NG', {
                                                style: 'currency',
                                                currency: 'NGN',
                                                minimumFractionDigits: 0,
                                                maximumFractionDigits: 0
                                            }).format(getTotal);
                                            
                                            const date = new Date(Number(item?.timeStamp))
                                            const day = date.getDate()
                                            const month = date.getMonth() + 1
                                            const year = date.getFullYear()
                                            const date1 = new Date(Number(item?.timeStamp))

                                            let hours = date1.getHours()
                                            const minutes = date1.getMinutes()
                                            const ampm = hours >= 12 ? "PM" : "AM"

                                            hours = hours % 12
                                            hours = hours ? hours : 12

                                            const pad = (n) => n.toString().padStart(2, '0')

                                            const timeString = `${pad(hours)}:${pad(minutes)} ${ampm}`
                                            const patient = getPatient?.find((pat)=> pat?._id === item?.uid) 

                                            return(
                                                <tbody key={i}>
                                                    <tr>
                                                        
                                                        <td><p>{timeString}, {`${day}-${month}-${year}`}</p></td>
                                                        <td><p>{item?.name || patient?.name}</p></td>
                                                        <td>
                                                            <div>
                                                                {   getBill?.length > 0 ?
                                                                    getBill?.map((items, index) => (
                                                                        <span key={index} style={{margin:'5px 0'}}>{items?.testname}, </span>
                                                                    ))
                                                                    :
                                                                    <span>{getBill?.testname}</span>
                                                                }
                                                            </div>
                                                        </td>
                                                        <td><p>{formatted5}</p></td>
                                                        {/* <td><p>{item?.mode}</p></td> */}
                                                        <td><p></p></td>
                                                    </tr>
                                                </tbody>
                                            )  
                                        }
                                    })
                                : null
                            }
                        </>
                        :
                         filteredData?.length > 0 ?
                            paginatedData?.sort((a, b)=> b.timeStamp - a.timeStamp).map((item, i)=>{

                                if(item?.type !== 'lab' && item?.type !== 'scan'){
                                    
                                    const getBill = JSON.parse(item?.services) 

                                    const formatted = new Intl.NumberFormat('en-NG', {
                                        style: 'currency',
                                        currency: 'NGN',
                                        minimumFractionDigits: 0,
                                        maximumFractionDigits: 0
                                    })

                                    const date = new Date(Number(item?.timeStamp))
                                    const day = date.getDate() 
                                    const month = date.getMonth() + 1
                                    const year = date.getFullYear()
                                    const date1 = new Date(Number(item?.timeStamp))

                                    let hours = date1.getHours()
                                    const minutes = date1.getMinutes()
                                    const ampm = hours >= 12 ? "PM" : "AM"

                                    hours = hours % 12
                                    hours = hours ? hours : 12

                                    const pad = (n) => n.toString().padStart(2, '0')

                                    const timeString = `${pad(hours)}:${pad(minutes)} ${ampm}`

                                    const patient = getPatient?.find((pat)=> pat?._id === item?.uid) 

                                    const getcard = getBill?.items?.filter((items)=> items?.name?.toLowerCase().includes('card'))
                                    const getconsult = getBill?.items?.filter((items)=> items?.name?.toLowerCase().includes('consultation'))
                                    const getdrugs = getBill?.items?.filter((items)=> !items?.name?.toLowerCase().includes('consultation') && !items?.name?.toLowerCase().includes('card'))

                                    if(getcard?.length > 0 && sort === 'cards'){
                                        return(
                                            <tbody key={i}>
                                                <tr>
                                                    
                                                    <td><p>{timeString}, {`${day}-${month}-${year}`}</p></td>
                                                    <td><p>{item?.name || patient?.name}</p></td>
                                                    <td>
                                                        {getBill?.items?.map((items, index) => (
                                                            <span key={index} style={{margin:'5px 0'}}>{items?.name || items?.drugs}, </span>
                                                        ))}
                                                    </td>
                                                    <td><p>{!getBill?.totalPrice ? formatted.format(getBill?.items[0]?.totalPrice) : formatted.format(getBill?.totalPrice)}</p></td>
                                                    <td><p>{item?.mode}</p></td>
                                                </tr>
                                            </tbody>
                                        )  
                                    }else if(getconsult?.length > 0 && sort === 'consultation'){
                                        return(
                                            <tbody key={i}>
                                                <tr>
                                                    
                                                    <td><p>{timeString}, {`${day}-${month}-${year}`}</p></td>
                                                    <td><p>{item?.name || patient?.name}</p></td>
                                                    <td>
                                                        {getBill?.items?.map((items, index) => (
                                                            <span key={index} style={{margin:'5px 0'}}>{items?.name || items?.drugs}, </span>
                                                        ))}
                                                    </td>
                                                    <td><p>{!getBill?.totalPrice ? formatted.format(getBill?.items[0]?.totalPrice) : formatted.format(getBill?.totalPrice)}</p></td>
                                                    <td><p>{item?.mode}</p></td>
                                                </tr>
                                            </tbody>
                                        )  
                                    }else if(sort === 'payout'){
                                        return(
                                            <tbody key={i}>
                                                <tr>
                                                    
                                                    <td><p>{timeString}, {`${day}-${month}-${year}`}</p></td>
                                                    <td><p>{item?.name || patient?.name}</p></td>
                                                    <td>
                                                        {getBill?.items?.map((items, index) => (
                                                            <span key={index} style={{margin:'5px 0'}}>{items?.name || items?.drugs}, </span>
                                                        ))}
                                                    </td>
                                                    <td><p>{!getBill?.totalPrice ? formatted.format(getBill?.items[0]?.totalPrice) : formatted.format(getBill?.totalPrice)}</p></td>
                                                    <td><p>{item?.mode}</p></td>
                                                </tr>
                                            </tbody>
                                        )  
                                    }else if(getdrugs?.length > 0 && sort === 'drugs' && item?.doctorID){
                                        return(
                                            <tbody key={i}>
                                                <tr>
                                                    
                                                    <td><p>{timeString}, {`${day}-${month}-${year}`}</p></td>
                                                    <td><p>{item?.name || patient?.name}</p></td>
                                                    <td>
                                                        {getBill?.items?.map((items, index) => (
                                                            <span key={index} style={{margin:'2px 0'}}>{items?.name || items?.drugs}, </span>
                                                        ))}
                                                    </td>
                                                    <td><p>{!getBill?.totalPrice ? formatted.format(getBill?.items[0]?.totalPrice) : formatted.format(getBill?.totalPrice)}</p></td>
                                                    <td><p>{item?.mode}</p></td>
                                                </tr>
                                            </tbody>
                                        )  
                                    }else if(sort === 'utils' && getBill?.profit === 0){
                                        return(
                                            <tbody key={i}>
                                                <tr>
                                                    
                                                    <td><p>{timeString}, {`${day}-${month}-${year}`}</p></td>
                                                    <td><p>{item?.name || patient?.name}</p></td>
                                                    <td>
                                                        {getBill?.items?.map((items, index) => (
                                                            <span key={index} style={{margin:'5px 0'}}>{items?.name || items?.drugs}, </span>
                                                        ))}
                                                    </td>
                                                    <td><p>{!getBill?.totalPrice ? formatted.format(getBill?.items[0]?.totalPrice) : formatted.format(getBill?.totalPrice)}</p></td>
                                                    <td><p>{item?.mode}</p></td>
                                                </tr>
                                            </tbody>
                                        )  
                                    }else if(sort === 'consumables' && getBill?.profit !== 0){
                                        return(
                                            <tbody key={i}>
                                                <tr>
                                                    
                                                    <td><p>{timeString}, {`${day}-${month}-${year}`}</p></td>
                                                    <td><p>{item?.name || patient?.name}</p></td>
                                                    <td>
                                                        {getBill?.items?.map((items, index) => (
                                                            <span key={index} style={{margin:'5px 0'}}>{items?.name || items?.drugs}, </span>
                                                        ))}
                                                    </td>
                                                    <td><p>{!getBill?.totalPrice ? formatted.format(getBill?.items[0]?.totalPrice) : formatted.format(getBill?.totalPrice)}</p></td>
                                                    <td><p>{item?.mode}</p></td>
                                                </tr>
                                            </tbody>
                                        )  
                                    }else if(sort === 'CHURCH'){
                                        return(
                                            <tbody key={i}>
                                                <tr>
                                                    
                                                    <td><p>{timeString}, {`${day}-${month}-${year}`}</p></td>
                                                    <td><p>{item?.name || patient?.name}</p></td>
                                                    <td>
                                                        {getBill?.items?.map((items, index) => (
                                                            <span key={index} style={{margin:'5px 0'}}>{items?.name || items?.drugs}, </span>
                                                        ))}
                                                    </td>
                                                    <td><p>{!getBill?.totalPrice ? formatted.format(getBill?.items[0]?.totalPrice) : formatted.format(getBill?.totalPrice)}</p></td>
                                                    <td><p>{item?.mode}</p></td>
                                                </tr>
                                            </tbody>
                                        )  
                                    }else if(sort === ''){
                                        return(
                                            <tbody key={i}>
                                                <tr>
                                                    
                                                    <td><p>{timeString}, {`${day}-${month}-${year}`}</p></td>
                                                    <td><p>{item?.name || patient?.name}</p></td>
                                                    <td>
                                                        {getBill?.items?.map((items, index) => (
                                                            <span key={index} style={{margin:'5px 0'}}>{items?.name || items?.drugs}, </span>
                                                        ))}
                                                    </td>
                                                    <td><p>{!getBill?.totalPrice ? formatted.format(getBill?.items[0]?.totalPrice) : formatted.format(getBill?.totalPrice)}</p></td>
                                                    <td><p>{item?.mode}</p></td>
                                                </tr>
                                            </tbody>
                                        )  
                                    }else{
                                        return null
                                    }

                                                        
                                }else if(item?.type === 'lab'){
                                    const getBill = JSON.parse(item?.services) 
                                    const getTotal = getBill?.length > 0  ? getBill?.reduce((sum, item)=> sum + item.price, 0) : 0

                                    const formatted5 = new Intl.NumberFormat('en-NG', {
                                        style: 'currency',
                                        currency: 'NGN',
                                        minimumFractionDigits: 0,
                                        maximumFractionDigits: 0
                                    }).format(getTotal);


                                    const date = new Date(Number(item?.timeStamp))
                                    const day = date.getDate()
                                    const month = date.getMonth() + 1
                                    const year = date.getFullYear()
                                    const date1 = new Date(Number(item?.timeStamp))

                                    let hours = date1.getHours()
                                    const minutes = date1.getMinutes()
                                    const ampm = hours >= 12 ? "PM" : "AM"

                                    hours = hours % 12
                                    hours = hours ? hours : 12

                                    const pad = (n) => n.toString().padStart(2, '0')

                                    const timeString = `${pad(hours)}:${pad(minutes)} ${ampm}`
                                    const patient = getPatient?.find((pat)=> pat?._id === item?.uid) 
                                    return(
                                        <tbody key={i}>
                                            <tr>
                                                
                                                <td><p>{timeString}, {`${day}-${month}-${year}`}</p></td>
                                                <td><p>{item?.name || patient?.name}</p></td>
                                                <td>
                                                    {   getBill?.length > 0 &&
                                                        getBill?.map((items, index) => (
                                                            <span key={index} style={{margin:'5px 0'}}>{items?.testname}, </span>
                                                        ))
                                                    }
                                                </td>
                                                <td><p>{formatted5}</p></td>
                                                <td><p>{item?.mode}</p></td>
                                            </tr>
                                        </tbody>
                                    ) 
                                }else if(item.type === 'scan'){
                                    const getBill = JSON.parse(item?.services) 
                                    const getTotal = getBill?.length > 0  ? getBill?.reduce((sum, item)=> sum + item.price, 0) : getBill?.price

                                    const formatted5 = new Intl.NumberFormat('en-NG', {
                                        style: 'currency',
                                        currency: 'NGN',
                                        minimumFractionDigits: 0,
                                        maximumFractionDigits: 0
                                    }).format(getTotal);
                                    
                                    const date = new Date(Number(item?.timeStamp))
                                    const day = date.getDate()
                                    const month = date.getMonth() + 1
                                    const year = date.getFullYear()
                                    const date1 = new Date(Number(item?.timeStamp))

                                    let hours = date1.getHours()
                                    const minutes = date1.getMinutes()
                                    const ampm = hours >= 12 ? "PM" : "AM"

                                    hours = hours % 12
                                    hours = hours ? hours : 12

                                    const pad = (n) => n.toString().padStart(2, '0')

                                    const timeString = `${pad(hours)}:${pad(minutes)} ${ampm}`
                                    const patient = getPatient?.find((pat)=> pat?._id === item?.uid) 

                                    return(
                                        <tbody key={i}>
                                            <tr>
                                                
                                                <td><p>{timeString}, {`${day}-${month}-${year}`}</p></td>
                                                <td><p>{item?.name || patient?.name}</p></td>
                                                <td>
                                                    <div>
                                                        {   getBill?.length > 0 ?
                                                            getBill?.map((items, index) => (
                                                                <span key={index} style={{margin:'5px 0'}}>{items?.testname}, </span>
                                                            ))
                                                            :
                                                            <span>{getBill?.testname}</span>
                                                        }
                                                    </div>
                                                </td>
                                                <td><p>{formatted5}</p></td>
                                                <td><p>{item?.mode}</p></td>
                                            </tr>
                                        </tbody>
                                    )  
                                }
                            })
                        : null
                    }
                </table>

                
                {paginationSource.length > 0 && (
                    <div className="audit-pagination">

                        <div className="audit-pagination-info">
                            <span>
                                Showing{" "}
                                <strong>
                                    {Math.min(startIndex + 1, sortedPaginationSource.length)}
                                </strong>
                                {" "}–{" "}
                                <strong>
                                    {Math.min(endIndex, sortedPaginationSource.length)}
                                </strong>
                                {" "}of{" "}
                                <strong>{sortedPaginationSource.length}</strong>
                            </span>
                        </div>

                        <div className="audit-pagination-controls">

                            <button
                                type="button"
                                className="audit-page-arrow"
                                disabled={currentPage === 1}
                                onClick={() =>
                                    setCurrentPage(prev => Math.max(prev - 1, 1))
                                }
                            >
                                ‹
                            </button>

                            {Array.from(
                                { length: totalPages },
                                (_, index) => index + 1
                            )
                                .filter(page => {
                                    return (
                                        page === 1 ||
                                        page === totalPages ||
                                        Math.abs(page - currentPage) <= 1
                                    );
                                })
                                .map((page, index, pages) => {

                                    const previousPage = pages[index - 1];

                                    return (
                                        <React.Fragment key={page}>

                                            {previousPage &&
                                                page - previousPage > 1 && (
                                                    <span className="audit-page-dots">
                                                        ...
                                                    </span>
                                                )}

                                            <button
                                                type="button"
                                                className={`audit-page-number ${
                                                    currentPage === page
                                                        ? "active"
                                                        : ""
                                                }`}
                                                onClick={() => setCurrentPage(page)}
                                            >
                                                {page}
                                            </button>

                                        </React.Fragment>
                                    );
                                })}

                            <button
                                type="button"
                                className="audit-page-arrow"
                                disabled={currentPage === totalPages}
                                onClick={() =>
                                    setCurrentPage(prev =>
                                        Math.min(prev + 1, totalPages)
                                    )
                                }
                            >
                                ›
                            </button>

                        </div>

                        <div className="audit-rows-selector">

                            <span>Rows</span>

                            <select
                                value={rowsPerPage}
                                onChange={(e) => {
                                    setRowsPerPage(Number(e.target.value));
                                    setCurrentPage(1);
                                }}
                            >
                                <option value={10}>10</option>
                                <option value={20}>20</option>
                                <option value={30}>30</option>
                                <option value={50}>50</option>
                                <option value={100}>100</option>
                            </select>

                        </div>

                    </div>
                )}
            </div>

        </div>
  )
}

export default Audits