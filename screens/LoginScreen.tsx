
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../App';
import { ShieldCheckIcon } from '@heroicons/react/24/solid';

const LoginScreen: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'email' | 'mobile'>('email');
  const [mobileNumber, setMobileNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [isOtpSent, setIsOtpSent] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, you would validate credentials/OTP here.
    login();
    navigate('/dashboard');
  };
  
  const handleSendOtp = () => {
    if (mobileNumber.length >= 10) {
      setIsOtpSent(true);
      // Simulate OTP sending
    } else {
      alert("Please enter a valid mobile number.");
    }
  };

  const EmailPasswordForm = () => (
    <form onSubmit={handleLogin} className="space-y-6">
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email address</label>
        <div className="mt-1">
          <input id="email" name="email" type="email" autoComplete="email" required defaultValue="agent@pb.com" className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
        </div>
      </div>
      <div>
        <label htmlFor="password"className="block text-sm font-medium text-gray-700">Password</label>
        <div className="mt-1">
          <input id="password" name="password" type="password" required defaultValue="password" className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
        </div>
      </div>
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <input id="remember-me" name="remember-me" type="checkbox" className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded" />
          <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">Remember me</label>
        </div>
        <div className="text-sm">
          <a href="#" className="font-medium text-indigo-600 hover:text-indigo-500">Forgot your password?</a>
        </div>
      </div>
      <div>
        <button type="submit" className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
          Sign in
        </button>
      </div>
    </form>
  );

  const MobileOtpForm = () => (
    <form onSubmit={handleLogin} className="space-y-6">
      <div>
        <label htmlFor="mobile" className="block text-sm font-medium text-gray-700">Mobile Number</label>
        <div className="mt-1 flex rounded-md shadow-sm">
          <input id="mobile" name="mobile" type="tel" autoComplete="tel" required value={mobileNumber} onChange={e => setMobileNumber(e.target.value)} disabled={isOtpSent} className="flex-1 block w-full px-3 py-2 border border-gray-300 rounded-l-md placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm disabled:bg-gray-50" />
          <button type="button" onClick={handleSendOtp} disabled={isOtpSent} className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-r-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-300">
            {isOtpSent ? 'Sent' : 'Send OTP'}
          </button>
        </div>
      </div>
      {isOtpSent && (
        <div>
          <label htmlFor="otp" className="block text-sm font-medium text-gray-700">Enter OTP</label>
          <div className="mt-1">
            <input id="otp" name="otp" type="text" maxLength={6} required value={otp} onChange={e => setOtp(e.target.value)} className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
          </div>
        </div>
      )}
      <div>
        <button type="submit" disabled={!isOtpSent || otp.length < 4} className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-300">
          Sign in with OTP
        </button>
      </div>
    </form>
  );

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center items-center">
          <ShieldCheckIcon className="h-12 w-auto text-indigo-600" />
          <h2 className="ml-3 text-center text-3xl font-extrabold text-gray-900">
            Agent CRM Login
          </h2>
        </div>
      </div>
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <div className="mb-6">
            <div className="border-b border-gray-200">
              <nav className="-mb-px flex space-x-8" aria-label="Tabs">
                <button
                  onClick={() => setActiveTab('email')}
                  className={`${activeTab === 'email' ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                >
                  Email & Password
                </button>
                <button
                  onClick={() => setActiveTab('mobile')}
                  className={`${activeTab === 'mobile' ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                >
                  Mobile & OTP
                </button>
              </nav>
            </div>
          </div>
          {activeTab === 'email' ? <EmailPasswordForm /> : <MobileOtpForm />}
        </div>
      </div>
    </div>
  );
};

export default LoginScreen;
