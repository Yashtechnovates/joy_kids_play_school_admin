import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './contexts/AuthContext';
import { DataProvider } from './contexts/DataContext';
import PrivateRoute from './components/common/PrivateRoute';
import MainLayout from './layouts/MainLayout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import StudentDatabase from './pages/StudentDatabase';
import StaffDetails from './pages/StaffDetails';
import Infrastructure from './pages/Infrastructure';
import CulturalEvents from './pages/CulturalEvents';
import KidsPlayArea from './pages/KidsPlayArea';
import AcademicActivities from './pages/AcademicActivities';
import SyllabusManagement from './pages/SyllabusManagement';  // ← ADD THIS IMPORT
import Attendance from './pages/Attendance';
import Fees from './pages/Fees';
import Settings from './pages/Settings';
import EnrollmentRequests from './pages/EnrollmentRequests';




function App() {
  return (
    <Router>
      <AuthProvider>
        <DataProvider>
          <Toaster position="top-right" />
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/" element={<PrivateRoute><MainLayout /></PrivateRoute>}>
              <Route index element={<Navigate to="/dashboard" />} />
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="students" element={<StudentDatabase />} />
              <Route path="staff" element={<StaffDetails />} />
              <Route path="infrastructure" element={<Infrastructure />} />
              <Route path="cultural-events" element={<CulturalEvents />} />
              <Route path="play-area" element={<KidsPlayArea />} />
              <Route path="academic" element={<AcademicActivities />} />
              <Route path="syllabus" element={<SyllabusManagement />} />  {/* ← ADD THIS ROUTE */}
              <Route path="attendance" element={<Attendance />} />
              <Route path="fees" element={<Fees />} />
              <Route path="settings" element={<Settings />} />
              <Route path="enrollment-requests" element={<EnrollmentRequests />} />

            </Route>
          </Routes>
        </DataProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;