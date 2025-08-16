import './App.css'; 
import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import authService from "./services/authService";
import { login, logout } from "./store/AuthSlice";
import { Footer, Header } from './components';
import { Outlet } from 'react-router-dom';
import '@fortawesome/fontawesome-free/css/all.min.css';
function App() {

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
    <div className="app-container">
      <div className="content-wrapper">
        <Header/>
        <main className="main-content">
          <Outlet />
        </main>
        <Footer/>
      </div>
    </div>
  ) : null;
}

export default App;
