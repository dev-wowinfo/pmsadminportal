// ** React Imports
import { useEffect, useState } from "react";

// ** Third Party Components
// import axios from "axios";
import classnames from "classnames";
import * as Icon from "react-feather";
import axios from "../../../../API/axios";
import Avatar from '@components/avatar'
import { User } from 'react-feather'
import { storeBookingDetails } from "../../../../redux/voucherSlice"
// import BookingModal from '../../../../views/FrontDesk/BookingModal'
import OnHoldQuickBookingModal from '../../../../views/FrontDesk/OnHoldQuickBookingModal'
// ** Reactstrap Imports
import { NavItem, NavLink, Modal, ModalHeader, ModalBody, Input, UncontrolledDropdown, DropdownToggle, DropdownMenu, DropdownItem, Badge } from "reactstrap";


// ** Store & Actions
import { useDispatch, useSelector } from "react-redux";
import { handleSearchQuery } from "@store/navbar";

// ** Custom Components
import Autocomplete from "@components/autocomplete";
import moment from "moment";
import AddHotel from "../../../../views/FrontDesk/AddHotel";

const NavbarSearch = () => {
  // ** Store Vars
  const dispatch = useDispatch();

  // ** States
  // const [suggestions, setSuggestions] = useState([]);
  const [navbarSearch, setNavbarSearch] = useState(false);
  // console.log(navbarSearch)
  // modal setup
  const [searchQuery, setSearchQuery] = useState("");
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const handleModal = () => setModalIsOpen(!modalIsOpen)
  const [modalData, setModalData] = useState([]);
  // console.log(modalData)
  const handleSearchQueryChange = (event) => {
    setSearchQuery(event.target.value);
    // console.log("in function", searchQuery)
    try {
      const searchData = {
        "LoginID": "LDT001",
        "Token": "123",
        "Seckey": "abc",
        "Event": "search",
        "SearchPhrase": ""
      }
      axios.post("/api/getdata/bookingdata/dashboardchart", searchData)
        .then((response) => setModalData(response.data.results))
    }
    catch (error) {
      console.log("error123")
    }
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
    setModalData([]);
  };

  // ** ComponentDidMount
  // useEffect(() => {
  //   axios.get("/api/getdata/bookingdata/dashboardchart").then(({ data }) => {
  //     setSuggestions(data);
  //   });
  // }, []);

  // useEffect(() => {
  //   setSuggestions();
  // }, []);

  // ** Removes query in store
  const handleClearQueryInStore = () => dispatch(handleSearchQuery(""));

  // ** Function to handle external Input click
  const handleExternalClick = () => {
    if (navbarSearch === true) {
      setNavbarSearch(false);
      handleClearQueryInStore();
    }
  };

  // ** Function to clear input value
  const handleClearInput = (setUserInput) => {
    if (!navbarSearch) {
      setUserInput("");
      handleClearQueryInStore();
    }
  };

  // ** Function to close search on ESC & ENTER Click
  const onKeyDown = (e) => {
    if (e.keyCode === 27 || e.keyCode === 13) {
      setTimeout(() => {
        setNavbarSearch(false);
        handleClearQueryInStore();
      }, 1);
    }
  };

  // ** Function to handle search suggestion Click
  const handleSuggestionItemClick = () => {
    setNavbarSearch(false);
    handleClearQueryInStore();
  };

  // ** Function to handle search list Click
  const handleListItemClick = (func, link, e) => {
    func(link, e);
    setTimeout(() => {
      setNavbarSearch(false);
    }, 1);
    handleClearQueryInStore();
  };

  // abdullatif edit
  const myArr = [{
    id: 1,
    target: "analyticsDash",
    isBookmarked: false,
    title: "Analytics Dashboard",
    icon: "Home",
    link: "/dashboard/analytics"
  }];

  // Global Search Uncontrolled Dropdown`
  const [value, setValue] = useState('')
  const [suggestions, setSuggestions] = useState([])
  const [sel_bookingID, setSel_bookingID] = useState('')
  console.log('sel_bookingID', sel_bookingID);
  const [open, setOpen] = useState(false)
  const [bookingStatus, setBookingStatus] = useState('')
  const handleOpen = () => setOpen(!open)
  console.log('openn', open);
  const handleOnHoldOpne = () => setOnHoldOpen(!onHoldOpen)
  const [onHoldOpen, setOnHoldOpen] = useState(false)
  const getUserData = useSelector((state) => state.userManageSlice.userData);
  const { LoginID, Token } = getUserData;
  const getSearchData = async (value) => {
    try {
      const objc1 = {
        LoginID,
        Token,
        Seckey: "abc",
        Event: "search",
        SearchPhrase: value
      };
      const res = await axios.post("getdata/bookingdata/dashboardchart", objc1);
      res?.data[0].length !== 0 ? setSuggestions(res?.data[0]) : setSuggestions(res?.data[1])
    } catch (error) {
      console.log("Error", error);
    }
  };
  useEffect(() => {
    value !== '' && getSearchData();
  }, [value]);


  return (
    <>
      <NavItem className="nav-search" onClick={() => setNavbarSearch(true)}>
        <NavLink className="nav-link-search">
          <Icon.Search className="ficon" />
        </NavLink>
        <div
          className={classnames("search-input", {
            open: navbarSearch === true,
          })}
        >
          <div className="search-input-icon">
            <Icon.Search />
          </div>
          <UncontrolledDropdown>
            <DropdownToggle className='hide-arrow me-1' tag='a' href='/' onClick={e => e.preventDefault()}>
              <Input
                id='email-search'
                placeholder='Search for booking using Booking ID, Guest Name or Email...'
                autoComplete="off"
                value={value}
                onChange={(e) => {
                  getSearchData(e.target.value)
                  setValue(e.target.value)
                }}
              />
            </DropdownToggle>
            {suggestions.length > 0 ? <DropdownMenu end className='mt-2 globalDropdown w-100 px-2' style={{ height: suggestions.length > 3 ? '350px' : 'fit-content' }}>
              {suggestions?.map((item, index) => {
                console.log('openn111', item);
                return (
                  <DropdownItem key={index} className='w-100' onClick={() => {
                    setSel_bookingID(item.BookingMapID);
                    console.warn("gengarBookingId", item.bookingMapID)
                    setBookingStatus(item.Status)
                    dispatch(storeBookingDetails({ LoginID, Token, BookingId: item.bookingMapID }))
                    if (item.Status === 'OnHold') {
                      handleOnHoldOpne()
                    } else {
                      handleOpen()
                    }
                  }}>
                    <div className='d-flex align-items-baseline align-items-md-center border-bottom '>
                      <Avatar
                        title="Click to Manage Booking"
                        icon={<User color='#FFFFFF' size={25} />}
                        color={
                          item.status === 'CheckedIN' ? (
                            'success'
                          ) : item.status === 'CheckedOut' ? (
                            'primary'
                          ) : item.status === 'Cancelled' ? (
                            'danger'
                          ) : item.status === 'Reserved' && item.checkIn === false ? (
                            'warning'
                          ) : item.status === 'OnHold' ? (
                            'info'
                          ) : '#000'
                        }
                      />
                      <div className="d-block d-md-flex justify-content-between ms-2 w-100 align-items-center">
                        <div className="my-1 my-md-0">
                          {
                            item.status === 'CheckedIN' ? (
                              <Badge color='success'>Checked In</Badge>
                            ) : item.Status === 'CheckedOut' ? (
                              <Badge color='primary'>{item.status}</Badge>
                            ) : item.Status === 'Cancelled' ? (
                              <Badge color='danger'> {item.status}</Badge>
                            ) : item.Status === 'Reserved' && item.checkIn === false ? (
                              <Badge color='light-warning'>Reserved</Badge>
                            ) : item.Status === 'OnHold' ? (
                              <Badge color='light-info'>{item.status}</Badge>
                            ) : <Badge color='light-secondary'>{item.status}</Badge>
                          }
                        </div>
                        <div >
                          <p>{item.bookingMapID}</p>
                        </div>
                        <div >
                          <p className="mb-0">{item.guestName.toUpperCase()}</p>
                          <p>{item.guestMobileNumber}</p>
                          {/* <span >{item.BookingMapID}</span> */}
                        </div>
                        <div >
                          <p>{moment(item.checkInDate).format('LLLL')}</p>
                        </div>
                      </div>
                    </div>
                  </DropdownItem>
                )
              })}
            </DropdownMenu> : ''}

          </UncontrolledDropdown>

          {/* {navbarSearch ? (
            <Autocomplete
              value={searchQuery}
              onChange={handleSearchQueryChange}
              className="form-control"
              // suggestions={suggestions}
              filterKey="title"
              filterHeaderKey="groupTitle"
              grouped={true}
              placeholder="Search for booking using Booking ID, Guest Name or Email..."
              autoFocus={true}
              onSuggestionItemClick={handleSuggestionItemClick}
              externalClick={handleExternalClick}
              clearInput={(userInput, setUserInput) =>
                handleClearInput(setUserInput)
              }
              onKeyDown={onKeyDown}
              // onChange={(e) => dispatch(handleSearchQuery(e.target.value))}
              customRender={(
                item,
                i,
                filteredData,
                activeSuggestion,
                onSuggestionItemClick,
                onSuggestionItemHover
              ) => {
                const IconTag = Icon[item.icon ? item.icon : "X"];
                return (
                  <li
                    className={classnames("suggestion-item", {
                      active: filteredData.indexOf(item) === activeSuggestion,
                    })}
                    key={i}
                    onClick={(e) =>
                      handleListItemClick(onSuggestionItemClick, item.link, e)
                    }
                    onMouseEnter={() =>
                      onSuggestionItemHover(filteredData.indexOf(item))
                    }
                  >
                    <div
                      className={classnames({
                        "d-flex justify-content-between align-items-center":
                          item.file || item.img,
                      })}
                    >
                      <div className="item-container d-flex">
                        {item.icon ? (
                          <IconTag size={17} />
                        ) : item.file ? (
                          <img
                            src={item.file}
                            height="36"
                            width="28"
                            alt={item.title}
                          />
                        ) : item.img ? (
                          <img
                            className="rounded-circle mt-25"
                            src={item.img}
                            height="28"
                            width="28"
                            alt={item.title}
                          />
                        ) : null}
                        <div className="item-info ms-1">
                          <p className="align-middle mb-0">{item.title}</p>
                          {item.by || item.email ? (
                            <small className="text-muted">
                              {item.by
                                ? item.by
                                : item.email
                                  ? item.email
                                  : null}
                            </small>
                          ) : null}
                        </div>
                      </div>
                      {item.size || item.date ? (
                        <div className="meta-container">
                          <small className="text-muted">
                            {item.size
                              ? item.size
                              : item.date
                                ? item.date
                                : null}
                          </small>
                        </div>
                      ) : null}
                    </div>
                  </li>
                );
              }}
            />
          ) : null} */}
          <div className="search-input-close">
            <Icon.X
              className="ficon"
              onClick={(e) => {
                e.stopPropagation();
                setNavbarSearch(false);
                handleClearQueryInStore();
                setSuggestions([])
                setValue('')
              }}
            />
          </div>
        </div>
      </NavItem>
      {
        modalIsOpen && (
          <Modal isOpen={modalIsOpen} toggle={handleModal} className='modal-dialog-centered' backdrop={false}>
            <ModalHeader toggle={handleModal}></ModalHeader>
            <ModalBody>
              <div isOpen={modalIsOpen} onRequestClose={closeModal}>
                {modalData.map((item) => (
                  <div key={item.id}>{item.title}</div>
                ))}
              </div>
            </ModalBody>
          </Modal>
        )
      }
      {open && <AddHotel open={open} handleOpen={handleOpen} bookingID={sel_bookingID} bookingStatus={bookingStatus} />}
      {onHoldOpen && <OnHoldQuickBookingModal open={onHoldOpen} handleOnHoldOpen={handleOnHoldOpne} bookingID={sel_bookingID} />}
    </>
  );
};

export default NavbarSearch;

