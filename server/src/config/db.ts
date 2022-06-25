import sqlite from "sqlite3";
import path from "path"

const DATABASE_PATH = path.resolve("secrets.db")
console.log({DATABASE_PATH})

const db = new sqlite.Database(DATABASE_PATH, sqlite.OPEN_READWRITE | sqlite.OPEN_CREATE, err => {
    if (err == null) {
        createDatabase()
        console.log(`Opened ${DATABASE_PATH} successfully`)
    } else {
        console.error(`Could not open ${DATABASE_PATH}, reason: ${err!.message}`)
        process.exit(1)
    }
})

export interface User {
    id: number
    name: string
    password_hash: string
    encrypted_secret: string
}

const users: User[] = [
    {id: 0, name: "admin", password_hash: "", encrypted_secret: ""},
    {id: 1, name: "user1", password_hash: "", encrypted_secret: ""},
    {id: 2, name: "user2", password_hash: "", encrypted_secret: ""}
]

export function createDatabase(): sqlite.Database {
    const db = new sqlite.Database(DATABASE_PATH, err => {
        if (err != null) {
            console.error(`Could not create ${DATABASE_PATH}, reason: ${err!.message}`)
            process.exit(1)
        }
    })

    // Check if the database is already created
    var isTableCreated = false
    db.all(`
    select * from information_schema.tables 
    where table_schema = 'dbo'
    and table_name = 'users'
    `, (err, rows) => {
        if (err) return
        if (rows.length > 0) isTableCreated = true
    })
    if (isTableCreated) return db

    // Create database
    db.exec(`
    create table users (
        id int primary key not null,
        name text not null,
        password_hash text not null,
        encrypted_secret text not null
    );
    `, err => console.log(err))

    // Populate with example users
    var db_values = ""
    users.forEach((user, index) => {
        db_values += `(${user.id}, '${user.name}', '${user.password_hash}', '${user.encrypted_secret}')`
        if (index == users.length - 1) db_values += ";"
        else db_values += ", "
    })

    db.exec(`
    insert into users (id, name, password_hash, encrypted_secret)
        values ${db_values}
    `, err => console.log(err))

    return db
} 

export default db;
