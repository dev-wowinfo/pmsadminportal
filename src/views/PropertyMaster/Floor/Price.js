import { React, useEffect, useState } from "react";
import Select from "react-select";
import { selectThemeColors } from "@utils";
import { ChevronDown, Edit, Trash } from "react-feather";
import DataTable from "react-data-table-component";
import { FaArchive } from "react-icons/fa";
import {
  Badge,
  Button,
  Input,
  Label,
  Modal,
  ModalBody,
  ModalHeader,
  Card,
  CardBody,
  CardHeader,
  CardTitle,
  Col,
  Row,
  Spinner,
} from "reactstrap";
import axios from "../../../API/axios";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";

const Price = () => {
  useEffect(() => {
    const prevTitle = document.title;
    document.title = "PMS-Floor";

    return () => {
      document.title = prevTitle;
    };
  }, []);

  const getUserData = useSelector((state) => state.userManageSlice.userData);

  const { LoginID, Token } = getUserData;

  const [roomList, setRoomList] = useState([]);

  const [sel_room, setSel_room] = useState();

  const [show, setShow] = useState(false);
  const handleModal = () => setShow(!show);

  const [showEdit, setShowEdit] = useState(false);
  const handleEditModal = () => setShowEdit(!showEdit);

  const [del, setDel] = useState(false);

  const [roomTypeDropDown, setRoomTypeDropDown] = useState([]);

  const [loader, setLoader] = useState(false);

  const [dropdownLoader, setDropdownLoader] = useState(false);
  const [roomStatusDropDown, setRoomStatusDropDown] = useState([]);

  // const userId = localStorage.getItem('user-id')

  const roomTypeDropDownList = () => {
    setDropdownLoader(true);
    const roomTypeDropDownBody = {
      LoginID,
      Token,
      Seckey: "abc",
      Event: "selectall",
    };
    try {
      axios
        .post(`/getdata/bookingdata/roomdetails`, roomTypeDropDownBody)
        .then((response) => {
          console.log("response", response?.data[0]);
          let res = response?.data[0].filter((r) => r.roomTypeID);
          console.log("gg", res);
          let uniq = Object.values(
            res.reduce((acc, obj) => ({ ...acc, [obj.roomID]: obj }), {}),
          );
          console.log("ggg", uniq);
          // setRoomTypeDropDown(response?.data[0])
          setRoomTypeDropDown(uniq);
          setDropdownLoader(false);
        });
    } catch (error) {
      setDropdownLoader(false);
      console.log("Room Type DropDown Error", error.message);
    }
  };
  const roomTypeDropDownOptions =
    roomTypeDropDown?.length && roomTypeDropDown[0]?.roomTypeID
      ? roomTypeDropDown?.map((roomType) => {
          console.log("roomType", roomType);
          return {
            value: roomType.roomID,
            label: `${roomType.roomDisplayName} - ${roomType.status}`,
          };
        })
      : [{ value: "reload", label: "Error loading, click to reload again" }];
  // const roomTypeDropDownOptions = roomTypeDropDown?.length && roomTypeDropDown[0]?.RoomType ? roomTypeDropDown?.map((roomType) => {
  //   return { value: roomType.RoomID, label: roomType.RoomDisplayName }
  // }) : [{ value: 'reload', label: 'Error loading, click to reload again' }]

  const roomStatusDropdown = () => {
    setDropdownLoader(true);
    try {
      const roomStatusDropdownBody = {
        LoginID,
        Token,
        Seckey: "abc",
        Event: "select",
      };
      axios
        .post(`/getdata/bookingdata/roomstatus`, roomStatusDropdownBody)
        .then((statusResponse) => {
          setRoomStatusDropDown(statusResponse?.data[0]);
          setDropdownLoader(false);
        });
    } catch (error) {
      setDropdownLoader(false);
      console.log("Room Type Dropdown Error", error.message);
    }
  };
  // const statusOptions = roomStatusDropDown?.length > 0 && roomStatusDropDown[0]?.Status ? roomStatusDropDown?.map((status) => {
  //   return { value: status.StatusID, label: status.Status }
  // }) : [{ value: 'reload', label: 'Error loading, click to reload again' }]

  const statusOptions = [
    { value: "Active", label: "Active" },
    { value: "Inactive", label: "Inactive" },
  ];

  const floorList = () => {
    setLoader(true);
    const floorListBody = {
      LoginID,
      Token,
      Seckey: "abc",
      Event: "select",
    };
    try {
      axios
        .post(`/getdata/bookingdata/floordetails`, floorListBody)
        .then((response) => {
          console.log("floorData", response?.data[0]);
          setRoomList(response?.data[0]);
          setLoader(false);
        });
    } catch (error) {
      setLoader(false);
      console.log("Floor List Error", error.message);
    }
  };
  // const statusOptions = roomList?.map((status) => {
  //   return { value: status.StatusID, label: status.Status }
  // })

  useEffect(() => {
    floorList();
    roomTypeDropDownList();
    roomStatusDropdown();
  }, []);

  const NewFloorModal = () => {
    const [FloorNo, setFloorNo] = useState("");
    const [RoomNo, setRoomNo] = useState("");
    const [RoomTypeID, setRoomTypeID] = useState("");
    const [StatusID, setStatusID] = useState("");
    const [CleaningStatus, setCleanigStatus] = useState("Clean");
    const [Repair, setRepair] = useState("No");
    const [Maintenance, setMaintenance] = useState("No");
    const [RoomStatus, setRoomStatus] = useState("Empty");
    const [display, setDisplay] = useState(false);

    const handleRoomStatus = (value) => {
      // if (value === 'reload') {
      //   roomStatusDropdown()
      //   return
      // }
      setStatusID(value);
    };

    const handleRoomTypeDropDownList = (value) => {
      if (value === "reload") {
        roomTypeDropDownList();
        return;
      }
      setRoomTypeID(value);
    };

    const handleCleaningStatus = (e) => {
      if (e.target.checked) {
        setCleanigStatus("Dirty");
      } else {
        setCleanigStatus("Clean");
      }
    };

    const handleRepairStatus = (e) => {
      if (e.target.checked) {
        setRepair("Yes");
      } else {
        setRepair("No");
      }
    };

    const handleMaintenanceStatus = (e) => {
      if (e.target.checked) {
        setMaintenance("Yes");
      } else {
        setMaintenance("No");
      }
    };

    const handleRoom_status = (e) => {
      if (e.target.checked) {
        setRoomStatus("Occupied");
      } else {
        setRoomStatus("Empty");
      }
    };

    const insertFloor = () => {
      const insertFloorBody = {
        LoginID,
        Token,
        Seckey: "abc",
        Event: "insert",
        PropertyID: null,
        FloorNo,
        FloorDesc: "",
        RoomID: RoomTypeID,
        RoomNo,
        // RoomTypeID,//not required
        // Description: "",// not required
        Status: StatusID, // changed to only Status
        CleaningStatus,
        RepairRequired: Repair,
        ClosedDueToMaintenance: Maintenance,
        RoomStatus,
      };
      console.log("insertRoomOnFloorBody", insertFloorBody);
      try {
        axios
          .post(`/getdata/bookingdata/floordetails`, insertFloorBody)
          .then((res) => {
            // floorList()
            setRefresh(res);
            console.log(res);
          })
          .catch((error) => {
            toast.error(error.message);
          });
      } catch (error) {
        console.log("Floor Insert Error", error.message);
      }
    };

    const reset = () => {
      setFloorNo("");
      setRoomNo("");
      setRoomTypeID("");
      setStatusID("");
      setCleanigStatus("Clean");
      setRepair("No");
      setMaintenance("No");
      setRoomStatus("Empty");
      setDisplay(false);
    };

    const handleSubmit = () => {
      setDisplay(true);
      if (FloorNo.trim() && RoomTypeID && RoomNo.trim() && StatusID !== "") {
        insertFloor();
        handleModal();
        // toast.success('Form Submitted!', { position: "top-center" })
        reset();
      }
    };
    console.log("Modal show");

    return (
      <>
        <Modal
          isOpen={show}
          toggle={() => {
            reset();
          }}
          className="modal-dialog-centered modal-lg"
        >
          <ModalHeader className="bg-transparent" toggle={handleModal}>
            Add Room to Floor
          </ModalHeader>
          {!dropdownLoader ? (
            <>
              <ModalBody className="px-sm-2 mx-50">
                <>
                  <Row className="mb-1">
                    <Col lg="6" className="mb-md-1">
                      <Label className="form-label">
                        <span className="text-danger">*</span>Floor
                      </Label>
                      <Input
                        type="number"
                        placeholder="Floor Number"
                        value={FloorNo}
                        onChange={(e) => setFloorNo(e.target.value)}
                        invalid={display ? FloorNo.trim() === "" : false}
                      />
                      {display && FloorNo.trim() === "" && (
                        <span className="text-danger">Floor is required</span>
                      )}
                    </Col>
                    <Col lg="6">
                      <Label className="form-label">
                        <span className="text-danger">*</span>Room Type
                      </Label>
                      <Select
                        theme={selectThemeColors}
                        className="react-select w-100"
                        classNamePrefix="select"
                        placeholder="Select Room Type"
                        options={roomTypeDropDownOptions}
                        value={roomTypeDropDownOptions?.filter(
                          (c) => c.value === RoomTypeID,
                        )}
                        onChange={(e) => {
                          handleRoomTypeDropDownList(e.value);
                        }}
                      />
                      {display && RoomTypeID === "" && (
                        <p className="text-danger">Room Category is required</p>
                      )}
                    </Col>
                  </Row>
                  <Row className="mb-1">
                    <Col lg="6" className="mb-md-1">
                      <Label className="form-label">
                        <span className="text-danger">*</span>Room Number
                      </Label>
                      <Input
                        type="text"
                        placeholder="Room Number"
                        value={RoomNo}
                        onChange={(e) => setRoomNo(e.target.value)}
                        invalid={display ? RoomNo.trim() === "" : false}
                      />
                      {display && RoomNo.trim() === "" && (
                        <span className="text-danger">
                          Room Number is required
                        </span>
                      )}
                    </Col>
                    <Col lg="6">
                      <Label className="form-label">
                        <span className="text-danger">*</span>Status
                      </Label>
                      <Select
                        theme={selectThemeColors}
                        className="react-select w-100"
                        classNamePrefix="select"
                        placeholder="Select Room status"
                        options={statusOptions}
                        value={statusOptions?.filter(
                          (c) => c.value === StatusID,
                        )}
                        onChange={(e) => {
                          handleRoomStatus(e.value);
                        }}
                      />
                      {display && StatusID === "" && (
                        <span className="text-danger">
                          Room Status is required
                        </span>
                      )}
                    </Col>
                  </Row>
                  <Row className="my-3 d-flex flex-row flex-wrap">
                    <Col>
                      <h6 className="pb-2">Cleaning Status</h6>
                      <div className="form-switch d-flex flex-row ps-0 align-items-center">
                        <Label for="clean" className="form-check-label">
                          Clean
                        </Label>
                        <Input
                          className="m-1"
                          type="switch"
                          name="primary"
                          id="cleaning"
                          onChange={(e) => handleCleaningStatus(e)}
                        />
                        <Label for="dirty" className="form-check-label">
                          Dirty
                        </Label>
                      </div>
                    </Col>
                    <Col>
                      <h6 className="pb-2">Repair Required</h6>
                      <div className="form-switch d-flex flex-row ps-0 align-items-center">
                        <Label for="repair_no" className="form-check-label">
                          No
                        </Label>
                        <Input
                          className="m-1"
                          type="switch"
                          name="primary"
                          id="repair"
                          onChange={(e) => handleRepairStatus(e)}
                        />
                        <Label for="reapir_yes" className="form-check-label">
                          Yes
                        </Label>
                      </div>
                    </Col>
                    <Col>
                      <h6>Closed due to Maintenance?</h6>
                      <div
                        style={{ marginTop: "12px" }}
                        className="form-switch d-flex flex-row ps-0 align-items-center"
                      >
                        <Label for="maint_no" className="form-check-label">
                          No
                        </Label>
                        <Input
                          className="m-1"
                          type="switch"
                          name="primary"
                          id="maintenance"
                          onChange={(e) => handleMaintenanceStatus(e)}
                        />
                        <Label for="maint_yes" className="form-check-label">
                          Yes
                        </Label>
                      </div>
                    </Col>
                    <Col>
                      <h6 className="pb-2">Room Status</h6>
                      <div className="form-switch d-flex flex-row ps-0 align-items-center">
                        <Label for="empty" className="form-check-label">
                          Empty
                        </Label>
                        <Input
                          className="m-1"
                          type="switch"
                          name="primary"
                          id="roomStatus"
                          onChange={(e) => handleRoom_status(e)}
                        />
                        <Label for="occupied" className="form-check-label">
                          Occupied
                        </Label>
                      </div>
                    </Col>
                  </Row>
                  <Row className="mb-1">
                    <Col className="text-center">
                      <Button color="primary me-2" onClick={handleSubmit}>
                        Submit
                      </Button>
                      <Button
                        color="secondary"
                        className="me-2"
                        onClick={() => {
                          setShow(!show);
                          reset();
                        }}
                        outline
                      >
                        Cancel
                      </Button>
                    </Col>
                  </Row>
                </>
              </ModalBody>
            </>
          ) : (
            <div style={{ height: "150px" }}>
              <Spinner
                color="primary"
                style={{ marginTop: "50px", marginLeft: "50%" }}
              />
            </div>
          )}
        </Modal>
      </>
    );
  };

  const EditFloorModal = ({ id }) => {
    const data = roomList?.filter((floor) => floor.floorID === id);

    // const [editStatusID] = useState(data[0]?.StatusID)
    const [editRoomID, setEditRoomID] = useState(data[0]?.roomID);
    const [editFloorNo, setEditFloorNo] = useState(data[0]?.floorNo);
    const [editRoomNo, setEditRoomNo] = useState(data[0]?.roomNo);
    // const [editRoomTypeID, setEditRoomTypeID] = useState(data[0]?.RoomTypeID)
    const [editStatusID, setEditStatusID] = useState(data[0]?.status);
    const [editDisplay, setEditDisplay] = useState(false);

    const editFloor = () => {
      const editFloorBody = {
        LoginID,
        Token,
        Seckey: "abc",
        Event: "update",
        FloorID: id,
        PropertyID: null,
        // FloorNo: editFloorNo,
        // FloorDesc: "",
        RoomID: editRoomID,
        // RoomNo: editRoomNo,
        // RoomTypeID: editRoomTypeID,
        // Description: "",
        Status: editStatusID,
      };
      console.log("editFloorBody====>", editFloorBody);
      try {
        axios
          .post(`/getdata/bookingdata/floordetails`, editFloorBody)
          .then((res) => {
            console.log("res", res);
            // floorList()
            setRefresh(res);
            // toast.success("Floor Updated Successfully", { position: 'top-center' })
          })
          .catch((error) => {
            console.log("error", error);
            toast.error(error);
          });
      } catch (error) {
        console.log("Edit Floor Error", error.message);
      }
    };

    const handleRoomStatus = (value) => {
      if (value === "reload") {
        roomStatusDropdown();
        return;
      }
      // setStatusID(value)
      setEditStatusID(value);
    };

    const handleEditRoomTypeDropDownList = (value) => {
      if (value === "reload") {
        roomTypeDropDownList();
        return;
      }
      setEditRoomID(value);
    };

    const handleUpdate = () => {
      setEditDisplay(true);
      // if (editFloorNo && editRoomNo.trim() && editRoomTypeID && editStatusID !== '') {
      if (editRoomID && editStatusID !== "") {
        editFloor();
        handleEditModal();
      }
    };

    return (
      <>
        <Modal isOpen={showEdit} className="modal-dialog-centered modal-lg">
          <ModalHeader className="bg-transparent" toggle={handleEditModal}>
            Update Floor Details
          </ModalHeader>
          {!dropdownLoader ? (
            <>
              <ModalBody className="px-sm-2 mx-50">
                <>
                  <Row className="mb-1">
                    <Col lg="6" className="mb-md-1">
                      <Label className="form-label">
                        <span className="text-danger">*</span>Floor
                      </Label>
                      <Input
                        disabled
                        type="text"
                        placeholder="Floor Number"
                        value={editFloorNo}
                        onChange={(e) => setEditFloorNo(e.target.value)}
                        invalid={editDisplay ? editFloorNo === "" : false}
                      />
                      {editDisplay && editFloorNo === "" && (
                        <span className="text-danger">Floor is required</span>
                      )}
                    </Col>
                    <Col lg="6">
                      <Label className="form-label">
                        <span className="text-danger">*</span>Room Type
                      </Label>
                      <Select
                        theme={selectThemeColors}
                        className="react-select w-100"
                        classNamePrefix="select"
                        placeholder="Select Room Type"
                        options={roomTypeDropDownOptions}
                        value={roomTypeDropDownOptions.filter(
                          (c) => c.value === editRoomID,
                        )}
                        onChange={(e) => {
                          handleEditRoomTypeDropDownList(e.value);
                        }}
                      />
                      {editDisplay && editRoomID === "" && (
                        <p className="text-danger">Room Type is required</p>
                      )}
                    </Col>
                  </Row>
                  <Row className="mb-1">
                    <Col lg="6" className="mb-md-1">
                      <Label className="form-label">
                        <span className="text-danger">*</span>Room Number
                      </Label>
                      <Input
                        disabled
                        type="text"
                        placeholder="Room Number"
                        value={editRoomNo}
                        onChange={(e) => setEditRoomNo(e.target.value)}
                        invalid={editDisplay && editRoomNo.trim() === ""}
                      />
                      {editDisplay && editRoomNo.trim() === "" && (
                        <span className="text-danger">
                          Room Number is required
                        </span>
                      )}
                    </Col>
                    <Col lg="6">
                      <Label className="form-label">
                        <span className="text-danger">*</span>Room Status
                      </Label>
                      <Select
                        theme={selectThemeColors}
                        className="react-select w-100"
                        classNamePrefix="select"
                        placeholder="Select Room status"
                        options={statusOptions}
                        value={statusOptions?.filter(
                          (c) => c.value === editStatusID,
                        )}
                        onChange={(e) => {
                          handleRoomStatus(e.value);
                        }}
                      />
                      {editDisplay && editStatusID === "" && (
                        <span className="text-danger">
                          Room Status is required
                        </span>
                      )}
                    </Col>
                  </Row>
                  <Row className="mb-1">
                    <Col className="text-center">
                      <Button
                        color="primary me-2"
                        onClick={() => handleUpdate()}
                      >
                        Submit
                      </Button>
                      <Button
                        color="secondary"
                        className="me-2"
                        onClick={() => {
                          setShowEdit(handleEditModal);
                        }}
                        outline
                      >
                        Cancel
                      </Button>
                    </Col>
                  </Row>
                </>
              </ModalBody>
            </>
          ) : (
            <div style={{ height: "150px" }}>
              <Spinner
                color="primary"
                style={{ marginTop: "50px", marginLeft: "50%" }}
              />
            </div>
          )}
        </Modal>
      </>
    );
  };

  const DeleteFloorModal = ({ id }) => {
    const deleteFloor = () => {
      const deleteFloorBody = {
        LoginID,
        Token,
        Seckey: "abc",
        Event: "delete",
        FloorID: id,
      };
      console.log("body", deleteFloorBody);
      try {
        axios
          .post(`/getdata/bookingdata/floordetails`, deleteFloorBody)
          .then(() => {
            // floorList()
            setRefresh(res);
          });
      } catch (error) {
        console.log("Floor Delete Error", error.message);
      }
    };
    const deleteRoom = () => {
      deleteFloor();
      setDel(!del);
    };

    return (
      <>
        <Modal className="modal-dialog-centered" isOpen={del}>
          <ModalHeader className="bg-transparent" toggle={() => setDel(!del)}>
            Are you sure to delete permanently?
          </ModalHeader>
          <ModalBody>
            <Row className="text-center">
              <Col xs={12}>
                <Button
                  className="m-1"
                  color="danger"
                  onClick={() => deleteRoom()}
                >
                  Delete
                </Button>
                <Button
                  className="mx-1"
                  color="secondary"
                  outline
                  onClick={() => setDel(!del)}
                >
                  Cancel
                </Button>
              </Col>
            </Row>
          </ModalBody>
        </Modal>
      </>
    );
  };

  const [query, setQuery] = useState("");
  const search = (data) => {
    return data.filter(
      (item) =>
        item.floorID.toLowerCase().includes(query.toLowerCase()) ||
        item.roomNo.toLowerCase().includes(query.toLowerCase()) ||
        item.roomType.toLowerCase().includes(query.toLowerCase()),
    );
  };

  const roomListColumns = [
    {
      name: "ID",
      width: "220px",
      selector: (row) => row.floorID,
    },
    {
      name: "Floor",
      width: "120px",
      sortable: true,
      selector: (row) => row.floorNo,
    },
    {
      name: "Room No.",
      width: "120px",
      sortable: true,
      selector: (row) => row.roomNo,
    },
    {
      name: "Room Type",
      width: "220px",
      sortable: true,
      selector: (row) => row.roomType,
      // selector: row => row.RoomDisplayName
    },
    {
      name: "Status",
      sortable: true,
      selector: (row) => row.status,
      cell: (row) => {
        return (
          <>
            {row.Status === "Active" ? (
              <Badge color="light-success"> {row.status}</Badge>
            ) : (
              <Badge color="light-danger"> {row.status}</Badge>
            )}
          </>
        );
      },
    },
    {
      name: "Actions",
      sortable: true,
      center: true,
      selector: (row) => {
        return (
          <>
            <Col>
              <Edit
                className="me-50 pe-auto"
                size={15}
                onClick={() => {
                  setShowEdit(true);
                  setSel_room(row.floorID);
                }}
              />
              <Trash
                className="me-50"
                size={15}
                onClick={() => {
                  setDel(true);
                  setSel_room(row.floorID);
                }}
              />
            </Col>
          </>
        );
      },
    },
  ];
  console.log("show", show);

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>
            <h2>Plan Pricing</h2>
            {/* Floor Master */}
          </CardTitle>
          <input
            type="text"
            placeholder="search"
            className="form-control input-default w-50"
            onChange={(e) => setQuery(e.target.value)}
          />
          <Button
            color="primary"
            onClick={() => {
              setShow(true);
              roomTypeDropDownList();
              roomStatusDropdown();
            }}
          >
            Add Room
          </Button>
        </CardHeader>
      </Card>
   
        <div className="d-flex justify-content-evenly">
                <Card
                  style={{ width: "24rem", paddingTop: "20px", marginRight: "5px" }}
                >
                  <div className="p-1">
                    <div className="d-flex justify-content-between">
                      <div>
                        <h2>Monthly</h2>
                        <p className="mb-2 text-dark">
                          Perfect for small hotels getting started
                        </p>
                      </div>
                      <div>
                        <span className="border rounded bg-primary text-light px-1" style={{paddingTop: "2px", paddingBottom: "2px"}}>
                          Active
                        </span>
                      </div>
                    </div>
                    <div>
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
        
                    <div className="d-flex justify-content-center">
                      <Button color="primary" onClick={() => handleEdit("starter")} className = "px-5">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          fill="currentColor"
                          className="bi bi-pencil-square me-1"
                          viewBox="0 0 16 16"
                        >
                          <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456l-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z" />
                          <path
                            fill-rule="evenodd"
                            d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5v11z"
                          />
                        </svg>
                        Subscribe
                      </Button>
                    </div>
                  </div>
                </Card>
        
                <Card
                  style={{ width: "24rem", paddingTop: "20px", marginRight: "5px" }}
                >
                  <div className="p-1">
                    <div className="d-flex justify-content-between">
                      <div>
                        <h2>Quarterly</h2>
                        <p className="mb-2 text-dark">
                          Comprehensive solution for growing properties
                        </p>
                      </div>
                      <div>
                        <span className="border rounded bg-primary text-light px-1" style={{paddingTop: "2px", paddingBottom: "2px"}}>
                          Active
                        </span>
                      </div>
                    </div>
                    <div>
                      <p className="fs-1 fw-bolder">$299.00</p>
                      <p>per month</p>
                    </div>
                    <div className="pt-2 border-top">
                      <div className="d-flex justify-content-between mb-1">
                        <span>Max Rooms</span>
                        <span>100</span>
                      </div>
                      <div className="d-flex justify-content-between mb-1">
                        <span>Max Users</span>
                        <span>15</span>
                      </div>
                      <div className="d-flex justify-content-between mb-1">
                        <span>Auto Renew</span>
                        <span>Yes</span>
                      </div>
                    </div>
                    <div className="pt-2 border-top mb-2">
                      <h4 className="fs-5 fw-bolder">Included Modules</h4>
                      <div className="d-flex gap-1 flex-wrap">
                        <span className="px-1 border rounded">Front Office</span>
                        <span className="px-1 border rounded">Housekeeping</span>
                        <span className="px-1 border rounded">Pos</span>
                        <span className="px-1 border rounded">Reports</span>
                      </div>
                    </div>
                    <div className="d-flex justify-content-center">
                      <Button color="primary" onClick={() => handleEdit("professional")} className = "px-5">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          fill="currentColor"
                          className="bi bi-pencil-square me-1"
                          viewBox="0 0 16 16"
                        >
                          <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456l-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z" />
                          <path
                            fill-rule="evenodd"
                            d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5v11z"
                          />
                        </svg>
                        Subscribe
                      </Button>
                    </div>
                  </div>
                </Card>
                <Card style={{ width: "24rem", paddingTop: "20px" }}>
                  <div className="p-1">
                    <div className="d-flex justify-content-between">
                      <div>
                        <h2>Yearly</h2>
                        <p className="mb-2 text-dark">
                          Perfect for small hotels getting started
                        </p>
                      </div>
                      <div>
                        <span className="border rounded bg-primary text-light px-1" style={{paddingTop: "2px", paddingBottom: "2px"}}>
                          Active
                        </span>
                      </div>
                    </div>
                    <div>
                      <p className="fs-1 fw-bolder">$2,999.00</p>
                      <p>per 365 days</p>
                    </div>
                    <div className="pt-2 border-top mb-1">
                      <div className="d-flex justify-content-between mb-1">
                        <span>Max Rooms</span>
                        <span>500</span>
                      </div>
                      <div className="d-flex justify-content-between mb-1">
                        <span>Max Users</span>
                        <span>50</span>
                      </div>
                      <div className="d-flex justify-content-between mb-1">
                        <span>Auto Renew</span>
                        <span>Yes</span>
                      </div>
                    </div>
                    <div className="pt-2 border-top mb-2">
                      <h4 className="fs-5 fw-bolder">Included Modules</h4>
                      <div className="d-flex gap-1 flex-wrap">
                        <span className="px-1 border rounded">Front Office</span>
                        <span className="px-1 border rounded">Housekeeping</span>
                        <span className="px-1 border rounded">Pos</span>
                        <span className="px-1 border rounded">Reports</span>
                        <span className="px-1 border rounded">Accounting</span>
                        <span className="px-1 border rounded">Integrations</span>
                      </div>
                    </div>
        
                    <div className="d-flex justify-content-center">
                      <Button color="primary" onClick={() => handleEdit("enterprise")} className = "px-5">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          fill="currentColor"
                          className="bi bi-pencil-square me-1"
                          viewBox="0 0 16 16"
                        >
                          <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456l-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z" />
                          <path
                            fill-rule="evenodd"
                            d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5v11z"
                          />
                        </svg>
                        Subscribe
                      </Button>
                    </div>
                  </div>
                </Card>
              </div>

      {show ? <NewFloorModal /> : <></>}
      {showEdit ? <EditFloorModal id={sel_room} /> : <></>}
      {del ? <DeleteFloorModal id={sel_room} /> : <></>}
    </>
  );
};

export default Price;
