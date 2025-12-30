import React, { useEffect, useState } from 'react'
import {
    UncontrolledDropdown, DropdownToggle, DropdownMenu, DropdownItem, Card, Col, Modal, ModalHeader, ModalBody, Row, Button
} from 'reactstrap'
import { ChevronDown, MoreVertical, Edit, FileText, Archive, Trash, Eye, EyeOff } from 'react-feather'

import DataTable from 'react-data-table-component'

import './promotion.scss'
import axios from '../../API/axios'
import { useSelector } from 'react-redux'
import moment from 'moment'
import PromoUpdate from './PromoUpdate'
import classNames from 'classnames'
import { Style } from '@mui/icons-material'

const PromoTable = () => {
    const getUserData = useSelector(state => state.userManageSlice.userData)
    const { LoginID, Token } = getUserData
    const [promoData, setPromoData] = useState([])
    const [updateOpen, setUpdateOpen] = useState(false)
    const [promoId, setPromoId] = useState('')
    const [del, setDel] = useState(false)
    const handleUpdateOpen = () => {
        setUpdateOpen(!updateOpen)
    }
    const data = [
        {
            id: '1',
            type: 'Basic',
            details: 'something',
            dates: '22/8/2022',
            applicability: 'all',
            action: 'btns'
        }
    ]
    const getPromoData = async () => {
        try {
            const res = await axios.get('/promotion/list', {
                headers: {
                    LoginID,
                    Token
                }
            })
            console.log('resPromo', res.data[0])
            setPromoData(res?.data[0])
        } catch (error) {
            console.log('error', error)
        }
    }

    const DeletePackageModal = ({ promoId }) => {

        // const data = packages.filter(packages => packages.id === id)
        console.log('promoId', promoId);
        const handleDeletePackage = () => {
            try {
                axios.post(`/promotion/Delete?PromotionID=${promoId}`, {}, {
                    headers: {
                        LoginID,
                        Token,
                    }
                })
                    .then(response => {
                        console.log('response', response.data);
                        setDel(false)
                        getPromoData()
                    })
            } catch (error) {
                console.log("Error", error.message)
            }
        }
        return (
            <>
                <Modal
                    isOpen={del}
                    toggle={() => setDel(!del)}
                    className='modal-dialog-centered'
                    backdrop={false}
                >
                    <ModalHeader className='bg-transparent' toggle={() => setDel(!del)}>
                        Are you sure to delete Package permanently?
                    </ModalHeader>
                    <ModalBody>
                        <Row className='text-center'>
                            <Col xs={12}>
                                <Button color='danger' className='m-1' onClick={handleDeletePackage}>
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
                    del ? (
                        <div className="modal-backdrop fade show" ></div>
                    ) : null
                }
            </>
        )
    }


    const [query, setQuery] = useState("")
    const search = (data) => {
        return data.filter(item =>
            item.promotionId.toLowerCase().includes(query.toLowerCase()) ||
            item.promoName.toLowerCase().includes(query.toLowerCase()) ||
            item.guestType.toLowerCase().includes(query.toLowerCase())
        )
    }


    const basicColumns = [
        {
            // name: 'Promotion Id',
            name: 'Hotel',
            sortable: true,
            minWidth: '250px',
            cell: () => <span>Grand Plaza Hotel</span>
        },
        {
            // name: 'Promotion Date',
            name: 'Plan',
            sortable: true,
            // minWidth: '225px',             
            // selector: row => moment(row.promoDate).format('YYYY-MM-DD')
            cell: () => <span>Enterprises</span>
        },
        {
            // name: 'Promotion Name',
            name: 'Status',
            sortable: true,
            // minWidth: '250px',
            cell: () => <span class="border rounded bg-success text-light px-1">Active</span>
        },
        {
            // name: 'Discount Type',
            name: 'Start Date',
            sortable: true,
            // minWidth: '310px',
            // selector: row => row.discountType === 'P' ? 'Percentage' : 'Flat'
            cell: () => <span>Jun 23, 2025</span>

        },
        {
            // name: 'Discount Percentage',
            name: 'End Date',
            sortable: true,
            // minWidth: '250px',
            // selector: row => row.discPercentage
            cell: () => <span>Jun 23, 2026</span>
        },
        {
            // name: 'Discount Amount',
            name: 'Rooms',
            sortable: true,
            // minWidth: '250px',
            // selector: row => row.discAmount
            cell: () => <span>500</span>
        },
        {
            // name: 'Guest Type',
            name: 'Users',
            sortable: true,
            // minWidth: '250px',
            // selector: row => row.guestType
            cell: () => <span>50</span>
        },
        {
            name: 'Actions',
            center: true,
            selector: row => {
                return (
                    <>
                        <Col>
                            <Edit className='me-1 cursor-pointer' size={15} onClick={() => {
                                handleUpdateOpen()
                                setPromoId(row.promotionId)
                            }} />

                        </Col>
                    </>
                )
            }
        }
    ]

    useEffect(() => {
        getPromoData()
    }, [])


    return (
        <>
            <Card>
                {/* Search box */}
                <div class="d-flex justify-content-between py-1">
                    <input type="text" placeholder="search" className="form-control input-default w-50 m-2" onChange={e => setQuery(e.target.value)} />
                    <select class="px-2 py-1 h-50 mt-2 rounded">
                        <option>All Status</option>
                        <option>Trial</option>
                        <option>Active</option>
                        <option>Grace Period</option>
                        <option>Suspended</option>
                    </select>
                </div>
                <div className='react-dataTable'>
                    <DataTable
                        noHeader
                        pagination
                        // data={search(promoData)}
                         data={data}
                        columns={basicColumns}
                        className='react-dataTable ms-3'
                        sortIcon={<ChevronDown size={10} />}
                        paginationRowsPerPageOptions={[10, 25, 50, 100]}

                    />
                </div>
            </Card>

            {updateOpen && <PromoUpdate updateOpen={updateOpen} handleUpdateOpen={handleUpdateOpen} promoId={promoId} getPromoData={getPromoData} />}
            <DeletePackageModal promoId={promoId} />
        </>
    )
}

export default PromoTable