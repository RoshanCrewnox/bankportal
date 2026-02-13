import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import authService from '../../services/auth';
import { ThemeContext } from '../../components/common/ThemeContext';

export const useLogin = () => {
  const navigate = useNavigate();
  const { setTheme } = useContext(ThemeContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({ email: '', password: '' });
  const [successInfo, setSuccessInfo] = useState({ show: false, message: '', navigateTo: null });
  const [errorInfo, setErrorInfo] = useState({ show: false, message: '' });

  const togglePasswordVisibility = () => setShowPassword(!showPassword);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({ email: '', password: '' });
    setErrorInfo({ show: false, message: '' });

    try {
      const res = await authService.LOGIN_USER({
        username: email.trim(),
        password: password.trim(),
      });
      
      if (res.status === 200) {
        const { data } = res;
        if (data.mfa_mode === 'EMAIL_AUTH') {
          setSuccessInfo({
            show: true,
            message: "OTP sent to your email!",
            navigateTo: { path: "/twofactorauth", state: { mfa_tokenid: data.mfa_tokenid } },
          });
        } else if (data.access_token) {
          if (data.is_first_login === 'TRUE') {
            setSuccessInfo({
              show: true,
              message: "Login successful!",
              navigateTo: { path: "/first-login" },
            });
          } else {
            localStorage.setItem("isUserLogged", "true");
            localStorage.setItem("access_token", data.access_token);
            localStorage.setItem("refresh_token", data.refresh_token);
            localStorage.setItem("version", JSON.stringify({ 
                product_version: data.product_version, 
                firmware_version: data.firmware_version 
            }));

            setSuccessInfo({
              show: true,
              message: "Login successful!",
              navigateTo: { path: "/" },
            });
            
            if (data.cxp_theme_prefernce) {
              setTheme(data.cxp_theme_prefernce.toLowerCase());
            }
          }
        }
      }
    } catch (error) {
      console.error('Login error:', error);
      const message = error.response?.data?.error_description || error.response?.data?.error_code;

      if (message === "Username not found in System") {
        setErrors({ email: message, password: '' });
      } else if (message === "Incorrect Credential") {
        setErrors({ email: '', password: message });
      } else {
        setErrorInfo({
          show: true,
          message: message || "An error occurred during login.",
        });
      }
    }
  };

  const handleConfirmSuccess = () => {
    const navigateTo = successInfo.navigateTo;
    setSuccessInfo({ show: false, message: '', navigateTo: null });
    if (navigateTo) {
      navigate(navigateTo.path, { state: navigateTo.state });
    }
  };

  const handleConfirmError = () => setErrorInfo({ show: false, message: '' });

  return {
    email, setEmail,
    password, setPassword,
    showPassword, togglePasswordVisibility,
    errors, successInfo, errorInfo,
    handleSubmit,
    handleConfirmSuccess,
    handleConfirmError
  };
};
