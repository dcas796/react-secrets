import express from "express";
import cors from "cors";
import path, { parse } from "path";

import AppDAO from "./dao";
import UserRepository, { User } from "./user_repo";
import AppRouter from "./router";
import { RequestError, Result, ResultType } from "./utils";
import TokenStore from "./token";

const DATABASE_PATH = path.resolve("secrets.db");

const PORT = 3001;

function createLoginToken(store: TokenStore, user_id: number): string {
    return store.generate({user_id})
} 

(async () => {
    const app = express()
    app.use(cors())
    app.use(express.json())

    const dao = new AppDAO(DATABASE_PATH)
    await dao.initialize()
    const user_repo = new UserRepository(dao)
    const router = new AppRouter(app)
    const store = new TokenStore()

    router.get("/api/getUserFromId/:id", async req => {
        const id = parseInt(req.params.id)
        if (isNaN(id)) {
            return Result.error(RequestError.typeMismatch("id", "number"))
        }

        const result = await user_repo.getUserById(id)
        if (result.type == ResultType.error) return Result.error(result.value as Error)
        
        return Result.success(result.value as User)
    })

    router.post("/api/authenticate", async req => {
        const username = req.body.username
        const password = req.body.password

        if (typeof username != "string") 
            return Result.error(RequestError.typeMismatch("username", "string"))

        if (typeof password != "string") 
            return Result.error(RequestError.typeMismatch("password", "string"))
    
        if (!await user_repo.validate(username, password)) 
            return Result.error(RequestError.wrongUsernameOrPassword())

        const result = await user_repo.getUserByName(username)
        if (result.type == ResultType.error) return Result.error(result.value as Error)

        const user_id = (result.value as User).id

        return Result.success({token: createLoginToken(store, user_id)})
    })

    router.get("/api/whoami", async req => {
        const token = req.header("authorization")?.replace("Bearer ", "")
        if (token == null) return Result.error(RequestError.noAuthorization())

        if (!store.validate(token)) return Result.error(RequestError.invalidAuthorization())

        const decodedPayload = Buffer.from(token.split(".")[1], "base64url").toString()
        const parsedPayload = JSON.parse(decodedPayload)

        if (parsedPayload.user_id == null) return Result.error(RequestError.corruptedAuthorization())
        const result = await user_repo.getUserById(parsedPayload.user_id)
        if (result.type == ResultType.error) return Result.error(result.value as Error)
        
        const user = result.value as User
        return Result.success(`Hello, ${user.name}. Your id is ${user.id}.`)
    })

    app.listen(PORT, () => {
        console.log(`Server running in port ${PORT}`)
    })
})()
