// ERROR HANDLING

export function fatalError(message?: string, code: number = 1): never {
    console.error(`FATAL ERROR: ${message}`)
    return process.exit(code)
}

export function throwWarning(message: string): void {
    console.warn(`WARNING: ${message}`)
}

export class RequestError extends Error {
    private constructor(public status: number, public message: string) {
        super()
    }
    
    static missingValue(name: string) {
        return new RequestError(400, `Missing ${name} in request body`)
    }

    static typeMismatch(name: string, type: string) { 
        return new RequestError(400, `Type of ${name} is not ${type}`)
    }

    static noAuthorization() {
        return new RequestError(401, "Authorization must be sent with the request")
    }

    static corruptedAuthorization() {
        return new RequestError(400, "Corrupted or malformed authorization bearer")
    }

    static invalidAuthorization() {
        return new RequestError(400, "Invalid authorization")
    }
}

export class AuthError extends Error {
    private constructor(public message: string) {
        super()
    }

    static invalidUsernameOrPassword() {
        return new AuthError("Wrong username or password")
    }

    static invalidPassword() {
        return new AuthError("Invalid password")
    }
}

// TODO: Remove Result if not necessary in next commit

enum ResultType {
    success,
    error
}

class Result<T> {
    private constructor(
        public readonly type: ResultType, 
        public readonly value: T | Error
        ) {}

    static success<T>(value: T): Result<T> {
        return new Result(ResultType.success, value)
    }

    static error<T>(error: Error): Result<T> {
        return new Result<T>(ResultType.error, error)
    }
}
