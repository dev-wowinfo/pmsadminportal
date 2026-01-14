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
import { useSelector } from 'react-redux'
import AddHotel from './AddHotel'

const RoomNumber = () => {
  const getUserData = useSelector(state => state.userManageSlice.userData)

  const { LoginID, Token } = getUserData
  const datesArr = []
  const [selected_date, setSelected_date] = useState(new Date())
  const [open, setOpen] = useState(false)
  const handleOpen = () => setOpen(!open)
  const navigate = useNavigate()
  const [data, setData] = useState([])
  const [refresh, setRefresh] = useState(false)
  const [roomData, setRoomData] = useState([])

  for (let i = 0; i < 15; i++) {
    if (i === 0) {
      datesArr.push(moment(selected_date).format("ddd D MMM YY"))
    } else {
      datesArr.push(moment(selected_date).add(i, 'days').format("ddd D MMM YY"))
    }
  }

  // const userId = localStorage.getItem('user-id')

  const getRooms = () => {
    console.log('123')
    try {
      const bookingsBody = {
        LoginID: LoginID,
        Token: Token,
        Seckey: "abc"
      }
      axios.post(`/getdata/bookingdata/roomnumber`, bookingsBody) // TODO - Why
        .then(response => {
          console.log("Bookings room num response", response?.data[0])
          console.log('123qqq')
          setRoomData(response?.data[0])
        })
    } catch (error) {
      console.log('123qqq2222')
      console.log("Bookings Error=====", error.message)
    }
  }

  useEffect(() => {
    getRooms()
    try {
      const bookingsBody = {
        LoginID: LoginID,
        Token: Token,
        Seckey: "abc",
        CheckInDate: "2022-01-01",
        CheckOutDate: "2022-10-30"
      }
      axios.post(`/getdata/bookingdata/roomchart`, bookingsBody)
        .then(response => {
          console.log("Bookings room chart response", response?.data[0])
          setData(response?.data[0])
        })
    } catch (error) {
      console.log("Bookings Error=====", error.message)
    }
    if (data === []) {
      setRefresh(true)
    }
  }, [refresh])
  console.log(data)
  console.log(roomData)
  const roomDetails = [
    {
      roomId: "RD001",
      roomName: 'Single Room'
    },
    {
      roomId: 'RTD002',
      roomName: 'Deluxe Room'
    }
  ]

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Room Chart</CardTitle>
        </CardHeader>
        <CardBody>
          <Row>
            <Col className='d-flex flex-row'>
              <Button color='primary' onClick={() => navigate(`/reservation`)}>
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
                      datesArr.map(date => {
                        return (
                          <th key={date} className='text-center'><span>{moment(date).format("ddd")}</span> <span className='text-nowrap'>{moment(date).format("D MMM YY")}</span></th>
                        )
                      })
                    }
                  </tr>
                </thead>
                <tbody>
                  {roomDetails.map((curElm, index) => {
                    return (
                      <>
                        <RoomData roomName={curElm.roomName} roomId={curElm.roomId} datesArr={datesArr} data={data} handleOpen={handleOpen} index={index} />
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
                  <tr>
                    <th>Executive Suite Room</th>
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
                  </tr>
                  <tr>
                    <th>Deluxe Room</th>
                  </tr>
                  <tr>
                    <th><FaUserTie /> × 1</th>
                    {
                      datesArr.map((date, index) => {
                        if (moment(date).format('l') === '11/12/2022') {
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
                  </tr>
                  <tr>
                    <th>Superior Room</th>
                  </tr>
                  <tr>
                    <th><FaUserTie /> × 1</th>
                    {
                      datesArr.map((date, index) => {
                        if (moment(date).format('l') === '11/13/2022') {
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
                  </tr>
                  <tr>
                    <th>Normal Room</th>
                  </tr>
                  <tr>
                    <th><FaUserTie /> × 1</th>
                    {
                      datesArr.map((date, index) => {
                        if (moment(date).format('l') === '11/15/2022') {
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
                  </tr>
                </tbody>
              </Table>
            </Col>
          </Row>
        </CardBody>
      </Card>
      <AddHotel  open={open} handleOpen={handleOpen} roomData={roomData} />
    </>
  )
}

export default RoomNumber