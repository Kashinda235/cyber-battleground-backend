# ⚔️ Cyber Battleground — Backend API

[![Docker](https://img.shields.io/badge/Docker-Ready-2496ED?style=flat&logo=docker&logoColor=white)](https://www.docker.com/)

> **Game engine and core API for Cyber Battleground** — Powering decision logic, multiplayer mechanics, network simulation, and real-time state management.

---

## 🌐 Overview

**Cyber Battleground** transforms cybersecurity education for beginners into an interactive multiplayer strategy RPG. The backend manages the game mechanics, handling attack/defense interactions between **Red** and **Blue** teams, NPC behaviors, state changes, and hidden system interactions across the network.

* **Frontend Repository:** [cyber-battleground-frontend]([https://github.com/Kashinda235/cyber-battleground-frontend](https://github.com/Kashinda235/cyber-battleground-frontend)

---

## ⚡ Core Responsibilities (Work in Progress)

* **Game Engine & Rules Logic:** Evaluates calculated risks, tactical moves, and network breaches.
* **Red vs. Blue Mechanics:** Manages team assignments, alliances, and resource allocation.
* **Dynamic World State:** Keeps track of network node ownership, active attacks, and defense states.
* **NPC Intelligence:** Drives dynamic NPC interactions and event triggers throughout the map.

---

## 🛠️ Tech Stack

* **Language / Runtime:** Node.js
* **Framework:** Express
* **Database:** PostgreSQL
* **WebSocket:** WS
* **Containerization:** Docker

---

## 🚀 Getting Started

### Prerequisites

* Node.js v22+
* [Docker](https://www.docker.com/) (optional, recommended)

### Local Development Setup

1. **Clone the repository:**
   ```bash
   git clone [https://github.com/Kashinda235/cyber-battleground-backend.git](https://github.com/Kashinda235/cyber-battleground-backend.git)
   cd cyber-battleground-backend

    ```

2. **Install dependencies:**
    ```bash
    npm install 
    
    ```


3. **Set up Environment Variables:**
Create a `.env` file in the root directory:
```env
PORT=8080
NODE_ENV=development
# Add your database/auth keys here

```


4. **Start the server:**
```bash
npm run dev

```


The backend API should be running on [http://localhost:8080](http://localhost:8080).

---

## 🐳 Running with Docker

To run the backend service in Docker:

```bash
# Build the image
docker build -t cyber-battleground-backend .

# Run the container
docker run -d -p 8080:8080 --name cyber-backend cyber-battleground-backend

```
---

## 🤝 Contributing & License

Contributions and suggestions are welcome! Distributed under the MIT License.

