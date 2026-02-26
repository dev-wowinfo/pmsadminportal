import { React, useState } from "react";
import DataTable from "react-data-table-component";
import { Edit, RefreshCcw, Trash } from "react-feather";
import {
  Button,
  Card,
  CardBody,
  CardText,
  Input,
  CardTitle,
  Col,
  Label,
  Modal,
  ModalBody,
  ModalHeader,
  Row,
  Form,
  FormFeedback,
  CardHeader,
} from "reactstrap";
import Category from "./Category";
import ProductCategory from "./ProductCategory";
const ProductMaster = () => {
  const [active, setActive] = useState("1");

  const toggle = (tab) => {
    if (active !== tab) {
      setActive(tab);
    }
  };

  const [refresh, setRefresh] = useState(false);
  const handleRefresh = () => setRefresh(!refresh);
  const data = [
    // {
    //   id: 1,
    //   type: "Basic",
    //   details: "something",
    //   dates: "22/8/2022",
    //   applicability: "all",
    //   action: "btns",
    // },
    {
      name: "Users",
      type: "Basic",
      details: "Basic package details",
      dates: "22/08/2022",
      applicability: "All Users",
      room: "100",
      user: "50",
      action: "btns",
    },
    {
      name: "Users",
      type: "Standard",
      details: "Standard package details",
      dates: "15/10/2023",
      applicability: "selected",
      room: "500",
      user: "200",
      action: "btns",
    },
  ];

  const hotelTable = [
    {
      name: "Product Name",
      sortable: true,
      minWidth: "80px",
      cell: (row) => <span>{row.name}</span>,
    },
    {
      name: "Type",
      sortable: true,
      minWidth: "50px",
      cell: (row) => <span>{row.type}</span>,
    },
    {
      name: "Details",
      sortable: true,
      minWidth: "180px",
      cell: (row) => <span>{row.details}</span>,
    },
    {
      name: "Date",
      sortable: true,
      minWidth: "50px",
      cell: (row) => <span>{row.dates}</span>,
    },
    {
      name: "Applicability",
      sortable: true,
      minWidth: "80px",
      cell: (row) => <span>{row.applicability}</span>,
    },
    {
      // name: 'Discount Amount',
      name: "Rooms",
      sortable: true,
      minWidth: "50px",
      cell: (row) => <span>{row.room}</span>,
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
      minWidth: "80px",
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

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>
            <h2>All Subscription</h2>
          </CardTitle>
        </CardHeader>

        <CardBody>
          <Row className="my-1">
            <Col>
              <DataTable
                noHeader
                data={data}
                columns={hotelTable}
                className="react-dataTable"
              />
            </Col>
          </Row>
        </CardBody>
      </Card>
    </>
  );
};

export default ProductMaster;
