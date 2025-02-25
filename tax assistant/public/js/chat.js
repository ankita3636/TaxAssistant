document.addEventListener("DOMContentLoaded", function () {
    const chatHistory = document.querySelector(".chat-history");
    const userInput = document.getElementById("userInput");
    const sendBtn = document.getElementById("sendBtn");
    const calculateTaxBtn = document.getElementById("calculateTaxBtn");
    const investmentBtn = document.querySelector(".action-btn:nth-child(2)"); // Investment Guidance
    const amendmentsBtn = document.querySelector(".action-btn:nth-child(3)"); // View Amendments

    let investmentFlow = false;
    let questionIndex = 0;
    let responses = {};

    const investmentQuestions = [
        { field: "income", question: "What's your annual income?" },
        { field: "age", question: "What's your age group? (18-25, 26-40, 41-60, 60+)" },
        { field: "risk", question: "What's your risk appetite? (Low, Medium, High)" },
        { field: "goal", question: "What is your investment goal? (Retirement, Short-Term Gains, Tax Saving, Wealth Growth)" },
        { field: "investmentType", question: "What type of investment do you prefer? (Stocks, Mutual Funds, Fixed Deposits, Real Estate)" }
    ];

    function appendMessage(sender, message) {
        const messageDiv = document.createElement("div");
        messageDiv.classList.add("chat-message", sender);
        messageDiv.innerHTML = `<p>${message}</p>`;
        chatHistory.appendChild(messageDiv);
        chatHistory.scrollTop = chatHistory.scrollHeight;
    }

    function askNextInvestmentQuestion() {
        if (questionIndex < investmentQuestions.length) {
            const nextQuestion = investmentQuestions[questionIndex].question;
            appendMessage("bot", nextQuestion);
        } else {
            investmentFlow = false;
            giveInvestmentAdvice();
        }
    }

    function giveInvestmentAdvice() {
        appendMessage("bot", `Based on your inputs:  
        - Income: ${responses.income}  
        - Age Group: ${responses.age}  
        - Risk Appetite: ${responses.risk}  
        - Goal: ${responses.goal}  
        - Preferred Investment: ${responses.investmentType}  

        We recommend you explore **${responses.risk === "High" ? "stocks and aggressive mutual funds" : "stable bonds and fixed deposits"}**.`);
    }

    function sendMessage() {
        const userMessage = userInput.value.trim();
        if (!userMessage) return;

        appendMessage("user", userMessage);
        userInput.value = "";

        if (investmentFlow) {
            responses[investmentQuestions[questionIndex].field] = userMessage;
            questionIndex++;
            askNextInvestmentQuestion();
        } else {
            fetch("/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ message: userMessage }),
            })
            .then(response => response.json())
            .then(data => appendMessage("bot", data.response))
            .catch(error => console.error("Error:", error));
        }
    }

    sendBtn.addEventListener("click", sendMessage);
    userInput.addEventListener("keypress", function (e) {
        if (e.key === "Enter") sendMessage();
    });

    calculateTaxBtn.addEventListener("click", () => appendMessage("bot", "Sure! Please enter your total income."));

    investmentBtn.addEventListener("click", () => {
        investmentFlow = true;
        questionIndex = 0;
        responses = {};
        askNextInvestmentQuestion();
    });

    amendmentsBtn.addEventListener("click", () => appendMessage("bot", "Here are some recent tax amendments:\n- The standard deduction has increased to ₹50,000.\n- New tax slabs introduced for incomes above ₹10 lakh."));
});
