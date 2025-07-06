import React from 'react';
import { signInWithGoogle, signInWithFacebook } from '../services/auth';
import { useNavigate } from 'react-router-dom';

interface SocialLoginButtonsProps {
  onError: (error: string) => void;
  loading: boolean;
  setLoading: (loading: boolean) => void;
}

const SocialLoginButtons: React.FC<SocialLoginButtonsProps> = ({ onError, loading, setLoading }) => {
  const navigate = useNavigate();

  const handleSocialLogin = async (provider: 'google' | 'facebook') => {
    setLoading(true);
    onError('');

    try {
      let user;
      switch (provider) {
        case 'google':
          user = await signInWithGoogle();
          break;
        case 'facebook':
          user = await signInWithFacebook();
          break;
      }
      
      if (user) {
        navigate('/dashboard');
      }
    } catch (error: any) {
      console.error(`${provider} login error:`, error);
      
      // Handle specific error cases
      if (error.code === 'auth/popup-closed-by-user') {
        onError('Sign-in was cancelled. Please try again.');
      } else if (error.code === 'auth/popup-blocked') {
        onError('Popup was blocked by your browser. Please allow popups for this site and try again. You can usually do this by clicking the popup blocker icon in your browser\'s address bar.');
      } else if (error.code === 'auth/account-exists-with-different-credential') {
        onError('An account already exists with the same email address but different sign-in credentials. Please try signing in with your original method.');
      } else if (error.code === 'auth/cancelled-popup-request') {
        onError('Another sign-in popup is already open. Please close it and try again.');
      } else if (error.code === 'auth/network-request-failed') {
        onError('Network error. Please check your internet connection and try again.');
      } else if (error.code === 'auth/unauthorized-domain') {
        onError('This domain is not authorized for OAuth operations. Please contact support.');
      } else {
        onError(error.message || `Failed to sign in with ${provider}. Please try again.`);
      }
    } finally {
      setLoading(false);
    }
  };

  const handlePopupBlocked = (provider: 'google' | 'facebook') => {
    onError(`It looks like popups are blocked for this site. To sign in with ${provider}:
    
1. Look for a popup blocker icon in your browser's address bar
2. Click it and select "Always allow popups from this site"
3. Try signing in again
    
Alternatively, you can disable popup blocking temporarily in your browser settings.`);
  };

  return (
    <div className="space-y-3">
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-white/20" />
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-2 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-gray-300">
            Or continue with
          </span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {/* Google */}
        <button
          type="button"
          onClick={() => handleSocialLogin('google')}
          disabled={loading}
          className="w-full inline-flex justify-center items-center px-4 py-3 border border-white/20 rounded-lg bg-white/10 hover:bg-white/20 text-white font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          Google
        </button>

        {/* Facebook */}
        <button
          type="button"
          onClick={() => handleSocialLogin('facebook')}
          disabled={loading}
          className="w-full inline-flex justify-center items-center px-4 py-3 border border-white/20 rounded-lg bg-white/10 hover:bg-white/20 text-white font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
          </svg>
          Facebook
        </button>
      </div>

      {/* Popup blocker help text */}
      <div className="text-xs text-gray-400 text-center">
        <p>Having trouble? Make sure popups are enabled for this site.</p>
      </div>
    </div>
  );
};

export default SocialLoginButtons;