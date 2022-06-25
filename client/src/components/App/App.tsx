import React, { useState } from 'react';
import './App.css';

import UserLoginPanel from '../UserLoginPanel/UserLoginPanel';
import UserHome from '../UserHome/UserHome';

export interface UserInfo {
    token: string
    name: string
    info: object
}

export const UserContext = React.createContext<[
    UserInfo | null, 
    (value: UserInfo) => void
]>([null, () => {}])

function App() {
    const [userInfo, setUserInfo] = useState<UserInfo | null>(null)

    return (
        <div className="App">
            <UserContext.Provider value={[userInfo, setUserInfo]}>
                {userInfo == null ? 
                    <UserLoginPanel />
                    :
                    <UserHome />
                }
            </UserContext.Provider>
        </div>
    );
}

export default App;
