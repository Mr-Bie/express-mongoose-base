const logger = require("./logger.service");

class WebSocketService {
  port = process.env.APP_WS_PORT;
  socket;
  constructor() {
    const socketServer = require("http").createServer();
    const io = require("socket.io")(socketServer, {
      cors: {
        origin: "*",
        methods: ["GET", "POST"],
      },
    });
    this.socket = io;
    logger.info(`web socket is listening on port ${this.port}`);
    io.on("connection", (socket) => {
      logger.info("client connected to web socket");
    });
    io.listen(this.port);
  }

  emit(messagePattern, message) {
    this.socket.emit(messagePattern, message);
  }
}

const webSocketServiceInstance = new WebSocketService();

module.exports = webSocketServiceInstance;
