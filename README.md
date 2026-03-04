# 🪐 Newton's Arena

A full-stack, physics-based interactive web application featuring real-time kinematics, collision detection, and a global MongoDB leaderboard. 

## 🚀 Features

* **Custom Physics Engine:** Engineered using **HTML5 Canvas** to calculate real-time gravity, velocity, and dynamic object rendering at 60 FPS.
* **Global Leaderboard System:** Implemented a scalable **RESTful API** to process, sort, and serve the Top 10 player scores globally.
* **Full-Stack Architecture:** Designed seamless asynchronous communication between a **React.js** frontend and a **Node.js/Express** backend.
* **Persistent Cloud Data:** Integrated **MongoDB Atlas** via **Mongoose** for secure, long-term storage of user session data and high scores.

## 🛠️ Tech Stack

* **Frontend:** React.js (Vite), HTML5 Canvas, CSS3
* **Backend:** Node.js, Express.js, CORS, dotenv
* **Database:** MongoDB Atlas, Mongoose

## 💻 Running Locally

To run this project on your local machine, you will need Node.js and a MongoDB cluster.

### 1. Clone the repository
\`\`\`bash
git clone https://github.com/JG-Zun/newtons-arena.git
cd newtons-arena
\`\`\`

### 2. Setup the Backend
\`\`\`bash
cd backend
npm install
\`\`\`
* Create a `.env` file in the `backend` directory.
* Add your MongoDB connection string: `MONGO_URI=your_mongodb_connection_string`
* Start the server: `node server.js` (Runs on http://localhost:5001)

### 3. Setup the Frontend
Open a new terminal tab:
\`\`\`bash
cd frontend
npm install
npm run dev
\`\`\`
* The React application will be running on `http://localhost:5173`.

## 🧠 Future Roadmap
* Implement varying mass and elastic collision between spawned objects.
* Add user authentication (JWT) for secure player profiles.
* Deploy frontend via AWS CloudFront and backend via Render/Heroku.