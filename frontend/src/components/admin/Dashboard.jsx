import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaBoxes, FaTags, FaIndustry } from "react-icons/fa";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import AdminLayout from "../common/layouts/AdminLayout";

const Dashboard = () => {
  const [stats, setStats] = useState({
    products: 0,
    categories: 0,
    brands: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const adminInfo = JSON.parse(localStorage.getItem("userInfo"));
        if (!adminInfo || !adminInfo.token) {
          console.error("Authentication token missing.");
          return;
        }
        
        const token = adminInfo.token;

        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };

        const [productRes, categoryRes, brandRes] = await Promise.all([
          axios.get("http://localhost:8000/api/products", config),
          axios.get("http://localhost:8000/api/categories", config),
          axios.get("http://localhost:8000/api/brands", config),
        ]);

        setStats({
          products: productRes.data.data.data.length,
          categories: categoryRes.data.data.length,
          brands: brandRes.data.data.length,
        });
      } catch (error) {
        console.error("Error fetching stats:", error);
      }
    };

    fetchStats();
  }, []);

  return (
    <AdminLayout>
      <h2 className="mb-4">Dashboard</h2>

      <div className="row">
        <div className="col-md-4">
          <div className="card shadow-sm border-0">
            <div className="card-body d-flex align-items-center">
              <FaBoxes size={30} className="me-3 text-primary" />
              <div>
                <h5 className="card-title mb-1">Products</h5>
                <p className="card-text">{stats.products} total products</p>
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card shadow-sm border-0">
            <div className="card-body d-flex align-items-center">
              <FaTags size={30} className="me-3 text-success" />
              <div>
                <h5 className="card-title mb-1">Categories</h5>
                <p className="card-text">{stats.categories} categories</p>
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card shadow-sm border-0">
            <div className="card-body d-flex align-items-center">
              <FaIndustry size={30} className="me-3 text-warning" />
              <div>
                <h5 className="card-title mb-1">Brands</h5>
                <p className="card-text">{stats.brands} brands</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <h4 className="mt-5 mb-3">Overview Chart</h4>
      <div style={{ width: "100%", height: 300 }}>
        <ResponsiveContainer>
          <BarChart
            data={[
              { name: "Products", count: stats.products },
              { name: "Categories", count: stats.categories },
              { name: "Brands", count: stats.brands },
            ]}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Bar dataKey="count" fill="#8884d8" radius={[10, 10, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </AdminLayout>
  );
};

export default Dashboard;
