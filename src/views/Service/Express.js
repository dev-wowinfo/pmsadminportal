import React, { useState, useEffect, useRef } from 'react'
import {
  Card, CardBody, Row, Col, Label, Input, Form, Badge, Button, UncontrolledDropdown, DropdownToggle, DropdownMenu, DropdownItem, Modal, ModalHeader, ModalBody, Spinner
} from 'reactstrap'
import { ChevronDown, MoreVertical, Trash, User } from 'react-feather'
import Avatar from '@components/avatar'
import axios from '../../API/axios'
// ** Third Party Components
import ReactPaginate from 'react-paginate'
import DataTable from 'react-data-table-component'
// import BookingModal from '../FrontDesk/BookingModal'
import toast from 'react-hot-toast'
import moment from 'moment'
import { useDispatch, useSelector } from 'react-redux'
import { storeBookingDetails } from "../../redux/voucherSlice"
import OnHoldQuickBookingModal from '../FrontDesk/OnHoldQuickBookingModal'
import Select from 'react-select'
import { saveAs } from 'file-saver'
import Papa from 'papaparse'
import AddHotel from '../FrontDesk/AddHotel'


const states = ['success', 'danger', 'warning', 'info', 'dark', 'primary', 'secondary']

const Express = () => {
  useEffect(() => {
    const prevTitle = document.title
    document.title = "PMS-Booking History"

    return () => {
      document.title = prevTitle
    }
  }, [])

  const getUserData = useSelector(state => state.userManageSlice.userData)
  const { LoginID, Token } = getUserData
  let roleType = getUserData?.UserRole
  // console.log('roleType', getUserData);
  const dispatch = useDispatch();
  const [status, setStatus] = useState('All')
  const [open, setOpen] = useState(false)
  const [onHoldOpen, setOnHoldOpen] = useState(false)
  const [bookingStatus, setBookingStatus] = useState('')
  const [checkIn, setCheckIn] = useState('')
  const [checkOut, setCheckOut] = useState('')
  const [searchName, setSearchName] = useState('')
  const [currentPage, setCurrentPage] = useState(0)
  const [data, setData] = useState([])
  const [filteredData, setFilteredData] = useState(data)
  const [refresh, setRefresh] = useState(false)
  const [loading, setLoading] = useState(false)
  const hasCalledAPI = useRef(false)
  const [sel_bookingID, setSel_bookingID] = useState('')

  const handleOpen = () => setOpen(!open)
  const handleOnHoldOpne = () => setOnHoldOpen(!onHoldOpen)

  const [cancelOpen, setCancelOpen] = useState(false);
  const handleCancelOpen = () => setCancelOpen(!cancelOpen);
  const [bookingRemoveId, setBookingRemoveId] = useState('')

  // console.log('gdsghdg', bookingStatus);

  const handelReset = async () => {
    setCheckIn('');
    setCheckOut('');
    setStatus('All');
    setSearchName('');
    setCurrentPage(0);
    setFilteredData(data);
    setData([]);
    setRefresh(false);
    setSel_bookingID('');

    try {
      const bookingsBody = {
        // LoginID: "1234",
        LoginID,
        Token,
        Seckey: "abc",
        Event: "history",
        // CheckInDate: checkInDate
        // CheckOutDate: "2023-02-03"
      }
      const res = await axios.post(`/getdata/bookingdata/roomchart`, bookingsBody)
      // console.log('res', res)
      if (res.status === 200) {
        let result = res?.data[0]
        // console.log("express Bookings room chart res", result)
        setData(res?.data[0])
        // console.log('res', res)
      } else {
        toast.error("Something went wrong, Try again! 111111")
      }

      // toast.error("Something went wrong, Try again! 111111")
    } catch (error) {
      console.log("Bookings Error=====", error)
      toast.error("Something went wrong, Try again!")
    }
  };

  const checkInDate = moment(new Date()).subtract(190, 'days').format("YYYY/MM/DD")

  const getRoomChartDetails = async () => {
    if (hasCalledAPI.current && !refresh) return
    
    try {
      setLoading(true)
      const bookingsBody = {
        LoginID,
        Token,
        Seckey: "abc",
        Event: "history",
      }
      const res = await axios.post(`/getdata/bookingdata/roomchart`, bookingsBody)
      console.log('resssss', res)
      if (res.status === 200) {
        setData(res?.data[0])
        hasCalledAPI.current = true
      } else {
        toast.error("Something went wrong, Try again!")
      }
    } catch (error) {
      console.log("Bookings Error=====", error)
      toast.error("Something went wrong, Try again!")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    getRoomChartDetails()
    if (data == []) {
      setRefresh(true)
    }
  }, [refresh, open, onHoldOpen])

  useEffect(() => {
    if (!onHoldOpen) {
      setStatus('All')
    }
  }, [onHoldOpen])

  // ** Function to handle Pagination
  const handlePagination = page => setCurrentPage(page.selected)

  useEffect(() => {
    // Automatically set filteredData to all data on initial load
    setFilteredData(data); // Show all records when the page first loads
  }, [data]); // This effect will run once when data is set


  // ** Custom Pagination
  const CustomPagination = () => (
    <ReactPaginate
      previousLabel={''}
      nextLabel={''}
      forcePage={currentPage}
      onPageChange={page => handlePagination(page)}
      // pageCount={Math.ceil(dataToRender().length / 7) || 1}
      pageCount={Math.ceil(status === '' && filteredData.length === 0 ? data.length / 7 : filteredData.length / 7) || 1}
      breakLabel={'...'}
      pageRangeDisplayed={5}
      marginPagesDisplayed={2}
      activeClassName='active'
      pageClassName='page-item'
      breakClassName='page-item'
      nextLinkClassName='page-link'
      pageLinkClassName='page-link'
      breakLinkClassName='page-link'
      previousLinkClassName='page-link'
      nextClassName='page-item next-item'
      previousClassName='page-item prev-item'
      containerClassName={'pagination react-paginate separated-pagination pagination-sm justify-content-end pe-1 mt-1'}
    />
  )

  // ** Function to handle name filter
  const handleNameFilter = e => {
    const value = e.target.value
    let updatedData = []
    if (status === "All") {
      updatedData = data
      setFilteredData([...updatedData])
    } else if (status === "Reserved") {
      updatedData = data.filter(item => item.status === 'Reserved' && item.checkIn === false)
      setFilteredData([...updatedData])
    } else if (status === "CheckedIN") {
      updatedData = data.filter(item => item.status === "CheckedIN")
      setFilteredData([...updatedData])
    } else if (status === "CheckedOut") {
      updatedData = data.filter(item => item.status === "CheckedOut")
      setFilteredData([...updatedData])
    } else if (status === "Cancelled") {
      updatedData = data.filter(item => item.status === value)
      setFilteredData([...updatedData])
    } else if (status === "group") {
      updatedData = data.filter(item => item.checkInCount > 1)
      setFilteredData([...updatedData])
    } else if (status === "ibebooking") {
      updatedData = []
      setFilteredData([...updatedData])
    } else if (status === "OnHold") {
      updatedData = data.filter(item => item.status === value)
      setFilteredData([...updatedData])
    } else {
      updatedData = data
    }

    setSearchName(value)
    if (value.length > 0 && value !== '') {
      // updatedData = dataToFilter().filter(item => {
      updatedData = updatedData.filter(item => {
        const startsWith = item.guestName.toLowerCase().startsWith(value.toLowerCase())

        const includes = item.guestName.toLowerCase().includes(value.toLowerCase())

        if (startsWith) {
          return startsWith
        } else if (!startsWith && includes) {
          return includes
        } else return null
      })
      setFilteredData([...updatedData])
      setSearchName(value)
    } else {
      setFilteredData([...updatedData])
      setSearchName(value)
    }
  }

  const handleDatesFilter = () => {
    let updatedData = []
    if (status === "All") {
      updatedData = data
      setFilteredData([...updatedData])
    } else if (status === "Reserved") {
      updatedData = data.filter(item => item.status === 'Reserved' && item.checkIn === false)
      setFilteredData([...updatedData])
    } else if (status === "CheckedIN") {
      updatedData = data.filter(item => item.status === "CheckedIN")
      setFilteredData([...updatedData])
    } else if (status === "CheckedOut") {
      updatedData = data.filter(item => item.status === "CheckedOut")
      setFilteredData([...updatedData])
    } else if (status === "Cancelled") {
      updatedData = data.filter(item => item.status === 'Cancelled')
      setFilteredData([...updatedData])
    } else if (status === "group") {
      updatedData = data.filter(item => item.checkInCount > 1)
      setFilteredData([...updatedData])
    } else if (status === "ibebooking") {
      updatedData = []
      setFilteredData([...updatedData])
    } else if (status === "OnHold") {
      updatedData = data.filter(item => item.status === 'OnHold')
      setFilteredData([...updatedData])
    } else {
      updatedData = data
    }

    // console.log('status', status)
    // console.log('checkIn', checkIn)
    // console.log('checkOut', checkOut)

    if (checkIn !== '' && checkOut === '') {
      updatedData = updatedData.filter(item => {
        const startsWith = moment(item.checkInDate).format('l') === moment(checkIn).format('l')
        if (startsWith) {
          return startsWith
        } else return null
      })
      setFilteredData([...updatedData])
    } else if (checkIn === '' && checkOut !== '') {
      updatedData = updatedData.filter(item => {
        const startsWith = moment(item.checkOutDate).format('l') === moment(checkOut).format('l')
        if (startsWith) {
          return startsWith
        } else return null
      })
      setFilteredData([...updatedData])
    } else if (checkIn !== '' && checkOut !== '') {
      // console.log('hit')
      updatedData = updatedData.filter(item => {
        const arr = (moment(item.checkOutDate).format('l') === moment(checkOut).format('l')) && (moment(item.checkInDate).format('l') === moment(checkIn).format('l'))
        // console.log('arr', arr)
        if (arr) {
          return arr
        } else return null
      })
      setFilteredData([...updatedData])
    } else {
      setFilteredData([...updatedData])
    }
  }

  useEffect(() => {
    handleDatesFilter()
  }, [checkIn, checkOut])

  // const handleStatusFilter = e => {
  //   // setStatus('')
  //   setSearchName('')
  //   setCheckIn('')
  //   setCheckOut('')
  //   const value = e.target.value
  //   let updatedData = []
  //   setStatus(value)

  //   if (value.length && value === "All") {
  //     updatedData = data
  //     setFilteredData([...updatedData])
  //     setStatus(value)
  //   } else if (value.length && value === "Reserved") {
  //     updatedData = data.filter(item => item.Status === 'Reserved' && item.CheckIn === false)
  //     setFilteredData([...updatedData])
  //     setStatus(value)
  //   } else if (value.length && value === "CheckedIN") {
  //     updatedData = data.filter(item => item.Status === "CheckedIN")
  //     setFilteredData([...updatedData])
  //     setStatus(value)
  //   } else if (value.length && value === "CheckedOut") {
  //     updatedData = data.filter(item => item.Status === "CheckedOut")
  //     setFilteredData([...updatedData])
  //     setStatus(value)
  //   } else if (value.length && value === "Cancelled") {
  //     updatedData = data.filter(item => item.Status === value)
  //     setFilteredData([...updatedData])
  //     setStatus(value)
  //   } else if (value.length && value === "group") {
  //     updatedData = data.filter(item => item.CheckInCount > 1)
  //     setFilteredData([...updatedData])
  //     setStatus(value)
  //   } else if (value.length && value === "ibebooking") {
  //     updatedData = []
  //     setFilteredData([...updatedData])
  //     setStatus(value)
  //   } else if (value.length && value === "OnHold") {
  //     updatedData = data.filter(item => item.Status === value)
  //     setFilteredData([...updatedData])
  //     setStatus(value)
  //   }
  // }


  const handleStatusFilter = (e) => {

    const value = e.target.value;
    setFilteredData(data)
    setStatus(value);  // Set the selected status
    setSearchName(''); // Clear the search name
    setCheckIn('');    // Clear check-in date
    setCheckOut('');   // Clear check-out date
    console.log('zxc', e, filteredData);

    let updatedData = data;

    // If "All" is selected, show all data
    if (value === "All") {
      updatedData = data; // No filter applied, show all records
    } else if (value === "Reserved") {
      updatedData = data.filter(item => item.status === 'Reserved' && item.checkIn === false);
    } else if (value === "CheckedIN") {
      updatedData = data.filter(item => item.status === "CheckedIN");
    } else if (value === "CheckedOut") {
      updatedData = data.filter(item => item.status === "CheckedOut");
    } else if (value === "Cancelled") {
      updatedData = data.filter(item => item.status === "Cancelled");
    } else if (value === "group") {
      updatedData = data.filter(item => item.checkInCount > 1); // For groups
    } else if (value === "ibebooking") {
      updatedData = []; // No data for 'ibebooking'
    } else if (value === "OnHold") {
      updatedData = data.filter(item => item.status === "OnHold");
    }

    setFilteredData([...updatedData]); // Update the filtered data
  };

  useEffect(() => {
    // Trigger the status filter on initial load
    handleStatusFilter({ target: { value: 'All' } });
  }, []);


  const handleClearFilters = () => {
    setCheckIn('')
    setCheckOut('')
    setSearchName('')
  }

  const columns = [
    // {
    //   center: true,
    //   width: '80px',
    //   sortable: row => row.GuestName,
    //   cell: (row, i) => (
    //     <>
    //       {console.log('Status', row.Status)}
    //       <div className='d-flex'>
    //         <UncontrolledDropdown>
    //           <DropdownToggle className='pe-1' tag='span'>
    //             <MoreVertical size={15} />
    //           </DropdownToggle>

    //           {roleType === 'SuperAdmin' ? <DropdownMenu> <DropdownItem onClick={() => {
    //             handleCancelOpen()
    //             setBookingRemoveId(row.BookingID)
    //           }}>
    //             <Trash size={15} />
    //             <span className='align-middle ms-50'>Remove</span>
    //           </DropdownItem>  </DropdownMenu> : ''}


    //         </UncontrolledDropdown>
    //       </div>
    //       <div className='d-flex align-items-center cursor-pointer' onClick={() => {
    //         setSel_bookingID(row.BookingID);
    //         setBookingStatus(row.Status)
    //         console.warn("gengarBookingId", row.BookingID)
    //         dispatch(storeBookingDetails({ LoginID, Token, BookingId: row.BookingID }))
    //         if (row.Status === 'OnHold') {
    //           handleOnHoldOpne()
    //         } else handleOpen()
    //       }}>
    //         <Avatar
    //           title="Click to Manage Booking"
    //           icon={<User color='#FFFFFF' size={25} />}
    //           color={
    //             row.Status === 'CheckedIN' ? (
    //               'success'
    //             ) : row.Status === 'CheckedOut' ? (
    //               'primary'
    //             ) : row.Status === 'Cancelled' ? (
    //               'danger'
    //             ) : row.Status === 'Reserved' && row.CheckIn === false ? (
    //               'warning'
    //             ) : row.Status === 'OnHold' ? (
    //               'info'
    //             ) : '#000'
    //           }
    //         />
    //       </div>
    //     </>
    //   )
    // },
    {
      center: true,
      width: '80px',
      sortable: row => row.guestName,
      cell: (row, i) => {
        const status = String(row.status || '').trim().toLowerCase();
        const isCheckedIn = status === 'checkedin';

        return (
          <>
            <div className='d-flex'>
              <UncontrolledDropdown>
                <DropdownToggle className='pe-1' tag='span'>
                  <MoreVertical size={15} />
                </DropdownToggle>

                {roleType === 'SuperAdmin' && (
                  // <DropdownMenu>
                  //   {!isCheckedIn && (
                  //     <DropdownItem
                  //       onClick={() => {
                  //         handleCancelOpen();
                  //         setBookingRemoveId(row.BookingID);
                  //       }}
                  //     >
                  //       <Trash size={15} />
                  //       <span className='align-middle ms-50'>Remove</span>
                  //     </DropdownItem>
                  //   )}
                  // </DropdownMenu>
                  <DropdownMenu>
                    {isCheckedIn ? (
                      <DropdownItem header className='text-danger fw-bold'>
                        You cannot remove a CheckedIN booking.
                      </DropdownItem>
                    ) : (
                      <DropdownItem
                        onClick={() => {
                          handleCancelOpen();
                          setBookingRemoveId(row.bookingID);
                        }}
                      >
                        <Trash size={15} />
                        <span className='align-middle ms-50'>Remove</span>
                      </DropdownItem>
                    )}
                  </DropdownMenu>
                )}
              </UncontrolledDropdown>
            </div>

            <div
              className='d-flex align-items-center cursor-pointer'
            // onClick={() => {
            //   setSel_bookingID(row.BookingID);
            //   setBookingStatus(row.Status);
            //   dispatch(storeBookingDetails({ LoginID, Token, BookingId: row.BookingID }));

            //   if (row.Status === 'OnHold') {
            //     handleOnHoldOpne();
            //   } else {
            //     handleOpen();
            //   }
            // }}
            >
              <Avatar
                title="Click to Manage Booking"
                icon={<User color='#FFFFFF' size={25} />}
                color={
                  row.status === 'CheckedIN' ? 'success'
                    : row.status === 'CheckedOut' ? 'primary'
                      : row.status === 'Cancelled' ? 'danger'
                        : row.status === 'Reserved' && row.checkIn === false ? 'warning'
                          : row.status === 'OnHold' ? 'info'
                            : '#000'
                }
              />
            </div>
          </>
        );
      }
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
      name: 'Source Type',
      center: true,
      sortable: true,
      minWidth: '200px',
      selector: row => row.sourceType
    },
    {
      name: 'Guest Name',
      center: true,
      sortable: true,
      minWidth: '200px',
      selector: row => (
        <>
          <p>{row.guestName.toUpperCase()}</p>
          <p>{row.guestMobileNumber}</p>
        </>
      )
    },
    {
      name: 'Room/s',
      center: true,
      sortable: true,
      minWidth: '200px',
      selector: row => {
        const rooms = row.roomDisplayName.split("; ")
        // console.log('rooms', rooms);
        return (<>
          {
            rooms.map((r, i) => {
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

  const handleCancelBooking = async () => {
    try {
      const cancelObj = {
        LoginID,
        Token,
        Seckey: "abc",
        Event: "remove",
        BookingID: bookingRemoveId,
      };
      const res = await axios.post(`/setdata/cancelbooking`, cancelObj);
      // console.log("cancelres", res);
      if (res.data[0][0].status === "Success") {
        // handleOpen();
        getRoomChartDetails()
        handelReset()
        toast.success(`${bookingRemoveId} - booking is Removed!`);
        handleCancelOpen();
      }
    } catch (err) {
      console.log("cancel", err);
      toast.error(err.response);
      handleCancelOpen();
    }
  };

  const dataFilterOption = [
    // {value:"Today",label:"Today"},
    { value: "Weekly", label: "Weekly" },
    { value: "Monthly", label: "Monthly" },
    { value: "Qurterly", label: "Qurterly" },
    { value: "Yearly", label: "Yearly" },
  ]

  const getPaginatedData = () => {
    const itemsPerPage = 7
    const start = currentPage * itemsPerPage
    const end = start + itemsPerPage
    return filteredData.slice(start, end)
  }

  const downloadAllCsv = () => {
    if (!filteredData.length) {
      toast.error("No data to download.")
      return
    }

    const csv = Papa.unparse(filteredData)
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    saveAs(blob, 'Booking_Data.csv')
  }

  const handleCsvDownload = () => {
    const visibleData = getPaginatedData()

    if (!visibleData.length) {
      toast.error("No data available to export.")
      return
    }

    const csv = Papa.unparse(visibleData)

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    saveAs(blob, 'table_data.csv')
  }

  const handleRowClick = (row) => {
    setSel_bookingID(row.bookingID);
    setBookingStatus(row.status);
    dispatch(storeBookingDetails({ LoginID, Token, BookingId: row.bookingID }));

    if (row.status === 'OnHold') {
      handleOnHoldOpne();
    } else {
      handleOpen();
    }
  };


  return (
    <>
      {/* {console.log('data', data)} */}
      <div>
        <Card className='paper'>
          <Row>
            <Col sm='12' className='d-flex justify-content-between align-items-start border-bottom pb-50'>
              <Form className='col d-flex flex-wrap gap-2'>
                <div className='demo-inline-spacing pb-50'>
                  <div className='form-check'>
                    {/* <Input
                      type='radio'
                      name='ex5'
                      id='ex5-inactive'
                      value="All"
                      checked={status === "All"}
                      onChange={handleStatusFilter}
                    /> */}
                    <Input
                      type='radio'
                      name='status'
                      id='all'
                      value="All"
                      checked={status === "All"}
                      onChange={handleStatusFilter}
                    />
                    <Label className='form-check-label' for='ex5-inactive'>
                      All
                    </Label>
                  </div>
                  <div className='form-check'>
                    <Input
                      type='radio'
                      id='ex1-active'
                      name='ex1'
                      value="Reserved"
                      checked={status === "Reserved"}
                      onChange={handleStatusFilter}
                    />
                    <Label className='form-check-label' for='ex1-active'>
                      Reserved
                    </Label>
                  </div>
                  <div className='form-check'>
                    <Input
                      type='radio'
                      name='ex2'
                      id='ex2-inactive'
                      value="CheckedIN"
                      checked={status === "CheckedIN"}
                      onChange={handleStatusFilter}
                    />
                    <Label className='form-check-label' for='ex2-inactive'>
                      Checked In
                    </Label>
                  </div>
                  <div className='form-check'>
                    <Input
                      type='radio'
                      name='ex3'
                      id='ex3-inactive'
                      value="CheckedOut"
                      checked={status === "CheckedOut"}
                      onChange={handleStatusFilter}
                    />
                    <Label className='form-check-label' for='ex3-inactive'>
                      Checked Out
                    </Label>
                  </div>
                  <div className='form-check'>
                    <Input
                      type='radio'
                      name='ex4'
                      id='ex4-inactive'
                      value="Cancelled"
                      checked={status === "Cancelled"}
                      onChange={handleStatusFilter}
                    />
                    <Label className='form-check-label' for='ex4-inactive'>
                      Cancelled
                    </Label>
                  </div>
                  <div className='form-check'>
                    <Input
                      type='radio'
                      name='ex6'
                      id='ex6-inactive'
                      value="OnHold"
                      checked={status === "OnHold"}
                      onChange={handleStatusFilter}
                    />
                    <Label className='form-check-label' for='ex6-inactive'>
                      Hold
                    </Label>
                  </div>
                  <div className='ms-auto mt-2 mr-0 filter-dropdown' style={{ minWidth: 200 }}>
                    {/* <Label className='form-check-label'>Filter</Label> */}
                    <Select
                      className='react-select'
                      classNamePrefix='select'
                      placeholder="Filter"
                      options={dataFilterOption}
                    />
                  </div>
                </div>

              </Form>
            </Col>
          </Row>
          <CardBody>
            <Col className='d-flex flex-row justify-content-between align-items-center filteredData-booking'>
              <div>
                No. of bookings: {status === '' && filteredData.length === 0 ? data.length : filteredData.length}
              </div>
              <div className='d-flex flex-row justify-content-between download-booking'>
                <p
                  className='text-danger fs-4 text-decoration-underline cursor-pointer '
                  onClick={downloadAllCsv}
                >Csv Download</p>
                <p
                  className='text-danger fs-4 text-decoration-underline cursor-pointer ms-3 reset'
                  onClick={handelReset}>Reset</p>

              </div>


            </Col>
            <Row className='mt-1 mb-50'>
              <Col lg='4' md='6' className='mb-1'>
                <Label className='form-label' for='name'>
                  Name:
                </Label>
                <Input id='name' placeholder='Bruce Wayne' value={searchName} onChange={handleNameFilter} />
              </Col>
              <Col lg='4' md='6' className='mb-1'>
                <Label className='form-label' for='name'>
                  Check In Date:
                </Label>
                <Input type='date' id='name' placeholder='check in date' value={checkIn} onChange={e => {
                  setCheckIn(e.target.value)
                }} />
              </Col>
              <Col lg='4' md='6' className='mb-1'>
                <Label className='form-label' for='name'>
                  Check Out Date:
                </Label>
                <Input type='date' id='name' placeholder='Check Out Date' value={checkOut} onChange={e => {
                  setCheckOut(e.target.value)
                }} />
              </Col>
            </Row>
          </CardBody>
          <div className='react-dataTable'>
            {loading ? (
              <div className='d-flex justify-content-center align-items-center' style={{ height: '400px' }}>
                <div className='text-center'>
                  <Spinner color='primary' className='mb-2' />
                  <p>Loading bookings...</p>
                </div>
              </div>
            ) : (
              <DataTable
                noHeader
                pagination
                columns={columns}
                paginationPerPage={7}
                className='react-dataTable'
                sortIcon={<ChevronDown size={10} />}
                paginationDefaultPage={currentPage + 1}
                paginationComponent={CustomPagination}
                data={filteredData}
                onRowClicked={handleRowClick}
                pointerOnHover
              />
            )}
          </div>
        </Card>
      </div>
      {open && <AddHotel open={open} handleOpen={handleOpen} bookingID={sel_bookingID} bookingStatus={bookingStatus} />}
      {onHoldOpen && <OnHoldQuickBookingModal open={onHoldOpen} handleOnHoldOpen={handleOnHoldOpne} bookingID={sel_bookingID} />}
      <Modal
        isOpen={cancelOpen}
        toggle={handleCancelOpen}
        className="modal-dialog-centered modal-lg"
      >
        <ModalHeader className="bg-transparent" toggle={handleCancelOpen}>
          Remove Booking of - {bookingRemoveId}
        </ModalHeader>
        <ModalBody>
          <h3 className="text-center">
            Are you sure you want to Remove this booking?
          </h3>
          <Col className="text-center">
            <Button
              className="m-1"
              color="danger"
              onClick={() => handleCancelBooking()}
            >
              Confirm
            </Button>
            <Button
              className="m-1"
              color="primary"
              onClick={() => handleCancelOpen()}
            >
              Cancel
            </Button>
          </Col>
        </ModalBody>
      </Modal>
    </>
  )
}

export default Express