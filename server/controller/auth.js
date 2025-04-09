const express = require('express');
const router = express.Router();
const { getAuth, sendSignInLinkToEmail } = require("firebase/auth");
const auth = require("../firebaseClient");
const admin = require("../firebaseAdmin"); 
const db = admin.firestore();
const jwt = require("jsonwebtoken")
const bcrypt = require('bcryptjs')
require('dotenv').config();
const SECRET_KEY = process.env.SECRET_KEY;
const actionCodeSettings = {
    url: "https://home-oop.com/finishSignIn",
    handleCodeInApp: true,
}

router.post("/send-magic-link", async (req,res) => {
    const {email} = req.body;
    try {
        await sendSignInLinkToEmail(auth,email,actionCodeSettings)
        res.status(200).send("Magic link sent!")
    } catch (error) {
        console.error(error);
        res.status(500).send("Failed to send magic link")
    }
})

router.post("/signup", async (req, res) => {
    const { username, email, password } = req.body;
    if (!username || !email || !password)
      return res.status(400).json({ error: "Email and password required" });
  
    try {
      const existingEmail = await admin.auth().getUserByEmail(email).catch(() => null);
      if (existingEmail) {
        return res.status(409).json({ error: "Email is already taken" });
      }
  
      const existingUsername = await db.collection("users").where("username", "==", username).get();
      if (!existingUsername.empty) {
        return res.status(409).json({ error: "Username is already taken" });
      }
  
      const user = await admin.auth().createUser({ email, password });
  
      const hashedPassword = await bcrypt.hash(password, 10);
  
      await db.collection("users").doc(user.uid).set({
        username,
        email,
        hashedPassword,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
      });
  
      res.status(201).json({ uid: user.uid });
    } catch (error) {
      console.error("Signup error:", error);
      res.status(400).json({ error: error.message });
    }
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password)
    return res.status(400).json({ error: "Email and password required" });

  try {
    const userRecord = await admin.auth().getUserByEmail(email).catch(() => null);
    if (!userRecord) {
      return res.status(404).json({ error: "Email not found" });
    }

    const userDoc = await db.collection("users").doc(userRecord.uid).get();
    if (!userDoc.exists) {
      return res.status(404).json({ error: "User data not found" });
    }

    const userData = userDoc.data();
    const isPasswordValid = await bcrypt.compare(password, userData.hashedPassword);
    if (!isPasswordValid) {
      return res.status(401).json({ error: "Invalid password" });
    }

    const token = jwt.sign(
      { uid: userRecord.uid, email: userRecord.email, username: userData.username },
      SECRET_KEY,
      { expiresIn: "1d" } // 1 day expiration
    );

    res.status(200).json({ token });
  } catch (error) {
    console.error("Login error: ", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.put("/forgot", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password)
    return res.status(400).json({ error: "Email and password required" });

  try {
    const userRecord = await admin.auth().getUserByEmail(email).catch(() => null);
    if (!userRecord) {
      return res.status(404).json({ error: "Email not found" });
    }

    const userDocRef = db.collection("users").doc(userRecord.uid);
    const userDoc = await userDocRef.get();
    if (!userDoc.exists) {
      return res.status(404).json({ error: "User data not found" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await userDocRef.update({
      hashedPassword,
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    res.status(200).json({ message: "Password updated successfully" });
  } catch (error) {
    console.error("Forgot password error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});


router.delete("/delete-user", async (req, res) => {
    const { email } = req.body;
    if (!email) return res.status(400).json({ error: "Email required" });
  
    try {
      const user = await admin.auth().getUserByEmail(email);
  
      // Delete from Auth
      await admin.auth().deleteUser(user.uid);
  
      // Delete from Firestore
      await db.collection("users").doc(user.uid).delete();
  
      res.status(200).json({ message: "User fully deleted" });
    } catch (error) {
      console.error("Delete error:", error);
      res.status(400).json({ error: error.message });
    }
});
  


module.exports = router;