import React, { useEffect, useState } from 'react'
import { Button, Col, Form, FormFeedback, Input, Label, Modal, ModalBody, ModalHeader, Row, Table } from 'reactstrap'
import Select from 'react-select'
import { selectThemeColors } from '@utils'
import { Token } from 'prismjs'
import { useSelector } from 'react-redux'
import axios from '../../API/axios'
import toast from 'react-hot-toast'
import { Image_base_uri } from '../../API/axios'
import Flatpickr from 'react-flatpickr'
import '@styles/react/libs/flatpickr/flatpickr.scss'
import moment from 'moment'
import { Trash } from 'react-feather'
const tableOptions = [
    { value: true, label: 'Yes' },
    { value: false, label: 'No' }
]

const statusOptions = [
    { value: "Active", label: 'ACTIVE' },
    { value: "Inactive", label: 'INACTIVE' }
]
let discountType = [
    { value: 'P', label: 'Percentage' },
    { value: 'F', label: 'Flat' }
]
const PromoUpdate = ({ updateOpen, handleUpdateOpen, promoId, getPromoData }) => {
    const getUserData = useSelector(state => state.userManageSlice.userData)
    const { LoginID, Token, CompanyID, HotelName } = getUserData

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
    const [blackDate, setBlackDate] = useState('')
    const [roomTypes, setRoomTypes] = useState([])
    const [roomTypesId, setRoomTypesId] = useState('')
    const [roomNo, setRoomNo] = useState('')
    const [showErrors, setShowErrors] = useState(false);
    const [promoBDate, setPromoBDate] = useState('');
    const [roomData, setRoomData] = useState('');
    const [promoreserveID, setPromoreserveID] = useState('');
    const [promoBookingID, setPromoBookingID] = useState('');
    const [refundID, setRefundID] = useState('');
    const [blDate, setBlDate] = useState('');
    const [blackoutData, setBlackoutData] = useState([]);
    const [roomCheckData, setRoomCheckData] = useState([]);

    const [activeTab, setActiveTab] = useState("details");

    let UpdateBDate = []
    const roomTypeList = () => {
        try {
            const roomTypeDetails = {
                LoginID,
                Token,
                Seckey: "abc",
                Event: 'list'
            }
            axios.post(`/getdata/bookingdata/roomdetails`, roomTypeDetails)
                .then(response => {
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


    const [bDate, setbDate] = useState([]);
    const handleAddDate = () => {
        const values = [...bDate];
        values.push({
            Date: moment(blDate).format('YYYY-MM-DD'),
            BlackOutDateId: '0'
        });
        setbDate(values);
        setBlDate('')
    };


    UpdateBDate = [...bDate, ...promoBDate]
    const deleteBDateInput = async (id, index) => {
        try {
            axios.post(`/promotion/deletebyBlackOutDateId/${id}`, {}, {
                headers: {
                    LoginID,
                    Token,
                }
            })
                .then(response => {
                    console.log('response', response.data[0][0]);
                    if (response.data[0][0].status === "Success") {
                        UpdateBDate.splice(index, 1)
                        setBlackoutData(UpdateBDate)
                        // if (id === "0") {
                        // console.log('0', id, UpdateBDate);
                        setbDate(UpdateBDate)
                        // } else {
                        //     console.log('1', id, UpdateBDate);
                        setPromoBDate([])
                        // }
                    }
                })
        } catch (error) {
            console.log("RoomType Error", error.message)
        }
    }


    useEffect(() => {
        setBlackoutData(UpdateBDate)
    }, [bDate, promoBDate])




    const [val, setVal] = useState([]);
    const handleAddRoom = () => {
        const values = [...val];
        values.push({
            RoomID: roomTypesId,
            NumberOfRooms: roomNo,
            ApplicableRoomId: '0'
        });
        setVal(values);
        setRoomNo('')
        setRoomTypesId('')
    };
    const UpdateRoomData = [...val, ...roomData]
    const deleteRoomInput = async (id, index) => {
        try {
            axios.post(`/promotion/deletebyApplicableRoomId/${id}`, {}, {
                headers: {
                    LoginID,
                    Token,
                }
            })
                .then(response => {
                    console.log('response', response.data[0][0]);
                    if (response.data[0][0].status === "Success") {
                        UpdateRoomData.splice(index, 1)
                        setRoomCheckData(UpdateRoomData)
                        setVal(UpdateRoomData)
                        setRoomData([])
                    }
                })
        } catch (error) {
            console.log("RoomType Error", error.message)
        }
    }
    useEffect(() => {
        setRoomCheckData(UpdateRoomData)
    }, [val, roomData])

    const savePromotion = async () => {
        setShowErrors(true);
        try {
            const promotionData = {
                "Promotion": {
                    "PromotionId": promoId,
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
                    "PromoReservationId": promoreserveID,
                    "StartStayDate": promoStartD,
                    "EndStayDate": promoEndD,
                    "Days": 2,
                    "LessDaysCount": 0,
                    "LessDiscPercentage": 0,
                    "LessDiscAmount": 0
                },
                "Promo_BookingTime": {
                    "Promo_BookingTimeId": promoBookingID,
                    "BookingStartDate": bookingStartD,
                    "BookingEndDate": bookingEndD
                },
                "Promo_BlackOutDate": blackoutData,
                "Promo_ApplicableRooms": roomCheckData,
                "Promo_Refundable": {
                    "RefundableId": refundID,
                    "RefundDateTime": refundDate,
                    "IsPenaltyApply": isPenalty,
                    "RefundPenaltyDate": pDate,
                    "DiscountType": refundDiscounT,
                    "LessRefundPerc": refundDPercent,
                    "LessRefundAmt": refundDAmount
                }
            }
            console.log('promotionData', promotionData)
            const res = await axios.post('/promotion/update', promotionData, {
                headers: {
                    LoginID,
                    Token,
                }
            })
            if (res.data[0][0].status === "Success") {
                toast.success(res.data[0][0].Message, { position: "top-center" })
                handleUpdateOpen()
                getPromoData()
            }
        } catch (error) {
            console.log("Error", error)
        }
    }

    const getPromoUpdateData = async () => {
        try {
            const res = await axios.get(`/promotion/getbyid?PromotionID=${promoId}`, {
                headers: {
                    LoginID,
                    Token
                }
            })
            // setData(res?.data[0])
            let data = res?.data
            setPromoName(data[0][0]?.promoName)
            setDiscounT(data[0][0]?.discountType)
            setDPercentage(data[0][0]?.discPercentage)
            setDAmount(data[0][0]?.discAmount)
            setNoOfRoom(data[0][0]?.minRoomRequire)
            setGuestType(data[0][0]?.guestType)
            setIsRefundable(data[0][0]?.isRefundable)
            setRefundDate(data[5][0]?.refundDateTime)
            setPDate(data[5][0]?.refundPenaltyDate)
            setRefundDiscounT(data[5][0]?.discountType)
            setRefundDPercent(data[5][0]?.lessRefundPerc)
            setRefundDAmount(data[5][0]?.lessRefundAmt)
            setRefundID(data[5][0]?.refundableId)
            setPromoStartD(data[1][0]?.startStayDate)
            setPromoEndD(data[1][0]?.endStayDate)
            setBookingStartD(data[2][0]?.bookingStartDate)
            setBookingEndD(data[2][0]?.bookingEndDate)
            setPromoBDate(data[4])
            setRoomData(data[3])
            setCheckRoomType(data[0][0]?.checkRoomType)
            setPromoreserveID(data[1][0]?.promoReservationId)
            setPromoBookingID(data[2][0]?.promo_BookingTimeId)
            setIsPenalty(data[5][0]?.isPenaltyApply)

        } catch (error) {
            console.log('error', error)
        }
    }
    useEffect(() => {
        getPromoUpdateData()
    }, [updateOpen])

    const documentUpload = (e) => {
        setNewPoslogo(URL.createObjectURL(e.target.files[0]))
        // console.log('posBlob', poslogo)
    }

    return (
        <>
            <Modal isOpen={updateOpen}
                toggle={handleUpdateOpen}
                className='modal-dialog-centered modal-lg'
                backdrop={false}
            >
                <ModalHeader toggle={handleUpdateOpen}>

                </ModalHeader>

                <div className="modal-content shadow rounded-4">

                    {/* Header */}
                    <div className="modal-header border-0">
                        <div className='d-flex gap-3'>
                            <div className='d-flex flex-column'>
                                <h4 className="fw-bold mb-1">Grand Plaza Hotel</h4>
                                <small className="text-mute">License ID: LIC-001</small>
                            </div>
                            <div className="mt-1">
                                <span className="badge bg-success">Active</span>
                            </div>
                        </div>
                    </div>

                    {/* Tabs */}
                    <div className="px-4">
                        <ul className="nav nav-pills bg-light rounded-3 mt-1 mb-3">
                            <li className="nav-item flex-fill text-center">
                                <button
                                    className={`nav-link w-100 ${activeTab === "details" ? "active" : ""}`}
                                    onClick={() => setActiveTab("details")}
                                >
                                    Details
                                </button>
                            </li>

                            <li className="nav-item flex-fill text-center">
                                <button
                                    className={`nav-link w-100 ${activeTab === "modules" ? "active" : ""}`}
                                    onClick={() => setActiveTab("modules")}
                                >
                                    Modules
                                </button>
                            </li>

                            <li className="nav-item flex-fill text-center">
                                <button
                                    className={`nav-link w-100 ${activeTab === "actions" ? "active" : ""}`}
                                    onClick={() => setActiveTab("actions")}
                                >
                                    Actions
                                </button>
                            </li>
                        </ul>
                    </div>

                    <div className="modal-body">

                     
                        {activeTab === "details" && (
                            <div className="card border-0 shadow-sm rounded-4 p-1">
                                <h5 className="fw-bold mb-4">Subscription Details</h5>

                                <div className="row g-4">
                                    <div className="col-md-3">
                                        <small className="text-muted">Plan Name</small>
                                        <h6 className="fw-semibold">Enterprise</h6>
                                    </div>

                                    <div className="col-md-3">
                                        <small className="text-muted">Status</small>
                                        <div>
                                            <span className="badge bg-success">Active</span>
                                        </div>
                                    </div>

                                    <div className="col-md-3">
                                        <small className="text-muted">Start Date</small>
                                        <h6 className="fw-semibold">Aug 02, 2025</h6>
                                    </div>

                                    <div className="col-md-3">
                                        <small className="text-muted">End Date</small>
                                        <h6 className="fw-semibold">Aug 02, 2026</h6>
                                    </div>

                                    <div className="col-md-3">
                                        <small className="text-muted">Max Rooms</small>
                                        <h6 className="fw-semibold">500</h6>
                                    </div>

                                    <div className="col-md-3">
                                        <small className="text-muted">Max Users</small>
                                        <h6 className="fw-semibold">50</h6>
                                    </div>

                                    <div className="col-md-3">
                                        <small className="text-muted">Auto Renew</small>
                                        <h6 className="fw-semibold">Yes</h6>
                                    </div>

                                    <div className="col-md-3">
                                        <small className="text-muted">Created By</small>
                                        <h6 className="fw-semibold">Admin</h6>
                                    </div>
                                </div>
                            </div>
                        )}

                        
                        {activeTab === "modules" && (
                            <div className="card border-0 shadow-sm rounded-4 p-1">
                                <h5 className="fw-bold mb-1">Enabled Modules</h5>
                                <p className="text-mute mb-4">
                                    Features available in this license
                                </p>

                                <div className="d-flex flex-wrap gap-2">
                                    {[
                                        "Front Office",
                                        "Housekeeping",
                                        "POS",
                                        "Accounting",
                                        "Reports",
                                        "Integrations",
                                    ].map((module, i) => (
                                        <span
                                            key={i}
                                            className="badge bg-secondary px-1 py-1 d-flex align-items-center gap-2"
                                            style={{ fontSize: "14px" }}
                                        >
                                            <span
                                                className="bg-success rounded-circle"
                                                style={{ width: 8, height: 8 }}
                                            ></span>
                                            {module}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}


                        {activeTab === "actions" && (
                            <div className="text-center">
                                {activeTab === "actions" && (
                                    <div className="card border-0 shadow-sm rounded-4 p-1">

                                        <h5 className="fw-bold mb-1">License Actions</h5>
                                        <p className="text-mute mb-2">
                                            Manage license status and settings
                                        </p>

                                        
                                        <div className='d-flex justify-content-center'>
                                            <button className="btn btn-danger w-50 py-1 fw-semibold mb-1">
                                                🚫 Suspend License
                                            </button>
                                        </div>
                                        <hr />

                                        
                                        <div className="d-grid gap-1 mt-1">
                                            <div className='d-flex justify-content-center'>
                                                <button className="btn btn-light border w-50 py-1 fw-semibold">
                                                    🔄 Extend Duration
                                                </button>
                                            </div>
                                            <div className='d-flex justify-content-center'>
                                                <button className="btn btn-light border w-50 py-1 fw-semibold">
                                                    🕒 Apply Grace Period
                                                </button>
                                            </div>
                                            <div className='d-flex justify-content-center'>
                                                <button className="btn btn-light border w-50 py-1 fw-semibold">
                                                    🔑 Upgrade Plan
                                                </button>
                                            </div>
                                        </div>

                                    </div>
                                )}

                            </div>
                        )}

                    </div>
                </div>

            </Modal>
            {
                updateOpen ? (
                    <div className="modal-backdrop fade show" ></div>
                ) : null
            }
        </>
    )
}

export default PromoUpdate