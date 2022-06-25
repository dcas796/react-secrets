import { Express, Request, Response } from "express";
import { Result, ResultType } from "./utils";

type RequestHandler = (req: Request) => Result<any> | Promise<Result<any>>

export default class AppRouter {
    constructor(public app: Express) {}

    private responseHandler(handler: RequestHandler) {
        return async (req: Request, res: Response) => {
            var result = handler(req)
            if (result instanceof Promise) result = await result
            switch (result.type) {
                case ResultType.success:
                    res.json({response: result.value})
                    return
                case ResultType.error:
                    res.json({error: result.value})
                    return
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
