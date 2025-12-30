import React, { useEffect, useState } from "react";
import {
	Card,
	Row,
	Col,
	Badge,
	Button,
} from "reactstrap";
import { Calendar, Circle, Monitor, UserCheck, Mail, User } from "react-feather";
import { Chart as ChartJS, registerables } from "chart.js";
import CardDetail from "./CardDetail";
import { storeBookingDetails } from "../../redux/voucherSlice";
import axios from "../../API/axios";
import { ChevronDown } from "react-feather";
import DataTable from "react-data-table-component";
import BookingModal from "../FrontDesk/BookingModal";
import OnHoldQuickBookingModal from '../FrontDesk/OnHoldQuickBookingModal'
import toast from "react-hot-toast";
import moment from "moment";
import { useDispatch, useSelector } from "react-redux";
import Avatar from '@components/avatar'
import HotelSelectModal from "./HotelSelectModal";
import '../../assets/scss/style.scss';
import { Modal, ModalHeader, ModalBody } from 'reactstrap'
import Select from 'react-select'


ChartJS.register(...registerables);
const DashBoard = () => {

	useEffect(() => {
		const prevTitle = document.title
		document.title = "PMS-Dashboard"

		return () => {
			document.title = prevTitle
		}
	}, [])


	const [isModalOpen, setIsModalOpen] = useState(false);
	const toggleModal = () => setIsModalOpen(!isModalOpen);
	useEffect(() => {
		setIsModalOpen(true);
	}, []);


	const [isNewModalOpen, setIsNewModalOpen] = useState(false);
	const toggleNewModal = () => setIsNewModalOpen(!isNewModalOpen);

	const [cardData, setCardData] = useState([]);
	const [open, setOpen] = useState(false);
	const [data, setData] = useState([]);
	const [refresh, setRefresh] = useState(false);
	const [roomData, setRoomData] = useState([]);
	const [sel_bookingID, setSel_bookingID] = useState('')
	const [remaining, setRemaining] = useState('')
	const getUserData = useSelector((state) => state.userManageSlice.userData);
	const { LoginID, Token, CompanyID, PropertyID } = getUserData;

	const [dailyNumData, setDailyNumData] = useState([]);
	const handleOpen = () => setOpen(!open)
	const handleOnHoldOpne = () => setOnHoldOpen(!onHoldOpen)
	const [onHoldOpen, setOnHoldOpen] = useState(false)
	const [bookingStatus, setBookingStatus] = useState('')
	console.log('bookingStatus', bookingStatus);

	const [hotelSelectOpen, setHotelSelectOpen] = useState(false);
	const handleHotelSelectOpen = () => setHotelSelectOpen(!hotelSelectOpen)

	const dispatch = useDispatch();
	const getNumData = async () => {
		try {
			const objc1 = {
				LoginID,
				Token,
				Seckey: "abc",
				Event: "chart",
			};
			const res = await axios.post("getdata/bookingdata/dashboardchart", objc1);
			console.log("numres", res);
			setDailyNumData(res.data);
			setRemaining(res.data[0])
		} catch (error) {
			console.log("Error", error);
		}
	};
	const getRemainingCheckout = async () => {
		try {
			const objc1 = {
				LoginID,
				Token,
				Seckey: "abc",
				Event: "Remaining Checkout",
			};
			const res = await axios.post("getdata/bookingdata/dashboardchart", objc1);
			console.log("remres", res);
			console.log("remres", res.data[0]);
			setRemaining(res.data[0])
		} catch (error) {
			console.log("Error", error);
		}
	};
	useEffect(() => {
		getNumData();
		getRemainingCheckout()
	}, []);
	// console.log("dailyNumData", dailyNumData);

	const getRooms = (i) => {
		// console.log("data i > ", data[i]); // TODO - getroom data for the selected reservation
		try {
			const bookingsBody = {
				LoginID,
				Token,
				Seckey: "abc",
			};
			axios
				.post(`/getdata/bookingdata/dashboardchart`, bookingsBody)
				.then((response) => {
					// console.log("Bookings room num response", response?.data[0]);
					// console.log("123qqq");
					setRoomData(response?.data[0]);
				});
		} catch (error) {
			console.log("123qqq2222");
			console.log("Bookings Error=====", error.message);
		}
	};

	// const handleOpen = (row, i) => {
	//   console.log("data i >", data[i]);
	//   dispatch(storeBookingDetails({ LoginID, Token, BookingId: row.BookingID }));
	//   getRooms(i);
	//   setOpen(!open);
	// };

	useEffect(() => {
		try {
			const bookingsBody = {
				LoginID,
				Token,
				Seckey: "abc",
				// CheckInDate: checkInDate,
				Event: "chart",
				// CheckOutDate: checkInDateP
			};
			axios
				.post(`getdata/bookingdata/dashboardchart`, bookingsBody)
				.then((response) => {
					console.log("res111", response?.data[0]);
					if (response.status === 200) {
						// console.log(
						//   "express Bookings room chart response",
						//   response?.data[0]
						// );
						setData(response?.data[0]);
						// console.log("res", response);
					}
				})
				.catch(function (error) {
					console.log("Bookings Error=====", error?.response?.data?.Message);
				});
		} catch (error) {
			console.log("Bookings Error=====", error);
			toast.error("Something went wrong, Try again!");
		}
		if (data === []) {
			setRefresh(true);
		}
	}, [refresh]);

	const columns = [
		{
			center: true,
			width: '80px',
			sortable: row => row.guestName,
			cell: (row, i) => (
				<div className='d-flex align-items-center cursor-pointer ' onClick={() => {
					setSel_bookingID(row.bookingID);
					setBookingStatus(row.status)
					console.warn("gengarBookingId", row.bookingID)
					dispatch(storeBookingDetails({ LoginID, Token, BookingId: row.bookingID }))
					if (row.Status === 'OnHold') {
						handleOnHoldOpne()
					} else handleOpen()
				}}>
					{/* {row.avatar === '' ? (
            <Avatar img={require(`../../assets/images/logo/hostynnist-logo.png`).default} />

          ) : (
            <Avatar color={`light-${states[i]}`} content={row.GuestName.toUpperCase()} initials />
          )} */}
					{/* <Avatar
            title="Click to Manage Booking"
            icon={<User color='#FFFFFF' size={25} />}
            color={
              row.Status === 'Active' && row.CheckIn ? (
                'success'
              ) : row.Status === 'Checkout' ? (
                'primary'
              ) : row.Status === 'Cancelled' ? (
                'danger'
              ) : row.Status === 'Active' && row.CheckIn === false ? (
                'warning'
              ) : row.Status === 'OnHold' ? (
                'info'
              ) : '#000'
            }
          /> */}

					<Badge
						className="m-1 p-15 badge-glow d-flex justify-content-center align-items-center"
						// className="text-align-center" 
						title="Click to Manage Booking"
						color="success"
					//  icon={<User color='#FFFFFF' size={25} />}
					//  color={
					//    row.Status === 'Active' && row.CheckIn ? (
					//      'success'
					//    ) : row.Status === 'Checkout' ? (
					//      'primary'
					//    ) : row.Status === 'Cancelled' ? (
					//      'danger'
					//    ) : row.Status === 'Active' && row.CheckIn === false ? (
					//      'warning'
					//    ) : row.Status === 'OnHold' ? (
					//      'info'
					//    ) : '#000'
					//  }
					>  Create<br />
						Check-in
					</Badge>

				</div>
			)
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
							) : row.status === 'Reserved' && row.CheckIn === false ? (
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
			name: "Booking ID",
			sortable: true,
			minWidth: "200px",
			selector: (row) => row.bookingID,
		},

		{
			name: "Guest Name",
			sortable: true,
			center: true,
			minWidth: "150px",
			selector: (row) => (
				<>
					<p>{row.guestName}</p>
					<p>{row.guestMobileNumber}</p>
				</>
			),
		},
		{
			name: "Check-In",
			center: true,
			wrap: true,
			sortable: true,
			minWidth: "130px",
			selector: (row) => (
				<>
					<p>{moment(row.checkInDate).format("LL")}</p>
				</>
			),
		}
	];

	const columns1 = [
		{
			center: true,
			width: '80px',
			sortable: row => row.guestName,
			cell: (row, i) => (
				<div className='d-flex align-items-center cursor-pointer' onClick={() => {
					setSel_bookingID(row.bookingID);
					setBookingStatus(row.status)
					console.warn("gengarBookingId", row.bookingID)
					dispatch(storeBookingDetails({ LoginID, Token, BookingId:row.bookingID }))
					if (row.status === 'OnHold') {
						handleOnHoldOpne()
					} else handleOpen()
				}}>
					{/* {row.avatar === '' ? (
            <Avatar img={require(`../../assets/images/logo/hostynnist-logo.png`).default} />

          ) : (
            <Avatar color={`light-${states[i]}`} content={row.GuestName.toUpperCase()} initials />
          )} */}
					{/* <Avatar
            title="Click to Manage Booking"
            icon={<User color='#FFFFFF' size={25} />}
            color={
              row.Status === 'Active' && row.CheckIn ? (
                'success'
              ) : row.Status === 'Checkout' ? (
                'primary'
              ) : row.Status === 'Cancelled' ? (
                'danger'
              ) : row.Status === 'Active' && row.CheckIn === false ? (
                'warning'
              ) : row.Status === 'OnHold' ? (
                'info'
              ) : '#000'
            }
          /> */}
					<Badge
						className="m-1 p-15 badge-glow d-flex justify-content-center align-items-center"
						title="Click to Manage Booking"
						color="primary"
					>
						Create <br />
						Check-Out
					</Badge>
				</div>
			)
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
			name: "Booking ID",
			sortable: true,
			minWidth: "200px",
			selector: (row) => row.bookingID,
		},
		{
			name: "Guest Name",
			sortable: true,
			center: true,
			minWidth: "150px",
			selector: (row) => (
				<>
					<p>{row.guestName}</p>
					<p>{row.guestMobileNumber}</p>
				</>
			),
		},
		{
			name: "Check-Out",
			center: true,
			wrap: true,
			sortable: true,
			minWidth: "130px",
			selector: (row) => (
				<>
					<p>{moment(row.checkOutDate).format("LL")}</p>
				</>
			),
		},
	];
	const remainingColumns = [
		// console.log('row', row),
		{
			center: true,
			width: '80px',
			sortable: row => row.guestName,
			cell: (row, i) => (
				<div className='d-flex align-items-center cursor-pointer' onClick={() => {
					setSel_bookingID(row.bookingID);
					setBookingStatus(row.status)
					console.warn("gengarBookingId", row.bookingID)
					dispatch(storeBookingDetails({ LoginID, Token, BookingId: row.bookingID }))
					if (row.status === 'OnHold') {
						handleOnHoldOpne()
					} else handleOpen()
				}}>
					{/* {row.avatar === '' ? (
            <Avatar img={require(`../../assets/images/logo/hostynnist-logo.png`).default} />

          ) : (
            <Avatar color={`light-${states[i]}`} content={row.GuestName.toUpperCase()} initials />
          )} */}
					{/* <Avatar
            title="Click to Manage Booking"
            icon={<User color='#FFFFFF' size={25} />}
            color={
              row.Status === 'Active' && row.CheckIn ? (
                'success'
              ) : row.Status === 'Checkout' ? (
                'primary'
              ) : row.Status === 'Cancelled' ? (
                'danger'
              ) : row.Status === 'Active' && row.CheckIn === false ? (
                'warning'
              ) : row.Status === 'OnHold' ? (
                'info'
              ) : '#000'
            }
          /> */}
					<Badge
						className="m-1 p-15 badge-glow d-flex justify-content-center align-items-center"
						title="Click to Manage Booking"
						color="primary"
					>
						Create <br />
						Check-Out
					</Badge>
				</div>
			)
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
							) : row.Status === 'Cancelled' ? (
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
			name: "Booking ID",
			sortable: true,
			minWidth: "200px",
			selector: (row) => row.bookingID,
		},
		{
			name: "Guest Name",
			sortable: true,
			center: true,
			minWidth: "150px",
			selector: (row) => (
				<>
					<p>{row.guestName}</p>
					<p>{row.guestMobileNumber}</p>
				</>
			),
		},
		{
			name: "Check-Out",
			center: true,
			wrap: true,
			sortable: true,
			minWidth: "130px",
			selector: (row) => (
				<>
					<p>{moment(row.checkOutDate).format("LL")}</p>
				</>
			),
		},
	];


	useEffect(() => {
		if (PropertyID === null) {
			handleHotelSelectOpen()
		}
	}, [])

	const dataFilterOption = [
		// {value:"Today",label:"Today"},
		{ value: "Weekly", label: "Weekly" },
		{ value: "Monthly", label: "Monthly" },
		{ value: "Qurterly", label: "Qurterly" },
		{ value: "Yearly", label: "Yearly" },
	]

	// console.log('dailyNumData', dailyNumData[8], remaining, cardData[0]);
	return (
		<div className="dash_main">
			<Row>
				<Col lg="4" xs="12" sm="4" md="6" xl="3">
					<div className="earnings-card top-card">
						<CardDetail
							id="1"
							title="Active Subscriptions"
							dataArr={dailyNumData[0]}
							icon={<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" viewBox="0 0 256 256"><path d="M136,32V216H40V85.35a8,8,0,0,1,3.56-6.66l80-53.33A8,8,0,0,1,136,32Z" opacity="0.2"></path><path d="M240,208H224V96a16,16,0,0,0-16-16H144V32a16,16,0,0,0-24.88-13.32L39.12,72A16,16,0,0,0,32,85.34V208H16a8,8,0,0,0,0,16H240a8,8,0,0,0,0-16ZM208,96V208H144V96ZM48,85.34,128,32V208H48ZM112,112v16a8,8,0,0,1-16,0V112a8,8,0,1,1,16,0Zm-32,0v16a8,8,0,0,1-16,0V112a8,8,0,1,1,16,0Zm0,56v16a8,8,0,0,1-16,0V168a8,8,0,0,1,16,0Zm32,0v16a8,8,0,0,1-16,0V168a8,8,0,0,1,16,0Z"></path></svg>}
							amount={
								cardData && cardData[0]?.todaysBookings
									? cardData[0]?.todaysBookings
									: ""
							}
						/>
						
					</div>
				</Col>
				<Col lg="4" xs="12" sm="4" md="6" xl="3">
					<div className="earnings-card top-card">
						<CardDetail
							id="2"
							title="Trial Users"
							dataArr={dailyNumData[1]}
							icon={<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" viewBox="0 0 256 256"><path d="M216,136a88,88,0,1,1-88-88A88,88,0,0,1,216,136Z" opacity="0.2"></path><path d="M128,40a96,96,0,1,0,96,96A96.11,96.11,0,0,0,128,40Zm0,176a80,80,0,1,1,80-80A80.09,80.09,0,0,1,128,216ZM173.66,90.34a8,8,0,0,1,0,11.32l-40,40a8,8,0,0,1-11.32-11.32l40-40A8,8,0,0,1,173.66,90.34ZM96,16a8,8,0,0,1,8-8h48a8,8,0,0,1,0,16H104A8,8,0,0,1,96,16Z"></path></svg>}
							amount={
								cardData && cardData[0]?.monthlyBookings
									? cardData[0]?.monthlyBookings
									: ""
							}
						/>
					</div>
				</Col>

				{/* Bookings Filter */}
				<Col lg="4" xs="12" sm="4" md="6" xl="3">
					<div className="earnings-card top-card" onClick={toggleNewModal} style={{ cursor: "pointer" }}>
						<div className="card">
							<div className="card-body">
								<div className="d-flex justify-content-between align-items-center">
									<div>
										<p style={{ marginBottom: "0" }} className="card-text"> Expiring Soon</p>
										<h3 className="fw-bolder mb-75"><strong>{remaining.length}</strong></h3>
									</div>

									<div className="avatar avatar-stats p-50 m-0 bg-light-primary">
										<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" viewBox="0 0 256 256"><path d="M224,128a96,96,0,1,1-96-96A96,96,0,0,1,224,128Z" opacity="0.2"></path><path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm0,192a88,88,0,1,1,88-88A88.1,88.1,0,0,1,128,216Zm64-88a8,8,0,0,1-8,8H128a8,8,0,0,1-8-8V72a8,8,0,0,1,16,0v48h48A8,8,0,0,1,192,128Z"></path></svg>
									</div>
								</div>
							</div>
						</div>
					</div>
				</Col>


				<Col lg="4" xs="12" sm="4" md="6" xl="3">
					<div className="earnings-card top-card pe-none">
						<CardDetail
							id="6"
							title="Failed Renewals"
							dataArr={dailyNumData[5]}
							icon={<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" viewBox="0 0 256 256"><path d="M215.46,216H40.54C27.92,216,20,202.79,26.13,192.09L113.59,40.22c6.3-11,22.52-11,28.82,0l87.46,151.87C236,202.79,228.08,216,215.46,216Z" opacity="0.2"></path><path d="M236.8,188.09,149.35,36.22h0a24.76,24.76,0,0,0-42.7,0L19.2,188.09a23.51,23.51,0,0,0,0,23.72A24.35,24.35,0,0,0,40.55,224h174.9a24.35,24.35,0,0,0,21.33-12.19A23.51,23.51,0,0,0,236.8,188.09ZM222.93,203.8a8.5,8.5,0,0,1-7.48,4.2H40.55a8.5,8.5,0,0,1-7.48-4.2,7.59,7.59,0,0,1,0-7.72L120.52,44.21a8.75,8.75,0,0,1,15,0l87.45,151.87A7.59,7.59,0,0,1,222.93,203.8ZM120,144V104a8,8,0,0,1,16,0v40a8,8,0,0,1-16,0Zm20,36a12,12,0,1,1-12-12A12,12,0,0,1,140,180Z"></path></svg>}
							amount={
								cardData && cardData[0]?.todaysDepartures
									? cardData[0]?.todaysDepartures
									: ""
							}
						/>
					</div>
				</Col>
				<Col lg="4" xs="12" sm="4" md="6" xl="4">
					<div className="earnings-card pe-none bottom-card">
						<CardDetail
							id="5"
							title="Monthly Recurring Revenue"
							dataArr={dailyNumData[4]}
							icon={<svg class="text-success" xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" viewBox="0 0 256 256"><path d="M232,96v96a8,8,0,0,1-8,8H32a8,8,0,0,1-8-8V96Z" opacity="0.2"></path><path d="M224,48H32A16,16,0,0,0,16,64V192a16,16,0,0,0,16,16H224a16,16,0,0,0,16-16V64A16,16,0,0,0,224,48Zm0,16V88H32V64Zm0,128H32V104H224v88Zm-16-24a8,8,0,0,1-8,8H168a8,8,0,0,1,0-16h32A8,8,0,0,1,208,168Zm-64,0a8,8,0,0,1-8,8H120a8,8,0,0,1,0-16h16A8,8,0,0,1,144,168Z"></path></svg>}
							amount={
								cardData && cardData[0]?.monthlyEarninngs
									? cardData[0]?.monthlyEarninngs
									: ""
							}
						/>
					</div>
				</Col>
				<Col lg="4" xs="12" sm="4" md="6" xl="4">
					<div className="earnings-card bottom-card">
						<CardDetail
							id="7"
							title="Annual Recurring Revenue"
							dataArr={dailyNumData[8]}
							icon={<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" viewBox="0 0 256 256"><path d="M224,64V208H32V48H208A16,16,0,0,1,224,64Z" opacity="0.2"></path><path d="M232,208a8,8,0,0,1-8,8H32a8,8,0,0,1-8-8V48a8,8,0,0,1,16,0v94.37L90.73,98a8,8,0,0,1,10.07-.38l58.81,44.11L218.73,90a8,8,0,1,1,10.54,12l-64,56a8,8,0,0,1-10.07.38L96.39,114.29,40,163.63V200H224A8,8,0,0,1,232,208Z"></path></svg>}
						// amount={
						//   cardData && cardData[0]?.CreditPendingAmount
						//     ? cardData[0]?.CreditPendingAmount
						//     : ""
						// }
						/>
					</div>
				</Col>

				<Col lg="4" xs="12" sm="4" md="6" xl="4">
					<div className="earnings-card pe-none bottom-card">
						<CardDetail
							id="4"
							title="Conversion Rate"
							dataArr={dailyNumData[3]}
							icon={<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" viewBox="0 0 256 256"><path d="M224,64V208H32V48H208A16,16,0,0,1,224,64Z" opacity="0.2"></path><path d="M232,208a8,8,0,0,1-8,8H32a8,8,0,0,1-8-8V48a8,8,0,0,1,16,0v94.37L90.73,98a8,8,0,0,1,10.07-.38l58.81,44.11L218.73,90a8,8,0,1,1,10.54,12l-64,56a8,8,0,0,1-10.07.38L96.39,114.29,40,163.63V200H224A8,8,0,0,1,232,208Z"></path></svg>}
							amount={
								dailyNumData && dailyNumData[0]?.todaysEarnings
									? dailyNumData[0]?.todaysEarnings
									: ""
							}
						/>
					</div>
				</Col>
				{/* <Col xs="12" sm="6" md="6" xl="6">
					<div className="earnings-card">
						<CardDetail
							id="3"
							title="Stayovers"
							dataArr={dailyNumData[2]}
							icon={<UserCheck size={25} />}
							amount={
								cardData && cardData[0]?.stayovers ? cardData[0]?.stayovers : ""
							}
						/>
					</div>
				</Col> */}
			</Row>
			
			<Modal className="NewRemainingcount-modal" isOpen={isNewModalOpen} toggle={toggleNewModal}>
				<ModalHeader className='bg-transparent border-bottom' toggle={() => setIsNewModalOpen(!isNewModalOpen)}>
					<div className="BookingsDetails">
					<p>All Bookings Details</p>

					<div className='ms-auto mr-0' style={{ minWidth: 200 }}>
						{/* <Label className='form-check-label'>Filter</Label> */}
						<Select
							className='react-select'
							classNamePrefix='select'
							placeholder="Filter"
							options={dataFilterOption}
						/>
					</div>
					</div>
				</ModalHeader>
				<ModalBody>
					<DataTable
						noHeader
						columns={remainingColumns}
						paginationPerPage={7}
						className="react-dataTable"
						sortIcon={<ChevronDown size={10} />}
						data={remaining}
					/>
				</ModalBody>
				<div style={{ paddingRight: "9px" }} className='my-50 d-flex justify-content-end'>
					<Button color='primary' onClick={e => { setIsNewModalOpen(!isNewModalOpen) }}>Close</Button>
				</div>

			</Modal>

			
			<HotelSelectModal
				open1={hotelSelectOpen}
				handleOpen1={handleHotelSelectOpen} />
			{open && <BookingModal open={open} handleOpen={handleOpen} bookingID={sel_bookingID} bookingStatus={bookingStatus} />}
			{onHoldOpen && <OnHoldQuickBookingModal open={onHoldOpen} handleOnHoldOpen={handleOnHoldOpne} bookingID={sel_bookingID} />}
		</div>

	);
};

export default DashBoard;
