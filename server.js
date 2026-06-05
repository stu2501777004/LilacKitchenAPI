require("dotenv").config();

const express = require("express");
const cors = require("cors");
const authRoutes = require("./routes/auth");
const recipeRoutes = require("./routes/recipes");
const app = express();


app.use(cors());
app.use(express.json());
app.use("/api/recipes", recipeRoutes);

app.get("/", (req, res) => {
    res.json({
        message: "Lilac Kitchen API is running 💜"
    });
});

const PORT = process.env.PORT || 5000;
app.use("/api/auth", authRoutes);
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});