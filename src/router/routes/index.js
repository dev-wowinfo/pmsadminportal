// ** React Imports
import { Fragment, lazy } from "react";
import { Navigate } from "react-router-dom";
// ** Layouts
import BlankLayout from "@layouts/BlankLayout";
import VerticalLayout from "@src/layouts/VerticalLayout";
import HorizontalLayout from "@src/layouts/HorizontalLayout";
import LayoutWrapper from "@src/@core/layouts/components/layout-wrapper";

// ** Route Components
import PublicRoute from "@components/routes/PublicRoute";
import PrivateRoute from "@components/routes/PrivateRoute";

// ** Utils
import { isObjEmpty } from "@utils";
import DashBoard from "../../views/DashBoard/DashBoard";
import ContactlessRequest from "../../views/Service/ContactlessRequest";
import IBEBooking from "../../views/Service/IBEBooking";
// import RoomCategory from "../../views/FrontDesk/RoomCategory"
// import RoomNumber from "../../views/FrontDesk/RoomNumber"
import RateInventory from "../../views/RateInventory/RateInventory";
import Promotions from "../../views/Promotions/LicenseManagement.js";
import NightAudit from "../../views/NightAudit/NightAudit";
import PaymentMethod from "../../views/MasterSetting/PaymentMethod";
// import DebtorAccount from "../../views/MasterSetting/DebtorAccount"
// import TravelAgent from "../../views/MasterSetting/TravelAgent"
import ExtraBedCharges from "../../views/MasterSetting/ExtraBedCharges";
import IdCard from "../../views/MasterSetting/IdCard";
import Note from "../../views/MasterSetting/Note";
import Discount from "../../views/MasterSetting/Discount";
import Common from "../../views/MasterSetting/Common/Common";
import Hotel from "../../views/PropertyMaster/Hotel/Hotel";
import Floor from "../../views/PropertyMaster/Floor/Floor";
import Contact from "../../views/PropertyMaster/Contact";
import BankDetails from "../../views/PropertyMaster/BankDetails";
import RoomDetails from "../../views/PropertyMaster/RoomDetails/RoomDetails";
//import AccountSetup from "../../views/PropertyMaster/AccountSetup/AccountSetup"
import PropertyPhotos from "../../views/PropertyMaster/PropertyPhoto/PropertyPhotos";
import CancelPolicy from "../../views/PropertyMaster/CancelPolicy/CancelPolicy";
import PayAtHotelSetting from "../../views/PropertyMaster/PayAtHotelSetting";
import GSTDetails from "../../views/PropertyMaster/GSTDetails";
import GSTTaxes from "../../views/PropertyMaster/GSTTaxes";
import AddOnServices from "../../views/PropertyMaster/AddOnService/AddOnServices";
import PromoCode from "../../views/PropertyMaster/PromoCode";
import Package from "../../views/PropertyMaster/PackageMaster/Package";
import TermsAndConditions from "../../views/PropertyMaster/TermsAndCondition/TermsAndConditionsDetails";
//import VendorMaster from "../../views/RoomInventory/VendorMaster/VendorMaster"
import ProductMaster from "../../views/RoomInventory/ProductMaster/ProductMaster";
import PurchaseInvoice from "../../views/RoomInventory/PurchaseOrder/PurchaseOrder";
import PurchaseReceive from "../../views/RoomInventory/PurchaseReceive/PurchaseReceive";
import StockCount from "../../views/RoomInventory/StockCount";
import GuestList from "../../views/Reports/GuestList";
import GuestWithRate from "../../views/Reports/GuestWithRate";
import GuestWithoutRate from "../../views/Reports/GuestWithoutRate";
import Cashiering from "../../views/Reports/Cashiering";
import Laundry from "../../views/Reports/Laundry";
import Admin from "../../views/Reports/Admin";
import BedType from "../../views/PropertyMaster/BedType/BedType";
import ExtraBedType from "../../views/PropertyMaster/ExtraBedType/ExtraBedType";
import RoomView from "../../views/PropertyMaster/RoomView/RoomView";
import Users from "../../views/HouseKeeping/pages/Users";
import Status from "../../views/HouseKeeping/pages/Status";
import CheckList from "../../views/HouseKeeping/pages/CheckList";
import HouseKeepingLogin from "../../views/HouseKeeping/pages/HouseKeepingLogin";
import LogedUserAccess from "../../views/HouseKeeping/pages/LogedUserAccess";
import ChangePassword from "../../views/ChangePassword";
import LaundryTransaction from "../../views/Laundry/LaundryTransaction";
import Country from "../../views/RegionMaster/Country/Country";
import PreviewCard from "../../apps/Templates/PreviewCard";
import PreviewCard2 from "../../apps/Templates/PreviewCard2";
import Voucher from "../../apps/Templates/Voucher";
import LaundryTemplate from "../../apps/Templates/LaundryTemplate";
import PosInvoice from "../../apps/Templates/PosInvoice";
import Invoice from "../../apps/Templates/Invoice";
import Invoice1 from "../../apps/Templates/Invoice1";
import Voucher1 from "../../apps/Templates/Voucher1";
import KOT from "../../apps/Templates/KOT";
import BookingReport from "../../views/Reports/BookingReport";
import StayOver from "../../views/Reports/StayOver";
import PaymentFolio from "../../views/Reports/PaymentFolio";
import CreditReport from "../../views/Reports/CreditReport";
import RevenueReport from "../../views/Reports/RevenueReport";
import OTAReport from "../../views/Reports/OTAReport";
import GSTReport from "../../views/Reports/GSTReport";
import CorporateGSTReport from "../../views/Reports/CorporateGSTReport";
import Notifications from "../../views/Reports/Notifications";
import BookingEngine from "../../views/bookingengine";
import NewPage from "../../views/newpage";
import ManageProfile from '../../views/PropertyMaster/AccountSetup/ProfileModal'
import LicenseManagement from "../../views/Promotions/LicenseManagement.js";
import SubscriptionPlan from "../../views/GuestMaster/SubscriptionPlan.js";
import HotelManagement from "../../views/FrontDesk/Hotel Management.js";

