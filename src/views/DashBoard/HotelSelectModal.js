import { React, useEffect, useRef, useState } from "react";
import {
    Badge,
    Button,
    Col,
    Form,
    Input,
    Label,
    Modal,
    ModalBody,
    ModalHeader,
    Row,
    Table,
} from "reactstrap";
import { selectThemeColors } from '@utils'
import Select from 'react-select'
// ** Styles
import Flatpickr from "react-flatpickr";
import "@styles/react/libs/flatpickr/flatpickr.scss";
import "../FrontDesk/table.scss";
import moment from "moment";
import { AiOutlineStop } from "react-icons/ai";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import axios, { Image_base_uri } from "../../API/axios";
import { useDispatch } from "react-redux"
import { setHotelProperty, userDataStorage } from "../../redux/usermanageReducer";
import NewHotelModal from "../PropertyMaster/Hotel/NewHotelModal";
import Avatar from '@components/avatar'
const HotelSelectModal = ({ open1, handleOpen1 }) => {
    const getUserData = useSelector((state) => state.userManageSlice.userData);
    console.log('getUserData', getUserData);
    const { LoginID, Token, CompanyID, PropertyID } = getUserData;
    const [hotels, setHotels] = useState([])
    const [selectedHotel, setSelectedHotel] = useState('')
    const [selectedProperty, setSelectedProperty] = useState('')
    const dispatch = useDispatch()
    console.log(selectedHotel);
    const [show, setShow] = useState(false)
    // const handleShowModal = () => setShow(!show)
    const handleShowModal = () => {
        setShow(prev => !prev);
    };

    const getAllHotelList = () => {
        axios.get(`/property/hotel/all?CompanyID=${CompanyID}&LoginID=${LoginID}&Token=${Token}`).then((res) => {
            console.log('response:__', res.data[0][0])
            // setHotels(res.data[0])
            let data = res?.data[0]
            console.log('sttau', data);
            // if (data.length > 0) {
            //     const options = data.filter(c => c.Status === 'Active').map(c => {
            //         return { value: c.PropertyID, label: c.HotelName }
            //     })
            // }
            setHotels(data)
        }).catch(e => {
            console.log(e)
        })
    }
    const collectData = () => {
        // dispatch(userDataStorage({
        //     "PropertyID": selectedHotel,
        //     "HotelName": selectedProperty,

        // }))
        dispatch(setHotelProperty({
            "PropertyID": selectedProperty,
            "HotelName": selectedHotel
        }))
        let arr = JSON.parse(localStorage.getItem('userData'))
        console.log('userData', arr, typeof (arr));
        // let newarr = [
        //     ...arr, "PropertyID": selectedProperty,
        //     "HotelName": selectedHotel
        // ]
        let newarr = arr.map(i => {
            return {
                ...i, PropertyID: selectedProperty, HotelName: selectedHotel
            }
        })
        localStorage.setItem('userData', JSON.stringify(newarr))
        handleOpen1()
    }


    useEffect(() => {
        getAllHotelList()
    }, [])

    return (
        <>
            <Modal
                isOpen={open1}
                toggle={handleOpen1}
                className="modal-dialog-centered modal-md"
                backdrop={false}
            >
                <ModalHeader >
                    Select Current Hotel
                </ModalHeader>
                <ModalBody className="pt-2">
                    <Form>
                        <Row>
                            <Row>
                                <Col>
                                    {hotels && hotels.map((item, index) => {
                                        // console.log('item', item);
                                        return (
                                            <div key={index}>
                                                <Input type='radio' name='hote' id='hotel' className='me-1' style={{ marginTop: '2rem' }} onChange={() => {
                                                    setSelectedHotel(item.hotelName)
                                                    setSelectedProperty(item.propertyID)
                                                }} />
                                                {
                                                    item.logoFile ? (
                                                        <Avatar className='my-1' size="lg" img={`${Image_base_uri}${item?.logoURL}`} alt='logo' />
                                                    ) : (
                                                        <Avatar className='my-1' size="lg" img={`${Image_base_uri}/uploads/dummy.jpg`} alt='logo' />
                                                    )
                                                }
                                                <h4 className="mt-1 ms-1 d-inline">{item.hotelName}</h4>
                                            </div>
                                        )
                                    })}
                                </Col>
                            </Row>
                            <div className="d-flex p-3 justify-content-evenly">
                                {console.log('hotels', hotels)}
                                {hotels?.length === 0 ? <Button color="primary" onClick={() => setShow(true)}>
                                    Add Hotel
                                </Button> : <Button disabled={selectedProperty === ''} color="primary" onClick={() => collectData()}>
                                    Save
                                </Button>}
                            </div>
                        </Row>
                    </Form>
                </ModalBody>
            </Modal>
            {open1 ? <div className="modal-backdrop fade show"></div> : null}
            <NewHotelModal show={show} setShow={setShow} handleShowModal={handleShowModal} getAllHotelList={getAllHotelList} />
        </>
    );
};

export default HotelSelectModal;
