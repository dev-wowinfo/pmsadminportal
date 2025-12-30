import React, { useEffect, useState } from "react";
import {
  Card,
  CardTitle,
  CardBody,
  CardHeader,
  Row,
  Col,
  Label,
  Table,
  Accordion,
  AccordionBody,
  AccordionHeader,
  AccordionItem,
  Input,
} from "reactstrap";
import Inventory from "./Pages/Inventory";
import Rate from "./Pages/Rate";
// import Restrictions from './Pages/Restriction'
import ScynOTA from "./Pages/ScynOTA";
import Flatpickr from "react-flatpickr";
import "@styles/react/libs/flatpickr/flatpickr.scss";
import moment from "moment";
import TableDetails from "./Pages/TableDetails";
import { FaUserTie } from "react-icons/fa";
import "./RateInventry.scss";
import Select from "react-select";
import { selectThemeColors } from "@utils";
import axios from "../../API/axios";
import { useSelector } from "react-redux";
import DeleteIcon from '@mui/icons-material/Delete';

const RateInventory = () => {
  useEffect(() => {
    const prevTitle = document.title;
    document.title = "PMS-Rate & Inventory";

    return () => {
      document.title = prevTitle;
    };
  }, []);
  const getUserData = useSelector((state) => state.userManageSlice.userData);

  const { LoginID, Token } = getUserData;
  let roleType = getUserData?.UserRoleType;
  const [RoomTypeID, setRoomType] = useState("");
  const [count, setCount] = useState([]);
  const [open, setOpen] = useState(1);
  const [rateRefresh, setRateRefresh] = useState(false);
  const [typeRefresh, setTypeRefresh] = useState(false);
  const [selected_date, setSelected_date] = useState(new Date());
  const [mealPlanArr, setMealPlanArr] = useState([]);
  const [selMeal, setSelMeal] = useState("");

  const [roomTypeDropdown, setRoomTypeDropdown] = useState([]);
  const [rateInventory, setRateInventory] = useState([]);

  const [flag, setFlag] = useState(false);
  const handleFlag = () => setFlag(!flag);

  const toggle = (id) => {
    open === id ? setOpen("") : setOpen(id);
  };
  useEffect(() => {
    const localcount = [];
    for (let i = 0; i < 15; i++) {
      console.log("for called, ", i);
      if (i === 0) {
        localcount.push(moment(selected_date).format("ddd D MMM YY"));
      } else {
        localcount.push(
          moment(selected_date).add(i, "days").format("ddd D MMM YY")
        );
      }
    }
    setCount(localcount);
    console.log("count-", count);
  }, [selected_date]);

  // const userId = localStorage.getItem('user-id')
  // console.log('User Id = ', userId)
  const [roomTypeOptions, setRoomTypeOptions] = useState([]);

  const roomTypeDropdownBody = () => {
    setRoomTypeDropdown([]);
    try {
      const roomTypeBody = {
        LoginID,
        Token,
        Seckey: "abc",
        Event: "select",
      };
      console.log("roomtypebody - ", roomTypeBody);
      axios
        .post("/getdata/bookingdata/roomdetails", roomTypeBody)
        .then((response) => {
          const roomTypeData = response?.data[0];
          if (
            roomTypeData &&
            roomTypeData?.length > 0 &&
            roomTypeData[0]?.roomID
          ) {
            setRoomTypeDropdown(roomTypeData);
            console.log("Room Category api Response", response?.data[0]);
          } else {
            console.log("Room Category hard coded response", roomTypeDropdown);
            console.log("Room Category wrong response", roomTypeData);
          }
        });
    } catch (error) {
      console.log("Room Category Dropdown Error", error.message);
    }
    if (roomTypeDropdown.length === 0) {
      setTypeRefresh(true);
      console.log("type...r..e..f..r..e..s..h..i..n..g");
    }
  };

  useEffect(() => {
    roomTypeDropdownBody();
    console.log("ddown - ", roomTypeDropdown);
  }, [typeRefresh, flag]);

  useEffect(() => {
    setRoomTypeOptions(
      roomTypeDropdown?.map((roomType) => {
        return {
          value: roomType.roomID,
          label: `${roomType.roomDisplayName} - ${roomType.ratePlanID}`,
        };
      })
    );
    console.log("ddown ops - ", roomTypeOptions);
  }, [roomTypeDropdown]);

  const rateInventoryList = () => {
    setRateInventory([]);
    try {
      const rateInventoryBody = {
        LoginID,
        Token,
        Seckey: "abc",
        FromDate: moment(selected_date).format("y-MM-DD HH:mm:ss"),
        Todate: moment(selected_date)
          .add(15, "days")
          .format("y-MM-DD HH:mm:ss"),
        RatePlanID: selMeal,
      };
      console.log("rateInventoryBody - ", rateInventoryBody);

      axios
        .post("/getdata/rateinventory", rateInventoryBody)
        .then((response) => {
          console.log("Rateres", response);
          const rateInventoryData = response?.data[0];
          if (
            rateInventoryData &&
            rateInventoryData?.length > 0 &&
            rateInventoryData[0].priceValidOnDate
          ) {
            setRateInventory((prev) => [...prev, rateInventoryData]);
            console.log("Rate inventory api response > ", response?.data[0]);
          } else {
            console.log("Hard Coded Rate Inventory response", rateInventory);
            console.log("wrong Rate Inventory response", rateInventoryData);
          }
        });
    } catch (error) {
      console.log("Rate Inventory Error", error.message);
    }
    if (rateInventory.length === 0) {
      setRateRefresh(true);
      console.log("r..e..f..r..e..s..h..i..n..g");
    }
  };

  useEffect(() => {
    rateInventoryList();
  }, [selected_date, rateRefresh, selMeal, flag]);

  const getMealPlans = async () => {
    try {
      let obj = {
        LoginID,
        Token,
        Seckey: "abc",
        Event: "selectall",
      };
      const res = await axios.post(`/getdata/mealdetails`, obj);
      console.log("resRate", res);
      let result = res?.data[0];
      if (result.length > 0) {
        let arr = result.map((m) => {
          return { value: m.ratePlanID, label: m.ratePlan, ...m };
        });
        setMealPlanArr(arr);
        setSelMeal(arr[0].value);
      } else {
        setMealPlanArr([]);
      }
    } catch (error) {
      console.log("error", error);
    }
  };

  useEffect(() => {
    getMealPlans();
  }, []);

  const dataArr = () => {
    if (RoomTypeID !== "") {
      return roomTypeDropdown
        .filter((r) => r.roomID === RoomTypeID)
        .filter((r) => r.ratePlanID === selMeal);
    } else {
      return roomTypeDropdown.filter((r) => r.ratePlanID === selMeal);
    }
  };

  return (
    <>
      <Card>
        <CardHeader>
          {/* <CardTitle></CardTitle> */}
          <div>
            <h4>Notifications</h4>
            <p>System alerts and important updates</p>
          </div>
        </CardHeader>
        <CardBody>
          <Row md={12} className="d-flex justify-content-center notifcation-container">
            <div className="notifications d-flex justify-content-center">
              <div className="svg d-flex flex-column align-items-center justify-content-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="48"
                  height="48"
                  fill="currentColor"
                  viewBox="0 0 256 256"
                  class="text-success mx-auto mb-1"
                >
                  <path
                    d="M224,128a96,96,0,1,1-96-96A96,96,0,0,1,224,128Z"
                    opacity="0.2"
                  ></path>
                  <path d="M173.66,98.34a8,8,0,0,1,0,11.32l-56,56a8,8,0,0,1-11.32,0l-24-24a8,8,0,0,1,11.32-11.32L112,148.69l50.34-50.35A8,8,0,0,1,173.66,98.34ZM232,128A104,104,0,1,1,128,24,104.11,104.11,0,0,1,232,128Zm-16,0a88,88,0,1,0-88,88A88.1,88.1,0,0,0,216,128Z"></path>
                </svg>
                <p>No notifications at this time</p>
              </div>
            </div>
          </Row>
        </CardBody>
        <CardBody>

          {/**** First Notification Card ***/}

          <Row md={12} className="d-flex justify-content-center notifcation-container ">

            <div data-slot="card-content" class="text-card-foreground flex flex-col gap-6 rounded-xl py-2 shadow-sm border-2 transition-all bg-warning/10 border-warning/20 px-3">
              {/* <div class="d-flex  gap-4"> */}

              <div class="d-flex justify-content-between space-y-2">

                <div class="d-flex">
                  <div class="mt-0.5 me-2">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 256 256" class="text-warning"><path d="M236.8,188.09,149.35,36.22h0a24.76,24.76,0,0,0-42.7,0L19.2,188.09a23.51,23.51,0,0,0,0,23.72A24.35,24.35,0,0,0,40.55,224h174.9a24.35,24.35,0,0,0,21.33-12.19A23.51,23.51,0,0,0,236.8,188.09ZM120,104a8,8,0,0,1,16,0v40a8,8,0,0,1-16,0Zm8,88a12,12,0,1,1,12-12A12,12,0,0,1,128,192Z"></path>
                    </svg>
                  </div>

                  <div class="d-flex justify-between gap-4">
                    <div class="flex-1">
                      <div class="d-flex items-center gap-2 mb-1">
                        <h3 class="font-semibold text-foreground">License Expiring Soon</h3>
                         <p class="d-flex justify-center rounded border px-1 font-medium bg-primary text-white">New</p>
                      </div>
                      <p class="text-sm text-foreground/80">The license for Grand Plaza Hotel will expire in 25 days. Consider reaching out to discuss renewal options.</p><p class="text-xs text-muted-foreground mt-2">Hotel: Grand Plaza Hotel</p>
                      <div class="d-flex items-center gap-4 text-xs text-muted-foreground"><span>Jun 20, 2024 14:30</span>
                        <span data-slot="badge" class="inline-flex items-center justify-center rounded border px-2 py-0.5 ">Expiry</span>
                      </div>
                    </div>

                  </div>
                </div>


                <div class="d-flex">
                  <div>
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 256 256"><path d="M176.49,95.51a12,12,0,0,1,0,17l-56,56a12,12,0,0,1-17,0l-24-24a12,12,0,1,1,17-17L112,143l47.51-47.52A12,12,0,0,1,176.49,95.51ZM236,128A108,108,0,1,1,128,20,108.12,108.12,0,0,1,236,128Zm-24,0a84,84,0,1,0-84,84A84.09,84.09,0,0,0,212,128Z"></path>
                    </svg>
                  </div>
                  <div className="ms-2">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 256 256"><path d="M216,48H180V36A28,28,0,0,0,152,8H104A28,28,0,0,0,76,36V48H40a12,12,0,0,0,0,24h4V208a20,20,0,0,0,20,20H192a20,20,0,0,0,20-20V72h4a12,12,0,0,0,0-24ZM100,36a4,4,0,0,1,4-4h48a4,4,0,0,1,4,4V48H100Zm88,168H68V72H188ZM116,104v64a12,12,0,0,1-24,0V104a12,12,0,0,1,24,0Zm48,0v64a12,12,0,0,1-24,0V104a12,12,0,0,1,24,0Z"></path>
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </Row>

          {/* Second Notification Card */}

          <Row md={12} className="d-flex justify-content-center notifcation-container mt-3">
            <div data-slot="card-content" class="text-card-foreground flex flex-col gap-6 rounded-xl py-2 shadow-sm border-2 transition-all bg-warning/10 border-warning/20 px-3 ">
              {/* <div class="d-flex  gap-4"> */}

              <div class="d-flex justify-content-between space-y-2">

                <div class="d-flex">
                  <div class="mt-0.5 me-2">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 256 256" class="text-info"><path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm-4,48a12,12,0,1,1-12,12A12,12,0,0,1,124,72Zm12,112a16,16,0,0,1-16-16V128a8,8,0,0,1,0-16,16,16,0,0,1,16,16v40a8,8,0,0,1,0,16Z"></path></svg>
                  </div>

                  <div class="d-flex justify-between gap-4">
                    <div class="flex-1">
                      <div class="d-flex items-center gap-2 mb-1">
                        <h3 class="font-semibold text-foreground">Trial Period Ending</h3>
                         <p class="d-flex justify-center rounded border px-1 font-medium bg-primary text-white">New</p>
                      </div>
                      <p class="text-sm text-foreground/80">Mountain View Lodge's trial period will end in 7 days. This is a good opportunity to convert them to a paid subscription.</p><p class="text-xs text-muted-foreground mt-2">Hotel: Mountain View Lodge</p>
                      <div class="d-flex items-center gap-4 text-xs text-muted-foreground"><span>Mar 24, 2024 15:30</span>
                        <span data-slot="badge" class="inline-flex items-center justify-center rounded border px-2 py-0.5 ">Trial Ending</span>
                      </div>
                    </div>

                  </div>
                </div>

                <div class="d-flex">
                  <div>
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 256 256"><path d="M176.49,95.51a12,12,0,0,1,0,17l-56,56a12,12,0,0,1-17,0l-24-24a12,12,0,1,1,17-17L112,143l47.51-47.52A12,12,0,0,1,176.49,95.51ZM236,128A108,108,0,1,1,128,20,108.12,108.12,0,0,1,236,128Zm-24,0a84,84,0,1,0-84,84A84.09,84.09,0,0,0,212,128Z"></path>
                    </svg>
                  </div>
                  <div className="ms-2">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 256 256"><path d="M216,48H180V36A28,28,0,0,0,152,8H104A28,28,0,0,0,76,36V48H40a12,12,0,0,0,0,24h4V208a20,20,0,0,0,20,20H192a20,20,0,0,0,20-20V72h4a12,12,0,0,0,0-24ZM100,36a4,4,0,0,1,4-4h48a4,4,0,0,1,4,4V48H100Zm88,168H68V72H188ZM116,104v64a12,12,0,0,1-24,0V104a12,12,0,0,1,24,0Zm48,0v64a12,12,0,0,1-24,0V104a12,12,0,0,1,24,0Z"></path>
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </Row>

            {/*** Third Notification Card ***/}

          <Row md={12} className="d-flex justify-content-center notifcation-container mt-3">
            <div data-slot="card-content" class="text-card-foreground flex flex-col gap-6 rounded-xl py-2 shadow-sm border-2 transition-all bg-warning/10 border-warning/20 px-3 bg-pink">
              {/* <div class="d-flex  gap-4"> */}

              <div class="d-flex justify-content-between space-y-2">

                <div class="d-flex">
                  <div class="mt-0.5 me-2">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 256 256" class="text-danger"><path d="M236.8,188.09,149.35,36.22h0a24.76,24.76,0,0,0-42.7,0L19.2,188.09a23.51,23.51,0,0,0,0,23.72A24.35,24.35,0,0,0,40.55,224h174.9a24.35,24.35,0,0,0,21.33-12.19A23.51,23.51,0,0,0,236.8,188.09ZM120,104a8,8,0,0,1,16,0v40a8,8,0,0,1-16,0Zm8,88a12,12,0,1,1,12-12A12,12,0,0,1,128,192Z"></path></svg>
                  </div>

                  <div class="d-flex justify-between gap-4">
                    <div class="flex-1">
                      <div class="d-flex items-center gap-2 mb-1">
                        <h3 class="font-semibold text-foreground">Payment Failed</h3>
                        {/* <span data-slot="badge" class="d-flex justify-center rounded border px-1 font-medium bg-primary text-white">New</span> */}
                        <p class="d-flex justify-center rounded border px-1 font-medium bg-primary text-white">New</p>
                      </div>
                      <p class="text-sm text-foreground/80">Automatic renewal payment for City Center Suites has failed. The license is now in grace period. Please contact the customer immediately.</p><p class="text-xs text-muted-foreground mt-2">Hotel: City Center Suites</p>
                      <div class="d-flex items-center gap-4 text-xs text-muted-foreground"><span>Feb 21, 2024 12:00</span>
                        <span data-slot="badge" class="inline-flex items-center justify-center rounded border px-2 py-0.5 ">Payment Failed</span>
                      </div>
                    </div>

                  </div>
                </div>

                <div class="d-flex">
                  <div>
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 256 256"><path d="M176.49,95.51a12,12,0,0,1,0,17l-56,56a12,12,0,0,1-17,0l-24-24a12,12,0,1,1,17-17L112,143l47.51-47.52A12,12,0,0,1,176.49,95.51ZM236,128A108,108,0,1,1,128,20,108.12,108.12,0,0,1,236,128Zm-24,0a84,84,0,1,0-84,84A84.09,84.09,0,0,0,212,128Z"></path>
                    </svg>
                  </div>
                  <div className="ms-2">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 256 256"><path d="M216,48H180V36A28,28,0,0,0,152,8H104A28,28,0,0,0,76,36V48H40a12,12,0,0,0,0,24h4V208a20,20,0,0,0,20,20H192a20,20,0,0,0,20-20V72h4a12,12,0,0,0,0-24ZM100,36a4,4,0,0,1,4-4h48a4,4,0,0,1,4,4V48H100Zm88,168H68V72H188ZM116,104v64a12,12,0,0,1-24,0V104a12,12,0,0,1,24,0Zm48,0v64a12,12,0,0,1-24,0V104a12,12,0,0,1,24,0Z"></path>
                    </svg>
                  </div>
                </div>
              </div>
            </div>

          </Row>
        </CardBody>
      </Card>

    </>
  );
};

export default RateInventory;
