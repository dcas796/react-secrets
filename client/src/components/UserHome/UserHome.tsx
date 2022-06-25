import React, { useContext, useState } from 'react';
import { UserContext, UserInfo } from '../App/App';
import './UserHome.css';
import { UserAPI } from '../../user';
import Result from 'typescript-result';

function UserHome() {
    const [userInfo] = useContext(UserContext) as [UserInfo, (value: UserInfo) => void]

    const [whoami, setWhoami] = useState<string>()

    const user_api = new UserAPI()
    user_api.api.credentials = userInfo.token;
    
    (async () => {
        const result = await user_api.whoami()
        if (result.type === Result.Type.success)
            setWhoami(result.value as string)

        if (result.type === Result.Type.error)
            console.error(result.value as Error)
    })()

    return (
        <div className="UserHome">
            <h1>Hello, {userInfo.name}</h1>
            <p>Your Token: {userInfo.token}</p>
            <p>Personal Info: {JSON.stringify(userInfo.info)}</p>
            <p>Check Whoami: {whoami}</p>
        </div>
    )
}

export default UserHome;
