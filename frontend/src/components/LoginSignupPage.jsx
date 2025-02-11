import React, { useState } from "react";
import styles from "./LoginSignupPage.module.scss";
import { FaGoogle } from "react-icons/fa";
import { useForm } from "react-hook-form";
import { auth, db } from "../firebase/firebase.config";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
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

  const saveUserToMongoDB = async (uid, email, role = "user") => {
    try {
      const token = await auth.currentUser.getIdToken();

      const response = await fetch("http://localhost:3000/api/users/create-user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ uid, email, role }),
      });

      if (!response.ok) {
        throw new Error("Failed to save user to MongoDB");
      }
      console.log("User successfully saved to MongoDB");
    } catch (error) {
      console.error("Error saving user to MongoDB:", error.message);
    }
  };

  const onSubmit = async (data) => {
    try {
      let userCredential;

      if (isSignup) {
        userCredential = await createUserWithEmailAndPassword(
          auth,
          data.email.toLowerCase(),
          data.password
        );

        await setDoc(doc(db, "user", userCredential.user.uid), {
          email: userCredential.user.email,
          role: "user",
          uid: userCredential.user.uid,
        });

        await saveUserToMongoDB(userCredential.user.uid, userCredential.user.email, "user");

        console.log("User signed up and document created:", userCredential.user.uid);
        setShowSuccessMessage(true);
      } else {
        userCredential = await signInWithEmailAndPassword(
          auth,
          data.email.toLowerCase(),
          data.password
        );

        const userDoc = await getDoc(doc(db, "user", userCredential.user.uid));
        const userRole = userDoc.exists() ? userDoc.data().role : null;

        await saveUserToMongoDB(userCredential.user.uid, userCredential.user.email, userRole);

        if (userRole === "admin") {
          navigate("/admin/services");
          console.log("Admin Access Approved");
        } else {
          navigate("/profile");
        }
      }
    } catch (error) {
      console.error("Login/Signup error:", error.message);
      setError(error.message);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const userCredential = await signInWithPopup(auth, provider);

      const userDoc = await getDoc(doc(db, "user", userCredential.user.uid));
      const userRole = userDoc.exists() ? userDoc.data().role : "user";

      await saveUserToMongoDB(userCredential.user.uid, userCredential.user.email, userRole);

      if (userRole === "admin") {
        navigate("/admin/services");
        console.log("Admin Access Approved");
      } else {
        navigate("/profile");
      }
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
