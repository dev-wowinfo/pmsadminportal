import { useState, useEffect } from "react"
import { Button, Col, Form, FormFeedback, Input, Label, Modal, ModalBody, ModalHeader, Row } from "reactstrap"
import Select from 'react-select'
import { selectThemeColors } from '@utils'
import toast from 'react-hot-toast'
import axios, { Image_base_uri } from '../../../API/axios'
import '@styles/react/libs/flatpickr/flatpickr.scss'
import { useSelector } from 'react-redux'

let currency = [
    { value: 'INR', label: 'INR' },
    { value: 'USD', label: 'USD' },
    { value: 'EUR', label: 'EUR' }
]
const NewHotelModal = ({ show, handleShowModal, getAllHotelList }) => {

    const getUserData = useSelector(state => state.userManageSlice.userData)
    const { LoginID, Token, CompanyID } = getUserData

    const [countryList, setCountryList] = useState([])
    const [stateList, setStateList] = useState([])
    const [cityList, setCityList] = useState([])
    const [countryId, setCountryId] = useState('')
    const [countryCode, setCountryCode] = useState('')
    const [stateId, setStateId] = useState('')
    const [cityId, setCityId] = useState('')

    const getCountryData = async () => {
        try {
            const countryListBody = {
                LoginID,
                Token,
                Seckey: "abc",
                Event: "select"
            }
            const res = await axios.post(`/getdata/regiondata/countrydetails`, countryListBody)
            console.log('countryres', res)
            let data = res?.data[0]
            if (data.length > 0) {
                const options = data.map(c => {
                    return { value: c.countryID, label: c.countryName, ...c }
                })
                setCountryList(options)
            }
        } catch (error) {
            console.log("Country List Error", error)
        }
    }

    const getStateData = async () => {
        try {
            const stateDetailsBody = {
                LoginID,
                Token,
                Seckey: "abc",
                CountryID: countryId,
                Event: "select"
            }
            const res = await axios.post(`/getdata/regiondata/statedetails`, stateDetailsBody)
            console.log('stateres', res)
            let data = res?.data[0]
            if (data.length > 0) {
                const options = data.map(s => {
                    return { value: s.stateID, label: s.stateName }
                })
                setStateList(options)
            }
        } catch (error) {
            console.log("State List Error", error)
        }
    }

    const getCityData = async () => {
        try {
            const cityListBody = {
                LoginID,
                Token,
                Seckey: "abc",
                DistrictID: stateId,
                StateID: stateId,
                Event: "select"
            }
            const res = await axios.post(`/getdata/regiondata/citydetails`, cityListBody)
            console.log('cityres', res)
            let data = res?.data[0]
            if (data.length > 0) {
                const options = data.map(ci => {
                    return { value: ci.cityID, label: ci.cityName }
                })
                setCityList(options)
            } else setCityList([])
        } catch (error) {
            console.log("City List Error", error)
        }
    }

    useEffect(() => {
        getCountryData()
        getStateData()
        getCityData()
    }, [countryId, stateId, cityId])

    const [hotelName, setHotelName] = useState('')
    const [address, setAddress] = useState('')
    const [noOfFloor, setNoOfFloor] = useState('')
    const [country, setCountry] = useState('')
    const [state, setState] = useState('')
    const [city, setCity] = useState('')
    const [contact, setContact] = useState('')
    const [email, setEmail] = useState('')
    const [baseCurrency, setBaseCurrency] = useState('')
    const [acc_startDate, setAcc_startDate] = useState('')
    const [acc_endDate, setAcc_endDate] = useState('')
    const [gst, setGst] = useState('')
    const [bankName, setBankName] = useState('')
    const [accountNumber, setAccountNumber] = useState('')
    const [branch, setBranch] = useState('')
    const [ifsc, setIfsc] = useState('')
    const [website, setWebsite] = useState('')
    const [logo, setLogo] = useState('')
    const [pincode, setPincode] = useState('')
    const [surname, setSurname] = useState('')
    const [personName, setPersonName] = useState('')
    const [longitude, setLongitude] = useState('')
    const [latitude, setLatitude] = useState('')
    const [licenseNumber, setLicenseNumber] = useState('')
    const [propertydescription, setPropertydescription] = useState('')
    const [display, setDisplay] = useState(false)

    const hotelObj = {
        id: Math.floor(Math.random() * 100),
        hotelName,
        address,
        noOfFloor,
        country,
        state,
        city,
        contact,
        email,
        baseCurrency,
        acc_startDate,
        acc_endDate,
        gst,
        bankName,
        accountNumber,
        branch,
        ifsc,
        website,
        logo
    }

    const handleSubmit = async () => {
        let uploadedImage
        if (logo !== '') {
            let imageformData = new FormData()
            imageformData.append('File', logo)
            imageformData.append('CompanyID', CompanyID)
            console.log('imageformData', imageformData);
            try {
                const res = await axios({
                    method: "post",
                    baseURL: `${Image_base_uri}`,
                    url: "/api/property/hotel/uploadlogo",
                    data: imageformData,
                    headers: {
                        "Content-Type": "multipart/form-data",
                        LoginID,
                        Token
                    }
                })
                console.log('res', res);
                if (res.data.FileName) {
                    // setNewPoslogo(res.data.FileName)
                    // handleRefresh()
                    // setUploadImgStatus(true)
                    uploadedImage = res.data.FileName
                }
            } catch (error) {
                console.log('error', error)
                // setUploadImgStatus(false)
                return 0
            }
        }
        console.log(uploadedImage);
        try {
            const latRegex = /^-?([1-8]?\d(\.\d+)?|90(\.0+)?)/;
            const lonRegex = /^-?((1[0-7]|[1-9])?\d(\.\d+)?|180(\.0+)?)$/;
            const phoneregex = /^\+\d{1,3}\d{9,10}$/;
            setDisplay(true)
            // console.log(CompanyID);
            if (hotelName && address && noOfFloor && country && pincode && latitude && longitude && personName && state && city && email && baseCurrency && gst && bankName && accountNumber && branch && ifsc !== '') {
                if (latRegex.test(latitude) && latitude >= -90 && latitude <= 90 && lonRegex.test(longitude) && longitude >= -180 && longitude <= 180) {
                    if (phoneregex.test(contact)) {
                        if (CompanyID !== '' && CompanyID !== 'null' && CompanyID !== null) {
                            const long = Number(longitude)
                            const lat = Number(latitude)
                            const body = {
                                "LoginID": LoginID,
                                "Token": Token,
                                "CompanyID": CompanyID
                                , "HotelName": hotelName
                                , "HotelType": "Hotel"
                                , "HotelTypeCode": "1"
                                , "PropertyDesc": propertydescription
                                , "FloorCount": noOfFloor
                                , "AddressLine": address
                                , "CityID": cityId
                                , "CityName": city
                                , "CountryCode": countryCode
                                , "CountryName": country
                                , "PostalCode": pincode
                                , "Longitude": long.toFixed(10)
                                , "Latitude": lat.toFixed(10)
                                , "TimeZone": "Asia/Kolkata"
                                , "LanguageCode": "en"
                                , "CurrencyCode": baseCurrency
                                , "PropertyLicenseNumber": licenseNumber
                                , "LogoFile": uploadedImage // need to send the file content as well
                                , "WebSIte": website
                                , "BankName": bankName
                                , "AccountNumber": accountNumber
                                , "Branch": branch
                                , "IFSC": ifsc
                                , "GSTNumber": gst
                                , "ContactPersonName": personName
                                , "Surname": surname
                                , "PhoneNumber": contact
                                , "Email": email
                                , "Seckey": "abc"
                            }
                            console.log('body', body);
                            const res = await axios.post('/property/hotel', body)
                            console.log("response: ", res.data[0])
                            if (res.data[0][0].status === "Success") {
                                handleShowModal()
                                toast.success(res.data[0][0].message, { position: "top-center" })
                                getAllHotelList()
                            }
                        } else {
                            toast.error("Company Id Cannot be null!", { position: "top-center" })
                        }
                    } else {
                        toast.error("please enter correct Phone Number with country code!", { position: "top-center" })
                    }
                } else {
                    toast.error("please enter correct Longitude and Latitude value!", { position: "top-center" })
                }
            } else {
                toast.error("please enter required fields!", { position: "top-center" })
            }
        }
        catch (e) {

            toast.error(e.response.data.message, { position: "top-center" })

            console.log(e)
            handleShowModal()
        }
    }


    return (
        <>
            <Modal
                isOpen={show}
                toggle={handleShowModal}
                className='modal-dialog-centered modal-lg'
                backdrop={false}
            >
                <ModalHeader className='bg-transparent' toggle={handleShowModal}>
                    <span className=' mb-1'>Add Product </span>
                </ModalHeader>
                <ModalBody className='px-sm-2 mx-50 pb-5'>
                    <>
                        <Form>
                            <Row>
                                <Col lg='6' className='mb-1'>
                                    <Label className='form-label' for='hotel'><span className='text-danger'>*</span>Product Name</Label>
                                    <Input
                                        type='text'
                                        name='hotel'
                                        id='hotel'
                                        value={hotelName}
                                        onChange={e => setHotelName(e.target.value)}
                                        invalid={display && hotelName === ''}
                                    />
                                    {display && !hotelName ? <span className='error_msg_lbl'>Enter Product Name </span> : null}
                                </Col>
                                <Col lg='6' className='mb-1'>
                                    <Label className='form-label' for='address'><span className='text-danger'>*</span>Product Code </Label>
                                    <Input
                                        type='text'
                                        name='address'
                                        id='address'
                                        value={address}
                                        onChange={e => setAddress(e.target.value)}
                                        invalid={display && address === ''}

                                    />
                                    {display && !address ? <span className='error_msg_lbl'>Enter client name </span> : null}
                                </Col>
                            </Row>
                            <Row>
                                
                                <Col lg='6' className='mb-1'>
                                    <Label className='form-label' for='countries'><span className='text-danger'>*</span>Product Category</Label>
                                    <Select
                                        theme={selectThemeColors}
                                        className='react-select'
                                        classNamePrefix='select'
                                        placeholder="Select Category"
                                        options={countryList}
                                        onChange={e => {
                                            setCountryId(e.value)
                                            setCountryCode(e.CountryCode)
                                            setCountry(e.label)
                                        }}
                                    // invalid={display && country === ''}
                                    />
                                    {display && !country ? <span className='error_msg_lbl'>Enter Category </span> : null}
                                </Col>
                               <Col lg='6' className='mb-1'>
                                    <Label className='form-label' for='address'><span className='text-danger'>*</span>Product Description </Label>
                                    <Input
                                        type='text'
                                        name='address'
                                        id='address'
                                        value={address}
                                        onChange={e => setAddress(e.target.value)}
                                        invalid={display && address === ''}

                                    />
                                    {display && !address ? <span className='error_msg_lbl'>Enter client name </span> : null}
                                </Col>
                            </Row>
                           
                           
                            <Row>
                                <Col md='12 text-lg-end text-md-center mt-1'>
                                    <Button className='me-1' color='primary' onClick={handleSubmit}>
                                        Submit
                                    </Button>
                                    <Button
                                        color='secondary'
                                        outline
                                        onClick={() => {
                                            setShow(!show)
                                        }}
                                    >
                                        Cancel
                                    </Button>
                                </Col>
                            </Row>
                        </Form>
                    </>
                </ModalBody>
            </Modal>
            {
                show ? (
                    <div className="modal-backdrop fade show" ></div>
                ) : null
            }
        </>
    )
}

export default NewHotelModal