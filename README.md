# 🚀 Crypto Dashboard with AI Chat Assistant

A modern, full-stack MERN application that displays real-time cryptocurrency data with an intelligent chat assistant for natural language queries. Built with cutting-edge technologies and featuring a sleek dark-themed trading interface.

![Node.js](https://img.shields.io/badge/Node.js-18.x-green)
![React](https://img.shields.io/badge/React-19.1-blue)
![MongoDB](https://img.shields.io/badge/MongoDB-6.x-brightgreen)
![Express](https://img.shields.io/badge/Express-5.1-lightgrey)
![License](https://img.shields.io/badge/license-MIT-blue)

---

## 📋 Table of Contents

- [Features](#-features)
- [Tech Stack](#️-tech-stack)
- [Project Structure](#-project-structure)
- [Prerequisites](#-prerequisites)
- [Installation](#-installation)
- [Environment Variables](#-environment-variables)
- [API Documentation](#-api-documentation)
- [Usage](#-usage)
- [Deployment](#-deployment)
- [Contributing](#-contributing)
- [License](#-license)

---

## ✨ Features

### 🎯 Core Features

- **Real-time Cryptocurrency Data**
  - Live prices for top 100 cryptocurrencies
  - Market cap, volume, and 24h price changes
  - Automatic updates every 5 minutes via cron jobs
  - Data sourced from CoinGecko API

- **Interactive Trading Charts**
  - Professional Chart.js visualizations
  - Multiple timeframes (1D, 7D, 30D, 90D, 1Y)
  - Real-time price updates with gradient fills
  - Smooth animations and hover effects

- **Market Overview Panel**
  - Live market data with sortable columns
  - Quick navigation between coins
  - Color-coded price changes
  - Real-time market status indicator
  - Compact trading-style layout

- **AI Chat Assistant**
  - Natural language query processing
  - Price inquiries ("What's the price of Bitcoin?")
  - Trend analysis ("Show me 7-day trend of ETH")
  - Market comparisons ("Top 5 coins by volume")
  - Floating chat button with smooth animations

### 🔐 Authentication & User Management

- **User Authentication**
  - Secure JWT-based authentication
  - Login and registration with validation
  - Password strength indicator
  - Protected routes
  - Session persistence

- **Favorites System**
  - Save favorite cryptocurrencies
  - Toggle between all coins and favorites
  - Persistent storage in MongoDB
  - Real-time UI updates

### 🎨 UI/UX Features

- **Modern Dark Theme**
  - TradingView-inspired design (#131722 background)
  - Smooth animations and transitions
  - Responsive layout for all devices
  - Professional color scheme with blue accents

- **Smart Components**
  - Loading states with animated spinners
  - Toast notifications for user feedback
  - Error boundaries for graceful error handling
  - Optimized performance with React hooks

### ⚡ Performance & Optimization

- **Caching Strategy**
  - In-memory caching with 5-minute TTL
  - Reduced API calls to CoinGecko
  - Optimized database queries

- **Security**
  - Helmet.js for secure headers
  - CORS configuration
  - Rate limiting on API endpoints
  - Password hashing with bcryptjs
  - JWT token authentication

---

## 🛠️ Tech Stack

### Backend

| Technology | Purpose | Version |
|------------|---------|---------|
| **Node.js** | Runtime environment | 18.x |
| **Express.js** | Web framework | 5.1.x |
| **MongoDB** | NoSQL database | 6.x |
| **Mongoose** | MongoDB ODM | 8.x |
| **Axios** | HTTP client | 1.12.x |
| **node-cron** | Scheduled jobs | 4.2.x |
| **node-cache** | In-memory caching | 5.1.x |
| **JWT** | Authentication | 9.0.x |
| **bcryptjs** | Password hashing | 3.0.x |
| **Helmet** | Security headers | 8.1.x |
| **Morgan** | HTTP logger | 1.10.x |

### Frontend

| Technology | Purpose | Version |
|------------|---------|---------|
| **React** | UI library | 19.1.x |
| **Vite** | Build tool | 7.1.x |
| **React Router** | Client-side routing | 7.9.x |
| **Axios** | HTTP client | 1.12.x |
| **Chart.js** | Data visualization | 4.5.x |
| **react-chartjs-2** | React Chart.js wrapper | 5.3.x |
| **Tailwind CSS** | Utility-first CSS | 4.1.x |
| **Lucide React** | Icon library | 0.546.x |
| **date-fns** | Date formatting | 4.1.x |
| **React Hot Toast** | Notifications | 2.6.x |

---

## 📁 Project Structure

```
crypto-dashboard/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   ├── database.js          # MongoDB connection
│   │   │   └── constants.js         # Configuration constants
│   │   ├── models/
│   │   │   ├── Crypto.js            # Cryptocurrency schema
│   │   │   ├── HistoricalPrice.js   # Historical data schema
│   │   │   └── User.js              # User schema
│   │   ├── services/
│   │   │   ├── coinGeckoService.js  # CoinGecko API integration
│   │   │   ├── chatService.js       # Chat assistant logic
│   │   │   └── cacheService.js      # Caching mechanism
│   │   ├── controllers/
│   │   │   ├── cryptoController.js  # Crypto endpoints
│   │   │   ├── chatController.js    # Chat endpoints
│   │   │   └── authController.js    # Auth endpoints
│   │   ├── routes/
│   │   │   ├── cryptoRoutes.js      # Crypto API routes
│   │   │   ├── chatRoutes.js        # Chat API routes
│   │   │   └── authRoutes.js        # Auth API routes
│   │   ├── middleware/
│   │   │   ├── errorHandler.js      # Global error handling
│   │   │   └── auth.js              # JWT authentication
│   │   ├── jobs/
│   │   │   └── cryptoDataFetcher.js # Cron job for data updates
│   │   ├── utils/
│   │   │   └── logger.js            # Logging utility
│   │   └── app.js                   # Express app setup
│   ├── .env
│   ├── .env.example
│   ├── package.json
│   └── server.js                    # Entry point
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Dashboard/
│   │   │   │   ├── TrendChart.jsx       # Main chart component
│   │   │   │   ├── MarketOverview.jsx   # Market list panel
│   │   │   │   └── CryptoTable.jsx      # Crypto data table
│   │   │   ├── Chat/
│   │   │   │   ├── ChatAssistantButton.jsx # Floating chat button
│   │   │   │   ├── ChatPanel.jsx        # Chat interface
│   │   │   │   ├── ChatMessage.jsx      # Message component
│   │   │   │   └── ChatInput.jsx        # Input field
│   │   │   └── Common/
│   │   │       ├── Header.jsx           # Navigation header
│   │   │       ├── Loader.jsx           # Loading spinner
│   │   │       ├── ErrorMessage.jsx     # Error display
│   │   │       └── ProtectedRoute.jsx   # Route protection
│   │   ├── pages/
│   │   │   ├── DashboardPage.jsx    # Main dashboard
│   │   │   ├── LoginPage.jsx        # Login page
│   │   │   └── RegisterPage.jsx     # Registration page
│   │   ├── services/
│   │   │   ├── api.js               # Axios configuration
│   │   │   ├── cryptoService.js     # Crypto API calls
│   │   │   ├── chatService.js       # Chat API calls
│   │   │   └── authService.js       # Auth API calls
│   │   ├── context/
│   │   │   └── AuthContext.jsx      # Auth state management
│   │   ├── utils/
│   │   │   ├── formatters.js        # Number/date formatting
│   │   │   └── constants.js         # Frontend constants
│   │   ├── App.jsx                  # Main app component
│   │   └── main.jsx                 # Entry point
│   ├── .env
│   ├── .env.example
│   ├── package.json
│   ├── tailwind.config.js
│   └── vite.config.js
│
└── README.md
```

---

## 📦 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18.x or higher) - [Download](https://nodejs.org/)
- **MongoDB** (v6.x or higher) - [Download](https://www.mongodb.com/try/download/community)
  - Or use MongoDB Atlas (cloud database)
- **npm** or **yarn** package manager
- **Git** - [Download](https://git-scm.com/)

---

## 🚀 Installation

### 1. Clone the Repository

```bash
git clone https://github.com/SuchitHubale/crypto-dashboard.git
cd crypto-dashboard
```

### 2. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Create .env file from example
cp .env.example .env

# Edit .env file with your configuration
# (See Environment Variables section below)

# Start the server
npm start        # Production
npm run dev      # Development with nodemon
```

The backend server will run on `http://localhost:5000`

### 3. Frontend Setup

```bash
# Navigate to frontend directory (from project root)
cd frontend

# Install dependencies
npm install

# Create .env file from example
cp .env.example .env

# Edit .env file with your configuration
# (See Environment Variables section below)

# Start the development server
npm run dev

# Build for production
npm run build
```

The frontend will run on `http://localhost:3000`

---

## 🔐 Environment Variables

### Backend (.env)

Create a `.env` file in the `backend` directory:

```env
# Server Configuration
NODE_ENV=development
PORT=5000

# Database
MONGO_URL=mongodb://localhost:27017/crypto-dashboard
# Or use MongoDB Atlas:
# MONGO_URL=mongodb+srv://username:password@cluster.mongodb.net/crypto-dashboard

# CoinGecko API
COINGECKO_API_URL=https://api.coingecko.com/api/v3
COINGECKO_API_KEY=your_api_key_here_optional

# Cache Configuration (in seconds)
CACHE_TTL=300

# Cron Schedule (every 5 minutes)
CRON_SCHEDULE=*/5 * * * *

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_change_in_production
JWT_EXPIRE=7d

# CORS
FRONTEND_URL=http://localhost:3000
```

### Frontend (.env)

Create a `.env` file in the `frontend` directory:

```env
# API Configuration
VITE_API_URL=http://localhost:5000/api
```

---

## 📡 API Documentation

### Base URL

```
http://localhost:5000/api
```

### Cryptocurrency Endpoints

#### Get Top Cryptocurrencies

```http
GET /crypto/top/:count
```

**Parameters:**
- `count` (optional): Number of coins to fetch (default: 10, max: 100)

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "coinId": "bitcoin",
      "symbol": "btc",
      "name": "Bitcoin",
      "currentPrice": 45000,
      "marketCap": 850000000000,
      "totalVolume": 25000000000,
      "priceChange24h": 1200,
      "priceChangePercentage24h": 2.5,
      "image": "https://...",
      "marketCapRank": 1
    }
  ]
}
```

#### Get Specific Coin Details

```http
GET /crypto/:coinId
```

**Example:**
```http
GET /crypto/bitcoin
```

#### Get Historical Data

```http
GET /crypto/:coinId/history?days=30
```

**Parameters:**
- `days`: Number of days (1, 7, 30, 90, 365)

**Response:**
```json
{
  "success": true,
  "prices": [
    {
      "date": "2025-01-01T00:00:00.000Z",
      "price": 45000
    }
  ]
}
```

#### Manually Refresh Data

```http
POST /crypto/refresh
```

### Chat Assistant Endpoints

#### Process Query

```http
POST /chat/query
```

**Request Body:**
```json
{
  "message": "What is the price of Bitcoin?"
}
```

**Response:**
```json
{
  "success": true,
  "response": "The current price of Bitcoin is $45,000."
}
```

### Authentication Endpoints

#### Register User

```http
POST /auth/register
```

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securePassword123"
}
```

#### Login User

```http
POST /auth/login
```

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "securePassword123"
}
```

**Response:**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "123",
    "name": "John Doe",
    "email": "john@example.com"
  }
}
```

#### Get Current User (Protected)

```http
GET /auth/me
```

**Headers:** `Authorization: Bearer <token>`

#### Add Favorite Coin (Protected)

```http
POST /auth/favorites
```

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "coinId": "bitcoin"
}
```

#### Remove Favorite Coin (Protected)

```http
DELETE /auth/favorites/:coinId
```

**Headers:** `Authorization: Bearer <token>`

---

## 💡 Usage

### 1. Start the Application

```bash
# Terminal 1 - Start Backend
cd backend
npm start

# Terminal 2 - Start Frontend
cd frontend
npm run dev
```

### 2. Access the Application

Open your browser and navigate to:
```
http://localhost:3000
```

### 3. Using the Dashboard

**View Cryptocurrency Data:**
- Browse real-time prices for top cryptocurrencies
- Click on any coin to view detailed charts
- Use the time period selector (1D, 7D, 30D, etc.)

**Market Overview:**
- View live market data in the sidebar
- Click coins to switch chart view
- Monitor price changes with color indicators

**AI Chat Assistant:**
- Click the floating chat button (💬) in the bottom-right
- Ask natural language questions:
  - "What's the price of Bitcoin?"
  - "Show me Ethereum's trend"
  - "Top 5 coins by market cap"
- Use quick action buttons for common queries

**Refresh Data:**
- Click the "Refresh" button to manually update data
- Automatic updates occur every 5 minutes

---

## 🚢 Deployment

### Backend Deployment (Render/Railway/Heroku)

1. Push your code to GitHub
2. Connect your repository to your hosting service
3. Set environment variables in the dashboard
4. Deploy

**Environment Variables to Set:**
- `NODE_ENV=production`
- `MONGO_URL=<your-mongodb-atlas-url>`
- `JWT_SECRET=<your-secret-key>`
- `FRONTEND_URL=<your-frontend-url>`

### Frontend Deployment (Vercel/Netlify)

```bash
cd frontend
npm run build

# Deploy the dist/ folder to Vercel/Netlify
```

Or connect your GitHub repository directly for automatic deployments.

**Environment Variables to Set:**
- `VITE_API_URL=<your-backend-url>/api`

### Database (MongoDB Atlas)

1. Create a [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) account
2. Create a new cluster (free tier available)
3. Create a database user
4. Whitelist IP addresses (or allow from anywhere for development)
5. Get connection string
6. Update `MONGO_URL` in backend `.env`

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- [CoinGecko API](https://www.coingecko.com/en/api) for cryptocurrency data
- [Chart.js](https://www.chartjs.org/) for beautiful charts
- [Tailwind CSS](https://tailwindcss.com/) for styling
- [Lucide Icons](https://lucide.dev/) for icons
- [React Hot Toast](https://react-hot-toast.com/) for notifications

---

## 📞 Support

If you have any questions or issues:

- Check the [Issues](https://github.com/SuchitHubale/crypto-dashboard/issues) page
- Create a new issue if your problem isn't already listed
- Contact: suchithubale@gmail.com

---

## 🔮 Future Enhancements

- [ ] Real-time WebSocket updates
- [ ] Portfolio tracking
- [ ] Price alerts and notifications
- [ ] Social features (comments, likes)
- [ ] Advanced technical indicators
- [ ] Mobile app (React Native)
- [ ] Multi-language support
- [ ] Dark/Light theme toggle
- [ ] Advanced AI chat with GPT integration
- [ ] Export data to CSV/PDF

---

Made with ❤️ by [Suchit](https://github.com/SuchitHubale)

⭐ Star this repo if you found it helpful!