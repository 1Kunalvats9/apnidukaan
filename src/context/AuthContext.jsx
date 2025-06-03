// context/AuthContext.js
'use client'
import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(undefined);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log('[AuthContext] useEffect triggered.');
    const token = localStorage.getItem('token');
    if (token) {
      console.log('[AuthContext] Token found in localStorage, calling checkAuth().');
      // checkAuth();
      setLoading(false)
    } else {
      console.log('[AuthContext] No token found in localStorage, setting loading to false.');
      setLoading(false);
    }
  }, []);

  // const checkAuth = async () => {
  //   console.log('[AuthContext] checkAuth function called.');
  //   const token = localStorage.getItem('token');
  //   if (!token) {
  //     console.log('[AuthContext] checkAuth: No token, skipping API call, setting loading to false.');
  //     setLoading(false);
  //     return;
  //   }

  //   try {
  //     console.log('[AuthContext] checkAuth: Fetching /api/auth/me...');
  //     const response = await fetch('/api/auth/me', {
  //       method: 'GET',
  //       headers: {
  //         'Content-Type': 'application/json',
  //         'Authorization': `Bearer ${token}`,
  //       },
  //     });

  //     console.log('[AuthContext] checkAuth: /api/auth/me response status:', response.status);

  //     if (!response.ok) {
  //       const errorData = await response.json();
  //       console.error('[AuthContext] checkAuth: API error (non-200 status):', errorData.message || response.statusText);
  //       throw new Error(errorData.message || 'Authentication failed');
  //     }

  //     const data = await response.json();
  //     console.log('[AuthContext] checkAuth: API success, received data:', data);
  //     // --- FIX: Change setUser(data) to setUser(data.user) ---
  //     // Now /api/auth/me returns { user: {...} }
  //     setUser(data.user);
  //   } catch (error) {
  //     console.error('[AuthContext] checkAuth: Error during API call or processing:', error);
  //     localStorage.removeItem('token');
  //     localStorage.removeItem('user'); // Also remove user data if stored separately
  //     setUser(null);
  //   } finally {
  //     console.log('[AuthContext] checkAuth: Setting loading to false in finally block.');
  //     setLoading(false);
  //   }
  // };

  const login = async (email, password) => {
    // ... (rest of login function)
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || `Login failed with status: ${response.status}`);
    }

    const data = await response.json();
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data.user)); // Store user data after successful login
    setUser(data.user); // Update context user state
    setLoading(false)
  };

  const signup = async (userData) => {
    // ... (rest of signup function)
    const response = await fetch('/api/auth/signup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Signup failed');
    }

    const data = await response.json();
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data.user)); // Store user data after successful signup
    setUser(data.user); // Update context user state
  };

  const logout = () => {
    console.log('[AuthContext] Logging out.');
    localStorage.removeItem('token');
    localStorage.removeItem('user'); // Clear user data from localStorage
    setUser(null); // Clear user state
    // Optionally, redirect the user after logout, e.g., router.push('/')
  };

  console.log('[AuthContext] Render - User:', user, 'Loading:', loading);

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};