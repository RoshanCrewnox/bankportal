const STORAGE_KEY = "userData";
const SELECTED_POLICY = "selectedPolicy";
const USER_STYLE = "userStyle";

const USER_SESSION_DATA = "SessionData";
const SESSION_API_CALL_SEQ = "SessionApiCallSeq";
const SESSION_REFRESH_TIME = "SessionRefreshTime";

export const getIsPortalLoggedIn = () => {
  return localStorage.getItem("isUserLogged") === "true";
};

export const UpdateSessionRefreshTime = () => {
  try {
    const currentTimestamp = Date.now();
    localStorage.setItem(SESSION_REFRESH_TIME, currentTimestamp.toString());
  } catch (error) {
    console.error("Error saving Session data to localStorage:", error);
  }
};

export const getSessionRefreshTime = () => {
  try {
    const data = localStorage?.getItem(SESSION_REFRESH_TIME);
    return Number(data);
  } catch (error) {
    console.error("Error parsing Session data from localStorage:", error);
    return 0;
  }
};

export const saveSessionData = (data, IsLogon) => {
  try {
    localStorage.setItem(USER_SESSION_DATA, JSON.stringify(data));
    if (IsLogon) {
      ResetSessionApiCallSeqData();
    }
    UpdateSessionRefreshTime();
  } catch (error) {
    console.error("Error saving Session data to localStorage:", error);
  }
};

export const getSessionData = () => {
  try {
    const data = localStorage?.getItem(USER_SESSION_DATA);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error("Error parsing Session data from localStorage:", error);
    return null;
  }
};

export const removeSessionData = () => {
  try {
    localStorage.removeItem(USER_SESSION_DATA);
    ResetSessionApiCallSeqData();
    console.log("Session data removed successfully.");
  } catch (error) {
    console.error("Error removing Session data from localStorage:", error);
  }
};

export const getNextAPICallSeq = () => {
  try {
    const data = Number(localStorage?.getItem(SESSION_API_CALL_SEQ)) + 1;
    localStorage.setItem(SESSION_API_CALL_SEQ, data.toString());
    return data.toString();
  } catch (error) {
    console.error("Error parsing Session data from localStorage:", error);
    return "0";
  }
};

const ResetSessionApiCallSeqData = () => {
  try {
    localStorage.setItem(SESSION_API_CALL_SEQ, "0");
  } catch (error) {
    console.error("Error Reset Session API call Seq no");
  }
};

export const saveUserData = (data) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (error) {
    console.error("Error saving user data to localStorage:", error);
  }
};

export const getUserData = () => {
  try {
    const data = localStorage?.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error("Error parsing user data from localStorage:", error);
    return null;
  }
};

export const saveUserStyles = (data) => {
  try {
    localStorage.setItem(USER_STYLE, JSON.stringify(data));
  } catch (error) {
    console.error("Error saving user data to localStorage:", error);
  }
};

export const getUserStyles = () => {
  try {
    const data = localStorage?.getItem(USER_STYLE);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error("Error parsing user data from localStorage:", error);
    return null;
  }
};

export const removeUserData = () => {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error("Error removing user data from localStorage:", error);
  }
};

export const saveSelectedPolicy = (data) => {
  try {
    localStorage.setItem(SELECTED_POLICY, JSON.stringify(data));
  } catch (error) {
    console.error("Error saving selected policy to localStorage:", error);
  }
};

export const getSelectedPolicy = () => {
  try {
    const data = localStorage.getItem(SELECTED_POLICY);
    if (!data) {
      return null;
    }
    return JSON.parse(data);
  } catch (error) {
    console.error("Error parsing selected policy from localStorage:", error);
    return null;
  }
};

export const saveLocalData = (data) => {
  try {
    if (!data?.key || data?.value === undefined) {
      console.error("Invalid data provided for saving.");
      return;
    }
    localStorage.setItem(data.key, JSON.stringify(data.value));
  } catch (error) {
    console.error("Error saving data to localStorage:", error);
  }
};

export const getLocalData = (key) => {
  try {
    if (!key) {
      return null;
    }
    const data = localStorage.getItem(key);
    if (!data) {
      return null;
    }
    return JSON.parse(data);
  } catch (error) {
    console.error(`Error parsing data for key '${key}' from localStorage:`, error);
    return null;
  }
};

export const removeAllCookies = () => {
  const cookies = document.cookie.split(";");
  cookies.forEach((cookie) => {
    const eqPos = cookie.indexOf("=");
    const name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
    document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;
  });
};
