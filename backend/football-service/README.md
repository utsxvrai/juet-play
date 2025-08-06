# 🧪 Mongoose Backend Boilerplate

A minimal and scalable Node.js + Express.js backend setup using **MongoDB** and **Mongoose**, following best practices.

---

## 📂 Folder Structure

```
.
├── src/
│   ├── config/
│   ├── controllers/
│   ├── middlewares/
│   ├── models/
│   ├── routes/
│   ├── services/
│   └── index.js
├── .env
├── package.json
└── README.md
```

---

## 🚀 Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Create a `.env` file in the root

```env
PORT=3000
MONGODB_URI=mongodb://localhost:27017/your-db-name
# Or use MongoDB Atlas
# MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/your-db-name
```

### 3. Run the server

```bash
npm run dev
```

---

## ✅ Features

- Mongoose model structure
- Modular route/controller/service pattern
- Environment config via `.env`
- Error-handling middleware
- Ready for REST APIs

---

## 🔧 Customization

- Add new models inside `src/models/`
- Register new routes inside `src/routes/index.js`
- Create controllers/services accordingly

---

## 📦 Scripts

| Command        | Description            |
|----------------|------------------------|
| `npm run dev`  | Start with nodemon     |
| `npm start`    | Start normally         |

---

## 🧠 Tips

- Use MongoDB Atlas for production-grade hosting
- Stick to modular MVC-like pattern for clean structure