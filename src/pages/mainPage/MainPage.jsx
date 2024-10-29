import React from 'react';
import Register from '../../components/register/Register';
import Login from '../../components/login/Login';
import './mainPage.css';
import Navbar from '../../components/nav/Nav';

const MainPage = () => {
  return (
    <div className='mainPageContainer'>
      <Navbar />
      <div className="form-container"> {/* Flexbox container */}
        <Register className="register" /> {/* Assigning class for CSS */}
        <Login className="login" /> {/* Assigning class for CSS */}
      </div>
    </div>
  );
};

export default MainPage;
