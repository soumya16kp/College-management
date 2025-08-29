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
import EventDetail from './pages/EventDetail.js';

import ClubAbout from './pages/Club_Pages/ClubAbout.js';
import Contact from './pages/Club_Pages/Contact.js'
import ClubEvent from './pages/Club_Pages/Event.js';
import Member from './pages/Club_Pages/Member.js'
import Gallery from './pages/Club_Pages/Gallery.js'
import ClubDetail from "./pages/Club_Pages/ClubDetail.js";



import { ClubProvider } from "./context/ClubContext";
import { EventProvider } from "./context/EventContext";


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
      {
        path: "/clubs",
        element: (
          <AuthLayout authentication>
            {" "}
            <Clubs />
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
      //     path: "/members",
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
          path: "/events/:id",
          element: (
              <AuthLayout authentication>
                  {" "}
                  <EventDetail/>
              </AuthLayout>
          ),
      },
        {
            path:"/clubs/:id",
            element:(
                <AuthLayout authentication>
                     {" "}
                     <ClubDetail/>
                </AuthLayout>
            ),
            children: [
              { path: "about", element: <ClubAbout/> },
              { path: "contact", element: <Contact/> },
              { path: "gallery", element: <Gallery/>},
              { path: "members", element: <Member/> },
              { path: "events", element: <ClubEvent/> },
            ]
        },
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

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Provider store={store}>
      <ClubProvider>
        <EventProvider>
          <RouterProvider router={router} />
        </EventProvider>
      </ClubProvider>
    </Provider>
  </React.StrictMode>
);
