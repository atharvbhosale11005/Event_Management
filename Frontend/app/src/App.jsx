import { Routes, Route } from "react-router-dom";

import ProtectedRoute from "./routes/ProtectedRoute";

// Common Pages
import Home from "./commonPages/Home";
import Login from "./commonPages/Login";
import Register from "./commonPages/Register";

// Participant Pages
import ParticipantDashboard from "./participantPages/ParticipantDashboard";
import Events from "./participantPages/Events";
import EventDetails from "./participantPages/EventDetails";
import EventRegistration from "./participantPages/EventRegistration";
import MyRegistrations from "./participantPages/MyRegistrations";
import Sessions from "./participantPages/Sessions";
import Attendance from "./participantPages/Attendance";
import Feedback from "./participantPages/Feedback";
import Profile from "./participantPages/Profile";

// Admin Pages
import AdminDashboard from "./adminPages/AdminDashboard";
import EventManagement from "./adminPages/EventManagement";
import SessionManagement from "./adminPages/SessionManagement";
import SpeakerManagement from "./adminPages/SpeakerManagement";
import ParticipantManagement from "./adminPages/ParticipantManagement";
import AttendanceManagement from "./adminPages/AttendanceManagement";
import FeedbackManagement from "./adminPages/FeedbackManagement";

function App() {

    return (
        <Routes>

            {/* =========================
                PUBLIC ROUTES
            ========================= */}

            <Route
                path="/"
                element={<Home />}
            />

            <Route
                path="/login"
                element={<Login />}
            />

            <Route
                path="/register"
                element={<Register />}
            />


            {/* =========================
                PARTICIPANT ROUTES
            ========================= */}

            <Route
                element={
                    <ProtectedRoute
                        allowedRoles={["PARTICIPANT"]}
                    />
                }
            >

                <Route
                    path="/participant/dashboard"
                    element={<ParticipantDashboard />}
                />

                <Route
                    path="/participant/events"
                    element={<Events />}
                />

                <Route
                    path="/participant/events/:eventId"
                    element={<EventDetails />}
                />

                <Route
                    path="/participant/events/:eventId/register"
                    element={<EventRegistration />}
                />

                <Route
                    path="/participant/registrations"
                    element={<MyRegistrations />}
                />

                <Route
                    path="/participant/sessions"
                    element={<Sessions />}
                />

                <Route
                    path="/participant/attendance"
                    element={<Attendance />}
                />

                <Route
                    path="/participant/feedback"
                    element={<Feedback />}
                />

                <Route
                    path="/participant/profile"
                    element={<Profile />}
                />

            </Route>


            {/* =========================
                ADMIN ROUTES
            ========================= */}

            <Route
                element={
                    <ProtectedRoute
                        allowedRoles={["ADMIN"]}
                    />
                }
            >

                <Route
                    path="/admin/dashboard"
                    element={<AdminDashboard />}
                />

                <Route
                    path="/admin/events"
                    element={<EventManagement />}
                />

                <Route
                    path="/admin/sessions"
                    element={<SessionManagement />}
                />

                <Route
                    path="/admin/speakers"
                    element={<SpeakerManagement />}
                />

                <Route
                    path="/admin/participants"
                    element={<ParticipantManagement />}
                />

                <Route
                    path="/admin/attendance"
                    element={<AttendanceManagement />}
                />

                <Route
                    path="/admin/feedback"
                    element={<FeedbackManagement />}
                />

            </Route>


            {/* =========================
                INVALID ROUTE
            ========================= */}

            <Route
                path="*"
                element={<Home />}
            />

        </Routes>
    );
}

export default App;