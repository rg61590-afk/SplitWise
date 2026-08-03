# 💸 Splitwise Clone - Expense Sharing App

A full-stack expense sharing application inspired by Splitwise, built using the MERN stack (MongoDB, Express, React, Node.js). This app helps users manage shared expenses, track balances, and settle debts easily.

---

## 🚀 Features

### 👤 Authentication

* User Signup & Login (JWT-based authentication)
* Secure password hashing

### 👥 Friend System

* Send & accept friend requests
* View friends list

### 💰 Expense Management

* Add expenses (equal / unequal split)
* Attach notes & descriptions
* Group and individual expenses

### 📊 Balance Tracking

* Real-time balance updates
* "Who owes whom" summary
* Simplified debt calculation

### 🧾 Groups

* Create groups (Trips, Roommates, etc.)
* Add multiple users to a group
* Track group expenses

### 💸 Settlements

* Settle up debts manually
* Mark payments as completed

---

## 🛠️ Tech Stack

**Frontend**

* React.js
* Tailwind CSS
* Axios
* React Router

**Backend**

* Node.js
* Express.js

**Database**

* MongoDB (Mongoose ODM)

**Authentication**

* JSON Web Tokens (JWT)
* bcrypt.js

---

## 📁 Project Structure

```
splitwise-clone/
│
├── backend/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   └── server.js
│
├── frontend/
│   ├── components/
│   ├── pages/
│   ├── context/
│   └── App.js
│
└── README.md
```

---

## ⚙️ Installation & Setup

### 1️⃣ Clone the repository

```bash
git clone https://github.com/your-username/splitwise-clone.git
cd splitwise-clone
```

### 2️⃣ Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file:

```
PORT=5000
MONGO_URI=your_mongodb_connection
JWT_SECRET=your_secret_key
```

Run backend:

```bash
npm run dev
```

---

### 3️⃣ Frontend Setup

```bash
cd frontend
npm install
npm start
```

---

## 🔗 API Endpoints (Sample)

### Auth

* `POST /api/auth/register`
* `POST /api/auth/login`

### Friends

* `POST /api/friends/request`
* `POST /api/friends/accept`

### Expenses

* `POST /api/expenses/add`
* `GET /api/expenses`

### Groups

* `POST /api/groups/create`
* `GET /api/groups`

---

## 🧠 Future Enhancements

* 📱 Mobile app (React Native)
* 💳 Payment integration (UPI, Stripe)
* 📈 Expense analytics dashboard
* 🔔 Notifications system
* 🌐 Multi-currency support

---

## 🤝 Contributing

Contributions are welcome!
Feel free to fork the repo and submit a pull request.

---

## 📜 License

This project is licensed under the MIT License.

---

## 👨‍💻 Author

Rohit Gurjar
MERN Stack Developer

---

## ⭐ Support

If you like this project, give it a ⭐ on GitHub!