// import ManageProfile from '../../../../ layouts/components/menu/vertical-menu/EditProfileModal.js'
// import PaymentGateWay from "../../views/FrontDesk/PaymentsFolioAcc/PaymentGateWay";
// import pos2 from "../../views/POS2/POS2"

const getLayout = {
  blank: <BlankLayout />,
  vertical: <VerticalLayout />,
  horizontal: <HorizontalLayout />,
};

// ** Document title
const TemplateTitle = "%s - Hostynnist";

// ** Default Route
// const DefaultRoute = "/home"
const DefaultRoute = "/dashboard";

const Home = lazy(() => import("../../views/Home"));
const SecondPage = lazy(() => import("../../views/SecondPage"));
const Reservation = lazy(() =>
  import("../../views/SingleReservation/SingleReservation")
);
const NewReservation = lazy(() =>
  import("../../views/NewReservation/NewReservation.js")
);
// const SingleReservation = lazy(() => import("../../views/SingleReservation/SingleReservation"))
// const GroupReservation = lazy(() => import("../../views/GroupReservation/GroupReservation"))
const Login = lazy(() => import("../../views/Login"));
const Register = lazy(() => import("../../views/Register"));
const ForgotPassword = lazy(() => import("../../views/ForgotPassword"));
const GeneratePassword = lazy(() => import("../../views/GeneratePassword"));
const Error = lazy(() => import("../../views/Error"));
const Express = lazy(() => import("../../views/Service/Express"));
const ContactlessReq = lazy(() =>
  import("../../views/Service/ContactlessRequest")
);
const OnlineBookingView = lazy(() =>
  import("../../views/Service/OnlineBookingView")
);
const RoomCateg = lazy(() => import("../../views/FrontDesk/RoomCategory"));
const RoomNo = lazy(() => import("../../views/FrontDesk/RoomNumber"));
const FrontDesk = lazy(() => import("../../views/FrontDesk/RoomNumber"));
const AddLaundry = lazy(() => import("../../views/Laundry/AddLaundry"));
const History = lazy(() => import("../../views/Laundry/History/History"));
const WakeUpCall = lazy(() => import("../../views/WakeUPCall/WakeUpCall"));
const POS = lazy(() => import("../../views/POS2/POS2"));
const RateAndInventory = lazy(() =>
  import("../../views/RateInventory/RateInventory")
);
const Promotion = lazy(() => import("../../views/Promotions/LicenseManagement.js"));
const RatingReviews = lazy(() =>
  import("../../views/RatingsReviews/RatingReviews")
);
const NAudit = lazy(() => import("../../views/NightAudit/NightAudit"));
const CommonMaster = lazy(() =>
  import("../../views/MasterSetting/Common/Common")
);
const PaymentMethodMaster = lazy(() =>
  import("../../views/MasterSetting/PaymentMethod")
);
// const DebtorAccountMaster = lazy(() => import("../../views/MasterSetting/DebtorAccount"))
// const TravelAgentMaster = lazy(() => import("../../views/MasterSetting//TravelAgent"))
const ExtraBedChargesMaster = lazy(() =>
  import("../../views/MasterSetting/ExtraBedCharges")
);
const IdCardMaster = lazy(() => import("../../views/MasterSetting/IdCard"));
const NoteMaster = lazy(() => import("../../views/MasterSetting/Note"));
const DiscountMaster = lazy(() => import("../../views/MasterSetting/Discount"));
const HotelMaster = lazy(() =>
  import("../../views/PropertyMaster/Hotel/Hotel")
);
//test
const UserMaster = lazy(() => import("../../views/PropertyMaster/User/User"));
const FloorMaster = lazy(() =>
  import("../../views/PropertyMaster/Floor/Floor")
);
const ContactMaster = lazy(() => import("../../views/PropertyMaster/Contact"));
const BankDetailsMaster = lazy(() =>
  import("../../views/PropertyMaster/BankDetails")
);
const RoomDetailsMaster = lazy(() =>
  import("../../views/PropertyMaster/RoomDetails/RoomDetails")
);
const RoomType = lazy(() =>
  import("../../views/PropertyMaster/RoomType/RoomType")
);
const BedTypeMaster = lazy(() =>
  import("../../views/PropertyMaster/BedType/BedType")
);
const ExtraBedTypeMaster = lazy(() =>
  import("../../views/PropertyMaster/ExtraBedType/ExtraBedType")
);
const RoomViewMaster = lazy(() =>
  import("../../views/PropertyMaster/RoomView/RoomView")
);
const AccountSetup = lazy(() =>
  import("../../views/PropertyMaster/AccountSetup/AccountSetup")
);
const PropertyDocumentMaster = lazy(() =>
  import("../../views/PropertyMaster/PropertyDocument/PropertyDocument")
);
const CancelPolicyMaster = lazy(() =>
  import("../../views/PropertyMaster/CancelPolicy/CancelPolicy")
);
const PayAtHotelSettingMaster = lazy(() =>
  import("../../views/PropertyMaster/PayAtHotelSetting")
);
const GSTDetailsMaster = lazy(() =>
  import("../../views/PropertyMaster/GSTDetails")
);
const GSTTaxesMaster = lazy(() =>
  import("../../views/PropertyMaster/GSTTaxes")
);
const AddOnServicesMaster = lazy(() =>
  import("../../views/PropertyMaster/AddOnService/AddOnServices")
);
const PromoCodeMaster = lazy(() =>
  import("../../views/PropertyMaster/PromoCode")
);
const PackageMaster = lazy(() =>
  import("../../views/PropertyMaster/PackageMaster/Package")
);
const CityMaster = lazy(() => import("../../views/RegionMaster/City/City"));
const DistrictMaster = lazy(() =>
  import("../../views/RegionMaster/District/District")
);
const StateMaster = lazy(() => import("../../views/RegionMaster/State/State"));
//const Vendor = lazy(() => import("../../views/RoomInventory/VendorMaster/VendorMaster"))
const Product = lazy(() =>
  import("../../views/RoomInventory/ProductMaster/ProductMaster")
);
const PurchaseInvoiceMaster = lazy(() =>
  import("../../views/RoomInventory/PurchaseOrder/PurchaseOrder")
);
const StockCountMaster = lazy(() =>
  import("../../views/RoomInventory/StockCount")
);
const GuestListReport = lazy(() => import("../../views/Reports/GuestList"));
const GuestWithRateReport = lazy(() =>
  import("../../views/Reports/GuestWithRate")
);
const GuestWithoutRateReport = lazy(() =>
  import("../../views/Reports/GuestWithoutRate")
);
const CashieringReport = lazy(() => import("../../views/Reports/Cashiering"));
const HouseKeepingReport = lazy(() =>
  import("../../views/Reports/HouseKeepingReport")
);
const LaundryReport = lazy(() => import("../../views/Reports/Laundry"));
const AdminReport = lazy(() => import("../../views/Reports/Admin"));
const POS2 = lazy(() => import("../../views/POS2/POS2"));
const WebCheckIn = lazy(() => import("../../views/WebCheckIn/WebCheckIn"));
const PaymentGateWay = lazy(() => import("../../views/FrontDesk/PaymentsFolioAcc/PaymentGateWay"));
const PosProducts = lazy(() => import("../../views/POS2/Products/PosProducts"));
const PosProductsList = lazy(() => import("../../views/POS2/Menu/ProductList"));
const TableManage = lazy(() => import("../../views/POS2/Table/TableManage"));
const InvoiceListing = lazy(() =>
  import("../../views/POS2/Invoice/InvoiceListing")
);
const Help = lazy(() => import("../../views/Help/Help"));
const POSOrders = lazy(() => import("../../views/POS2/Order/POSOrders"));
const BookingChart = lazy(() => import("../../views/FrontDesk/Hotel Management.js"));
const PurchaseOrderInvoice = lazy(() =>
  import("../../apps/Templates/PurchaseOrderInvoice")
);
const PurchaseReceiveInvoice = lazy(() =>
  import("../../apps/Templates/PurchaseReceiveInvoice")
);
const GuestMaster = lazy(() => import("../../views/GuestMaster/SubscriptionPlan.js"));
const OtaVoucher = lazy(() => import("../../apps/Templates/OtaVoucher"));

