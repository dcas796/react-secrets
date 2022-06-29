import AppDAO from "./dao";
import { AuthError } from "./utils";
import { defaultUsers, User } from "./user";

class RepositoryError extends Error {
    private constructor(public message: string) {
        super()
    }

    static invalidId(id: number) {
        return new RepositoryError(`User with id ${id} does not exist.`)
    }
}

export default class UserRepository {
    constructor(public dao: AppDAO) {
        // TODO: In final release, remove this
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
            password_salt text not null,
            encrypted_secret text not null,
            encrypted_secret_iv text not null,
            derived_key_salt text not null
        );
        `)

        console.log("Populating repository")
    
        // Populate with example users
        for (var user of defaultUsers) {
            await this.store(user)
        }
    }

    async store(user: User) {
        await this.dao.run(
            `insert into users ( \
                id, name, password_hash, password_salt, \
                encrypted_secret, encrypted_secret_iv, derived_key_salt )
                values (?, ?, ?, ?, ?, ?, ?);`, 
            user.id, user.name, user.password_hash, user.password_salt, 
            user.encrypted_secret, user.encrypted_secret_iv, user.derived_key_salt)
    }

    async validate(username: string, password: string): Promise<boolean> {
        const user = await this.getUserByName(username)
        return user.validate(password)
    }

    async delete(user: User) {
        await this.dao.run("delete from users where id = ?", user.id)
    }

    async getUserById(id: number): Promise<User> {
        const value = User.fromAny(await this.dao.get("select * from users where id = ?", id))
        if (value == null) throw RepositoryError.invalidId(id)
        return value
    }

    async getUserByName(name: string): Promise<User> {
        const value = User.fromAny(await this.dao.get("select * from users where name = ?", name))
        if (value == null) throw AuthError.invalidUsernameOrPassword()
        return value
    }
}
