// import { BiCurrentLocation } from "react-icons/bi"
import { AiOutlineArrowRight } from "react-icons/ai"
import { TbReportSearch } from "react-icons/tb"

export default [
  {
    id: 'reports',
    title: 'Hotel',
    icon: <TbReportSearch size={20} />,
    navLink: '/hotelPannel',
    children: [
      {
        id: 'listhotel',
        title: 'Hotel List',
        icon: <AiOutlineArrowRight size={20} />,
        navLink: '/listHotel'
      },
      {
        id: 'assignsubscription',
        title: 'Assign Subscription',
        icon: <AiOutlineArrowRight size={20} />,
        navLink: '/assignSubscription'
      },
      {
        id: 'paymentFolio',
        title: 'Subscription History',
        icon: <AiOutlineArrowRight size={20} />,
        navLink: '/subscriptionHistory'
      },
    //   {
    //     id: 'guestList',
    //     title: 'Guest List',
    //     icon: <AiOutlineArrowRight size={20} />,
    //     navLink: '/guestList'
    //   },
    //   {
    //     id: 'creditReport',
    //     title: 'Credit Report',
    //     icon: <AiOutlineArrowRight size={20} />,
    //     navLink: '/creditReport'
    //   },
    //   {
    //     id: 'revenueReport',
    //     title: 'Revenue Report',
    //     icon: <AiOutlineArrowRight size={20} />,
    //     navLink: '/revenueReport'
    //   },
    //   {
    //     id: 'otaReport',
    //     title: 'OTA Report',
    //     icon: <AiOutlineArrowRight size={20} />,
    //     navLink: '/otaReport'
    //   },
    //   {
    //     id: 'gstReport',
    //     title: 'GST Report',
    //     icon: <AiOutlineArrowRight size={20} />,
    //     navLink: '/gstReport'
    //   },
    //   {
    //     id: 'corporateGSTReport',
    //     title: 'Corp GST Report',
    //     icon: <AiOutlineArrowRight size={20} />,
    //     navLink: '/corporateGSTReport'
    //   },
      // {
      //   id: 'guestWithRate',
      //   title: 'Guest With Rate',
      //   icon: <AiOutlineArrowRight size={20} />,
      //   navLink: '/guestWithRate'
      // },
      // {
      //   id: 'guestWithoutRate',
      //   title: 'Guest Without Rate',
      //   icon: <AiOutlineArrowRight size={20} />,
      //   navLink: '/guestWithoutRate'
      // },
      // {
      //   id: 'cashieringReport',
      //   title: 'Cashiering',
      //   icon: <AiOutlineArrowRight size={20} />,
      //   navLink: '/cashieringReport'
      // },
      // {
      //   id: 'houseKeepingReport',
      //   title: 'House Keeping',
      //   icon: <AiOutlineArrowRight size={20} />,
      //   navLink: '/houseKeepingReport'
      // },
      // {
      //   id: 'laundryReport',
      //   title: 'Laundry',
      //   icon: <AiOutlineArrowRight size={20} />,
      //   navLink: '/laundryReport'
      // },
      // {
      //   id: 'adminReport',
      //   title: 'Admin',
      //   icon: <AiOutlineArrowRight size={20} />,
      //   navLink: '/adminReport'
      // }
    ]
  }
]
