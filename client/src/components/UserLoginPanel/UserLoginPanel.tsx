import React, { FormEvent, useCallback, useContext, useMemo, useState } from 'react';
import './UserLoginPanel.scss';
import logo from '../../logo.svg';
import { UserContext, UserInfo } from '../App/App';
import { UserAPI } from '../../user';
import Result from 'typescript-result';

function UserLoginPanel() {

    const [userInfo, setUserInfo] = useContext(UserContext)

    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")

    const [error, setError] = useState<Error>()

    const user_api = useMemo(() => new UserAPI(), [])

    const submit = useCallback(async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault()

        const result = await user_api.authenticate(username, password)

        if (result.type === Result.Type.error)
            setError(result.value as Error)
        
        const token = result.value as string

        const newUserInfo: UserInfo = {
            token,
            name: username,
            info: {}
        }

        setUserInfo(newUserInfo)

    }, [username, password, setUserInfo, user_api])

    return (
        <div className="UserLoginPanel">
            <img src={logo} alt="" width="100" height="100" />
            <h1>Welcome</h1>
            {error != null && <div className="errorDialog">
                {error.message}
            </div>}
            <form className="loginForm" onSubmit={submit}>
                <input type="text" placeholder="Username" onChange={e => setUsername(e.target.value)}/>
                <input type="password" placeholder='Password' onChange={e => setPassword(e.target.value)}/>
                <button type="submit">Login</button>
            </form>
        </div>
    );
}

export default UserLoginPanel;
