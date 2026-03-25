// import { BsTagFill } from "react-icons/bs"


// export default [
//   {
//     id: 'Licences',
//     title: 'Licences',
//     icon: <BsTagFill size={20} />,
//     navLink: '/licenseManagement'
//   }
// ]

import { BsTagFill } from "react-icons/bs"
import { BiBuildingHouse } from "react-icons/bi"
import { AiOutlineArrowRight } from "react-icons/ai"


export default [
  {
    id: 'Licences',
    title: 'Plan Master',
    icon: <BiBuildingHouse size={20} />,
    navLink: '/pannelmaster',
    children: [
      {
        id: 'plansMaster',
        title: 'Plans',
        icon: <AiOutlineArrowRight size={20} />,
        navLink: '/plans'
      },

    ]
  }
]

