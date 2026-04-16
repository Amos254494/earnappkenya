const express = require("express");
const cors = require("cors");

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Test route
app.get("/", (req, res) => {
  res.send("Backend is running 🚀");
});


// 🔹 Payment route (you will connect M-Pesa here later)
app.post("/pay", (req, res) => {
  const { phone } = req.body;

  if (!phone) {
    return res.status(400).send("Phone number is required");
  }

  console.log("Payment request for:", phone);

  // TODO: Add M-Pesa STK Push here
  res.send("Payment request received. Check your phone 📱");
});


// 🔹 M-Pesa callback route
app.post("/callback", (req, res) => {
  console.log("M-Pesa Callback:", JSON.stringify(req.body, null, 2));

  // VERY IMPORTANT: always respond with 200
  res.sendStatus(200);
});

const cors = require("cors");
app.use(cors());
app.use(express.json());

// 🔹 Start server
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);

  

const axios = require("axios");

const consumerKey = "YOUR_CONSUMER_KEY";
const consumerSecret = "YOUR_CONSUMER_SECRET";

app.post("/pay", async (req, res) => {
  const phone = req.body.phone;

  try {
    // STEP 1: Get access token
    const auth = Buffer.from(`${consumerKey}:${consumerSecret}`).toString("base64");

    const tokenResponse = await axios.get(
      "https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials",
      {
        headers: {
          Authorization: `Basic ${auth}`
        }
      }
    );

    const accessToken = tokenResponse.data.access_token;

    // STEP 2: STK Push request
    const timestamp = new Date().toISOString().replace(/[-:TZ.]/g, "").slice(0, 14);

    const shortCode = "174379"; // sandbox shortcode
    const passkey = "YOUR_PASSKEY"; // from Daraja

    const password = Buffer.from(shortCode + passkey + timestamp).toString("base64");

    const stkResponse = await axios.post(
      "https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest",
      {
        BusinessShortCode: shortCode,
        Password: password,
        Timestamp: timestamp,
        TransactionType: "CustomerPayBillOnline",
        Amount: "1", // test amount
        PartyA: phone,
        PartyB: shortCode,
        PhoneNumber: phone,
        CallBackURL: "https://backend-i0aq.onrender.com/callback",
        AccountReference: "Test",
        TransactionDesc: "Payment"
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      }
    );

    res.send("STK Push sent! Check your phone 📱");

  } catch (error) {
    console.error(error.response?.data || error.message);
    res.send("Payment failed ❌");
  }
});
});