import schemaRegistry from './schemaRegistryService';

const services = {
  user: {
    USER_PROFILE: async () => ({
      data: {
        first_name: "John",
        last_name: "Doe",
        email: "john.doe@example.com",
        username: "johndoe",
        role_name: "admin",
        org_currency: "USD"
      }
    }),
    UPDATE_THEME: async (theme) => {
      console.log(`Theme updated to: ${theme}`);
      return { success: true };
    }
  },
  auth: {
    LOGOUT: async () => {
      console.log("Logged out");
    }
  },
  schemaRegistry
};

export default services;
