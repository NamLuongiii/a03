// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
export  enum WSEvents {
    JOIN_ROOM = "join_room",
    LEAVE_ROOM = "leave_room",
    MESSAGE = "message",
    FINISH = "finish",
    USERS_IN_ROOM = "users_in_room",
    REQUEST = "request",
}

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
export enum WSRequest {
    RAISE_HAND = 1,
    HAPPY = 2,
    SAD = 3,
    ANGRY = 4,
    LAUGHING = 5,
}

export  class WebsocketService {
    static ws: WebSocket | null = null
    static dispatchEvents: { [key: string]: <T>(data: T) => void} = {}

    constructor() {}

    static getInstance() {
        if (!this.ws) {
            const jwtToken = localStorage.getItem('access_token')

            const WS_URL = import.meta.env.VITE_API_SOCKET_URL
            this.ws = new WebSocket(`${WS_URL}/ws?token=${jwtToken}`);

            this.ws?.addEventListener('message', event => {
                const data: { event: WSEvents, data: string} = JSON.parse(event.data);
                if (this.dispatchEvents[data.event]) {
                    this.dispatchEvents[data.event](data.data);
                }
            })
        }
    }

    static open(callback: () => void) {
        this.ws?.addEventListener('open', () => {
            console.log('websocket opened')
            callback()
        })
    }

    static error(callback: (error: Event) => void) {
        this.ws?.addEventListener('error', (event) => callback(event))
    }

    static close() {
        console.log('websocket closed')
        this.ws?.close()
        this.ws = null
    }

    static onMessage<T>(event: WSEvents, callback: (data: T) => void) {
        this.dispatchEvents[event] = callback as <T>(data: T) => void
    }

    static send<T>(event: WSEvents, message: T) {
        if (this.ws?.readyState === WebSocket.OPEN)
        this.ws?.send(JSON.stringify({
            event: event,
            data: message
        }))
    }

}
