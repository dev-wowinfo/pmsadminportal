import React, { useState, useEffect } from 'react'
import { Alert, Button, Card, CardBody, CardHeader, CardTitle, Col, Row, Table } from 'reactstrap'
import Flatpickr from 'react-flatpickr'
import moment from 'moment'

// ** Styles
import './table.scss'
import '@styles/react/libs/flatpickr/flatpickr.scss'
// import BookingModal from './BookingModal'
import { useNavigate } from 'react-router-dom'
import axios from '../../API/axios'
import { FaUserTie } from 'react-icons/fa'
import RoomData from './RoomData'

import { store } from '@store/store'
import { setCheckInDate } from '@store/booking'
import { useSelector } from 'react-redux'
import AddHotel from './AddHotel'

const RoomNumber = (props) => {
  const getUserData = useSelector(state => state.userManageSlice.userData)

  const { LoginID, Token } = getUserData

  const datesArr = []
  const [selected_date, setSelected_date] = useState(props.date ?? new Date())
  const [open, setOpen] = useState(false)

  const [OpenRoomAllocationID, setOpenRoomAllocationID] = useState()
  const [openRoom, setOpenRoom] = useState()

  const navigate = useNavigate()
  const [data, setData] = useState([])
  const [refresh, setRefresh] = useState(false)
  const [roomData, setRoomData] = useState([])
  const [bookingID, setBookingID] = useState('')

  const handleRefresh = () => setRefresh(!refresh)

  const handleOpen = () => {
    //setOpenRoomAllocationID(OpenRoomAllocationID)
    setOpen(!open)
  }
  useEffect(() => {
    console.log('RoomNumber data', data)
    setOpenRoom(data.filter(room => room.RoomAllocationID === OpenRoomAllocationID)[0])
    const b_id = data.filter(room => room.RoomAllocationID === OpenRoomAllocationID)
    setBookingID(b_id[0]?.BookingID)
    console.log('OpenRoomAllocationID - ', OpenRoomAllocationID)

  }, [OpenRoomAllocationID])

  for (let i = 0; i < 15; i++) {
    if (i === 0) {
      datesArr.push(moment(selected_date).format("ddd D MMM YY"))
    } else {
      datesArr.push(moment(selected_date).add(i, 'days').format("ddd D MMM YY"))
    }
  }

  // const userId = localStorage.getItem('user-id')

  const getRoomDetails = () => {
    console.log('123')
    //console.log('in room refresh> ', refresh)
    try {
      const bookingsBody = {
        LoginID,
        Token,
        Seckey: "abc",
        Event: 'Select'
      }
      axios.post(`/getdata/bookingdata/roomdetails`, bookingsBody) // TODO - Why
        .then(detailResponse => {
          let roomDetailsdata = detailResponse?.data[0]
          console.log("Room details response data > ", roomDetailsdata)
          setRoomData(roomDetailsdata)

        })
    } catch (error) {
      console.log("Room Detail Response Error=====", error.message)
    }

  }

  //Fahad -start -to get roommaster details for listing all the rooms
  const getRoomMaster = () => {
    console.log('123')
    //console.log('in room refresh> ', refresh)
    try {
      const roomdetailsReq = {
        LoginID,
        Token,
        Seckey: "abc",
        Event: 'Select'
      }
      console.log("roomdetailsReq > ", roomdetailsReq)

      axios.post(`/getdata/bookingdata/roomdetails`, roomdetailsReq) // TODO - Why
        .then(detailResponse => {
          let roomDetailsdata = detailResponse?.data[0]
          console.log("Room details response data > ", roomDetailsdata)

          // Remove Test Data
          setRoomData(roomDetailsdata)

        })
    } catch (error) {
      console.log("Room Detail Response Error=====", error.message)
    }

  }
  //Fahad - end

  useEffect(() => {
    console.log('in use effect for room details')

    getRoomDetails()
  }, [refresh])

  useEffect(() => {
    async function populateRoomChartData() {
      try {
        if (roomData === undefined || roomData.length === 0) {
          console.log('in use effect of room chart calling room detail')

          getRoomDetails()
        }
        console.log('moment date-', moment(selected_date).format("y-MM-DD HH:mm:ss"))
        const bookingsBody = {
          LoginID,
          Token,
          Seckey: "abc",
          CheckInDate: moment(selected_date).format("y-MM-DD HH:mm:ss"),
          CheckOutDate: moment(selected_date).add(15, 'days').format("y-MM-DD HH:mm:ss")
        }
        const chartResponse = await axios.post('/getdata/bookingdata/roomchart', bookingsBody)
        let roomChartData = chartResponse?.data[0]
        // Test Data
        // TODO - Check for data, if not use hard code for test
        console.log("Static Roomchart response data- ", roomChartData)
        setData(roomChartData)

      } catch (error) {
        console.log("Bookings Error=====", error.message)
      }
      if (data === []) {
        setRefresh(true)
      }
    }
    populateRoomChartData()

  }, [selected_date, refresh])
  console.log(data)
  console.log(roomData)

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Room Chart</CardTitle>
        </CardHeader>
        <CardBody>
          <Row>
            <Col className='d-flex flex-row'>
              <Button color='primary' onClick={
                () => (
                  store.dispatch(setCheckInDate(selected_date)),
                  navigate(`/reservation`)
                )
              }>
                Make a reservation
              </Button>
              <div md={4} className='ms-1 flatpickr'>
                <Flatpickr
                  id='hf-picker'
                  className='form-control'
                  placeholder='Select Date'
                  options={{
                    altInput: true,
                    altFormat: 'd-m-y',
                    dateFormat: 'd-m-y'
                  }}
                  value={selected_date}
                  onChange={date => {
                    console.log(date)
                    setSelected_date(date[0])
                  }}
                />
              </div>
            </Col>
          </Row>
          <Row className='my-1'>
            <Col>
              <Table className='t_height' bordered responsive>
                <thead>
                  <tr>
                    <th className='text-nowrap'>Room & Dates</th>
                    {
                      datesArr.map((date, index) => {
                        return (
                          <th key={`room&dates${date}_${index}`} className='text-center'><span>{moment(date).format("ddd")}</span> <span className='text-nowrap'>{moment(date).format("DD")}</span></th>
                        )
                      })
                    }
                  </tr>
                </thead>
                <tbody>
                  {roomData?.map((curElm, index) => {
                    return (
                      <>
                        <RoomData key={`room_element_${index}`}
                          handleRefresh={handleRefresh}
                          roomName={curElm.RoomType} roomId={curElm.RoomID}
                          datesArr={datesArr}
                          data={data?.filter(elem => elem.RoomID === curElm.RoomID)}
                          handleOpen={handleOpen}
                          setOpenRoomAllocationID={setOpenRoomAllocationID} index={index} />
                        {/* <tr> 
                          <th>{curElm.roomName}</th>
                        </tr>
                        <tr>
                          <th><FaUserTie /> × 1</th>
                          {
                            datesArr.map((date, index) => {
                              if (moment(date).format('l') === '11/9/2022') {
                                return (
                                  <td key={index}>
                                    <Alert style={{ cursor: 'pointer' }} color='success' onClick={handleOpen}>
                                      <h6 className='alert-heading'>Guest Name</h6>
                                    </Alert>
                                  </td>
                                )
                              } else {
                                return (
                                  <td key={index}></td>
                                )
                              }
                            })
                          }
                        </tr> */}
                      </>
                    )
                  })}

                </tbody>
              </Table>
            </Col>
          </Row>
        </CardBody>
      </Card>
      {console.log('bookingID Room Number', bookingID)}
      <AddHotel open={open} handleOpen={handleOpen} roomData={openRoom} bookingID={bookingID} />
    </>
  )
}

export default RoomNumber