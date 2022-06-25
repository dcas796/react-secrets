import AppDAO from "./dao";
import crypto, { timingSafeEqual } from "crypto";
import { Result, ResultType } from "./utils";

export interface User {
    id: number
    name: string
    password_hash: string
    encrypted_secret: string
}

const sha = (input: string) => { 
    return crypto.createHash("sha256").update(input).digest("base64")
}

const default_users: User[] = [
    {id: 0, name: "admin", password_hash: sha("password"), encrypted_secret: ""},
    {id: 1, name: "user1", password_hash: sha("12345678"), encrypted_secret: ""},
    {id: 2, name: "user2", password_hash: sha("plzdonthack"), encrypted_secret: ""}
]

class RepositoryError extends Error {
    private constructor(public message: string) {
        super()
    }

    static invalidId(id: number) {
        return new RepositoryError(`User with id ${id} does not exist.`)
    }

    static invalidUsernameOrPassword() {
        return new RepositoryError(`Wrong username or password`)
    }
}

export default class UserRepository {
    constructor(public dao: AppDAO) {
        this.createTable()
    }

    async createTable() {
        console.log("Creating user repository")
        // Create database
        // DEBUG
        await this.dao.run(`drop table if exists users;`)

        await this.dao.run(`
        create table users (
            id int primary key not null,
            name text not null,
            password_hash text not null,
            encrypted_secret text not null
        );
        `)

        console.log("Populating repository")
    
        // Populate with example users
        for (var user of default_users) {
            await this.create(user)
        }
    }

    async create(user: User) {
        console.log(`Creating user: ${user}`)

        await this.dao.run(
            `insert into users (id, name, password_hash, encrypted_secret) 
                values (?, ?, ?, ?);`, 
                user.id, user.name, user.password_hash, user.encrypted_secret)
    }

    async validate(username: string, password: string): Promise<boolean> {
        const result = await this.getUserByName(username)
        if (result.type == ResultType.error) return false
        const user = result.value as User 
        const passwordDigest = sha(password)
        return timingSafeEqual(Buffer.from(passwordDigest), Buffer.from(user.password_hash))
    }

    async delete(user: User) {
        await this.dao.run("delete from users where id = ?", user.id)
    }

    async getUserById(id: number): Promise<Result<User>> {
        try {    
            const value = await this.dao.get("select * from users where id = ?", id) as User
            if (value == null) return Result.error(RepositoryError.invalidId(id))
            return Result.success(value)
        } catch (error) {
            return Result.error(error as Error)
        }
    }

    async getUserByName(name: string): Promise<Result<User>> {
        try {
            const value = await this.dao.get("select * from users where name = ?", name) as User
            if (value == null) return Result.error(RepositoryError.invalidUsernameOrPassword())
            return Result.success(value)
        } catch (error) {
            return Result.error(error as Error)
        }
    }
}
