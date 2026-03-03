import React, { useState } from 'react';
import { useAuth } from './AuthContext';
import '../styles/Auth.css';

function Auth({ onClose }) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { signup, login, loginWithGoogle } = useAuth();

  async function handleSubmit(e) {
    e.preventDefault();

    if (password.length < 6) {
      return setError('Password must be at least 6 characters');
    }

    try {
      setError('');
      setLoading(true);
      if (isLogin) {
        await login(email, password);
      } else {
        await signup(email, password);
      }
      onClose();
    } catch (error) {
      if (error.code === 'auth/email-already-in-use') {
        setError('Email already in use');
      } else if (error.code === 'auth/invalid-email') {
        setError('Invalid email address');
      } else if (error.code === 'auth/user-not-found') {
        setError('No account found with this email');
      } else if (error.code === 'auth/wrong-password') {
        setError('Incorrect password');
      } else if (error.code === 'auth/invalid-credential') {
        setError('Invalid email or password');
      } else {
        setError('Failed to ' + (isLogin ? 'login' : 'create account'));
      }
    }
    setLoading(false);
  }

  async function handleGoogleSignIn() {
    try {
      setError('');
      setLoading(true);
      await loginWithGoogle();
      onClose();
    } catch (error) {
      setError('Failed to sign in with Google');
    }
    setLoading(false);
  }

  return (
    <div className="auth-overlay" onClick={onClose} role="dialog" aria-modal="true" aria-labelledby="auth-modal-title">
      <div className="auth-modal" onClick={(e) => e.stopPropagation()}>
        <button className="auth-close" onClick={onClose} aria-label="Close authentication modal">&times;</button>
        <h2 id="auth-modal-title">{isLogin ? 'Login' : 'Sign Up'}</h2>
        {error && <div className="auth-error" role="alert">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="auth-form-group">
            <label htmlFor="auth-email" className="visually-hidden">Email Address</label>
            <input
              id="auth-email"
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              aria-required="true"
            />
          </div>
          <div className="auth-form-group">
            <label htmlFor="auth-password" className="visually-hidden">Password</label>
            <input
              id="auth-password"
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              aria-required="true"
              aria-describedby="password-requirements"
            />
            <span id="password-requirements" className="visually-hidden">Password must be at least 6 characters</span>
          </div>
          <button type="submit" className="auth-submit" disabled={loading} aria-busy={loading}>
            {loading ? 'Loading...' : (isLogin ? 'Login' : 'Sign Up')}
          </button>
        </form>
        <div className="auth-divider" aria-hidden="true">
          <span>OR</span>
        </div>
        <button onClick={handleGoogleSignIn} className="google-signin" disabled={loading} aria-label="Continue with Google">
          <span>Continue with Google</span>
        </button>
        <div className="auth-switch">
          {isLogin ? "Don't have an account? " : "Already have an account? "}
          <button onClick={() => setIsLogin(!isLogin)} className="auth-switch-btn" aria-label={isLogin ? 'Switch to sign up form' : 'Switch to login form'}>
            {isLogin ? 'Sign Up' : 'Login'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default Auth;
