import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Eye, EyeOff, ArrowRight, ChevronLeft } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { useStore } from '@/lib/store';
import { POLICY_ROUTES } from '@/lib/policies';
import { toast } from 'sonner';

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  
  const navigate = useNavigate();
  const location = useLocation();
  const { login, signUp, setCurrentPage } = useStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password || (!isLogin && (!firstName || !lastName))) {
      toast.error("Please fill in all required fields");
      return;
    }

    setIsProcessing(true);
    try {
      if (isLogin) {
        await login(email, password);
      } else {
        await signUp(`${firstName} ${lastName}`.trim(), email, password);
      }
      toast.success(isLogin ? 'Welcome back!' : 'Account created successfully!');
      const nextRoute = (location.state as { from?: string } | null)?.from || '/account';
      navigate(nextRoute);
    } catch (error: any) {
      toast.error(error?.message ?? 'Authentication failed');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleGoogleAuth = () => {
    toast.info('Social sign-in is not enabled in this build yet.');
  };

  return (
    <div className="min-h-screen bg-background flex font-sans">
      {/* Left Column: Image (Desktop Only) */}
      <div className="hidden lg:block lg:w-1/2 relative overflow-hidden bg-secondary">
        <img 
          src="https://picsum.photos/seed/auth-fashion/1200/1600" 
          alt="Premium Fashion" 
          className="absolute inset-0 w-full h-full object-cover"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-black/20" />
        <div className="absolute inset-0 flex flex-col justify-between p-12 text-white">
          <button onClick={() => setCurrentPage('home')} className="text-3xl font-heading font-bold tracking-tighter text-left">
            theDMAshop
          </button>
          <div className="max-w-md space-y-4">
            <h2 className="text-4xl font-heading font-bold leading-tight">
              Elevate your everyday wardrobe.
            </h2>
            <p className="text-white/80 text-lg">
              Join our community to access exclusive collections, early drops, and personalized recommendations.
            </p>
          </div>
        </div>
      </div>

      {/* Right Column: Auth Form */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center px-6 py-12 md:px-16 lg:px-24 relative">
        {/* Mobile Header */}
        <div className="lg:hidden absolute top-8 left-6 right-6 flex justify-between items-center">
          <button onClick={() => setCurrentPage('home')} className="text-2xl font-heading font-bold tracking-tighter text-primary">
            theDMAshop
          </button>
        </div>

        <div className="max-w-md w-full mx-auto space-y-8">
          <div className="space-y-2">
            <h1 className="text-3xl md:text-4xl font-heading font-bold tracking-tight">
              {isLogin ? 'Welcome back' : 'Create an account'}
            </h1>
            <p className="text-muted-foreground">
              {isLogin 
                ? 'Enter your details to access your account.' 
                : 'Sign up to enjoy faster checkout and exclusive perks.'}
            </p>
          </div>

          <div className="space-y-6">
            {/* Google Auth */}
            <Button 
              variant="outline" 
              className="w-full h-14 rounded-xl bg-background border-border/50 premium-shadow-hover text-base font-medium"
              onClick={handleGoogleAuth}
              disabled={isProcessing}
            >
              <GoogleIcon className="h-5 w-5 mr-3" />
              {isLogin ? 'Sign in with Google' : 'Sign up with Google'}
            </Button>

            <div className="relative flex items-center py-2">
              <div className="flex-grow border-t border-border/50"></div>
              <span className="flex-shrink-0 mx-4 text-xs text-muted-foreground uppercase tracking-widest font-bold">Or continue with email</span>
              <div className="flex-grow border-t border-border/50"></div>
            </div>

            {/* Form */}
            <form className="space-y-5" onSubmit={handleSubmit}>
              <AnimatePresence mode="wait">
                {!isLogin && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="grid grid-cols-2 gap-4 overflow-hidden"
                  >
                    <div className="space-y-2">
                      <Label htmlFor="firstName">First Name</Label>
                      <Input 
                        id="firstName" 
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        className="h-14 rounded-xl bg-secondary/10 border-border/50 focus-visible:ring-primary" 
                        placeholder="Jane" 
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input 
                        id="lastName" 
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        className="h-14 rounded-xl bg-secondary/10 border-border/50 focus-visible:ring-primary" 
                        placeholder="Doe" 
                      />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input 
                  id="email" 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-14 rounded-xl bg-secondary/10 border-border/50 focus-visible:ring-primary" 
                  placeholder="name@example.com" 
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <Label htmlFor="password">Password</Label>
                  {isLogin && (
                    <a href="#" className="text-xs font-medium text-primary hover:underline underline-offset-4">
                      Forgot password?
                    </a>
                  )}
                </div>
                <div className="relative">
                  <Input 
                    id="password" 
                    type={showPassword ? 'text' : 'password'} 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="h-14 rounded-xl bg-secondary/10 border-border/50 focus-visible:ring-primary pr-12" 
                    placeholder="••••••••" 
                  />
                  <button 
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>

              {!isLogin && (
                <div className="flex items-start space-x-3 pt-2">
                  <Checkbox id="terms" className="mt-1" />
                  <Label htmlFor="terms" className="text-sm text-muted-foreground leading-relaxed font-normal">
                    By creating an account, you agree to our <Link to={POLICY_ROUTES.terms} className="text-primary hover:underline">Terms of Service</Link> and <Link to={POLICY_ROUTES.privacy} className="text-primary hover:underline">Privacy Policy</Link>.
                  </Label>
                </div>
              )}

              <Button 
                type="submit"
                className="w-full h-14 rounded-xl text-lg font-bold premium-shadow-hover mt-4"
                disabled={isProcessing}
              >
                {isProcessing ? 'Processing...' : (isLogin ? 'Sign In' : 'Create Account')}
              </Button>
            </form>

            {/* Toggle Login/Signup */}
            <div className="text-center text-sm text-muted-foreground pt-4">
              {isLogin ? "Don't have an account? " : "Already have an account? "}
              <button 
                onClick={() => setIsLogin(!isLogin)}
                className="text-primary font-bold hover:underline underline-offset-4"
              >
                {isLogin ? 'Sign up' : 'Log in'}
              </button>
            </div>

            {/* Guest Checkout Option */}
            <div className="pt-8 mt-8 border-t border-border/50 text-center">
              <p className="text-sm text-muted-foreground mb-4">Just browsing or ready to buy?</p>
              <Button 
                variant="ghost" 
                className="w-full h-12 rounded-xl text-primary font-medium hover:bg-secondary/20 group"
                onClick={() => setCurrentPage('home')}
              >
                Continue as Guest
                <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}

function GoogleIcon(props: any) {
  return (
    <svg {...props} viewBox="0 0 48 48" xmlns="http://www.w3.org/w3.org/2000/svg">
      <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"/>
      <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"/>
      <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"/>
      <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"/>
    </svg>
  )
}