// ** Merge Routes
const Routes = [
  {
    path: "/",
    index: true,
    element: <Navigate replace to={DefaultRoute} />,
  },
  {
    path: "*",
    index: true,
    element: <Error />,
    meta: {
      layout: "blank",
    },
  },
  {
    path: "/dashboard",
    index: true,
    element: <DashBoard />,
  },
  {
    path: "/home",
    element: <Home />,
  },
  {
    path: "/second-page",
    element: <SecondPage />,
  },
  {
    path: "/login",
    element: <Login />,
    meta: {
      layout: "blank",
    },
  },
  {
    path: "/changepassword",
    element: <ChangePassword />,
    meta: {
      layout: "blank",
    },
  },
  {
    path: "/register",
    element: <Register />,
    meta: {
      layout: "blank",
    },
  },
  {
    path: "/forgot-password",
    element: <ForgotPassword />,
    meta: {
      layout: "blank",
      publicRoute: true,
      // restricted: true,
    },
  },
  {
    path: "/generate-password",
    element: <GeneratePassword />,
    meta: {
      layout: "blank",
      publicRoute: true,
      // restricted: true,
    },
  },
  {
    path: "/error",
    element: <Error />,
    meta: {
      layout: "blank",
    },
  },
  {
    path: "/voucher",
    element: <Voucher />,
    meta: {
      layout: "blank",
    },
  },
  {
    path: "/otaVoucher/:id",
    element: <OtaVoucher />,
    meta: {
      layout: "blank",
    },
  },
  {
    path: "/laundryInvoice",
    element: <LaundryTemplate />,
    meta: {
      layout: "blank",
    },
  },
  {
    path: "/posInvoice",
    element: <PosInvoice />,
    meta: {
      layout: "blank",
    },
  },
  {
    path: "/kot",
    element: <KOT />,
    meta: {
      layout: "blank",
    },
  },
  {
    path: "/preview",
    element: <PreviewCard />,
    meta: {
      layout: "blank",
    },
  },
  {
    path: "/preview2",
    element: <PreviewCard2 />,
    meta: {
      layout: "blank",
    },
  },
  {
    path: "/invoice",
    element: <Invoice />,
    meta: {
      layout: "blank",
    },
  },
  {
    path: "/invoice1",
    element: <Invoice1 />,
    meta: {
      layout: "blank",
    },
  },
  {
    path: "/voucher1",
    element: <Voucher1 />,
    meta: {
      layout: "blank",
    },
  },
  // {
  //   path: '/reservation',
  //   element: <Reservation />
  // },
  {
    path: "/new_reservation",
    element: <NewReservation />,
    meta: {
      publicRoute: false,
      restricted: true,
    }
  },
  {
    path: "/bookinghistory",
    element: <Express />,
  },
  {
    path: "/manageProfile",
    element: <ManageProfile />,
  },
  {
    path: "/expressService",
    element: <Express />,
  },
  {
    path: "/contactlessRequest",
    element: <ContactlessRequest />,
  },
  {
    path: "/IBEBooking",
    element: <IBEBooking />,
  },
  {
    path: "/bookingView/:id",
    element: <OnlineBookingView />,
    meta: {
      layout: "blank",
    },
  },
  {
    path: "/front-desk",
    element: <FrontDesk />,
  },
  {
    path: "/hotelManagement",
    element: <HotelManagement/>,
  },
  
  // {
  //   path: '/roomCategory',
  //   element: <RoomCategory />
  // },
  // {
  //   path: '/roomNumber',
  //   element: <RoomNumber />
  // },
  // {
  //   path: '/housekeepingusers',
  //   element: <Users />
  // },
  {
    path: "/housekeepingstatus",
    element: <Status />,
  },
  {
    path: "/housekeepingchecklist",
    element: <CheckList />,
  },
  // {
  //   path: '/housekeepinglogin',
  //   element: <HouseKeepingLogin />
  // },
  {
    path: "/housekeepinglogin/newloginuser",
    element: <LogedUserAccess />,
  },
  {
    path: "/addLaundry",
    element: <AddLaundry />,
  },
  {
    path: "/laundry/transaction",
    element: <LaundryTransaction />,
  },
  {
    path: "/history",
    element: <History />,
  },
  {
    path: "/WakeUpCall",
    element: <WakeUpCall />,
  },
  {
    path: "/pos",
    element: <POS />,
  },
  {
    path: "/rateInventory",
    element: <RateInventory />,
  },
  {
    path: "/licenseManagement",
    element: <LicenseManagement />,
  },
  
  {
    path: "/ratingsReviews",
    element: <RatingReviews />,
  },
  {
    path: "/nightAudit",
    element: <NightAudit />,
  },
  {
    path: "/commonMasters",
    element: <Common />,
  },
  {
    path: "/paymentMethodMaster",
    element: <PaymentMethod />,
  },
  // {
  //   path: '/debtorAccountMaster',
  //   element: <DebtorAccount />
  // },
  // {
  //   path: '/travelAgentMaster',
  //   element: <TravelAgent />
  // },
  {
    path: "/extraBedCharges",
    element: <ExtraBedCharges />,
  },
  {
    path: "/idCardMaster",
    element: <IdCard />,
  },
  {
    path: "/noteMaster",
    element: <Note />,
  },
  {
    path: "/discountMaster",
    element: <Discount />,
  },
  {
    path: "/hotelMaster",
    element: <Hotel />,
  },
  {
    path: "/userMaster",
    element: <UserMaster />,
  },
  {
    path: "/floorMaster",
    element: <Floor />,
  },
  {
    path: "/contact",
    element: <Contact />,
  },
  {
    path: "/bankDetails",
    element: <BankDetails />,
  },
  {
    path: "/roomDetails",
    element: <RoomDetails />,
  },
  {
    path: "/roomType",
    element: <RoomType />,
  },
  {
    path: "/bedType",
    element: <BedType />,
  },
  {
    path: "/extraBedType",
    element: <ExtraBedType />,
  },
  {
    path: "/roomView",
    element: <RoomView />,
  },
  {
    path: "/accountSetup",
    element: <AccountSetup />,
  },
  {
    path: "/propertyPhotos",
    element: <PropertyPhotos />,
  },
  {
    path: "/propertyDocument",
    element: <PropertyDocumentMaster />,
  },
  // {
  //   path: '/cancelPolicy',
  //   element: <CancelPolicy />
  // },
  // {
  //   path: '/payAtHotelSetting',
  //   element: <PayAtHotelSetting />
  // },
  {
    path: "/gstDetails",
    element: <GSTDetails />,
  },
  {
    path: "/gstTaxes",
    element: <GSTTaxes />,
  },
  {
    path: "/addOnServices",
    element: <AddOnServices />,
  },
  {
    path: "/promoCode",
    element: <PromoCode />,
  },
  {
    path: "/packageMaster",
    element: <Package />,
  },
  {
    path: "/termsConditions",
    element: <TermsAndConditions />,
  },
  // {
  //   path: '/cityMaster',
  //   element: <CityMaster />
  // },
  // {
  //   path: '/districtMaster',
  //   element: <DistrictMaster />
  // },
  // {
  //   path: '/stateMaster',
  //   element: <StateMaster />
  // },
  // {
  //   path: '/countryMaster',
  //   element: <Country />
  // },
  // {
  //   path: '/vendorMaster',
  //   element: <VendorMaster />
  // },
  {
    path: "/productMaster",
    element: <ProductMaster />,
  },
  {
    path: "/purchaseOrder",
    element: <PurchaseInvoice />,
  },
  {
    path: "/purchaseOrderInvoice/:id",
    element: <PurchaseOrderInvoice />,
    meta: {
      layout: "blank",
    },
  },
  {
    path: "/purchaseReceiveInvoice/:id",
    element: <PurchaseReceiveInvoice />,
    meta: {
      layout: "blank",
    },
  },
  {
    path: "/purchaseReceive",
    element: <PurchaseReceive />,
  },
  {
    path: "/stockCount",
    element: <StockCount />,
  },
  {
    path: "/guestList",
    element: <GuestList />,
  },
  {
    path: "/bookingReport",
    element: <BookingReport />,
  },
  {
    path: "/stayOver",
    element: <StayOver />,
  },
  {
    path: "/creditReport",
    element: <CreditReport />,
  },
  {
    path: "/revenueReport",
    element: <RevenueReport />,
  },
  {
    path: "/otaReport",
    element: <OTAReport />,
  },
  {
    path: "/gstReport",
    element: <GSTReport />,
  },
  {
    path: "/corporateGSTReport",
    element: <CorporateGSTReport />,
  },
  {
    path: "/notifications",
    element: <Notifications />,
  },
  {
    path: "/paymentFolio",
    element: <PaymentFolio />,
  },
  {
    path: "/paylink",
    element: <PaymentGateWay />,
    meta: {
      layout: "blank",
      publicRoute: true,
      // restricted: true,
    },
  },
  {
    path: "/BookingEngine",
    element: <BookingEngine />,
    meta: {
      layout: "blank",
      publicRoute: true,
      // restricted: true,
    },
  },
  {
    path: "/newpage",
    element: <NewPage />,
    meta: {
      layout: "blank",
      publicRoute: true,
      // restricted: true,
    },
  },
  {
    path: "/guestWithRate",
    element: <GuestWithRate />,
  },
  {
    path: "/guestWithoutRate",
    element: <GuestWithoutRate />,
  },
  {
    path: "/cashieringReport",
    element: <Cashiering />,
  },
  {
    path: "/houseKeepingReport",
    element: <HouseKeepingReport />,
  },
  {
    path: "/laundryReport",
    element: <Laundry />,
  },
  {
    path: "/adminReport",
    element: <Admin />,
  },
  {
    path: "/pos2",
    element: <POS2 />,
  },
  {
    path: "/webcheckin",
    element: <WebCheckIn />,
    meta: {
      layout: "blank",
      publicRoute: true,
      // restricted: true,
    },
  },
  {
    path: "/posProducts/:name/:id",
    element: <PosProducts />,
  },
  {
    path: "/posProductList/:name/:id",
    element: <PosProductsList />,
    meta: {
      layout: "blank",
    },
  },
  {
    path: "/tableManage/:name/:id",
    element: <TableManage />,
  },
  {
    path: "/posInvoiceListing/:name/:id",
    element: <InvoiceListing />,
  },
  {
    path: "/posOrders/:name/:id",
    element: <POSOrders />,
  },
  {
    path: "/subscriptionPlan",
    element: <SubscriptionPlan />,
  },
  {
    path: "/help",
    element: <Help />,
  },
];

