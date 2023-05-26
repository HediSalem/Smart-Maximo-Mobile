import React, {createContext, useState} from 'react';

const CallContext = createContext();

const CallProvider = ({children}) => {
  const [incomingCall, setIncomingCall] = useState(null);

  return (
    <CallContext.Provider value={{incomingCall, setIncomingCall}}>
      {children}
    </CallContext.Provider>
  );
};

export {CallContext, CallProvider};
