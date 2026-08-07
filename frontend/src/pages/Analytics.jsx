import AdminLayout from "../layouts/AdminLayout";
import { useEffect, useState } from "react";
import axios from "axios";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
} from "chart.js";

import { Bar, Pie, Line, Doughnut } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

function Analytics() {

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const res = await axios.get(
    "http://127.0.0.1:5000/analytics"
);

      setAnalytics(res.data);

    } catch (err) {
      console.log(err);
    }
  };

  // Temporary Data
  // Later we'll replace this with API data

  const [analytics, setAnalytics] = useState({
    worklogs: [],
    departments: [],
    attendance: [],
    leaves: [],
    topInterns: []
  });

  const workLogData = {
    labels: analytics.worklogs.map(item => item.status),

    datasets: [
      {
        label: "Work Logs",
        data: analytics.worklogs.map(item => item.total),

        backgroundColor: [
          "#28a745",
          "#ffc107",
          "#dc3545"
        ]
      }
    ]
  };

  const departmentData = {
    labels: analytics.departments.map(item => item.department),

    datasets: [
      {
        data: analytics.departments.map(item => item.total),

        backgroundColor: [
          "#007bff",
          "#28a745",
          "#ffc107",
          "#dc3545",
          "#6610f2",
          "#20c997"
        ]
      }
    ]
  };

  const attendanceData = {
    labels: analytics.attendance.map(item => item.attendance_date),

    datasets: [
      {
        label: "Attendance",

        data: analytics.attendance.map(item => item.total),

        borderColor: "#0d6efd",

        backgroundColor: "#0d6efd",

        tension: 0.4
      }
    ]
  };

  const leaveData = {
    labels: analytics.leaves.map(item => item.status),

    datasets: [
      {
        data: analytics.leaves.map(item => item.total),

        backgroundColor: [
          "#198754",
          "#ffc107",
          "#dc3545"
        ]
      }
    ]
  };
  const topInternData = {
    labels: analytics.topInterns.map(item => item.full_name),

    datasets: [
      {
        label: "Hours Worked",

        data: analytics.topInterns.map(item => item.total_hours),

        backgroundColor: "#6610f2"
      }
    ]
  };

  return (
    <AdminLayout>

      <div className="container-fluid">

        <h2 className="fw-bold mb-4">
          Analytics Dashboard
        </h2>

        <div className="row">

          <div className="col-lg-6 mb-4">
            <div className="card shadow p-3">
              <h5 className="text-center">
                Work Log Status
              </h5>

              <Bar data={workLogData} />
            </div>
          </div>

          <div className="col-lg-6 mb-4">
            <div className="card shadow p-3">
              <h5 className="text-center">
                Department Distribution
              </h5>

              <Pie data={departmentData} />
            </div>
          </div>

          <div className="col-lg-12 mb-4">
            <div className="card shadow p-3">
              <h5 className="text-center">
                Weekly Attendance Trend
              </h5>

              <Line data={attendanceData} />
            </div>
          </div>

          <div className="col-lg-6 mb-4">
            <div className="card shadow p-3">
              <h5 className="text-center">
                Leave Requests
              </h5>

              <Doughnut data={leaveData} />
            </div>
          </div>

          <div className="col-lg-6 mb-4">
            <div className="card shadow p-3">
              <h5 className="text-center">
                Top Interns
              </h5>

              <Bar
                data={topInternData}
                options={{
                  indexAxis: "y"
                }}
              />
            </div>
          </div>

        </div>

      </div>

    </AdminLayout>
  );
}

export default Analytics;