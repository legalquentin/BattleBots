import { EventEmitter } from 'events';

export default class SocketService {

    private socket!: WebSocket;
    private listener: EventEmitter = new EventEmitter();

    /**
     * open a socket connection
     * @param url
     */
    public start(url: string) {
        this.socket = new WebSocket(url);
        this.socket.onopen = (event) => {
            this.listener.emit('open', event);
        }
        this.socket.onclose = (event) => {
            this.listener.emit('close', event);
        }
        this.socket.onmessage = (event) => {
            this.listener.emit('message', JSON.parse(event.data));
        }
        return this.socket;
    }

    public getEventListener() {
        return this.listener;
    }

    public send(data: number, press: boolean) {
        if (this.isOpen(this.socket)) {
            console.log('send input', data.toString(), press);
            this.socket.send(JSON.stringify({ c: data.toString(), p: press }));
        }
    }

    public close() {
        console.log('Closing ws..');
        this.socket.close();
    }

    private isOpen(ws: WebSocket) { return ws.readyState === ws.OPEN; }
}