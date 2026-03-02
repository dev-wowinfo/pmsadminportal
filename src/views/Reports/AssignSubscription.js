import React, { useEffect, useState } from 'react'
import MUIDataTable from "mui-datatables";
import { Button, Card, CardBody, CardHeader, CardTitle, Col, InputGroup, InputGroupText, Label, Row } from 'reactstrap';
import Flatpickr from 'react-flatpickr'
import { MdDateRange } from "react-icons/md"
import Select from 'react-select'
import { selectThemeColors } from '@utils'
import axios from '../../API/axios'
import { useSelector } from 'react-redux';
import moment from 'moment';
const AssignSubscription = () => {

    useEffect(() => {
        const prevTitle = document.title
        document.title = "PMS-Assign Subscription"

        return () => {
            document.title = prevTitle
        }
    }, [])

    const getUserData = useSelector(state => state.userManageSlice.userData)
    const { LoginID, Token } = getUserData
    const [fromDate, setFromDate] = useState(moment(new Date()).format('YYYY-MM-DD'))
    const [toDate, setToDate] = useState(moment(new Date()).format('YYYY-MM-DD'))
    const [stayover, setStayover] = useState([])
    const [dType, setDType] = useState('')
    // console.log(dType, toDate, fromDate);
    const dateType = [
        { value: '', label: '' },
        { value: 'Booking Date', label: 'Booking Date' },
        { value: 'Checkin Date', label: 'Checkin Date' },
        { value: 'Checkout Date', label: 'Checkout Date' },
    ]
    const columns = [
        {
            name: "bookingID",
            label: "Booking ID",
        },
        {
            name: "status",
            label: "Status",
        },
        {
            name: "bookingSource",
            label: "Booking Source",
        },
        {
            name: "guestName",
            label: "Guest Name",
        },
        {
            name: "roomType",
            label: "Room Type",
        },
        {
            name: "checkInDate",
            label: "CheckIn Date",
        },
        {
            name: "checkOutDate",
            label: "CheckOut Date",
        },
        {
            name: "guests",
            label: "Guests",
        },
        {
            name: "totalAmount",
            label: "Total Amount",
        },
        {
            name: "recievedAmount",
            label: "Recieved Amount",
        },

    ];


    const options = {
        filterType: 'dropdown',
        download: true,
    };

    const handelReset = async () => {
        setDType("");
        setFromDate(moment(new Date()).format("YYYY-MM-DD"));
        setToDate(moment(new Date()).format("YYYY-MM-DD"));
        try {
            const res = await axios.get(
                `/Reports/StayOverDetails?FromDate=${moment(new Date()).format("YYYY-MM-DD")}&ToDate=${moment(new Date()).format("YYYY-MM-DD")}&FetchType=`,
                {
                    headers: {
                        LoginID,
                        Token,
                        FetchType
                    },
                }
            );
            console.log("resData", res.data[0]);
            setStayover(res?.data[0]);
        } catch (error) {
            console.log("error", error);
        }
    };

    const getstayover = async () => {
        try {
            const res = await axios.get(`/Reports/StayOverDetails?FromDate=${moment(fromDate).format('YYYY-MM-DD')}&ToDate=${moment(toDate).format('YYYY-MM-DD')}&FetchType=${dType}`, {
                headers: {
                    LoginID,
                    Token
                }
            })
            // console.log('resData', res.data[0])
            setStayover(res?.data[0])
        } catch (error) {
            console.log('error', error)
        }
    }
    useEffect(() => {
        getstayover()
    }, [])

    return (
        <>
            <Card>
                <CardHeader>
                    <CardTitle><h2>Assign Subscription</h2></CardTitle>
                </CardHeader>
                <CardBody className='text-center'>
                    <Row className='align-items-end'>
                        <Col className='text-start'>
                            <Label className='form-label' for='dateType'>
                                Date Type
                            </Label>
                            <Select
                                theme={selectThemeColors}
                                className='react-select'
                                classNamePrefix='select'
                                // defaultValue={dateType[0]}
                                onChange={e => {
                                    // console.log(e.value);
                                    setDType(e.value)
                                }}
                                value={dateType?.filter((c) => c.value === dType)}
                                options={dateType}
                                isClearable={false}
                            />
                        </Col>
                        <Col className='text-start'>
                            <Label className='form-label' for='startDate'>
                                From Date
                            </Label>
                            {/* <div className='datePicker'>
                                <InputGroup className='input-group-merge'> */}
                            <Flatpickr className='form-control' value={moment(fromDate).format('YYYY-MM-DD')} onChange={date => {
                                setFromDate(moment(date[0]).format('YYYY-MM-DD'))
                            }} id='startDate'
                                options={{
                                    altInput: true,
                                    // altFormat: 'F j, Y',
                                    dateFormat: 'Y-m-d'
                                }} />
                            {/* <InputGroupText>
                                        <MdDateRange size={15} />
                                    </InputGroupText>
                                </InputGroup>
                            </div> */}
                        </Col>
                        <Col className='text-start'>
                            <Label className='form-label' for='startDate'>
                                To Date
                            </Label>
                            {/* <div className='datePicker'>
                                <InputGroup className='input-group-merge'> */}
                            <Flatpickr className='form-control' value={toDate} onChange={date => {
                                setToDate(moment(date[0]).format('YYYY-MM-DD'))
                            }} id='startDate'
                                options={{
                                    altInput: true,
                                    // altFormat: 'F j, Y',
                                    dateFormat: 'Y-m-d'
                                }} />
                            {/* <InputGroupText>
                                        <MdDateRange size={15} />
                                    </InputGroupText>
                                </InputGroup>
                            </div> */}
                        </Col>
                        <Col>
                            <Button className='me-1' color='primary' onClick={getstayover}>
                                Search
                            </Button>
                            <Button className="me-1" color="primary" onClick={handelReset}>
                                Reset
                            </Button>
                        </Col>
                    </Row>
                </CardBody>
                <MUIDataTable
                    // title={"Booking Report"}
                    data={stayover}
                    columns={columns}
                    options={options}
                />
            </Card>

        </>


    )
}

export default AssignSubscription