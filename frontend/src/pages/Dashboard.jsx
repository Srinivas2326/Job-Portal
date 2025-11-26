import { useEffect, useState, useContext } from "react";
import API from "../api";
import { AuthContext } from "../context/AuthContext";
import { Link } from "react-router-dom";

export default function Dashboard() {
  const { user } = useContext(AuthContext);
  const [applications, setApplications] = useState([]);

  useEffect(() => {
    if (user?.role === "candidate") {
      API.get("/jobs/my-applications/")
        .then((res) => setApplications(res.data))
        .catch((err) => console.error(err));
    }
  }, [user]);

  if (!user) return <p>Please login first</p>;

  return (
    <div>
      <h2>Dashboard ({user.role})</h2>

      {/* --------------------------- */}
      {/* CANDIDATE DASHBOARD SECTION */}
      {/* --------------------------- */}

      {user.role === "candidate" && (
        <>
          <h3>Navigation</h3>
          <ul>
            <li>
              <Link to="/jobs">View Available Jobs</Link>
            </li>
          </ul>

          <h3>My Applications</h3>

          {applications.length === 0 ? (
            <p>You haven't applied to any jobs yet.</p>
          ) : (
            <ul>
              {applications.map((app) => (
                <li key={app.id}>
                  <Link to={`/jobs/${app.job.id}`}>
                    {app.job.title} — {app.job.company}
                  </Link>
                  <p><i>Applied on: {new Date(app.created_at).toLocaleDateString()}</i></p>
                </li>
              ))}
            </ul>
          )}
        </>
      )}

      {/* --------------------------- */}
      {/* RECRUITER DASHBOARD SECTION */}
      {/* --------------------------- */}

      {user.role === "recruiter" && (
        <>
          <h3>Navigation</h3>
          <ul>
            <li>
              <Link to="/jobs/new">Post a New Job</Link>
            </li>
            <li>
              <Link to="/jobs/my-jobs">View My Posted Jobs</Link>
            </li>
          </ul>
        </>
      )}
    </div>
  );
}
