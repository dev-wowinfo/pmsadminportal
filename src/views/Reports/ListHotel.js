import React, { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  CardTitle,
  Col,
  InputGroup,
  InputGroupText,
  Label,
  Row,
  Badge,
} from "reactstrap";
import {
  ChevronDown,
  MoreVertical,
  Edit,
  FileText,
  Archive,
  Trash,
  Eye,
  EyeOff,
} from "react-feather";
import Flatpickr from "react-flatpickr";
import { MdDateRange } from "react-icons/md";
import Select from "react-select";
import { selectThemeColors } from "@utils";
import axios from "../../API/axios";
import { useSelector } from "react-redux";
import moment from "moment";
const ListHotel = () => {
  useEffect(() => {
    const prevTitle = document.title;
    document.title = "PMS-Hotel List";

    return () => {
      document.title = prevTitle;
    };
  }, []);

  const getUserData = useSelector((state) => state.userManageSlice.userData);
  const { LoginID, Token } = getUserData;
  const [fromDate, setFromDate] = useState(
    moment(new Date()).format("YYYY-MM-DD"),
  );
  const [toDate, setToDate] = useState(moment(new Date()).format("YYYY-MM-DD"));
  const [bookingdata, setBookingdata] = useState([]);
  console.log("bookingdata", bookingdata);
  const [dType, setDType] = useState("");
  // console.log(dType, toDate, fromDate);
  const dateType = [
    { value: "", label: "" },
    { value: "Booking Date", label: "Booking Date" },
    { value: "Checkin Date", label: "Checkin Date" },
    { value: "Checkout Date", label: "Checkout Date" },
  ];

  const data = [
    {
      name: "Adani Cement",
      type: "Enterprises",
      status: "Active",
      startdates: "Aug 02, 2025",
      enddates: "Aug 02, 2026",
      rooms: "500",
      user: "50",
      action: "btns",
    },
    {
      name: "LNT",
      type: "Professional",
      status: "Active",
      startdates: "Nov 30, 2025",
      enddates: "May 30, 2026",
      rooms: "100",
      user: "15",
      action: "btns",
    },
  ];

  const basicColumns = [
    {
      name: "Client List",
      sortable: true,
      minWidth: "250px",
      cell: (row) => <span>{row.name}</span>,
    },
    {
      name: "Purchase Plan",
      sortable: true,
      cell: (row) => <span>{row.type}</span>,
    },
    {
      name: "Status",
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
      name: "Start Date",
      sortable: true,
      // minWidth: '310px',
      cell: (row) => <span>{row.startdates}</span>,
    },
    {
      name: "Expiry Date",
      sortable: true,
      // minWidth: '250px',
      cell: (row) => <span>{row.enddates}</span>,
    },
    {
      name: "Projects",
      sortable: true,
      minWidth: "10px",
      cell: (row) => <span>{row.rooms}</span>,
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
      //  minWidth: '150px',
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
  // const columns = [
  //   // {
  //   //     name: "guestName",
  //   //     label: "Guest Name",
  //   // },
  //   // {
  //   //     name: "guestEmail",
  //   //     label: "Guest Email",
  //   // },
  //   // {
  //   //     name: "guestMobileNumber",
  //   //     label: "Guest Mobile Number",
  //   // },
  //   // {
  //   //     name: "discount",
  //   //     label: "Discount",
  //   // },
  //   // {
  //   //     name: "roomAmount",
  //   //     label: "Room Amount",
  //   // },
  //   // {
  //   //     name: "ottalTax",
  //   //     label: "Total Tax",
  //   // },
  //   // {
  //   //     name: "roomAmountIncTax",
  //   //     label: "Room AmountIncTax",
  //   // },
  //   // {
  //   //     name: "laundaryAMT",
  //   //     label: "Laundary Amount",
  //   // },
  //   // {
  //   //     name: "posAmount",
  //   //     label: "POS Amount",
  //   // },
  //   // {
  //   //     name: "extraServiceAMT",
  //   //     label: "Extra Service Amount"
  //   // },
  //   // {
  //   //     name: "totalAmount",
  //   //     label: "Total Amount (BKG)",
  //   // },
  //   // {
  //   //     name: "recievedAmount",
  //   //     label: "Recieved Amount",
  //   // },
  //   // {
  //   //     name: "pendingAmount",
  //   //     label: "Pending Amount",
  //   // },
  //   // {
  //   //     name: "status",
  //   //     label: "Status",
  //   // },
  //   //         {
  //   //             name: "assign Room",
  //   //             label: "Assign Room",
  //   //             options: {
  //   //     customBodyRenderLite: (dataIndex) => bookingdata[dataIndex]["assing Room"],
  //   //   },
  //   //         },
  //   //         {
  //   //             name: "invNo",
  //   //             label: "Invoice No",
  //   //         },
  // ];

  // const data = [
  //     { bookingId: "Joe James", hotelName: "Test Corp", source: "Yonkers", roomType: "NY", noofRooms: '1', noofAdults: '1' },
  //     { bookingId: "John Walsh", hotelName: "Test Corp", source: "Hartford", roomType: "CT", noofRooms: '1', noofAdults: '1' },
  //     { bookingId: "Bob Herm", hotelName: "Test Corp", source: "Tampa", roomType: "FL", noofRooms: '1', noofAdults: '1' },
  //     { bookingId: "James Houston", hotelName: "Test Corp", source: "Dallas", roomType: "TX", noofRooms: '1', noofAdults: '1' },
  // ];

  const options = {
    filterType: "dropdown",
    download: true,
  };
  const handelReset = async () => {
    setDType("");
    setFromDate(moment(new Date()).format("YYYY-MM-DD"));
    setToDate(moment(new Date()).format("YYYY-MM-DD"));
    try {
      const res = await axios.get(
        `/Reports/BookinDetails?FromDate=${moment(new Date()).format(
          "YYYY-MM-DD",
        )}&ToDate=${moment(new Date()).format("YYYY-MM-DD")}&FetchType=`,
        {
          headers: {
            LoginID,
            Token,
          },
        },
      );
      console.log("resData", res.data[0]);
      setBookingdata(res?.data[0]);
    } catch (error) {
      console.log("error", error);
    }
  };
  const getBookingData = async () => {
    try {
      const res = await axios.get(
        `/Reports/BookinDetails?FromDate=${moment(fromDate).format(
          "YYYY-MM-DD",
        )}&ToDate=${moment(toDate).format("YYYY-MM-DD")}&FetchType=${dType}`,
        {
          headers: {
            LoginID,
            Token,
          },
        },
      );
      // console.log('resData', res.data[0])
      setBookingdata(res?.data[0]);
    } catch (error) {
      console.log("error", error);
    }
  };
  useEffect(() => {
    getBookingData();
  }, []);

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>
            <h2>Clients Lists</h2>
          </CardTitle>
        </CardHeader>
        <CardBody className="text-center">
          <Row className="align-items-end">
            <Col className="text-start">
              <Label className="form-label" for="dateType">
                Date Type
              </Label>
              <Select
                theme={selectThemeColors}
                className="react-select"
                classNamePrefix="select"
                // defaultValue={dateType[0]}
                onChange={(e) => {
                  // console.log(e.value);
                  setDType(e.value);
                }}
                value={dateType?.filter((c) => c.value === dType)}
                options={dateType}
                isClearable={false}
              />
            </Col>
            <Col className="text-start">
              <Label className="form-label" for="startDate">
                From Date
              </Label>
              <Flatpickr
                className="form-control"
                value={moment(fromDate).format("YYYY-MM-DD")}
                onChange={(date) => {
                  setFromDate(moment(date[0]).format("YYYY-MM-DD"));
                }}
                id="startDate"
                options={{
                  altInput: true,
                  // altFormat: 'F j, Y',
                  dateFormat: "Y-m-d",
                }}
              />
            </Col>
            <Col className="text-start">
              <Label className="form-label" for="startDate">
                To Date
              </Label>
              <Flatpickr
                className="form-control"
                value={toDate}
                onChange={(date) => {
                  setToDate(moment(date[0]).format("YYYY-MM-DD"));
                }}
                id="startDate"
                options={{
                  altInput: true,
                  // altFormat: 'F j, Y',
                  dateFormat: "Y-m-d",
                }}
              />
            </Col>
            <Col>
              <Button className="me-1" color="primary" onClick={getBookingData}>
                Search
              </Button>
              <Button className="me-1" color="primary" onClick={handelReset}>
                Reset
              </Button>
            </Col>
          </Row>
        </CardBody>
        <div className="react-dataTable pt-2">
          <DataTable
            noHeader
            pagination
            data={data}
            columns={basicColumns}
            className="react-dataTable ms-3"
            sortIcon={<ChevronDown size={10} />}
            paginationRowsPerPageOptions={[10, 25, 50, 100]}
          />
        </div>
      </Card>
    </>
  );
};

export default ListHotel;
