const STORAGE_KEY = "userData";

const USER_SESSION_DATA = "SessionData";
const SESSION_API_CALL_SEQ = "SessionApiCallSeq";
const SESSION_REFRESH_TIME = "SessionRefreshTime";

const UpdateSessionRefreshTime = () => {
  try {
    const currentTimestamp = Date.now();
    localStorage.setItem(SESSION_REFRESH_TIME, currentTimestamp.toString());
  } catch (error) {
    console.error("Error saving Session data to localStorage:", error);
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

const ResetSessionApiCallSeqData = () => {
  try {
    localStorage.setItem(SESSION_API_CALL_SEQ, "0");
  } catch (error) {
    console.error("Error Reset Session API call Seq no");
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
