import React, { useEffect, useState } from "react";
import {
  Button,
  Col,
  Form,
  Input,
  Label,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Row,
} from "reactstrap";
import Select from "react-select";
import { toast } from "react-hot-toast";

// ** Third Party Components
import * as yup from "yup";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

import { selectThemeColors } from "@utils";

import axios from "../../API/axios";
import { useSelector } from "react-redux";
import Hotel from "../FrontDesk/Hotel.css"

const defaultValues = {
  name: "",
  last_name: "",
  prefix: "",
  mobile_number: "",
  email: "",
  dob: "",
  address: "",
  pincode: "",
  country: "",
  state: "",
  city: "",
};

const BookingModal = ({ open, handleOpen, getOption }) => {
  const getUserData = useSelector((state) => state.userManageSlice.userData);

  const { LoginID, Token } = getUserData;

  const [stateList, setStateList] = useState([]);
  const [countryList, setCountryList] = useState([]);
  const [districtList, setDistrictList] = useState([]);
  const [cityList, setCityList] = useState([]);
  const [guestName, setGuestName] = useState("");
  const [guestLastName, setGuestLastName] = useState("");
  const [mobPrefix, setMobPrefix] = useState("");
  const [mobNumber, setMobNumber] = useState("");
  const [guestEmail, setGuestEmail] = useState("");
  const [guestDob, setGuestDob] = useState("");
  const [pinCode, setPinCode] = useState("");
  const [address, setAddress] = useState("");
  const [countryId, setCountryId] = useState("");
  const [stateId, setStateId] = useState("");
  const [districtId, setDistrictId] = useState("");
  const [cityId, setCityId] = useState("");
  const [display, setDisplay] = useState(false);

  // const userId = localStorage.getItem('user-id')

  // COUNTRY API
  const countryDetailsList = async () => {
    try {
      const countryListBody = {
        LoginID,
        Token,
        Seckey: "abc",
        Event: "select",
      };
      const res = await axios.post(
        `https://restcountries.com/v3.1/all?fields=name,flags`,
        countryListBody
      );
      console.log("res-country", res);
      setCountryList(res?.data[0]);
    } catch (error) {
      console.log("Country List Error", error.message);
    }
  };

  const countryOptions =
    countryList?.length && countryList[0]?.countryName
      ? countryList?.map(function (country) {
        return { value: country.countryID, label: country.countryName };
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

  // STATE API
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
  const stateOptions =
    stateList?.length && stateList[0]?.stateName
      ? stateList?.map(function (state) {
        return { value: state.stateID, label: state.stateName };
      })
      : [{ value: "reload", label: "Error loading, click to reload again" }];

  const handleStateDetailsList = (value) => {
    if (value === "reload") {
      stateDetailsList();
      return;
    }
    setStateId(value);
  };

  // DISTRICT API
  // const districtDetailsList = (value) => {
  //     try {
  //         const districtDetailsBody = {
  //             LoginID,
  //             Token,
  //             Seckey: "abc",
  //             StateID: value,
  //             Event: "select"
  //         }
  //         axios.post(`/getdata/regiondata/districtdetails`, districtDetailsBody)
  //             .then(districtDropDownResponse => {
  //                 setDistrictList(districtDropDownResponse?.data[0])
  //             })
  //     } catch (error) {
  //         console.log("District Details Error", error.message)
  //     }
  // }
  // const districtOptions = districtList?.length && districtList[0]?.DistrictName ? districtList?.map(function (district) {
  //     return { value: district.DistrictID, label: district.DistrictName }
  // }) : [{ value: 'reload', label: 'Error loading, click to reload again' }]

  // const handelDistrictDetailsList = (value) => {
  //     if (value === 'reload') {
  //         districtDetailsList()
  //         return
  //     }
  //     setDistrictId(value)
  // }

  // CITY API
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
          console.log("cityDropDownResponse", cityDropDownResponse?.data[0]);
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

  const GuestSchema = yup.object().shape({
    name: yup.string().required(),
    last_name: yup.string().required(),
    prefix: yup.number().min(2).required(),
    mobile_number: yup.number().min(10).required(),
    // email: yup.string().email().required(),
    // dob: yup.date().required(),
    pincode: yup.number().required(),
    address: yup.string().required(),
    country: yup.string().required(),
    state: yup.string().required(),
    city: yup.string().required(),
  });

  const { reset } = useForm({
    defaultValues,
    resolver: yupResolver(GuestSchema),
  });

  const handleReset = () => {
    reset({
      name: "",
      last_name: "",
      prefix: "",
      mobile_number: "",
      email: "",
      dob: "",
      address: "",
      pincode: "",
      country: "",
      state: "",
      city: "",
    });
    handleOpen();
  };

  const guestRegister = () => {
    try {
      const guestRegisterBody = {
        LoginID,
        Token,
        Seckey: "abc",
        Name: guestName,
        LastName: guestLastName,
        PrefixN: mobPrefix,
        MobileNumber: mobNumber,
        Type: "Normal User",
        Email: guestEmail,
        DOB: guestDob,
        Address: address,
        CountryID: countryId,
        StateID: stateId,
        DistrictID: stateId,
        CityID: cityId,
        Pincode: pinCode,
        FloorID: null,
        SpecialNote: "",
        Event: "insert",
      };
      console.log('guestRegisterBody', guestRegisterBody);
      axios.post(`/setdata/guestdetails`, guestRegisterBody).then((res) => {
        console.log("Guest Entry", res);
        toast.success("Guest registered succesfully");
        getOption()
      });
    } catch (error) {
      console.log("Guest Register Error", error.message);
    }
  };

  const onSubmit = () => {
    setDisplay(true);
    if (
      guestName.trim() &&
      guestLastName.trim() &&
      mobPrefix.trim() &&
      mobNumber.trim() &&
      // guestEmail.trim() &&
      // guestDob &&
      countryId &&
      stateId &&
      cityId &&
      pinCode.trim() &&
      address.trim() !== ""
    ) {
      guestRegister();
      handleOpen();
      setGuestName("");
      setGuestLastName("");
      setMobPrefix("");
      setMobNumber("");
      setGuestEmail("");
      setGuestDob("");
      setCountryId("");
      setStateId("");
      setCityId("");
      setPinCode("");
      setAddress("");
      setDisplay(false);
    }
  };

  return (
    <>
      {/* <Modal
        isOpen={open}
        toggle={() => handleOpen()}
        className="modal-dialog-centered modal-md"
        backdrop={false}
      >
        <ModalHeader className="bg-transparent" toggle={() => handleOpen()}><h3 className="fw-bolder"> New Hotel</h3>
          <p>Register a new hotel property</p></ModalHeader>
        <Form>
          <ModalBody>
            <Row className="d-flex flex-column justify-content-center align-items-center">
              <Col className="mt-1 d-flex flex-column">
                <Col className="mx-1">
                  <Label className="form-label" for="name">
                    Hotel Name <span className="text-danger">*</span>
                  </Label>
                  <input type="text" placeholder="e.g.,Grand plaza hotel" className="form-control input-default w-100" />

                </Col>

              </Col>

              <Col className="mt-1 d-flex flex-md-row flex-column">
                <Col className="mx-1">
                  <Label className="form-label" for="last_name">
                    Email<span className="text-danger">*</span>
                  </Label>
                  <input type="textarea" placeholder="Brief Description..." className="form-control input-default w-100" />
                </Col>

                <Col className="mx-1">
                  <Label className="form-label" for="last_name">
                    Phone<span className="text-danger">*</span>
                  </Label>
                  <input type="textarea" placeholder="Brief Description..." className="form-control input-default w-100" />
                </Col>

              </Col>
              <Row>
                <Col className="mx-1">
                  <Label className="form-label" for="dob">
                    Address
                  </Label>
                  <input type="number" placeholder="30" className="form-control w-100" />
                </Col>
              </Row>


              <Col className="mt-1 d-flex flex-md-row flex-column">

                <Row>
                  <Col className="mx-1" md={6}>
                    <Label className="form-label" for="city">
                      CIty<span className="text-danger">*</span>
                    </Label>
                    <input type="number" placeholder="0" className="form-control w-100" />
                  </Col>

                  <Col className="mx-1" md={6}>
                    <Label className="form-label" for="city">
                      Country<span className="text-danger">*</span>
                    </Label>
                    <input type="number" placeholder="0" className="form-control w-100" />
                  </Col>
                </Row>
                <Row>

                  <Col className="mx-1" md={6}>
                    <Label className="form-label" for="city">
                      Room Count<span className="text-danger">*</span>
                    </Label>
                    <input type="number" placeholder="0" className="form-control w-100" />
                  </Col>

                  <Col className="mx-1" md={6}>
                    <Label className="form-label" for="city">
                      Active users<span className="text-danger">*</span>
                    </Label>
                    <input type="number" placeholder="0" className="form-control w-100" />
                  </Col>
                </Row>



              </Col>
              <Col className="mt-1 d-flex flex-md-row flex-column">
                <Col className="mx-1">Add
                  <Label className="form-label" for="address">
                    Max Rooms<span className="text-danger">*</span>
                  </Label>
                  <input type="number" placeholder="30" className="form-control w-100" />
                </Col>
                <Col className="mx-1">
                  <Label className="form-label" for="address">
                    Max Users<span className="text-danger">*</span>
                  </Label>
                  <input type="number" placeholder="30" className="form-control w-100" />
                </Col>
              </Col>
            </Row>
          </ModalBody>
          <ModalFooter>
            <Col xs={12} className="text-center">
              <Button className="me-1" color="primary" onClick={onSubmit}>
                Submit
              </Button>
              <Button
                type="reset"
                color="secondary"
                outline
                onClick={() => handleReset()}
              >
                Discard
              </Button>
            </Col>
          </ModalFooter>
        </Form>
      </Modal> */}

      <Modal
        isOpen={open}
        toggle={handleOpen}
        className="modal-dialog-centered modal-md hotel-modal-header"
        backdrop={false}
      >
        {/* ---------- HEADER ---------- */}
        <ModalHeader toggle={handleOpen}>
          <div>
            <h3 className="fw-bolder mb-0">Add New Hotel</h3>
            <p className="mb-0">Register a new hotel property</p>
          </div>
        </ModalHeader>
          
        <Form onSubmit={onSubmit}>
          <ModalBody>
            {/* ---------- HOTEL NAME ---------- */}
            <Row className="mb-1">
              <Col md={12}>
                <Label className="form-label">
                  Hotel Name <span className="text-danger">*</span>
                </Label>
                <input
                  type="text"
                  placeholder="e.g., Grand Plaza Hotel"
                  className="form-control"
                />
              </Col>
            </Row>

            {/* ---------- EMAIL & PHONE ---------- */}
            <Row className="mb-1">
              <Col md={6}>
                <Label className="form-label">
                  Email <span className="text-danger">*</span>
                </Label>
                <input
                  type="email"
                  placeholder="contact@hotel.com"
                  className="form-control"
                />
              </Col>

              <Col md={6}>
                <Label className="form-label">
                  Phone <span className="text-danger">*</span>
                </Label>
                <input
                  type="tel"
                  placeholder="+1 234 567 8900"
                  className="form-control"
                />
              </Col>
            </Row>

            {/* ---------- ADDRESS ---------- */}
            <Row className="mb-1">
              <Col md={12}>
                <Label className="form-label">Address</Label>
                <input
                  type="text"
                  placeholder="Street address"
                  className="form-control"
                />
              </Col>
            </Row>

            {/* ---------- CITY & COUNTRY ---------- */}
            <Row className="mb-1">
              <Col md={6}>
                <Label className="form-label">
                  City <span className="text-danger">*</span>
                </Label>
                <input
                  type="text"
                  placeholder="City name"
                  className="form-control"
                />
              </Col>

              <Col md={6}>
                <Label className="form-label">
                  Country <span className="text-danger">*</span>
                </Label>
                <input
                  type="text"
                  placeholder="Country name"
                  className="form-control"
                />
              </Col>
            </Row>

            {/* ---------- ROOM COUNT & ACTIVE USERS ---------- */}
            <Row className="mb-1">
              <Col md={6}>
                <Label className="form-label">Room Count</Label>
                <input
                  type="number"
                  placeholder="0"
                  className="form-control"
                />
              </Col>

              <Col md={6}>
                <Label className="form-label">Active Users</Label>
                <input
                  type="number"
                  placeholder="0"
                  className="form-control"
                />
              </Col>
            </Row>
          </ModalBody>

          {/* ---------- FOOTER ---------- */}
          <ModalFooter className="justify-content-end">
            <Button color="secondary" outline onClick={handleReset}>
              Cancel
            </Button>
            <Button color="primary" type="submit">
              Add Hotel
            </Button>
          </ModalFooter>
        </Form>
      </Modal>


      {open ? <div className="modal-backdrop fade show"></div> : null}
    </>
  );
};

export default BookingModal;