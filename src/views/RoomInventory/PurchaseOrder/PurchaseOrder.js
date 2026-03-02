import { React, useEffect, useState } from 'react'
import { Button, Card, CardTitle, CardBody, CardText, Input, Row, Col, Modal, ModalHeader, ModalBody, CardHeader, Label, Badge } from 'reactstrap'
import CreatePO from './CreatePO'
import EditPO from './EditPO'
import DataTable from 'react-data-table-component'
import axios from '../../../API/axios'
import Select from 'react-select'
import { selectThemeColors } from '@utils'
import { ChevronDown, Edit, Trash } from 'react-feather'
import { useSelector } from 'react-redux'
import moment from 'moment/moment'
import toast from 'react-hot-toast'

const PurchaseOrder = () => {

  useEffect(() => {
    const prevTitle = document.title
    document.title = "PMS-Purchase Order"

    return () => {
      document.title = prevTitle
    }
  }, [])


  const getUserData = useSelector(state => state.userManageSlice.userData)
  const { LoginID, Token, PropertyID } = getUserData

  const [vendorData, setVendorData] = useState([])
  const [selVendorId, setSelVendorId] = useState('')
  const [poInvoiceData, setPOInvoiceData] = useState([])
  const [selPO, setSelPO] = useState('')

  const [show, setShow] = useState(false)
  const handleShow = () => setShow(!show)
  const [showEdit, setShowEdit] = useState(false)
  const handleShowEdit = () => setShowEdit(!showEdit)
  const [del, setDel] = useState(false)

  const getAllVendorData = async () => {
    try {
      const res = await axios.get(`/inventory/po?PropertyID=${PropertyID}&Status&LoginID=${LoginID}&Token=${Token}`)
      console.log('inventorypo', res)
      let result = res?.data[1]
      if (result.length > 0) {
        let arr = result.map(r => {
          return { value: r.userID, label: `${r.firstName}, ${r.lastName}`, ...r }
        })
        setVendorData(arr)
      }
    } catch (error) {
      console.log('error', error)
    }
  }

  const getPOInvoiceData = async () => {
    try {
      const res = await axios.get(`/inventory/po?PropertyID=${PropertyID}&Status&LoginID=${LoginID}&Token=${Token}`)
      setPOInvoiceData(res?.data[0])
      console.log('poInvoiceDatares', res)
    } catch (error) {
      console.log('error', error)
    }
  }

  useEffect(() => {
    getPOInvoiceData()
    getAllVendorData()
  }, [show, showEdit, del])

  const deletePO = async () => {
    try {
      const res = await axios.post(`/inventory/delete_po/${selPO}?LoginID=${LoginID}&Token=${Token}`)
      console.log('delres', res)
      if (res?.data[0][0].status === "Success") {
        toast.success(res?.data[0][0].message)
      }
      setDel(!del)
    } catch (error) {
      console.log('error', error)
      toast.error('Something went wrong, Try again!')
    }
  }

  const purchaseInvoiceTable = [
    // {
    //   name: 'Ref ID',
    //   width: '17rem',
    //   selector: row => row.POID,
    //   style: {
    //     color: 'black'
    //   }
    // },
    {
      name: "PO.No",
      selector: row => row.poNumber,
      width: '17rem'
    },
    {
      name: "PO.Date",
      width: '12rem',
      selector: row => moment(row.poDate).format('LL')
    },
    {
      name: "Vendor",
      width: '15rem',
      selector: row => row.vendorName
    },
    {
      name: "Final Amount",
      width: '12rem',
      selector: row => row.totalAmount
    },
    // {
    //   name: "Due Amount",
    //   width: '12rem',
    //   selector: row => row.DueAmount
    // },
    {
      name: "Property Id",
      width: '15rem',
      selector: row => row.propertyID
    },
    {
      name: "Status",
      sortable: true,
      selector: row => row.status,
      cell: row => {
        return (
          <>
            {
              row.status === 'Active' ? (
                <Badge color='light-success'> {row.status}</Badge>
              ) : (
                <Badge color='light-warning'> {row.status}</Badge>
              )
            }
          </>
        )
      }
    },
    {
      name: 'Action',
      selector: row => row.age,
      cell: row => (
        <>
          <Edit
            className='me-50 pe-auto'
            size={15}
            onClick={() => {
              setShowEdit(true)
              setSelPO(row.poid)
            }}
          />
          {
            row.status !== 'Invoiced' && (
              <Trash
                className='me-50'
                size={15}
                onClick={() => {
                  setDel(true)
                  setSelPO(row.poid)
                }}
              />
            )
          }
        </>
      )

    }
  ]

  return (
    <>
      {console.log('poInvoiceData', poInvoiceData)}
      <Row>
        <Col md='12'>
          <Card>
            <CardHeader>
              <CardTitle className='mb-1'><h2>Active Subscription</h2></CardTitle>
            </CardHeader>
            <CardBody>
              <Row className='d-flex flex-row align-items-center'>
                <Col className='mb-1'>
                  <Label>Filter by Vendor</Label>
                  <Select
                    theme={selectThemeColors}
                    className='react-select w-100'
                    classNamePrefix='select'
                    options={vendorData}
                    onChange={e => e === null ? setSelVendorId('') : setSelVendorId(e.value)}
                    isClearable
                  />
                </Col>
                <Col className='mb-1 text-end'>
                  <Button color='primary me-1' onClick={() => setShow(true)}>Add User</Button>
                </Col>
              </Row>
              <Row className='my-1'>
                <Col>
                  <DataTable
                    noHeader
                    columns={purchaseInvoiceTable}
                    data={selVendorId === '' ? poInvoiceData : poInvoiceData.filter(i => i.vendorID == selVendorId)}
                    className='react-dataTable'
                    pagination
                    sortIcon={<ChevronDown size={10} />}
                    paginationRowsPerPageOptions={[10, 25, 50, 100]}
                  />
                </Col>
              </Row>
            </CardBody>
          </Card>
        </Col>
      </Row>

      <Modal
        isOpen={show}
        toggle={() => handleShow()}
        className='modal-dialog-centered modal-xl'
        backdrop={false}
      >
        <ModalHeader className='bg-transparent' toggle={() => handleShow()}>
          Create Purchase Invoice
        </ModalHeader>
        <ModalBody className='px-sm-2 mx-50 pb-5'>
          <CreatePO handleShow={handleShow} />
        </ModalBody>
      </Modal>

      <Modal
        isOpen={showEdit}
        toggle={() => handleShowEdit()}
        className='modal-dialog-centered modal-xl'
        backdrop={false}
      >
        <ModalHeader className='bg-transparent' toggle={() => handleShowEdit()}>
          Edit Purchase Order
        </ModalHeader>
        <ModalBody className='px-sm-2 mx-50 pb-5'>
          <EditPO POID={selPO} showEdit={showEdit} setShowEdit={setShowEdit} handleShowEdit={handleShowEdit} />
        </ModalBody>
      </Modal>

      <Modal
        isOpen={del}
        toggle={() => setDel(!del)}
        className='modal-dialog-centered'
        backdrop={false}
      >
        <ModalHeader className='bg-transparent' toggle={() => setDel(!del)}>
          Are you sure to delete {selPO} permanently?
        </ModalHeader>
        <ModalBody>
          <Row className='text-center'>
            <Col xs={12}>
              <Button color='danger' className='m-1' onClick={() => deletePO()}>
                Delete
              </Button>
              <Button className='m-1' color='secondary' outline onClick={() => setDel(!del)}>
                Cancel
              </Button>
            </Col>
          </Row>
        </ModalBody>
      </Modal>

      {
        show | showEdit | del ? (
          <div className="modal-backdrop fade show" ></div>
        ) : null
      }
    </>
  )
}

export default PurchaseOrder