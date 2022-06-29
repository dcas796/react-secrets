import crypto from "crypto"

const DEFAULT_ALGO = "aes-256-ctr"

export interface Hash {
    content: Buffer,
    iv: Buffer
}

export const encrypt = (message: Buffer, key: Buffer, algorithm: string = DEFAULT_ALGO): Hash => {
    const iv = crypto.randomBytes(16)
    
    const cipher = crypto.createCipheriv(algorithm, key, iv)

    const content = Buffer.concat([cipher.update(message), cipher.final()])

    return { iv, content }
}

export const decrypt = (hash: Hash, key: Buffer, algorithm: string = DEFAULT_ALGO): Buffer => {
    const decipher = crypto.createDecipheriv(algorithm, key, hash.iv)

    return Buffer.concat([decipher.update(hash.content), decipher.final()])
}

export const hmac = (input: crypto.BinaryLike, key: Buffer): Buffer => {
    return crypto.createHmac("sha256", key).update(input).digest()
}

