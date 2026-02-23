import React, { useEffect, useState } from 'react'
import { ChevronDown, User } from 'react-feather'
import { Modal, ModalHeader, ModalBody, Button, Badge } from 'reactstrap'
import StatsHorizontal from '@components/widgets/stats/StatsHorizontal'
import DataTable from 'react-data-table-component'
import moment from 'moment'
import Avatar from '@components/avatar'
// import BookingModal from './../FrontDesk/BookingModal'
import { useDispatch, useSelector } from 'react-redux'
import { storeBookingDetails } from "../../redux/voucherSlice"
import MUIDataTable from "mui-datatables";
import axios from '../../API/axios'
import AddHotel from '../FrontDesk/AddHotel'
// shared module-level cache and promise so the API is fetched only once
let creditDetailsCache = null
let creditDetailsPromise = null
const CardDetail = (props) => {
    const getUserData = useSelector(state => state.userManageSlice.userData)
    console.log('propsbbb', props);
    const { LoginID, Token } = getUserData
    // console.log(props)
    const [open, setOpen] = useState(false)
    const handleOpen = () => setOpen(!open)
    const [sel_bookingID, setSel_bookingID] = useState('')
    const dispatch = useDispatch();
    const [show, setShow] = useState(false)
    const [bookingStatus, setBookingStatus] = useState('')
    const PaymentColumn = [
        {
            center: true,
            width: '80px',
            sortable: row => row.guestName,
            cell: (row, i) => (

                <div className='d-flex align-items-center cursor-pointer'
                    onClick={() => {
                        setShow(false)
                        setSel_bookingID(row.bookingID);
                        setBookingStatus(row.status)
                        console.warn("gengarBookingId", row.bookingID)
                        // dispatch(storeBookingDetails({ LoginID, Token, BookingId: row.bookingID }))
                        
                        if (row?.bookingID) {
                            dispatch(
                                storeBookingDetails({
                                    LoginID,
                                    Token,
                                    BookingId: row.bookingID
                                })
                            )
                        }

                        if (row.status === 'OnHold') {
                            handleOnHoldOpne()
                        } else handleOpen()
                    }}>
                    <Avatar
                        title="Click to Manage Booking"
                        icon={<User color='#FFFFFF' size={50} />}
                        color={
                            row.status === 'CheckedIN' ? (
                                'success'
                            ) : row.status === 'CheckedOut' ? (
                                'primary'
                            ) : row.status === 'Cancelled' ? (
                                'danger'
                            ) : row.status === 'Reserved' && row.checkIn === false ? (
                                'warning'
                            ) : row.status === 'OnHold' ? (
                                'info'
                            ) : '#000'
                        }
                    />
                </div>
            )
        },
        {
            name: 'Booking Status',
            minWidth: '12rem',
            center: true,
            sortable: true,
            selector: row => row.status,
            cell: row => {
                return (
                    <>
                        {
                            row.status === 'CheckedIN' ? (
                                <Badge color='success'>Checked In</Badge>
                            ) : row.status === 'CheckedOut' ? (
                                <Badge color='primary'>{row.status}</Badge>
                            ) : row.status === 'Cancelled' ? (
                                <Badge color='danger'> {row.status}</Badge>
                            ) : row.status === 'Reserved' && row.checkIn === false ? (
                                <Badge color='light-warning'>Reserved</Badge>
                            ) : row.status === 'OnHold' ? (
                                <Badge color='light-info'>{row.status}</Badge>
                            ) : <Badge color='light-secondary'>{row.status}</Badge>
                        }
                    </>
                )
            }
        },
        {
            name: 'Booking ID',
            minWidth: '210px',
            sortable: row => row.bookingID,
            selector: row => row.bookingID
        },
        {
            name: 'Guest Name',
            sortable: true,
            minWidth: '165px',
            selector: row => row.guestName
        },
        {
            name: 'Check-In Date',
            sortable: true,
            minWidth: '165px',
            selector: (row) => (
                <>
                    <p>{moment(row.checkInDate).format("LL")}</p>
                </>
            ),
        },
        {
            name: 'Check-Out Date',
            sortable: true,
            minWidth: '165px',
            selector: (row) => (
                <>
                    <p>{moment(row.checkOutDate).format("LL")}</p>
                </>
            ),
        },
        {
            name: 'Room',
            minWidth: '120px',
            selector: row => row.roomDisplayName
        },
        {
            name: 'Status',
            sortable: true,
            minWidth: '120px',
            selector: row => row.status
        }
    ]


    const [cardType, setCardType] = useState('')


    function subtractMonths(date, months) {
        date.setMonth(date.getMonth() - months);
        return date;
    }

    const [creditData, setCreditData] = useState([])


    // console.log(moment(subtractMonths(new Date(), 1)).format("YYYY-MM-DD"));
    // const [fromDate, setFromDate] = useState(moment(subtractMonths(new Date(), 1)).format('YYYY-MM-DD'))
    // const [toDate, setToDate] = useState(moment(new Date()).format('YYYY-MM-DD'))
    const getcreditData = async () => {
        // If cached, use it
        if (creditDetailsCache) {
            setCreditData(creditDetailsCache)
            return
        }

        // If a fetch is already in-flight, wait for it
        if (creditDetailsPromise) {
            try {
                const data = await creditDetailsPromise
                setCreditData(data)
            } catch (err) {
                console.log('getcreditData (await existing) error', err)
            }
            return
        }

        // Start a fetch and store the promise so other instances can await it
        creditDetailsPromise = (async () => {
            try {
                const from = moment(subtractMonths(new Date(), 1)).format('YYYY-MM-DD')
                const to = moment(new Date()).format('YYYY-MM-DD')
                const res = await axios.get(
                    `/Reports/CreditDetails?FromDate=${from}&ToDate=${to}`,
                    { headers: { LoginID, Token } }
                )
                const data = res?.data?.[0] || []
                creditDetailsCache = data // cache result for other instances
                return data
            } catch (error) {
                // clear promise so future attempts can retry
                creditDetailsPromise = null
                throw error
            }
        })()

        try {
            const data = await creditDetailsPromise
            setCreditData(data)
        } catch (error) {
            console.log('getcreditData error', error)
        }
    }

    // Run once when credentials are available (re-run if LoginID/Token change)
    useEffect(() => {
        if (!LoginID || !Token) return
        getcreditData()
        // intentionally not including getcreditData in deps (uses module-level cache/promise)
    }, [LoginID, Token])

    const columns = [
        {
            name: "bookingId",
            label: "Booking ID",
        },
        {
            name: "bookingTime",
            label: "Booking Date",
        },
        {
            name: "guestName",
            label: "Guest Name",
        },
        {
            name: "bill Amount",
            label: "Bill Amount",
            options: {
                customBodyRenderLite: (dataIndex) => {
                    const val = creditData?.[dataIndex]?.["bill Amount"]
                    return val != null ? Number(val).toFixed(2) : "0.00"
                },
            },
        },
        {
            name: "pendingAmount",
            label: "Pending Amount",
        },
        // {
        //     name: "AmountExpectedDate",
        //     label: "Amount Expected Date",
        // },
    ];
    const options = {
        filterType: 'dropdown',
        download: true,
    };
    // console.log(props, props?.dataArr);
    return (
        <>
            <div className='earnings-card d-flex flex-column align-items-stretch' key={props.id} onClick={() => {
                setShow(!show)
                // console.log('click')
            }}>
                <StatsHorizontal
                    color='primary'
                    statTitle={props.title}
                    icon={props.icon}
                    renderStats={props.id === "1" || props.id === "2" || props.id === "3" ? (
                        <h3 className='fw-bolder mb-75'>{props?.dataArr && props.dataArr?.length}</h3>
                        // <h3 className='fw-bolder mb-75'>78</h3>
                    ) : props.id === "4" ? (
                        <h3 className='fw-bolder mb-75'>{props?.dataArr && (props?.dataArr[0]?.todayEarning === null ? 0 : props?.dataArr[0]?.todayEarning)}</h3>
                    ) : props.id === "5" ? (
                        <h3 className='fw-bolder mb-75'>{props?.dataArr && (props?.dataArr[0]?.monthlyEarning === null ? 0 : props?.dataArr[0]?.monthlyEarning)}</h3>
                    ) : props.id === "6" ? (
                        <h3 className='fw-bolder mb-75'>{props?.dataArr && (props?.dataArr[0]?.todayDeparture === null ? 0 : props?.dataArr[0]?.todayDeparture)}</h3>
                    ) : props.id === "7" ? (
                        <h3 className='fw-bolder mb-75'>{props?.dataArr && (props?.dataArr[0]?.creditPendingAmount === null ? 0 : props?.dataArr[0]?.creditPendingAmount)}</h3>
                        // <h3 className='fw-bolder mb-75'>100</h3>
                    ) : 0}
                // renderStats={
                //     <h3 className='fw-bolder mb-75'>{props?.dataArr && props.dataArr[0]?.CreditPendingAmount}</h3>
                // }
                />
            </div>
            <Modal
                isOpen={props.id === "1" || props.id === "2" || props.id === "3" ? show : false}
                toggle={() => setShow(!show)}
                className='modal-dialog-centered'
                onClosed={() => setCardType('')}
                size='lg'
                backdrop={false}
            >
                <ModalHeader className='bg-transparent border-bottom' toggle={() => setShow(!show)}>
                    <p>{props.title}</p>
                </ModalHeader>
                <ModalBody>
                    {cardType !== '' && cardType !== 'unknown' ? (
                        <InputGroupText className='p-25'>
                            <span className='add-card-type'>
                                <img height='24' alt='card-type' src={cardsObj[cardType]} />
                            </span>
                        </InputGroupText>
                    ) : null}
                    <div className='react-dataTable'>
                        <DataTable
                            noHeader
                            columns={PaymentColumn}
                            className='react-dataTable'
                            sortIcon={<ChevronDown size={10} />}
                            data={props?.dataArr && props?.dataArr}
                        />
                        <AddHotel bookingID={sel_bookingID} open={open} handleOpen={handleOpen} bookingStatus={bookingStatus} />
                    </div>
                    <div className='my-50 d-flex justify-content-end'>
                        <Button color='primary' onClick={e => {
                            e.preventDefault()
                            setShow(!show)
                        }}>Close</Button>

                    </div>
                </ModalBody>
            </Modal>
            <Modal
                isOpen={props.id === "7" ? show : false}
                toggle={() => setShow(!show)}
                className='modal-dialog-centered'
                onClosed={() => setCardType('')}
                size='lg'
                backdrop={false}
            >
                <ModalHeader className='bg-transparent border-bottom' toggle={() => setShow(!show)}>
                    <p>{props.title}</p>
                </ModalHeader>
                <ModalBody>
                    {cardType !== '' && cardType !== 'unknown' ? (
                        <InputGroupText className='p-25'>
                            <span className='add-card-type'>
                                <img height='24' alt='card-type' src={cardsObj[cardType]} />
                            </span>
                        </InputGroupText>
                    ) : null}
                    <div className='react-dataTable'>
                        {/* <DataTable
                            noHeader
                            columns={PaymentColumn}
                            className='react-dataTable'
                            sortIcon={<ChevronDown size={10} />}
                            data={props?.dataArr && props?.dataArr}
                        /> */}
                        <MUIDataTable
                            // title={"Booking Report"}
                            data={creditData}
                            columns={columns}
                            options={options}
                        />
                        <AddHotel bookingID={sel_bookingID} open={open} handleOpen={handleOpen} bookingStatus={bookingStatus} />
                    </div>
                    <div className='my-50 d-flex justify-content-end'>
                        <Button color='primary' onClick={e => {
                            e.preventDefault()
                            setShow(!show)
                        }}>Close</Button>

                    </div>
                </ModalBody>
            </Modal>
            {
                (props.id === "1" || props.id === "2" || props.id === "3" ? show : false) ? (
                    <div className="modal-backdrop fade show" ></div>
                ) : null
            }
            {open && <AddHotel open={open} handleOpen={handleOpen} bookingID={sel_bookingID} bookingStatus={bookingStatus} />}
        </>
    )
}

export default CardDetail