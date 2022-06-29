import express from "express";
import cors from "cors";
import path from "path";

import AppDAO from "./dao";
import UserRepository from "./user_repo";
import AppRouter from "./router";
import { AuthError, RequestError } from "./utils";
import TokenStore from "./token";
import { User } from "./user";

const DATABASE_PATH = path.resolve("secrets.db");

const PORT = 3001;

const createLoginToken = (store: TokenStore, user_id: number): string => {
    return store.generate({user_id})
}

const getAuthenticatedUser = async (req: express.Request, store: TokenStore, user_repo: UserRepository): Promise<User> => {
    const token = req.header("authorization")?.replace("Bearer ", "")
    if (token == null) throw RequestError.noAuthorization()

    if (!store.validate(token)) throw RequestError.invalidAuthorization()

    const decodedPayload = Buffer.from(token.split(".")[1], "base64url").toString()
    const parsedPayload = JSON.parse(decodedPayload)

    if (parsedPayload.user_id == null) throw RequestError.corruptedAuthorization()
    return await user_repo.getUserById(parsedPayload.user_id)
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

    // DEBUG
    router.get("/api/getUserFromId/:id", async req => {
        const id = parseInt(req.params.id)
        if (isNaN(id)) {
            throw RequestError.typeMismatch("id", "number")
        }
        
        return await user_repo.getUserById(id)
    })

    router.post("/api/authenticate", async req => {
        const username = req.body.username
        const password = req.body.password

        if (typeof username != "string") 
            throw RequestError.typeMismatch("username", "string")

        if (typeof password != "string") 
            throw RequestError.typeMismatch("password", "string")
    
        if (!await user_repo.validate(username, password)) 
            throw AuthError.invalidUsernameOrPassword()

        const user = await user_repo.getUserByName(username)

        return {token: createLoginToken(store, user.id), secretKey: user.getDerivedKey(password)}
    })

    // DEBUG
    router.get("/api/whoami", async req => {
        const user = await getAuthenticatedUser(req, store, user_repo)

        return `Hello, ${user.name}. Your id is ${user.id}.`
    })

    // DEBUG
    router.get("/api/derivedKey/:id,:password", async req => {
        const id = parseInt(req.params.id)
        const password = req.params.password

        if (isNaN(id))
            throw RequestError.typeMismatch("id", "number")

        const user = await user_repo.getUserById(id)

        return user.getDerivedKey(password)
    })

    router.post("/api/secret/", async req => {
        const user = await getAuthenticatedUser(req, store, user_repo)
        const key = req.body.key

        if (key == null) throw RequestError.missingValue("key")

        return user.decryptSecret(key)
    })

    app.listen(PORT, () => {
        console.log(`Server running in port ${PORT}`)
    })
})()
