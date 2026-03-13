// import { Mail, Home } from "react-feather"

// export default [
//   {
//     id: "home",
//     title: "Home",
//     icon: <Home size={20} />,
//     navLink: "/home"
//   },
//   {
//     id: "secondPage",
//     title: "Second Page",
//     icon: <Mail size={20} />,
//     navLink: "/second-page"
//   }
// ]

import reservation from './reservation'
// import service from './service'
import frontDesk from './frontDesk'
import housekeeping from './houseKeeping'
import laundry from './laundry'
import WakeUpCall from './wakeUpCall'
import licence from './pos'
import rateInventory from './rateInventory'
import promotions from './promotions'
import ratingsReviews from './ratingsReviews'
import Audit from './Audit'
import dashboard from './dashboard'
// import licence from ''
import plan from './GuestMaster'
import hotels from './bookingChart'
import licences from './promotions'
// import planmaster from './planmaster'

import notifications from './rateInventory'
import propertyMaster from './propertyMaster'
import regionMaster from './regionMaster'
import roomInventory from './roomInventory'
import reports from './reports'
import setting from './setting'
import webcheckin from './webcheckin'
import help from './help'
import bookingChart from './bookingChart'
import GuestMaster from './GuestMaster'
import { useSelector } from 'react-redux'
import { userdata } from './hookcall'
import hotelPannel from './hotelPannel'
import subscription from './subscription'
import pannelmaster from './pannelmaster'

// const role = userdata()
// console.log('userStore::::: ', role)
let pageName = []

// ** Merge & Export
// if (role === 'admin') {
pageName = [
    ...dashboard,
    // ...licences, 
    ...pannelmaster,
    ...hotelPannel,
    ...subscription,
    ...notifications,
    // ...plan,
    // ...hotels,
    // ...planmaster,

    // ...frontDesk,
    // ...WakeUpCall,
    // ...pos,
    // ...rateInventory,
    // ...promotions,
    // ...ratingsReviews,
    // ...Audit,
    // ...GuestMaster,
    // ...masterSetting,
    // ...propertyMaster,
    // ...roomInventory,
    // ...reports,
    // ...setting,
    // ...help,

]
// } else {
//     pageName = [...dashboard,
//     ...reservation,
//     // ...frontDesk,
//     ...bookingChart,
//     ...housekeeping,
//     ...laundry,
//     ...WakeUpCall,
//     ...pos,
//     ...rateInventory,
//     ...promotions,
//     ...ratingsReviews,
//     ...Audit,
//     ...GuestMaster,
//     ...masterSetting,
//     ...propertyMaster,
//     ...roomInventory,
//     ...reports,
//     ...help
//     ]
// }

// ...regionMaster,
// ...webcheckin,
// ...service,

export default pageName;