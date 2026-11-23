import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Users, BadgeCheck, TrendingUp, UserPlus, ArrowRight, GraduationCap } from "lucide-react";
import api from "../api";

export default function Dashboard() {
  const [students, setStudents] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    api.get("/students")
      .then((response) => setStudents(response.data))
      .catch(() => setError("Cannot connect to the server. Start the backend and check your MongoDB Atlas settings."));
  }, []);

  const ready = students.filter((student) => student.placementStatus === "Ready").length;
  const inProgress = students.filter((student) => student.placementStatus === "In Progress").length;
  const stats = [
    { label: "Total Students", value: students.length, icon: Users, tone: "blue" },
    { label: "Placement Ready", value: ready, icon: BadgeCheck, tone: "green" },
    { label: "In Progress", value: inProgress, icon: TrendingUp, tone: "orange" }
  ];

  return (
    <>
      <section className="welcome-panel">
        <div>
          <span className="eyebrow">OVERVIEW</span>
          <h1>Career Readiness Overview</h1>
          <p>Track student assessments, skill growth and placement preparation in one workspace.</p>
          <Link className="primary-button" to="/add-student"><UserPlus size={17} /> Add New Student</Link>
        </div>
        <div className="welcome-art"><GraduationCapArt /></div>
      </section>

      {error && <div className="alert error">{error}</div>}

      <div className="section-heading"><div><h2>Performance Overview</h2><p>Summary of student skill records</p></div></div>
      <section className="stats-grid">
        {stats.map(({ label, value, icon: Icon, tone }) => (
          <article className="stat-card" key={label}>
            <div className={`stat-icon ${tone}`}><Icon size={22} /></div>
            <div><p>{label}</p><strong>{value}</strong></div>
          </article>
        ))}
      </section>

      <section className="content-card recent-card">
        <div className="card-heading"><div><h2>Recently Added Students</h2><p>Latest student skill records</p></div><Link to="/students" className="text-link">View all <ArrowRight size={16} /></Link></div>
        {students.length === 0 ? (
          <div className="empty-state"><Users size={30} /><strong>No student records yet</strong><span>Add your first student to get started.</span><Link to="/add-student" className="primary-button">Add Student</Link></div>
        ) : (
          <div className="table-wrap"><table><thead><tr><th>Student</th><th>Register No.</th><th>Aptitude</th><th>Communication</th><th>Status</th></tr></thead><tbody>
            {students.slice(0, 5).map((student) => <tr key={student._id}><td className="student-cell">{student.studentName}</td><td>{student.registerNumber}</td><td>{student.aptitudeScore}%</td><td>{student.communicationSkills}%</td><td><span className={`status ${student.placementStatus.toLowerCase().replaceAll(" ", "-")}`}>{student.placementStatus}</span></td></tr>)}
          </tbody></table></div>
        )}
      </section>
    </>
  );
}

function GraduationCapArt() {
  return <div className="art-circle"><div className="art-cap"><GraduationCap size={76} strokeWidth={1.4} /></div><span className="art-star star-one">✦</span><span className="art-star star-two">✧</span></div>;
}
