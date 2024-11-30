import React, { useState } from "react";
import styles from "./LoginSignupPage.module.scss";
import { FaGoogle } from "react-icons/fa";
import { useForm } from "react-hook-form";

function LoginSignupPage() {
  const [isSignup, setIsSignup] = useState(false);
  const { register, handleSubmit, watch, formState: { errors } } = useForm();
  const onSubmit = data => console.log(data);
  {/* const handleGoogleSignIn = () => {
    
  };
  */}
  return (
    <div className={styles.container}>
      <h2>{isSignup ? "Sign Up" : "Log In"}</h2>

      <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
        <input {...register("email", { required: true })} type="email" placeholder="Email" required />
        <input {...register("password", { required: true })} type="password" placeholder="Password" required />
        {isSignup && <input type="password" placeholder="Confirm Password" required />}
        <button type="submit">{isSignup ? "Sign Up" : "Log In"}</button>
      </form>
  
        {/* switch between login and signup */}
      <p>
        {isSignup ? "Already have an account?" : "Don't have an account?"}{" "}
        <button
          className={styles.switchMode}
          onClick={() => setIsSignup(!isSignup)}
        >
          {isSignup ? "Log In" : "Sign Up"}
        </button>
      </p>

      {/* google sign in */}
      <div className={styles.googleSignInContainer}>
        <p>Or continue with Google</p>
        <button className='w-full flex flex-wrap gap-1 items-center justify-center bg-secondary hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none'>
          <FaGoogle/>
          Sign in with Google 
        </button>
      </div>
      <p className='{styles.footerText}'>© 2025 Road Ready. All rights reserved.</p>
    </div>
  );
}

export default LoginSignupPage;
