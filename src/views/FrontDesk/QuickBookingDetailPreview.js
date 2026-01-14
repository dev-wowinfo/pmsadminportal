import moment from 'moment'
import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { Button, Col, Input, Label, Modal, ModalBody, ModalFooter, ModalHeader, Row } from 'reactstrap'
// import BookingModal from './BookingModal'
import { store } from '@store/store'
import { setRefresh } from '../../redux/quickBookingSlice'

const QuickBookingDetailPreview = ({ open, handleOpen, handleModalOpen }) => {

    const data = useSelector(state => state.bookingDetails.bookingResponse)

    console.log('data', data)

    const [openBM, setOpenBM] = useState(false)
    const handleOpenBM = () => setOpenBM(!openBM)

    return (
        <>
            <Modal
                isOpen={open}
                toggle={handleOpen}
                className='modal-dialog-centered modal-md'
                backdrop={false}
            >
                <ModalHeader toggle={() => {
                    handleOpen()
                    handleModalOpen()
                    store.dispatch(setRefresh())
                }}>Booking Confirmation Preview</ModalHeader>
                <ModalBody className='px-sm-2 mx-50 pb-5'>
                    <Row>
                        <Col md={6}>
                            <Label>
                                Transaction Id
                            </Label>
                            <Input type='text' value={data[0]?.TransactionID} disabled />
                        </Col>
                        <Col md={6}>
                            <Label>
                                Booking Id
                            </Label>
                            <Input type='text' value={data[0]?.BookingMapID} disabled />
                        </Col>
                        <Col md={6}>
                            <Label>
                                Booking Date
                            </Label>
                            <Input type='text' value={moment(data[0]?.BookingTime).format('LL')} disabled />
                        </Col>
                        <Col md={6}>
                            <Label>
                                Booking Time
                            </Label>
                            <Input type='text' value={moment(data[0]?.BookingTime).format('LT')} disabled />
                        </Col>
                        <Col md={6}>
                            <Label>
                                Payment Id
                            </Label>
                            <Input type='text' value={data[0]?.PaymentID} disabled />
                        </Col>
                        <Col md={6}>
                            <Label>
                                Guest
                            </Label>
                            <Input type='text' value={`${data[0]?.GuestName}, ${data[0]?.GuestEmail}`} disabled />
                        </Col>
                        <Col md={6}>
                            <Label>
                                Check In Date
                            </Label>
                            <Input type='text' value={moment(data[0]?.CheckInDate).format('LL')} disabled />
                        </Col>
                        <Col md={6}>
                            <Label>
                                Check Out Date
                            </Label>
                            <Input type='text' value={moment(data[0]?.CheckOutDate).format('LL')} disabled />
                        </Col>
                        <Col md={6}>
                            <Label>
                                Address
                            </Label>
                            <Input type='text' value={data[0]?.GuestAddress} disabled />
                        </Col>
                        <Col md={6}>
                            <Label>
                                Total Amount
                            </Label>
                            <Input type='text' disabled value={data[0]?.TotalAmount} />
                        </Col>
                    </Row>
                </ModalBody>
                <ModalFooter className='text-center'>
                    <Button type='button' onClick={handleOpenBM} color='primary'>Manage Current Booking</Button>
                </ModalFooter>
            </Modal>
            {
                open ? (
                    <div className="modal-backdrop fade show" ></div>
                ) : null
            }
            {openBM && <AddHotel open={openBM} handleOpen={handleOpenBM} bookingID={data[0]?.bookingMapID} handleModalOpen={handleModalOpen} />}
        </>
    )
}

export default QuickBookingDetailPreview