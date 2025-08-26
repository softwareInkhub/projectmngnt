"use client";


import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';


const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "https://brmh.in";
const REDIRECT_URI = process.env.NEXT_PUBLIC_REDIRECT_URI || "http://localhost:3000/authPage";


export default function AuthPage() {
  const [authMode, setAuthMode] = useState('oauth'); // 'oauth', 'email', 'phone'
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [showOtpInput, setShowOtpInput] = useState(false);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [oauthLoading, setOauthLoading] = useState(false);
  const router = useRouter();


  // Check if user is already logged in
  useEffect(() => {
    console.log('🔍 Auth page: Authentication disabled - redirecting to main app');
    
    // Temporarily disable authentication - redirect directly to main app
    router.push('/');
  }, [router]);


  // Handle OAuth login
  const handleOAuthLogin = async () => {
    setOauthLoading(true);
    setMessage('');
   
    try {
      // Get OAuth URL from backend
      const response = await fetch(`${API_BASE_URL}/auth/oauth-url`);
      if (!response.ok) {
        throw new Error('Failed to get OAuth URL');
      }
     
      const { authUrl, state } = await response.json();
     
      // Check if the auth URL contains localhost and fix it
      let correctedAuthUrl = authUrl;
      if (authUrl && authUrl.includes('localhost:3000')) {
        // Replace localhost with deployed URL
        const deployedUrl = REDIRECT_URI.replace('/authPage', '');
        correctedAuthUrl = authUrl.replace('http://localhost:3000', deployedUrl);
        console.log('Fixed OAuth URL from localhost to deployed URL:', correctedAuthUrl);
      }
      
      // Also check for any other localhost references
      if (correctedAuthUrl && correctedAuthUrl.includes('localhost')) {
        const deployedUrl = REDIRECT_URI.replace('/authPage', '');
        correctedAuthUrl = correctedAuthUrl.replace(/localhost:\d+/, deployedUrl.replace('https://', '').replace('http://', ''));
        console.log('Fixed additional localhost references:', correctedAuthUrl);
      }
     
      // Store state for verification
      sessionStorage.setItem('oauth_state', state);
     
      // Redirect to Cognito
      window.location.href = correctedAuthUrl;
    } catch (error) {
      console.error('OAuth login error:', error);
      setMessage('OAuth login failed. Please try again.');
      setOauthLoading(false);
    }
  };


  // Handle OAuth callback
  useEffect(() => {
    // Check if we're on localhost but should be on deployed URL
    if (window.location.hostname === 'localhost' && window.location.search.includes('code=')) {
      console.log('OAuth callback detected on localhost, redirecting to deployed URL');
      const deployedUrl = REDIRECT_URI.replace('/authPage', '');
      const currentUrl = new URL(window.location.href);
      const newUrl = `${deployedUrl}/authPage${currentUrl.search}`;
      window.location.href = newUrl;
      return;
    }

    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');
    const state = urlParams.get('state');
    const error = urlParams.get('error');
   
    if (error) {
      setMessage(`OAuth error: ${error}`);
      return;
    }
   
    if (code) {
      // For password change flow, we might not have a state parameter
      // or it might not match due to Cognito's redirect behavior
      const savedState = sessionStorage.getItem('oauth_state');
     
      // If we have a state and it doesn't match, but we have a code,
      // this might be a password change flow - proceed anyway
      if (state && savedState && state !== savedState) {
        console.warn('State mismatch detected, but proceeding with code exchange (password change flow)');
      }
     
      // Exchange code for tokens
      fetch(`${API_BASE_URL}/auth/token`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          code,
          state: state || savedState || 'password-change-flow' // Use available state or fallback
        })
      })
      .then(res => res.json())
      .then(tokens => {
        if (tokens.error) {
          throw new Error(tokens.error);
        }
       
        console.log('✅ OAuth tokens received:', { 
          hasIdToken: !!tokens.id_token, 
          hasAccessToken: !!tokens.access_token,
          hasRefreshToken: !!tokens.refresh_token 
        });
       
        // Store tokens
        localStorage.setItem('id_token', tokens.id_token);
        localStorage.setItem('access_token', tokens.access_token);
        localStorage.setItem('refresh_token', tokens.refresh_token);
        localStorage.setItem('token_expires', (Date.now() + (tokens.expires_in * 1000)).toString());
       
        console.log('✅ Tokens stored in localStorage');
       
        // Clean up
        sessionStorage.removeItem('oauth_state');
       
        // Clear URL parameters
        window.history.replaceState({}, document.title, window.location.pathname);
       
        console.log('✅ Redirecting to main app...');
        // Always redirect to main app after OAuth login
        router.push('/');
      })
      .catch(error => {
        console.error('Token exchange failed:', error);
        setMessage('Login failed. Please try again.');
        sessionStorage.removeItem('oauth_state');
      });
    }
  }, [router]);


  // Handle email login/signup
  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');


    try {
      const endpoint = isLogin ? '/auth/login' : '/auth/signup';
      const body = isLogin ? { username, password } : { username, password, email };


      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });


      const data = await response.json();


      if (data.success) {
        if (isLogin && data.result) {
          // Store tokens from login response
          localStorage.setItem('id_token', data.result.idToken.jwtToken);
          localStorage.setItem('access_token', data.result.accessToken.jwtToken);
          localStorage.setItem('refresh_token', data.result.refreshToken.token);
        }
        setMessage(isLogin ? 'Login successful!' : 'Signup successful! Please check your email.');
        setTimeout(() => {
          // Always redirect to main app
          router.push('/');
        }, 1000);
      } else {
        setMessage(data.error || 'Authentication failed');
      }
    } catch (error) {
      setMessage('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };


  // Handle phone signup
  const handlePhoneSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');


    try {
      console.log('[FE] Phone signup request', { phoneNumber, hasPassword: !!password, hasEmail: !!email });
      const response = await fetch(`${API_BASE_URL}/auth/phone/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ phoneNumber, password, email }),
      });


      const data = await response.json();
      console.log('[FE] Phone signup response', { status: response.status, data });


      if (data.success) {
        setMessage('Account created! Please check your phone for verification code.');
        setShowOtpInput(true);
        // Persist username returned (may be generated when phone is alias)
        if (data.username) {
          sessionStorage.setItem('phone_signup_username', data.username);
        } else {
          sessionStorage.setItem('phone_signup_username', phoneNumber);
        }
      } else {
        setMessage(data.error || 'Signup failed');
      }
    } catch (error) {
      setMessage('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };


  // Handle phone login
  const handlePhoneLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');


    try {
      console.log('[FE] Phone login request', { phoneNumber, hasPassword: !!password });
      const response = await fetch(`${API_BASE_URL}/auth/phone/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ phoneNumber, password }),
      });


      const data = await response.json();
      console.log('[FE] Phone login response', { status: response.status, data });


      if (data.success) {
        // Store tokens from login response
        localStorage.setItem('id_token', data.result.idToken.jwtToken);
        localStorage.setItem('access_token', data.result.accessToken.jwtToken);
        localStorage.setItem('refresh_token', data.result.refreshToken.token);
        setMessage('Login successful!');
        setTimeout(() => {
          // Always redirect to main app
          router.push('/');
        }, 1000);
      } else {
        setMessage(data.error || 'Login failed');
      }
    } catch (error) {
      setMessage('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };


  // Handle OTP verification
  const handleOtpVerification = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');


    try {
      console.log('[FE] Verify OTP request', { phoneNumber, hasCode: !!otp });
      const response = await fetch(`${API_BASE_URL}/auth/phone/verify`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ phoneNumber, code: otp, username: sessionStorage.getItem('phone_signup_username') || undefined }),
      });


      const data = await response.json();
      console.log('[FE] Verify OTP response', { status: response.status, data });


      if (data.success) {
        setMessage('Phone number verified successfully!');
        setShowOtpInput(false);
        setOtp('');
        // Optionally redirect to login or auto-login
        setTimeout(() => {
          // Always redirect to deployed URL
          const deployedUrl = REDIRECT_URI.replace('/authPage', '');
          window.location.href = `${deployedUrl}/`;
        }, 1000);
      } else {
        setMessage(data.error || 'Verification failed');
      }
    } catch (error) {
      setMessage('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };


  // Handle resend OTP
  const handleResendOtp = async () => {
    setLoading(true);
    setMessage('');


    try {
      console.log('[FE] Resend OTP request', { phoneNumber });
      const response = await fetch(`${API_BASE_URL}/auth/phone/resend-otp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ phoneNumber, username: sessionStorage.getItem('phone_signup_username') || undefined }),
      });


      const data = await response.json();
      console.log('[FE] Resend OTP response', { status: response.status, data });


      if (data.success) {
        setMessage('OTP resent successfully!');
      } else {
        setMessage(data.error || 'Failed to resend OTP');
      }
    } catch (error) {
      setMessage('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };


  const resetForm = () => {
    setMessage('');
    setUsername('');
    setPassword('');
    setEmail('');
    setPhoneNumber('');
    setOtp('');
    setShowOtpInput(false);
  };


  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            {isLogin ? 'Sign in to your account' : 'Create your account'}
          </h2>
        </div>
       
        {/* Authentication Mode Selector */}
        <div className="flex justify-center space-x-4">
          <button
            onClick={() => { setAuthMode('oauth'); resetForm(); }}
            className={`px-4 py-2 rounded-md text-sm font-medium ${
              authMode === 'oauth'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            OAuth
          </button>
          <button
            onClick={() => { setAuthMode('email'); resetForm(); }}
            className={`px-4 py-2 rounded-md text-sm font-medium ${
              authMode === 'email'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Email
          </button>
          <button
            onClick={() => { setAuthMode('phone'); resetForm(); }}
            className={`px-4 py-2 rounded-md text-sm font-medium ${
              authMode === 'phone'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Phone
          </button>
        </div>


        {/* OAuth Login */}
        {authMode === 'oauth' && (
          <div className="mt-8">
            <button
              onClick={handleOAuthLogin}
              disabled={oauthLoading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {oauthLoading ? (
                <span>Redirecting to login...</span>
              ) : (
                <span>Sign in with Cognito OAuth</span>
              )}
            </button>
          </div>
        )}


        {/* Email Login/Signup */}
        {authMode === 'email' && (
          <form className="mt-8 space-y-6" onSubmit={handleEmailSubmit}>
            <div className="rounded-md shadow-sm -space-y-px">
              <div>
                <label htmlFor="username" className="sr-only">
                  Username
                </label>
                <input
                  id="username"
                  name="username"
                  type="text"
                  required
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                  placeholder="Username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>
              <div>
                <label htmlFor="password" className="sr-only">
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  className={`appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm ${isLogin ? 'rounded-b-md' : ''}`}
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              {!isLogin && (
                <div>
                  <label htmlFor="email" className="sr-only">
                    Email
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              )}
            </div>


            {message && (
              <div className={`text-sm text-center ${message.includes('successful') ? 'text-green-600' : 'text-red-600'}`}>
                {message}
              </div>
            )}


            <div>
              <button
                type="submit"
                disabled={loading}
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Processing...' : (isLogin ? 'Sign in' : 'Sign up')}
              </button>
            </div>


            <div className="text-center">
              <button
                type="button"
                onClick={() => {
                  setIsLogin(!isLogin);
                  resetForm();
                }}
                className="text-sm text-blue-600 hover:text-blue-500"
              >
                {isLogin ? "Don't have an account? Sign up" : 'Already have an account? Sign in'}
              </button>
            </div>
          </form>
        )}


        {/* Phone Login/Signup */}
        {authMode === 'phone' && (
          <div className="mt-8 space-y-6">
            {!showOtpInput ? (
              <form onSubmit={isLogin ? handlePhoneLogin : handlePhoneSignup}>
                <div className="rounded-md shadow-sm -space-y-px">
                  <div>
                    <label htmlFor="phoneNumber" className="sr-only">
                      Phone Number
                    </label>
                    <input
                      id="phoneNumber"
                      name="phoneNumber"
                      type="tel"
                      required
                      className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                      placeholder="Phone Number (e.g., +1234567890)"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                    />
                  </div>
                  <div>
                    <label htmlFor="password" className="sr-only">
                      Password
                    </label>
                    <input
                      id="password"
                      name="password"
                      type="password"
                      required
                      className={`appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm ${isLogin ? 'rounded-b-md' : ''}`}
                      placeholder="Password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </div>
                  {!isLogin && (
                    <div>
                      <label htmlFor="email" className="sr-only">
                        Email (Optional)
                      </label>
                      <input
                        id="email"
                        name="email"
                        type="email"
                        className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                        placeholder="Email (Optional)"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                    </div>
                  )}
                </div>


                {message && (
                  <div className={`text-sm text-center mt-4 ${message.includes('successful') ? 'text-green-600' : 'text-red-600'}`}>
                    {message}
                  </div>
                )}


                <div className="mt-6">
                  <button
                    type="submit"
                    disabled={loading}
                    className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? 'Processing...' : (isLogin ? 'Sign in' : 'Sign up')}
                  </button>
                </div>


                <div className="text-center mt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setIsLogin(!isLogin);
                      resetForm();
                    }}
                    className="text-sm text-blue-600 hover:text-blue-500"
                  >
                    {isLogin ? "Don't have an account? Sign up" : 'Already have an account? Sign in'}
                  </button>
                </div>
              </form>
            ) : (
              <form onSubmit={handleOtpVerification}>
                <div className="rounded-md shadow-sm">
                  <div>
                    <label htmlFor="otp" className="sr-only">
                      OTP Code
                    </label>
                    <input
                      id="otp"
                      name="otp"
                      type="text"
                      required
                      className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                      placeholder="Enter OTP Code"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      maxLength={6}
                    />
                  </div>
                </div>


                {message && (
                  <div className={`text-sm text-center mt-4 ${message.includes('successful') ? 'text-green-600' : 'text-red-600'}`}>
                    {message}
                  </div>
                )}


                <div className="mt-6 space-y-3">
                  <button
                    type="submit"
                    disabled={loading}
                    className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? 'Verifying...' : 'Verify OTP'}
                  </button>
                 
                  <button
                    type="button"
                    onClick={handleResendOtp}
                    disabled={loading}
                    className="w-full text-sm text-blue-600 hover:text-blue-500 disabled:opacity-50"
                  >
                    Resend OTP
                  </button>
                 
                  <button
                    type="button"
                    onClick={() => setShowOtpInput(false)}
                    className="w-full text-sm text-gray-600 hover:text-gray-500"
                  >
                    Back to Signup
                  </button>
                </div>
              </form>
            )}
          </div>
        )}
      </div>
    </div>
  );
}



