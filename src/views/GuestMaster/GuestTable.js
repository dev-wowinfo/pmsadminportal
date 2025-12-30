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
import NewGuest from "./NewGuest";
import GuestEdit from "./GuestEdit";

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
          <CardTitle>Guest</CardTitle>
          <input type="text" placeholder="search" className="form-control input-default w-50" onChange={e => setQuery(e.target.value)} />
          <Button color="primary" onClick={() => { setNewGuest(true); }}>
            Add Guest
          </Button>
        </CardHeader>
        <CardBody>
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

export default GuestTable;
