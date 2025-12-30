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
// import NewGuest from "./NewGuest";
// import GuestEdit from "./GuestEdit";

const BookingChart = () => {
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
      selector: (row) => row.phone,
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
              <Badge color="light-danger"> {row.status}</Badge>
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
          {/* <Trash className='me-50' size={15} onClick={() => {
                        setDel(true)
                        // setSelected_roomView(row.RoomViewID)
                    }} /> */}
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
      status: 'Active',
      date: 'Jun 02,2025',
    },
    {
      // id: 12222000372111,
      hotel: 'Royal Inn',
      city: 'Delhi',
      phone: '+918222245634',
      rooms: '75',
      status: 'Inactive',
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
            className={`btn rounded-pill px-1 ${activeTab === "active" ? "btn-white shadow-sm fw-medium" : "btn-light"
              }`}
            onClick={() => setActiveTab("active")}>
            Active Hotels (1)
          </button>

          <button
            className={`btn rounded-pill px-1 ${activeTab === "archived" ? "btn-white shadow-sm fw-medium" : "btn-light"
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
        <NewGuest open={newGuest} handleOpen={handleNewGuest} getOption={handleGuestOptions} />
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

export default BookingChart;
