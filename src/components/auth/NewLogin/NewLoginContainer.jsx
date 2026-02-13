import { useState } from "react";
import Loginwrapper from '../../../assets/images/LoginWraper.png';
import NewLoginForm from "./NewLoginForm";
import TwoFactorAuth from "../TwoFactorAuth/TwoFactorAuth";

const NewLoginContainer = () => {
  return (
    <div className="min-h-screen flex flex-col md:flex-row text-start">
      <div className="hidden md:block md:w-2/3 relative" style={{ backgroundImage: `url(${Loginwrapper})`, backgroundSize: 'cover' }}>
      </div>

      {/* Right Side - Login Form */}
      {window.location?.pathname === "/login" ? (
        <NewLoginForm />
      ) : (<TwoFactorAuth />)}
    </div>
  );
};

export default NewLoginContainer;
