import './App.css'; 
import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import authService from "./services/authService";
import { login, logout } from "./store/AuthSlice";
import { Footer, Header } from './components';
import { Outlet, useLocation } from 'react-router-dom';
import '@fortawesome/fontawesome-free/css/all.min.css';
import { ClubProvider } from "./context/ClubContext";

function App() {
  const location = useLocation();
  const login_page = location.pathname === "/login";
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);

    useEffect(() => {
      authService.getCurrentUser()
        .then((userData) => {
          if (userData) {
            dispatch(login({ userData }));
          } else {
            dispatch(logout());
          }
        })
        .finally(() => setLoading(false));
    }, [dispatch]);

  return !loading ? (
     <ClubProvider>  
        <div className="app-container">
          <div className="content-wrapper">
            {!login_page && <Header />}
            <main className="main-content">
              <Outlet />
            </main>
            {!login_page && <Footer />}
          </div>
        </div>
    </ClubProvider>
  ) : null;
}

export default App;
