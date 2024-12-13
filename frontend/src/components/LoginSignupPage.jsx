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
import { useTranslation } from 'react-i18next';

function LoginSignupPage() {
  const [isSignup, setIsSignup] = useState(false);
  const [error, setError] = useState("");
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const onSubmit = async (data) => {
    try {
      let userCredential;
      if (isSignup) {
        userCredential = await createUserWithEmailAndPassword(
          auth,
          data.email,
          data.password
        );
      } else {
        userCredential = await signInWithEmailAndPassword(
          auth,
          data.email,
          data.password
        );
      }

      // Get token and send to backend
      const token = await userCredential.user.getIdToken();
      const response = await fetch('http://localhost:3000/api/users/create-user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          email: userCredential.user.email,
          uid: userCredential.user.uid
        })
      });

      if (!response.ok) {
        throw new Error('Failed to create user in database');
      }

      navigate('/profile');
    } catch (error) {
      setError(error.message);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const userCredential = await signInWithPopup(auth, provider);
      
      // Get token and send to backend
      const token = await userCredential.user.getIdToken();
      const response = await fetch('http://localhost:3000/api/users/create-user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          email: userCredential.user.email,
          uid: userCredential.user.uid
        })
      });

      if (!response.ok) {
        throw new Error('Failed to create user in database');
      }

      navigate('/profile');
    } catch (error) {
      if (error.code !== 'auth/popup-closed-by-user') {
        setError(error.message.replace('Firebase:', '').trim());
      }
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.formCard}>
        <h2>{isSignup ? t("Create Account") : t("Welcome Back")}</h2>
        <p className={styles.subtitle}>
          {isSignup 
            ? t("Start your journey with us!") 
            : t("We're glad to see you again")}
        </p>

        {error && <div className={styles.errorMessage}>{error}</div>}
        {showSuccessMessage && (
          <div className={styles.successMessage}>
            {t("Account created successfully! Please sign in to continue.")}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
          <div className={styles.inputGroup}>
            <input 
              {...register("email", { 
                required: t("Email is required"),
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: t("Invalid email address")
                }
              })} 
              type="email" 
              placeholder={t("Email")} 
              className={errors.email ? styles.errorInput : ''}
            />
            {errors.email && (
              <span className={styles.errorText}>{errors.email.message}</span>
            )}
          </div>

          <div className={styles.inputGroup}>
            <input 
              {...register("password", { 
                required: t("Password is required"),
                minLength: {
                  value: 6,
                  message: t("Password must be at least 6 characters")
                }
              })} 
              type="password" 
              placeholder={t("Password")} 
              className={errors.password ? styles.errorInput : ''}
            />
            {errors.password && (
              <span className={styles.errorText}>{errors.password.message}</span>
            )}
          </div>

          <button type="submit" className={styles.submitButton}>
            {isSignup ? t("Sign Up") : t("Log In")}
          </button>
        </form>

        <div className={styles.divider}>
          <span>{t("OR")}</span>
        </div>

        <button 
          onClick={handleGoogleSignIn}
          className={styles.googleButton}
        >
          <FaGoogle className={styles.googleIcon}/>
          {t("Continue with Google")}
        </button>

        <p className={styles.switchMode}>
          {isSignup ? t("Already have an account?") : t("Don't have an account?")}{" "}
          <button
            onClick={() => {
              setIsSignup(!isSignup);
              setError("");
              setShowSuccessMessage(false);
            }}
          >
            {isSignup ? t("Log In") : t("Sign Up")}
          </button>
        </p>

        <p className={styles.footerText}>{t("© 2025 Road Ready. All rights reserved.")}</p>
      </div>
    </div>
  );
}

export default LoginSignupPage;