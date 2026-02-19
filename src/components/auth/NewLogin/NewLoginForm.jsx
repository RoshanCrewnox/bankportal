import { useNavigate } from 'react-router-dom';
import ZeroTeq from '../../../assets/Mosura12.png';
import NewAlertBox from '../../common/NewAlertBox';
import { useLogin } from '../../../hooks/auth/useLogin';

export default function NewLoginForm() {
  const navigate = useNavigate();
  const {
    email, setEmail,
    password, setPassword,
    showPassword, togglePasswordVisibility,
    errors, successInfo, errorInfo,
    handleSubmit,
    handleConfirmSuccess,
    handleConfirmError
  } = useLogin();

  return (
    <>
      <div className="w-full md:w-1/3 flex items-center justify-center p-8 bg-[#2f3349]">
        <div className="w-full max-w-md">
          <div className="p-6 flex items-start gap-2 align-items-center justify-center">
            <img src={ZeroTeq} className="mt-2 w-[14vw]" alt='zeroteq' />
          </div>
          <div className="text-start mb-8">
            <h2 className="text-2xl font-bold mb-2 text-white">Welcome to Mosura! 👋</h2>
            <p className="text-gray-600 text-white">Please sign in to your account and start the adventure</p>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <label htmlFor="email" className="block text-sm text-white font-medium">
                Email or Username
              </label>
              <input
                id="email"
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email or username"
                className="w-full border p-3 rounded border-gray-600 bg-[#3e425a] text-white"
              />
              {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
            </div>

            <div className="space-y-2">
              <label htmlFor="password" className="text-white block text-sm font-medium">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full border p-3 rounded border-gray-600 bg-[#3e425a] text-white"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={togglePasswordVisibility}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                </button>
              </div>
              {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center text-sm text-white">
                <input type="checkbox" className="mr-2" /> Remember Me
              </label>
              <p className="text-white hover:text-orange-400 hover:underline font-medium cursor-pointer" role="button" tabIndex={0} onClick={() => navigate('/forgot-password')} onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") navigate('/forgot-password'); }}>
                Forgot Password?
              </p>
            </div>

            <button type="submit" className="w-full bg-orange-500 hover:bg-orange-600 text-white py-2 rounded">
              Login
            </button>
          </form>

          <div className="text-center mt-6">
            <p className="text-sm text-white">
              New on our platform?{' '}
              <button className="text-white hover:text-orange-400 hover:underline font-medium" onClick={() => navigate("/signup")}>
                Create an account
              </button>
            </p>
          </div>
        </div>
      </div>
      <NewAlertBox
        showAlert={successInfo.show}
        type="success"
        title="Success"
        message={successInfo.message}
        onConfirm={handleConfirmSuccess}
        confirmText="OK"
        showCancelButton={false}
      />
      <NewAlertBox
        showAlert={errorInfo.show}
        type="error"
        title="Error"
        message={errorInfo.message}
        onConfirm={handleConfirmError}
        confirmText="OK"
        showCancelButton={false}
      />
    </>
  );
}
