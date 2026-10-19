const express = require("express");
const cors = require("cors");

const { authUser } = require("./utils/auth");

const authRoutes = require("./routes/common");
const eventRoutes = require("./routes/event");
const registrationRoutes = require("./routes/registration");
const participantRoutes = require("./routes/participant");
const sessionRoutes = require("./routes/session");
const speakerRoutes = require("./routes/speaker");
const attendanceRoutes = require("./routes/attendance");
const feedbackRoutes = require("./routes/feedback");

const app = express();

const PORT = 3000;


// Middleware
app.use(cors());

app.use(express.json());

app.use(express.urlencoded({
    extended: true
}));


// Public Routes
app.use("/auth", authRoutes);


// Authentication Middleware
app.use(authUser);


// Protected Routes
app.use("/event", eventRoutes);

app.use("/registration", registrationRoutes);

app.use("/participant", participantRoutes);

app.use("/session", sessionRoutes);

app.use("/speaker", speakerRoutes);

app.use("/attendance", attendanceRoutes);

app.use("/feedback", feedbackRoutes);


// Home Route
app.get("/", (req, res) => {

    res.send("Event Management Backend Running");

});


// Start Server
app.listen(PORT, () => {

    console.log(`Server running on port ${PORT}`);

});