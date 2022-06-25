interface RequestOptions {
    sendCredentials?: boolean
}

export class API {
    credentials?: string

    constructor(public baseURL: string) {}

    async request(name: string, options?: RequestInit & RequestOptions) {
        const request = new URL(name, this.baseURL).href

        const fetchOptions: RequestInit = {
            headers: {
                'Content-Type': 'application/json'
            },
            ...options
        }

        if (options?.sendCredentials === true && this.credentials != null) {
            fetchOptions.headers = {
                "Authorization": "Bearer " + this.credentials,
                ...fetchOptions.headers
            }
        }
        
        const response = await fetch(request, fetchOptions)

        return JSON.parse(await response.text())
    }
}
