const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const cors = require("cors");
const dotenv = require("dotenv");
const helmet = require("helmet");
const morgan = require("morgan");

dotenv.config();

var CorsOption = {
    origin: [
        "https://huzistore.vercel.app",
        "https://huzistore-production.up.railway.app",
        "https://huzistore-git-main-juls-projects-bc2e0168.vercel.app/",
        "https://huzistore-j79xhhj1q-juls-projects-bc2e0168.vercel.app/"
        // "http://localhost:3000",
        // "http://localhost:5000",
    ],
    optionsSuccessStatus: 200,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
};

const app = express();
const port = process.env.PORT || 5000;

app.use(helmet({ crossOriginResourcePolicy: false }));
app.use(bodyParser.json());
app.use(morgan("combined"));
app.use(cors(CorsOption));

const cartRoutes = require("./routes/cartRoutes");
const categoryRoutes = require("./routes/categoryRoutes");
const orderRoutes = require("./routes/orderRoutes");
const paymentRoutes = require("./routes/paymentRoutes");
const productRoutes = require("./routes/productRoutes");
const recommendRoutes = require("./routes/recommendRoutes");
const userRoutes = require("./routes/userRoutes");
const webhookRoutes = require("./routes/webhook");
const authenticateToken = require("./middlewares/auth");
const messageRoutes = require("./routes/messageRoutes");
const rajaOngkirRoutes = require("./routes/rajaOngkirRoutes");

app.use("/api/cart", authenticateToken, cartRoutes);
app.use("/api/category", categoryRoutes);
app.use("/api/orders", authenticateToken, orderRoutes);
app.use("/api/payment", authenticateToken, paymentRoutes);
app.use("/api/products", productRoutes);
app.use("/api/recommend", recommendRoutes);
app.use("/api/users", userRoutes);
app.use("/api/webhook", webhookRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/rajaongkir", rajaOngkirRoutes);

app.use("/images", express.static(path.join(__dirname, "../public/images")));

app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../../frontend/public/index.html"));
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});

module.exports = app;