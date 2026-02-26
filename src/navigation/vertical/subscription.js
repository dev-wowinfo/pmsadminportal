// import { BiCurrentLocation } from "react-icons/bi"
import { MdOutlineInventory } from "react-icons/md"
import { AiOutlineArrowRight } from "react-icons/ai"

export default [
    {
        id: 'subscription',
        title: 'Subscription',
        icon: <MdOutlineInventory size={20} />,
        navLink: '/subscription',
        children: [
            {
                id: 'productMaster',
                title: 'All subscription',
                icon: <AiOutlineArrowRight size={20} />,
                navLink: '/productMaster'
            },
            {
                id: 'purchaseOrder',
                title: 'Purchase Order',
                icon: <AiOutlineArrowRight size={20} />,
                navLink: '/purchaseOrder'
            },
            {
                id: 'purchaseReceive',
                title: 'Purchase Receive',
                icon: <AiOutlineArrowRight size={20} />,
                navLink: '/purchaseReceive'
            },
            // {
            //     id: 'stockCount',
            //     title: 'Stock Count',
            //     icon: <AiOutlineArrowRight size={20} />,
            //     navLink: '/stockCount'
            // }
        ]
    }
]
