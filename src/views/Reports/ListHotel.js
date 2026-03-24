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
import UpdateHotel from "../FrontDesk/UpdateHotel";
const ListHotel = () => {
  useEffect(() => {
    const prevTitle = document.title;
    document.title = "PMS-Hotel List";

    return () => {
      document.title = prevTitle;
    };
  }, []);

  const getUserData = useSelector((state) => state.userManageSlice.userData);

  const [showUpdate, setShowUpdate] = useState(false);
  const handleUpdateHotel = () => setShowUpdate(!showUpdate);

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

  const staticData = [
    {
      // id: 12222000372122,
      hotel: "Grand Plaza Hotel",
      city: "Mumbai",
      phone: "+919677734223",
      rooms: "150",
      active: "12",
      status: "Active",
      date: "Jun 02,2025",
    },
    {
      // id: 12222000372111,
      hotel: "Royal Inn",
      city: "Delhi",
      phone: "+918222245634",
      rooms: "75",
      active: "8",
      status: "Trial",
      date: "Sep 30,2025",
    },
  ];

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
      name: "Industry",
      sortable: true,
      width: "12rem",
      selector: (row) => row.phone,
    },
    {
      name: "Phone",
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
              handleUpdateHotel();
              //   setGuestId(row.guestID);
            }}
            size={15}
          />
          <Archive
            className="me-1 cursor-pointer"
            size={15}
            onClick={() => {
            //    handleUpdateHotel();
              // setPromoId(row.promotionId);
            }}
          />
        </>
      ),
    },
  ];

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

        <Row className="align-items-end ms-2">
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
        {/* <div className="react-dataTable pt-2">
          <DataTable
            noHeader
            pagination
            data={staticData}
            columns={Columns}
            className="react-dataTable ms-3"
            sortIcon={<ChevronDown size={10} />}
            paginationRowsPerPageOptions={[10, 25, 50, 100]}
          />
        </div> */}
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

      <UpdateHotel
        // setShowUpdate={setShowUpdate}
        handleUpdateHotel={handleUpdateHotel}
        showUpdate={showUpdate}
      />
    </>
  );
};

export default ListHotel;
