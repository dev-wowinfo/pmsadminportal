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
    // {
    //   id: 1,
    //   type: "Basic",
    //   details: "something",
    //   dates: "22/8/2022",
    //   applicability: "all",
    //   action: "btns",
    // },
    {
      name: "PMS",
      type: "Basic",
      details: "Basic package details",
      dates: "22/08/2022",
      applicability: "All Users",
      room: "100",
      user: "50",
      action: "btns",
    },
    {
      name: "LLM",
      type: "Standard",
      details: "Standard package details",
      dates: "15/10/2023",
      applicability: "selected",
      room: "500",
      user: "200",
      action: "btns",
    },
  ];

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
      name: "Product Name",
      sortable: true,
      minWidth: "80px",
      cell: (row) => <span>{row.name}</span>,
    },
    {
      name: "Type",
      sortable: true,
      minWidth: "50px",
      cell: (row) => <span>{row.type}</span>,
    },
    {
      name: "Details",
      sortable: true,
      minWidth: "180px",
      cell: (row) => <span>{row.details}</span>,
    },
    {
      name: "Date",
      sortable: true,
      minWidth: "50px",
      cell: (row) => <span>{row.dates}</span>,
    },
    {
      name: "Applicability",
      sortable: true,
      minWidth: "80px",
      cell: (row) => <span>{row.applicability}</span>,
    },
    {
      // name: 'Discount Amount',
      name: "Rooms",
      sortable: true,
      minWidth: "50px",
      cell: (row) => <span>{row.room}</span>,
    },
    {
      name: "Users",
      sortable: true,
      minWidth: "50px",
      cell: (row) => <span>{row.user}</span>,
    },
    {
      name: "Actions",
      center: true,
      minWidth: "80px",
      selector: (row) => {
        return (
          <>
            <Col>
              <Edit
                className="me-1 cursor-pointer"
                size={15}
                onClick={() => {
                  handleUpdateOpen();
                  setPromoId(row.promotionId);
                }}
              />
            </Col>
          </>
        );
      },
    },
  ];

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>
            <h2>Product</h2>
          </CardTitle>
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
    </>
  );
};

export default Hotel;
