import React, { useState } from 'react'
import { Button, Input, Col, Label, Modal, ModalBody, ModalHeader, Row, Form, ModalFooter } from 'reactstrap'
// import { store } from '@store/store'
import { useSelector } from 'react-redux'
import moment from 'moment'
// import BookingModal from '../FrontDesk/BookingModal'
import AddHotel from '../FrontDesk/AddHotel'


const BookingDetailPreview = ({ bookingOption, bookingResponse, showBookingDetails, BookingError, handleFinalModal, dispose }) => {

    const bookingStore = useSelector(state => state.booking)
    console.log("guest_details", bookingStore)
    // console.log(bookingStore.bookingDetail_store[0][0][0].Adult)
    const confirm = () => {
        // onSubmit(e)
        console.log("disposing....")
        dispose()
    }

    const date = new Date()

    const [open, setOpen] = useState(false)
    const handleOpen = () => setOpen(!open)

    return (
        <>
            {
                // editModelData.length > 0 &&
                <>
                    <Modal
                        isOpen={showBookingDetails}
                        // toggle={handleEditModal}
                        className='modal-dialog-centered modal-lg'
                    // backdrop={false}
                    >
                        {
                            BookingError === '' ? (
                                <>  <style>
                                    {
                                        `.hide-close button.btn-close{
                                            display: none;
                                        }`
                                    }
                                </style>
                                    <ModalHeader className='bg-transparent hide-close' toggle={confirm}>
                                        <div className=' mb-1'>
                                            {
                                                bookingOption === 'hold' ? "Booking Created - On Hold" : "Booking Confirmation"
                                            }
                                        </div>
                                    </ModalHeader>
                                    <ModalBody className='px-sm-2 mx-50 pb-5'>
                                        <Row>
                                            <Col md={6}>
                                                <Label>
                                                    Transaction Id
                                                </Label>
                                                <Input type='text' value={bookingResponse?.TransactionID} disabled />
                                            </Col>
                                            <Col md={6}>
                                                <Label>
                                                    Booking Id
                                                </Label>
                                                <Input type='text' value={bookingResponse?.BookingMapID} disabled />
                                            </Col>
                                            <Col md={6}>
                                                <Label>
                                                    Booking Date
                                                </Label>
                                                <Input type='text' value={moment(date).format('LL')} disabled />
                                            </Col>
                                            <Col md={6}>
                                                <Label>
                                                    Booking Time
                                                </Label>
                                                <Input type='text' value={moment(date).format('LT')} disabled />
                                            </Col>
                                            <Col md={6}>
                                                <Label>
                                                    Payment Id
                                                </Label>
                                                <Input type='text' value={bookingResponse?.PaymentID} disabled />
                                            </Col>
                                            <Col md={6}>
                                                <Label>
                                                    Guest
                                                </Label>
                                                <Input type='text' value={`${bookingResponse?.GuestName}, ${bookingResponse?.GuestEmail}`} disabled />
                                            </Col>
                                            <Col md={6}>
                                                <Label>
                                                    Check In Date
                                                </Label>
                                                <Input type='text' value={moment(bookingResponse?.CheckInDate).format('LL')} disabled />
                                            </Col>
                                            <Col md={6}>
                                                <Label>
                                                    Check Out Date
                                                </Label>
                                                <Input type='text' value={moment(bookingResponse?.CheckOutDate).format('LL')} disabled />
                                            </Col>
                                            <Col md={6}>
                                                <Label>
                                                    Address
                                                </Label>
                                                <Input type='text' value={bookingResponse?.GuestAddress} disabled />
                                            </Col>
                                            <Col md={6}>
                                                <Label>
                                                    Total Amount
                                                </Label>
                                                <Input type='text' disabled value={bookingResponse?.TotalAmount} />
                                            </Col>
                                        </Row>

                                    </ModalBody>
                                    <ModalFooter className='d-flex flex-row justify-content-between align-items-center'>
                                        {bookingOption === 'hold' ? <></> : <Button type='button' onClick={handleOpen} color='primary'>Manage Current Booking</Button>}
                                        <Button type='button' onClick={confirm} color='success'>Ok, Next Booking</Button>
                                    </ModalFooter>
                                </>) : (<>
                                    <ModalHeader className='bg-transparent' toggle={handleFinalModal}>
                                        <div className='text-danger mb-1'>Error while booking</div>
                                    </ModalHeader>
                                    <ModalBody className='px-4 mx-50 pb-1 '>
                                        <Row>
                                            <Col>
                                                <h3 className='text-danger'>{BookingError}</h3>
                                                <p>Please share the error message above with the tech support team.</p>
                                            </Col>
                                        </Row>

                                    </ModalBody>
                                    <ModalFooter>
                                        <Button onClick={handleFinalModal} color='danger'>Back</Button>
                                    </ModalFooter>
                                </>)
                        }

                    </Modal>
                </>

            }
            {open && <AddHotel open={open} handleOpen={handleOpen} bookingID={bookingResponse?.bookingMapID} />}
        </>

    )
}

export default BookingDetailPreview
