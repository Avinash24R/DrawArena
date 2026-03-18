# Frontend Draw

A React-based frontend for a collaborative drawing application. It includes a lobby for players to join, a canvas for drawing, and a chat box for communication.

## Quick Start
1. Install dependencies:
   ```bash
   npm install
   ```
2. Start the development server:
   ```bash
   npm start
   ```  
---
## Project Structure
```
frontend_draw/
├── package.json
├── public/
│   └── index.html
└── src/
    ├── App.js
    ├── index.js
    ├── Components/
    │   ├── canvas/
    │   │   ├── canvas.jsx
    │   │   └── canvas.css
    │   ├── chat/
    │   │   ├── chatBox.jsx
    │   │   └── GussInput.jsx
    └── Pages/
        ├── Home/
        │   ├── home.jsx
        │   └── home.css
        └── Lobby/
            └── lobby.jsx

```