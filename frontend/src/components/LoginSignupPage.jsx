import React, { useState } from "react";
import styles from "./LoginSignupPage.module.scss";
import { FaGoogle } from "react-icons/fa";
import { useForm } from "react-hook-form";
import { auth } from "../firebase/firebase.config";
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup
} from 'firebase/auth';
import { useNavigate } from "react-router-dom";

function LoginSignupPage() {
  const [isSignup, setIsSignup] = useState(false);
  const [error, setError] = useState("");
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm();
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    try {
      if (isSignup) {
        await createUserWithEmailAndPassword(
          auth,
          data.email,
          data.password
        );
        setShowSuccessMessage(true);
        setError("");
        setTimeout(() => {
          setIsSignup(false);
          setShowSuccessMessage(false);
        }, 3000);
      } else {
        await signInWithEmailAndPassword(
          auth,
          data.email,
          data.password
        );
        navigate('/profile');
      }
    } catch (error) {
      // Handle specific Firebase errors with user-friendly messages
      switch (error.code) {
        case 'auth/invalid-credential':
          setError('❌ Wrong email or password, please try again');
          break;
        case 'auth/email-already-in-use':
          setError('📧 This email is already registered. Please try logging in.');
          break;
        case 'auth/too-many-requests':
          setError('⚠️ Too many attempts. Please try again later.');
          break;
        default:
          setError('⚠️ ' + error.message.replace('Firebase:', '').trim());
      }
    }
};
  const handleGoogleSignIn = async () => {
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      navigate('/profile');
    } catch (error) {
      // Don't show error message if user just closed the popup
      if (error.code !== 'auth/popup-closed-by-user') {
        setError(error.message.replace('Firebase:', '').trim());
      }
    }
};

  return (
    <div className={styles.container}>
      <div className={styles.formCard}>
        <h2>{isSignup ? "Create Account" : "Welcome Back"}</h2>
        <p className={styles.subtitle}>
          {isSignup 
            ? "Start your journey with us!" 
            : "We're glad to see you again"}
        </p>

        {error && <div className={styles.errorMessage}>{error}</div>}
        {showSuccessMessage && (
          <div className={styles.successMessage}>
            Account created successfully! Please sign in to continue.
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
          <div className={styles.inputGroup}>
            <input 
              {...register("email", { 
                required: "Email is required",
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: "Invalid email address"
                }
              })} 
              type="email" 
              placeholder="Email" 
              className={errors.email ? styles.errorInput : ''}
            />
            {errors.email && (
              <span className={styles.errorText}>{errors.email.message}</span>
            )}
          </div>

          <div className={styles.inputGroup}>
            <input 
              {...register("password", { 
                required: "Password is required",
                minLength: {
                  value: 6,
                  message: "Password must be at least 6 characters"
                }
              })} 
              type="password" 
              placeholder="Password" 
              className={errors.password ? styles.errorInput : ''}
            />
            {errors.password && (
              <span className={styles.errorText}>{errors.password.message}</span>
            )}
          </div>

          <button type="submit" className={styles.submitButton}>
            {isSignup ? "Sign Up" : "Log In"}
          </button>
        </form>

        <div className={styles.divider}>
          <span>OR</span>
        </div>

        <button 
          onClick={handleGoogleSignIn}
          className={styles.googleButton}
        >
          <FaGoogle className={styles.googleIcon}/>
          Continue with Google
        </button>

        <p className={styles.switchMode}>
          {isSignup ? "Already have an account?" : "Don't have an account?"}{" "}
          <button
            onClick={() => {
              setIsSignup(!isSignup);
              setError("");
              setShowSuccessMessage(false);
            }}
          >
            {isSignup ? "Log In" : "Sign Up"}
          </button>
        </p>

        <p className={styles.footerText}>© 2025 Road Ready. All rights reserved.</p>
      </div>
    </div>
  );
}

export default LoginSignupPage;