import crypto from "crypto"
import { decrypt, encrypt, hmac } from "./crypto"
import { AuthError } from "./utils"

const DERIVED_KEY_LENGTH = 32

export interface RawUser {
    id: number
    name: string
    password: string
    secret: string
}

export interface IUser {
    id: number,
    name: string,
    password_hash: string,
    password_salt: string,
    encrypted_secret: string,
    encrypted_secret_iv: string,
    derived_key_salt: string
}

// https://stackoverflow.com/questions/56121589/typescript-check-an-object-has-all-interface-properties
export namespace IUser {
    const schema: Record<keyof IUser, string> = {
        id: "number",
        name: "string",
        password_hash: "string",
        password_salt: "string",
        encrypted_secret: "string",
        encrypted_secret_iv: "string",
        derived_key_salt: "string"
    };

    export function hasProperties(input: any): input is IUser {
        const missingProperties = Object.keys(schema)
            .filter(key => input[key] === undefined)
            .map(key => key as keyof RawUser)

        return missingProperties.length == 0
    }
}

export class User implements IUser {
    private constructor(
        public id: number,
        public name: string,
        public password_hash: string,
        public password_salt: string,
        public encrypted_secret: string,
        public encrypted_secret_iv: string,
        public derived_key_salt: string
    ) {}

    static fromRawUser(user: RawUser): User {
        const passwordSalt = crypto.randomBytes(16)
        const derivedKeySalt = crypto.randomBytes(16)
        
        const derivedKey = crypto.scryptSync(user.password, derivedKeySalt, DERIVED_KEY_LENGTH)
    
        const encryptedSecret = encrypt(Buffer.from(user.secret), derivedKey)
    
        return User.from({
            id: user.id,
            name: user.name,
            password_hash: hmac(user.password, passwordSalt).toString("base64url"),
            password_salt: passwordSalt.toString("base64url"),
            encrypted_secret: encryptedSecret.content.toString("base64url"),
            encrypted_secret_iv: encryptedSecret.iv.toString("base64url"),
            derived_key_salt: derivedKeySalt.toString("base64url")
        })
    }

    static from(o: IUser): User {
        return new User(
            o.id,
            o.name,
            o.password_hash,
            o.password_salt,
            o.encrypted_secret,
            o.encrypted_secret_iv,
            o.derived_key_salt
        )
    }

    static fromAny(o: any): User | null {
        if (IUser.hasProperties(o)) {
            return User.from(o)
        }
        return null
    }

    validate(password: string): boolean {
        const passwordSalt = Buffer.from(this.password_salt, "base64url")
        const hashedPassword = hmac(password, passwordSalt)
        const passwordHash = Buffer.from(this.password_hash, "base64url")
        return crypto.timingSafeEqual(passwordHash, hashedPassword)
    }

    getDerivedKey(password: string): string {
        if (!this.validate(password)) throw AuthError.invalidPassword()

        const derivedKeySalt = Buffer.from(this.derived_key_salt, "base64url")
        const derivedKey = crypto.scryptSync(
            password, derivedKeySalt, DERIVED_KEY_LENGTH)

        return derivedKey.toString("base64url")
    }

    decryptSecret(derivedKey: string): string {
        const content = Buffer.from(this.encrypted_secret, "base64url")
        const iv = Buffer.from(this.encrypted_secret_iv, "base64url")
        const key = Buffer.from(derivedKey, "base64url")

        return decrypt({ content, iv }, key).toString()
    }
}

export const defaultUsers = [
    {
        id: 0,
        name: "user0",
        password: "password0",
        secret: "secret0"
    },
    {
        id: 1,
        name: "user1",
        password: "password1",
        secret: "secret1"
    },
    {
        id: 2,
        name: "user2",
        password: "password2",
        secret: "secret2"
    }
].map(User.fromRawUser)
