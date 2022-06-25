import { API } from "./api"
import { apiURL } from "./global"
import Result from "typescript-result"

export interface APIResponse {
    response?: any
    error?: {
        status?: number
        message: string
    }
}

export interface User {
    id: number
    name: string
    password_hash: string
    encrypted_secret: string
}

// https://stackoverflow.com/questions/56121589/typescript-check-an-object-has-all-interface-properties

export namespace User {
    const schema: Record<keyof User, string> = {
        id: "number",
        name: "string",
        password_hash: "string",
        encrypted_secret: "string"
    }

    export function isUser(o: any): o is User {
        const missingProperties = Object.keys(schema)
            .filter(key => o[key] === undefined)
            .map(key => key as keyof User)
        return missingProperties.length === 0
    }
}

export class APIError extends Error {
    private constructor(public message: string) {
        super()
    }

    static typeMismatch(name: string, type: string) { 
        return new APIError(`Type of ${name} is not ${type}`)
    }

    static malformedResponse() {
        return new APIError("Response is malformed or corrupted")
    }

    static missingCredentials(route: string) {
        return new APIError(`Credentials are needed for accessing '${route}'`)
    }
}

export class UserAPI {
    api: API

    constructor() {
        this.api = new API(apiURL)
    }
    
    async getUserFromId(id: number): Promise<Result<User>> {
        const response = await this.api.request("getUserFromId/" + id) as APIResponse
        
        if (response.error != null)
            return Result.error(new Error(response.error.message))

        if (response.response != null) {
            const user = response.response

            if (User.isUser(user)) {
                return Result.success(user)
            }
            
            return Result.error(APIError.typeMismatch("response", "User"))
        }

        return Result.error(APIError.malformedResponse())
    }

    async authenticate(username: string, password: string): Promise<Result<string>> {
        const response = await this.api.request("authenticate", {
            method: "post",
            body: JSON.stringify({username, password})
        }) as APIResponse

        if (response.error != null)
            return Result.error(new Error(response.error.message))

        if (response.response != null) {
            const token = response.response.token as string

            if (token == null) return Result.error(APIError.typeMismatch("token", "string"))

            this.api.credentials = token

            return Result.success(token)
        }

        return Result.error(APIError.malformedResponse())
    }

    async whoami(): Promise<Result<string>> {
        if (this.api.credentials == null) 
            return Result.error(APIError.missingCredentials("whoami"))

        const response = await this.api.request("whoami", {sendCredentials: true}) as APIResponse

        if (response.error != null)
            return Result.error(new Error(response.error.message))

        if (response.response != null) {
            const message = response.response as string

            if (message == null) return Result.error(APIError.typeMismatch("response", "string"))

            return Result.success(message)
        }

        return Result.error(APIError.malformedResponse())
    }
}
