const express = require("express");
const Razorpay = require("razorpay");
const crypto = require("crypto");
const EventRegistration = require("../models/EventRegistration");

const router = express.Router();

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// POST create order
router.post("/create-order", async (req, res) => {
  try {
    const { amount, currency = "INR" } = req.body;

    if (!amount) {
      return res.status(400).json({ msg: "Amount is required" });
    }

    const options = {
      amount: amount * 100, // amount in the smallest currency unit (paise)
      currency,
      receipt: `receipt_order_${Date.now()}`,
    };

    const order = await razorpay.orders.create(options);

    if (!order) {
      return res.status(500).json({ msg: "Some error occured" });
    }

    res.json(order);
  } catch (error) {
    console.error("Error creating razorpay order:", error);
    res.status(500).json({ msg: "Server error", error: error.message });
  }
});

// POST verify payment
router.post("/verify", async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      userId,
      eventId,
      responses,
    } = req.body;

    const sign = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSign = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(sign.toString())
      .digest("hex");

    if (razorpay_signature === expectedSign) {
      // Payment is verified
      // Create Event Registration here
      
      const newRegistration = new EventRegistration({
        userId,
        eventId,
        responses: responses || {},
        paymentStatus: 'completed',
        razorpayOrderId: razorpay_order_id,
        razorpayPaymentId: razorpay_payment_id
      });
      
      await newRegistration.save();

      return res.status(200).json({ msg: "Payment verified and registration successful", registration: newRegistration });
    } else {
      return res.status(400).json({ msg: "Invalid signature sent!" });
    }
  } catch (error) {
    console.error("Error verifying payment:", error);
    res.status(500).json({ msg: "Server error", error: error.message });
  }
});

module.exports = router;
