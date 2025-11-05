import React, { useState } from "react";
import axios from "axios";

interface ApplyOption {
  apply_link: string;
  publisher: string;
  is_direct: boolean;
}

interface Job {
  job_title: string;
  employer_name: string;
  job_city?: string;
  job_country?: string;
  job_description?: string;
  job_apply_link: string;
  apply_options?: ApplyOption[];
}

const JobRecommendations: React.FC = () => {
  const [role, setRole] = useState<string>("");
  const [location, setLocation] = useState<string>("");
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const fetchJobs = async () => {
    if (!role) {
      alert("Please enter your target role.");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post("http://localhost:5000/jobs", {
        role,
        location,
      });

      const jobList: Job[] = response.data?.data || [];
      setJobs(jobList);
    } catch (error: any) {
      console.error("Error fetching jobs:", error.response?.data || error.message);
      alert(`Error: ${error.response?.data?.error || error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto mt-12 p-8 bg-white rounded-2xl shadow-md border border-gray-200">
      <h2 className="text-3xl font-semibold mb-8 text-center text-gray-800">
        Job Search Portal
      </h2>

      {/* Search Form */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          fetchJobs();
        }}
        className="flex flex-col md:flex-row gap-4 mb-8"
      >
        <input
          type="text"
          placeholder="Enter job role (e.g., AI Engineer)"
          value={role}
          onChange={(e) => setRole(e.target.value)}
          className="p-3 border border-gray-300 rounded-lg flex-1 outline-none focus:ring-2 focus:ring-blue-500 transition"
        />

        <input
          type="text"
          placeholder="Enter location (e.g., Mumbai)"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          className="p-3 border border-gray-300 rounded-lg flex-1 outline-none focus:ring-2 focus:ring-blue-500 transition"
        />

        <button
          type="submit"
          disabled={loading}
          className={`px-6 py-3 rounded-lg text-white font-medium transition-all duration-200 ${
            loading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {loading ? "Searching..." : "Search Jobs"}
        </button>
      </form>

      {/* Loading or Empty States */}
      {loading && (
        <p className="text-gray-500 text-center">Searching for jobs...</p>
      )}
      {!loading && jobs.length === 0 && (
        <p className="text-gray-500 text-center">
          No jobs found yet. Try searching with different keywords.
        </p>
      )}

      {/* Job Results */}
      {jobs.length > 0 && (
        <div className="grid gap-6">
          {jobs.map((job, index) => (
            <div
              key={index}
              className="p-6 border border-gray-200 rounded-xl shadow-sm hover:shadow-lg transition-shadow bg-gray-50"
            >
              <div className="mb-3">
                <h3 className="text-xl font-semibold text-gray-800">
                  {job.job_title}
                </h3>
                <p className="text-gray-600">{job.employer_name}</p>
                <p className="text-gray-500 text-sm">
                  {job.job_city}, {job.job_country}
                </p>
              </div>

              {job.job_description && (
                <p className="text-gray-700 text-sm mb-4 leading-relaxed line-clamp-3">
                  {job.job_description.substring(0, 250)}...
                </p>
              )}

              <a
                href={job.job_apply_link}
                target="_blank"
                rel="noreferrer"
                className="inline-block text-blue-600 hover:underline font-medium"
              >
                Apply Now →
              </a>

              {/* Multiple Apply Options */}
              {job.apply_options && job.apply_options.length > 0 && (
                <div className="mt-4">
                  <p className="font-semibold text-sm mb-1 text-gray-700">
                    Also available on:
                  </p>
                  <ul className="list-disc ml-6 text-blue-500 text-sm">
                    {job.apply_options.map((opt, idx) => (
                      <li key={idx}>
                        <a
                          href={opt.apply_link}
                          target="_blank"
                          rel="noreferrer"
                          className="hover:underline"
                        >
                          {opt.publisher}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default JobRecommendations;
