import moment from 'moment'
import { React, useEffect, useState } from 'react'
import { Accordion, AccordionBody, AccordionHeader, AccordionItem, Badge, Button, Card, CardBody, CardHeader, Col, Modal, ModalBody, Row } from 'reactstrap'
import RevModal from './RevModal'
import axios from '../../API/axios'
import { useDispatch, useSelector } from 'react-redux'
import Avatar from '@components/avatar'
import DataTable from 'react-data-table-component'
import { storeBookingDetails } from '../../redux/voucherSlice'
// import BookingModal from '../FrontDesk/BookingModal'
import { ChevronDown, User, RefreshCcw } from 'react-feather'
import toast from 'react-hot-toast'
import AddHotel from '../FrontDesk/AddHotel'

const border = {
  borderBottom: '2px solid #5D3FD3'
}

const NightAudit = () => {
  useEffect(() => {
    const prevTitle = document.title
    document.title = "PMS-Night Audit"

    return () => {
      document.title = prevTitle
    }
  }, [])
  const getUserData = useSelector(state => state.userManageSlice.userData)
  const { LoginID, Token, PropertyID, HotelName } = getUserData

  const acc_data = [
    {
      id: 1,
      title: `Pending Yesterday Check-in`
    },
    {
      id: 2,
      title: `Pending Yesterday Check-out`
    },
    {
      id: 3,
      title: `Stay Over Bookings(Yesterday)`
    },
    {
      id: 4,
      title: `Pending POS Hold Bill Order List (Yesterday)`
    },
  ]

  const dispatch = useDispatch();

  const [open, setOpen] = useState(1)
  const toggle = id => {
    open === id ? setOpen('') : setOpen(id)
  }

  const [revModal, setRevModal] = useState(false)
  const [loading, setLoading] = useState(false)
  const handleRevModal = () => setRevModal(!revModal)

  const [bid, setBid] = useState('')
  const [data, setData] = useState([])
  const [revenue, setRevenue] = useState([])
  const [inData, setInData] = useState([])
  const [outData, setOutData] = useState([])
  const [overBook, setOverBook] = useState([])
  const [holdBill, setHoldBill] = useState([])


  const getNightAuditData = async () => {
    try {
      const res = await axios.get(`/schedule/nightaudit/report/${PropertyID}?PropertyId=${PropertyID}&date=${moment().subtract(1, 'days').format("YYYY-MM-DD")}`, {
        headers: {
          LoginID,
          Token
        }
      })
      console.log('DataRes', res);
      if (res?.data[0].length > 0) {
        let result = res?.data[0]
        setData(res?.data[0])
        result.map(r => {
          if (r.reportName === "Revenue Report") {
            setRevenue(JSON.parse(r.LogJSON))
          } else if (r.reportName === "Pending Checkin Report") {
            setInData(JSON.parse(r.LogJSON))
          } else if (r.reportName === "Pending Checkout Report") {
            setOutData(JSON.parse(r.LogJSON))
          } else if (r.reportName === "PoS Hold Bill Report") {
            setHoldBill(JSON.parse(r.LogJSON))
          } else if (r.reportName === "Stay-Over Booking Report") {
            setOverBook(JSON.parse(r.LogJSON))
          }
        })
      }
    } catch (error) {
      console.log('NightAuditDataError', error)
    }
  }

  const getGenerateReportNightAudit = async () => {
    setLoading(true)
    try {
      const res = await axios.post(`/schedule/nightaudit?PropertyId=${PropertyID}`, {}, {
        headers: {
          LoginID,
          Token
        }
      })
      // console.log('getGenerateReportNightAudit', res);
      if (res.status === 200) {
        toast.success('Generating Report')
        setLoading(false)
      }

      getNightAuditData()
    } catch (error) {
      console.log('NightAuditDataError', error)
      setLoading(false)
    }
  }





  useEffect(() => {
    // getGenerateReportNightAudit()
    getNightAuditData()
  }, [])


  useEffect(() => {
    const lastCallTime = localStorage.getItem('lastCallTime');
    const now = new Date().getTime();

    // Check if it has been more than 24 hours since the last call
    if (!lastCallTime || now - parseInt(lastCallTime, 10) >= 24 * 60 * 60 * 1000) {
      getGenerateReportNightAudit();
      // Update the last call time
      localStorage.setItem('lastCallTime', now.toString());
    } else {
      console.log('Function already called within the last 24 hours');
    }
  }, []);

  const [openModal, setOpenModal] = useState(false)
  const handleOpen = () => setOpenModal(!openModal)

  const columns = [
    {
      center: true,
      width: '80px',
      sortable: row => row.guestName,
      cell: (row, i) => (
        <div className='d-flex align-items-center cursor-pointer'>
          <Avatar
            title="Click to Manage Booking"
            icon={<User color='#FFFFFF' size={25} />}
            color={
              row.status === 'CheckedIN' ? (
                'success'
              ) : row.status === 'CheckedOut' ? (
                'primary'
              ) : row.status === 'Cancelled' ? (
                'danger'
              ) : row.status === 'OnHold' ? (
                'info'
              ) : row.status === 'Reserved' ? (
                'warning'
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
              ) : row.status === 'OnHold' ? (
                <Badge color='light-info'>{row.status}</Badge>
              ) : row.status === 'Reserved' ? (
                <Badge color='light-warning'>Reserved</Badge>
              ) : <Badge color='light-secondary'>{row.status}</Badge>
            }
          </>
        )
      }
    },
    {
      name: 'Booking ID',
      center: true,
      sortable: true,
      minWidth: '200px',
      selector: row => row.bookingID
    },
    {
      name: 'Booking Source',
      center: true,
      sortable: true,
      minWidth: '200px',
      selector: row => row.bookingSource
    },
    {
      name: 'Guest Name',
      center: true,
      sortable: true,
      minWidth: '200px',
      selector: row => (
        <>
          <p>{row.guestName?.toUpperCase()}</p>
        </>
      )
    },
    {
      name: 'Room/s',
      center: true,
      sortable: true,
      minWidth: '200px',
      selector: row => {
        const rooms = row.roomType?.split("; ")
        return (<>
          {
            rooms?.map((r, i) => {
              return <p key={i}>{r}</p>
            })
          }
        </>)
      }
    },
    {
      name: 'Check-In',
      center: true,
      wrap: true,
      sortable: true,
      minWidth: '100px',
      selector: row => (
        <>
          <p>{moment(row.checkInDate).format('LLLL')}</p>
        </>
      )
    },
    {
      name: 'Check-Out',
      center: true,
      wrap: true,
      sortable: true,
      minWidth: '100px',
      selector: row => (
        <>
          <p>{moment(row.checkOutDate).format('LLLL')}</p>
        </>
      )
    }
  ]

  const posColumns = [
    {
      name: 'Id',
      width: '250px ',
      sortable: true,
      selector: row => row.posOrderID,
      cell: row => row.posOrderID
    },
    {
      name: 'Date',
      sortable: true,
      selector: row => moment(row.orderDate).format('l')
    },
    {
      name: 'Served at',
      sortable: true,
      selector: row => row.servedAt,
      cell: row => row.servedAt
    },
    {
      name: 'Total',
      selector: row => row.total
    },
    {
      name: 'Taxes',
      selector: row => row.taxes
    },
    {
      name: 'TotalDue',
      selector: row => row.totalDue
    }
  ]

  return (
    <>
      {/* {console.log('data', data)}
      {console.log('revenue', revenue)}
      {console.log('inData', inData)}
      {console.log('outData', outData)}
      {console.log('overBook', overBook)}
      {console.log('holdBill', holdBill)} */}
      <Card>
        <CardBody className='p-0'>
          <div className='d-flex flex-row flex-wrap justify-content-around align-items-center w-100' style={border}>
            <h4 className='mb-0'>Business Date:- {moment().format("DD-MM-YYYY")}</h4>
            <h4 className='mb-0'>Audit Date:- {moment().subtract(1, 'days').format("DD-MM-YYYY")}</h4>
            <div>
              <Button className='m-1' color='warning' onClick={() => handleRevModal()}>Revenue Report</Button>
              {/* <Button className='m-1' color='primary' disabled={loading} onClick={() => getGenerateReportNightAudit()}>Generate Report</Button> */}
              <RefreshCcw size={15} className='ms-1 me-1 reload' onClick={() => getGenerateReportNightAudit()} />
            </div>
          </div>
        </CardBody>
      </Card>
      <Card>
        <CardBody>
          <Row>
            <Accordion className='accordion-margin' open={open} toggle={toggle}>
              {
                acc_data && acc_data.map(i => {
                  return (
                    <>
                      <AccordionItem key={i.id}>
                        <AccordionHeader targetId={i.id}>
                          {i.title}
                        </AccordionHeader>
                        <AccordionBody accordionId={i.id}>
                          <div className='react-dataTable'>
                            <DataTable
                              noHeader
                              pagination
                              columns={i.id === 4 ? posColumns : columns}
                              paginationPerPage={7}
                              className='react-dataTable'
                              sortIcon={<ChevronDown size={10} />}
                              paginationRowsPerPageOptions={[10, 25, 50, 100]}
                              data={i.id === 1 ? inData : i.id === 2 ? outData : i.id === 3 ? overBook : i.id === 4 ? holdBill : []}
                            />
                          </div>
                        </AccordionBody>
                      </AccordionItem>
                    </>
                  )
                })
              }
            </Accordion>
          </Row>
        </CardBody>
      </Card>
      {revModal && <RevModal open={revModal} handleOpen={handleRevModal} data={revenue} />}
      {openModal && <AddHotel open={open} handleOpen={handleOpen} bookingID={bid} />}
    </>
  )
}

export default NightAudit