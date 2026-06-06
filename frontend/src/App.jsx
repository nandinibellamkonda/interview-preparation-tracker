import { Routes, Route, Navigate } from "react-router-dom";

import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Register from "./pages/Register";

import Dashboard from "./pages/Dashboard";
import SubjectProgress from "./pages/SubjectProgress";
import MockInterviews from "./pages/MockInterviews";
import StudyPlanner from "./pages/StudyPlanner";
import Goals from "./pages/Goals";
import Notes from "./pages/Notes";
import Analytics from "./pages/Analytics";
import CompanyTracker from "./pages/CompanyTracker";
import Resume from "./pages/Resume";
import Profile from "./pages/Profile";

import ProtectedRoute from "./components/ProtectedRoute";
import AppLayout from "./components/AppLayout";

export default function App() {
  return (
    <Routes>
      {/* Public */}
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Protected */}
      <Route element={<ProtectedRoute />}>
        <Route path="/app" element={<AppLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="subjects" element={<SubjectProgress />} />
          <Route path="mock-interviews" element={<MockInterviews />} />
          <Route path="study-planner" element={<StudyPlanner />} />
          <Route path="goals" element={<Goals />} />
          <Route path="notes" element={<Notes />} />
          <Route path="company" element={<CompanyTracker />} />
          <Route path="resume" element={<Resume />} />
          <Route path="analytics" element={<Analytics />} />
          <Route path="profile" element={<Profile />} />
        </Route>
      </Route>

      {/* fallback */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}