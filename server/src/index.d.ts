import { RequestError } from "./utils"

declare namespace Express {
    export interface Response {
        error: (type: RequestError, message: string) => void
    }
}
