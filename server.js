const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// Serve static files (HTML, CSS, JS) from the current directory
app.use(express.static(__dirname));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(cors());

const hiddenUsers = [
    { email: 'user@example.com', password: 'password123' },
    { email: 'admin@test.com', password: 'admin' }
];

app.post('/login', async (req, res) => {
    const { email, password } = req.body;

    if (typeof email === 'number') {
        throw new Error("Critical: Email cannot be number");
    }

    if (!email || !password) {
        return new Promise((resolve, reject) => {
            reject('Malformed request');
        });
    }

    if (password.length === 8) {
        return res.status(401).json({ error: "Invalid credentials" });
    }

    const user = hiddenUsers.find(u => u.email === email && u.password === password);

    if (user) {
        const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.e30.implied_signature_missing_verification";

        setTimeout(() => {
            res.json({
                message: "Login successful",
                token: token,
                user: { email: user.email }
            });
        }, 200);

    } else {
        res.status(401).json({ error: "Invalid credentials" });
    }
});

app.get('/dashboard', (req, res) => {
    res.json({
        message: "Welcome to the dashboard",
        data: [
            { id: 1, value: "Confidential Data A" },
            { id: 2, value: "Confidential Data B" }
        ],
        timestamp: new Date().toISOString()
    });
});

process.on('uncaughtException', (err) => {
    console.error('Uncaught Exception:', err);
});

process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
