import { BiBuildingHouse } from "react-icons/bi"
import { AiOutlineArrowRight } from "react-icons/ai"
// import { HiOutlineHomeModern } from "react-icons/hi"

export default [
    {
        id: 'planmaster',
        title: 'Master Plan',
        icon: <BiBuildingHouse size={20} />,
        navLink: '/planmaster',
        children: [
            {
                id: 'hotelMaster',
                title: 'Product',
                icon: <AiOutlineArrowRight size={20} />,
                navLink: '/hotelMaster'
            },
            {
                id: 'userMaster',
                title: 'LLM',
                icon: <AiOutlineArrowRight size={20} />,
                navLink: '/userMaster'
            },
            
        ]
    }
]