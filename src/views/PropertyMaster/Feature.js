import { React, useState } from "react";
import {
  Card,
  CardHeader,
  CardBody,
  CardTitle,
  Label,
  Input,
  Row,
  Col,
  Button,
} from "reactstrap";
import toast from "react-hot-toast";

const Feature = () => {
  const [hotelPhone, setHotelPhone] = useState("");
  const [hotelMobile, setHotelMobile] = useState("");
  const [hotelEmail, setHotelEmail] = useState("");
  const [phoneList, setPhoneList] = useState("");
  const [emailID, setEmailID] = useState("");
  const [websiteList, setWebsiteList] = useState("");
  const [display, setDisplay] = useState(false);

  const handleSubmit = () => {
    setDisplay(true);
    if (
      hotelPhone &&
      hotelMobile &&
      hotelEmail &&
      phoneList &&
      emailID &&
      websiteList !== ""
    ) {
      toast.success("Form Submitted!", { position: "top-center" });
    }
    // else {
    //   toast.error('Fill All Fields!', {
    //     position: "top-center",
    //     style: {
    //       minWidth: '250px'
    //     },
    //     duration: 4000
    //   })
    // }
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle tag="h1" className="fw-bold fs-2">
            <h2>Features</h2>
          </CardTitle>
        </CardHeader>
        <CardBody>
          {/* <Row>
            <Col md='4 '>
              <div  className='d-flex'>
              <Label for="hphone" className='w-50'>Hotel Phone<span className='text-danger'>*</span></Label>
              <Input type="text" id="hphone" value={hotelPhone} onChange={e => setHotelPhone(e.target.value)} invalid={display ? hotelPhone === '' : false} />
              </div>
              {display === true && !hotelPhone ? <span className='error_msg_lbl float-end'>Enter Hotel Phone Number </span> : <></>}
            </Col>
            <Col md='4'>
            <div  className='d-flex'>
              <Label for="hmobile" className='w-50'>Hotel Mobile<span className='text-danger'>*</span></Label>
              <Input type="text" id="hmobile" value={hotelMobile} onChange={e => setHotelMobile(e.target.value)} invalid={display ? hotelMobile === '' : false} />
              </div>
              {display === true && !hotelMobile ? <span className='error_msg_lbl float-end'>Enter Hotel Mobile Number </span> : <></>}
            </Col>
            <Col md='4'>
            <div  className='d-flex'>
              <Label for="hemail" className='w-50'>Hotel Email<span className='text-danger'>*</span></Label>
              <Input type="text" id="hemail" value={hotelEmail} onChange={e => setHotelEmail(e.target.value)} invalid={display ? hotelEmail === '' : false} />
              </div>
              {display === true && !hotelEmail ? <span className='error_msg_lbl float-end'>Enter Hotel Email </span> : <></>}
            </Col>
          </Row>
          <Row className='mt-3'>
            <Col md='4'>
            <div  className='d-flex'>
              <Label for="phonelist" className='w-50'>Phone List<span className='text-danger'>*</span></Label>
              <Input type="textarea" id="phonelist" value={phoneList} onChange={e => setPhoneList(e.target.value)} invalid={display ? phoneList === '' : false} />
              </div>
              {display === true && !phoneList ? <span className='error_msg_lbl float-end'>Enter Phone List </span> : <></>}
            </Col>
            <Col md='4'>
              <div className='d-flex'>
              <Label for="emailid" className='w-50'>Email ID<span className='text-danger'>*</span></Label>
              <Input type="textarea" id="emailid" value={emailID} onChange={e => setEmailID(e.target.value)} invalid={display ? emailID === '' : false} />
              </div>
              {display === true && !emailID ? <span className='error_msg_lbl float-end'>Enter Email ID </span> : <></>}
            </Col>
            <Col md='4'>
            <div className='d-flex'>
              <Label for="websitelist" className='w-50'>Website List<span className='text-danger'>*</span></Label>
              <Input type="textarea" id="websitelist" value={websiteList} onChange={e => setWebsiteList(e.target.value)} invalid={display ? websiteList === '' : false} />
              </div>
              {display === true && !websiteList ? <span className='error_msg_lbl float-end'>Enter Website List </span> : <></>}
            </Col>
          </Row>
          <Row>
            <Col md='12 text-end my-2'>
              <Button color='info' onClick={handleSubmit}>Save</Button>
            </Col>
          </Row> */}
          <div className="d-flex justify-content-center py-5">
            <h2>There is no record</h2>
          </div>
        </CardBody>
      </Card>
    </>
  );
};

export default Feature;
