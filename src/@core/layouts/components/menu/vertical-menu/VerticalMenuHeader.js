// ** React Imports
import { useEffect } from "react"
import { NavLink } from "react-router-dom"

// ** Icons Imports
import { Disc, X, Circle } from "react-feather"

// ** Config
import themeConfig from "@configs/themeConfig"
import wowinfoLogo from "../../../../../assets/images/logo/wow-logo-whiteBG.webp"

// ** Utils
//import { getUserData, getHomeRouteForLoggedInUser } from "@utils"

const VerticalMenuHeader = (props) => {
  // ** Props
  const {
    menuCollapsed,
    setMenuCollapsed,
    setMenuVisibility,
    setGroupOpen,
    menuHover
  } = props

  // ** Vars
  //const user = getUserData()

  // ** Reset open group
  useEffect(() => {
    if (!menuHover && menuCollapsed) setGroupOpen([])
  }, [menuHover, menuCollapsed])

  // ** Menu toggler component
  const Toggler = () => {
    if (!menuCollapsed) {
      return (
        <Disc
          size={20}
          data-tour="toggle-icon"
          className="text-primary toggle-icon d-none d-xl-block"
          onClick={() => setMenuCollapsed(true)}
        />
      )
    } else {
      return (
        <Circle
          size={20}
          data-tour="toggle-icon"
          className="text-primary toggle-icon d-none d-xl-block"
          onClick={() => setMenuCollapsed(false)}
        />
      )
    }
  }

  return (
    <div className="navbar-header">
      <ul className="nav navbar-nav flex-row">
        <li className="nav-item">
          <NavLink
            to="/dashboard"
            className="navbar-brand"
          >
            <span className="brand-logo">
              {/* <img src={themeConfig.app.appLogoImage} alt="logo" /> */}
              {/* <img src={wowinfoLogo} alt="logo" /> */}
            </span>
            {/* <h2 style={{ paddingLeft: '0.5em' }} className="brand-text mb-0 ">{themeConfig.app.appName}</h2> */}
            <h2 style={{ paddingLeft: '0.5em' }} className="brand-text mb-0 ">License Manager</h2>
            {/* <p className="text-primary mb-0">{themeConfig.app.appName}</p> */}
          </NavLink>
        </li>
        <li className="nav-item nav-toggle">
          <div className="nav-link modern-nav-toggle cursor-pointer">
            <Toggler />
            <X
              onClick={() => setMenuVisibility(false)}
              className="toggle-icon icon-x d-block d-xl-none"
              size={20}
            />
          </div>
        </li>
      </ul>
    </div>
  )
}

export default VerticalMenuHeader
