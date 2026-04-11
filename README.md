# VoyageAI 🏔️

**VoyageAI** is a high-fidelity, tactical travel intelligence platform specifically engineered for the Himalayan region. It integrates a state-of-the-art AI advisory command center, real-time geolocated social networking, and a proactive security intelligence matrix to ensure that modern voyagers can navigate the "Divine Terrain" with unparalleled safety and coordination.

---

## 🚀 Features

### 1. Tactical AI Advisory Terminal
*   **Context-Aware Expeditions:** Engage with a highly specialized AI trained in Himalayan logistics, local bureaucracy, and high-altitude protocol.
*   **Mission Log Persistence:** Multi-session memory allows explorers to jump between distinct planning threads seamlessly without losing conversational context.
*   **Discovery Anchoring:** Instantly extract geographical nodes from conversations and permanently anchor them into your expedition itinerary using the "Apply to Itinerary" protocol.

### 2. The Social Matrix (Geolocated Networking)
*   **Decentralized Cluster Creation:** Voyagers can establish ad-hoc network nodes anywhere on the global map grid with a single click.
*   **Auto-Scaling Frequencies:** Hub instances feature an intelligent saturation protocol—capping at 20 explorers per frequency to maintain communication clarity, automatically generating new instances as regions become saturated.
*   **Real-Time WebSocket Sync:** All cluster communications are powered by low-latency Socket.io integration, ensuring field intelligence is broadcasted instantly with visual sender attribution.

### 3. Scam Registry & Security Index
*   **Tactical Reporting:** A comprehensive database of regional hazards, filtered by security threat level (Critical, Alert, Minor).
*   **Verified Advisory:** Real-time briefings on AMS risks, TIMS card updates, and financial stability in high-altitude zones, culminating in a dedicated "Safety Terminal."
*   **Cultural Etiquette Modules:** Integrated intelligence on respecting local traditions and navigating sacred terrain.

### 4. Enterprise-Grade Dashboard Architecture
*   **Glassmorphism Aesthetic:** A deep slate and emerald visual identity that prioritizes contrast and data visualization.
*   **Streamlined Role Authorization:** Distinct administrative and voyager capabilities natively handled by robust backend middleware.

---

## 🛠️ Technology Stack

**Frontend Framework:** 
*   **Next.js (React)** 
*   **Tailwind CSS** (for precise, atomic styling)
*   **Framer Motion** (for kinetic user interfaces)
*   **Leaflet & React-Leaflet** (for the dynamic Social Matrix map)
*   **Lucide React** (high-fidelity tactical iconography)

**Backend Architecture:**
*   **Node.js / Express.js**
*   **MongoDB & Mongoose** (for persistent mission storage)
*   **Socket.io** (for real-time transmission synchrony)
*   **Google Gemini API** (for the contextual AI engine)
*   **JWT & bcrypt** (for tactical authentication)

---

## ⚙️ Installation & Operation

### Prerequisites
*   Node.js (v18+)
*   MongoDB Instance (Local or Atlas)
*   Google Gemini API Key

### 1. Clone the Repository
```bash
git clone https://github.com/lynx-fx/EternalBlue.git
cd EternalBlue
```

### 2. Backend Initialization (The Core)
```bash
cd server
npm install

# Create a .env file and configure your tactical variables:
# PORT=8000
# MONGODB_URI_LOCAL=mongodb://localhost:27017/voyageai
# GEMINI_API_KEY=your_key_here
# JWT_SECRET=your_secret_here
# FRONT_END_LOCAL=http://localhost:3000

# Start the Core Server
npm run dev
```

### 3. Frontend Initialization (The Dashboard)
```bash
cd client
npm install

# Start the Terminal Interface
npm run dev
```

### 4. Access the Matrix
Navigate your browser to `http://localhost:3000` to establish the initial link.

---

## 🛡️ Administrative Protocols

The platform natively supports administrative overrides for managing the **Scam Registry**. To elevate a voyager to administrative status, modify their user document directly within the database matrix to:
`role: "admin"`

---

## 🧭 Project Ethos
*"Take only pictures, leave only footprints, kill only time."* 

VoyageAI is designed not just to guide, but to protect—both the voyager and the magnificent terrain they traverse. Happy exploring.
