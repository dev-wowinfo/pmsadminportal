// ** React Imports
import { Link } from "react-router-dom"

// ** Custom Components
import Avatar from "@components/avatar"
import Select from 'react-select'
import { selectThemeColors } from '@utils'
// ** Third Party Components
import {
    User,
    Mail,
    CheckSquare,
    MessageSquare,
    Settings,
    CreditCard,
    HelpCircle,
    Power,
    Lock
} from "react-feather"


import Flatpickr from 'react-flatpickr'
// ** Reactstrap Imports
import {
    UncontrolledDropdown,
    DropdownMenu,
    DropdownToggle,
    DropdownItem,
    Modal,
    ModalHeader,
    ModalBody,
    Row,
    Col,
    Label,
    Input,
    InputGroup,
    Button
} from "reactstrap"

// ** Default Avatar Image
import defaultAvatar from "@src/assets/images/portrait/small/user.png"
import { useDispatch, useSelector } from "react-redux"
import { userDataStorage } from "../../../../../redux/usermanageReducer"
import axios from "../../../../../API/axios"
import toast from "react-hot-toast"
import { useEffect, useState } from "react"
import moment from "moment"

const VerticalMenuFooter = (props) => {
    const getUserData = useSelector(state => state.userManageSlice.userData)
    const dispatch = useDispatch()
    // ** Props
    const {
        menuCollapsed
    } = props



    const logoutHandle = () => {

        let body = {
            "LoginID": getUserData.LoginID,
            "Token": getUserData.Token,
            "Seckey": "abc",
            "Event": "invalidate",
            "Password" : "",
            "Username" : ""
        }
        console.log(body)
        axios.post("/authentication/userauthentication/tokenauthentication", body)

        localStorage.clear();
        sessionStorage.clear()
        dispatch(userDataStorage())
    }


    const titleOptions = [
        { value: 'Mr.', label: 'Mr.' },
        { value: 'Ms.', label: 'Ms.' },
        { value: 'Mrs.', label: 'Mrs.' }
    ]
    const accountTypes = [
        { value: 'HouseKeeping', label: 'HouseKeeping' },
        { value: 'Food & Beverage', label: 'Food & Beverage' },
        { value: 'Front Office', label: 'Front Office' },
        { value: 'Kitchen Service', label: 'Kitchen Service' },
        { value: 'Accounts', label: 'Accounts' },
        { value: 'Purchase', label: 'Purchase' },
        { value: 'Sales & Marketing', label: 'Sales & Marketing' },
        { value: 'Vendor', label: 'Vendor' },
        { value: 'Debtor Account', label: 'Debtor Account' },
        { value: 'Travel Agent', label: 'Travel Agent' },
        // { value: '11',label:'Laundry'}
    ]

    const genderOptions = [
        { value: 'Male', label: 'Male' },
        { value: 'Female', label: 'Female' }
    ]

    const statusOptions = [{ value: 'Active', label: 'Active' }, { value: 'Inactive', label: 'Inactive' }]

    const [selected_account, setSelected_account] = useState()
    const [showEdit, setShowEdit] = useState(false)
    const handleEditModal = () => setShowEdit(!showEdit)
    const [accounts, setAccounts] = useState([])
    const [flag, setFlag] = useState(false)
    const handleFlag = () => setFlag(!flag)
    const { LoginID, Token } = getUserData

    console.log("userRedux: ", getUserData)

    const fetchAccountDetails = async () => {
        // const { LoginID, Token } = getUserData
        // let obj = {
        //     LoginID,
        //     Token,
        //     "Seckey": "abc",
        //     Event: "selectall"
        // }
        // // dispatch(storeAccountList(obj))
        // const res = await axios.get("/setting/userDetailById", {}, {
        //     params: {
        //         userId: getUserData?.UserID
        //     },
        //     headers: {
        //         LoginID,
        //         Token,
        //         "Seckey": "abc",
        //     }
        // })
        // console.log("res: ", res)
        // // console.log("getdata: ", getAccountUserList)
        // if (res?.data[0].length > 0) {
        //     let arr = [];
        //     res?.data[0].map((v, i) => {
        //         // console.log("v: ", v)
        //         arr.push({
        //             id: i + 1, ...v
        //         })
        //     })
        //     console.log("array", arr)
        //     setAccounts(arr)
        // } else {
        //     setAccounts([])
        // }

        try {
            // const res = await axios.get('/setting/userDetailById', {
            const res = await axios.get('/accountsetting/userdetailbyid', {
                headers: {
                    LoginID,
                    Token,
                    SecKey: '123'
                },
                params: {
                    userId: getUserData?.UserID
                }
            })
            console.log('res---', res)
            // setRoomAvailArr(res?.data[0])
            setAccounts(res?.data[0])
        } catch (error) {
            console.log('error', error)
        }
    }
    useEffect(() => {
        fetchAccountDetails()
    }, [])

    const EditAccountModal = ({ id }) => {

        const accountData = accounts
        console.log('accountData', accountData, accounts)

        const [editTitle, setEditTitle] = useState(accountData[0]?.title)
        const [editAccountType, setEditAccountType] = useState(accountData[0]?.accountType)
        const [editFirstName, setEditFirstName] = useState(accountData[0]?.firstName)
        const [editMidName, setEditMidName] = useState(accountData[0]?.middleName)
        const [editLastName, setEditLastName] = useState(accountData[0]?.lastName)
        const [editPrefName, setEditPrefName] = useState(accountData[0]?.preferredName)
        const [editGender, setEditGender] = useState(accountData[0]?.gender)
        const [editAadhaar, setEditAadhaar] = useState(accountData[0]?.aadharNumber)
        const [editPicker, setEditPicker] = useState(accountData[0]?.dateOfBirth)
        const [editAge, setEditAge] = useState(accountData[0]?.Age)
        const [editAddress, setEditAddress] = useState(accountData[0]?.address)
        const [editMobile, setEditMobile] = useState(accountData[0]?.phoneNumber)
        const [editEmail, setEditEmail] = useState(accountData[0]?.email)
        const [editGst, setEditGst] = useState(accountData[0]?.gst)
        const [editStatus, setEditStatus] = useState(accountData[0]?.status)
        const [editDisplay, setEditDisplay] = useState(false)

        const ageCalculator = (date) => {
            const ageDiff = Date.now() - date[0]
            const ageDate = new Date(ageDiff)
            setEditAge(Math.abs(ageDate.getUTCFullYear() - 1970))
        }

        const editHandleSubmit = async () => {
            try {
                setEditDisplay(true)
                console.log('editAccount: ', id)
                if (editAccountType && editFirstName && editGender && editAadhaar && editMobile && editEmail) {

                    let obj = {
                        LoginID,
                        Token,
                        Seckey: "abc",
                        Event: "update",
                        FirstName: editFirstName,
                        LastName: editLastName,
                        Gender: editGender.substring(0, 1),
                        Age: editAge,
                        Email: editEmail,
                        PhoneNumber: parseInt(editMobile),
                        UserID: accountData[0].UserID,
                        Title: editTitle,
                        // AccountType: accountTypes.findIndex((i => i.value === editAccountType)) + 1,
                        AccountType: editAccountType,
                        MiddleName: editMidName,
                        PreferredName: editPrefName,
                        AadharNumber: editAadhaar,
                        DateOfBirth: moment(editPicker[0]).format('yyy-MM-DD'),
                        Address: editAddress,
                        GST: editGst,
                        Status: editStatus
                    }
                    console.log('obj', obj);
                    handleEditModal()
                    // const updateResponse = await userDataApi(obj)
                    // const updateResponse = await axios.post('/setting/updateUserDetails', obj, {
                    const updateResponse = await axios.post('/accountsetting/updateuserdetails', obj, {
                        headers: {
                            LoginID,
                            Token,
                            SecKey: '123'
                        }
                    })
                    console.log('res', updateResponse)
                    if (updateResponse.data[0][0].Status === "Success") {
                        handleFlag()
                        setEditDisplay(false)
                        toast.success('Account Edited Successfully!', { position: "top-center" })
                    }
                }
            } catch (e) {
                setShowEdit(false)
                console.log(e);
                toast.error('Account Edit Failed!', { position: "top-center" })
            }
        }




        return (
            <>
                <Modal
                    isOpen={showEdit}
                    toggle={handleEditModal}
                    className='modal-dialog-centered modal-lg'
                    backdrop={false}
                >
                    <ModalHeader className='bg-transparent' toggle={handleEditModal}>
                        Edit Account Details
                    </ModalHeader>
                    <ModalBody className='px-sm-2 mx-50 pb-5'>
                        <Row>
                            <Col lg='6' className='mb-2'>
                                <Label className='form-label' for='title'>Title</Label>
                                <Select
                                    theme={selectThemeColors}
                                    className='react-select w-100'
                                    classNamePrefix='select'
                                    // defaultValue={titleOptions[0]}
                                    value={titleOptions.filter(c => c.value === editTitle)}
                                    options={titleOptions}
                                    isClearable={false}

                                    // value={editTitle}
                                    onChange={e => setEditTitle(e.value)}
                                />
                            </Col>
                            <Col lg='6' className='mb-2'>
                                <Label className='form-label' for='accountType'>
                                    <span className='text-danger'>*</span>Account Type
                                </Label>
                                {/* <Select
                                    theme={selectThemeColors}
                                    className='react-select w-100'
                                    classNamePrefix='select'
                                    value={accountTypes.filter(c => c.value === editAccountType)}
                                    options={accountTypes}
                                    isClearable={false}
                                    disabled
                                    aria-readonly
                                    //value={editAccountType}
                                    onChange={e => setEditAccountType(e.value)}
                                    invalid={editDisplay && editAccountType === ''}
                                /> */}
                                <Input type="text" value={accountData[0]?.AccountType} disabled />
                                {editDisplay && !editAccountType ? <span className='error_msg_lbl'>Enter Account Type </span> : null}
                            </Col>
                            <Col lg='6' className='mb-2'>
                                <Label className='form-label' for='firstName'>
                                    <span className='text-danger'>*</span>First Name
                                </Label>
                                <Input type='text' placeholder='Enter First Name' name='firstName' id='firstName' value={editFirstName} onChange={e => setEditFirstName(e.target.value)} invalid={editDisplay && editFirstName === ''} />
                                {editDisplay && !editFirstName ? <span className='error_msg_lbl'>Enter First Name </span> : null}
                            </Col>
                            <Col lg='6' className='mb-2'>
                                <Label className='form-label' for='midName'>Middle Name</Label>
                                <Input type='text' placeholder='Enter Middle Name' name='midName' id='midName' value={editMidName} onChange={e => setEditMidName(e.target.value)} />
                            </Col>
                            <Col lg='6' className='mb-2'>
                                <Label className='form-label' for='lastName'>Last Name</Label>
                                <Input type='text' placeholder='Enter Last Name' name='lastName' id='lastName' value={editLastName} onChange={e => setEditLastName(e.target.value)} />
                            </Col>
                            <Col lg='6' className='mb-2'>
                                <Label className='form-label' for='prefName'>Preferred Name</Label>
                                <Input type='text' placeholder='Enter Name' name='prefName' id='prefName' value={editPrefName} onChange={e => setEditPrefName(e.target.value)} />
                            </Col>
                            <Col lg='6' className='mb-2'>
                                <Label className='form-label' for='gender'>Gender<span className='text-danger'>*</span></Label>
                                <Select
                                    theme={selectThemeColors}
                                    className='react-select w-100'
                                    classNamePrefix='select'
                                    options={genderOptions}
                                    value={genderOptions.filter(c => c.value === editGender)}
                                    //value={editGender}
                                    onChange={e => setEditGender(e.value)}
                                />
                            </Col>
                            <Col lg='6' className='mb-2'>
                                <Label className='form-label' for='aadhaar'>
                                    <span className='text-danger'>*</span>Aadhaar Number
                                </Label>
                                <Input type='text' placeholder='Enter Aadhaar Num'
                                    maxLength={12}
                                    name='aadhaar' id='aadhaar' value={editAadhaar} onChange={e => setEditAadhaar(e.target.value)} invalid={editDisplay && editAadhaar === ''} />
                                {editDisplay && !editAadhaar ? <span className='error_msg_lbl'>Enter Aadhaar Number </span> : null}
                            </Col>
                            <Col lg='6' className='mb-2'>
                                <Label className='form-label'>Date of Birth</Label>
                                <InputGroup className='input-group-merge'>
                                    <Flatpickr className='form-control' value={editPicker} onChange={date => {
                                        setEditPicker(date)
                                        ageCalculator(date)
                                    }} id='startDate' />
                                </InputGroup>
                            </Col>
                            <Col lg='6' className='mb-2'>
                                <Label className='form-label' for='age'>Age</Label>
                                <Input type='text' disabled placeholder='Enter Age' name='age' id='age' value={editAge} />
                            </Col>
                            <h3>Address Details</h3>
                            <Col lg='12' className='mb-2'>
                                <Label className='form-label' for='address'>Address</Label>
                                <Input type='textarea' placeholder='Enter Address' name='address' id='address' value={editAddress} onChange={e => setEditAddress(e.target.value)} />
                            </Col>
                            <Col lg='6' className='mb-2'>
                                <Label className='form-label' for='mobile'>
                                    <span className='text-danger'>*</span>Mobile Number
                                </Label>
                                <Input type='number'
                                    maxLength={10}

                                    placeholder='Enter Mobile Num' name='mobile' id='mobile' value={editMobile} onChange={e => setEditMobile(e.target.value)} invalid={editDisplay && editMobile === ''} />
                                {editDisplay && !editMobile ? <span className='error_msg_lbl'>Enter Mobile Number </span> : null}
                            </Col>
                            <Col lg='6' className='mb-2'>
                                <Label className='form-label' for='email'>
                                    <span className='text-danger'>*</span>Email ID
                                </Label>
                                <Input type='text' placeholder='Enter Email' name='email' id='email' value={editEmail} onChange={e => setEditEmail(e.target.value)} invalid={editDisplay && editEmail === ''} />
                                {editDisplay && !editEmail ? <span className='error_msg_lbl'>Enter Email </span> : null}
                            </Col>
                            <Col lg='6' className='mb-2'>
                                <Label className='form-label' for='gst'>GST</Label>
                                <Input type='text' name='gst' id='gst' value={editGst} onChange={e => setEditGst(e.target.value)} />
                            </Col>
                            <Col lg='6' className='mb-2'>
                                <Label className='form-label'>Account Status</Label>
                                <Select
                                    theme={selectThemeColors}
                                    className='react-select w-100'
                                    classNamePrefix='select'
                                    placeholder='Select Room status'
                                    options={statusOptions}
                                    value={statusOptions?.filter(c => c.value === editStatus)}
                                    onChange={e => setEditStatus(e.value)}
                                />
                                {editDisplay && editStatus === '' && <span className='text-danger'>Account Status is required</span>}
                            </Col>
                        </Row>
                        <Row tag='form' className='gy-1 gx-2 mt-75' >
                            <Col className='text-center mt-1' xs={12}>
                                <Button className='me-1' color='primary' onClick={editHandleSubmit}>
                                    Submit
                                </Button>
                                <Button
                                    color='secondary'
                                    outline
                                    onClick={handleEditModal}
                                >
                                    Cancel
                                </Button>
                            </Col>
                        </Row>
                    </ModalBody>
                </Modal>
                {console.log('showEdit', showEdit)}
                {
                    showEdit ? (
                        <div className="modal-backdrop fade show" ></div>
                    ) : null
                }
            </>
        )

    }



    return (
        <ul className="nav navbar-nav align-items-center ms-auto mb-1">
            {
                menuCollapsed ? (
                    <UncontrolledDropdown tag="li" className="dropdown-user nav-item">
                        <DropdownToggle
                            href="/"
                            tag="a"
                            className="nav-link dropdown-user-link d-flex flex-row"
                            onClick={(e) => e.preventDefault()}
                        >
                            <Avatar
                                img={defaultAvatar}
                                imgHeight="40"
                                imgWidth="40"
                                status="online"
                            />
                        </DropdownToggle>
                        <DropdownMenu end>
                            <DropdownItem tag={Link} to="/" onClick={(e) => e.preventDefault()}>
                                <User size={14} className="me-75" />
                                <span className="align-middle">Profile</span>
                            </DropdownItem>
                            <DropdownItem tag={Link} to="/" onClick={(e) => e.preventDefault()}>
                                <Mail size={14} className="me-75" />
                                <span className="align-middle">Inbox</span>
                            </DropdownItem>
                            <DropdownItem tag={Link} to="/" onClick={(e) => e.preventDefault()}>
                                <CheckSquare size={14} className="me-75" />
                                <span className="align-middle">Tasks</span>
                            </DropdownItem>
                            <DropdownItem tag={Link} to="/" onClick={(e) => e.preventDefault()}>
                                <MessageSquare size={14} className="me-75" />
                                <span className="align-middle">Chats</span>
                            </DropdownItem>
                            <DropdownItem divider />
                            <DropdownItem
                                tag={Link}
                                to="/pages/"
                                onClick={(e) => e.preventDefault()}
                            >
                                <Settings size={14} className="me-75" />
                                <span className="align-middle">Settings</span>
                            </DropdownItem>
                            <DropdownItem tag={Link} to="/" onClick={(e) => e.preventDefault()}>
                                <CreditCard size={14} className="me-75" />
                                <span className="align-middle">Pricing</span>
                            </DropdownItem>
                            <DropdownItem tag={Link} to="/" onClick={(e) => e.preventDefault()}>
                                <HelpCircle size={14} className="me-75" />
                                <span className="align-middle">FAQ</span>
                            </DropdownItem>
                            <DropdownItem onClick={() => logoutHandle()} tag={Link} to="/login">
                                <Power size={14} className="me-75" />
                                <span className="align-middle">Logout</span>
                            </DropdownItem>
                        </DropdownMenu>
                    </UncontrolledDropdown>
                ) : (
                    <UncontrolledDropdown tag="li" className="dropdown-user nav-item">
                        {/* <DropdownToggle
                            href="/"
                            tag="a"
                            className=" dropdown-user-link d-flex flex-row"
                            onClick={(e) => e.preventDefault()}
                        >
                            <div className="mx-1 user-nav text-end d-flex flex-column">
                                <span className="user-name fw-bold text-secondary">{getUserData?.UserName}</span>
                                <span className="user-status text-secondary">{getUserData?.UserRole}</span>
                            </div>
                            <Avatar
                                img={defaultAvatar}
                                imgHeight="40"
                                imgWidth="40"
                                status="online"
                            />
                        </DropdownToggle> */}
                        <DropdownMenu end>
                            {/* <DropdownItem tag={Link} to="/" onClick={(e) => e.preventDefault()}>
                                <User size={14} className="me-75" />
                                <span className="align-middle">Profile</span>
                            </DropdownItem>
                            <DropdownItem tag={Link} to="/" onClick={(e) => e.preventDefault()}>
                                <Mail size={14} className="me-75" />
                                <span className="align-middle">Inbox</span>
                            </DropdownItem>
                            <DropdownItem tag={Link} to="/" onClick={(e) => e.preventDefault()}>
                                <CheckSquare size={14} className="me-75" />
                                <span className="align-middle">Tasks</span>
                            </DropdownItem>
                            <DropdownItem tag={Link} to="/" onClick={(e) => e.preventDefault()}>
                                <MessageSquare size={14} className="me-75" />
                                <span className="align-middle">Chats</span>
                            </DropdownItem>
                            <DropdownItem divider /> */}
                            {/* <DropdownItem tag={Link} to="/" onClick={(e) => e.preventDefault()}>
                                <CreditCard size={14} className="me-75" />
                                <span className="align-middle">Pricing</span>
                            </DropdownItem>
                            <DropdownItem tag={Link} to="/" onClick={(e) => e.preventDefault()}>
                                <HelpCircle size={14} className="me-75" />
                                <span className="align-middle">FAQ</span>
                            </DropdownItem> */}
                            <DropdownItem
                                tag={Link}
                                to="/changepassword"
                            >
                                <Lock size={14} className="me-75" />
                                <span className="align-middle">Change Password</span>
                            </DropdownItem>
                            <DropdownItem
                                tag={Link}
                                to="/manageProfile"
                            // onClick={(e) => e.preventDefault()}
                            // onClick={() => {
                            //     setShowEdit(true)
                            //     setSelected_account(getUserData?.UserID)
                            // }}
                            >
                                <User size={14} className="me-75" />
                                <span className="align-middle">Manage Profile</span>
                            </DropdownItem>
                            <DropdownItem onClick={() => logoutHandle()} tag={Link} to="/login">
                                <Power size={14} className="me-75" />
                                <span className="align-middle">Logout</span>
                            </DropdownItem>
                        </DropdownMenu>
                    </UncontrolledDropdown>
                ) 
            }
            {showEdit ? <EditAccountModal id={selected_account} /> : <></>}
        </ul>
    )
}

export default VerticalMenuFooter
