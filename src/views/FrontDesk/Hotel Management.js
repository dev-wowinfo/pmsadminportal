import React, { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import {
  Card,
  CardBody,
  CardTitle,
  CardHeader,
  Button,
  Badge,
} from "reactstrap";
import { ChevronDown, Edit, Trash } from "react-feather";
import { useSelector } from "react-redux";
import axios from "../../API/axios";
import NewGuest from "../GuestMaster/NewGuest";
import BookingModal from "./BookingModal";
// import NewGuest from "./NewGuest";
// import GuestEdit from "./GuestEdit";

const HotelManagement = () => {
  useEffect(() => {
    const prevTitle = document.title
    document.title = "PMS-Guest Master"

    return () => {
      document.title = prevTitle
    }
  }, [])

  const [guestOptions, setGuestOptions] = useState([]);
  const [newGuest, setNewGuest] = useState(false);
  const handleNewGuest = () => setNewGuest(!newGuest);
  const [showEdit, setShowEdit] = useState(false);
  const handleGuestEdit = () => setShowEdit(!showEdit);
  const [guestId, setGuestId] = useState("");
  const [refresh, setRefresh] = useState(false);
  const handelRefresh = () => setRefresh(!refresh);
  const [activeTab, setActiveTab] = useState("active");

  const statusOptions = [
    { value: "Active", label: "Active" },
    { value: "Inactive", label: "Inactive" },
  ];

  const getUserData = useSelector((state) => state.userManageSlice.userData);
  const { LoginID, Token } = getUserData;


  const [query, setQuery] = useState("")
  const search = (data) => {
    return data.filter(item =>
      item.guestID.toLowerCase().includes(query.toLowerCase()) ||
      item.guestName.toLowerCase().includes(query.toLowerCase()) ||
      item.guestMobileNumber.toLowerCase().includes(query.toLowerCase())
      // item.GuestAddress.toLowerCase().includes(query.toLowerCase())
    )
  }

  const Columns = [
    // {
    //   name: "Guest ID",
    //   sortable: true,
    //   width: '17rem',
    //   selector: (row) => row.id,
    // },
    {
      name: "Hotel Name",
      sortable: true,
      width: '17rem',
      selector: (row) => row.hotel,
    },
    {
      name: "Location",
      sortable: true,
      selector: (row) => row.city,
    },
    {
      name: "Contact",
      sortable: true,
      width: '12rem',
      selector: (row) => row.phone,
    },
    {
      name: "Rooms",
      sortable: true,
      width: '7rem',
      selector: (row) => row.rooms,
    },
    {
      name: "Active Users",
      sortable: true,
      selector: (row) => row.active,
    },

    {
      name: "License Status",
      sortable: true,
      selector: (row) => row.status,
      cell: (row) => {
        return (
          <>
            {row.status === "Active" ? (
              <Badge color="light-success"> {row.status}</Badge>
            ) : (
              <Badge color="light-primary"> {row.status}</Badge>
            )}
          </>
        );
      },
    },
    {
      name: "Registered",
      sortable: true,
      selector: (row) => row.date,
    },
    {
      name: "Action",
      sortable: true,
      center: true,
      width: '9rem',

      selector: (row) => (
        <>
          {/* <Col> */}
          <Edit
            className="me-50 pe-auto"
            onClick={() => {
              setShowEdit(true);
              setGuestId(row.guestID);
            }}
            size={15}
          />
          <button data-slot="button" class="inline-flex bg-transparent items-center justify-center whitespace-nowrap border border-0 text-sm font-medium px-1"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="30" fill="currentColor" viewBox="0 0 256 256"><path d="M224,48H32A16,16,0,0,0,16,64V88a16,16,0,0,0,16,16v88a16,16,0,0,0,16,16H208a16,16,0,0,0,16-16V104a16,16,0,0,0,16-16V64A16,16,0,0,0,224,48ZM208,192H48V104H208ZM224,88H32V64H224V88ZM96,136a8,8,0,0,1,8-8h48a8,8,0,0,1,0,16H104A8,8,0,0,1,96,136Z"></path></svg></button>
          {/* </Col> */}
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
      hotel: 'Grand Plaza Hotel',
      city: 'Mumbai',
      phone: '+919677734223',
      rooms: '150',
      active: '12',
      status: 'Active',
      date: 'Jun 02,2025',
    },
    {
      // id: 12222000372111,
      hotel: 'Royal Inn',
      city: 'Delhi',
      phone: '+918222245634',
      rooms: '75',
      active: '8',
      status: 'Trial',
      date: 'Sep 30,2025',
    }
  ];
  return (
    <>
      {console.log("guest", guestOptions)}
      <Card>
        <CardHeader>
          <CardTitle><h1 class="text-3xl fw-bolder tracking-tight">Hotel Management</h1>
            <p class="fs-5">Manage customer properties and their licenses</p>
          </CardTitle>
          <Button color="primary" onClick={() => { setNewGuest(true); }}>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 256 256" class="me-1"><path d="M228,128a12,12,0,0,1-12,12H140v76a12,12,0,0,1-24,0V140H40a12,12,0,0,1,0-24h76V40a12,12,0,0,1,24,0v76h76A12,12,0,0,1,228,128Z"></path></svg>
            Add Hotels
          </Button>

        </CardHeader>
      </Card>
      <Card>

        <div className="p-2">
          <h4 class="text-3xl fw-bolder tracking-tight">Active Hotels</h4>
          <p class="fs-5">Manage customer licenses and subscriptions</p>
        </div>
        <div className="rounded d-flex ms-2">
          <button
            className={`btn rounded-pill px-1 ${activeTab === "active" ? "btn-white shadow-sm fw-medium" : "btn-primary"
              }`}
            onClick={() => setActiveTab("active")}>
            Active Hotels (2)
          </button>
          <button
            className={`btn rounded-pill px-1 ${activeTab === "archived" ? "btn-white shadow-sm fw-medium" : "btn-primary"
              }`}
            onClick={() => setActiveTab("archived")}>
            Archived Hotels (0)
          </button>
        </div>
        <input type="text" placeholder="search" className="ms-3 mt-2 form-control input-default w-50" onChange={e => setQuery(e.target.value)} />

        <CardBody>

          <div className="react-dataTable">
            <DataTable
              noHeader
              pagination
              // data={search(guestOptions)}
              data={staticData}
              columns={Columns}
              className="react-dataTable ms-3"
              sortIcon={<ChevronDown size={10} />}
              paginationRowsPerPageOptions={[10, 25, 50, 100]}
            />
          </div>

        </CardBody>
      </Card>
      {newGuest ? (
        <BookingModal open={newGuest} handleOpen={handleNewGuest} getOption={handleGuestOptions} />
      ) : (
        <></>
      )}
      {showEdit ? (
        <GuestEdit
          open={showEdit}
          handleOpen={handleGuestEdit}
          guestData={guestId}
          onRefresh={handelRefresh}
        />
      ) : (
        <></>
      )}
    </>
  );
};

export default HotelManagement;
