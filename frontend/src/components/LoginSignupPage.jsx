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
  const { register, handleSubmit, watch, formState: { errors } } = useForm();
  const navigate = useNavigate();

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

        // Get Firebase ID token
        const idToken = await userCredential.user.getIdToken();

        // Send to backend
        const response = await fetch('http://localhost:3000/api/users/create-user', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${idToken}`
            },
            body: JSON.stringify({
                email: userCredential.user.email,
                uid: userCredential.user.uid
            })
        });

        if (response.ok) {
            navigate('/');
        }
    } catch (error) {
        setError(error.message);
    }
};

  const handleGoogleSignIn = async () => {
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      navigate('/');
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className={styles.container}>
      <h2>{isSignup ? "Sign Up" : "Log In"}</h2>

      {error && <p className={styles.error}>{error}</p>}

      <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
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
        />
        {errors.email && <span className={styles.errorMessage}>{errors.email.message}</span>}
        
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
        />
        {errors.password && <span className={styles.errorMessage}>{errors.password.message}</span>}
        
        <button type="submit">{isSignup ? "Sign Up" : "Log In"}</button>
      </form>

      <p>
        {isSignup ? "Already have an account?" : "Don't have an account?"}{" "}
        <button
          className={styles.switchMode}
          onClick={() => setIsSignup(!isSignup)}
        >
          {isSignup ? "Log In" : "Sign Up"}
        </button>
      </p>

      <div className={styles.googleSignInContainer}>
        <p>Or continue with Google</p>
        <button 
          onClick={handleGoogleSignIn}
          className={styles.googleButton}
        >
          <FaGoogle/>
          Sign in with Google 
        </button>
      </div>
      
      <p className={styles.footerText}>© 2025 Road Ready. All rights reserved.</p>
    </div>
  );
}

export default LoginSignupPage;