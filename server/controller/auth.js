const express = require('express');
const router = express.Router();
const { getAuth, sendSignInLinkToEmail } = require("firebase/auth");
const auth = require("../firebaseClient");
const admin = require("../firebaseAdmin"); 
const db = admin.firestore();
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