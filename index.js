require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { connect } = require("mongoose");
const app = express();

const PORT = process.env.PORT || 3003;

app.use(express.json());
app.use(cors());

// ================= mongoose connection =================
connect(process.env.DB_URI)
  .then(() => console.log("Database connected"))
  .catch((err) => console.log("Database connection error", err));
// ================= mongoose connection =================

const router = require("./routes");

app.use("/", router);

app.get("/", (req, res) => res.send("Hello World!"));

app.listen(PORT, () => console.log(`http://localhost:${PORT}`));
