import { React, useEffect, useRef, useState } from 'react'
import { Badge, Col, Form, Label, Modal, ModalBody, ModalHeader, Row, Table } from 'reactstrap'

// ** Third Party Components
import moment from 'moment'
import Flatpickr from 'react-flatpickr'
import { useSelector } from 'react-redux'
import { Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { useForm } from 'react-hook-form'
import * as yup from 'yup'

// ** Styles
import '@styles/react/libs/flatpickr/flatpickr.scss'

// ** Store & Actions
import { store } from '@store/store'

import { setCheckInDate, setCheckOutDate, setCustomerIdStore, setGuestDetailDropdownStore, setLoaderStore, setRoomsAvailViewStore, setSourceTypeStore, setBookingSourceDropdownStore } from "../../redux/quickBookingSlice"
import { setBookingID, disposeStore, setPaymentTypeStore, setPaymentModeStore, setBookingCreatedByStore, setPaymentTypeDropdownStore, setPaymentModeDropdownStore, setRoomsBooked, setPrice, setBookingDetailStore, setBookingSourceStore, setBookingResponse } from "../../redux/quickBookingSlice"

import { useDispatch } from "react-redux"
import axios, { Image_base_uri } from '../../API/axios'

// ** Reactstrap Imports
import Select from 'react-select'
import CreatableSelect from 'react-select/creatable'
import { Input } from 'reactstrap'
import { Button, FormFeedback, Spinner } from 'reactstrap'

// ** Utils
import { selectThemeColors } from '@utils'

import { ArrowRight, Edit3 } from 'react-feather'

import ReactSlider from "react-slider";
import toast from 'react-hot-toast'
import RegisterGuest from '../SingleReservation/RegisterGuest'
import RegisterAgency from '../SingleReservation/RegisterAgency'
// import BookingModal from './BookingModal'
import QuickBookingDetailPreview from './QuickBookingDetailPreview'
import EditGuest from '../SingleReservation/EditGuest'

const discountOptions = [
    { value: 'percentage', label: '%' },
    { value: 'flat', label: 'Flat' }
]
const defaultValues = {
    bookingSource: '',
    sourceType: '',
    guestDetails: '',
    specialNote: '',
    cType: '',
    ptype: '',
    booker: '',
    pref: '',
    inote: '',
    cname: '',
    newBooker: ''
}


const QuickBookingModal = ({ open, handleOpen, handleModalOpen }) => {
    const getUserData = useSelector(state => state.userManageSlice.userData)
    const { LoginID, Token } = getUserData

    //common state values
    const [loader, setLoader] = useState(false);
    // const userId = LoginID;
    const dispatch = useDispatch()

    //fetch redux data from bookingDetails
    const quickBookingStore = useSelector(state => state.bookingDetails)
    console.log('quickBookingStore', quickBookingStore);
    const [roomDetails, setRoomDetails] = useState(quickBookingStore?.roomData || {})
    console.log("ROOMSDEATILS++++>", roomDetails);
    //dates ref and state values
    const outDateRef = useRef(null)
    const [inDate, setInDate] = useState("");
    const [outDate, setOutDate] = useState("");
    const [duration, setDuration] = useState(1);
    const [currentValue, setCurrentValue] = useState(1);

    //selected room 
    const [selectedRoom, setSelectedRoom] = useState({})
    console.log('selectedRoom', selectedRoom);
    const [selectedMealId, setSelectedMealId] = useState("")
    // const [selectedRoomId,setSelectedRoomId] = useState(quickBookingStore?.roomData?.RoomID||"")

    const [mealsList, setMealsList] = useState([])

    const [discount, setDiscount] = useState(0)
    const [discountType, setDiscountType] = useState()
    const [discountAmount, setDiscountAmount] = useState(0)
    const [disabled, setDisabled] = useState(false)
    const [cost, setCost] = useState(0)
    const [netCost, setNetCost] = useState(0)
    const [gst, setGst] = useState(0)
    const [total, setTotal] = useState(0)
    const [payFull, setPayFull] = useState("");
    const [cgst, setCgst] = useState(0)
    const [amount, setAmount] = useState("")
    const [guestEmailId, setGuestEmailId] = useState("")
    const [guestName, setGuestName] = useState("")
    const [guestLastName, setGuestLastName] = useState("")
    const [guestMobileNumber, setGuestMobileNumber] = useState("")
    const [prefix, setPrefix] = useState('')
    const [nameProof, setNameProof] = useState("")
    const [idProofType, setIdProofType] = useState('')
    const [idProofNumber, setIdProofNumber] = useState('')
    const [comingFrom, setComingFrom] = useState('')
    const [goingTo, setGoingTo] = useState('')
    const usePrevious = (value) => {
        const ref = useRef()
        useEffect(() => {
            ref.current = value
        }, [value])

        return ref.current
    }
    const prevDiscount = usePrevious(discount)

    // const sourceTypesError = [{ label: 'Please Select Booking Source' }]

    const [bookingSourceOptions, setBookingSourceOptions] = useState([])
    const [guestDetailOptions, setGuestDetailOptions] = useState([])
    const [mealsOptions, setMealsOptions] = useState([])
    const [sourceTypes, setSourceTypes] = useState([])
    const [paymentTypeOptions, setPaymentTypeOptions] = useState([])
    const [paymentModeOptions, setPaymentModeOptions] = useState([])


    //** For New User Registeration
    // const [bookingSourceId, setBookingSourceId] = useState("BSID20230614AA00005")
    const [bookingSourceId, setBookingSourceId] = useState("")
    const [selGuestDetail, setSelGuestDetail] = useState('')
    const [note, setNote] = useState('')
    const [showErrors, setShowErrors] = useState(false);
    const [dropdownLoader, setDropdownLoader] = useState(false);
    const [status, setStatus] = useState(true)
    const [sourceType, setSourceType] = useState([])

    const [updated, setUpdated] = useState(false)
    const [adult, setAdult] = useState(0)
    const [children, setChildren] = useState(0)
    const [infant, setInfant] = useState(0)
    const [meal, setMeal] = useState()
    const [mealId, setMealId] = useState()
    console.log('mealId', mealId);
    const [ratePlans, setRatePlans] = useState([])
    const [pstatus, setPstatus] = useState('')
    const [cname, setCname] = useState('')
    const [cadd, setCadd] = useState('')
    const [userDetails, setUserDetails] = useState([])
    const [guestOptions, setGuestOptions] = useState([])

    const [newRatePlans, setNewRatePlans] = useState([])
    const [dateRate, setDateRate] = useState([])
    console.log('dateRate', newRatePlans);
    const [selNewRate, setSelNewRate] = useState([])
    console.log('selNewRate', selNewRate);
    const [actualRate, setActualRate] = useState(0)

    const [openg, setOpeng] = useState(false)
    const handleOpeng = () => setOpeng(!openg)

    const [openAgency, setOpenAgency] = useState(false)
    const handleOpenAgency = () => setOpenAgency(!openAgency)

    const [openBookModal, setOpenBookModal] = useState(false)
    const handleBookModal = () => setOpenBookModal(!openBookModal)
    const [newBID, setNewBID] = useState('')

    const [editGuest, setEditGuest] = useState(false)
    const handleEditGuest = () => setEditGuest(!editGuest)

    const [hStatus, setHstatus] = useState([])
    const [hasGst, setHasGst] = useState(true)
    const [uploadedImg, setUploadedImg] = useState('')
    const bookingSourceDropDown = quickBookingStore.bookingSourceDropdown_store;
    const guestDetailDropDown = quickBookingStore.guestDetailDropdown_store;
    const drop_downLoader = quickBookingStore.loader_store;
    const paymentTypeDropDown = quickBookingStore.paymentTypeDropdown_store
    const roomData = quickBookingStore.roomData


    // yup schema for form hook
    const QuickBookingSchema = yup.object().shape({
        // bookingSource: yup.string().required(),
        // sourceType: yup.string().required(),
        // guestDetails: yup.object().required(),
        // specialNote: yup.string().required(),

        // paymentStatus: yup.string().required(),
        // collectionType: yup.string(),
        // paymentType: yup.string(),
        // collectedAmount: yup.string(),
        // paymentReference: yup.string().required(),
        // internalNote: yup.string(),
        // companyGst: yup.string(),
        // companyName: yup.string(),
        // companyAdd: yup.string(),
        // bookedBy: yup.object(),
        // // bookerName: yup.string()
    })

    const idProofOptions = [
        { value: "passport", label: "Passport" },
        { value: "aadharCard", label: "Aadhaar Card" },
        { value: "panCard", label: "Pan Card" },
        { value: "drivingLicense", label: "Driving License" },
        { value: "others", label: "Others" },
    ]

    const {
        control,
        handleSubmit,
        watch,
        reset,
        formState: { errors }
    } = useForm({
        defaultValues,
        resolver: yupResolver(QuickBookingSchema)
    })



    // const pstatus = watch("paymentStatus")
    const cType = watch("collectionType")
    const ptype = watch("paymentType")
    const pref = watch("paymentReference")
    const inote = watch("internalNote")
    // const cname = watch("companyName")
    // const cadd = watch("companyAdd")
    const booker = watch("boookedBy")
    const newBooker = watch("bookerName")

    const [roomRates, setRoomRates] = useState([])
    console.log('roomRates', roomRates);
    const getRoomRates = async (ind, outd) => {
        try {
            let inDate = moment(ind).format('L')
            let outDate = moment(outd).format('L')
            const bookingsBody = {
                LoginID,
                Token,
                Seckey: "abc",
                CheckInDate: inDate,
                CheckOutDate: outDate
            }
            axios.post(`/getdata/bookingdata/roomavailability`, bookingsBody).then(response => {
                setRoomRates(response?.data[2])
            })
        } catch (error) {
            console.log('error', error)
        }
    }

    const [selRoomRates, setSelRoomRates] = useState([])
    const getSelRoom_RoomRates = () => {
        let rid = quickBookingStore?.roomData?.roomID
        let newArr = roomRates.filter(j => j.ROOMID === rid)
        setSelRoomRates(newArr)
    }

    const isCallingRef = useRef(false);

    const getNewRoomRate = async () => {
        // API doo baar call hone se rokne ke liye
        if (isCallingRef.current) return;

        isCallingRef.current = true;

        try {
            let obj = {
                // fromDate: moment(quickBookingStore?.checkInDate).format('MM-DD-YYYY'),
                // fromDate:moment(new Date(quickBookingStore?.checkInDate)).format('MM-DD-YYYY'),
                fromDate: moment(String(quickBookingStore?.checkInDate)).format('MM-DD-YYYY'),
                toDate: outDate !== '' ? moment(outDate).format('MM-DD-YYYY') : moment(new Date(quickBookingStore?.checkInDate).fp_incr(1)).format('MM-DD-YYYY'),
                roomID: roomDetails?.roomID
            }
            console.log("objonly", String(quickBookingStore?.checkInDate));
            // const res = await axios.post(`/booking/GetRoomRate`, obj, {
            const res = await axios.post(`/bookingv2/getroomrate`, obj, {
                headers: {
                    LoginID,
                    Token
                }
            })
            let result = res?.data?.daily
            // let result = res?.data[0]
            console.log('new rate result after', result);
            let arr = result.map(r => {
                return { value: r.ratePlanID, label: r.ratePlanID, ...r }
            })
            console.log('new rate result', arr);

            setNewRatePlans(arr)
            setSelNewRate(arr)
            setMealId(arr?.mealID)
            // setActualRate(arr?.ROOMRATE)
            //    setDateRate(res?.data[1])
            setActualRate(arr?.roomRate)
            setDateRate(res?.data.daily)
        } catch (error) {
            console.log('new rate error', error)
        }
    }

    const handleHouseKeepingStatus = async () => {
        try {
            let obj = {
                LoginID,
                Token,
                Seckey: 'abc',
                Event: "selectone",
                FloorID: roomData?.floorID
            }
            const res = await axios.post(`/housekeeping`, obj)
            console.log("HOusekeeping Response===>", res)
            setHstatus(res?.data[0])
            // if (res?.data[0]?.ClosedDueToMaintenance === 'Yes' || res?.data[0]?.RoomStatus === "Occupied") {
            //     setIsAvail(false)
            // } else {
            //     setIsAvail(true)
            // }
        } catch (error) {
            console.log('houseKeepingError', error)
        }
    }

    const [countryList, setCountryList] = useState([]);
    const [countryId, setCountryId] = useState("");
    const [stateList, setStateList] = useState([]);
    const [stateId, setStateId] = useState("");
    const [districtId, setDistrictId] = useState("");
    const [cityId, setCityId] = useState("");
    const [cityList, setCityList] = useState([]);

    const countryOptions =
        countryList?.length && countryList[0]?.countryName
            ? countryList?.map(function (country) {
                return { value: country.countryID, label: country.countryName };
            })
            : [{ value: "reload", label: "Error loading, click to reload again" }];

    const countryDetailsList = async () => {
        try {
            const countryListBody = {
                LoginID,
                Token,
                Seckey: "abc",
                Event: "select",
            };
            const res = await axios.post(
                `/getdata/regiondata/countrydetails`,
                countryListBody
            );
            setCountryList(res?.data[0]);
        } catch (error) {
            console.log("Country List Error", error.message);
        }
    };

    const stateOptions =
        stateList?.length && stateList[0]?.stateName
            ? stateList?.map(function (state) {
                return { value: state.stateID, label: state.stateName };
            })
            : [{ value: "reload", label: "Error loading, click to reload again" }];

    const handleCountryDetailsList = (value) => {
        if (value === "reload") {
            countryDetailsList();
            return;
        }
        setCountryId(value);
    };

    useEffect(() => {
        countryDetailsList();
    }, []);


    const stateDetailsList = (value) => {
        try {
            const stateDetailsBody = {
                LoginID,
                Token,
                Seckey: "abc",
                CountryID: value,
                Event: "select",
            };
            axios
                .post(`/getdata/regiondata/statedetails`, stateDetailsBody)
                .then((stateDropDownResponse) => {
                    setStateList(stateDropDownResponse?.data[0]);
                });
        } catch (error) {
            console.log("State Details Error", error.message);
        }
    };

    const handleStateDetailsList = (value) => {
        if (value === "reload") {
            stateDetailsList();
            return;
        }
        setStateId(value);
    };

    const cityDetailsList = (value) => {
        try {
            const cityListBody = {
                LoginID,
                Token,
                Seckey: "abc",
                DistrictID: value,
                StateID: value,
                Event: "select",
            };
            axios
                .post(`/getdata/regiondata/citydetails`, cityListBody)
                .then((cityDropDownResponse) => {
                    setCityList(cityDropDownResponse?.data[0]);
                });
        } catch (error) {
            console.log("City Details Error", error.message);
        }
    };
    const cityOptions =
        cityList?.length && cityList[0]?.cityName
            ? cityList?.map(function (city) {
                return { value: city.cityID, label: city.cityName };
            })
            : [{ value: "reload", label: "Error loading, click to reload again" }];

    const handleCityDetailsList = (value) => {
        if (value === "reload") {
            cityDetailsList();
            return;
        }
        setCityId(value);
    };
    //Initial function calls
    useEffect(() => {
        setShowErrors(false);
        reset();
        getRoomRates(quickBookingStore?.checkInDate, quickBookingStore.checkInDate.fp_incr(1))
        setInDate(quickBookingStore?.checkInDate);
        setOutDate(new Date(quickBookingStore?.checkInDate).fp_incr(1))
        setRoomDetails(quickBookingStore?.roomData)
        mealsDetail();
        setDiscount(0);
        setAmount(quickBookingStore.total);
        setPayFull("Yes")
        // setBookingSourceId("");
        setSelGuestDetail("")
        handleSourceType('reload')
        handlePaymentType('reload')
        userDetailsData()
    }, [open])

    useEffect(() => {
        handleHouseKeepingStatus()
    }, [roomData])

    useEffect(() => {
        getSelRoom_RoomRates()
    }, [roomRates])

    useEffect(() => {
        getRoomData()
        getNewRoomRate()
    }, [roomDetails, outDate])

    useEffect(() => {
        handlePaymentMode('reload')
    }, [ptype])

    useEffect(() => {
        store.dispatch(setPrice({ cost, gst, total, discount }))
    }, [total])

    //if both indate and outdate is set get selected Room details from the api.
    useEffect(() => {
        // setLoader(true)
        const diffTime = Math.abs(outDate - inDate);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        setDuration(diffDays);
        setCurrentValue(Number(diffDays))
        store.dispatch(setCheckInDate(inDate))
        store.dispatch(setCheckOutDate(outDate))
        getRoomData()
        getRoomRates(inDate, outDate)
    }, [inDate, outDate])

    useEffect(() => {
        updateRoom()
    }, [selectedRoom, actualRate])

    useEffect(() => {
        const bookingSourceOptions = bookingSourceDropDown?.length > 0 && bookingSourceDropDown[0].bookingSource ? bookingSourceDropDown?.map(function (book) {
            return { value: book.bookingSourceID, label: book.bookingSource }
        }) : [{ value: 'reload', label: 'Error loading, click to reload again' }];
        setBookingSourceOptions(bookingSourceOptions)
    }, [bookingSourceDropDown])

    // useEffect(() => {
    //     const guestDetailOptions = guestDetailDropDown?.length > 0 && guestDetailDropDown[0].GuestName ? guestDetailDropDown?.map(function (guest) {
    //         return { value: guest?.GuestID, label: `${guest.GuestName} : ${guest.GuestEmail} : ${guest.GuestMobileNumber}` }
    //     }) : [{ value: 'reload', label: 'Error loading, click to reload again' }];
    //     setGuestDetailOptions(guestDetailOptions)
    // }, [guestDetailDropDown])

    useEffect(() => {
        const sourceTypes = sourceType?.map(function (sourceType) {
            return { value: sourceType?.sourceTypeID, label: sourceType?.sourceType }
        })
        setSourceTypes(sourceTypes)
    }, [sourceType])

    useEffect(() => {
        const PaymentTypeDropDown = paymentTypeDropDown?.slice(1, paymentTypeDropDown.length)
        const paymentTypeOptions = PaymentTypeDropDown?.length > 0 && PaymentTypeDropDown[0].paymentType ? PaymentTypeDropDown?.map(function (payment) {
            return { value: payment?.paymentTypeID, label: payment?.paymentType }
        }) : [{ value: 'reload', label: 'Error loading, click to reload again' }]
        setPaymentTypeOptions(paymentTypeOptions);
    }, [paymentTypeDropDown])

    // useEffect(() => {
    //     setOutDate(new Date(inDate).fp_incr(1))
    // }, [inDate])

    // useEffect(() => {
    //     setOutDate(quickBookingStore.checkOutDate)
    // }, [inDate])

    //fetch selectedRoom data.
    const getRoomData = async () => {
        try {
            const bookingsBody = {
                LoginID: LoginID,
                Token: Token,
                Seckey: "abc",
                // CheckInDate: moment(inDate).format(),
                CheckInDate: inDate,
                // CheckOutDate: moment(outDate).format()
                CheckOutDate: outDate
            }
            await axios.post(`/getdata/bookingdata/roomavailability`, bookingsBody).then(response => {
                console.log('room availability response', response);
                store.dispatch(setRoomsAvailViewStore(response?.data[0]))
                setRoomData(response?.data[0])
                let result = response?.data[1]
                console.log('result response', response);

                let rates = result?.map(function (meals) {
                    return { value: meals.planRate, label: `${meals.ratePlanID} - ${meals.mealType}`, ...meals }
                })
                let finalRates = rates.filter(r => r.status === "Active")
                setRatePlans(finalRates)
            })

        } catch (error) {
            console.log("Bookings Error :", error)
        }
    }


    // console.log('inDate', moment(quickBookingStore?.checkInDate).format('D-M-Y'), moment(new Date(quickBookingStore?.checkInDate)).format('d-m-y'));
    // let newInDate = moment(quickBookingStore?.checkInDate).format('D-M-Y');
    // console.log('newInDate', newInDate);
    const checkAvailibilty = async (date, inDate) => {
        console.log('responseData.RoomsAvailable', date !== '' && date !== 'Invalid Date');
        if (date !== '' && date !== 'Invalid Date') {
            const res = await axios.post('/booking/CheckRoomAvailabilityDetailsByBookingChart', {}, {
                headers: {
                    LoginID,
                    Token,
                    SecKey: '123'
                },
                params: {
                    FloorID: roomData?.floorID,
                    RoomNum: roomDetails?.roomNo,
                    FromDate: moment(inDate).format('MM-DD-YYYY'),
                    ToDate: date !== '' ? moment(date).format('MM-DD-YYYY') : moment(new Date(quickBookingStore?.checkInDate).fp_incr(1)).format('MM-DD-YYYY'),
                    FloorNumber: roomDetails?.FloorNo
                }
            })
                .then(response => {
                    const responseData = response.data[0][0]
                    console.log('responseData.RoomsAvailable', responseData.roomsAvailable);
                    if (responseData.roomsAvailable === 0) {
                        toast.error('Room is not available for this date', { position: "top-center" })
                        handleOpen()
                    }
                }).catch(function (error) {
                    console.log("User Login Error=====", error?.response?.data?.Message)
                    // toast.error(error?.response?.data?.Message)
                })
            console.log('responseData.RoomsAvailable');
        }
    }

    const handleRemoveDiscount = () => {
        setTotal(cost + gst)
        setDiscount(0)
        setDisabled(false)
        setDiscountAmount(0)
    }
    //selected room data function.
    const no_of_person_options = (value) => {
        let arr = []
        for (let i = 0; i <= value; i++) {
            arr.push({ value: i, label: `${i}` })
        }
        return arr
    }

    const setRoomData = (rooms) => {
        console.log("SetRoomDate====>", rooms)
        let roomID = quickBookingStore?.roomData.roomID;
        // let roomID = "RDT004"
        console.warn("roomIDDetails", roomID)
        let room = rooms?.find(room => room.roomID == roomID);
        console.warn("roomIDDetails222", room)

        console.warn("roomDetails.RoomID", roomDetails)
        var roomObj = {};
        if (room) {
            const gstAmount = room.roomRate * room.igsT_P / 100
            roomObj = {
                roomID: room.roomID,
                roomCat: room.roomDisplayName,
                adultsAllowed: room.adultMax,
                infantAllowed: room.infantMax,
                childrenAllowed: room.childMax,
                // price: room.RoomRate,
                price: actualRate,
                gst: gstAmount,
                gst_percentage: room.igsT_P,
                adult_occ: room.adultBase,
                child_occ: 0,
                infant_occ: 0,
                selected_meal: '',
                selected_meal_price: 0,
                extra_adult_price: 0,
                per_extra_adult_price: room.extraAdultPrice,
                extra_child_price: 0,
                per_extra_child_price: room.extraChildPrice,
                adultBase: room.adultBase,
                childBase: room.childBase,
                total_price: room.roomRate
            }
            setAdult(1);
            setChildren(0);
        }
        setSelectedRoom(roomObj)

    }

    const updateRoom = () => {
        // const total = selectedRoom.price + selectedRoom.extra_adult_price + selectedRoom.extra_child_price + selectedRoom.selected_meal_price;
        const total = actualRate + selectedRoom.extra_adult_price + selectedRoom.extra_child_price
        const diffTime = Math.abs(outDate - inDate);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        selectedRoom.total_price = total
        const totalOneDayCost = total
        const totalCost = totalOneDayCost * diffDays
        const totalGst = totalOneDayCost * Number(selectedRoom.gst_percentage) / 100
        // const totalGst = Number(selectedRoom.gst)        
        const totalAmount = totalCost + totalGst
        setCost(totalCost)
        setNetCost(totalCost)
        setGst(totalGst)
        if (hasGst) {
            setTotal(totalAmount)
            setAmount(totalAmount)
        } else {
            setTotal(totalCost)
            setAmount(totalCost)
        }
        // setTotal(totalAmount)
        // setAmount(totalAmount)

        if (discountAmount > 0) {
            if (discountType === 'flat') {
                const disAmount = Number(discount)
                const netAmount = totalCost - disAmount
                const newGst = netAmount * (selectedRoom.gst_percentage / 100)
                setNetCost(netAmount)
                if (hasGst) {
                    setGst(newGst)
                    setTotal(netAmount + newGst)
                    setAmount(netAmount + newGst)
                    store.dispatch(setPrice({ cost: netAmount, gst: newGst, total: netAmount + newGst, discount: disAmount }))
                } else {
                    setGst(0)
                    setTotal(netAmount)
                    setAmount(netAmount)
                    store.dispatch(setPrice({ cost: netAmount, gst: 0, total: netAmount, discount: disAmount }))
                }
                setDiscountAmount(disAmount)
                // store.dispatch(setPrice({ cost: netAmount, gst: newGst, total: netAmount + newGst, discount: disAmount }))
            } else if (discountType === 'percentage') {
                const dicAmount = (totalCost * (Number(discount) / 100))
                setDiscountAmount(dicAmount)
                const netAmount = totalCost - dicAmount
                const newGst = netAmount * (selectedRoom.gst_percentage / 100)
                setNetCost(netAmount)
                if (hasGst) {
                    setGst(newGst)
                    setTotal(netAmount + newGst)
                    setAmount(netAmount + newGst)
                    store.dispatch(setPrice({ cost: netAmount, gst: newGst, total: netAmount + newGst, discount: dicAmount }))
                } else {
                    setGst(0)
                    setTotal(netAmount)
                    setAmount(netAmount)
                    store.dispatch(setPrice({ cost: netAmount, gst: 0, total: netAmount, discount: dicAmount }))
                }
                // store.dispatch(setPrice({ cost: netAmount, gst: newGst, total: netAmount + newGst, discount: dicAmount }))
            }
        } else {
            store.dispatch(setPrice({ cost: totalCost, gst: totalGst, total: totalAmount, discount: 0 }))
        }
    }


    const handleDiscount = () => {
        if (discountType === 'flat') {
            const disAmount = Number(discount)
            const netAmount = cost - disAmount;
            const total = netAmount + gst;
            setTotal(total)
            setDisabled(true)
            setDiscountAmount(disAmount)
            store.dispatch(setPrice({ cost, gst, total, disAmount }))
        } else if (discountType === 'percentage') {
            const disAmount = (cost * (Number(discount) / 100))
            const total = (cost - disAmount) + gst
            setDiscountAmount(disAmount)
            setTotal(total)
            setDisabled(true)
            store.dispatch(setPrice({ cost, gst, total, disAmount }))
        } else {
            toast.error('Select Discount Type first')
        }
    }

    const handleGetPrice = (price) => {
        setUpdPrice(price)
    }

    const guestDetail = async () => {
        try {
            const guestDetailBody = { LoginID: LoginID, Token: Token, Seckey: "abc", SearchPhrase: null, Event: "select" }
            const guestResponse = await axios.post(`/getdata/bookingdata/guestdetails`, guestDetailBody)

            store.dispatch(setGuestDetailDropdownStore(guestResponse?.data[0]))
        } catch (error) {
            console.log("Guest Detail Error", error.message)
        }
    }

    const handleHasGST = e => {
        if (e.target.checked) {
            setHasGst(true)
        } else {
            setHasGst(false)
        }
    }

    const handleGuestOptions = async () => {
        try {
            const guestDetailBody = { LoginID, Token, Seckey: "abc", SearchPhrase: null, Event: "select" }
            const res = await axios.post(`/getdata/bookingdata/guestdetails`, guestDetailBody)

            let result = res?.data[0]
            let arr = result.map(r => {
                return { value: r?.guestID, label: `${r.guestName} : ${r.guestEmail} : ${r.guestMobileNumber}`, ...r }
            })
            setGuestOptions(arr)
        } catch (error) {
            console.log('guesterror', error)
        }
    }

    // const mealsDetails = async () => {
    //     try {
    //         // const mealsBody = { LoginID: LoginID, Token: Token, Seckey: "abc", Event: "select" }
    //         const response = await axios.post(`/getdata/mealdetails`, mealsBody)
    //         setMealsList(response?.data[0]);
    //         const mealsOptions = response?.data[0]?.map(function (meals) {
    //             return { value: meals.MealID, label: meals.MealDisplayName }
    //         })
    //         setMealsOptions(mealsOptions)
    //         setSelectedMealId(mealsOptions[0].value)
    //         console.log("MEALS", response?.data[0])
    //     } catch (error) {
    //         console.log("Meals Error", error.message)
    //     }
    // }
    const mealsDetail = async () => {
        try {
            const obj = {
                LoginID,
                Token,
                Seckey: "abc",
                Event: "RatePlan",
                Status: "Active",
                RoomID: quickBookingStore?.roomData.roomID
            }
            let res = await axios.post('/getdata/bookingdata/roomdetails', obj)

            if (res.data[0].length > 0) {
                const mealsOptions = res?.data[0]?.map(function (meals) {
                    return { value: meals.planRate, label: `${meals.ratePlanID} - ${meals.mealType}`, ...meals }
                })
                setMealsOptions(mealsOptions)
                setSelectedMealId(mealsOptions[0].mealID)
            }
        } catch (error) {
            console.log('error', error)
        }
        // try {
        //     const mealsBody = { LoginID: LoginID, Token: Token, Seckey: "abc", Event: "select" }
        //     const response = await axios.post(`/getdata/mealdetails`, mealsBody)
        //     setMealsList(response?.data[0]);
        //     const mealsOptions = response?.data[0]?.map(function (meals) {
        //         return { value: meals.MealID, label: meals.MealDisplayName }
        //     })
        //     setMealsOptions(mealsOptions)
        //     setSelectedMealId(mealsOptions[0].value)
        //     console.log("MEALS", response?.data[0])
        // } catch (error) {
        //     console.log("Meals Error", error.message)
        // }
    }

    const handleGuestDetail = async (value) => {
        if (value === 'reload') {
            setDropdownLoader(true)
            try {
                const guestDetailBody = { LoginID: LoginID, Token: Token, Seckey: "abc", SearchPhrase: "abc", Event: "select" }
                const guestResponse = await axios.post(`/getdata/bookingdata/guestdetails`, guestDetailBody)


                store.dispatch(setGuestDetailDropdownStore(guestResponse?.data[0]))

                setDropdownLoader(false)
                store.dispatch(setLoaderStore(dropdownLoader))
            } catch (error) {
                setDropdownLoader(false)
                store.dispatch(setLoaderStore(dropdownLoader))
                console.log("Guest Detail Error", error.message)
            }
            return
        }
        setSelGuestDetail(value)
        store.dispatch(setCustomerIdStore(value))
    }


    // const bookingSource = async () => {
    //     try {
    //         console.log("booking source")
    //         const bookinSourceBody = { LoginID: LoginID , Token: Token, Seckey: "abc", Event: "select" }
    //         await axios.post(`/getdata/bookingdata/bookingsource`, bookinSourceBody).then(response => {
    //             console.log("response?.data[0]",response)
    //             store.dispatch(setBookingSourceDropdownStore(response?.data[0]))
    //             setDropdownLoader(false)
    //             store.dispatch(setLoaderStore(dropdownLoader))
    //         })

    //     } catch (error) {
    //         setDropdownLoader(false)
    //         store.dispatch(setLoaderStore(dropdownLoader))
    //         console.log("Booking Source", error.message)
    //     }
    // }
    const handleSourceType = async (value) => {
        if (value === 'reload') {
            setDropdownLoader(true)
            try {
                const bookinSourceBody = { LoginID, Token, Seckey: "abc", Event: "select" }
                const response = await axios.post(`/getdata/bookingdata/bookingsource`, bookinSourceBody)
                if (response?.data[0]) {
                    store.dispatch(setBookingSourceDropdownStore(response?.data[0]))
                    setDropdownLoader(false)
                    store.dispatch(setLoaderStore(dropdownLoader))
                }
            } catch (error) {
                setDropdownLoader(false)
                store.dispatch(setLoaderStore(dropdownLoader))
                console.log("Booking Source", error.message)
            }
            return
        }

        setBookingSourceId(value);

    }
    const getSourceType = async () => {
        try {
            const sourceTypeBody = {
                LoginID,
                Token,
                Seckey: "abc",
                BookingSourceID: bookingSourceId,
                Event: "select"
            }
            const response = await axios.post('/getdata/bookingdata/sourcetype', sourceTypeBody)

            if (response?.data[0]) {
                let data = response?.data[0]
                const opt = data.map(t => {
                    return { value: t.sourceTypeID, label: t.sourceType }
                })
                setSourceType(opt)
            } else {
                setSourceType([{ value: 'reload', label: 'Please reload' }])
            }

        } catch (error) {
            console.log("State Error", error.message)
        }
        store.dispatch(setBookingSourceStore(bookingSourceId))
    }

    const handlePaymentType = async (value) => {
        if (value === 'reload') {
            setDropdownLoader(true)
            try {
                const paymentTypeBody = { LoginID: LoginID, Token: Token, Seckey: "abc", Event: "select" }
                axios.post(`/getdata/bookingdata/paymenttype`, paymentTypeBody)
                    .then(response => {
                        setDropdownLoader(false)
                        store.dispatch(setPaymentTypeDropdownStore(response?.data[0]))
                        store.dispatch(setLoaderStore(dropdownLoader))
                    })
            } catch (error) {
                setDropdownLoader(false)
                store.dispatch(setLoaderStore(dropdownLoader))
                console.log("Payment Type Error", error.message)
            }
            return
        }
    }

    const handlePaymentMode = async (value) => {
        if (value === 'reload') {
            setDropdownLoader(true)
            try {
                const paymentModeBody = { LoginID: LoginID, Token: Token, Seckey: "abc", PaymentTypeID: ptype, Event: "select" }
                axios.post(`/getdata/bookingdata/paymentmode`, paymentModeBody)
                    .then(paymentModeResponse => {
                        setDropdownLoader(false)
                        store.dispatch(setPaymentModeDropdownStore(paymentModeResponse?.data[0]))
                        store.dispatch(setLoaderStore(dropdownLoader))
                        console.warn("paymentModeResponse?.data[0]", paymentModeResponse?.data[0])
                        const paymentModeOptions = paymentModeResponse ? paymentModeResponse?.data[0]?.map(function (paymentMode) {
                            return { value: paymentMode?.paymentModeID, label: paymentMode?.paymentMode }
                        }) : [{ value: 'reload', label: 'Error loading, click to reload again' }]

                        setPaymentModeOptions(paymentModeOptions)
                    })
            } catch (error) {
                setDropdownLoader(false)
                store.dispatch(setLoaderStore(dropdownLoader))
                console.log("Payment Mode Error", error.message)
            }
        }
        store.dispatch(setPaymentModeStore(value))
    }

    const userDetailObject = [
        {
            UserID: "0",
            FirstName: "Others",
            Email: ""
        }
    ]

    const userDetailsData = async () => {
        try {
            const userDetailsBody = { LoginID, Token, Seckey: "abc", Event: "select" }
            const response = await axios.post(`/getdata/userdata/userdetails`, userDetailsBody)
            const userDetailResponse = response.data[0]?.concat(userDetailObject)
            const userDetailsOption = userDetailResponse?.map(function (userDetail) {
                return { value: userDetail.userID, label: `${userDetail.firstName} : ${userDetail.email}` }
            })
            setUserDetails(userDetailsOption)
            // if (userDetails !== []) { setUserDetailsStatus(true) }
        } catch (error) {
            console.log("UserDetails Error", error.message)
        }
    }

    const onSubmit = () => {
        setShowErrors(true);
        // store.dispatch(setBookingDetailStore(bookingData))
        store.dispatch(setPrice({ cost, gst, total, discount }))
        handleBooking();

    }
    useEffect(() => {
        console.log('outdatedgsgdg', inDate, outDate);
        checkAvailibilty(outDate, inDate)
        // return () => {
        //     console.log('outdatedgsgdg', inDate, outDate);
        // }
    }, [outDate])

    let newRateData = dateRate?.length > 0 && dateRate.filter(r => r.roomID === selectedRoom.roomID && r.mealID === mealId).map((r) => {
        let newObj = {
            BookingDate: r.date,
            RoomID: r.roomid,
            RoomRate: r.roomrate,
            ExtraAdultRate: r.extraadultrate,
            ExtraChildRate: r.extrachildrate,
            RatePlanId: r.ratePlanID
        }
        return newObj
    })
    // const handleBooking = async () => {
    //     try {
    //         setLoader(true)
    //         let bookingDetail = [{
    //             "RoomID": selectedRoom.roomID,
    //             "Adult": adult,
    //             "Children": children,
    //             "Infant": infant,
    //             "MealID": selectedMealId
    //         }];
    //         const bookingBody = {
    //             LoginID: LoginID,
    //             Token: Token,
    //             Seckey: "abc",
    //             // bookingDetails: quickBookingStore.bookingDetail_store,
    //             bookingDetails: bookingDetail,
    //             transactionDetails: [
    //                 {
    //                     CheckInDate: moment(quickBookingStore.checkInDate).format('YYYY-MM-DDThh:mm:ss'),
    //                     CheckOutDate: moment(quickBookingStore.checkOutDate).format('YYYY-MM-DDThh:mm:ss'),
    //                     BookingSourceID: quickBookingStore.bookingSource_store,
    //                     SourceTypeID: quickBookingStore.sourceType_store,
    //                     isCompany: pstatus === 'Bill to Company' ? 1 : 0,
    //                     CompanyGST: cgst,
    //                     CompanyName: cname,
    //                     CompanyAddress: cadd,
    //                     PaymentTypeID: quickBookingStore.paymentType_store,
    //                     PaymentModeID: quickBookingStore.paymentMode_store,
    //                     BookingCreatedBy_UserID: quickBookingStore.bookingCreatedBy_store,
    //                     isFullPaid: payFull === 'Yes' ? 1 : 0,
    //                     InternalNote: inote === undefined ? '' : inote,
    //                     SpecialNote: note
    //                 }
    //             ],
    //             paymentDetails: [
    //                 {
    //                     PaymentTypeID: quickBookingStore.paymentType_store,
    //                     PaymentModeID: quickBookingStore.paymentMode_store,
    //                     isFullPaid: payFull === "Yes",
    //                     RoomAmount: cost,
    //                     Discount: discount,
    //                     CGST: 0,
    //                     SGST: 0,
    //                     IGST: 0,
    //                     TotalTax: hasGst === 'true' ? gst : 0,
    //                     TotalAmount: total,
    //                     PendingAmount: total - +amount,
    //                     RecievedAmount: amount,
    //                     CustID: quickBookingStore.customerId_store
    //                 }
    //             ],
    //             bookingRateDetails: newRateData
    //         }
    //         // setBookingError('')
    //         console.log('bookingBody', bookingBody)
    //         console.log('bookingBody json', JSON.stringify(bookingBody))
    //         // if (pstatus && cType && booker && booker !== '0') {
    //         //     const res = await axios.post(`/setdata/bookingdetails`, bookingBody)
    //         //     const responseData = res.data[0]
    //         //     console.log("Booking Response", responseData)
    //         //     if (responseData[0]?.BookingMapID) {
    //         //         toast.success("Booked!!!", { position: 'top-center' })
    //         //         store.dispatch(setBookingID(responseData.BookingMapID));
    //         //         store.dispatch(setBookingResponse(responseData))
    //         //         setNewBID(responseData.BookingMapID)
    //         //         handleBookModal()
    //         //         // handleOpen();                
    //         //     } else {
    //         //         toast.error("Error while booking!!!", { position: 'top-center' })
    //         //         // TODO - Error Booking
    //         //         // setBookingError(responseData[0]?.Result ?? "Error while booking !!!")
    //         //     }
    //         // } else if (pstatus && cType && booker === '0' && newBooker !== '') {
    //         //     const res = await axios.post(`/setdata/bookingdetails`, bookingBody)
    //         //     const responseData = res.data[0]
    //         //     console.log("Booking Response", responseData)
    //         //     if (responseData[0]?.BookingMapID) {
    //         //         toast.success("Booked!!!", { position: 'top-center' })
    //         //         store.dispatch(setBookingID(responseData.BookingMapID));
    //         //         store.dispatch(setBookingResponse(responseData))
    //         //         setNewBID(responseData.BookingMapID)
    //         //         handleBookModal()
    //         //         // handleOpen();                
    //         //     } else {
    //         //         toast.error("Error while booking!!!", { position: 'top-center' })
    //         //         // TODO - Error Booking
    //         //         // setBookingError(responseData[0]?.Result ?? "Error while booking !!!")
    //         //     }
    //         // } else if (pstatus === "Bill to Company" && (cname && cgst && cadd !== '') && booker && booker !== '0') {
    //         //     const res = await axios.post(`/setdata/bookingdetails`, bookingBody)
    //         //     const responseData = res.data[0]
    //         //     console.log("Booking Response", responseData)
    //         //     if (responseData[0]?.BookingMapID) {
    //         //         toast.success("Booked!!!", { position: 'top-center' })
    //         //         store.dispatch(setBookingID(responseData.BookingMapID));
    //         //         store.dispatch(setBookingResponse(responseData))
    //         //         setNewBID(responseData.BookingMapID)
    //         //         handleBookModal()
    //         //         // handleOpen();                
    //         //     } else {
    //         //         toast.error("Error while booking!!!", { position: 'top-center' })
    //         //         // TODO - Error Booking
    //         //         // setBookingError(responseData[0]?.Result ?? "Error while booking !!!")
    //         //     }
    //         // } else if (pstatus === "Bill to Company" && (cname && cgst && cadd !== '') && booker === '0' && newBooker !== '') {
    //         //     const res = await axios.post(`/setdata/bookingdetails`, bookingBody)
    //         //     const responseData = res.data[0]
    //         //     console.log("Booking Response", responseData)
    //         //     if (responseData[0]?.BookingMapID) {
    //         //         toast.success("Booked!!!", { position: 'top-center' })
    //         //         store.dispatch(setBookingID(responseData.BookingMapID));
    //         //         store.dispatch(setBookingResponse(responseData))
    //         //         setNewBID(responseData.BookingMapID)
    //         //         handleBookModal()
    //         //         // handleOpen();                
    //         //     } else {
    //         //         toast.error("Error while booking!!!", { position: 'top-center' })
    //         //         // TODO - Error Booking
    //         //         // setBookingError(responseData[0]?.Result ?? "Error while booking !!!")
    //         //     }
    //         // }

    //         setLoader(false)
    //     } catch (error) {
    //         console.log("Booking Error", error)
    //         toast.error("Something went WRONG!")
    //         // setBookingError(error.message)
    //         setLoader(false)
    //     }
    // }
    const handleUploadedImage = (e) => {
        setUploadedImg(e.target.files[0])
    }
    const handleBookerDetail = async (e) => {
        setShowErrors(true);
        let mainImage
        e.preventDefault()
        let imageformData = new FormData()
        imageformData.append('file', uploadedImg)
        if (uploadedImg !== '') {
            try {
                const res = await axios({
                    method: "post",
                    baseURL: `${Image_base_uri}`,
                    url: "/api/booking/UploadImage",
                    data: imageformData,
                    headers: { "Content-Type": "multipart/form-data" },
                })
                if (res?.status === 200) {
                    // setIdProofImg(res?.data?.imageName)
                    // setUploadImgStatus(true)
                    mainImage = res?.data?.imageName
                }
            } catch (error) {
                console.log('error', error)
                // setUploadImgStatus(false)
                return 0
            }
        }
        try {
            setLoader(true)
            let bookingDetail = [{
                "RoomID": selectedRoom.roomID,
                "Adult": adult,
                "Children": children,
                "Infant": infant,
                "MealID": selectedMealId,
                "FloorID": roomData?.floorID
            }];

            if (guestName && guestLastName && prefix && guestMobileNumber !== '') {

                const bookingBody = {
                    LoginID: LoginID,
                    Token: Token,
                    Seckey: "abc",
                    // bookingDetails: quickBookingStore.bookingDetail_store,
                    bookingDetails: bookingDetail,
                    guestDetails: [
                        {
                            Name: guestName,
                            LastName: guestLastName,
                            Prefix: prefix,
                            Mobile: guestMobileNumber,
                            Email: guestEmailId,
                            IDProofType: idProofType,
                            NameAsPerIDProof: '',
                            IDProofNumber: idProofNumber,
                            IDProofScanCopyURL: mainImage,
                            "CountryId": countryId,
                            "StateId": stateId,
                            "CityId": cityId === '' ? null : cityId

                        }
                    ],
                    transactionDetails: [
                        {
                            CheckInDate: moment(quickBookingStore.checkInDate).format('YYYY-MM-DDThh:mm:ss'),
                            CheckOutDate: moment(quickBookingStore.checkOutDate).format('YYYY-MM-DDThh:mm:ss'),
                            BookingSourceID: quickBookingStore.bookingSource_store,
                            SourceTypeID: quickBookingStore.sourceType_store,
                            isCompany: pstatus === 'Bill to Company' ? 1 : 0,
                            CompanyGST: cgst,
                            CompanyName: cname,
                            CompanyAddress: cadd,
                            PaymentTypeID: quickBookingStore.paymentType_store,
                            PaymentModeID: quickBookingStore.paymentMode_store,
                            BookingCreatedBy_UserID: quickBookingStore.bookingCreatedBy_store,
                            isFullPaid: payFull === 'Yes' ? 1 : 0,
                            InternalNote: inote === undefined ? '' : inote,
                            SpecialNote: note
                        }
                    ],
                    paymentDetails: [
                        {
                            PaymentTypeID: quickBookingStore.paymentType_store,
                            PaymentModeID: quickBookingStore.paymentMode_store,
                            isFullPaid: payFull === "Yes",
                            RoomAmount: cost,
                            Discount: discountAmount,
                            CGST: gst / 2,
                            SGST: gst / 2,
                            IGST: gst,
                            TotalTax: hasGst === true ? gst : 0,
                            TotalAmount: total,
                            PendingAmount: total - +amount,
                            RecievedAmount: amount,
                            CustID: quickBookingStore.customerId_store
                        }
                    ],
                    checkInDetails: [
                        {
                            CheckInID: 'CHIN20230930AA00278',
                            ComingFrom: comingFrom,
                            GoingTo: goingTo,
                            VehicleNo: '123'
                        }
                    ],
                    bookingRateDetails: newRateData
                }
                console.log('bookingBody', bookingBody);
                // setBookingError('')
                if (pstatus && cType && booker && booker !== '0') {
                    const res = await axios.post(`/setdata/quickbookingdetails`, bookingBody)
                    const responseData = res.data[0]
                    // const checkInDetails = {
                    //     "LoginID": LoginID,
                    //     "Seckey": "123",
                    //     "Token": Token,
                    //     "ComingFrom": comingFrom,
                    //     "GoingTo": goingTo,
                    //     "BookingID": responseData[0]?.BookingMapID,
                    // }
                    // console.log('Booking Response', checkInDetails);
                    // const checkres = await axios.post(`/checkindetails`, checkInDetails)
                    // // if (checkres.data.length > 0) {
                    // console.log('Booking Response', checkres.data);
                    if (responseData[0]?.bookingMapID) {
                        toast.success("Booked!!!", { position: 'top-center' })
                        store.dispatch(setBookingID(responseData.bookingMapID));
                        store.dispatch(setBookingResponse(responseData))
                        setNewBID(responseData.bookingMapID)
                        handleBookModal()
                        // handleOpen();                
                    } else {
                        toast.error("Error while booking!!!", { position: 'top-center' })
                        // TODO - Error Booking
                        // setBookingError(responseData[0]?.Result ?? "Error while booking !!!")
                    }
                } else if (pstatus && cType && booker === '0' && newBooker !== '') {
                    const res = await axios.post(`/setdata/quickbookingdetails`, bookingBody)
                    const responseData = res.data[0]
                    if (responseData[0]?.BookingMapID) {
                        toast.success("Booked!!!", { position: 'top-center' })
                        store.dispatch(setBookingID(responseData.bookingMapID));
                        store.dispatch(setBookingResponse(responseData))
                        setNewBID(responseData.bookingMapID)
                        handleBookModal()
                        // handleOpen();                
                    } else {
                        toast.error("Error while booking!!!", { position: 'top-center' })
                        // TODO - Error Booking
                        // setBookingError(responseData[0]?.Result ?? "Error while booking !!!")
                    }
                } else if (pstatus === "Bill to Company" && (cname && cgst && cadd !== '') && booker && booker !== '0') {
                    const res = await axios.post(`/setdata/bookingdetails`, bookingBody)
                    const responseData = res.data[0]
                    if (responseData[0]?.bookingMapID) {
                        toast.success("Booked!!!", { position: 'top-center' })
                        store.dispatch(setBookingID(responseData.bookingMapID));
                        store.dispatch(setBookingResponse(responseData))
                        setNewBID(responseData.bookingMapID)
                        handleBookModal()
                        // handleOpen();                
                    } else {
                        toast.error("Error while booking!!!", { position: 'top-center' })
                        // TODO - Error Booking
                        // setBookingError(responseData[0]?.Result ?? "Error while booking !!!")
                    }
                } else if (pstatus === "Bill to Company" && (cname && cgst && cadd !== '') && booker === '0' && newBooker !== '') {
                    const res = await axios.post(`/setdata/bookingdetails`, bookingBody)
                    const responseData = res.data[0]
                    if (responseData[0]?.bookingMapID) {
                        toast.success("Booked!!!", { position: 'top-center' })
                        store.dispatch(setBookingID(responseData.bookingMapID));
                        store.dispatch(setBookingResponse(responseData))
                        setNewBID(responseData.bookingMapID)
                        handleBookModal()
                        // handleOpen();                
                    } else {
                        toast.error("Error while booking!!!", { position: 'top-center' })
                        // TODO - Error Booking
                        // setBookingError(responseData[0]?.Result ?? "Error while booking !!!")
                    }
                }
                // }
            } else {
                toast.error("Please fill all the fields", { position: 'top-center' })
            }

            setLoader(false)
        } catch (error) {
            console.log("Booking Error", error)
            toast.error("Something went WRONG!")
            // setBookingError(error.message)
            setLoader(false)
        }
    }



    useEffect(() => {
        handleGuestOptions()
    }, [openg, editGuest])

    useEffect(() => {
        getSourceType()
    }, [bookingSourceId])

    useEffect(() => {
        updateRoom()
    }, [discountAmount, hasGst])
    { bookingSourceId === 'BSID20230614AA00005' ? store.dispatch(setSourceTypeStore('TRAD20230614AA00004')) : '' }
    return (
        <>
            <Modal isOpen={open} toggle={handleOpen} className='modal-dialog-centered modal-xl' backdrop={false}>
                <ModalHeader toggle={handleOpen}>
                    Quick Booking Form
                    {
                        hStatus[0]?.closedDueToMaintenance === "Yes" ? (
                            <span className='text-danger'>(Closed Due to Maintenance)</span>
                        ) : null
                    }
                    {/* {
                        hStatus[0]?.RoomStatus === 'Occupied' ? (
                            <span className='text-danger'>(Already Occupied)</span>
                        ) : null
                    } */}
                </ModalHeader>
                <ModalBody>
                    <Form id="form" onSubmit={e => handleBookerDetail(e)}>
                        {/* <Row className='mb-2 flex-column-reverse flex-md-row row-no-gutters'> */}
                        <Row className='d-flex flex-lg-row flex-column'>
                            <Col className='m-1 d-flex flex-row justify-content-between align-items-center '>
                                <Col lg='5' md='5'>
                                    <Label className='form-label' for='checkIn_date'>
                                        Check-In Date:<span className='text-danger'>*</span>
                                    </Label>
                                    <Flatpickr
                                        id='checkIn_date'
                                        name='checkIn_date'
                                        placeholder='Select Check-In Date'
                                        options={{
                                            altInput: true,
                                            altFormat: 'd-m-y',
                                            dateFormat: 'd-m-y',
                                            minDate: moment(new Date()).subtract(1, 'days'),
                                            defaultDate: inDate
                                        }}
                                        disabled
                                        defaultValue={inDate}
                                        value={inDate}
                                    // onChange={date => {
                                    //     setInDate(date[0])
                                    //     setLoader(false);
                                    // }}
                                    />
                                    {showErrors && !inDate && <p className='text-danger'>Check-In Date is required</p>}
                                </Col>
                                <Col lg='5' md='5'>
                                    <Label className='form-label' for='checkOut_date'>
                                        Check-Out Date:<span className='text-danger'>*</span>
                                    </Label>
                                    <Flatpickr
                                        id='checkOut_date'
                                        name='checkOut_date'
                                        placeholder='Select Check-Out Date'
                                        options={{
                                            altInput: true,
                                            altFormat: 'd-m-y',
                                            dateFormat: 'd-m-y',
                                            minDate: new Date(inDate).fp_incr(1),
                                            defaultDate: outDate
                                        }}
                                        value={outDate}
                                        onChange={date => {
                                            // { console.log('inDateeee', newInDate, 'inDateeee', moment(quickBookingStore?.checkInDate).format('d-m-y')) }
                                            setOutDate(date[0])
                                            getNewRoomRate()
                                            // checkAvailibilty(date[0], inDate)
                                        }}
                                    />
                                    {showErrors && !outDate && <p className='text-danger'>Check-Out Date is required</p>}
                                </Col>
                            </Col>
                            <Col className='m-1'>
                                <Label className='form-label'>
                                    Number of Nights: {currentValue}
                                </Label>
                                <div className='py-1'>
                                    <ReactSlider
                                        className="customSlider"
                                        trackClassName="customSlider-track"
                                        thumbClassName="customSlider-thumb"
                                        marks={1}
                                        min={1}
                                        max={7}
                                        defaultValue={1}
                                        value={currentValue}
                                        onChange={(value) => {
                                            { console.log('object for dates', quickBookingStore?.checkInDate, value) }
                                            setOutDate(new Date(quickBookingStore?.checkInDate).fp_incr(value))
                                            getNewRoomRate()
                                            checkAvailibilty(new Date(quickBookingStore?.checkInDate).fp_incr(value), quickBookingStore?.checkInDate)
                                        }}
                                        renderMark={(props) => {
                                            if (props.key < currentValue) {
                                                props.className = "customSlider-mark customSlider-mark-before";
                                            } else if (props.key === currentValue) {
                                                props.className = "customSlider-mark customSlider-mark-active";
                                            }
                                            return <span {...props} />;
                                        }}
                                    />
                                </div>

                            </Col>

                        </Row>

                        <Col className='d-flex flex-row flex-wrap'>
                            <div className='pe-1 w-50'>
                                <Label>
                                    Booking Source<span className='text-danger'>*</span>
                                </Label>
                                <Select
                                    //id= 'bookingSource'
                                    placeholder=''
                                    menuPlacement='auto'
                                    aria-readonly
                                    theme={selectThemeColors}
                                    className='react-select'
                                    classNamePrefix='select'
                                    options={bookingSourceOptions}
                                    // value={bookingSourceOptions?.filter(c => bookingSourceId === '' ? c.value === bookingSourceId : c.label === "Direct")}
                                    value={bookingSourceOptions?.filter(c => c.value === bookingSourceId)}
                                    onChange={val => {
                                        handleSourceType(val.value)
                                    }}
                                    invalid={showErrors && bookingSourceId === ''}
                                />
                                {
                                    showErrors && bookingSourceId === '' ? <Label className='text-danger'>select Booking Source !</Label> : null
                                }
                            </div>
                            <div className='ps-1 w-50'>
                                <Label className='form-label' for='sourceType'>
                                    Source Type{sourceType.length > 0 && <span className='text-danger'>*</span>}
                                </Label>
                                <Controller
                                    defaultValue=''
                                    id='sourceType'
                                    name='sourceType'
                                    control={control}
                                    render={
                                        ({ field: { onChange, value, ref } }) => <CreatableSelect
                                            // isDisabled={sourceType.length === 0 && bookingSourceId !== "BSID20230220AA00001" && bookingSourceId !== "BSID20230220AA00002"}
                                            placeholder=''
                                            menuPlacement='auto'
                                            theme={selectThemeColors}
                                            className='react-select'
                                            classNamePrefix='select'
                                            options={sourceType}
                                            value={sourceType?.filter(c => value === '' ? c.label === "Walk-In" : value.includes(c.value))}
                                            inputRef={ref}
                                            onChange={val => {
                                                // console.log('setSourceTypeStore', val.value);
                                                onChange(val.value)
                                                store.dispatch(setSourceTypeStore(val.value))
                                            }}
                                            onCreateOption={handleOpenAgency}
                                            invalid={errors.sourceType}
                                        />


                                    }

                                />
                                {/* {
                                    sourceType.length < 0 ? <Label className='text-danger'>Select Source Type !</Label> : null
                                } */}
                            </div>
                        </Col>
                        <Row>
                            <Col>
                                <Table className='my-2' responsive>
                                    <thead>
                                        <tr className='text-center'>
                                            <th>Room Category</th>
                                            <th className='occupantsCol'>
                                                <div className='d-flex flex-column'>
                                                    <span>
                                                        Occupants
                                                    </span>
                                                    <span>
                                                        Children: 6yrs & above,
                                                    </span>
                                                    <span>
                                                        Infant: Upto 5yrs
                                                    </span>
                                                </div>
                                            </th>
                                            <th className='mealCol'>Rate Plan</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr className='QuickTable'>
                                            <td>
                                                <h5>{selectedRoom.roomCat} </h5>
                                                <h5>Room No: <span>{roomDetails.roomNo}</span> </h5>
                                                <div style={{ width: '25rem', margin: 'auto' }}>
                                                    {
                                                        dateRate?.length > 0 && (
                                                            dateRate.filter(r => r.roomID === selectedRoom.roomID && r.mealID === mealId).map((i, ridx) => {

                                                                return (
                                                                    <Badge className='me-1' key={ridx} color='light-secondary'>
                                                                        <Col>{moment(i.date).format('DD-MM')}</Col>
                                                                        <Col>₹ {i.roomRate}</Col>
                                                                    </Badge>
                                                                )
                                                            })
                                                        )
                                                    }
                                                    {/* {
                                                        selRoomRates.length > 0 && (
                                                            selRoomRates.map((i, ridx) => {
                                                                return (
                                                                    <Badge className='me-1' key={ridx} color='light-secondary'>
                                                                        <Col>{moment(i.ROOMDATE).format('DD-MM')}</Col>
                                                                        <Col>₹ {i.ROOMRATE}</Col>
                                                                    </Badge>
                                                                )
                                                            })
                                                        )
                                                    } */}
                                                </div>
                                                <div className='my-1'>Cost - {selectedRoom.total_price} </div>
                                            </td>
                                            <td className='d-flex flex-row flex-wrap justify-content-center align-items-center'>
                                                <div>
                                                    <Label>Adults</Label>
                                                    <Select
                                                        menuPortalTarget={document.body}
                                                        styles={{ menuPortal: base => ({ ...base, zIndex: 9999 }) }}
                                                        menuPlacement='auto'
                                                        theme={selectThemeColors}
                                                        className='react-select adultsDropdown'
                                                        classNamePrefix='select'
                                                        value={{ value: `${adult}`, label: `${adult}` }}
                                                        // options={peopleAllowedOptions.filter((o, index) => index <= (selectedRoom.adultsAllowed) && index > 0)}
                                                        options={no_of_person_options(selectedRoom.adultsAllowed)}
                                                        onChange={e => {
                                                            selectedRoom.adult_occ = e.value
                                                            let extra = 0
                                                            if (selectedRoom.adult_occ > selectedRoom.adultBase) {
                                                                // extra = (selectedRoom.adult_occ - selectedRoom.adultBase) * selectedRoom.per_extra_adult_price
                                                                extra = (selectedRoom.adult_occ - selectedRoom.adultBase) * selNewRate.extraAdultRate
                                                            }
                                                            selectedRoom.extra_adult_price = extra
                                                            setUpdated(!updated)
                                                            setAdult(selectedRoom.adult_occ)
                                                            updateRoom()
                                                        }}
                                                    />
                                                </div>
                                                <div className='m-1'>
                                                    <Label>Child</Label>
                                                    <Select
                                                        menuPortalTarget={document.body}
                                                        styles={{ menuPortal: base => ({ ...base, zIndex: 9999 }) }}
                                                        placeholder='No. of childrens'
                                                        menuPlacement='auto'
                                                        theme={selectThemeColors}
                                                        className='react-select adultsDropdown'
                                                        classNamePrefix='select'
                                                        value={{ value: `${children}`, label: `${children}` }}
                                                        // options={peopleAllowedOptions.filter((o, index) => index <= (selectedRoom.childrenAllowed))}
                                                        options={no_of_person_options(selectedRoom.childrenAllowed)}
                                                        onChange={e => {
                                                            selectedRoom.child_occ = e.value
                                                            let extra = 0
                                                            if (selectedRoom.child_occ > selectedRoom.childBase) {
                                                                // extra = (selectedRoom.child_occ - selectedRoom.childBase) * selectedRoom.per_extra_child_price
                                                                extra = (selectedRoom.child_occ - selectedRoom.childBase) * selNewRate.extraChildRate
                                                            }
                                                            selectedRoom.extra_child_price = extra
                                                            setUpdated(!updated)
                                                            setChildren(selectedRoom.child_occ)
                                                            updateRoom()
                                                        }}
                                                        isDisabled={selectedRoom.childrenAllowed === '0'}
                                                    />
                                                </div>
                                                <div className='m-1'>
                                                    <Label>Infant</Label>
                                                    <Select
                                                        menuPortalTarget={document.body}
                                                        styles={{ menuPortal: base => ({ ...base, zIndex: 9999 }) }}
                                                        placeholder='No. of Infants adultsDropdown'
                                                        menuPlacement='auto'
                                                        theme={selectThemeColors}
                                                        className='react-select'
                                                        classNamePrefix='select'
                                                        value={{ value: `${infant}`, label: `${infant}` }}
                                                        // options={peopleAllowedOptions.filter((o, index) => index <= (selectedRoom.infantAllowed))}
                                                        options={no_of_person_options(selectedRoom.infantAllowed)}
                                                        onChange={e => {
                                                            selectedRoom.infant_occ = e.value
                                                            setUpdated(!updated)
                                                            setInfant(selectedRoom.infant_occ)
                                                            updateRoom()
                                                        }}
                                                    />
                                                </div>
                                            </td>
                                            <td>
                                                <div className='m-1'>
                                                    <Select
                                                        menuPortalTarget={document.body}
                                                        styles={{ menuPortal: base => ({ ...base, zIndex: 9999 }) }}
                                                        menuPlacement='auto'
                                                        theme={selectThemeColors}
                                                        className='react-select mt-1 mealDropdown'
                                                        classNamePrefix='select'
                                                        // options={mealsOptions}
                                                        options={newRatePlans}
                                                        // value={mealsOptions?.filter(c => c.value == meal)}
                                                        value={newRatePlans?.filter(c => c.mealID === mealId)}
                                                        onChange={e => {
                                                            console.log('selected meal', e);
                                                            let room = selectedRoom;
                                                            room.selected_meal = e.value
                                                            // room.selected_meal_price = mealsList?.filter(c => c.MealID === e.value)[0].Price;
                                                            room.selected_meal_price = e.value;
                                                            setSelectedRoom(room);
                                                            setSelectedMealId(e.mealID)
                                                            setMeal(room.selected_meal)
                                                            // setMealPrice(mealsList?.filter(c => c.MealID === e.value))
                                                            setUpdated(!updated)
                                                            setMealId(e.mealID)
                                                            setSelNewRate(e)
                                                            setActualRate(e.roomRate)
                                                            // updateRoom()
                                                        }}
                                                    />
                                                    {
                                                        showErrors && !selectedMealId ? <Label className='text-danger'>Select Rate Plan !</Label> : null
                                                    }
                                                </div>
                                            </td>
                                        </tr>
                                    </tbody>
                                </Table>
                            </Col>
                        </Row>

                        <Row className='d-flex flex-lg-row flex-column'>
                            {/* <Col lg='12' className='p-2'>
                                <Col className=' bg-light rounded p-2'>
                                    <h3 className='text-center pb-2'>Summary</h3>
                                    <Row className='flex-column-reverse flex-sm-row row-no-gutters pb-2'>
                                        <Col className='col-sm-8 '>
                                            <div className='py-1 ps-sm-1'>
                                                <h6>Apply GST</h6>
                                                <div className='form-switch d-flex flex-row ps-0 align-items-center'>
                                                    <Label for='repair_no' className='form-check-label'>
                                                        No
                                                    </Label>
                                                    <Input
                                                        className='m-1'
                                                        type='switch'
                                                        name='primary'
                                                        id='gstToggle'
                                                        checked={hasGst}
                                                        onChange={e => handleHasGST(e)}
                                                    />
                                                    <Label for='reapir_yes' className='form-check-label'>
                                                        Yes
                                                    </Label>
                                                </div>
                                            </div>
                                            <div className='my-2 ps-1'>Total Net Cost: ₹ {netCost}</div>
                                            <div className='my-2 ps-1'>Total GST: ₹ {hasGst ? gst.toFixed(2) : 0}</div>
                                            {discountAmount && discountAmount > 0 ? <div className='my-2 ps-1'>Total Discount Amount: ₹ {discountAmount}</div> : <></>}
                                            <div className='my-2 ps-1'>Payable Amount: ₹ {total.toLocaleString()}</div>
                                        </Col>
                                        <Col className='col-sm-4 '>
                                            <div className='mb-2'>
                                                <Label>Discount Type</Label>
                                                <Select
                                                    menuPlacement='auto'
                                                    theme={selectThemeColors}
                                                    className='react-select discountTypeDropdown'
                                                    classNamePrefix='select'
                                                    options={discountOptions}
                                                    onChange={e => {
                                                        setDiscountType(e.value)
                                                        handleRemoveDiscount()
                                                    }}
                                                />
                                            </div>
                                            <div>
                                                <Label>Discount</Label>
                                                <Input
                                                    className='discountField'
                                                    type='number'
                                                    min={0}
                                                    max={100}
                                                    value={discount}
                                                    placeholder='Enter discount here'
                                                    onChange={e => setDiscount(e.target.value)}
                                                    disabled={disabled}
                                                />
                                            </div>
                                            <div className='text-center pt-1'>
                                                <div className="d-sm-flex">
                                                    {
                                                        discount && discount > 0 ? (
                                                            <>
                                                                <Button.Ripple color='success' onClick={() => {
                                                                    if (prevDiscount !== discount) {
                                                                        handleDiscount()
                                                                    }
                                                                }}>Apply</Button.Ripple>
                                                                <Button.Ripple className='ms-1' color='danger' onClick={() => {
                                                                    handleRemoveDiscount()
                                                                }}>X</Button.Ripple>
                                                            </>
                                                        ) : (
                                                            <Button.Ripple color='success' disabled >Apply</Button.Ripple>
                                                        )
                                                    }
                                                </div>
                                            </div>
                                        </Col>
                                    </Row>
                                </Col>
                            </Col> */}
                            <Col lg='12' className='p-2'>
                                <div className='d-flex flex-row flex-wrap'>
                                    <div className='pe-1 w-25'>
                                        <Label>
                                            Guest Name<span className='text-danger'>*</span>
                                        </Label>
                                        <Input
                                            type='text'
                                            value={guestName}
                                            // invalid={cgst === '' && loader}
                                            onChange={e => setGuestName(e.target.value)}
                                        />
                                        {showErrors && guestName === '' && <span className='text-danger'>Enter Guest Name</span>}
                                    </div>
                                    <div className='pe-1 w-25'>
                                        <Label>
                                            Guest Last Name<span className='text-danger'>*</span>
                                        </Label>
                                        <Input
                                            type='text'
                                            value={guestLastName}
                                            // invalid={cgst === '' && loader}
                                            onChange={e => setGuestLastName(e.target.value)}
                                        />
                                        {showErrors && guestLastName === '' && <span className='text-danger'>Enter Guest Last Name</span>}
                                    </div>
                                    <div className='pe-1' style={{ width: '70px' }}>
                                        <Label>
                                            Prefix<span className='text-danger'>*</span>
                                        </Label>
                                        <Input
                                            type='text'
                                            value={prefix}
                                            maxLength={3}
                                            // invalid={cgst === '' && loader}
                                            onChange={e => setPrefix(e.target.value.replace(/\D/g, ""))}
                                        />
                                        {showErrors && prefix === '' && <span className='text-danger'>Prefix</span>}
                                    </div>
                                    <div className='pe-1' style={{ width: '21%' }}>
                                        <Label>
                                            Mobile Number<span className='text-danger'>*</span>
                                        </Label>
                                        <Input
                                            type='text'
                                            value={guestMobileNumber}
                                            maxLength={10}
                                            // invalid={cgst === '' && loader}
                                            // onInput={(e) => {
                                            //     e.target.value = Math.max(0, parseInt(e.target.value)).toString().slice(0, 10)
                                            // }}
                                            onChange={e => setGuestMobileNumber(e.target.value.replace(/\D/g, ""))}
                                        />
                                        {showErrors && guestMobileNumber === '' && <span className='text-danger'>Enter Guest Mobile Number</span>}
                                    </div>
                                    <div className='pe-1' style={{ width: '21%' }}>
                                        <Label>
                                            Email Id
                                        </Label>
                                        <Input
                                            type='text'
                                            value={guestEmailId}
                                            // invalid={cgst === '' && loader}
                                            onChange={e => setGuestEmailId(e.target.value)}
                                        />
                                    </div>
                                </div>

                            </Col>

                        </Row>
                        <Row>
                            <Col lg='4' md='12' sm='12 mb-1'>
                                <Label>Coming From</Label>
                                <Input
                                    // disabled={bookerDetailsAvail}
                                    type='text'
                                    name='Coming From'
                                    // invalid={submitFlag && comingFrom === ''}
                                    value={comingFrom}
                                    onChange={e => setComingFrom(e.target.value)}
                                />
                                {/* {submitFlag && comingFrom === '' && <FormFeedback>Destination is required</FormFeedback>} */}
                            </Col>
                            <Col lg='4' md='12' sm='12 mb-1'>
                                <Label>Going To</Label>
                                <Input
                                    // disabled={bookerDetailsAvail}
                                    type='text'
                                    name='Going to'
                                    // invalid={submitFlag && goingTo === ''}
                                    value={goingTo}
                                    onChange={e => setGoingTo(e.target.value)}
                                />
                                {/* {submitFlag && goingTo === '' && <FormFeedback>Destination is required</FormFeedback>} */}
                            </Col>
                            <Col lg='4' md='12' sm='12 mb-1'>
                                <Label>Id Proof Type</Label>
                                <Select
                                    // isDisabled={bookerDetailsAvail}
                                    // placeholder={idProofType ? '' : 'Select Id Proof Type'}
                                    menuPlacement='auto'
                                    theme={selectThemeColors}
                                    className='react-select'
                                    classNamePrefix='select'
                                    options={idProofOptions}
                                    value={idProofOptions.filter(c => c.value === idProofType)}
                                    onChange={c => {
                                        setIdProofType(c.value)
                                    }}
                                />
                                {/* {showErrors && idProofType === '' && <span className='text-danger'>Select an Id Proof Type</span>} */}
                                {/* {showErrors && idProofType === '' && <p className='text-danger'>Select an Id Proof Type</p>} */}
                            </Col>
                            <Col lg='4' md='12' sm='12 mb-1'>
                                <Label>Id Proof Number</Label>
                                <Input
                                    // disabled={bookerDetailsAvail}
                                    type='text'
                                    name='Id proof Number'
                                    // invalid={submitFlag && nameProof === ''}
                                    value={idProofNumber}
                                    onChange={e => setIdProofNumber(e.target.value)}
                                />
                                {/* {showErrors && nameProof === '' && <FormFeedback>Name is required</FormFeedback>} */}
                            </Col>
                            {/* <Col lg='4' md='12' sm='12 mb-1'>
                                <Label>Name as per Id Proof<span className='text-danger'>*</span></Label>
                                <Input
                                    // disabled={bookerDetailsAvail}
                                    type='text'
                                    name='Name as per Id proof'
                                    // invalid={submitFlag && nameProof === ''}
                                    value={nameProof}
                                    onChange={e => setNameProof(e.target.value)}
                                />
                                {showErrors && nameProof === '' && <span className='text-danger'>Enter Name as per Id</span>}
                            </Col> */}
                            <Col lg='4' md='12' sm='12 mb-1'>
                                <Label>Id Proof Scan Copy</Label>
                                <Input
                                    // disabled={bookerDetailsAvail}
                                    type='file'
                                    name='Id proof copy'
                                    accept='image/jpg, image/jpeg, image/webp, image/png'
                                    // invalid={submitFlag && uploadedImg === ''}
                                    onChange={e => {
                                        handleUploadedImage(e)
                                    }}
                                />
                                {/* {showErrors && uploadedImg === '' && <span className='text-danger'>Image is required</span>} */}
                            </Col>

                            <Col lg='4' md='12' sm='12 mb-1'>
                                <Label className="form-label" for="country">
                                    Country
                                    {/* <span className="text-danger">*</span> */}
                                </Label>
                                <Select
                                    placeholder="Select Country"
                                    menuPlacement="auto"
                                    theme={selectThemeColors}
                                    className="react-select"
                                    classNamePrefix="select"
                                    options={countryOptions}
                                    value={countryOptions?.filter((c) => c.value === countryId)}
                                    onChange={(val) => {
                                        handleCountryDetailsList(val.value);
                                        stateDetailsList(val.value);
                                    }}
                                // invalid={display && countryId === ""}
                                />
                                {/* {display === true && !countryId ? (
                    <span className="error_msg_lbl">Country is required </span>
                  ) : null} */}
                            </Col>

                            <Col lg='4' md='12' sm='12 mb-1'>
                                <Label className="form-label" for="state">
                                    State
                                    {/* <span className="text-danger">*</span> */}
                                </Label>
                                <Select
                                    isDisabled={countryId === ""}
                                    placeholder="Select State"
                                    menuPlacement="auto"
                                    theme={selectThemeColors}
                                    className="react-select"
                                    classNamePrefix="select"
                                    options={stateOptions}
                                    value={stateOptions?.filter((c) => c.value === stateId)}
                                    onChange={(val) => {
                                        handleStateDetailsList(val.value);
                                        cityDetailsList(val.value);
                                        // districtDetailsList(val.value)
                                    }}
                                // invalid={display && stateId === ""}
                                />
                                {/* {display === true && !stateId ? (
                    <span className="error_msg_lbl">State is required </span>
                  ) : null} */}
                            </Col>

                            <Col lg='4' md='12' sm='12 mb-1'>
                                <Label className="form-label" for="city">
                                    City
                                    {/* <span className="text-danger">*</span> */}
                                </Label>
                                <Select
                                    isDisabled={stateId === ""}
                                    placeholder="Select City"
                                    menuPlacement="auto"
                                    theme={selectThemeColors}
                                    className="react-select"
                                    classNamePrefix="select"
                                    options={cityOptions}
                                    value={cityOptions?.filter((c) => c.value === cityId)}
                                    onChange={(val) => {
                                        handleCityDetailsList(val.value);
                                    }}
                                // invalid={display && cityId === ""}
                                />
                                {/* {display === true && !cityId ? (
                    <span className="error_msg_lbl">City is required </span>
                  ) : null} */}
                            </Col>
                        </Row>
                        <Row className='d-flex flex-lg-row flex-column'>
                            <Col lg='12' className='p-2'>
                                <Col className=' bg-light rounded p-2'>
                                    <h3 className='text-center pb-1'>Summary</h3>
                                    <Row className='flex-column-reverse flex-sm-row row-no-gutters pb-2'>
                                        <Col className='col-sm-12 d-flex justify-content-around'>
                                            <div className='py-1 ps-sm-1 '>
                                                <h6>Apply GST</h6>
                                                <div className='form-switch d-flex flex-row ps-0 align-items-center'>
                                                    <Label for='repair_no' className='form-check-label'>
                                                        No
                                                    </Label>
                                                    <Input
                                                        className='m-1'
                                                        type='switch'
                                                        name='primary'
                                                        id='gstToggle'
                                                        checked={hasGst}
                                                        onChange={e => handleHasGST(e)}
                                                    />
                                                    <Label for='reapir_yes' className='form-check-label'>
                                                        Yes
                                                    </Label>
                                                </div>
                                            </div>
                                            <div>
                                                <div className='my-2 ps-1'>Total Net Cost: ₹ {netCost}</div>
                                                {/* <div className='my-2 ps-1'>Total GST: ₹ {gst}</div> */}
                                                <div className='my-2 ps-1'>Total GST: ₹ {hasGst ? gst.toFixed(2) : 0}</div>
                                                {discountAmount && discountAmount > 0 ? <div className='my-2 ps-1'>Total Discount Amount: ₹ {discountAmount}</div> : <></>}
                                                <div className='my-2 ps-1'>Payable Amount: ₹ {total.toLocaleString()}</div>
                                            </div>
                                            {/* <div> */}
                                            <div className='mb-2'>
                                                <Label>Discount Type</Label>
                                                <Select
                                                    menuPlacement='auto'
                                                    // menuPortalTarget={document.body}
                                                    theme={selectThemeColors}
                                                    className='react-select discountTypeDropdown'
                                                    classNamePrefix='select'
                                                    options={discountOptions}
                                                    onChange={e => {
                                                        setDiscountType(e.value)
                                                        handleRemoveDiscount()
                                                    }}
                                                    style={{ width: '200px' }}
                                                />
                                            </div>
                                            <div>
                                                <Label>Discount</Label>
                                                <Input
                                                    className='discountField'
                                                    type='number'
                                                    min={0}
                                                    max={100}
                                                    value={discount}
                                                    placeholder='Enter discount here'
                                                    // onChange={e => handleDiscountValue(e)}
                                                    onChange={e => setDiscount(e.target.value)}
                                                    disabled={disabled}
                                                    style={{ width: '200px' }}
                                                />
                                                {/* {
                                                    discountType === 'percentage' && discount > 0 ? (
                                                        <span className='text-small'>
                                                            (₹  {((cost) * (Number(discount) / 100)).toLocaleString()})
                                                        </span>
                                                    ) : null
                                                } */}
                                            </div>
                                            <div className='text-center pt-2'>
                                                <div className="d-sm-flex">
                                                    {
                                                        discount && discount > 0 ? (
                                                            <>
                                                                <Button.Ripple color='success' onClick={() => {
                                                                    if (prevDiscount !== discount) {
                                                                        handleDiscount()
                                                                    }
                                                                }}>Apply</Button.Ripple>
                                                                <Button.Ripple className='ms-1' color='danger' onClick={() => {
                                                                    handleRemoveDiscount()
                                                                }}>X</Button.Ripple>
                                                            </>
                                                        ) : (
                                                            <Button.Ripple color='success' disabled >Apply</Button.Ripple>
                                                        )
                                                    }
                                                </div>
                                            </div>
                                            {/* </div> */}
                                        </Col>
                                        <Col className='col-sm-4 '>

                                        </Col>
                                    </Row>
                                </Col>
                            </Col>
                            {/* <Col lg='6' className='p-2'>
                                
                                <div className='me-md-1 me-0 my-1  w-100'>
                                    <Label className='form-label' for='guestDetails'>
                                        Guest Details<span className='text-danger'>*</span>{selGuestDetail ? <span onClick={handleEditGuest} className='mx-1 cursor-pointer'>(<Edit3 color='blue' size={15} /> Edit Guest details)</span> : null}
                                    </Label>
                                    <CreatableSelect
                                        placeholder=''
                                        menuPlacement='auto'
                                        theme={selectThemeColors}
                                        className='react-select'
                                        classNamePrefix='select'
                                        // options={guestDetailOptions}
                                        // formatCreateLabel={userInput => `Create new Guest '${userInput}'`}
                                        // value={guestDetailOptions?.filter(c => c.value === selGuestDetail)}
                                        // onChange={val => {
                                        //     handleGuestDetail(val.value)
                                        // }}
                                        // onFocus={() => {
                                        //     guestDetail()
                                        // }}
                                        // onCreateOption={handleOpeng}
                                        // invalid={showErrors && selGuestDetail === ''}
                                        // onCreateOption={handleOpen}

                                        options={guestOptions}
                                        formatCreateLabel={userInput => `Create new Guest '${userInput}'`}
                                        // value={guestDetailOptions?.filter(c => c.value === selGuestDetail)}
                                        value={guestOptions?.filter(c => c.value === selGuestDetail)}
                                        onChange={val => {
                                            handleGuestDetail(val.value)
                                        }}
                                        onFocus={() => {
                                            guestDetail()
                                            console.log("called guest result")
                                        }}
                                        onCreateOption={handleOpeng}
                                        invalid={showErrors && selGuestDetail === ''}
                                    />
                                    {
                                        showErrors && !selGuestDetail ? <Label className='text-danger'>select guest details !</Label> : null
                                    }
                                </div>
                                <div className='me-md-1 me-0 my-1 w-100'>
                                    <Label className='form-label' for='specialNote'>
                                        Special Note
                                    </Label>
                                    <Input
                                        type='textarea'
                                        value={note}
                                        onChange={e => setNote(e.target.value)}
                                    />
                                </div>

                            </Col> */}
                        </Row>

                        <Row>
                            {/* <Col className='d-flex mt-1 flex-row justify-content-center'>
                                <h4>Booking Status:</h4>
                                <div className='d-flex flex-row justify-content-around'>
                                    <Col className='form-check mx-1 mb-1'>
                                        <Input
                                            type='radio'
                                            id='confirm'
                                            name='confirm'
                                            checked={status}
                                            onChange={() => setStatus(true)}
                                        />
                                        <Label className='form-check-label' for='confirm'>Confirm</Label>
                                    </Col>
                                    <Col className='form-check mx-1 mb-1'>
                                        <Input
                                            type='radio'
                                            id='hold'
                                            name='hold'
                                            disabled
                                        />
                                        <Label className='form-check-label' for='confirm'>Hold</Label>
                                    </Col>
                                </div>
                            </Col> */}
                            <hr />
                            {
                                status && <Col>
                                    <Row className='d-flex flex-lg-row flex-column'>
                                        <Col>
                                            <Label>
                                                Payment Type<span className='text-danger'>*</span>
                                            </Label>
                                            <Col>
                                                <Controller
                                                    defaultValue=''
                                                    id='paymentType'
                                                    name='paymentType'
                                                    control={control}
                                                    render={
                                                        ({ field: { onChange, value, ref } }) => <Select
                                                            placeholder=''
                                                            menuPlacement='auto'
                                                            theme={selectThemeColors}
                                                            className='react-select'
                                                            classNamePrefix='select'
                                                            options={paymentTypeOptions}
                                                            inputRef={ref}
                                                            value={paymentTypeOptions.filter(c => value.includes(c.value))}
                                                            onChange={(val) => {
                                                                onChange(val.value)
                                                                setPstatus(val.label)
                                                                store.dispatch(setPaymentTypeStore(val.value))
                                                            }}
                                                            invalid={errors.paymentType && true}
                                                        />
                                                    }
                                                />
                                            </Col>
                                            {pstatus === '' && showErrors && <Label className='text-danger'>Payment Type is required!</Label>}
                                        </Col>
                                        {
                                            pstatus !== 'Bill to Company' && <Col>
                                                <Label>
                                                    Payment Mode{pstatus !== '' && <span className='text-danger'>*</span>}
                                                </Label>
                                                <Col>
                                                    <Controller
                                                        defaultValue=''
                                                        id='collectionType'
                                                        name='collectionType'
                                                        control={control}
                                                        render={
                                                            ({ field: { onChange, value, ref } }) => <Select
                                                                isDisabled={pstatus === '' || paymentModeOptions.length === 0}
                                                                placeholder=''
                                                                menuPlacement='auto'
                                                                theme={selectThemeColors}
                                                                className='react-select'
                                                                classNamePrefix='select'
                                                                options={paymentModeOptions}
                                                                inputRef={ref}
                                                                value={paymentModeOptions.filter(c => value.includes(c.value))}
                                                                onChange={(val) => {
                                                                    onChange(val.value)
                                                                    store.dispatch(setPaymentModeStore(val.value))
                                                                }

                                                                }
                                                                invalid={errors.cType && showErrors}
                                                            />
                                                        }
                                                    />
                                                </Col>
                                                {cType === '' && showErrors && <Label className='text-danger'>Payment Mode is required!</Label>}
                                            </Col>
                                        }

                                        {
                                            pstatus !== 'hotel' && pstatus !== 'Bill to Company' ? (
                                                <>
                                                    <Col>
                                                        <Col className='mt-2'>
                                                            <div>
                                                                <Input type='radio' name='payFull' id='fullAmount' value="Yes" checked={payFull === "Yes"} onChange={e => (setPayFull(e.target.value), setAmount(quickBookingStore.total))} />
                                                                <Label className='Amount' for='fullAmount'>
                                                                    Full Amount
                                                                </Label>
                                                                <Input type='radio' className='ms-2' name='payFull' id='partialAmount' value="No" checked={payFull === "No"} onChange={e => (setPayFull(e.target.value), setAmount(quickBookingStore.total === amount ? 0 : amount))} />
                                                                <Label className='Amount' for='partialAmount'>
                                                                    Partial Amt
                                                                </Label>

                                                            </div>
                                                        </Col>
                                                        {payFull === '' && loader && <Label className='text-danger'>Payment Type is required!</Label>}
                                                    </Col>
                                                    <Col>
                                                        <Label>
                                                            Collected Amount
                                                        </Label>
                                                        <Col>
                                                            <Input
                                                                type='text'
                                                                onChange={e => {
                                                                    if (e.target.value < 0) {
                                                                        setAmount(0)
                                                                    } else setAmount(e.target.value)
                                                                }}
                                                                value={amount === 0 && payFull === 'Yes' ? quickBookingStore.total : amount}
                                                                disabled={payFull === "Yes"}
                                                                invalid={loader && (amount === '' || amount > quickBookingStore.total)}
                                                            />
                                                        </Col>
                                                        {payFull === "No" && amount === '' && loader && <Label className='text-danger'>Collected amount cannot be blank!</Label>}
                                                        {payFull === "No" && amount > quickBookingStore.total && loader && <Label className='text-danger'>Collected amount cannot be more than full amount!</Label>}
                                                    </Col>
                                                </>
                                            ) : pstatus === 'Bill to Company' && pstatus !== 'hotel' ? (
                                                <>
                                                    <Col>
                                                        <Label>
                                                            Company GST<span className='text-danger'>*</span>
                                                        </Label>
                                                        <Col>
                                                            <Input
                                                                type='text'
                                                                value={cgst}
                                                                invalid={cgst === '' && loader}
                                                                onChange={e => setCgst(e.target.value)}
                                                            />
                                                        </Col>
                                                        {cgst === '' && loader && <FormFeedback>Gst is required!</FormFeedback>}
                                                    </Col>
                                                    <Col>
                                                        <Label>
                                                            Company Name<span className='text-danger'>*</span>
                                                        </Label>
                                                        <Col>
                                                            <Input
                                                                type='text'
                                                                value={cname}
                                                                invalid={cname === '' && loader}
                                                                onChange={e => setCname(e.target.value)}
                                                            />
                                                        </Col>
                                                        {cname === '' && loader && <FormFeedback>Company Name is required!</FormFeedback>}
                                                    </Col>
                                                    <Col>
                                                        <Label>
                                                            Company Address<span className='text-danger'>*</span>
                                                        </Label>
                                                        <Col>
                                                            <Input
                                                                type='text'
                                                                value={cadd}
                                                                invalid={cadd === '' && loader}
                                                                onChange={e => setCadd(e.target.value)}
                                                            />
                                                        </Col>
                                                        {cadd === '' && loader && <FormFeedback>Company Address is required!</FormFeedback>}
                                                    </Col>
                                                </>
                                            ) : null
                                        }

                                    </Row>
                                    {/* <Row className='d-flex flex-lg-row flex-column'>
                                        <Col>
                                            <Label>
                                                Payment Reference
                                            </Label>
                                            <Controller
                                                defaultValue=''
                                                control={control}
                                                id='paymentReference'
                                                name='paymentReference'
                                                render={
                                                    ({ field }) => <Input
                                                        type='textarea'
                                                        invalid={errors.paymentReference && true}
                                                        {...field}
                                                    />
                                                }
                                            />
                                            {errors.paymentReference && <FormFeedback>{errors.paymentReference.message}!</FormFeedback>}
                                        </Col>
                                        <Col>
                                            <Label>
                                                Internal Note
                                            </Label>
                                            <Controller
                                                defaultValue=''
                                                control={control}
                                                id='internalNote'
                                                name='internalNote'
                                                render={
                                                    ({ field }) => <Input
                                                        type='textarea'
                                                        invalid={errors.internalNote && true}
                                                        {...field}
                                                    />
                                                }
                                            />
                                            {errors.internalNote && <FormFeedback>{errors.internalNote.message}!</FormFeedback>}
                                        </Col>
                                    </Row> */}
                                    <Row className='d-flex flex-lg-row flex-column'>
                                        <Col>
                                            <Label>
                                                Booking Created By<span className='text-danger'>*</span>
                                            </Label>
                                            <Controller
                                                defaultValue=''
                                                id='boookedBy'
                                                name='boookedBy'
                                                control={control}
                                                render={
                                                    ({ field: { onChange, value, ref } }) => <Select
                                                        placeholder=''
                                                        menuPlacement='auto'
                                                        theme={selectThemeColors}
                                                        className='react-select'
                                                        classNamePrefix='select'
                                                        options={userDetails}
                                                        inputRef={ref}
                                                        value={userDetails.filter(c => value.includes(c.value))}
                                                        onChange={val => {
                                                            onChange(val.value)
                                                            store.dispatch(setBookingCreatedByStore(val.value))
                                                        }}
                                                        invalid={errors.boookedBy}
                                                    />
                                                }
                                            />
                                            {showErrors && booker === '' && <span className='text-danger'>Select a booker</span>}
                                            {errors.boookedBy && <Label className='text-danger'>{errors.boookedBy.message}!</Label>}
                                        </Col>
                                        <Col>
                                            <Label>
                                                Created By{booker === '0' && <span className='text-danger'>*</span>}
                                            </Label>
                                            <Controller
                                                defaultValue=''
                                                control={control}
                                                id='bookerName'
                                                name='bookerName'
                                                render={
                                                    ({ field }) => <Input
                                                        type='text'
                                                        disabled={booker !== '0'}
                                                        invalid={errors.bookerName && true}
                                                        {...field}
                                                    />
                                                }
                                            />
                                            {showErrors && booker === '0' && newBooker === '' && <span className='text-danger'>Booking created by is required!</span>}
                                        </Col>
                                    </Row>
                                    <div className='mt-1 d-flex justify-content-center'>
                                        <Button color='primary' className='btn-next'>
                                            <span className='align-middle'>
                                                {
                                                    loader ? (
                                                        <Spinner color='#FFF' />
                                                    ) : 'Create Booking'
                                                }
                                            </span>
                                            <ArrowRight size={14} className='align-middle ms-sm-25 ms-0'></ArrowRight>
                                        </Button>
                                    </div>
                                </Col>
                            }
                        </Row>
                    </Form>
                </ModalBody>
            </Modal>
            {openg && <RegisterGuest open={openg} handleOpen={handleOpeng} />}
            {openAgency && <RegisterAgency open={openAgency} handleOpenAgency={handleOpenAgency} sourceID={bookingSourceId} />}
            {openBookModal && <QuickBookingDetailPreview
                open={openBookModal}
                handleOpen={handleBookModal}
                bookingID={newBID}
                handleModalOpen={handleModalOpen}
            />}
            {editGuest && <EditGuest open={editGuest} handleOpen={handleEditGuest} guestData={selGuestDetail} />}
            {
                open ? (
                    <div className="modal-backdrop fade show" ></div>
                ) : null
            }
        </>
    )
}

export default QuickBookingModal