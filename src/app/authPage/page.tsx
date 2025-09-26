"use client";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

const API_BASE_URL = "https://brmh.in";
const REDIRECT_URI = "https://projectmngnt.vercel.app/authPage";


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

  // Clear any stale OAuth data on component mount
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');
    
    // If there's no code in URL, clear any stale OAuth data
    if (!code) {
      sessionStorage.removeItem('oauth_state');
      sessionStorage.removeItem('oauth_code_timestamp');
    }
  }, []);




  // Check if user is already logged in
  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (token) {
      // Validate token
      fetch(`${API_BASE_URL}/auth/validate`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })
      .then(res => {
        if (res.ok) {
          // Dispatch auth success event and redirect
          window.dispatchEvent(new CustomEvent('auth-success'));
          router.push('/dashboard');
        } else {
          // Token invalid, clear it
          localStorage.removeItem('access_token');
          localStorage.removeItem('id_token');
          localStorage.removeItem('refresh_token');
        }
      })
      .catch(() => {
        // Network error, clear tokens
        localStorage.removeItem('access_token');
        localStorage.removeItem('id_token');
        localStorage.removeItem('refresh_token');
      });
    }
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
     
      // Store state for verification
      sessionStorage.setItem('oauth_state', state);
      // Store timestamp for code expiration check
      sessionStorage.setItem('oauth_code_timestamp', Date.now().toString());
      
      // Redirect to Cognito
      window.location.href = authUrl;
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
   
    if (error) {
      setMessage(`OAuth error: ${error}`);
      return;
    }
   
    if (code) {
      console.log('🔄 OAuth callback detected with code:', code.substring(0, 10) + '...');
      
      // Set up fallback redirect in case token exchange fails
      const fallbackTimeout = setTimeout(() => {
        console.log('🔄 OAuth fallback: Redirecting to dashboard after timeout');
        window.history.replaceState({}, document.title, window.location.pathname);
        router.push('/dashboard');
      }, 10000); // 10 second fallback
      
      // For password change flow, we might not have a state parameter
      // or it might not match due to Cognito's redirect behavior
      const savedState = sessionStorage.getItem('oauth_state');
     
      // If we have a state and it doesn't match, but we have a code,
      // this might be a password change flow - proceed anyway
      if (state && savedState && state !== savedState) {
        console.warn('State mismatch detected, but proceeding with code exchange (password change flow)');
      }
     
      // Exchange code for tokens
      console.log('🔄 Attempting token exchange with:', { 
        code: code?.substring(0, 10) + '...', 
        state: state || savedState || 'password-change-flow',
        apiUrl: `${API_BASE_URL}/auth/token`,
        redirectUri: REDIRECT_URI
      });
      
      // Check if code might be expired (basic check)
      const codeTimestamp = sessionStorage.getItem('oauth_code_timestamp');
      if (codeTimestamp) {
        const codeAge = Date.now() - parseInt(codeTimestamp);
        if (codeAge > 10 * 60 * 1000) { // 10 minutes
          console.warn('⚠️ Authorization code might be expired (age:', Math.round(codeAge / 1000), 'seconds)');
        }
      }
      
      fetch(`${API_BASE_URL}/auth/token`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          code,
          state: state || savedState || 'password-change-flow', // Use available state or fallback
          redirect_uri: REDIRECT_URI // Explicitly include redirect URI
        })
      })
      .then(res => {
        console.log('🔄 Token exchange response status:', res.status);
        if (!res.ok) {
          return res.text().then(text => {
            console.error('❌ Token exchange failed:', res.status, text);
            throw new Error(`HTTP ${res.status}: ${text}`);
          });
        }
        return res.json();
      })
      .then(tokens => {
        console.log('✅ Token exchange successful:', { 
          hasIdToken: !!tokens.id_token, 
          hasAccessToken: !!tokens.access_token,
          hasRefreshToken: !!tokens.refresh_token 
        });
        
        if (tokens.error) {
          throw new Error(tokens.error);
        }
        
        // Store tokens
        localStorage.setItem('id_token', tokens.id_token);
        localStorage.setItem('access_token', tokens.access_token);
        localStorage.setItem('refresh_token', tokens.refresh_token);
        localStorage.setItem('token_expires', (Date.now() + (tokens.expires_in * 1000)).toString());
        
        // Store user email if available
        if (tokens.email) {
          localStorage.setItem('user_email', tokens.email);
        }
        
        console.log('✅ Tokens stored successfully');
        
        // Clean up
        sessionStorage.removeItem('oauth_state');
        sessionStorage.removeItem('oauth_code_timestamp');
        clearTimeout(fallbackTimeout); // Clear the fallback timeout
        
        // Clear URL parameters
        window.history.replaceState({}, document.title, window.location.pathname);
        
        // Dispatch auth success event and redirect
        window.dispatchEvent(new CustomEvent('auth-success'));
        router.push('/dashboard');
      })
      .catch(error => {
        console.error('❌ Token exchange failed:', error);
        
        // Provide more specific error messages
        let errorMessage = 'OAuth login failed. Please try again.';
        if (error.message.includes('404')) {
          errorMessage = 'OAuth endpoint not found. Please contact support.';
        } else if (error.message.includes('400')) {
          if (error.message.includes('invalid_grant')) {
            errorMessage = 'Authorization code expired or already used. Please try logging in again.';
          } else {
            errorMessage = 'Invalid authorization code. Please try logging in again.';
          }
        } else if (error.message.includes('401')) {
          errorMessage = 'Authentication failed. Please check your credentials.';
        } else if (error.message.includes('500')) {
          errorMessage = 'Server error. Please try again later.';
        } else if (error.message.includes('NetworkError') || error.message.includes('fetch')) {
          errorMessage = 'Network error. Please check your connection and try again.';
        }
        
        setMessage(errorMessage);
        sessionStorage.removeItem('oauth_state');
        sessionStorage.removeItem('oauth_code_timestamp');
        clearTimeout(fallbackTimeout); // Clear the fallback timeout
        
        // Clear URL parameters on error
        window.history.replaceState({}, document.title, window.location.pathname);
        
        // Redirect to dashboard anyway after 3 seconds (fallback)
        setTimeout(() => {
          console.log('🔄 Fallback: Redirecting to dashboard despite OAuth error');
          router.push('/dashboard');
        }, 3000);
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
         // Dispatch auth success event and redirect
         window.dispatchEvent(new CustomEvent('auth-success'));
         router.push('/dashboard');
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
         // Dispatch auth success event and redirect
         window.dispatchEvent(new CustomEvent('auth-success'));
         router.push('/dashboard');
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
         // Dispatch auth success event and redirect
         window.dispatchEvent(new CustomEvent('auth-success'));
         router.push('/dashboard');
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









