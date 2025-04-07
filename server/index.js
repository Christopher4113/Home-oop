const express = require("express")
const admin = require("firebase-admin")
const bodyParser = require("body-parser")
const auth = require("./controller/auth")
require('dotenv').config();

const app = express();
const port = 3000
const serviceAccount = {
    type: "service_account",
    project_id: process.env.FIREBASE_PROJECT_ID,
    private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
    private_key: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),  // Handle newlines properly
    client_email: process.env.FIREBASE_CLIENT_EMAIL,
    client_id: process.env.FIREBASE_CLIENT_ID,
    auth_uri: process.env.FIREBASE_AUTH_URI,
    token_uri: process.env.FIREBASE_TOKEN_URI,
    auth_provider_x509_cert_url: process.env.FIREBASE_AUTH_PROVIDER_X509_CERT_URL,
    client_x509_cert_url: process.env.FIREBASE_CLIENT_X509_CERT_URL,
    universe_domain: "googleapis.com"
 };  
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
})

app.get("/users", async (req,res) => {
    const db = admin.firestore()
    try {
        const snapshot = await db.collection('testCollection').get()
        const data = snapshot.docs.map(docs => ({id: docs.id, ...docs.data()}))
        res.json(data)
    } catch (error) {
        res.status(500).send(error)
    }
})
app.use("/auth",auth);

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`)
})