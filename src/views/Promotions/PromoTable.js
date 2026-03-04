import React, { useEffect, useState } from "react";
import Dropdown from "react-bootstrap/Dropdown";
import {
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  Card,
  Col,
  Modal,
  ModalHeader,
  ModalBody,
  Row,
  Button,
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

import DataTable from "react-data-table-component";

import "./promotion.scss";
import axios from "../../API/axios";
import { useSelector } from "react-redux";
import moment from "moment";
import PromoUpdate from "./PromoUpdate";
import classNames from "classnames";
import { Style } from "@mui/icons-material";

const PromoTable = () => {
  const getUserData = useSelector((state) => state.userManageSlice.userData);
  const { LoginID, Token } = getUserData;
  const [promoData, setPromoData] = useState([]);
  const [updateOpen, setUpdateOpen] = useState(false);
  const [promoId, setPromoId] = useState("");
  const [del, setDel] = useState(false);
  const handleUpdateOpen = () => {
    setUpdateOpen(!updateOpen);
  };
  const data = [
    {
      name: "Grand Plaza Hotel",
      type: "Enterprises",
      status: "Active",
      startdates: "Aug 02, 2025",
      enddates: "Aug 02, 2026",
      rooms: "500",
      user: "50",
      action: "btns",
    },
    {
      name: "Sunset Beach Resort",
      type: "Professional",
      status: "Active",
      startdates: "Nov 30, 2025",
      enddates: "May 30, 2026",
      rooms: "100",
      user: "15",
      action: "btns",
    },
  ];
  const getPromoData = async () => {
    try {
      const res = await axios.get("/promotion/list", {
        headers: {
          LoginID,
          Token,
        },
      });
      console.log("resPromo", res.data[0]);
      setPromoData(res?.data[0]);
    } catch (error) {
      console.log("error", error);
    }
  };

  const DeletePackageModal = ({ promoId }) => {
    // const data = packages.filter(packages => packages.id === id)
    console.log("promoId", promoId);
    const handleDeletePackage = () => {
      try {
        axios
          .post(
            `/promotion/Delete?PromotionID=${promoId}`,
            {},
            {
              headers: {
                LoginID,
                Token,
              },
            },
          )
          .then((response) => {
            console.log("response", response.data);
            setDel(false);
            getPromoData();
          });
      } catch (error) {
        console.log("Error", error.message);
      }
    };
    return (
      <>
        <Modal
          isOpen={del}
          toggle={() => setDel(!del)}
          className="modal-dialog-centered"
          backdrop={false}
        >
          <ModalHeader className="bg-transparent" toggle={() => setDel(!del)}>
            Are you sure to delete Package permanently?
          </ModalHeader>
          <ModalBody>
            <Row className="text-center">
              <Col xs={12}>
                <Button
                  color="danger"
                  className="m-1"
                  onClick={handleDeletePackage}
                >
                  Delete
                </Button>
                <Button
                  className="m-1"
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
        {del ? <div className="modal-backdrop fade show"></div> : null}
      </>
    );
  };

  const [query, setQuery] = useState("");
  const search = (data) => {
    return data.filter(
      (item) =>
        item.promotionId.toLowerCase().includes(query.toLowerCase()) ||
        item.promoName.toLowerCase().includes(query.toLowerCase()) ||
        item.guestType.toLowerCase().includes(query.toLowerCase()),
    );
  };

  const basicColumns = [
    {
     
      name: "Hotel",
      sortable: true,
      minWidth: "250px",
      cell: (row) => <span>{row.name}</span>,
    },
    {
    
      name: "Plan",
      sortable: true,
      cell: (row) => <span>{row.type}</span>,
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
   
      name: "Start Date",
      sortable: true,
      // minWidth: '310px',
      cell: (row) => <span>{row.startdates}</span>,
    },
    {
    
      name: "End Date",
      sortable: true,
      // minWidth: '250px',
      cell: (row) => <span>{row.enddates}</span>,
    },
    {
     
      name: "Rooms",
      sortable: true,
      minWidth: '10px',
      cell: (row) => <span>{row.rooms}</span>,
    },
    {
      
      name: "Users",
      sortable: true,
      minWidth: '10px',
      cell: (row) => <span>{row.user}</span>,
    },
    {
      name: "Actions",
      center: true,
       minWidth: '80px',
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

  useEffect(() => {
    getPromoData();
  }, []);

  return (
    <>
      <Card>
     
        <div class="d-flex justify-content-between py-1">
          <input
            type="text"
            placeholder="search"
            className="form-control input-default w-50 m-2"
            onChange={(e) => setQuery(e.target.value)}
          />
          <div className="m-2 pe-3">
            <Dropdown>
              <Dropdown.Toggle variant="primary" id="dropdown-basic">
                All Status
              </Dropdown.Toggle>

              <Dropdown.Menu>
                <Dropdown.Item href="#/action-1">All Status</Dropdown.Item>
                <Dropdown.Item href="#/action-2">Trial</Dropdown.Item>
                <Dropdown.Item href="#/action-3">Active</Dropdown.Item>
                <Dropdown.Item href="#/action-4">Grace Period</Dropdown.Item>
                <Dropdown.Item href="#/action-5">Suspended</Dropdown.Item>
                <Dropdown.Item href="#/action-6">Expired</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </div>
        </div>
        <div className="react-dataTable">
          <DataTable
            noHeader
            pagination
            // data={search(promoData)}
            data={data}
            columns={basicColumns}
            className="react-dataTable ms-3"
            sortIcon={<ChevronDown size={10} />}
            paginationRowsPerPageOptions={[10, 25, 50, 100]}
          />
        </div>
      </Card>

      {updateOpen && (
        <PromoUpdate
          updateOpen={updateOpen}
          handleUpdateOpen={handleUpdateOpen}
          promoId={promoId}
          getPromoData={getPromoData}
        />
      )}
      <DeletePackageModal promoId={promoId} />
    </>
  );
};

export default PromoTable;
