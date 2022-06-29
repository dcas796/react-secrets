import sqlite from "sqlite3";
import { throwWarning } from "./utils";

export default class AppDAO {
    db?: sqlite.Database

    constructor(private path: string) {}

    initialize() {
        return new Promise<void>((resolve, reject) => {
            this.db = new sqlite.Database(this.path, sqlite.OPEN_READWRITE | sqlite.OPEN_CREATE, err => {
                if (err == null) {
                    console.log(`Opened ${this.path} successfully`)
                    process.on("exit", async () => await this.close())
                    resolve()
                } else {
                    reject(`Could not open ${this.path}, reason: '${err.message}'`)
                }
            })
        })
    }

    run(sql: string, ...params: any[]) {
        return new Promise<void>((resolve, reject) => {
            this.db?.run(sql, params, err => {
                if (err) {
                    throwWarning(err.message)
                    reject(err.message)
                }
                resolve()
            })
        })
    }

    get(sql: string, ...params: any[]) {
        return new Promise<any>((resolve, reject) => {
            this.db?.get(sql, params, (err, row) => {
                if (err) {
                    throwWarning(err.message)
                    reject(err.message)
                }
                resolve(row)
            })
        })
    }

    all(sql: string, ...params: any[]) {
        return new Promise<any[]>((resolve, reject) => {
            this.db?.all(sql, params, (err, row) => {
                if (err) {
                    throwWarning(err.message)
                    reject(err.message)
                }
                resolve(row)
            })
        })
    }

    close() {
        return new Promise<void>((resolve, reject) => {
            this.db?.close(err => {
                if (err) {
                    throwWarning(err.message)
                    reject(err)
                }
                resolve()
            })
        })
    }
}
