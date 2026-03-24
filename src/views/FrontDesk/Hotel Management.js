import React, { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import {
  Card,
  CardBody,
  CardTitle,
  CardHeader,
  Button,
  Badge,
  Row,
  Col,
} from "reactstrap";
import { ChevronDown, Edit, Trash,  Archive, } from "react-feather";
import { useSelector } from "react-redux";
import axios from "../../API/axios";
import AddHotel from "./AddHotel";
import UpdateHotel from "./UpdateHotel";
// import NewGuest from "../GuestMaster/NewGuest";
// import BookingModal from "./BookingModal";
// import NewGuest from "./NewGuest";
// import GuestEdit from "./GuestEdit";

const HotelManagement = () => {
  useEffect(() => {
    const prevTitle = document.title;
    document.title = "PMS-Guest Master";

    return () => {
      document.title = prevTitle;
    };
  }, []);

  const [guestOptions, setGuestOptions] = useState([]);
  const [newGuest, setNewGuest] = useState(false);
  const handleNewGuest = () => setNewGuest(!newGuest);
  const [showEdit, setShowEdit] = useState(false);
  const handleGuestEdit = () => setShowEdit(!showEdit);
  const [guestId, setGuestId] = useState("");
  const [refresh, setRefresh] = useState(false);
  const handelRefresh = () => setRefresh(!refresh);
  const [activeTab, setActiveTab] = useState("active");

  const [showUpdate, setShowUpdate] = useState(false);
  const handleUpdateHotel = () => setShowUpdate(!showUpdate);

  const statusOptions = [
    { value: "Active", label: "Active" },
    { value: "Inactive", label: "Inactive" },
  ];

  const getUserData = useSelector((state) => state.userManageSlice.userData);
  const { LoginID, Token } = getUserData;

  const [query, setQuery] = useState("");
  const search = (data) => {
    return data.filter(
      (item) =>
        item.guestID.toLowerCase().includes(query.toLowerCase()) ||
        item.guestName.toLowerCase().includes(query.toLowerCase()) ||
        item.guestMobileNumber.toLowerCase().includes(query.toLowerCase()),
      // item.GuestAddress.toLowerCase().includes(query.toLowerCase())
    );
  };

  const Columns = [
    {
      name: "Client Name",
      sortable: true,
      width: "17rem",
      selector: (row) => row.hotel,
    },
    {
      name: "Category",
      sortable: true,
      selector: (row) => row.city,
    },
    {
      name: "Phone",
      sortable: true,
      width: "12rem",
      selector: (row) => row.phone,
    },
    {
      name: "Users",
      sortable: true,
      width: "7rem",
      selector: (row) => row.rooms,
    },
    {
      name: "Email",
      sortable: true,
      selector: (row) => row.active,
    },
    {
      name: "Country",
      sortable: true,
      selector: (row) => row.active,
    },
    {
      name: "City",
      sortable: true,
      selector: (row) => row.active,
    },
    {
      name: "Address",
      sortable: true,
      selector: (row) => row.date,
    },
    {
      name: "Action",
      sortable: true,
      center: true,
      width: "9rem",

      selector: (row) => (
        <>
          {/* <Col> */}
          <Edit
            className="me-1 cursor-pointer"
            onClick={() => {
              handleUpdateHotel(true);
              // setGuestId(row.guestID);
            }}
            size={15}
          />
          <Archive
            className="me-1 cursor-pointer"
            size={15}
            onClick={() => {
              // handleUpdateHotel(true);
              // setPromoId(row.promotionId);
            }}
          />
        </>
      ),
    },
  ];

  const handleGuestOptions = async () => {
    try {
      let obj = {
        LoginID,
        Token,
        Seckey: "abc",
        SearchPhrase: null,
        Event: "select",
      };
      const res = await axios.post(`/getdata/bookingdata/guestdetails`, obj);
      console.log("Guest data - OK > ", res);
      let result = res?.data[0];
      let arr = result.map((r) => {
        return {
          value: r?.guestID,
          label: `${r.guestName} : ${r.guestEmail} : ${r.guestMobileNumber}`,
          ...r,
        };
      });

      setGuestOptions(arr);
    } catch (error) {
      console.log("guesterror", error);
    }
  };

  useEffect(() => {
    handleGuestOptions();
    setRefresh();
  }, [refresh, newGuest, showEdit]);

  const staticData = [
    {
      // id: 12222000372122,
      hotel: "Adani Cement",
      city: "Mumbai",
      phone: "+919677734223",
      rooms: "150",
      active: "12",
      status: "Active",
      date: "Jun 02,2025",
    },
    {
      // id: 12222000372111,
      hotel: "WowInfobiz",
      city: "Delhi",
      phone: "+918222245634",
      rooms: "75",
      active: "8",
      status: "Trial",
      date: "Sep 30,2025",
    },
  ];
  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>
            <h2>Add Client</h2>
          </CardTitle>
          {/* {UserRole === "SuperAdmin" ? ( */}
          <Button
            color="primary"
            onClick={() => {
              setNewGuest(true);
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="currentColor"
              viewBox="0 0 256 256"
              class="me-1"
            >
              <path d="M228,128a12,12,0,0,1-12,12H140v76a12,12,0,0,1-24,0V140H40a12,12,0,0,1,0-24h76V40a12,12,0,0,1,24,0v76h76A12,12,0,0,1,228,128Z"></path>
            </svg>
            Add Client
          </Button>
          {/* ) : null} */}
        </CardHeader>
        <CardBody>
          <Row className="my-1">
            <Col>
              <DataTable
                noHeader
                data={staticData}
                columns={Columns}
                className="react-dataTable"
              />
            </Col>
          </Row>
        </CardBody>
      </Card>

      {newGuest ? (
        <AddHotel
          open={newGuest}
          handleOpen={handleNewGuest}
          getOption={handleGuestOptions}
        />
      ) : (
        <></>
      )}
      {/* {showEdit ? (
        <HotelEdit
          open={showEdit}
          handleOpen={handleGuestEdit}
          guestData={guestId}
          onRefresh={handelRefresh}
        />
      ) : (
        <></>
      )} */}

      <UpdateHotel
        // setShowUpdate={setShowUpdate}
        handleUpdateHotel={handleUpdateHotel}
        showUpdate={showUpdate}
      />
    </>
  );
};

export default HotelManagement;
