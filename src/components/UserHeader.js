
import React, { useState } from 'react';
import { useAuth } from './AuthContext';
import Auth from './Auth';
import '../styles/UserHeader.css';
import { useNavigate } from 'react-router-dom';


function UserHeader() {
  const [showAuth, setShowAuth] = useState(false);
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  async function handleLogout() {
    try {
      await logout();
      // Reset app state by reloading or navigating to home
      navigate('/');
      // Optionally, force a reload for a full reset:
      // window.location.href = '/';
    } catch (error) {
      console.error('Failed to log out:', error);
    }
  }

  return (
    <>
      <header className="user-header" role="banner">
        {currentUser ? (
          <div className="user-info">
            <span className="user-email">{currentUser.email}</span>
            <button onClick={handleLogout} className="logout-btn" aria-label="Log out of your account">Logout</button>
          </div>
        ) : (
          <button onClick={() => setShowAuth(true)} className="login-btn" aria-label="Open login or sign up modal">
            Login / Sign Up
          </button>
        )}
      </header>
      {showAuth && <Auth onClose={() => setShowAuth(false)} />}
    </>
  );
}

export default UserHeader;
