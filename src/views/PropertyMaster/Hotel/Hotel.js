import React, { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import { Edit, RefreshCcw, Trash } from "react-feather";
import { AiOutlineCloudSync } from "react-icons/ai";
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
  FormFeedback,
  CardHeader,
} from "reactstrap";
import Select from "react-select";
import { selectThemeColors } from "@utils";
import toast from "react-hot-toast";
import Flatpickr from "react-flatpickr";
import axios, { Image_base_uri } from "../../../API/axios";
// ** Styles
import "@styles/react/libs/flatpickr/flatpickr.scss";
import { useSelector } from "react-redux";
import NewHotelModal from "./NewHotelModal";
import EditHotelModal from "./EditHotelModal";
import DeleteHotelModal from "./DeleteHotelModal";
import HotelOTA from "./HotelOTA";
import Avatar from "@components/avatar";
const Hotel = () => {
  useEffect(() => {
    const prevTitle = document.title;
    document.title = "PMS-Hotel";

    return () => {
      document.title = prevTitle;
    };
  }, []);

  const getUserData = useSelector((state) => state.userManageSlice.userData);
  const { LoginID, Token, CompanyID, UserRole } = getUserData;

  const [hotels, setHotels] = useState([]);
  const getAllHotelList = () => {
    axios
      .get(
        `/property/hotel/all?CompanyID=${CompanyID}&LoginID=${LoginID}&Token=${Token}`,
      )
      .then((res) => {
        console.log("response:__", res.data[0]);
        setHotels(res.data[0]);
      })
      .catch((e) => {
        console.log(e);
      });
  };
   const data = [
        {
            id: 1,
            type: 'Basic',
            details: 'something',
            dates: '22/8/2022',
            applicability: 'all',
            action: 'btns'
        },
    ]

  const [show, setShow] = useState(false);
  const handleShowModal = () => setShow(!show);

  const [showEdit, setShowEdit] = useState(false);
  const handleEditModal = () => setShowEdit(!showEdit);

  const [selected_hotel, setSelected_hotel] = useState();

  const [del, setDel] = useState(false);
  const handleDelModal = () => setDel(!del);

  const [OTA, SetOTA] = useState(false);
  const handleOTA = () => SetOTA(!OTA);

  const [otaData, setOtaData] = useState([]);
  const getOTAphoto = async () => {
    try {
      const res = await axios.get(`/booking/getotalogo/244`, {
        headers: {
          LoginID,
          Token,
        },
      });
      console.log("otaData", res?.data[0]);
      setOtaData(res?.data[0][0]);
    } catch (error) {
      console.log("error", error);
    }
  };

  useEffect(() => {
    getAllHotelList();
    getOTAphoto();
  }, [show, showEdit, del]);

  // const getAllState = () => {
  //   axios.post("/getdata/regiondata/statedetails", {
  //     LoginID,
  //     Token,
  //     Seckey: "abc",
  //     Event: "selectall"
  //   }).then(res => {
  //     console.log("testing:_", res)
  //     if (res.data !== null) {
  //       res.data[0].map(i => states.push({ label: i.StateName, value: i.StateID }))

  //     }
  //   }).catch(e => {
  //     toast.error(e.response.data.Message, { position: 'top-right' })
  //   })
  // }
  // useEffect(() => {
  //   getAllHotelList()
  //   // getAllState()
  // }, [])

  const hotelTable = [
          {
              // name: 'Promotion Id',
              name: 'Product Name',
              sortable: true,
              minWidth: '250px',
              cell: () => <span>PMS</span>
          },
          {
              // name: 'Promotion Date',
              name: 'Plan',
              sortable: true,
              // minWidth: '225px',             
              // selector: row => moment(row.promoDate).format('YYYY-MM-DD')
              cell: () => <span>Enterprises</span>
          },
          {
              // name: 'Promotion Name',
              name: 'Status',
              sortable: true,
              // minWidth: '250px',
              cell: () => <span class="border rounded bg-success text-light px-1">Active</span>
          },
          {
              // name: 'Discount Type',
              name: 'Start Date',
              sortable: true,
              // minWidth: '310px',
              // selector: row => row.discountType === 'P' ? 'Percentage' : 'Flat'
              cell: () => <span>Aug 02, 2025</span>
  
          },
          {
              // name: 'Discount Percentage',
              name: 'End Date',
              sortable: true,
              // minWidth: '250px',
              // selector: row => row.discPercentage
              cell: () => <span>Aug 02, 2026</span>
          },
          {
              // name: 'Discount Amount',
              name: 'Rooms',
              sortable: true,
              // minWidth: '250px',
              // selector: row => row.discAmount
              cell: () => <span>500</span>
          },
          {
              // name: 'Guest Type',
              name: 'Users',
              sortable: true,
              // minWidth: '250px',
              // selector: row => row.guestType
              cell: () => <span>50</span>
          },
          {
              name: 'Actions',
              center: true,
              selector: row => {
                  return (
                      <>
                          <Col>
                              <Edit className='me-1 cursor-pointer' size={15} onClick={() => {
                                  handleUpdateOpen()
                                  setPromoId(row.promotionId)
                              }} />
  
                          </Col>
                      </>
                  )
              }
          }
      ]

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle><h2>Product</h2></CardTitle>
          {UserRole === "SuperAdmin" ? (
            <Button color="primary" onClick={() => setShow(true)}>
              Add Product
            </Button>
          ) : null}
        </CardHeader>
      </Card>
      <Card>
        <CardBody>
          <Row className="my-1">
            <Col>
              <DataTable
                noHeader
                data={data}
                columns={hotelTable}
                className="react-dataTable"
              />
            </Col>
          </Row>
        </CardBody>
      </Card>
      {show && (
        <NewHotelModal
          show={show}
          handleShowModal={handleShowModal}
          getAllHotelList={getAllHotelList}
        />
      )}
      {showEdit && (
        <EditHotelModal
          showEdit={showEdit}
          handleEditModal={handleEditModal}
          hotels={hotels}
          id={selected_hotel}
        />
      )}
      {del && (
        <DeleteHotelModal
          del={del}
          handleDelModal={handleDelModal}
          hotels={hotels}
          id={selected_hotel}
        />
      )}
      {OTA && (
        <HotelOTA
          open={OTA}
          handleOTA={handleOTA}
          hotels={hotels}
          id={selected_hotel}
        />
      )}
    </>
  );
};

export default Hotel;
