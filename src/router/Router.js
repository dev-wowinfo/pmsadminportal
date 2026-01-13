// ** Router imports
import { Navigate, useRoutes, useSearchParams } from "react-router-dom";
import { getHomeRouteForLoggedInUser, getUserData } from "../utility/Utils";
import BlankLayout from "@layouts/BlankLayout";
import Login from "../views/Login";
import { lazy } from "react";
import ChangePassword from "../views/ChangePassword";

const Router = ({ allRoutes }) => {
  const Error = lazy(() => import("../views/Error"));

  const getHomeRoute = () => {
    const user = getUserData();

    if (user) {
      // console.log("isLogin", user);
      return getHomeRouteForLoggedInUser(user[0]?.UserRole);
    } else {
      return "/login";
    }
  };
  const showPageByPath = () => {
    const [tokenQuery, setTokenQuery] = useSearchParams("");
    const isTcode = tokenQuery.get("tcode");
    // console.log("tokenQuery", tokenQuery); 
    if (isTcode) {
      return {
        path: "/changepassword",
        element: <ChangePassword />,
      };
    }
    if (getUserData()?.[0]?.UserRole) {
      return {
        path: "/login",
        index: true,
        element: <Navigate replace to={getHomeRoute()} />,
      };
    }
    return {
      path: "/login",

      element: <BlankLayout />,
      children: [{ path: "/login", element: <Login /> }],
    };
  };

  const routes = useRoutes([
    {
      path: "/",
      index: true,
      element: <Navigate replace to={getHomeRoute()} />,
    },
    showPageByPath(),
    {
      path: "*",
      element: <BlankLayout />,
      children: [{ path: "*", element: <Error /> }],
    },
    ...allRoutes,
  ]);

  // console.log(routes);

  return routes;
};

export default Router;
