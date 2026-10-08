const express = require("express");
const cors = require("cors");
const fs = require("fs");

const app = express();

app.use(cors());
app.use(express.json());

const PORT = 5000;
const DATA_FILE = "./data/customers.json";

function getCustomers() {
    const data = fs.readFileSync(DATA_FILE, "utf8");

    if (!data.trim()) {
        return [];
    }

    return JSON.parse(data);
}

function saveCustomers(customers) {
    fs.writeFileSync(
        DATA_FILE,
        JSON.stringify(customers, null, 2)
    );
}

function generateAccountNumber(customers) {
    if (customers.length === 0) {
        return "10000001";
    }

    const lastCustomer =
        customers[customers.length - 1];

    return String(
        Number(lastCustomer.accountNumber) + 1
    );
}

// REGISTRATION

app.post("/api/register", (req, res) => {

    const {
        name,
        email,
        phone,
        accountType,
        password,
        pin
    } = req.body;

    if (
        !name ||
        !email ||
        !phone ||
        !accountType ||
        !password ||
        !pin
    ) {
        return res.status(400).json({
            message: "All fields are required"
        });
    }

    if (name.trim().length < 3) {
        return res.status(400).json({
            message: "Name must contain at least 3 characters"
        });
    }

    const emailPattern =
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(email)) {
        return res.status(400).json({
            message: "Enter a valid email address"
        });
    }

    if (!/^\d{10}$/.test(phone)) {
        return res.status(400).json({
            message: "Phone number must be 10 digits"
        });
    }

    if (password.length < 6) {
        return res.status(400).json({
            message: "Password must contain at least 6 characters"
        });
    }

    if (!/^\d{4}$/.test(pin)) {
        return res.status(400).json({
            message: "PIN must be exactly 4 digits"
        });
    }

    const customers = getCustomers();

    const emailExists = customers.find(
        customer =>
            customer.email.toLowerCase() ===
            email.toLowerCase()
    );

    if (emailExists) {
        return res.status(400).json({
            message: "Email already registered"
        });
    }

    const phoneExists = customers.find(
        customer =>
            customer.phone === phone
    );

    if (phoneExists) {
        return res.status(400).json({
            message: "Phone number already registered"
        });
    }

    const accountNumber =
        generateAccountNumber(customers);

    const newCustomer = {
        id: customers.length + 1,
        name: name.trim(),
        email: email.toLowerCase(),
        phone: phone,
        accountType: accountType,
        accountNumber: accountNumber,
        password: password,
        pin: pin,
        balance: 0,
        transactions: [],
        loans: [],
        createdAt: new Date().toLocaleString()
    };

    customers.push(newCustomer);

    saveCustomers(customers);

    res.status(201).json({
        message: "Account created successfully",
        accountNumber: accountNumber
    });
});

// LOGIN

app.post("/api/login", (req, res) => {

    const {
        email,
        password
    } = req.body;

    if (!email || !password) {
        return res.status(400).json({
            message: "Email and password are required"
        });
    }

    const customers = getCustomers();

    const customer = customers.find(
        customer =>
            customer.email.toLowerCase() ===
            email.toLowerCase() &&
            customer.password === password
    );

    if (!customer) {
        return res.status(401).json({
            message: "Invalid email or password"
        });
    }

    res.json({
        message: "Login successful",
        customer: customer
    });
});

// FORGOT PASSWORD

app.post("/api/forgot-password", (req, res) => {

    const {
        email,
        phone,
        newPassword
    } = req.body;

    if (!email || !phone || !newPassword) {
        return res.status(400).json({
            message: "All fields are required"
        });
    }

    if (newPassword.length < 6) {
        return res.status(400).json({
            message:
                "Password must contain at least 6 characters"
        });
    }

    const customers = getCustomers();

    const customer = customers.find(
        customer =>
            customer.email.toLowerCase() ===
            email.toLowerCase() &&
            customer.phone === phone
    );

    if (!customer) {
        return res.status(404).json({
            message:
                "Email and phone number do not match"
        });
    }

    customer.password = newPassword;

    saveCustomers(customers);

    res.json({
        message: "Password changed successfully"
    });
});

app.listen(PORT, () => {
    console.log(
        `Server running on http://localhost:${PORT}`
    );
});