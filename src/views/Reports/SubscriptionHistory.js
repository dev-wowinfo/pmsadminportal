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
import axios from "../../API/axios";
import { useSelector } from "react-redux";
import moment from "moment";

const SubscriptionHistory = () => {
  useEffect(() => {
    const prevTitle = document.title;
    document.title = "PMS-Payment Folio";

    return () => {
      document.title = prevTitle;
    };
  }, []);

  function subtractMonths(date, months) {
    date.setMonth(date.getMonth() - months);
    return date;
  }
  const getUserData = useSelector((state) => state.userManageSlice.userData);
  const { LoginID, Token } = getUserData;
  const [fromDate, setFromDate] = useState(
    moment(subtractMonths(new Date(), 1)).format("YYYY-MM-DD"),
  );
  const [toDate, setToDate] = useState(moment(new Date()).format("YYYY-MM-DD"));
  const [bookingData, setBookingData] = useState([]);
  console.log(toDate, fromDate);

  //   const columns = [
  //     {
  //       name: "bookingID",
  //       label: "Booking Id",
  //     },
  //     {
  //       name: "paymentType",
  //       label: "Payment Type",
  //     },
  //     {
  //       name: "paymentDate",
  //       label: "Payment Date",
  //     },
  //     {
  //       name: "referenceText",
  //       label: "Reference Text",
  //     },
  //     {
  //       name: "paidAmount",
  //       label: "Paid Amount",
  //     },
  //     {
  //       name: "invNo",
  //       label: "Invoice Number",
  //     },
  //   ];

  const data = [
    {
      name: "Adani Cement",
      type: "Enterprises",
      status: "Active",
      startdates: "Aug 02, 2025",
      enddates: "Aug 02, 2026",
      rooms: "₹30000",
      user: "50",
      action: "btns",
    },
    {
      name: "LNT",
      type: "Professional",
      status: "Active",
      startdates: "Nov 30, 2025",
      enddates: "May 30, 2026",
      rooms: "₹2000",
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
    // {
    //   name: "Purchase Plan",
    //   sortable: true,
    //   cell: (row) => <span>{row.type}</span>,
    // },
    {
      name: "Plan",
      sortable: true,
      minWidth: "10px",
      cell: (row) => <span>{row.rooms}</span>,
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

  ];

  const options = {
    filterType: "dropdown",
    download: true,
  };
  const handelReset = async () => {
    // setDType("");
    setFromDate(moment(new Date()).format("YYYY-MM-DD"));
    setToDate(moment(new Date()).format("YYYY-MM-DD"));
    try {
      const res = await axios.get(
        `/Reports/GuestDetails?FromDate=${moment(
          subtractMonths(new Date(), 1),
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
        `/Reports/PaymentFolioDetails?FromDate=${moment(fromDate).format(
          "YYYY-MM-DD",
        )}&ToDate=${moment(toDate).format("YYYY-MM-DD")}`,
        {
          headers: {
            LoginID,
            Token,
          },
        },
      );
      console.log("resData", res.data[0]);
      setBookingData(res?.data[0]);
    } catch (error) {
      console.log("error", error);
    }
  };

  useEffect(() => {
    getBookingData();
  }, [fromDate, toDate]);

  return (
    <>
      {/* <Card>
        <CardHeader>
          <CardTitle>
            <h2>Subscription History</h2>
          </CardTitle>
        </CardHeader>
        <CardBody className="text-center">
          <Row className="align-items-end">
            <Col className="text-start">
              <Label className="form-label" for="startDate">
                From Date
              </Label>
             
              <Flatpickr
                className="form-control"
                value={fromDate}
                onChange={(date) => {
                  setFromDate(moment(date[0]).format("YYYY-MM-DD"));
                }}
                id="startDate"
                options={{
                  altInput: true,
                  dateFormat: "Y-m-d",
                }}
              />
              
            </Col>
            <Col className="text-start">
              <Label className="form-label" for="endDate">
                To Date
              </Label>
            
              <Flatpickr
                className="form-control"
                value={toDate}
                onChange={(date) => {
                  setToDate(moment(date[0]).format("YYYY-MM-DD"));
                }}
                id="endDate"
                options={{
                  altInput: true,
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
      </Card> */}

      <Card>
        <CardHeader>
          <CardTitle>
            <h2>Subscription History</h2>
          </CardTitle>

        </CardHeader>
        <Row className="align-items-end ms-2">
          <Col className="text-start">
            <Label className="form-label" for="startDate">
              From Date
            </Label>

            <Flatpickr
              className="form-control"
              value={fromDate}
              onChange={(date) => {
                setFromDate(moment(date[0]).format("YYYY-MM-DD"));
              }}
              id="startDate"
              options={{
                altInput: true,
                dateFormat: "Y-m-d",
              }}
            />

          </Col>
          <Col className="text-start">
            <Label className="form-label" for="endDate">
              To Date
            </Label>

            <Flatpickr
              className="form-control"
              value={toDate}
              onChange={(date) => {
                setToDate(moment(date[0]).format("YYYY-MM-DD"));
              }}
              id="endDate"
              options={{
                altInput: true,
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
        <CardBody>
          <Row className="my-1">
            <Col>
              <DataTable
                noHeader
                data={data}
                columns={basicColumns}
                className="react-dataTable"
              />
            </Col>
          </Row>
        </CardBody>
      </Card>
    </>
  );
};

export default SubscriptionHistory;
