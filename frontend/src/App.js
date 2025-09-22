import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Auth from "./components/Authentication/Auth";
import TeacherHome from "./components/Teacher-Dashboard/TeacherHome";
import StudentHome from "./components/Student-Dashboard/StudentHome";

// Achievement pages
import PendingAchievements from "./components/Student-Dashboard/PendingAchievements";
import DeclinedAchievements from "./components/Student-Dashboard/DeclinedAchievements";
import RevisionAchievements from "./components/Student-Dashboard/RevisionAchievements";
import ApprovedAchievements from "./components/Student-Dashboard/ApprovedAchievements";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Auth />} />
        <Route path="/teacher-home" element={<TeacherHome />} />
        <Route path="/student-home" element={<StudentHome />} />

        {/* Student achievement pages */}
        <Route path="/achievements/pending" element={<PendingAchievements />} />
        <Route path="/achievements/declined" element={<DeclinedAchievements />} />
        <Route path="/achievements/revision_requested" element={<RevisionAchievements />} />
        <Route path="/achievements/approved" element={<ApprovedAchievements />} />
      </Routes>
    </Router>
  );
}

export default App;
