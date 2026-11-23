import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Pencil, Trash2, UserPlus, Search } from "lucide-react";
import api from "../api";

export default function StudentList() {
  const [students, setStudents] = useState([]);
  const [search, setSearch] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  async function loadStudents() {
    try {
      const response = await api.get("/students");
      setStudents(response.data);
      setError("");
    } catch {
      setError("Unable to load records. Make sure the backend and MongoDB Atlas are connected.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { loadStudents(); }, []);

  async function deleteStudent(id, name) {
    if (!window.confirm(`Delete the record for ${name}?`)) return;
    try {
      await api.delete(`/students/${id}`);
      setStudents((current) => current.filter((student) => student._id !== id));
    } catch (err) {
      setError(err.response?.data?.message || "Could not delete this record.");
    }
  }

  const filtered = students.filter((student) =>
    `${student.studentName} ${student.registerNumber} ${student.department}`.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      <div className="page-title-row"><div><span className="eyebrow">RECORDS</span><h1>Student Skill List</h1><p>View, edit and manage student placement skills.</p></div><Link to="/add-student" className="primary-button"><UserPlus size={17} /> Add Student</Link></div>
      {error && <div className="alert error">{error}</div>}
      <section className="content-card">
        <div className="list-toolbar"><div><h2>All Students <span className="count-badge">{students.length}</span></h2><p>Student assessment records</p></div><label className="search-box"><Search size={17} /><input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search name, register no..." /></label></div>
        {loading ? <div className="empty-state">Loading student records...</div> : filtered.length === 0 ? <div className="empty-state">No matching student records found.</div> : (
          <div className="table-wrap"><table><thead><tr><th>Student Details</th><th>Department</th><th>Technical Skills</th><th>Aptitude</th><th>Communication</th><th>Readiness</th><th>Actions</th></tr></thead><tbody>
            {filtered.map((student) => <tr key={student._id}>
              <td><strong className="student-cell">{student.studentName}</strong><small className="sub-cell">{student.registerNumber}</small></td>
              <td>{student.department}</td><td className="skills-cell">{student.technicalSkills.join(", ") || "—"}</td>
              <td>{student.aptitudeScore}%</td><td>{student.communicationSkills}%</td>
              <td><span className={`status ${student.placementStatus.toLowerCase().replaceAll(" ", "-")}`}>{student.placementStatus}</span></td>
              <td><div className="action-group"><Link title="Edit student" to={`/edit-student/${student._id}`} className="icon-button edit"><Pencil size={16} /></Link><button title="Delete student" onClick={() => deleteStudent(student._id, student.studentName)} className="icon-button delete"><Trash2 size={16} /></button></div></td>
            </tr>)}
          </tbody></table></div>
        )}
      </section>
    </>
  );
}
