const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const PORT = 3000;

// Set EJS as the template engine
app.set("view engine", "ejs");

// for CSS & JS files
app.use(express.static("public"));
app.use(bodyParser.json());
app.use(express.json());

// Route to render the index page
app.get("/", (req, res) => {
    res.render("index");
});

// Chat page route
app.get("/chat", (req, res) => {
    res.render("chat");
});

// Function to extract numbers from input
function extractIncome(input) {
    const match = input.match(/\d+[,.]?\d*/g);
    return match ? parseFloat(match[0].replace(/,/g, "")) : null;
}

// Function to calculate tax (as per new regime)
function calculateTax(income) {
    if (income <= 1200000) return 0;
    if (income <= 1500000) return (income - 1200000) * 0.05;
    return (income - 1500000) * 0.1 + 30000;
}

// Predefined tax amendments
const taxAmendments = [
    "The standard deduction has increased to ₹50,000.",
    "New tax slabs have been introduced for incomes above ₹10 lakh.",
    "The 80C deduction limit remains unchanged at ₹1.5 lakh.",
];

// Predefined investment guidance
const investmentGuidance = [
    "Consider investing in ELSS for tax-saving and high returns.",
    "PPF is a safe investment with tax benefits under Section 80C.",
    "Investing in NPS can provide additional tax benefits.",
];

app.post("/chat", (req, res) => {
    let userMessage = req.body.message.toLowerCase().trim();

    if (userMessage.includes("calculate tax")) {
        return res.json({ response: "Sure! Please enter your total income." });
    }

    const income = extractIncome(userMessage);
    if (income !== null) {
        const tax = calculateTax(income);
        return res.json({ response: `Based on your income of ₹${income.toLocaleString()}, your estimated tax is ₹${tax.toLocaleString()}.` });
    }

    if (userMessage.includes("view amendments")) {
        return res.json({ response: `Here are some recent tax amendments:\n- ${taxAmendments.join("\n- ")}` });
    }

    if (userMessage.includes("investment guidance") || userMessage.includes("get investment guidance")) {
        return res.json({ response: `Here are some investment tips:\n- ${investmentGuidance.join("\n- ")}` });
    }

    const responses = {
        "hello": "Hi! How can I assist you with taxes today?",
        "hi": "Hello! Need any tax-related help?",
        "how do i file my taxes": "You can file taxes online through the Income Tax Department website.",
    };

    const botResponse = responses[userMessage] || "Sorry, I didn't understand that. Can you rephrase?";
    res.json({ response: botResponse });
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
