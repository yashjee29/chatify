import React from 'react'
import { MessageCircle, Loader2, Eye, EyeOff, Sparkles, Shield, Users } from "lucide-react";
import styles from '../../styles/auth.module.css';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axios';
import Toast from '../../components/Toast/Toast';

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const Auth = () => {
  const { login, signup } = useAuth();
  const [isSignUp, setIsSignUp] = React.useState(false)
  const [showPassword, setShowPassword] = React.useState(false)
  const [apiError, setApiError] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [toast, setToast] = React.useState("");
  const navigate = useNavigate();

  const [form, setForm] = React.useState({
    name: '',
    email: '',
    password: '',
  })

  const [errors, setErrors] = React.useState({
    name: '',
    email: '',
    password: '',
  })

  const validateField = (name, value) => {
    let error = '';
    if (!value.trim()) {
      error = "Required";
    }
    if(name == "name" && isSignUp && value.trim().length < 3) {
      error = 'Name must be at least 3 characters long.';
    }

    if(name == "email" && !emailRegex.test(value)) {
      error = 'Enter a valid email address.';
    }

    if(name == "password" && value.length < 6) {
      error = 'Password must be at least 6 characters long.';
    }

    setErrors(prevErrors => ({
      ...prevErrors,
      [name]: error
    }));
    return Boolean(error);
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prevForm => ({
      ...prevForm,
      [name]: value
    }));
    validateField(name, value);
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationResults = {};
    Object.keys(form).forEach((key) =>
      validateField(key, form[key])
    );
  
    const hasErrors = Object.values(validationResults).some(Boolean);
    if(hasErrors) return;
    
    setApiError("");
    setLoading(true);
    const endpoint = isSignUp ? "/auth/signup" : "/auth/login";

    const payload = isSignUp
      ? {
          name: form.name,
          email: form.email,
          password: form.password 
        }
      : {
          email: form.email,
          password: form.password
        };

    try{
      const { data } = await api.post(endpoint, payload);
      console.log("Auth response data:", data);
      if(isSignUp){
        setToast("Verification email sent.")
        setIsSignUp(false);
        return;
      }
      login(data.user, data.token);
      navigate("/chat");
    }catch(err){
      console.error("Auth error:", err);
      console.error("Error response:", err.response);
      console.error("Error message:", err.response?.data?.message);
      setApiError(err.response?.data?.message || "Something went wrong. Please try again.");
    }finally{
      setLoading(false);
    }
  }

  return (
    <div className={styles.container}>
      <div className={styles.left}>
        <div className={styles.brand}>
          <MessageCircle size={22} strokeWidth={2.2} />
          <span>Chatify</span>
        </div>

        <h1>
          {isSignUp ? (
            <>Connect with anyone,<br />anywhere in real-time</>
          ) : (
          <>Welcome back to<br />your conversations</>
          )}
        </h1>

        <p>
          {isSignUp 
            ? "Join millions of users who trust Chatify for seamless, secure messaging."
            : "Pick up right where you left off. Your chats are waiting."}
        </p>

        <div className={styles.features}>
          <div className={styles.feature}>
            <div className={styles.iconBadge}>
            <Sparkles size={22} />
            </div>
            <div>
              <span  className={styles.featureTitle}>Instant Messaging</span>
              <span className={styles.featureDesc}>Real-time delivery, always.</span>
            </div>
          </div>
          <div className={styles.feature}>
            <div className={styles.iconBadge}>
            <Users size={22} />
            </div>
            <div>
              <span className={styles.featureTitle}>Group Chats</span>
              <span className={styles.featureDesc}>Stay connected with everyone.</span>
            </div>
          </div>
          <div className={styles.feature}>
            <div className={styles.iconBadge}>
            <Shield size={22} />
            </div>
            <div>
              <span className={styles.featureTitle}>Secure & Private</span>
              <span className={styles.featureDesc}>Your data stays yours.</span>
            </div>
          </div>
        </div>
        <p className={styles.trusted}>
          Trusted by teams worldwide
        </p>
      </div>

      <div className={styles.right}>
        <div className={styles.form}>
          <h2>{isSignUp ? "Create your account" : "Welcome back"}</h2>
          <p className={styles.sub}>
            {isSignUp 
              ? "Start chatting with friends and groups "
              : "Sign in to continue"}
          </p>

          <form onSubmit={handleSubmit} noValidate>
            {isSignUp && (
              <>
                <label>Full Name</label>
                <input
                  type='text'
                  name='name'
                  placeholder='Enter Your Name'
                  value={form.name}
                  onChange={handleChange}
                  className={styles.nameField}
                />
                {errors.name && <span className={styles.error}>{errors.name}</span>}
              </>
            )}
            <label>Email Address</label>
            <input
              type='email'
              name='email'
              placeholder='you@example.com'
              value={form.email}
              onChange={handleChange}
              className={styles.emailField}
            />
            {errors.email && <span className={styles.error}>{errors.email}</span>}

            <label>Password</label>
            <div className={styles.passwordField}>
              <input
                type={showPassword ? 'text' : 'password'}
                name='password'
                placeholder='Password'
                value={form.password}
                onChange={handleChange}
                className={styles.passwordInput}
              />

              <div>
                <span onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? <EyeOff size={22} /> : <Eye size={22} />}
                </span>
              </div>

              </div>
              <span className={styles.helper}>
                Minimum 6 characters
              </span>
              {errors.password && (
                <span className={styles.error}>{errors.password}</span>
              )}
              {apiError && <span className={styles.error}>{apiError}</span>}
            <button type="submit" disabled={loading}>
              { loading ? "Please wait..." : isSignUp ? "Create Account" : "Sign In"}
            </button>
          </form>
          <span className={styles.or}>OR</span>
          <p className={styles.switch}>
            {isSignUp ? (
              <>
                Already have an account?{' '}
                <strong onClick={() => setIsSignUp(false)} style={{cursor: 'pointer'}}>Sign In</strong>
              </>
            ) : (
              <>
                Don't have an account?{' '}
                <strong onClick={() => setIsSignUp(true)} style={{cursor: 'pointer'}}>Create one</strong>
              </>
            )}
          </p>
        </div>
        {toast && (
          <Toast
            message={toast}
            onClose={() => setToast("")}
          />
        )}
      </div>
    </div>
  )
}

export default Auth
