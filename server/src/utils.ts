// ERROR HANDLING

export function fatalError(message?: string, code: number = 1): never {
    console.error(`ERROR: ${message}`)
    return process.exit(code)
}

export function throwMessage(message: string, error?: Error, exit: boolean = true): never | void {
    console.error(`ERROR: ${message}` + (error ? ", reason: " + error.message : ""))
    if (exit) return process.exit(1)
}

export function throwError(error?: Error | null, exit: boolean = true): never | void {
    return throwMessage(error?.message ?? "Fatal Error", undefined, exit)
}

export class RequestError extends Error {
    private constructor(public status: number, public message: string) {
        super()
    }

    static typeMismatch(name: string, type: string) { 
        return new RequestError(400, `Type of ${name} is not ${type}`)
    }

    static wrongUsernameOrPassword() {
        return new RequestError(400, "Wrong username or password")
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

// MISC
// https://stackoverflow.com/questions/26948400/typescript-how-to-extend-two-classes
export function applyMixins(derivedCtor: any, baseCtors: any[]) {
    baseCtors.forEach(baseCtor => {
        Object.getOwnPropertyNames(baseCtor.prototype).forEach(name => {
             if (name !== 'constructor') {
                derivedCtor.prototype[name] = baseCtor.prototype[name]
            }
        })
    })
}

export enum ResultType {
    success,
    error
}

export class Result<T> {
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
