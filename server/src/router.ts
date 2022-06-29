import { Express, Request, Response } from "express";
import { RequestError } from "./utils";

type RequestHandler = (req: Request) => (any | Promise<any>)

export default class AppRouter {
    constructor(public app: Express) {}

    private responseHandler(handler: RequestHandler) {
        return async (req: Request, res: Response) => {
            try {
                var result = handler(req)
                if (result instanceof Promise) result = await result
                res.json({response: result})
            } catch (error) {
                if (error instanceof RequestError) res.status(error.status)
                res.json({error})
            }
        }
    }

    get(path: string, handler: RequestHandler) {
        this.app.get(path, this.responseHandler(handler))
    }

    post(path: string, handler: RequestHandler) {
        this.app.post(path, this.responseHandler(handler))
    }
}
