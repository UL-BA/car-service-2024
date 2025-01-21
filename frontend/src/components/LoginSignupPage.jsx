import React, { useState } from "react";
import styles from "./LoginSignupPage.module.scss";
import { FaGoogle } from "react-icons/fa";
import { useForm } from "react-hook-form";
import { auth, db } from "../firebase/firebase.config"; // Import Firestore and Auth
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore"; // Firestore functions
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

function LoginSignupPage() {
  const [isSignup, setIsSignup] = useState(false);
  const [error, setError] = useState("");
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const navigate = useNavigate();
  const { t } = useTranslation();

  // Handle Login or Signup
  const onSubmit = async (data) => {
    try {
      let userCredential;

      if (isSignup) {
        userCredential = await createUserWithEmailAndPassword(
          auth,
          data.email.toLowerCase(), // Normalize email to lowercase
          data.password
        );

        // Save new user to Firestore
        await setDoc(doc(db, "user", userCredential.user.uid), {
          email: userCredential.user.email,
          role: "user", // Default role
          uid: userCredential.user.uid,
        });
        console.log("User signed up and document created:", userCredential.user.uid);
        setShowSuccessMessage(true);
      } else {
        userCredential = await signInWithEmailAndPassword(
          auth,
          data.email.toLowerCase(), // Normalize email to lowercase
          data.password
        );
        console.log("User logged in:", userCredential.user.uid);
      }

      // Temporarily bypass role checks and redirect
      console.log("Bypassing role checks for testing...");
      navigate("/admin/services");
    } catch (error) {
      console.error("Login/Signup error:", error.message);
      setError(error.message);
    }
  };

  // Handle Google Sign-In
  const handleGoogleSignIn = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const userCredential = await signInWithPopup(auth, provider);

      // Temporarily bypass role checks and redirect
      console.log("Bypassing role checks for Google Sign-In...");
      navigate("/admin/services");
    } catch (error) {
      console.error("Google Sign-In error:", error.message);
      if (error.code !== "auth/popup-closed-by-user") {
        setError(error.message.replace("Firebase:", "").trim());
      }
    }
  };

  return (
    <div className={styles.animation}>
      <div className={styles.background}>
        <span></span>
        <span></span>
        <span></span>
        <span></span>
        <span></span>
        <span></span>
        <span></span>
        <span></span>
        <span></span>
        <span></span>
        <span></span>
        <span></span>
        <span></span>
        <span></span>
        <span></span>
        <span></span>
        <span></span>
        <span></span>
        <span></span>
        <span></span>
      </div>
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
                    message: t("Invalid email address"),
                  },
                })}
                type="email"
                placeholder={t("Email")}
                className={errors.email ? styles.errorInput : ""}
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
                    message: t("Password must be at least 6 characters"),
                  },
                })}
                type="password"
                placeholder={t("Password")}
                className={errors.password ? styles.errorInput : ""}
              />
              {errors.password && (
                <span className={styles.errorText}>
                  {errors.password.message}
                </span>
              )}
            </div>

            <button type="submit" className={styles.submitButton}>
              {isSignup ? t("Sign Up") : t("Log In")}
            </button>
          </form>

          <div className={styles.divider}>
            <p className={styles.spanText}>{t("OR")}</p>
          </div>

          <button onClick={handleGoogleSignIn} className={styles.googleButton}>
            <FaGoogle className={styles.googleIcon} />
            {t("Continue with Google")}
          </button>

          <p className={styles.switchMode}>
            {isSignup
              ? t("Already have an account?")
              : t("Don't have an account?")}{" "}
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
        </div>
      </div>
    </div>
  );
}

export default LoginSignupPage;
