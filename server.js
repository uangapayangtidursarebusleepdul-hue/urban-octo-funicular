const http = require('http');
const express = require('express');
const { Server, Room } = require('colyseus');

const app = express();
const port = 2567;

// Logika Room Game Remi
class CardRoom extends Room {
    onCreate(options) {
        // Pakai customRoomId jika dikirim dari client Host
        if (options.customRoomId) {
            this.roomId = options.customRoomId;
        }
        
        console.log(`[SERVER] Room dibuat dengan ID: ${this.roomId}`);

        // Tangkap event saat pemain membuang kartu ke meja
        this.onMessage("play_card", (client, cardData) => {
            console.log(`[SERVER] Pemain ${client.sessionId} memainkan kartu:`, cardData);
            // Broadcast kartu ke pemain lain di room yang sama (selain pengirim)
            this.broadcast("card_played", cardData, { except: client });
        });
    }

    onJoin(client) {
        console.log(`[SERVER] Pemain ${client.sessionId} bergabung ke room: ${this.roomId}`);
    }

    onLeave(client) {
        console.log(`[SERVER] Pemain ${client.sessionId} keluar dari room: ${this.roomId}`);
    }
}

const server = http.createServer(app);
const gameServer = new Server({ server });

// Daftarkan nama room "card_room"
gameServer.define('card_room', CardRoom);

gameServer.listen(port, () => {
    console.log(`=================================`);
    console.log(`Server Colyseus Aktif!`);
    console.log(`Alamat: ws://localhost:${port}`);
    console.log(`=================================`);
});
