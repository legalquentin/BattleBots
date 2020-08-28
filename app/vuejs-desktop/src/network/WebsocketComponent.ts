import { EventEmitter } from 'events';
import { Component, Vue } from 'vue-property-decorator';

@Component
export default class WebsocketManager extends Vue {

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
            this.socket.send(JSON.stringify({ c: data, p: press }));
        }
    }

    public close(): void {
        if (this.socket) {
            console.log('Closing ws..');
            this.socket.close();
            return;
        }
        console.warn('[Warn] websocket was closed');
        
    }

    private isOpen(ws: WebSocket) { return ws.readyState === ws.OPEN; }
}