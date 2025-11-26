import { useEffect, useState } from "react";
import API from "../api";
import { Link } from "react-router-dom";

export default function JobList() {
  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    API.get("/jobs/")
      .then((res) => setJobs(res.data))
      .catch((err) => console.error(err));
  }, []);

  return (
    <div>
      <h2>Available Jobs</h2>

      {jobs.length === 0 ? (
        <p>No jobs found.</p>
      ) : (
        <ul>
          {jobs.map((job) => (
            <li key={job.id}>
              <Link to={`/jobs/${job.id}`}>
                {job.title} — {job.company}
              </Link>
              <p><i>{job.location}</i></p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
