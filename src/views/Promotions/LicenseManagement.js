import React, { useEffect, useState } from 'react'
import { Card, CardBody, CardHeader, CardTitle, CardText, Col, Nav, NavItem, NavLink, Row, TabContent, TabPane, Button, Accordion, AccordionItem, AccordionHeader, AccordionBody, Input, Label, Form, Table } from 'reactstrap'
import PromoTable from './PromoTable'
import { FaHandshake, FaClock, FaMobileAlt } from 'react-icons/fa'
import { IoIosHourglass, IoIosLaptop } from 'react-icons/io'
import { IoCaretBackSharp } from 'react-icons/io5'
import { BsFillMoonStarsFill, BsBriefcase } from 'react-icons/bs'
import { HiUserGroup } from 'react-icons/hi'
import './promotion.scss'
import Select from 'react-select'
import { selectThemeColors } from '@utils'
import Flatpickr from 'react-flatpickr'
import '@styles/react/libs/flatpickr/flatpickr.scss'
import moment from 'moment'
import { useSelector } from 'react-redux'
import axios from '../../API/axios'
import toast from 'react-hot-toast'
import { Trash } from 'react-feather'
// import PromoModal from "./PromoModal"
import AddLicense from './AddLicense'
// import NewGuest from '../GuestMaster/NewGuest'


