// ** React Imports
import { Fragment, useEffect, useState, useCallback, useRef } from "react"

// ** Custom Components
import NavbarUser from "./NavbarUser"

// ** Third Party Components
import { Sun, Moon, Menu } from "react-feather"

// ** Reactstrap Imports
import { Col, NavItem, NavLink, Row } from "reactstrap"
import GSTCalculator from "./GSTCalculator"
import NotificationDropdown from "./NotificationDropdown"
import axios from "../../../../API/axios"
import { useSelector } from "react-redux"
import moment from "moment"
import toast from "react-hot-toast"
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'

const ThemeNavbar = (props) => {
  // ** Props
  const { skin, setSkin, setMenuVisibility } = props

  // ** Function to toggle Theme (Light/Dark)
  const ThemeToggler = () => {
    if (skin === "dark") {
      return <Sun className="ficon" onClick={() => setSkin("light")} />
    } else {
      return <Moon className="ficon" onClick={() => setSkin("dark")} />
    }
  }

  const MySwal = withReactContent(Swal)

  const getUserData = useSelector(state => state.userManageSlice.userData)
  const { LoginID, Token, PropertyID } = getUserData
  // console.log("UserData---->",LoginID, Token, PropertyID)
  const [callData, setCallData] = useState([])
  const callDataRef = useRef([]) // keep latest value for intervals
  const wakeupIntervalRef = useRef(null)
  const timerIntervalRef = useRef(null)

  const flag = useSelector(state => state.navbar.flag)

  // memoized fetch so identity is stable
  const getWakepuData = useCallback(async () => {
    try {
      const res = await axios.get(`/wakeupcall/alarms?PropertyID=${PropertyID}`, {
        headers: {
          LoginID,
          Token
        }
      })
      if (res?.data && res.data[0] && res.data[0].length > 0) {
        const result = res.data[0]
        const new_arr = result.map(i => ({ ...i, display: false }))
        setCallData(new_arr)
        callDataRef.current = new_arr
      } else {
        setCallData([])
        callDataRef.current = []
      }
    } catch (error) {
      console.log('error callData', error)
    }
  }, [LoginID, Token, PropertyID])

  // fetch when flag changes (or on mount) — identity stable thanks to useCallback
  useEffect(() => {
    getWakepuData()
  }, [flag, getWakepuData])

  console.log('call data', callData)

  // timer function reads from ref (latest callData) to avoid re-creating interval
  const setTimers = useCallback(() => {
    const list = callDataRef.current || []
    if (list.length > 0) {
      list.forEach(call => {
        const now = moment().format()
        const dif = moment(call.WakeUpTime, "HH:mm").diff(moment(now, "HH:mm"), "minutes")
        if (dif <= 5 && dif > 0 && call.display === false) {
          const time = moment(call.WakeUpTime).format("LT")
          call.display = true
          return MySwal.fire({
            title: "WAKEUP CALL ALERT",
            html:
              `<h4>Time - ${time}</h4></br><h6>Floor No - ${call.FloorNo}, Room No - ${call.RoomNo}</h6></br><h6>Guest Name - ${call.GuestName}, Mobile No - ${call.GuestMobileNumber}</h6>`,
            customClass: { confirmButton: "btn btn-primary" },
            buttonsStyling: false
          })
        } else if (dif === 1 && call.display && call.Status === "Active") {
          const time = moment(call.WakeUpTime).format("LT")
          return MySwal.fire({
            title: "WAKEUP CALL ALERT",
            html:
              `<h4>Time - ${time}</h4></br><h6>Floor No - ${call.FloorNo}, Room No - ${call.RoomNo}</h6></br><h6>Guest Name - ${call.GuestName}, Mobile No - ${call.GuestMobileNumber}</h6>`,
            customClass: { confirmButton: "btn btn-primary" },
            buttonsStyling: false
          })
        }
      })
    }
  }, [])

  // set intervals once and cleanup on unmount — prevents multiple API calls
  useEffect(() => {
    // hourly fetch
    wakeupIntervalRef.current = setInterval(() => {
      getWakepuData()
    }, 60 * 60 * 1000)

    // per-minute timer checks
    timerIntervalRef.current = setInterval(() => {
      setTimers()
    }, 60 * 1000)

    return () => {
      clearInterval(wakeupIntervalRef.current)
      clearInterval(timerIntervalRef.current)
    }
  }, [getWakepuData, setTimers])

  // keep ref synced if other code updates callData
  useEffect(() => {
    callDataRef.current = callData
  }, [callData])

  return (
    <Fragment>
      <div className="bookmark-wrapper d-flex align-items-center">
        <ul className="navbar-nav d-xl-none">
          <NavItem className="mobile-menu me-auto">
            <NavLink
              className="nav-menu-main menu-toggle hidden-xs is-active"
              onClick={() => setMenuVisibility(true)}
            >
              <Menu className="ficon" />
            </NavLink>
          </NavItem>
        </ul>
        <NavItem className="d-none d-lg-block">
          <NavLink className="nav-link-style">
            <ThemeToggler />
          </NavLink>
        </NavItem>
      </div>
      <NavbarUser skin={skin} setSkin={setSkin} />
    </Fragment>
  )
}


export default ThemeNavbar
