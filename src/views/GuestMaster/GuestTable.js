import React, { useEffect, useState } from "react";
import { FaArchive } from "react-icons/fa";
import DataTable from "react-data-table-component";
import {
  Card,
  CardBody,
  CardTitle,
  CardHeader,
  Button,
  CardSubtitle,
  Badge,
} from "reactstrap";
import { ChevronDown, Edit, Trash } from "react-feather";
import { useSelector } from "react-redux";
import axios from "../../API/axios";
import NewGuest from "./NewGuest";
import GuestEdit from "./GuestEdit";
import { padding } from "@mui/system";

const GuestTable = () => {
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

  // const Columns = [
  //   // {
  //   //   name: "Guest ID",
  //   //   sortable: true,
  //   //   width: '17rem',
  //   //   selector: (row) => row.guestID,
  //   // },
  //   // {
  //   //   name: "Guest Name",
  //   //   sortable: true,
  //   //   selector: (row) => row.guestName,
  //   // },
  //   // {
  //   //   name: "Guest Address",
  //   //   sortable: true,
  //   //   selector: (row) => row.guestAddress,
  //   // },
  //   // {
  //   //   name: "Guest phoneNumber",
  //   //   sortable: true,
  //   //   selector: (row) => row.guestMobileNumber,
  //   // },
  //   {
  //     // name: 'Promotion Id',
  //     name: 'Hotel',
  //     sortable: true,
  //     minWidth: '250px',
  //     className: "hotel-name",
  //     cell: () => <span>Grand Plaza Hotel</span>
  //   },
  //   {
  //     // name: 'Promotion Date',
  //     name: 'Plan',
  //     sortable: true,
  //     // minWidth: '225px',             
  //     // selector: row => moment(row.promoDate).format('YYYY-MM-DD')
  //     cell: () => <span>Enterprises</span>
  //   },
  //   {
  //     // name: 'Promotion Name',
  //     name: 'Status',
  //     sortable: true,
  //     // minWidth: '250px',
  //     cell: () => <span class="border rounded bg-success text-light px-1">Active</span>
  //   },
  //   {
  //     // name: 'Discount Type',
  //     name: 'Start Date',
  //     sortable: true,
  //     // minWidth: '310px',
  //     // selector: row => row.discountType === 'P' ? 'Percentage' : 'Flat'
  //     cell: () => <span>Jun 23, 2025</span>

  //   },
  //   {
  //     // name: 'Discount Percentage',
  //     name: 'End Date',
  //     sortable: true,
  //     // minWidth: '250px',
  //     // selector: row => row.discPercentage
  //     cell: () => <span>Jun 23, 2026</span>
  //   },
  //   {
  //     // name: 'Discount Amount',
  //     name: 'Rooms',
  //     sortable: true,
  //     // minWidth: '250px',
  //     // selector: row => row.discAmount
  //     cell: () => <span>500</span>
  //   },
  //   {
  //     // name: 'Guest Type',
  //     name: 'Users',
  //     sortable: true,
  //     // minWidth: '250px',
  //     // selector: row => row.guestType
  //     cell: () => <span>50</span>
  //   },

  //   {
  //     name: "Status",
  //     sortable: true,
  //     selector: (row) => row.status,
  //     cell: (row) => {
  //       return (
  //         <>
  //           {row.status === "Active" ? (
  //             <Badge color="light-success"> {row.status}</Badge>
  //           ) : (
  //             <Badge color="light-danger"> {row.status}</Badge>
  //           )}
  //         </>
  //       );
  //     },
  //   },
  //   {
  //     name: "Action",
  //     sortable: true,
  //     center: true,
  //     selector: (row) => (
  //       <>
  //         {/* <Col> */}
  //         <Edit
  //           className="me-50 pe-auto"
  //           onClick={() => {
  //             setShowEdit(true);
  //             setGuestId(row.guestID);
  //           }}
  //           size={15}
  //         />
  //         {/* <Trash className='me-50' size={15} onClick={() => {
  //                       setDel(true)
  //                       // setSelected_roomView(row.RoomViewID)
  //                   }} /> */}
  //         {/* </Col> */}
  //       </>
  //     ),
  //   },
  // ];

  const Columns = [
    {
      name: 'Hotel',
      sortable: true,
      minWidth: '250px',
      className: 'hotel-name',
      cell: () => <span>Grand Plaza Hotel</span>
    },
    {
      name: 'Plan',
      sortable: true,
      cell: () => <span>Enterprise</span>
    },
    {
      name: 'Status',
      sortable: true,
      cell: () => (
        <span className="border rounded bg-success text-light px-1">
          Active
        </span>
      )
    },
    {
      name: 'Start Date',
      sortable: true,
      cell: () => <span>Jun 23, 2025</span>
    },
    {
      name: 'End Date',
      sortable: true,
      cell: () => <span>Jun 23, 2026</span>
    },
    {
      name: 'Rooms',
      sortable: true,
      cell: () => <span>500</span>
    },
    {
      name: 'Users',
      sortable: true,
      cell: () => <span>50</span>
    },

    {
      name: 'Action',
      center: true,
      cell: row => (
        <Edit
          className="me-50 cursor-pointer"
          size={15}
          onClick={() => {
            setShowEdit(true);
            setGuestId(row.guestID);
          }}
        />
      )
    }
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
      id: 1,
      hotel: 'Grand Plaza Hotel',
      city: 'Mumbai',
      price: '₹2500'
    },
    {
      id: 2,
      hotel: 'Royal Inn',
      city: 'Delhi',
      price: '₹1800'
    }
  ];

  return (
    <>
      {/* {console.log("guest", guestOptions)} */}
      <Card>
        <CardHeader>
          <CardTitle><h1 className="fw-bolder">Subscription Plans</h1>
            <p class="fs-6">Manage pricing and features for your subscription tries</p></CardTitle>
          {/* <input type="text" placeholder="search" className="form-control input-default w-50" onChange={e => setQuery(e.target.value)} /> */}
          <Button color="primary" onClick={() => { setNewGuest(true); }}>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 256 256" class="me-1"><path d="M228,128a12,12,0,0,1-12,12H140v76a12,12,0,0,1-24,0V140H40a12,12,0,0,1,0-24h76V40a12,12,0,0,1,24,0v76h76A12,12,0,0,1,228,128Z"></path></svg>
            Create Plan
          </Button>
        </CardHeader>
      </Card>

      {/* <CardBody>
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
        </CardBody> */}
      <div className="d-flex justify-content-between">
        <Card style={{ width: '26rem', paddingTop: '20px' }}>
          <div className="p-1">
            <div className="d-flex justify-content-between">
              <div>
                <h2>Starter</h2>
                <p className="mb-2 text-dark">Perfect for small hotels getting started</p>
              </div>
              <div>
                <span className="border rounded bg-primary text-light m-1 px-1" style={{
                  paddingBottom: "5px", paddingTop: "5px"}}>Active</span>
              </div>
            </div>
            <div >
              <p className="fs-1 fw-bolder">$99.00</p>
              <p>per month</p>
            </div>
            <div className="pt-2 border-top">
              <div class="d-flex justify-content-between mb-1">
                <span>Max Rooms</span>
                <span>25</span>
              </div>
              <div className="d-flex justify-content-between mb-1">
                <span>Max Users</span>
                <span>5</span>
              </div>
              <div className="d-flex justify-content-between mb-1">
                <span>Auto Renew</span>
                <span>Yes</span>
              </div>
            </div>
            <div className="pt-2 border-top mb-2">
              <h4 className="fs-5 fw-bolder">Included Modules</h4>
              <div className="d-flex gap-1">
                <span className="px-1 border rounded">Front Office</span>
                <span className="px-1 border rounded">Housekeeping</span>
              </div>
            </div>


            <div className="d-flex justify-content-between">
              <Button color="primary"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-pencil-square me-1" viewBox="0 0 16 16">
                <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456l-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z" />
                <path fill-rule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5v11z" />
              </svg>Edit</Button>
              <Button color="primary"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 256 256" class="me-1"><path d="M216,32H88a8,8,0,0,0-8,8V80H40a8,8,0,0,0-8,8V216a8,8,0,0,0,8,8H168a8,8,0,0,0,8-8V176h40a8,8,0,0,0,8-8V40A8,8,0,0,0,216,32ZM160,208H48V96H160Zm48-48H176V88a8,8,0,0,0-8-8H96V48H208Z"></path></svg>Clone</Button>
              <Button color="primary"><FaArchive /></Button>
            </div>
          </div>
        </Card>

        <Card style={{ width: '26rem', paddingTop: '20px' }}>
          <div className="p-1">
            <div className="d-flex justify-content-between">
              <div>
                <h2>Professional</h2>
                <p className="mb-2 text-dark">Comprehensive solution for growing properties</p>
              </div>
              <div>
                <span className="border rounded bg-primary text-light m-1 px-1" style={{
                  paddingBottom: "5px", paddingTop: "5px"}}>Active</span>
              </div>
            </div>
            <div >
              <p className="fs-1 fw-bolder">$299.00</p>
              <p>per month</p>
            </div>
            <div className="pt-2 border-top">
              <div className="d-flex justify-content-between mb-1">
                <span>Max Rooms</span>
                <span>25</span>
              </div>
              <div className="d-flex justify-content-between mb-1">
                <span>Max Users</span>
                <span>5</span>
              </div>
              <div className="d-flex justify-content-between mb-1">
                <span>Auto Renew</span>
                <span>Yes</span>
              </div>
            </div>
            <div className="pt-2 border-top mb-2">
              <h4 className="fs-5 fw-bolder">Included Modules</h4>
              <div className="d-flex gap-1">
                <span className="px-1 border rounded">Front Office</span>
                <span className="px-1 border rounded">Housekeeping</span>
              </div>
            </div>
            <div className="d-flex justify-content-between">
              <Button color="primary"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-pencil-square me-1" viewBox="0 0 16 16">
                <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456l-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z" />
                <path fill-rule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5v11z" />
              </svg>Edit</Button>
              <Button color="primary"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 256 256" class="me-1"><path d="M216,32H88a8,8,0,0,0-8,8V80H40a8,8,0,0,0-8,8V216a8,8,0,0,0,8,8H168a8,8,0,0,0,8-8V176h40a8,8,0,0,0,8-8V40A8,8,0,0,0,216,32ZM160,208H48V96H160Zm48-48H176V88a8,8,0,0,0-8-8H96V48H208Z"></path></svg>Clone</Button>
              <Button color="primary"><FaArchive /></Button>
            </div>
          </div>
        </Card>
        <Card style={{ width: '26rem', paddingTop: '20px' }}>
          <div className="p-1">
            <div className="d-flex justify-content-between">
              <div>
                <h2>Enterprise</h2>
                <p className="mb-2 text-dark">Perfect for small hotels getting started</p>
              </div>
              <div>
                <span className="border rounded bg-primary text-light m-1 px-1" style={{
                  paddingBottom: "5px", paddingTop: "5px"}}>Active</span>
              </div>
            </div>
            <div >
              <p className="fs-1 fw-bolder">$2,999.00</p>
              <p>per 365 days</p>
            </div>
            <div className="pt-2 border-top mb-1">
              <div className="d-flex justify-content-between mb-1">
                <span>Max Rooms</span>
                <span>25</span>
              </div>
              <div className="d-flex justify-content-between mb-1">
                <span>Max Users</span>
                <span>5</span>
              </div>
              <div className="d-flex justify-content-between mb-1">
                <span>Auto Renew</span>
                <span>Yes</span>
              </div>
            </div>
            <div className="pt-2 border-top mb-2">
              <h4 className="fs-5 fw-bolder">Included Modules</h4>
              <div className="d-flex gap-1">
                <span className="px-1 border rounded">Front Office</span>
                <span className="px-1 border rounded">Housekeeping</span>
              </div>
            </div>

            <div className="d-flex justify-content-between">
              <Button color="primary"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-pencil-square me-1" viewBox="0 0 16 16">
                <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456l-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z" />
                <path fill-rule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5v11z" />
              </svg>Edit</Button>
              <Button color="primary"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 256 256" class="me-1"><path d="M216,32H88a8,8,0,0,0-8,8V80H40a8,8,0,0,0-8,8V216a8,8,0,0,0,8,8H168a8,8,0,0,0,8-8V176h40a8,8,0,0,0,8-8V40A8,8,0,0,0,216,32ZM160,208H48V96H160Zm48-48H176V88a8,8,0,0,0-8-8H96V48H208Z"></path></svg>Clone</Button>
              <Button color="primary"><FaArchive /></Button>
            </div>
          </div>
        </Card>
      </div>



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

export default GuestTable;
