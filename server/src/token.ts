import { createHmac, timingSafeEqual } from "crypto";
import { fatalError } from "./utils";

const SECRET = process.env["SIGNATURE_SECRET"] ?? fatalError("SIGNATURE_SECRET must be in environment")

interface TokenHeader {
    typ?: "JWT"
    cty?: "JWT"
    alg: "none" | "HS256" | "HS384" | "HS512" | "RS256" | "RS384" | "RS512" | "ES256" | 
        "ES384" | "ES512" | "PS256" | "PS384" | "PS512"
}

interface TokenPayload {
    iss?: string
    sub?: string
    aud?: string
    exp?: number
    nbf?: number
    iat?: number
    jti?: string
}

export default class TokenStore {

    constructor() {}

    generate(/* subject: string,  */data: object): string {
        const header: TokenHeader = {
            alg: "HS256",
            typ: "JWT"
        }

        const payload: TokenPayload = {
            // sub: subject,
            iat: Date.now(),
            ...data
        }

        const headerEncoded = Buffer.from(JSON.stringify(header)).toString("base64url")
        const payloadEncoded = Buffer.from(JSON.stringify(payload)).toString("base64url")

        const signature = createHmac("sha256", SECRET).update(
            headerEncoded + "." + payloadEncoded).digest("base64url").replace("=", "")

        return [
            headerEncoded, 
            payloadEncoded,
            signature
        ].join(".")
    }

    validate(token: string): boolean {
        const [header, payload, signature] = token.split(".")

        const expectedSignature = createHmac("sha256", SECRET).update(
            header + "." + payload).digest("base64url").replace("=", "")

        if (expectedSignature.length != signature.length) return false

        return timingSafeEqual(Buffer.from(expectedSignature), Buffer.from(signature))
    }
}
