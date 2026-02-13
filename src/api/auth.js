const authEndpoints = {
  LOGIN: () => "/cx/login",
  LOGOUT: () => `/cx/logout`,
  FORGOT_PASSWORD: () => `/auth/forgot-password`,
  RESET_PASSWORD: () => `/cx/resetpassword`,
  REGISTER: () => `/auth/register`,
  UPDATE: () => `/update/`,
  REFRESH_JWT_TOKEN: () => `/cx/RefreshJwtToken`,
  LOGIN_MFA: () => `/cx/auth/mfa/mail`,
  USER_THEME: () => `/cx/administration/cxusers/updateThemePreference`,
};

export default authEndpoints;
