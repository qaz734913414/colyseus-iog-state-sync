import * as path from 'path';
import * as express from 'express';
import * as serveIndex from 'serve-index';
import { createServer } from 'http';
import { Server } from 'colyseus';
import { monitor } from '@colyseus/monitor';

// Import demo room handlers
import { GameRoom as ExampleRoom } from "./Games/Example/GameRoom";
import { GameRoom as ExampleBodiesRoom } from './Games/ExampleBodies/GameRoom';
import { GameRoom as BattleGroundRoom } from './Games/BattleGround/GameRoom';


const port = Number(process.env.PORT || 2567);
const app = express();

// Attach WebSocket Server on HTTP Server.
const gameServer = new Server({
  server: createServer(app)
});

gameServer.register("ExampleRoom", ExampleRoom);

gameServer.register("ExampleBodiesRoom", ExampleBodiesRoom);
gameServer.register("BattleGroundRoom", BattleGroundRoom);

app.use('/', express.static(path.join(__dirname, "static")));
app.use('/', serveIndex(path.join(__dirname, "static"), {'icons': true}))

// (optional) attach web monitoring panel
app.use('/colyseus', monitor(gameServer));

gameServer.onShutdown(function(){
  console.log(`game server is going down.`);
});

gameServer.listen(port);
console.log(`Listening on http://localhost:${ port }`);
