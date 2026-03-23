# Exchain – Frontend

## Overview

Exchain frontend is a modern, responsive web application built with React and TailwindCSS, providing an intuitive interface for managing money transfers, agents, and real-time tracking.

---

## Features

### User Features

* Signup & login (JWT + social authentication)
* Search and compare transfer services
* Initiate and track transfers in real-time
* Manage beneficiaries
* View transaction history
* Multi-currency support
* Notifications system
* Reviews and ratings

### Agent Features

* Register as an agent with automatic geolocation
* Manage cash-in / cash-out operations
* View transfer requests
* Track commissions

### Admin Features

* Manage users and agents
* Monitor transactions
* Platform control dashboard

---

## Real-Time Functionality

* Integrated with Laravel Reverb via PusherJS
* Live updates for:

  * Transfer status
  * Notifications
  * Agent activities

---

## Maps & Location

* Interactive maps using Leaflet
* Automatic location detection via browser
* Features:

  * Register agent location (latitude/longitude auto-detection)
  * Display nearby agents
  * Route and direction visualization

---

## Tech Stack

* React
* TailwindCSS
* PusherJS
* Leaflet
* Axios (API communication)

---

## Project Structure

```
src/
  components/
  pages/
  services/
  hooks/
  assets/
```

---

## Installation

### Prerequisites

* Node.js >= 18
* npm or yarn

### Setup

```bash
git clone https://github.com/dev-loves-code/Exchain-Frontend.git
cd Exchain-Frontend

npm install
npm run dev
```

---

## Environment Variables

Create a `.env` file:

```
VITE_API_URL=http://localhost:8000
VITE_PUSHER_KEY=your_key
VITE_PUSHER_CLUSTER=your_cluster
```

---

## UI & Design

* Responsive design using TailwindCSS
* Clean and modern interface
* Optimized UX for financial transactions

---

## Key Highlights

* Real-time UI updates
* Interactive map integration
* Seamless user experience
* Scalable component-based architecture

---

## Future Improvements

* Mobile app version
* Advanced filtering system
* UI animations and enhancements

.
