import { React, useEffect, useState } from 'react'
import { Button, Card, CardTitle, CardBody, CardText, CardSubtitle, CardLink, Input, Row, Col, Table, Modal, ModalHeader, ModalBody, Label, InputGroupText, InputGroup, CardHeader, Badge } from 'reactstrap'
import Select from 'react-select'
import { selectThemeColors } from '@utils'
import Flatpickr from 'react-flatpickr'
import { MdDateRange } from "react-icons/md"
import DataTable from 'react-data-table-component'

import { ChevronDown, Edit, Trash } from 'react-feather'
import toast from 'react-hot-toast'
import axios from '../../../API/axios'
import { Token } from 'prismjs'
import { useSelector } from 'react-redux'
import moment from 'moment'
import CreatePR from './CreatePR'
import DeletePr from './DeletePr'
import EditPR from './EditPR'

function PurchaseReceive() {

  useEffect(() => {
    const prevTitle = document.title
    document.title = "PMS-Purchase Receive"

    return () => {
      document.title = prevTitle
    }
  }, [])


  const getUserData = useSelector(state => state.userManageSlice.userData)
  const { LoginID, Token, PropertyID } = getUserData

  const [poInvList, setPoInvList] = useState([])
  const [selInvPo, setSelInvPo] = useState('')

  const [prList, setPrList] = useState([])
  const [selPr, setSelPr] = useState('')

  const [show, setShow] = useState(false)
  const handleShow = () => setShow(!show)

  const [showEdit, setShowEdit] = useState(false)
  const handleShowEdit = () => setShowEdit(!showEdit)

  const [del, setDel] = useState(false)
  const handleDel = () => setDel(!del)

  const getInvoicedPoList = async () => {
    try {
      const res = await axios.get(`/inventory/po_all?PropertyID=${PropertyID}&LoginID=${LoginID}&Token=${Token}&Status=Invoiced`)
      console.log('getInvoicedPoListres', res)
      let result = res?.data[0]
      if (result.length > 0) {
        let arr = result.map(p => {
          return { value: p.poid, label: p.poid, ...p }
        })
        setPoInvList(arr)
      } else {
        setPoInvList([])
      }
    } catch (error) {
      console.log('Polisterror', error)
    }
  }

  const getPropertyPrList = async () => {
    try {
      const res = await axios.get(`/inventory/purchase_receive?LoginID=${LoginID}&Token=${Token}&PropertyID=${PropertyID}`)
      console.log('PropPrresList', res)
      setPrList(res?.data[0])
    } catch (error) {
      console.log('prListerror', error)
    }
  }

  useEffect(() => {
    getInvoicedPoList()
    getPropertyPrList()
  }, [show, showEdit, del])


  const prColumn = [
    {
      name: "Date",
      sortable: true,
      width: '12rem',
      selector: row => moment(row.receivedDate).format('LL')
    },
    {
      name: "PR.No",
      width: '15rem',
      selector: row => row.purchaseReceiveID
    },
    {
      name: "PO.No",
      width: '15rem',
      selector: row => row.poid
    },
    {
      name: "Received By",
      width: '15rem',
      selector: row => row.receivedBy
    },
    {
      name: "Remarks",
      width: '15rem',
      selector: row => row.remarks
    },
    {
      name: "Status",
      sortable: true,
      selector: row => row.status,
      cell: row => {
        return (
          <>
            {
              row.Status === 'Active' ? (
                <Badge color='light-success'> {row.status}</Badge>
              ) : (
                <Badge color='light-danger'> {row.status}</Badge>
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
          <Edit className='me-50 pe-auto' onClick={() => {
            setShowEdit(true)
            setSelPr(row.purchaseReceiveID)
          }} size={15} />
          <Trash className='me-50' onClick={() => {
            setSelPr(row.purchaseReceiveID)
            handleDel()
          }} name={row.poItemID} size={15} />
        </>
      )

    }
  ]

  return (
    <>
      <Row>
        <Col md='12'>
          <Card>
            <CardHeader>
              <CardTitle className='mb-1'><h2>Expired Subscription</h2></CardTitle>
            </CardHeader>
            <CardBody>
              <Row className='d-flex flex-row flex-wrap justify-content-between align-items-center'>
                <Col className='mb-1'>
                  <Label>Invoiced PO List</Label>
                  <Select
                    isClearable
                    placeholder='Select a PO number...'
                    theme={selectThemeColors}
                    className='react-select w-100'
                    classNamePrefix='select'
                    options={poInvList}
                    value={poInvList.filter(c => c.value === selInvPo)}
                    onChange={e => e === null ? setSelInvPo('') : setSelInvPo(e.value)}
                  />
                </Col>
                <Col className='text-end'>
                  <Button
                    color='primary'
                    // disabled={selInvPo === ''}
                    onClick={() => handleShow()}
                  >
                    Add User
                  </Button>
                </Col>
              </Row>
              <CardText>
                <DataTable
                  noHeader
                  data={selInvPo === '' ? prList : prList.filter(c => c.POID === selInvPo)}
                  columns={prColumn}
                  className='react-dataTable'
                  pagination
                  sortIcon={<ChevronDown size={10} />}
                  paginationRowsPerPageOptions={[10, 25, 50, 100]}
                />
              </CardText>
            </CardBody>
          </Card>
        </Col>
      </Row>

      {show && <CreatePR POID={selInvPo} show={show} handleShow={handleShow} />}
      {showEdit && <EditPR selPr={selPr} showEdit={showEdit} handleShowEdit={handleShowEdit} />}
      {del && <DeletePr selPr={selPr} del={del} handleDel={handleDel} />}
      {
        show | showEdit | del ? (
          <div className="modal-backdrop fade show" ></div>
        ) : null
      }
    </>
  )
}

export default PurchaseReceive