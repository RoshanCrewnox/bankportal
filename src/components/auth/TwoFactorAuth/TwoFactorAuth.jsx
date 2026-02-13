import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import auth from "../../../services/auth";

export default function TwoFactorAuth() {
  const [otp, setOtp] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const [timeLeft, setTimeLeft] = useState(60);
  const [isResendDisabled, setIsResendDisabled] = useState(false);

  const handleOtpChange = (e, index) => {
    const newOtp = otp.split('');
    newOtp[index] = e.target.value;
    setOtp(newOtp.join(''));

    if (e.target.value && index < 5) {
      document.getElementById(`otp-input-${index + 1}`)?.focus();
    }

    if (!e.target.value && index > 0) {
      document.getElementById(`otp-input-${index - 1}`)?.focus();
    }
  };

  const handlePaste = (e) => {
    const paste = e.clipboardData.getData('text');
    if (paste.length === 6 && /^\d+$/.test(paste)) {
      setOtp(paste);
      document.getElementById(`otp-input-5`)?.focus();
    }
    e.preventDefault();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const otpValue = otp.split("").join("");
    const mfa_tokenid = location.state?.mfa_tokenid;

    if (!mfa_tokenid) {
      toast.error("MFA token not found. Please try logging in again.");
      navigate("/login");
      return;
    }

    try {
      const res = await auth.LOGIN_MFA({ otp: otpValue, token_id: mfa_tokenid });

      if (res.status === 200 && res.data?.access_token) {
        if (res.data.is_first_login === 'TRUE') {
          navigate("/first-login");
        } else {
          localStorage.setItem("isUserLogged", "true");
          localStorage.setItem("access_token", res.data.access_token);
          localStorage.setItem("refresh_token", res.data.refresh_token);
          navigate("/");
        }
        toast.success("OTP verified successfully!");
      } else {
        toast.error("Invalid OTP. Please try again.");
      }
    } catch (error) {
      console.error('OTP verification error:', error.response?.data?.error_description);
      const message =
        error.response?.data?.error_description ||
        "An error occurred during OTP verification.";
      toast.error(message);
      await auth.LOGOUT();
    }
  };

  const handleResendOTP = () => {
    if (timeLeft === 0) {
      alert("New OTP sent successfully!");
      setTimeLeft(60);
      setIsResendDisabled(true);
    }
  };

  useEffect(() => {
    let timer;
    if (timeLeft > 0) {
      timer = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
    } else {
      setIsResendDisabled(false);
    }
    return () => clearInterval(timer);
  }, [timeLeft]);

  return (
    <div data-aos="fade-left" className="w-full md:w-1/3 flex items-center justify-center p-8 text-start">
      <div className="w-full max-w-md text-start">
        <h2 className="text-2xl font-bold mb-2 text-center">Welcome to Mosura! 👋</h2>

        <form className="space-y-5" onSubmit={handleSubmit}>
          <h1 className="text-3xl font-bold text-center">
            2-Factor Authentication
          </h1>
          <p className="text-gray-500 text-center">
            Enter the 6-digit OTP sent to your phone.
          </p>

          {/* OTP Input Field */}
          <div className="flex justify-center space-x-2">
            {Array.from({ length: 6 }, (_, index) => (
              <input
                key={index}
                type="text"
                maxLength={1}
                className="w-12 h-12 text-center form-control text-lg border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={otp[index] || ""}
                onChange={(e) => handleOtpChange(e, index)}
                onPaste={index === 0 ? handlePaste : undefined}
                id={`otp-input-${index}`}
                required
              />
            ))}
          </div>

          {/* Resend OTP Section */}
          <div className="text-center mt-4">
            <button
              type="button"
              onClick={handleResendOTP}
              disabled={isResendDisabled}
              className={`text-orange-500 hover:text-orange-400 hover:underline font-medium ${isResendDisabled ? "opacity-50 cursor-not-allowed" : ""
                }`}
            >
              Resend OTP
            </button>
            {timeLeft > 0 && (
              <span className="text-gray-500 ml-2">
                ({timeLeft}s remaining)
              </span>
            )}
          </div>

          {/* Verify OTP Button */}
          <button
            type="submit"
            className="w-full bg-orange-500 hover:bg-orange-800 text-white font-bold py-3 rounded-xl transition-all duration-200 transform hover:scale-105"
          >
            Verify OTP
          </button>

          <div className="text-center text-gray-500 mt-4">
            <button type="button" onClick={() => navigate('/login')} className="text-orange-500 hover:text-orange-400 hover:underline font-medium">
              Back to Login
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
