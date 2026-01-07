// ** React Imports
import { Suspense, lazy } from "react"
import { createRoot } from "react-dom/client"
import { BrowserRouter } from "react-router-dom"

// ** Redux Imports
import { persistor, store } from "./redux/store"
import { Provider } from "react-redux"
// import { storeClassic } from './redux-classic/storeConfig/storeClassic'

// ** ThemeColors Context

import { ThemeContext } from "./utility/context/ThemeColors"

// ** ThemeConfig
import themeConfig from "./configs/themeConfig"

// ** Toast **
import { Toaster } from "react-hot-toast"

// ** Spinner (Splash Screen)
import Spinner from "./@core/components/spinner/Fallback-spinner"

// ** Ripple Button
import "./@core/components/ripple-button"

// ** PrismJS
import "prismjs"
import "prismjs/themes/prism-tomorrow.css"
import "prismjs/components/prism-jsx.min"

// ** React Perfect Scrollbar
import "react-perfect-scrollbar/dist/css/styles.css"

// ** React Hot Toast Styles
import "@styles/react/libs/react-hot-toasts/react-hot-toasts.scss"

// ** Core styles
import "./@core/assets/fonts/feather/iconfont.css"
import "./@core/scss/core.scss"
import "./assets/scss/style.scss"
// import 'bootstrap/dist/css/bootstrap.min.css';

// ** Service Worker
// import * as serviceWorker from "./serviceWorker"
import { PersistGate } from "redux-persist/integration/react"

// ** Lazy load app
const LazyApp = lazy(() => import("./App"))

const container = document.getElementById("root")
const root = createRoot(container)
import ReactDOM from "react-dom";


// root.render(
//   <BrowserRouter>
//     <Provider store={store}>
//     <PersistGate loading={null} persistor={persistor}>
//       {/* <Provider store={storeClassic}> */}
//         <Suspense fallback={<Spinner />}>
//           <ThemeContext>
//             <LazyApp />
//             <Toaster
//               position={themeConfig.layout.toastPosition}
//               toastOptions={{ className: "react-hot-toast" }}
//             />
//           </ThemeContext>
//         </Suspense>
//       {/* </Provider> */}
//       </PersistGate>
//     </Provider>
//   </BrowserRouter>
// )

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
// serviceWorker.unregister() dur to we have another service worker file in public folder thats why we removed from src file



ReactDOM.render(
  <BrowserRouter>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <Suspense fallback={<Spinner />}>
          <ThemeContext>
            <LazyApp />
            <Toaster
              position={themeConfig.layout.toastPosition}
              toastOptions={{ className: "react-hot-toast" }}
            />
          </ThemeContext>
        </Suspense>
      </PersistGate>
    </Provider>
  </BrowserRouter>,
  document.getElementById("root")
);

