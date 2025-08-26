import React from 'react';
import store from './store/store.js';
import { Provider } from 'react-redux';
import ReactDOM from 'react-dom/client'; 
import { RouterProvider, createBrowserRouter } from 'react-router-dom'
import { AuthLayout} from './components/index.js'
import './index.css';
import App from './App';
import Event from './pages/Event.js';
import Login from './pages/Login.js';
import Signup from './pages/Signup.js';
import HomePage from './pages/Home.js';
import Clubs from './pages/Clubs.js';

const router = createBrowserRouter([
  {
    path: "/",
    element: <App/>,
    children: [
      {
        path:"/",
        element: <HomePage/>,
      },
      {
        path:"/login",
        element: (
          <AuthLayout authentication={false}>
            <Login/>
          </AuthLayout>
        )
      },
      {
          path: "/signup",
          element: (
              <AuthLayout authentication={false}>
                  <Signup />
              </AuthLayout>
          ),
      },
      {
        path: "/events",
        element: (
          <AuthLayout authentication>
            {" "}
            <Event />
          </AuthLayout>
        )
      },
      // {
      //     path: "/admin",
      //     element: (
      //         <AuthLayout authentication>
      //             {" "}
      //             <Admin/>
      //         </AuthLayout>
      //     ),
      // },
      // {
      //     path: "/account",
      //     element: (
      //         <AuthLayout authentication>
      //             {" "}
      //             <Account/>
      //         </AuthLayout>
      //     ),
      // },
      // {
      //     path: "/about",
      //     element: (
      //         <AuthLayout authentication>
      //             {" "}
      //             <About/>
      //         </AuthLayout>
      //     ),
      // },
      // {
      //     path: "/trustees",
      //     element: (
      //         <AuthLayout authentication>
      //             {" "}
      //             <Trustees/>
      //         </AuthLayout>
      //     ),
      // },
      // {
      //     path: "/gallery",
      //     element: (
      //         <AuthLayout authentication>
      //             {" "}
      //             <Gallery/>
      //         </AuthLayout>
      //     ),
      // },
      {
          path: "/clubs",
          element: (
              <AuthLayout authentication>
                  {" "}
                  <Clubs/>
              </AuthLayout>
          ),
      },
      //   {
      //       path:"/gallery/:id",
      //       element:(
      //           <AuthLayout authentication>
      //                {" "}
      //                <Event/>
      //           </AuthLayout>
      //       ),
      //   },
      //   {
      //       path:"/user/:id",
      //       element:(
      //           <AuthLayout authentication>
      //                {" "}
      //                <Account/>
      //           </AuthLayout>
      //       ),
      //   },
    ]
  },
])

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}>
    <RouterProvider router={router}/>
    </Provider>
  </React.StrictMode>,
)