const getRouteMeta = (route) => {
  if (isObjEmpty(route.element.props)) {
    if (route.meta) {
      return { routeMeta: route.meta };
    } else {
      return {};
    }
  }
};

// ** Return Filtered Array of Routes & Paths
const MergeLayoutRoutes = (layout, defaultLayout) => {
  const LayoutRoutes = [];

  if (Routes) {
    Routes.filter((route) => {
      let isBlank = false;
      // ** Checks if Route layout or Default layout matches current layout
      if (
        (route.meta && route.meta.layout && route.meta.layout === layout) ||
        ((route.meta === undefined || route.meta.layout === undefined) &&
          defaultLayout === layout)
      ) {
        let RouteTag = PrivateRoute;

        // ** Check for public or private route
        if (route.meta) {
          route.meta.layout === "blank" ? (isBlank = true) : (isBlank = false);
          RouteTag = route.meta.publicRoute ? PublicRoute : PrivateRoute;
        }
        if (route.element) {
          const Wrapper =
            // eslint-disable-next-line multiline-ternary
            isObjEmpty(route.element.props) && isBlank === false
              ? // eslint-disable-next-line multiline-ternary
              LayoutWrapper
              : Fragment;

          route.element = (
            <Wrapper {...(isBlank === false ? getRouteMeta(route) : {})}>
              <RouteTag route={route}>{route.element}</RouteTag>
            </Wrapper>
          );
        }

        // Push route to LayoutRoutes
        LayoutRoutes.push(route);
      }
      return LayoutRoutes;
    });
  }
  return LayoutRoutes;
};

const getRoutes = (layout) => {
  const defaultLayout = layout || "vertical";
  const layouts = ["vertical", "horizontal", "blank"];

  const AllRoutes = [];

  layouts.forEach((layoutItem) => {
    const LayoutRoutes = MergeLayoutRoutes(layoutItem, defaultLayout);

    AllRoutes.push({
      path: "/",
      element: getLayout[layoutItem] || getLayout[defaultLayout],
      children: LayoutRoutes,
    });
  });
  return AllRoutes;
};

export { DefaultRoute, TemplateTitle, Routes, getRoutes };
