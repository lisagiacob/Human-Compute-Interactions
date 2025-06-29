import React, { createContext, useState, useContext } from 'react';

// Create the context
const UserContext = createContext<any>(null);

// Create the provider component
export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [loggedInUser, setLoggedInUser] = useState<any | null>(null);

  return (
    <UserContext.Provider value={{ loggedInUser, setLoggedInUser }}>
      {children}
    </UserContext.Provider>
  );
};

// Export the hook for consuming the context
export const useUser = () => useContext(UserContext);