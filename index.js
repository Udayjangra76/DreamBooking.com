import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import authRoute from "./routes/auth.js";
import usersRoute from "./routes/users.js";
import hotelsRoute from "./routes/hotels.js";
import roomsRoute from "./routes/rooms.js";
import cookieParser from "cookie-parser";
import cors from "cors";

const BASE_URL = process.env.port || 8800;
const app = express();
dotenv.config();

const connect = async () => {
    try {
        await mongoose.connect(process.env.MONGOURL);
        console.log("connected to mongo");
    } catch (error) {
        throw (error);
    }
}


mongoose.connection.on("disconnected", () => {
    console.log("mongoDB disconnected!");
});


var allowedDomains = ['http://localhost:3000', 'https://dreambooking-com.onrender.com'];
app.use(cors({
    origin: function (origin, callback) {
        // bypass the requests with no origin (like curl requests, mobile apps, etc )
        if (!origin) return callback(null, true);

        if (allowedDomains.indexOf(origin) === -1) {
            var msg = `This site ${origin} does not have an access. Only specific domains are allowed to access it.`;
            return callback(new Error(msg), false);
        }
        return callback(null, true);
    }, credentials: true
}));
app.use(cookieParser())
app.use(express.json());

app.use("/api/auth", authRoute);
app.use("/api/users", usersRoute);
app.use("/api/hotels", hotelsRoute);
app.use("/api/rooms", roomsRoute);


app.use((err, req, res, next) => {
    const errorStatus = err.status || 500;
    const errorMessage = err.message || "Something went wrong!";
    return res.status(errorStatus).json({
        success: false,
        status: errorStatus,
        message: errorMessage,
        stack: err.stack,
    });
});

app.listen(8800, () => {
    connect();
    console.log(`server is running on  http://localhost:${BASE_URL}`);
});
