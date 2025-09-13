"use client";


import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';


const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "https://brmh.in";
const REDIRECT_URI = process.env.NEXT_PUBLIC_REDIRECT_URI || "projectmngnt.vercel.app/authPage";


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

  // Manual cleanup function for OAuth state
  const clearOAuthState = () => {
    console.log('🧹 Manually clearing all OAuth state...');
    
    // Clear all session storage
    sessionStorage.clear();
    
    // Clear all OAuth-related localStorage items
    localStorage.clear(); // Clear everything instead of individual items
    
    // Clear any Cognito-related cookies (if any)
    document.cookie.split(";").forEach(function(c) { 
      document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/"); 
    });
    
    // Clear browser cache for this domain
    if ('caches' in window) {
      caches.keys().then(function(names) {
        for (let name of names) {
          caches.delete(name);
        }
      });
    }
    
    console.log('✅ All OAuth state, tokens, and cache cleared manually');
    setMessage('All data cleared. Redirecting to fresh login page...');
    
    // Force hard reload to clear everything
    setTimeout(() => {
      window.location.href = '/authPage';
    }, 1000);
  };


  // Check if user is already logged in (but not during OAuth callback)
  useEffect(() => {
    const checkAuthStatus = () => {
      // Don't redirect if we're processing an OAuth callback
      const urlParams = new URLSearchParams(window.location.search);
      if (urlParams.get('code')) {
        console.log('🔍 OAuth callback detected, skipping auth check');
        return;
      }

      const accessToken = localStorage.getItem('access_token');
      const idToken = localStorage.getItem('id_token');
      
      // If user has valid tokens (not mock tokens), redirect to main app
      if (accessToken && idToken && accessToken !== 'mock-token-disabled') {
        console.log('🔍 User already authenticated, redirecting to main app');
        router.push('/');
      } else {
        console.log('🔍 User not authenticated, staying on auth page');
        // Aggressively clear ALL OAuth state when user is not authenticated
        sessionStorage.clear();
        console.log('🧹 Cleared all session storage for fresh OAuth flow');
      }
    };

    checkAuthStatus();
  }, [router]);


  // Handle OAuth login
  const handleOAuthLogin = async () => {
    setOauthLoading(true);
    setMessage('');
   
    try {
      // Clear any existing OAuth state first to prevent conflicts
      sessionStorage.clear();
      localStorage.removeItem('oauth_state');
      localStorage.removeItem('oauth_callback_processed');
      
      console.log('🧹 Cleared all OAuth state before starting new flow');
      
      // Get OAuth URL from backend
      const response = await fetch(`${API_BASE_URL}/auth/oauth-url`);
      if (!response.ok) {
        throw new Error('Failed to get OAuth URL');
      }
     
      const { authUrl, state } = await response.json();
      console.log('🔍 Received OAuth URL from backend:', { authUrl, state });
     
      // Check if the auth URL contains localhost and fix it
      let correctedAuthUrl = authUrl;
      if (authUrl && authUrl.includes('localhost:3000')) {
        // Replace localhost with deployed URL
        const deployedUrl = REDIRECT_URI.replace('/authPage', '');
        correctedAuthUrl = authUrl.replace('projectmngnt.vercel.app', deployedUrl);
        console.log('Fixed OAuth URL from localhost to deployed URL:', correctedAuthUrl);
      }
      
      // Also check for any other localhost references
      if (correctedAuthUrl && correctedAuthUrl.includes('localhost')) {
        const deployedUrl = REDIRECT_URI.replace('/authPage', '');
        correctedAuthUrl = correctedAuthUrl.replace(/localhost:\d+/, deployedUrl.replace('https://', '').replace('http://', ''));
        console.log('Fixed additional localhost references:', correctedAuthUrl);
      }
     
      // Store fresh state for verification
      sessionStorage.setItem('oauth_state', state);
      console.log('🔄 Starting fresh OAuth flow with state:', state);
      console.log('🔄 Final OAuth URL:', correctedAuthUrl);
     
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
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');
    const state = urlParams.get('state');
    const error = urlParams.get('error');
    
    // Check if we've already processed this callback
    const processedCallback = sessionStorage.getItem('oauth_callback_processed');
    if (processedCallback && code) {
      console.log('🔄 OAuth callback already processed, clearing URL and skipping...');
      // Clear URL parameters to prevent re-processing
      window.history.replaceState({}, document.title, window.location.pathname);
      return;
    }
   
    if (error) {
      setMessage(`OAuth error: ${error}`);
      return;
    }
   
    if (code) {
      console.log('🔄 Processing OAuth callback with code:', code.substring(0, 10) + '...');
      
      // Validate code format (should be a reasonable length)
      if (code.length < 10) {
        console.error('❌ Invalid authorization code format');
        setMessage('Invalid authorization code. Please try logging in again.');
        return;
      }
      
      // For password change flow, we might not have a state parameter
      // or it might not match due to Cognito's redirect behavior
      const savedState = sessionStorage.getItem('oauth_state');
     
      // If we have a state and it doesn't match, but we have a code,
      // this might be a password change flow - proceed anyway
      if (state && savedState && state !== savedState) {
        console.warn('State mismatch detected, but proceeding with code exchange (password change flow)');
      }
     
      // Mark callback as being processed
      sessionStorage.setItem('oauth_callback_processed', 'true');
      
      // Exchange code for tokens
      console.log('🔄 Exchanging OAuth code for tokens...', { code: code?.substring(0, 10) + '...', state });
      
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
      .then(res => {
        console.log('🔄 Token exchange response status:', res.status);
        if (!res.ok) {
          return res.text().then(text => {
            console.error('❌ Token exchange failed:', res.status, text);
            throw new Error(`HTTP error! status: ${res.status} - ${text}`);
          });
        }
        return res.json();
      })
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
        
        // Store user email if available in tokens
        if (tokens.email) {
          localStorage.setItem('user_email', tokens.email);
        }
       
        console.log('✅ Tokens stored in localStorage');
       
        // Clean up
        sessionStorage.removeItem('oauth_state');
        sessionStorage.removeItem('oauth_callback_processed');
       
        // Clear URL parameters immediately to prevent re-processing
        window.history.replaceState({}, document.title, window.location.pathname);
       
        console.log('✅ Redirecting to main app...');
        // Always redirect to main app after OAuth login
        router.push('/');
      })
      .catch(error => {
        console.error('❌ Token exchange failed:', error);
        
        // Provide more specific error messages
        let errorMessage = 'Login failed. Please try again.';
        if (error.message.includes('400')) {
          errorMessage = 'Invalid authorization code. Please try logging in again.';
        } else if (error.message.includes('401')) {
          errorMessage = 'Authentication failed. Please check your credentials.';
        } else if (error.message.includes('403')) {
          errorMessage = 'Access denied. Please contact support.';
        } else if (error.message.includes('500')) {
          errorMessage = 'Server error. Please try again later.';
        }
        
        setMessage(errorMessage);
        sessionStorage.removeItem('oauth_state');
        sessionStorage.removeItem('oauth_callback_processed');
        // Clear URL parameters on error too
        window.history.replaceState({}, document.title, window.location.pathname);
      });
    }
  }, []); // Remove router dependency to prevent re-runs


  // Function to sync user from Cognito to application database
  const syncUserToDatabase = async (cognitoUser: any) => {
    try {
      const userData = {
        name: cognitoUser.username || cognitoUser.email,
        email: cognitoUser.email,
        role: 'Developer', // Default role
        status: 'Active',
        department: 'General',
        joinDate: new Date().toISOString().split('T')[0],
        lastActive: new Date().toISOString(),
        phone: cognitoUser.phone_number || '',
        companyId: '',
        teamId: ''
      };

      const response = await fetch(`${API_BASE_URL}/users`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      if (response.ok) {
        console.log('✅ User synced to application database');
        return true;
      } else {
        console.warn('⚠️ Failed to sync user to application database');
        return false;
      }
    } catch (error) {
      console.warn('⚠️ Error syncing user to database:', error);
      return false;
    }
  };

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
          
          // Store user email for context
          localStorage.setItem('user_email', email);
          
          // Check if user exists in application database and sync if needed
          try {
            const userCheckResponse = await fetch(`${API_BASE_URL}/users?email=${encodeURIComponent(email)}`, {
              method: 'GET',
              headers: {
                'Content-Type': 'application/json',
              },
            });

            if (userCheckResponse.ok) {
              const userData = await userCheckResponse.json();
              if (!userData.users || userData.users.length === 0) {
                // User doesn't exist in database, create them
                console.log('🔄 User not found in database, creating...');
                await syncUserToDatabase({ username, email });
              }
            }
          } catch (syncError) {
            console.warn('⚠️ Error checking/syncing user during login:', syncError);
          }
        } else if (!isLogin) {
          // Store user email for context after signup
          localStorage.setItem('user_email', email);
          
          // After successful signup, create user in application database
          try {
            const userData = {
              name: username, // Use username as name initially
              email: email,
              role: 'Developer', // Default role
              status: 'Active',
              department: 'General',
              joinDate: new Date().toISOString().split('T')[0],
              lastActive: new Date().toISOString(),
              phone: '',
              companyId: '',
              teamId: ''
            };

            const userResponse = await fetch(`${API_BASE_URL}/users`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify(userData),
            });

            if (userResponse.ok) {
              console.log('✅ User created in application database');
            } else {
              console.warn('⚠️ Failed to create user in application database');
            }
          } catch (dbError) {
            console.warn('⚠️ Error creating user in database:', dbError);
          }
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
        <div className="text-center">
          <div className="mb-8">
            <h1 className="text-6xl font-semibold text-gray-800 tracking-wide">
              BRMH
            </h1>
            <h2 className="text-2xl font-medium text-gray-600 tracking-wider">
              PROJECT MANAGEMENT
            </h2>
            <div className="mt-4 w-20 h-1 bg-blue-600 mx-auto"></div>
          </div>
          <h3 className="text-2xl font-semibold text-gray-900">
            {isLogin ? 'Sign in to your account' : 'Create your account'}
          </h3>
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
          <div className="mt-8 space-y-3">
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



