import { BiBuildingHouse } from "react-icons/bi"
import { AiOutlineArrowRight } from "react-icons/ai"
// import { HiOutlineHomeModern } from "react-icons/hi"

export default [
    {
        id: 'pannelmaster',
        title: 'Product Master',
        icon: <BiBuildingHouse size={20} />,
        navLink: '/pannelmaster',
        children: [
            {
                id: 'productsMaster',
                title: 'Products',
                icon: <AiOutlineArrowRight size={20} />,
                navLink: '/products'
            },
            {
                id: 'categoryMaster',
                title: 'Category',
                icon: <AiOutlineArrowRight size={20} />,
                navLink: '/category'
            },
            // {
            //     id: 'plansMaster',
            //     title: 'Plans',
            //     icon: <AiOutlineArrowRight size={20} />,
            //     navLink: '/plans'
            // },
            // {
            //     id: 'priceMaster',
            //     title: 'Plan Pricing',
            //     icon: <AiOutlineArrowRight size={20} />,
            //     navLink: '/priceMaster'
            // },
            // {
            //     id: 'feature',
            //     title: 'Features',
            //     icon: <AiOutlineArrowRight size={20} />,
            //     navLink: '/featureMaster'
            // },
            
        ]
    }
]