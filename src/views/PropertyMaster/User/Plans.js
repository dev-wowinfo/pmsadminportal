import React, { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import { ChevronDown, Edit, Trash, Users } from "react-feather";
import { AiOutlinePlusSquare } from "react-icons/ai";
import { FaArchive } from "react-icons/fa";
import {
	Button,
	Card,
	CardBody,
	CardText,
	Input,
	CardTitle,
	Col,
	Label,
	Modal,
	ModalBody,
	ModalHeader,
	Row,
	Form,
	CardHeader,
	Badge,
} from "reactstrap";
import Select from "react-select";
import { selectThemeColors } from "@utils";
import toast from "react-hot-toast";
import AccountSetupModal from "../AccountSetup/AccountSetupModal";
import axios from "../../../API/axios";
import { useSelector } from "react-redux";
import {
	cipherPasswordFunc,
	usersRoleDataApi,
} from "../../../common/commonMethods";

const userRoles = [
	{ value: "Admin", label: "Admin" },
	{ value: "Basic", label: "Basic" },
];

// const usersType = [
//     // { value: 'Employee1', label: 'Employee1' },
//     // { value: 'Employee2', label: 'Employee2' },
//     // { value: 'Employee3', label: 'Employee3' },
//     // { value: 'Employee4', label: 'Employee4' }
// ]

// let dat
// axios.get('https://jsonplaceholder.typicode.com/users').then(response => {
//     data = response.data
// })

const Plans = () => {
	useEffect(() => {
		const prevTitle = document.title;
		document.title = "PMS-Plans";

		return () => {
			document.title = prevTitle;
		};
	}, []);

	const statusOptions = [
		{ value: "Active", label: "Active" },
		{ value: "Inactive", label: "Inactive" },
	];

	const [open, setOpen] = useState(false);
	const [usersType, setUsersType] = useState([]);
	console.log("usersTypeCheck", usersType);
	const getUserData = useSelector((state) => state.userManageSlice.userData);
	const { LoginID, Token } = getUserData;
	// console.log('getUserData', getUserData)

	const [show, setShow] = useState(false);
	const handleModal = () => setShow(!show);

	const getAccountUserList = useSelector(
		(state) => state.userManageSlice.userLists,
	);

	const [showEdit, setShowEdit] = useState(false);
	const handleEditModal = () => setShowEdit(!showEdit);

	const [selected_user, setSelected_user] = useState();

	const [del, setDel] = useState(false);

	const [users, setUsers] = useState([]);

	let URLs = [
		"/authentication/userauthentication/loginauthentication",
		"/getdata/userdata/userdetails",
	];

	useEffect(() => {
		// get users from api       let obj = {
		fetchPromise(URLs);

		// Promise.all([ axios.get('https://jsonplaceholder.typicode.com/todos'), axios.get('https://jsonplaceholder.typicode.com/users')]).the(res=>console.log(res))
	}, []);

	const fetchPromise = async (URLs) => {
		const userResponse = await getAllData(URLs);
		console.log("userResponse", userResponse);
		if (userResponse[0].success && userResponse[0]?.data[0]?.length > 0) {
			let arr = [];

			userResponse[0]?.data[0]?.map((v, i) => {
				arr.push({
					id: i + 1,
					loginId: v.loginID,
					userId: v.userID,
					user: v.firstName + " " + v.lastName,
					roleType: v.userRoleType,
					userRole: v.userRole,
					userName: v.username,
					email: v.email,
					Status: v.status,
				});
				setUsers(arr);
			});
			console.log("setUsers", arr);
		}
		if (userResponse[1].success && userResponse[1]?.data[0]?.length > 0) {
			console.log("userTypeData11", userResponse[1]?.data[0]);
			let arr = [];

			userResponse[1]?.data[0]?.map((v) => {
				arr.push({
					value: v.userID,
					label: v.firstName + " " + v.lastName + " (" + v.email + ")",
					roleType: v.accountTYpe,
					Status: v.status,
				});
				setUsersType(arr);
			});
			console.log("UsersType", arr);
		}
	};

	const getAllData = (URLs) => {
		return Promise.all(URLs.map(fetchData));
	};

	const fetchData = (URL) => {
		let obj = {
			LoginID,
			Token,
			Seckey: "abc",
			Event: "select",
		};
		return axios
			.post(URL, obj)
			.then((response) => {
				console.log("response", response);
				return {
					success: true,
					data: response.data,
				};
			})
			.catch(function (error) {
				return { success: false };
			});
	};

	useEffect(() => {
		fetchPromise(URLs);
	}, [show, showEdit, del]);

	const NewUserModal = () => {
		const [user, setUser] = useState("");
		const [userId, setUserId] = useState("");
		const [userRole, setUserRole] = useState("");
		const [roleType, setRoleType] = useState("");
		const [userName, setUserName] = useState("");
		const [password, setPassword] = useState("");
		const [email, setEmail] = useState("");

		const [display, setDisplay] = useState(false);

		const userObj = {
			id: Math.floor(Math.random() * 100),
			user,
			userId,
			userRole,
			roleType,
			userName,
			password,
			email,
		};
		console.log("getAccountUserList", getAccountUserList);
		const handleSubmit = async () => {
			setDisplay(true);
			if (user && userRole && userName && password !== "") {
				console.log("userRole: ", user.split(" "));
				let cipherPassword = cipherPasswordFunc(password);
				let obj = {
					Username: userName,
					Password: password,
					Event: "insert",
					LoginID: getUserData.LoginID,
					UserID: userId, //getAccountUserList.data[0].find(i=>i.Email == user.split(" ")[3]).UserID,
					//"UserRoleID": "URO001",
					UserRole: userRole,
					Token: getUserData.Token,
				};
				console.log("user obj", obj);
				// usersRoleDataApi()

				const loginnResponse = await axios
					.post("/authentication/userauthentication/loginauthentication", obj)
					.then((response) => {
						console.log("res", response);
						if (response.status === 200) {
							setUsers([...users, userObj]);
							// handleModal()
							toast.success("User Added Successfully!", {
								position: "top-center",
							});
						}
					})
					.catch(function (error) {
						console.log(
							"User Login Error=====",
							error?.response?.data?.Message,
						);
						toast.error(error?.response?.data?.Message);
					});
			}
			fetchPromise(URLs);
			// else {
			//     toast.error('Fill All Fields!', {
			//         position: "top-center",
			//         style: {
			//             minWidth: '250px'
			//         },
			//         duration: 3000
			//     })
			// }
		};

		return (
			<>
				<Modal
					isOpen={show}
					toggle={handleModal}
					className="modal-dialog-centered modal-lg"
					backdrop={false}
				>
					<ModalHeader className="bg-transparent" toggle={handleModal}>
						<span className=" mb-1">Add Plan</span>
					</ModalHeader>
					<ModalBody className="px-sm-2 mx-50 pb-5">
						<>
							<Form>
								<Row>
									<Col lg='6' className='mb-1'>
										<Label className='form-label' for='countries'><span className='text-danger'>*</span>Plan Name</Label>
										<Select
											theme={selectThemeColors}
											className='react-select'
											classNamePrefix='select'
											placeholder="Select Category"
										//   options={countryList}
										//   onChange={e => {
										//     setCountryId(e.value)
										//     setCountryCode(e.CountryCode)
										//     setCountry(e.label)
										//   }}
										// invalid={display && country === ''}
										/>
										{display && !country ? <span className='error_msg_lbl'>Enter Plan </span> : null}
									</Col>
									<Col lg='6' className='mb-1'>
										<Label className='form-label' for='hotel'><span className='text-danger'>*</span>Product Name</Label>
										<Input
											type='text'
											name='hotel'
											id='hotel'
											// value={hotelName}
											// onChange={e => setHotelName(e.target.value)}
											invalid={display && hotelName === ''}
										/>
										{display && !hotelName ? <span className='error_msg_lbl'>Enter Product Name </span> : null}
									</Col>
									<Col lg='6' className='mb-1'>
										<Label className='form-label' for='countries'><span className='text-danger'>*</span>Price</Label>
										<Select
											theme={selectThemeColors}
											className='react-select'
											classNamePrefix='select'
											placeholder="Select Category"
										//   options={countryList}
										//   onChange={e => {
										//     setCountryId(e.value)
										//     setCountryCode(e.CountryCode)
										//     setCountry(e.label)
										//   }}
										// invalid={display && country === ''}
										/>
										{display && !country ? <span className='error_msg_lbl'>Enter Plan </span> : null}
									</Col>
									<Col lg='6' className='mb-1'>
										<Label className='form-label' for='countries'><span className='text-danger'>*</span>Billing Cycle</Label>
										<Select
											theme={selectThemeColors}
											className='react-select'
											classNamePrefix='select'
											placeholder="Select Category"
										//   options={countryList}
										//   onChange={e => {
										//     setCountryId(e.value)
										//     setCountryCode(e.CountryCode)
										//     setCountry(e.label)
										//   }}
										// invalid={display && country === ''}
										/>
										{display && !country ? <span className='error_msg_lbl'>Enter Plan </span> : null}
									</Col>
									<Col lg='6' className='mb-1'>
										<Label className='form-label' for='countries'><span className='text-danger'>*</span>Currency</Label>
										<Select
											theme={selectThemeColors}
											className='react-select'
											classNamePrefix='select'
											placeholder="Select Category"
										//   options={countryList}
										//   onChange={e => {
										//     setCountryId(e.value)
										//     setCountryCode(e.CountryCode)
										//     setCountry(e.label)
										//   }}
										// invalid={display && country === ''}
										/>
										{display && !country ? <span className='error_msg_lbl'>Enter Plan </span> : null}
									</Col>
									<Col lg='6' className='mb-1'>
										<Label className='form-label' for='countries'><span className='text-danger'>*</span>Duration</Label>
										<Select
											theme={selectThemeColors}
											className='react-select'
											classNamePrefix='select'
											placeholder="Select Category"
										//   options={countryList}
										//   onChange={e => {
										//     setCountryId(e.value)
										//     setCountryCode(e.CountryCode)
										//     setCountry(e.label)
										//   }}
										// invalid={display && country === ''}
										/>
										{display && !country ? <span className='error_msg_lbl'>Enter Plan </span> : null}
									</Col>
								</Row>
								<Row>
									<Col lg="12" className="mb-1">
										<Label className="form-label" for="userName">
											<span className="text-danger">*</span>Description
										</Label>
										<Input
											type="text"
											name="userName"
											id="userName"
											value={userName}
											onChange={(e) => setUserName(e.target.value)}
											invalid={display ? userName === "" : false}
										/>
										{display === true && !userName ? (
											<span className="error_msg_lbl">Enter User Id </span>
										) : (
											<></>
										)}
									</Col>

								</Row>
							</Form>

							<Row tag="form" className="gy-1 gx-2 mt-75">
								<Col className="text-lg-end text-md-center mt-1" xs={12}>
									<Button
										className="me-1"
										color="primary"
										onClick={handleSubmit}
									>
										Add Plan
									</Button>
									<Button
										color="secondary"
										outline
										onClick={() => {
											setShow(false);
										}}
									>
										Cancel
									</Button>
								</Col>
							</Row>
						</>
					</ModalBody>
				</Modal>
				{show ? <div className="modal-backdrop fade show"></div> : null}
			</>
		);
	};

	const EditUserModal = ({ id }) => {
		const userData = users.filter((user) => user.id === id);
		const [display, setDisplay] = useState(false);

		const [editUser, setEditUser] = useState(userData[0]?.userId);
		const [editUserRole, setEditUserRole] = useState(userData[0]?.userRole);
		const [edituserName, setEditUserName] = useState(userData[0]?.userName);
		const [editPassword, setEditPassword] = useState(userData[0]?.password);
		const [editStatus, setEditStatus] = useState(userData[0]?.Status);
		console.log("userData_pass", userData[0]?.password);

		const [editDisplay, setEditDisplay] = useState(false);

		const editHandleSubmit = () => {
			setEditDisplay(true);
			if (editUser && editUserRole && edituserName && editPassword !== "") {
				let cipherPassword = cipherPasswordFunc(editPassword);
				users.map((user) => {
					if (user.id === id) {
						user.userId = editUser;
						user.userRole = editUserRole;
						user.userName = edituserName;
						user.password = editPassword === null ? undefined : editPassword;
						user.Status = editStatus;
					}
				});
				const edited_user_body = users.filter((c) => c.id === id);
				console.log("edited_user_body", edited_user_body);

				let edit_obj = {
					LoginID: getUserData.LoginID,
					Token: "123",
					Seckey: "abc",
					Event: "update",
					Username: edited_user_body[0].userName,
					Password:
						edited_user_body[0].password === undefined
							? null
							: edited_user_body[0].password,
					UserRole: edited_user_body[0].userRole,
					UserLoginID: edited_user_body[0].loginId,
					UserRoleType: edited_user_body[0].roleType,
					Status: edited_user_body[0].Status,
				};
				console.log("edit_obj", edit_obj);
				try {
					axios
						.post(
							"/authentication/userauthentication/loginauthentication",
							edit_obj,
						)
						.then((res) => {
							console.log("res", res);
							toast.success("User Edited Succesfully!", {
								position: "top-center",
							});
							// getAllData()
						});
				} catch (error) {
					console.log("error", error);
					toast.error(error);
				}
				handleEditModal();
			}
			// else {
			//     toast.error('Fill All Fields!', {
			//         position: "top-center",
			//         style: {
			//             minWidth: '250px'
			//         },
			//         duration: 3000
			//     })
			// }
		};

		return (
			<>
				<Modal
					isOpen={showEdit}
					toggle={handleEditModal}
					className="modal-dialog-centered modal-lg"
					backdrop={false}
				>
					<ModalHeader className="bg-transparent" toggle={handleEditModal}>
						<span className=" mb-1">Update Plan</span>
					</ModalHeader>
					<ModalBody className="px-sm-2 mx-50 pb-5">
						<>
							<Form>
								<Row>
									<Col lg='6' className='mb-1'>
										<Label className='form-label' for='countries'><span className='text-danger'>*</span>Plan Name</Label>
										<Select
											theme={selectThemeColors}
											className='react-select'
											classNamePrefix='select'
											placeholder="Select Category"
										//   options={countryList}
										//   onChange={e => {
										//     setCountryId(e.value)
										//     setCountryCode(e.CountryCode)
										//     setCountry(e.label)
										//   }}
										// invalid={display && country === ''}
										/>
										{/* {display && !country ? <span className='error_msg_lbl'>Enter Plan </span> : null} */}
									</Col>
									<Col lg='6' className='mb-1'>
										<Label className='form-label' for='hotel'><span className='text-danger'>*</span>Product Name</Label>
										<Input
											type='text'
											name='hotel'
											id='hotel'
											// value={hotelName}
											// onChange={e => setHotelName(e.target.value)}
											invalid={display && hotelName === ''}
										/>
										{/* {display && !hotelName ? <span className='error_msg_lbl'>Enter Product Name </span> : null} */}
									</Col>
									<Col lg='6' className='mb-1'>
										<Label className='form-label' for='countries'><span className='text-danger'>*</span>Price</Label>
										<Select
											theme={selectThemeColors}
											className='react-select'
											classNamePrefix='select'
											placeholder="Select Category"
										//   options={countryList}
										//   onChange={e => {
										//     setCountryId(e.value)
										//     setCountryCode(e.CountryCode)
										//     setCountry(e.label)
										//   }}
										// invalid={display && country === ''}
										/>
										{/* {display && !country ? <span className='error_msg_lbl'>Enter Plan </span> : null} */}
									</Col>
									<Col lg='6' className='mb-1'>
										<Label className='form-label' for='countries'><span className='text-danger'>*</span>Billing Cycle</Label>
										<Select
											theme={selectThemeColors}
											className='react-select'
											classNamePrefix='select'
											placeholder="Select Category"
										//   options={countryList}
										//   onChange={e => {
										//     setCountryId(e.value)
										//     setCountryCode(e.CountryCode)
										//     setCountry(e.label)
										//   }}
										// invalid={display && country === ''}
										/>
										{/* {display && !country ? <span className='error_msg_lbl'>Enter Plan </span> : null} */}
									</Col>
									<Col lg='6' className='mb-1'>
										<Label className='form-label' for='countries'><span className='text-danger'>*</span>Currency</Label>
										<Select
											theme={selectThemeColors}
											className='react-select'
											classNamePrefix='select'
											placeholder="Select Category"
										//   options={countryList}
										//   onChange={e => {
										//     setCountryId(e.value)
										//     setCountryCode(e.CountryCode)
										//     setCountry(e.label)
										//   }}
										// invalid={display && country === ''}
										/>
										{/* {display && !country ? <span className='error_msg_lbl'>Enter Plan </span> : null} */}
									</Col>
									<Col lg='6' className='mb-1'>
										<Label className='form-label' for='countries'><span className='text-danger'>*</span>Duration</Label>
										<Select
											theme={selectThemeColors}
											className='react-select'
											classNamePrefix='select'
											placeholder="Select Category"
										//   options={countryList}
										//   onChange={e => {
										//     setCountryId(e.value)
										//     setCountryCode(e.CountryCode)
										//     setCountry(e.label)
										//   }}
										// invalid={display && country === ''}
										/>
										{/* {display && !country ? <span className='error_msg_lbl'>Enter Plan </span> : null} */}
									</Col>
								</Row>
								<Row>
									<Col lg="12" className="mb-1">
										<Label className="form-label" for="userName">
											<span className="text-danger">*</span>Description
										</Label>
										<Input
											type="text"
											name="userName"
											id="userName"
											// value={userName}
											// onChange={(e) => setUserName(e.target.value)}
											// invalid={display ? userName === "" : false}
										/>
										{/* {display === true && !userName ? (
											<span className="error_msg_lbl">Enter User Id </span>
										) : (
											<></>
										)} */}
									</Col>

								</Row>
							</Form>

							<Row tag="form" className="gy-1 gx-2 mt-75">
								<Col className="text-lg-end text-md-center mt-1" xs={12}>
									<Button
										className="me-1"
										color="primary"
										onClick={editHandleSubmit}
									>
										Submit
									</Button>
									<Button color="secondary" outline onClick={handleEditModal}>
										Cancel
									</Button>
								</Col>
							</Row>
						</>
					</ModalBody>
				</Modal>
				{showEdit ? <div className="modal-backdrop fade show"></div> : null}
			</>
		);
	};

	const DeleteUserModal = ({ id }) => {
		const data = users.filter((user) => user.id === id);

		console.log("data", data);

		const handleDeleteUser = async () => {
			let obj = {
				// LoginID: getUserData.LoginID,
				LoginID,
				Token,
				Seckey: "abc",
				DeleteLoginID: data[0].loginId,
				Event: "delete",
			};
			const deleteUserResponse = await axios.post(
				"/authentication/userauthentication/loginauthentication",
				obj,
			);
			console.log("deleteUserResponse", deleteUserResponse);
			if (deleteUserResponse.data[0][0].status == "Success") {
				toast.success(deleteUserResponse.data[0][0].message);
				setUsers(users.filter((user) => user.id !== id));
				setDel(!del);
			}
		};

		return (
			<>
				<Modal
					isOpen={del}
					toggle={() => setDel(!del)}
					className="modal-dialog-centered"
					backdrop={false}
				>
					<ModalHeader className="bg-transparent" toggle={() => setDel(!del)}>
						Are you sure to delete {data[0]?.employee} permanently?
					</ModalHeader>
					<ModalBody>
						<Row className="text-center">
							<Col xs={12}>
								<Button
									color="danger"
									className="m-1"
									onClick={handleDeleteUser}
								>
									Delete
								</Button>
								<Button
									className="m-1"
									color="secondary"
									outline
									onClick={() => setDel(!del)}
								>
									Cancel
								</Button>
							</Col>
						</Row>
					</ModalBody>
				</Modal>
				{del ? <div className="modal-backdrop fade show"></div> : null}
			</>
		);
	};

	console.log("usersType", usersType);

	const [query, setQuery] = useState("");
	const search = (data) => {
		return data.filter(
			(item) =>
				item.user.toLowerCase().includes(query.toLowerCase()) ||
				item.roleType.toLowerCase().includes(query.toLowerCase()) ||
				item.userRole.toLowerCase().includes(query.toLowerCase()) ||
				item.userName.toLowerCase().includes(query.toLowerCase()),
		);
	};

	const userTable = [
		{
			name: "#",
			width: "100px",
			sortable: true,
			selector: (row) => row.id,
		},
		{
			name: "Users",
			sortable: true,
			selector: (row) => row.user,
			cell: (row) => (
				<>
					<div className="wrap-text">{row.user + " (" + row.email + ")"}</div>
				</>
			),
		},
		{
			name: "Department",
			sortable: true,
			selector: (row) => row.roleType,
		},
		{
			name: "User Roles",
			sortable: true,
			selector: (row) => row.userRole,
		},
		{
			name: "Username",
			selector: (row) => row.userName,
		},
		{
			name: "Status",
			sortable: true,
			selector: (row) => row.Status,
			cell: (row) => {
				return (
					<>
						{row.Status === "Active" ? (
							<Badge color="light-success"> {row.Status}</Badge>
						) : (
							<Badge color="light-danger"> {row.Status}</Badge>
						)}
					</>
				);
			},
		},
		{
			name: "Action",
			sortable: true,
			center: true,
			selector: (row) => (
				<>
					<Col>
						<Edit
							className="me-50 pe-auto"
							onClick={() => {
								setShowEdit(true);
								setSelected_user(row.id);
							}}
							size={15}
						/>
						<Trash
							className="me-50"
							size={15}
							onClick={() => {
								setDel(true);
								setSelected_user(row.id);
							}}
						/>
					</Col>
					{/* <EditUserModal id={selected_user} />
                    <DeleteUserModal id={selected_user} /> */}
				</>
			),
		},
	];

	return (
		<>
			<Card>
				<CardHeader>
					<CardTitle><h2>Subscription Plan</h2></CardTitle>

					<Button color="primary" onClick={() => setShow(true)}>
						Add Plan
					</Button>
				</CardHeader>

			</Card>

			<div className="d-flex justify-content-evenly align-items-stretch">
				<Card className="plan-card"
					style={{ width: "24rem", paddingTop: "20px", marginRight: "5px" }}
				>
					<div className="p-1">
						<div className="d-flex justify-content-between">
							<div className="mb-3">
								<h2>Starter</h2>
								{/* <p className="mb-2 text-dark">
									Perfect for small hotels getting started
								</p> */}
							</div>
							<div>
								<span className="border rounded bg-primary text-light px-1" style={{ paddingTop: "2px", paddingBottom: "2px" }}>
									Active
								</span>
							</div>
						</div>
						<div>
							<p className="fs-1 fw-bolder">$99.00</p>
							<p>per month</p>
						</div>
						<div className="pt-2 border-top">
							<div class="d-flex justify-content-between mb-1">
								<span>Duration</span>
								<span>30 Days</span>
							</div>
							<div className="d-flex justify-content-between mb-1">
								<span>Product </span>
								<span>PMS</span>
							</div>
							<div className="d-flex justify-content-between mb-1">
								<span>Description </span>
								<span>Basic plan for small hotels</span>
							</div>
						</div>
						<div className="pt-2 border-top mb-2" style={{ minHeight: "140px" }}>
							<h4 className="fs-5 fw-bolder">Included Modules</h4>
							<div className="d-flex gap-1">
								<span className="px-1 border rounded">Front Office</span>
								<span className="px-1 border rounded">Housekeeping</span>
							</div>
						</div>

						<div className="d-flex justify-content-between plan-actions">
							<Button color="primary" onClick={() => handleEditModal("starter")}>
								<svg
									xmlns="http://www.w3.org/2000/svg"
									width="16"
									height="16"
									fill="currentColor"
									className="bi bi-pencil-square me-1"
									viewBox="0 0 16 16"
								>
									<path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456l-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z" />
									<path
										fill-rule="evenodd"
										d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5v11z"
									/>
								</svg>
								Edit
							</Button>
							<Button color="primary">
								<svg
									xmlns="http://www.w3.org/2000/svg"
									width="16"
									height="16"
									fill="currentColor"
									viewBox="0 0 256 256"
									class="me-1"
								>
									<path d="M216,32H88a8,8,0,0,0-8,8V80H40a8,8,0,0,0-8,8V216a8,8,0,0,0,8,8H168a8,8,0,0,0,8-8V176h40a8,8,0,0,0,8-8V40A8,8,0,0,0,216,32ZM160,208H48V96H160Zm48-48H176V88a8,8,0,0,0-8-8H96V48H208Z"></path>
								</svg>
								Clone
							</Button>
							<Button color="primary">
								<FaArchive />
							</Button>
						</div>
					</div>
				</Card>
				<Card className="plan-card"
					style={{ width: "24rem", paddingTop: "20px", marginRight: "5px" }}
				>
					<div className="p-1">
						<div className="d-flex justify-content-between">
							<div className="mb-3">
								<h2>Professional</h2>
								{/* <p className="mb-2 text-dark">
									Comprehensive solution for growing properties
								</p> */}
							</div>
							<div>
								<span className="border rounded bg-primary text-light px-1" style={{ paddingTop: "2px", paddingBottom: "2px" }}>
									Active
								</span>
							</div>
						</div>
						<div>
							<p className="fs-1 fw-bolder">$299.00</p>
							<p>per month</p>
						</div>
						<div className="pt-2 border-top">
							<div className="d-flex justify-content-between mb-1">
								<span>Max Rooms</span>
								<span>100</span>
							</div>
							<div className="d-flex justify-content-between mb-1">
								<span>Max Users</span>
								<span>15</span>
							</div>
							<div className="d-flex justify-content-between mb-1">
								<span>Auto Renew</span>
								<span>Yes</span>
							</div>
						</div>
						<div className="pt-2 border-top mb-2" style={{ minHeight: "140px" }}>
							<h4 className="fs-5 fw-bolder">Included Modules</h4>
							<div className="d-flex gap-1 flex-wrap">
								<span className="px-1 border rounded">Front Office</span>
								<span className="px-1 border rounded">Housekeeping</span>
								<span className="px-1 border rounded">Pos</span>
								<span className="px-1 border rounded">Reports</span>
							</div>
						</div>
						<div className="d-flex justify-content-between plan-actions">
							<Button
								color="primary"
								onClick={() => handleEdit("professional")}
							>
								<svg
									xmlns="http://www.w3.org/2000/svg"
									width="16"
									height="16"
									fill="currentColor"
									className="bi bi-pencil-square me-1"
									viewBox="0 0 16 16"
								>
									<path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456l-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z" />
									<path
										fill-rule="evenodd"
										d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5v11z"
									/>
								</svg>
								Edit
							</Button>
							<Button color="primary">
								<svg
									xmlns="http://www.w3.org/2000/svg"
									width="16"
									height="16"
									fill="currentColor"
									viewBox="0 0 256 256"
									class="me-1"
								>
									<path d="M216,32H88a8,8,0,0,0-8,8V80H40a8,8,0,0,0-8,8V216a8,8,0,0,0,8,8H168a8,8,0,0,0,8-8V176h40a8,8,0,0,0,8-8V40A8,8,0,0,0,216,32ZM160,208H48V96H160Zm48-48H176V88a8,8,0,0,0-8-8H96V48H208Z"></path>
								</svg>
								Clone
							</Button>
							<Button color="primary">
								<FaArchive />
							</Button>
						</div>
					</div>
				</Card>
				<Card className="plan-card" style={{ width: "24rem", paddingTop: "20px" }}>
					<div className="p-1">
						<div className="d-flex justify-content-between">
							<div className="mb-3">
								<h2>Enterprise</h2>
								{/* <p className="mb-2 text-dark">
									Perfect for small hotels getting started
								</p> */}
							</div>
							<div>
								<span className="border rounded bg-primary text-light px-1" style={{ paddingTop: "2px", paddingBottom: "2px" }}>
									Active
								</span>
							</div>
						</div>
						<div>
							<p className="fs-1 fw-bolder">$2,999.00</p>
							<p>per 365 days</p>
						</div>
						<div className="pt-2 border-top mb-1">
							<div className="d-flex justify-content-between mb-1">
								<span>Max Rooms</span>
								<span>500</span>
							</div>
							<div className="d-flex justify-content-between mb-1">
								<span>Max Users</span>
								<span>50</span>
							</div>
							<div className="d-flex justify-content-between mb-1">
								<span>Auto Renew</span>
								<span>Yes</span>
							</div>
						</div>
						<div className="pt-2 border-top mb-2" style={{ minHeight: "140px" }}>
							<h4 className="fs-5 fw-bolder">Included Modules</h4>
							<div className="d-flex gap-1 flex-wrap">
								<span className="px-1 border rounded">Front Office</span>
								<span className="px-1 border rounded">Housekeeping</span>
								<span className="px-1 border rounded">Pos</span>
								<span className="px-1 border rounded">Reports</span>
								<span className="px-1 border rounded">Accounting</span>
								<span className="px-1 border rounded">Integrations</span>
							</div>
						</div>

						<div className="d-flex justify-content-between plan-actions">
							<Button color="primary" onClick={() => handleEdit("enterprise")}>
								<svg
									xmlns="http://www.w3.org/2000/svg"
									width="16"
									height="16"
									fill="currentColor"
									className="bi bi-pencil-square me-1"
									viewBox="0 0 16 16"
								>
									<path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456l-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z" />
									<path
										fill-rule="evenodd"
										d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5v11z"
									/>
								</svg>
								Edit
							</Button>
							<Button color="primary">
								<svg
									xmlns="http://www.w3.org/2000/svg"
									width="16"
									height="16"
									fill="currentColor"
									viewBox="0 0 256 256"
									class="me-1"
								>
									<path d="M216,32H88a8,8,0,0,0-8,8V80H40a8,8,0,0,0-8,8V216a8,8,0,0,0,8,8H168a8,8,0,0,0,8-8V176h40a8,8,0,0,0,8-8V40A8,8,0,0,0,216,32ZM160,208H48V96H160Zm48-48H176V88a8,8,0,0,0-8-8H96V48H208Z"></path>
								</svg>
								Clone
							</Button>
							<Button color="primary">
								<FaArchive />
							</Button>
						</div>
					</div>
				</Card>
			</div>

			<NewUserModal />
			<EditUserModal id={selected_user} />
			<DeleteUserModal id={selected_user} />
		</>
	);
};

export default Plans;
