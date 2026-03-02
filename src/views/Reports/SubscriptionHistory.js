import React, { useEffect, useState } from 'react';
import MUIDataTable from "mui-datatables";
import { Button, Card, CardBody, CardHeader, CardTitle, Col, InputGroup, InputGroupText, Label, Row } from 'reactstrap';
import Flatpickr from 'react-flatpickr';
import { MdDateRange } from "react-icons/md";
import axios from '../../API/axios';
import { useSelector } from 'react-redux';
import moment from 'moment';

const SubscriptionHistory = () => {

    useEffect(() => {
        const prevTitle = document.title
        document.title = "PMS-Payment Folio"

        return () => {
            document.title = prevTitle
        }
    }, [])

    function subtractMonths(date, months) {
        date.setMonth(date.getMonth() - months);
        return date;
    }
    const getUserData = useSelector(state => state.userManageSlice.userData);
    const { LoginID, Token } = getUserData;
    const [fromDate, setFromDate] = useState(moment(subtractMonths(new Date(), 1)).format('YYYY-MM-DD'));
    const [toDate, setToDate] = useState(moment(new Date()).format('YYYY-MM-DD'))
    const [bookingData, setBookingData] = useState([]);
    console.log(toDate, fromDate);

    const columns = [
        {
            name: "bookingID",
            label: "Booking Id",
        },
        {
            name: "paymentType",
            label: "Payment Type",
        },
        {
            name: "paymentDate",
            label: "Payment Date",
        },
        {
            name: "referenceText",
            label: "Reference Text",
        },
        {
            name: "paidAmount",
            label: "Paid Amount",
        },
        {
            name: "invNo",
            label: "Invoice Number",
        },
    ];

    const options = {
        filterType: 'dropdown',
        download: true,
    };
    const handelReset = async () => {
        // setDType("");
        setFromDate(moment(new Date()).format("YYYY-MM-DD"));
        setToDate(moment(new Date()).format("YYYY-MM-DD"));
        try {
            const res = await axios.get(
                `/Reports/GuestDetails?FromDate=${moment(subtractMonths(new Date(), 1))}&ToDate=${moment(new Date()).format("YYYY-MM-DD")}&FetchType=`,
                {
                    headers: {
                        LoginID,
                        Token,
                    },
                }
            );
            console.log("resData", res.data[0]);
            setBookingdata(res?.data[0]);
        } catch (error) {
            console.log("error", error);
        }
    };

    const getBookingData = async () => {
        try {
            const res = await axios.get(`/Reports/PaymentFolioDetails?FromDate=${moment(fromDate).format('YYYY-MM-DD')}&ToDate=${moment(toDate).format('YYYY-MM-DD')}`, {
                headers: {
                    LoginID,
                    Token,
                }
            });
            console.log('resData', res.data[0]);
            setBookingData(res?.data[0]);
        } catch (error) {
            console.log('error', error);
        }
    };

    useEffect(() => {
        getBookingData();
    }, [fromDate, toDate]);

    return (
        <>
            <Card>
                <CardHeader>
                    <CardTitle><h2>Subscription History</h2></CardTitle>
                </CardHeader>
                <CardBody className='text-center'>
                    <Row className='align-items-end'>
                        <Col className='text-start'>
                            <Label className='form-label' for='startDate'>
                                From Date
                            </Label>
                            {/* <div className='datePicker'> */}
                            {/* <InputGroup className='input-group-merge'> */}
                            <Flatpickr className='form-control' value={fromDate} onChange={date => {
                                setFromDate(moment(date[0]).format('YYYY-MM-DD'));
                            }} id='startDate' options={{
                                altInput: true,
                                dateFormat: 'Y-m-d'
                            }} />
                            {/* <InputGroupText>
                                        <MdDateRange size={15} />
                                    </InputGroupText>
                                </InputGroup>
                            </div> */}
                        </Col>
                        <Col className='text-start'>
                            <Label className='form-label' for='endDate'>
                                To Date
                            </Label>
                            {/* <div className='datePicker'>
                                <InputGroup className='input-group-merge'> */}
                            <Flatpickr className='form-control' value={toDate} onChange={date => {
                                setToDate(moment(date[0]).format('YYYY-MM-DD'));
                            }} id='endDate' options={{
                                altInput: true,
                                dateFormat: 'Y-m-d'
                            }} />
                            {/* <InputGroupText>
                                        <MdDateRange size={15} />
                                    </InputGroupText>
                                </InputGroup>
                            </div> */}
                        </Col>
                        <Col>
                            <Button className='me-1' color='primary' onClick={getBookingData}>
                                Search
                            </Button>
                            <Button className='me-1' color='primary' onClick={handelReset}>
                                Reset
                            </Button>
                        </Col>
                    </Row>
                </CardBody>
                <MUIDataTable
                    data={bookingData}
                    columns={columns}
                    options={options}
                />
            </Card>
        </>
    );
};

export default SubscriptionHistory;
