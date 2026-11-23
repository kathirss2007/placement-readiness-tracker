import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Save } from "lucide-react";
import api from "../api";

const emptyForm = {
  studentName: "", registerNumber: "", department: "", technicalSkills: "",
  aptitudeScore: "", communicationSkills: "", placementStatus: "In Progress"
};

export default function StudentForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(Boolean(id));

  useEffect(() => {
    if (!id) return;
    api.get(`/students/${id}`)
      .then(({ data }) => setForm({
        ...data,
        technicalSkills: (data.technicalSkills || []).join(", ")
      }))
      .catch((err) => setError(err.response?.data?.message || "Unable to load student details."))
      .finally(() => setLoading(false));
  }, [id]);

  function update(event) {
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
  }

  async function submit(event) {
    event.preventDefault();
    setError("");
    const payload = {
      ...form,
      technicalSkills: form.technicalSkills.split(",").map((skill) => skill.trim()).filter(Boolean),
      aptitudeScore: Number(form.aptitudeScore),
      communicationSkills: Number(form.communicationSkills)
    };
    try {
      if (id) await api.put(`/students/${id}`, payload);
      else await api.post("/students", payload);
      navigate("/students");
    } catch (err) {
      setError(err.response?.data?.message || "Could not save student. Check the entered values and server connection.");
    }
  }

  if (loading) return <div className="content-card empty-state">Loading student details...</div>;

  return (
    <>
      <div className="page-title-row"><div><span className="eyebrow">STUDENT PROFILE</span><h1>{id ? "Edit Student" : "Add Student Skills"}</h1><p>Enter the student's details and skill assessment.</p></div><Link to="/students" className="back-link"><ArrowLeft size={16} /> Back to list</Link></div>
      <section className="content-card form-card">
        {error && <div className="alert error">{error}</div>}
        <form onSubmit={submit}>
          <div className="form-section-title"><span className="step-number">01</span><div><h2>Basic Information</h2><p>Student identity and department details</p></div></div>
          <div className="form-grid">
            <label className="field"><span>Student Name *</span><input name="studentName" value={form.studentName} onChange={update} placeholder="Enter full name" required /></label>
            <label className="field"><span>Register Number *</span><input name="registerNumber" value={form.registerNumber} onChange={update} placeholder="e.g. 24IT018" required /></label>
            <label className="field full-field"><span>Department *</span><input name="department" value={form.department} onChange={update} placeholder="e.g. Information Technology" required /></label>
          </div>
          <div className="form-divider" />
          <div className="form-section-title"><span className="step-number">02</span><div><h2>Skill Assessment</h2><p>Technical, aptitude and communication skills</p></div></div>
          <div className="form-grid">
            <label className="field full-field"><span>Technical Skills *</span><input name="technicalSkills" value={form.technicalSkills} onChange={update} placeholder="e.g. HTML, CSS, JavaScript, React" required /><small>Enter multiple skills separated by commas.</small></label>
            <label className="field"><span>Aptitude Score (0–100) *</span><input type="number" name="aptitudeScore" value={form.aptitudeScore} onChange={update} min="0" max="100" placeholder="e.g. 85" required /></label>
            <label className="field"><span>Communication Skills (0–100) *</span><input type="number" name="communicationSkills" value={form.communicationSkills} onChange={update} min="0" max="100" placeholder="e.g. 80" required /></label>
            <label className="field full-field"><span>Placement Readiness Status *</span><select name="placementStatus" value={form.placementStatus} onChange={update}><option>Ready</option><option>In Progress</option><option>Not Ready</option></select></label>
          </div>
          <div className="form-actions"><Link to="/students" className="secondary-button">Cancel</Link><button className="primary-button" type="submit"><Save size={17} /> {id ? "Update Student" : "Save Student"}</button></div>
        </form>
      </section>
    </>
  );
}
