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
import License from "../Promotions/License.css"

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

const AddLicense = ({ open, handleOpen, getOption }) => {
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
      <Modal
        isOpen={open}
        toggle={() => handleOpen()}
        className="modal-dialog-centered modal-md custom-modal-header"
        backdrop={false}
      >
        <ModalHeader className="bg-transparent" toggle={() => handleOpen()}><h3 className="fw-bolder">Create New License</h3>
          <p>Assign a subscription plan to a hotel</p></ModalHeader>
        <Form>
          <ModalBody>
            <Row className="d-flex flex-column justify-content-center align-items-center mb-2">
             
              <Col className="mt-1 d-flex flex-md-row flex-column">
                <Col className="mx-1">
                  <Label className="form-label" for="email">
                     Hotel
                  </Label>
                  {/* <input type="text" placeholder="search" className="form-control input-default w-100" /> */}
                  <Select>
                    <option>Demo/Trial</option>
                    <option>Monthly</option>
                    <option>6 Month</option>
                    <option>1 Year</option>
                    <option>2 Year</option>
                    <option>3 year</option> 
                  </Select>
                </Col>
                <Col className="mx-1">
                  <Label className="form-label" for="email">
                    Subscription Type
                  </Label>
                  {/* <input type="text" placeholder="search" className="form-control input-default w-100" /> */}
                  <Select>
                    <option>Demo/Trial</option>
                    <option>Monthly</option>
                    <option>6 Month</option>
                    <option>1 Year</option>
                    <option>2 Year</option>
                  </Select>
                </Col>
               
              </Col>
            
             
            </Row>
          </ModalBody>
          <ModalFooter>
            <Col xs={12} className="text-center">
              <Button className="me-1" color="primary" onClick={onSubmit}>
                 Create License
              </Button>
              <Button
                type="reset"
                color="secondary"
                outline
                onClick={() => handleReset()}
              >
                Cancel
              </Button>
            </Col>
          </ModalFooter>
        </Form>
      </Modal>
      {open ? <div className="modal-backdrop fade show"></div> : null}
    </>
  );
};

export default AddLicense;