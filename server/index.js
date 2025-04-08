const express = require("express")
const bodyParser = require("body-parser")
const auth = require("./controller/auth")
const admin = require("./firebaseAdmin"); 
require('dotenv').config();

const app = express();
app.use(express.json());
const port = 3000

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