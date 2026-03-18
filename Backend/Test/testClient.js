const { io } = require("socket.io-client")

console.log("Starting client...")

const socket = io("http://localhost:5000", {
  transports: ["websocket"],   // force websocket only
  upgrade: false
})

socket.on("connect", () => {
  console.log("✅ CONNECTED:", socket.id)

  socket.emit("create_room", {
    playername: "TestPlayer"
  })
})

socket.on("connect_error", (err) => {
  console.log("❌ CONNECT ERROR:", err.message)
})

socket.on("disconnect", (reason) => {
  console.log("Disconnected:", reason)
})

socket.onAny((event, ...args) => {
  console.log("Event:", event, args)
})