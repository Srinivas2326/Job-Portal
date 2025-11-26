import { useParams } from "react-router-dom";
import { useState, useEffect, useContext } from "react";
import API from "../api";
import { AuthContext } from "../context/AuthContext";

export default function JobDetail() {
  const { id } = useParams();
  const [job, setJob] = useState(null);
  const [coverLetter, setCoverLetter] = useState("");
  const [message, setMessage] = useState("");
  const { user } = useContext(AuthContext);

  // Fetch job details
  useEffect(() => {
    API.get(`/jobs/${id}/`)
      .then((res) => setJob(res.data))
      .catch((err) => console.error("Job detail error:", err));
  }, [id]);

  // Apply to job
  const apply = async () => {
    try {
      await API.post("/jobs/apply/", {
        job: parseInt(id),          // FIX: ensure ID is sent as number
        cover_letter: coverLetter,
      });

      setMessage("Applied successfully!");
    } catch (error) {
      console.error("Apply error:", error.response?.data || error);
      setMessage("Failed to apply.");
    }
  };

  if (!job) return <p>Loading job details...</p>;

  return (
    <div style={{ maxWidth: "800px", padding: "20px" }}>
      <h2>{job.title}</h2>
      <p><b>{job.company}</b> — {job.location}</p>
      <p>{job.description}</p>

      {/* Candidate Apply Section */}
      {user?.role === "candidate" && (
        <div style={{ marginTop: "20px" }}>
          <h3>Apply</h3>

          <textarea
            rows={5}
            style={{ width: "100%", padding: "10px" }}
            placeholder="Write a cover letter..."
            value={coverLetter}
            onChange={(e) => setCoverLetter(e.target.value)}
          />

          <br /><br />

          <button onClick={apply}>Apply</button>

          {message && (
            <p style={{ color: message.includes("successfully") ? "green" : "red" }}>
              {message}
            </p>
          )}
        </div>
      )}

      {/* Message if logged-in user is not a candidate */}
      {user && user.role !== "candidate" && (
        <p style={{ color: "gray", marginTop: "20px" }}>
          Only candidates can apply to jobs.
        </p>
      )}
    </div>
  );
}
