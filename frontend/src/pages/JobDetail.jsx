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

  useEffect(() => {
    API.get(`/jobs/${id}/`)
      .then((res) => setJob(res.data))
      .catch((err) => console.error("Job detail error:", err));
  }, [id]);

  const apply = async () => {
    try {
      await API.post("/jobs/apply/", {
        job_id: parseInt(id, 10),   // IMPORTANT: job_id, not job
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
      <p>
        <b>{job.company}</b> — {job.location}
      </p>
      <p>{job.description}</p>

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
          <br />
          <button style={{ marginTop: "10px" }} onClick={apply}>
            Apply
          </button>
          {message && (
            <p
              style={{
                color: message.includes("successfully") ? "green" : "red",
                marginTop: "10px",
              }}
            >
              {message}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
