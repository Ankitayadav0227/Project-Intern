import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/Login";
import InternSignup from "./pages/InternSignup";

import AdminDashboard from "./pages/AdminDashboard";
import ManageInterns from "./pages/ManageInterns";
import AttendanceAdmin from "./pages/AttendanceAdmin";
import LeaveAdmin from "./pages/LeaveAdmin";
import Analytics from "./pages/Analytics";

import InternDashboard from "./pages/InternDashboard";
import InternProfile from "./pages/InternProfile";
import LeaveIntern from "./pages/LeaveIntern";
import InternMessages from "./pages/InternMessage";
import AdminMessages from "./pages/AdminMessages";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Authentication */}
        <Route path="/" element={<InternSignup />} />
        <Route path="/login" element={<Login />} />

    
        {/* Admin Pages */}
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/manage-interns" element={<ManageInterns />} />
        <Route path="/attendance" element={<AttendanceAdmin />} />
        <Route path="/leave" element={<LeaveAdmin />} />
        <Route path="/analytics" element={<Analytics />} />

        {/* Intern Pages */}
        <Route path="/intern" element={<InternDashboard />} />
        <Route path="/intern/profile" element={<InternProfile />} />
        <Route path="/intern/leave" element={<LeaveIntern />} />
        <Route
          path="/intern/messages"
          element={<InternMessages />}
          
/>
        
        <Route
  path="/admin/messages"
  element={<AdminMessages />}
/>

        {/* Invalid Route */}
        <Route path="*" element={<Navigate to="/" replace />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;