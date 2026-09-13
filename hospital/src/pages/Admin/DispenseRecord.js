import React, { useEffect, useState } from 'react'
import AdminBar from '../../components/AdminBar'
import { FaArrowLeft, FaBackward, FaSearch, FaUser } from 'react-icons/fa'
import axios from 'axios'

function DispensingRecords() {

    const cip = window.location.hostname

    const [records, setRecords] = useState([])
    const [search, setSearch] = useState('')
    const [selectedRecord, setSelectedRecord] = useState(null)
    const [loading, setLoading] = useState(false)

    // ============================================================
    // GET DISPENSING RECORDS
    // ============================================================

    useEffect(() => {

        const getRecords = async () => {

            try {

                setLoading(true)

                const response = await axios.post(
                    `http://${cip || 'localhost'}:7700/getDispensing`
                )
                console.log(response)
                if (response.data.status === 'success') {
                    setRecords(response.data.records || [])
                }

            } catch (error) {

                console.log('Error getting dispensing records:', error)

            } finally {

                setLoading(false)

            }
        }

        getRecords()

    }, [cip])


    // ============================================================
    // DATE
    // ============================================================

    const formatDate = (date) => {

        if (!date) return '---'

        const d = new Date(date)

        return d.toLocaleDateString('en-NG', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        })
    }


    // ============================================================
    // TIME
    // ============================================================

    const formatTime = (date) => {

        if (!date) return '---'

        const d = new Date(date)

        return d.toLocaleTimeString('en-NG', {
            hour: '2-digit',
            minute: '2-digit'
        })
    }


    // ============================================================
    // SEARCH
    // ============================================================

    const filteredRecords = records.filter((record) => {

        const staffName =
            record?.staffId?.name ||
            record?.staffName ||
            ''

        const staffTitle =
            record?.staffId?.title ||
            ''

        const patientName =
            record?.patientId?.name ||
            record?.patientName ||
            ''

        const searchValue = search.toLowerCase()

        return (
            staffName.toLowerCase().includes(searchValue) ||
            staffTitle.toLowerCase().includes(searchValue) ||
            patientName.toLowerCase().includes(searchValue)
        )

    })


    return (

        <div className='dashboard_container'>

            <AdminBar />

            <div className='dashboard_body'>

                {/* ============================================================
                    HEADER
                ============================================================ */}

                <div className='dashboard_body_header'>

                    <div className='dashboard_body_header_search'>

                        
                        <button onClick={()=> window.history.back()} className='dashboard_body_header_button' > <FaArrowLeft/> Back</button>

                    </div>

                </div>


                {/* ============================================================
                    TITLE
                ============================================================ */}

                <h3>DISPENSING RECORDS</h3>


                {/* ============================================================
                    TABLE HEADER
                ============================================================ */}

                <div
                    className='drug_top_label'
                    style={{ width: '100%' }}
                >

                    <h4
                        style={{
                            width: '20%',
                            textAlign: 'center'
                        }}
                    >
                        STAFF
                    </h4>

                    <h4
                        style={{
                            width: '20%',
                            textAlign: 'center'
                        }}
                    >
                        PATIENT
                    </h4>

                    <h4
                        style={{
                            width: '15%',
                            textAlign: 'center'
                        }}
                    >
                        ITEMS
                    </h4>

                    <h4
                        style={{
                            width: '15%',
                            textAlign: 'center'
                        }}
                    >
                        QUANTITY
                    </h4>

                    <h4
                        style={{
                            width: '15%',
                            textAlign: 'center'
                        }}
                    >
                        DATE
                    </h4>

                    <h4
                        style={{
                            width: '15%',
                            textAlign: 'center'
                        }}
                    >
                        ACTION
                    </h4>

                </div>


                {/* ============================================================
                    RECORDS
                ============================================================ */}

                <div>

                    {
                        loading ?

                            <div style={{
                                width: '100%',
                                textAlign: 'center',
                                padding: '30px'
                            }}>
                                Loading dispensing records...
                            </div>

                        :

                        filteredRecords.length > 0 ?

                            filteredRecords
                                .sort(
                                    (a, b) =>
                                        new Date(b.dispensedAt) -
                                        new Date(a.dispensedAt)
                                )
                                .map((record, i) => (

                                    <div
                                        key={record?._id || i}
                                        className='drug_top_label'
                                        style={{
                                            width: '100%',
                                            alignItems: 'center'
                                        }}
                                    >

                                        {/* STAFF */}

                                        <div
                                            style={{
                                                width: '20%',
                                                textAlign: 'center'
                                            }}
                                        >

                                            <strong>
                                                {
                                                    record?.staffId?.name ||
                                                    record?.staffName ||
                                                    'Unknown Staff'
                                                }
                                            </strong>

                                            <div
                                                style={{
                                                    fontSize: '12px',
                                                    opacity: 0.7
                                                }}
                                            >
                                                {
                                                    record?.staffId?.title ||
                                                    ''
                                                }
                                            </div>

                                        </div>


                                        {/* PATIENT */}

                                        <div
                                            style={{
                                                width: '20%',
                                                textAlign: 'center'
                                            }}
                                        >

                                            {
                                                record?.patientId?.name ||
                                                record?.patientName ||
                                                'Unknown Patient'
                                            }

                                        </div>


                                        {/* ITEMS */}

                                        <div
                                            style={{
                                                width: '15%',
                                                textAlign: 'center'
                                            }}
                                        >

                                            {
                                                record?.items?.length || 0
                                            }

                                        </div>


                                        {/* QUANTITY */}

                                        <div
                                            style={{
                                                width: '15%',
                                                textAlign: 'center'
                                            }}
                                        >

                                            {
                                                record?.totalQuantity || 0
                                            }

                                        </div>


                                        {/* DATE */}

                                        <div
                                            style={{
                                                width: '15%',
                                                textAlign: 'center'
                                            }}
                                        >

                                            <div>
                                                {
                                                    formatDate(
                                                        record?.dispensedAt
                                                    )
                                                }
                                            </div>

                                            <div
                                                style={{
                                                    fontSize: '12px',
                                                    opacity: 0.7
                                                }}
                                            >
                                                {
                                                    formatTime(
                                                        record?.dispensedAt
                                                    )
                                                }
                                            </div>

                                        </div>


                                        {/* ACTION */}

                                        <div
                                            style={{
                                                width: '15%',
                                                textAlign: 'center'
                                            }}
                                        >

                                            <button
                                                className='add_staff_contaimer_button'
                                                onClick={() =>
                                                    setSelectedRecord(record)
                                                }
                                                style={{
                                                    color: 'blue',
                                                    background: 'whitesmoke'
                                                }}
                                            >
                                                VIEW
                                            </button>

                                        </div>

                                    </div>

                                ))

                        :

                            <div style={{
                                width: '100%',
                                textAlign: 'center',
                                padding: '30px'
                            }}>
                                No dispensing records found
                            </div>
                    }

                </div>


                {/* ============================================================
                    DETAILS MODAL
                ============================================================ */}

                {
                    selectedRecord &&

                    <div
                        style={{
                            position: 'absolute',
                            width: '100%',
                            height: '100%',
                            display: 'flex',
                            flexDirection: 'column',
                            backgroundColor: 'transparent',
                            top: '0',
                            left: '0',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}
                    >

                        <div
                            style={{
                                width: '700px',
                                maxHeight: '85vh',
                                overflowY: 'auto',
                                display: 'flex',
                                flexDirection: 'column',
                                backgroundColor: 'cadetblue',
                                padding: '20px'
                            }}
                        >

                            {/* ====================================================
                                STAFF DETAILS
                            ==================================================== */}

                            <div className='patient_details_input_field1_'>

                                <h4>DISPENSED BY</h4>

                                <div
                                    style={{
                                        fontSize: '18px',
                                        fontWeight: 'bold'
                                    }}
                                >
                                    {
                                        selectedRecord?.staffId?.name ||
                                        selectedRecord?.staffName ||
                                        'Unknown Staff'
                                    }
                                </div>

                                <div
                                    style={{
                                        fontSize: '13px',
                                        opacity: 0.8
                                    }}
                                >
                                    {
                                        selectedRecord?.staffId?.title ||
                                        ''
                                    }
                                </div>

                            </div>


                            {/* ====================================================
                                PATIENT
                            ==================================================== */}

                            <div className='patient_details_input_field1_'>

                                <h4>PATIENT</h4>

                                <div>
                                    {
                                        selectedRecord?.patientId?.name ||
                                        selectedRecord?.patientName ||
                                        'Unknown Patient'
                                    }
                                </div>

                            </div>


                            {/* ====================================================
                                BILL
                            ==================================================== */}

                            <div className='patient_details_input_field1_'>

                                <h4>BILL ID</h4>

                                <div>
                                    {
                                        selectedRecord?.billId ||
                                        '---'
                                    }
                                </div>

                            </div>


                            {/* ====================================================
                                DATE
                            ==================================================== */}

                            <div className='patient_details_input_field1_'>

                                <h4>DISPENSED ON</h4>

                                <div>

                                    {
                                        formatDate(
                                            selectedRecord?.dispensedAt
                                        )
                                    }

                                    {' '}

                                    {

                                        formatTime(
                                            selectedRecord?.dispensedAt
                                        )

                                    }

                                </div>

                            </div>


                            {/* ====================================================
                                ITEMS
                            ==================================================== */}

                            <h4
                                style={{
                                    marginTop: '15px',
                                    marginBottom: '10px'
                                }}
                            >
                                DISPENSED ITEMS
                            </h4>


                            <div
                                style={{
                                    width: '100%'
                                }}
                            >

                                {
                                    selectedRecord?.items?.map(
                                        (item, index) => (

                                            <div
                                                key={index}
                                                className='drug_top_label'
                                                style={{
                                                    width: '100%',
                                                    marginBottom: '5px',
                                                    alignItems: 'center'
                                                }}
                                            >

                                                <div
                                                    style={{
                                                        width: '50%'
                                                    }}
                                                >
                                                    {
                                                        item?.name
                                                    }
                                                </div>

                                                <div
                                                    style={{
                                                        width: '20%',
                                                        textAlign: 'center'
                                                    }}
                                                >
                                                    Qty: {
                                                        item?.quantity
                                                    }
                                                </div>

                                                <div
                                                    style={{
                                                        width: '30%',
                                                        textAlign: 'right'
                                                    }}
                                                >
                                                    ₦
                                                    {
                                                        Number(
                                                            item?.sellingPrice ||
                                                            0
                                                        ).toLocaleString(
                                                            'en-NG'
                                                        )
                                                    }
                                                </div>

                                            </div>

                                        )
                                    )
                                }

                            </div>


                            {/* ====================================================
                                TOTAL
                            ==================================================== */}

                            <div
                                style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    marginTop: '15px',
                                    padding: '15px 0',
                                    borderTop: '1px solid rgba(255,255,255,0.3)'
                                }}
                            >

                                <strong>
                                    TOTAL QUANTITY
                                </strong>

                                <strong>
                                    {
                                        selectedRecord?.totalQuantity || 0
                                    }
                                </strong>

                            </div>


                            {/* ====================================================
                                CLOSE
                            ==================================================== */}

                            <button
                                className='add_staff_contaimer_button'
                                onClick={() =>
                                    setSelectedRecord(null)
                                }
                                style={{
                                    color: 'blue',
                                    background: 'whitesmoke',
                                    marginTop: '15px'
                                }}
                            >
                                CLOSE
                            </button>

                        </div>

                    </div>

                }

            </div>

        </div>
    )
}

export default DispensingRecords