let discountType = [
  { value: 'P', label: 'Percentage' },
  { value: 'F', label: 'Flat' }
]
const LicenseManagement = () => {
  useEffect(() => {
    const prevTitle = document.title
    document.title = "PMS-Licences"

    return () => {
      document.title = prevTitle
    }
  }, [])

  const getUserData = useSelector(state => state.userManageSlice.userData)
  const { LoginID, Token } = getUserData

  const [active, setActive] = useState('1')
  const [discountT, setDiscounT] = useState('')
  const [checkRoomType, setCheckRoomType] = useState(false)
  const [isRefundable, setIsRefundable] = useState(false)
  const [isPenalty, setIsPenalty] = useState(false)
  const [promoName, setPromoName] = useState('')
  const [dPercentage, setDPercentage] = useState(0)
  const [dAmount, setDAmount] = useState(0)
  const [noOfRoom, setNoOfRoom] = useState(0)
  const [guestType, setGuestType] = useState('')
  const [refundDate, setRefundDate] = useState('')
  const [pDate, setPDate] = useState('')
  const [refundDiscounT, setRefundDiscounT] = useState('')
  const [refundDPercent, setRefundDPercent] = useState(0)
  const [refundDAmount, setRefundDAmount] = useState(0)
  const [promoStartD, setPromoStartD] = useState('')
  const [promoEndD, setPromoEndD] = useState('')
  const [bookingStartD, setBookingStartD] = useState('')
  const [bookingEndD, setBookingEndD] = useState('')
  // const [blackDate, setBlackDate] = useState('')
  const [roomTypes, setRoomTypes] = useState([])
  const [roomTypesId, setRoomTypesId] = useState('')
  const [roomNo, setRoomNo] = useState('')
  const [blDate, setBlDate] = useState('')
  const [showErrors, setShowErrors] = useState(false);
  const [guestId, setGuestId] = useState("");

  const [newGuest, setNewGuest] = useState(false);
  const handleNewGuest = () => setNewGuest(!newGuest);

  console.log(roomTypes);
  const toggle = tab => {
    if (active !== tab) {
      setActive(tab)
    }
  }





  // const tabArray = [
  //   {
  //     id: '1',
  //     tabName: 'Promotions'
  //   },
  //   {
  //     id: '2',
  //     tabName: 'Inactive Promotions'
  //   },
  //   {
  //     id: '3',
  //     tabName: 'Expired Promotions'
  //   },
  //   {
  //     id: '4',
  //     tabName: 'Create New Promotions'
  //   }
  // ]

  const promoArray = [
    {
      id: '1',
      logo: <FaHandshake size={35} />,
      heading: 'Basic Deals',
      content: 'Maximize sales by giving regular discount to the bookers'
    },
    {
      id: '2',
      logo: <IoIosHourglass size={35} />,
      heading: 'Last Minutes Deals',
      content: 'Maximize sales by giving regular discount to the bookers'
    },
    {
      id: '3',
      logo: <FaClock size={35} />,
      heading: 'Early Bird Deals',
      content: 'Maximize sales by giving regular discount to the bookers'
    },
    {
      id: '4',
      logo: <BsBriefcase size={35} />,
      heading: 'Free Night Deals',
      content: 'Maximize sales by giving regular discount to the bookers'
    },
    {
      id: '5',
      logo: <BsFillMoonStarsFill size={35} />,
      heading: 'Corporate Deals',
      content: 'Maximize sales by giving regular discount to the bookers'
    }
  ]


  const [open, setOpen] = useState(false)
  const handleOpen = () => setOpen(!open)

  const [accopen, setAccopen] = useState('')
  const toggleAcc = id => {
    accopen === id ? setAccopen() : setAccopen(id)
  }

  const roomTypeList = () => {
    console.log('acs');
    try {
      const roomTypeDetails = {
        LoginID,
        Token,
        Seckey: "abc",
        Event: 'list'
      }
      axios.post(`/getdata/bookingdata/roomdetails`, roomTypeDetails)
        .then(response => {
          console.log('response', response);
          let data = response?.data[0]
          const options = data.map(s => {
            return { value: s.roomID, label: s.roomDisplayName }
          })
          setRoomTypes(options)
        })
    } catch (error) {
      console.log("RoomType Error", error.message)
    }
  }
  useEffect(() => {
    roomTypeList()
  }, [])


  // Room Type
  let RoomData = []
  const [val, setVal] = useState([]);
  const [roomIdName, setRoomIdName] = useState([]);
  const handleAddRoom = () => {
    const values = [...val];
    values.push({
      RoomID: roomTypesId,
      NumberOfRooms: roomNo
    });
    setVal(values);
    setRoomNo('')
    setRoomTypesId('')
  };
  RoomData = [...val]
  const deleteRoomInput = async (index) => {
    RoomData.splice(index, 1)
    setRoomIdName(RoomData)
    setVal(RoomData)
  }
  useEffect(() => {
    setRoomIdName(RoomData)
  }, [val])


  // blackout date
  let BlackoutData = []
  const [bDate, setbDate] = useState([]);
  const [blackDate, setBlackDate] = useState([])

  const handleAddDate = () => {
    const values = [...bDate];
    values.push({
      Date: moment(blDate).format('YYYY-MM-DD')
    });
    setbDate(values);
    setBlDate('')
  };
  BlackoutData = [...bDate]

  const deleteBDateInput = (index) => {
    BlackoutData.splice(index, 1)
    setBlackDate(BlackoutData)
    setbDate(BlackoutData)
  }
  useEffect(() => {
    setBlackDate(BlackoutData)
  }, [bDate])


  const savePromotion = async () => {
    setShowErrors(true);
    try {
      const promotionData = {
        "Promotion": {
          "PromoName": promoName,
          "DiscountType": discountT,
          "DiscPercentage": dPercentage,
          "DiscAmount": dAmount,
          "CheckRoomType": checkRoomType,
          "MinRoomRequire": noOfRoom,
          "GuestType": guestType,
          "IsRefundable": isRefundable
        },
        "Promo_Reservation": {
          "StartStayDate": moment(promoStartD).format('YYYY-MM-DD'),
          "EndStayDate": moment(promoEndD).format('YYYY-MM-DD'),
          "Days": 2,
          "LessDaysCount": 0,
          "LessDiscPercentage": 0,
          "LessDiscAmount": 0
        },
        "Promo_BookingTime": {
          "BookingStartDate": moment(bookingStartD).format('YYYY-MM-DD HH:mm'),
          "BookingEndDate": moment(bookingEndD).format('YYYY-MM-DD HH:mm')
        },
        "Promo_BlackOutDate": bDate,
        "Promo_ApplicableRooms": val,
        "Promo_Refundable": {
          "RefundDateTime": refundDate === '' ? '' : moment(refundDate).format('YYYY-MM-DD'),
          "IsPenaltyApply": isPenalty,
          "RefundPenaltyDate": pDate === '' ? '' : moment(pDate).format('YYYY-MM-DD'),
          "DiscountType": refundDiscounT,
          "LessRefundPerc": refundDPercent,
          "LessRefundAmt": refundDAmount
        }
      }
      console.log('promotionData', promotionData)
      const res = await axios.post('/promotion/save', promotionData, {
        headers: {
          LoginID,
          Token,
        }
      })
      console.log("response: ", res.data[0])
      if (res.data[0][0].status === "Success") {
        toast.success(res.data[0][0].message, { position: "top-center" })
        location.reload()
      }
    } catch (error) {
      console.log("Error", error)
    }
  }


  return (
    <>
      <Card>
        <CardHeader>
          {/* <Row className='d-flex justify-content-between'> */}
          <CardTitle>
            <div>
              <h1 class="text-3xl fw-bolder tracking-tight">License Management</h1>
              <p class="text-muted-foreground">Manage customer licenses and subscriptions</p>
            </div>
          </CardTitle>

          <div class="d-flex items-center justify-between">
            {/* <Button color="primary" onClick={() => { setNewGuest(true); }}> */}

            <Button color="primary" onClick={() => { setNewGuest(true); }}>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 256 256" class="me-1"><path d="M228,128a12,12,0,0,1-12,12H140v76a12,12,0,0,1-24,0V140H40a12,12,0,0,1,0-24h76V40a12,12,0,0,1,24,0v76h76A12,12,0,0,1,228,128Z"></path></svg>
              Create License
            </Button>

            {/* <Button color="primary" onClick={handleNewGuest}>

              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 256 256" class="me-1"><path d="M228,128a12,12,0,0,1-12,12H140v76a12,12,0,0,1-24,0V140H40a12,12,0,0,1,0-24h76V40a12,12,0,0,1,24,0v76h76A12,12,0,0,1,228,128Z"></path>
              </svg>Create License
            </Button> */}
            {/* <Button color="primary" onClick={handleNewGuest}>
              Create License
            </Button> */}
          </div>
        </CardHeader>
      </Card>

      <Card>
        <CardBody>
          <Form>
            <div>
              <div data-slot="card-header" class="items-start px-6 pb-6">
                <div data-slot="card-title" class="fw-bolder"><h4>All Licenses</h4>
                </div>
                <div data-slot="card-description" class="text-muted-foreground text-sm">
                  <p>View and manage all customer licenses</p>
                </div>
              </div>
              {/* <div class=''>
                <div class="flex-1 mt-2">

                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 256 256" class="text-muted-foreground"><path d="M229.66,218.34l-50.07-50.06a88.11,88.11,0,1,0-11.31,11.31l50.06,50.07a8,8,0,0,0,11.32-11.32ZM40,112a72,72,0,1,1,72,72A72.08,72.08,0,0,1,40,112Z"></path>
                  </svg>
                  <input data-slot="input" class="flex h-9 w-50 rounded-md border bg-transparent px-1 py-1 text-base" placeholder="Search by hotel name, license ID, or plan..." value="">
                  </input>
                  <button type="button" aria-controls="radix-_r_2u_" dir="ltr" data-slot="select-trigger" data-size="default" class="border border-2 rounded ms-5 ">
                    <span data-slot="select-value">All Statuses</span><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="" aria-hidden="true"><path d="m6 9 6 6 6-6"></path></svg></button>
                </div>
              </div> */}
              <TabContent activeTab={active}>
                <TabPane tabId='1'>
                  <PromoTable />
                </TabPane>
                <TabPane tabId='2'>
                  <PromoTable />
                </TabPane>
                <TabPane tabId='3'>
                  <PromoTable />
                </TabPane>
                <TabPane tabId='4'>
                  <Card>
                    <CardBody>
                      <Form>
                        <Row>
                          <Col lg='6' className='mb-1'>
                            <Label className='form-label' for='promo'>Promotion Name <span className='text-danger'>*</span></Label>
                            <Input
                              type='text'
                              name='promo'
                              id='promo'
                              value={promoName}
                              onChange={e => setPromoName(e.target.value)}
                            />
                            {showErrors && promoName === '' && <p className='text-danger'></p>}

                          </Col>
                          <Col lg='3' className='mb-1'>
                            <Label className='form-label' for='discount'>Discount Type <span className='text-danger'>*</span> </Label>
                            <Select
                              theme={selectThemeColors}
                              className='react-select'
                              classNamePrefix='select'
                              placeholder="Select"
                              options={discountType}
                              // value={discountT}
                              onChange={(e) => {
                                setDiscounT(e.value)
                              }}
                            />
                            {showErrors && discountT === '' && <p className='text-danger'>Select Discount Type</p>}
                          </Col>
                          {discountT === 'P' ? <Col lg='3' className='mb-1'>
                            <Label className='form-label' for='promo'>Discount Percentage <span className='text-danger'>*</span></Label>
                            <Input
                              type='text'
                              name='promo'
                              id='promo'
                              onChange={e => setDPercentage(e.target.value)}
                              value={dPercentage}
                            />
                            {/* {showErrors && dPercentage === 0 && <p className='text-danger'>Discount Percentage is required</p>} */}
                          </Col> : <Col lg='3' className='mb-1'>
                            <Label className='form-label' for='promo'>Discount Amount <span className='text-danger'>*</span></Label>
                            <Input
                              type='text'
                              name='promo'
                              id='promo'
                              onChange={e => setDAmount(e.target.value)}
                              value={dAmount}
                            />
                            {/* {showErrors && dAmount === 0 && <p className='text-danger'>Discount Amount is required</p>} */}
                          </Col>
                          }

                          <Col lg='6' className='mb-1'>
                            <Label className='form-label' for='promo'>No. of Rooms <span className='text-danger'>*</span></Label>
                            <Input
                              type='text'
                              name='promo'
                              id='promo'
                              onChange={e => setNoOfRoom(e.target.value)}
                              value={noOfRoom}
                            />
                            {showErrors && noOfRoom === 0 && <p className='text-danger'>No.of Rooms Required</p>}
                          </Col>
                          <Col lg='6' className='mt-2'>
                            <div className='d-flex flex-row'>
                              <Label className='form-check-label' for='confirm'>Guest Type:</Label>
                              <Col className='form-check mx-1 mb-1'>
                                <Input
                                  type='radio'
                                  id='confirm'
                                  name='GuestType'
                                  onChange={() => {
                                    setGuestType('Existing')
                                  }}
                                />
                                <Label className='form-check-label' for='confirm'>Existing</Label>
                              </Col>
                              <Col className='form-check mx-1 mb-1 d-block'>
                                <Input
                                  type='radio'
                                  id='hold'
                                  name='GuestType'
                                  onChange={() => {
                                    setGuestType('All')
                                  }}
                                />
                                <Label className='form-check-label' for='confirm'>All</Label>
                              </Col>
                            </div>
                            {showErrors && guestType === '' && <p className='text-danger'>Select Guest Type</p>}
                          </Col>
                        </Row>
                        <Row>
                          <h4 style={{ borderTop: '1px solid #d8d6df' }} className='mt-2 pt-1'>Refundable</h4>
                          <Col lg='6' className=' mt-2 mb-2'>
                            <div className='form-check form-check-inline'>
                              <Input type='checkbox' id='basic-unchecked' onClick={(e) => { setIsRefundable(!isRefundable) }} />
                              <Label for='basic-unchecked' className='form-check-label'>
                                IsRefundable
                              </Label>
                            </div>
                          </Col>
                        </Row>
                        <Row>
                          {isRefundable === true ? <>
                            <Col lg='6' className=''>
                              <Label className='form-label' for='checkIn_date'>
                                Refundable Date
                              </Label>
                              <Flatpickr
                                id='checkIn_date'
                                name='checkIn_date'
                                placeholder='Select Refundable Date'
                                options={{
                                  altInput: true,
                                  altFormat: 'd-m-y',
                                  dateFormat: 'd-m-y',
                                  // minDate: moment(new Date()).subtract(1, 'days'),
                                  // defaultDate: inDate
                                }}
                                // disabled
                                // defaultValue={inDate}
                                value={refundDate}
                                onChange={date => {
                                  setRefundDate(date[0])
                                }}
                              />
                            </Col>
                            <Col lg='6' className='mt-2'>
                              <div className='form-check form-check-inline'>
                                <Input type='checkbox' id='basic-bb-unchecked' onClick={(e) => { setIsPenalty(!isPenalty) }} />
                                <Label for='basic-bb-unchecked' className='form-check-label'>
                                  Is Penalty Applied
                                </Label>
                              </div>
                            </Col>
                            <Col lg='6' className=' mt-2'>
                              <Label className='form-label' for='checkIn_date'>
                                Refundable Penalty Date
                              </Label>
                              <Flatpickr
                                id='checkIn_date'
                                name='checkIn_date'
                                placeholder='Select Penalty Date'
                                options={{
                                  altInput: true,
                                  altFormat: 'd-m-y',
                                  dateFormat: 'd-m-y',
                                  // minDate: moment(new Date()).subtract(1, 'days'),
                                  // defaultDate: inDate
                                }}
                                // disabled
                                // defaultValue={inDate}
                                value={pDate}
                                onChange={date => {
                                  setPDate(date[0])
                                }}
                              />
                            </Col>
                            <Col lg='6' className='mt-2'>
                              <Label className='form-label' for='discount'>Discount Type  </Label>
                              <Select
                                theme={selectThemeColors}
                                className='react-select'
                                classNamePrefix='select'
                                placeholder="Select Type"
                                options={discountType}
                                // value={discountT}
                                onChange={(e) => {
                                  setRefundDiscounT(e.value)
                                }}
                              />
                            </Col>
                            {refundDiscounT === 'P' ? <Col lg='6' className='mb-1 mt-2'>
                              <Label className='form-label' for='promo'>Discount Percentage </Label>
                              <Input
                                type='text'
                                name='promo'
                                id='promo'
                                onChange={(e) => {
                                  setRefundDPercent(e.target.value)
                                }}
                                value={refundDPercent}
                              />
                            </Col> : <Col lg='6' className='mb-1 mt-2'>
                              <Label className='form-label' for='promo'>Discount Amount </Label>
                              <Input
                                type='text'
                                name='promo'
                                id='promo'
                                onChange={(e) => {
                                  setRefundDAmount(e.target.value)
                                }}
                                value={refundDAmount}
                              />
                            </Col>
                            }

                          </>
                            : ''}
                        </Row>
                        <Row>
                          <h4 style={{ borderTop: '1px solid #d8d6df' }} className='mt-2 pt-1'>Promo Reservation</h4>
                          <Col lg='6' className=' mt-1'>
                            <Label className='form-label' for='checkIn_date'>
                              Start Stay Date:<span className='text-danger'>*</span>
                            </Label>
                            <Flatpickr
                              id='checkIn_date'
                              name='checkIn_date'
                              placeholder='Select Start Date'
                              options={{
                                altInput: true,
                                altFormat: 'd-m-y',
                                dateFormat: 'd-m-y',
                                // minDate: moment(new Date()).subtract(1, 'days'),
                                // defaultDate: inDate
                              }}
                              // disabled
                              // defaultValue={inDate}
                              value={promoStartD}
                              onChange={date => {
                                setPromoStartD(date[0])
                              }}
                            />
                            {showErrors && promoStartD === '' && <p className='text-danger'>Promo Start Date is required</p>}
                          </Col>
                          <Col lg='6' className=' mt-1'>
                            <Label className='form-label' for='checkIn_date'>
                              End Stay Date:<span className='text-danger'>*</span>
                            </Label>
                            <Flatpickr
                              id='checkIn_date'
                              name='checkIn_date'
                              placeholder='Select End Date'
                              options={{
                                altInput: true,
                                altFormat: 'd-m-y',
                                dateFormat: 'd-m-y',
                                // minDate: moment(new Date()).subtract(1, 'days'),
                                // defaultDate: inDate
                              }}
                              // disabled
                              // defaultValue={inDate}
                              value={promoEndD}
                              onChange={date => {
                                setPromoEndD(date[0])
                              }}
                            />
                            {showErrors && promoEndD === '' && <p className='text-danger'>Promo End Date is required</p>}
                          </Col>
                        </Row>
                        <Row>
                          <h4 style={{ borderTop: '1px solid #d8d6df' }} className='mt-2 pt-1'>Booking Time</h4>
                          <Col lg='6' className=' mt-1'>
                            <Label className='form-label' for='checkIn_date'>
                              Booking Start Date:<span className='text-danger'>*</span>
                            </Label>
                            <Flatpickr
                              value={moment(bookingStartD).toISOString()}
                              data-enable-time
                              id='date-time-picker'
                              className='form-control'
                              onChange={date => setBookingStartD(moment(date[0]))}
                            />
                            {showErrors && bookingStartD === '' && <p className='text-danger'>Booking Start Date is required</p>}
                          </Col>
                          <Col lg='6' className=' mt-1'>
                            <Label className='form-label' for='checkIn_date'>
                              Booking End Date:<span className='text-danger'>*</span>
                            </Label>
                            <Flatpickr
                              value={moment(bookingEndD).toISOString()}
                              data-enable-time
                              id='date-time-picker'
                              className='form-control'
                              onChange={date => setBookingEndD(moment(date[0]))}
                            />
                            {showErrors && bookingEndD === '' && <p className='text-danger'>Booking End Date is required</p>}
                          </Col>
                        </Row>
                        <Row>
                          <h4 style={{ borderTop: '1px solid #d8d6df' }} className='mt-2 pt-1'>Blackout Date</h4>
                          {/* {bDate.map((field, index) => {
                    return ( */}
                          <div className=' mt-1 w-50 d-block'>
                            <Label className='form-label' for='checkIn_date'>
                              Blackout Date
                            </Label>
                            <Flatpickr
                              id='checkIn_date'
                              name='Date'
                              placeholder='Select Date'
                              options={{
                                altInput: true,
                                altFormat: 'd-m-y',
                                dateFormat: 'd-m-y',
                                // minDate: moment(new Date()).subtract(1, 'days'),
                                // defaultDate: inDate
                              }}
                              // disabled
                              // defaultValue={inDate}
                              // value={inDate}
                              // onChange={date => {
                              //     setInDate(date[0])
                              //     setLoader(false);
                              // }}
                              // onChange={(date) => handleBDateInput(index, date[0])}
                              value={blDate}
                              onChange={(date) => {
                                setBlDate(date[0])
                              }
                              }
                            />
                          </div>
                          {/* )
                  })} */}
                        </Row>
                        <Button color='primary' onClick={() => handleAddDate()} className='mt-2 d-block' style={{ width: '150px' }}> Add Date</Button>

                        <Table responsive className='mt-2'>
                          <thead>
                            <tr>
                              <th scope='col' className='text-nowrap'>
                                Date
                              </th>
                              <th scope='col' className='text-nowrap'>
                                Delete
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            {blackDate && blackDate?.map((a, index) => {
                              console.log('val', a);
                              return (
                                <>
                                  <tr>
                                    <td className='text-nowrap text-start'>{a.Date}</td>
                                    <td className='text-nowrap text-start'><Trash className='me-50' size={15} onClick={() => {
                                      deleteBDateInput(index)
                                    }} /></td>
                                  </tr>
                                </>
                              );
                            })}
                          </tbody>
                        </Table>
                        <Row>
                          <h4 style={{ borderTop: '1px solid #d8d6df' }} className='mt-2 pt-1'>Room Type Details</h4>
                          <Col lg='12' className=' mt-2'>
                            <div className='form-check form-check-inline'>
                              <Input type='checkbox' id='basic-cb-unchecked' onClick={(e) => { setCheckRoomType(!checkRoomType) }} />
                              <Label for='basic-cb-unchecked' className='form-check-label'>
                                Check Room Type
                              </Label>
                            </div>
                          </Col>
                          {/* <Col lg='4' className='mb-1'>
                    <Label className='form-label' for='promo'>Room Type <span className='text-danger'>*</span></Label>
                    <Select
                      theme={selectThemeColors}
                      className='react-select'
                      classNamePrefix='select'
                      placeholder="Select Type"
                    // options={discountType}
                    // value={discountT}
                    // onChange={(e) => {
                    //   setDiscounT(e.value)
                    // }}
                    />
                  </Col>  */}
                          {checkRoomType === true ?
                            <>
                              <Col lg='6' className=' mt-1'>
                                <Label className='form-label' for='promo'>Room Type </Label>
                                <Select
                                  theme={selectThemeColors}
                                  className='react-select'
                                  classNamePrefix='select'
                                  placeholder="Select Type"
                                  options={roomTypes}
                                  name='RoomID'
                                  value={roomTypes.filter(c => c.value === roomTypesId)}
                                  onChange={(event) => {
                                    console.log(roomTypes);
                                    // handleCheckRoomInput(index, event)
                                    setRoomTypesId(event.value)
                                  }}
                                />
                              </Col>
                              <Col lg='6' className=' mt-1'>
                                <Label className='form-label' for='promo'>No. of Rooms </Label>
                                <Input
                                  type='text'
                                  name='NumberOfRooms'
                                  id='promo'
                                  value={roomNo}
                                  onChange={(event) => {
                                    // handleCheckRoomInput(index, event)
                                    setRoomNo(event.target.value)
                                  }}
                                />
                              </Col>

                              <Button color='primary' onClick={() => handleAddRoom()} className='mt-2' style={{ width: '200px' }}> Add Room Details</Button>
                              <Table responsive className='mt-2'>
                                <thead>
                                  <tr>
                                    <th scope='col' className='text-nowrap'>
                                      Room ID
                                    </th>
                                    <th scope='col' className='text-nowrap'>
                                      No of Rooms
                                    </th>
                                    <th scope='col' className='text-nowrap'>
                                      Delete
                                    </th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {roomIdName?.map((a, index) => {
                                    console.log('val', a);
                                    return (
                                      <>
                                        <tr>
                                          <td className='text-nowrap'>{a.roomID}</td>
                                          <td className='text-nowrap'>{a.numberOfRooms}</td>
                                          <td className='text-nowrap text-start'><Trash className='me-50' size={15} onClick={() => {
                                            deleteRoomInput(index)
                                          }} /></td>
                                        </tr>
                                      </>
                                    );
                                  })}
                                </tbody>
                              </Table>
                            </>
                            : ''}
                        </Row>
                        <Button color='primary' className='mt-2 d-flex justify-content-center m-auto' style={{ width: '200px' }} onClick={() => savePromotion()}> Save Promotions</Button>
                      </Form>
                    </CardBody>
                  </Card>
                  {/* {
            open ? (
              <Col>
                <Button.Ripple color='primary' onClick={handleOpen}><IoCaretBackSharp color='#FFF' /></Button.Ripple>
                <PromoAcc />
              </Col>
            ) : (
              <Col className='d-flex flex-row flex-wrap justify-content-center align-items-center'>
                {
                  promoArray.map(promo => {
                    return (
                      <Card className='promoCard me-2' style={{ width: '20em', height: '20em' }} key={promo.id} onClick={() => {
                        setPromoHead(promo.heading)
                        handleOpen()
                      }}>
                        <CardBody className='d-flex flex-column justify-content-around align-items-center'>
                          <div>{promo.logo}</div>
                          <CardTitle className='text-center'>{promo.heading}</CardTitle>
                          <CardText className='text-center'>{promo.content}</CardText>
                        </CardBody>
                      </Card>
                    )
                  })
                }
              </Col>
            )
          } */}
                </TabPane>
              </TabContent>

            </div>
          </Form>
        </CardBody>
      </Card>

      {
        newGuest && (
          <AddLicense
            open={newGuest}
            handleOpen={handleNewGuest}
            guestData={guestId}
          />
          // <NewGuest open={newGuest} handleOpen={handleNewGuest} />
        )
      }

    </>
  )
}



export default LicenseManagement
