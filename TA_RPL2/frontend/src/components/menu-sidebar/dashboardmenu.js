import React, { useState, useEffect } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { useAuth } from "../authcontext";
import Chart from "chart.js/auto";
import { FaUser } from "react-icons/fa";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

const DashboardMenu = () => {
  const { username } = useAuth();
  const [token, setToken] = useState("");

  const [dailyRevenue, setDailyRevenue] = useState(0);
  const [weeklyRevenue, setWeeklyRevenue] = useState(0);
  const [monthlyRevenue, setMonthlyRevenue] = useState(0);
  const [yearlyRevenue, setYearlyRevenue] = useState(0);
  const [hourlyData, setHourlyData] = useState([]);
  const [weeklyData, setWeeklyData] = useState([]);
  const [monthlyData, setMonthlyData] = useState([]);
  const [yearlyData, setYearlyData] = useState([]);

  const [topProduct, setTopProduct] = useState([]);

  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [recommend, setRecommend] = useState([]);
  const [order, setOrder] = useState([]);
  const [users, setUsers] = useState([]);

  const [userId, setUserId] = useState("");

  useEffect(() => {
    const authToken = localStorage.getItem("token");
    setToken(authToken);

    const decodedToken = decodeToken(authToken);
    if (decodedToken) {
      setUserId(decodedToken.userId);
    }
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const categoriesResponse = await axios.get(
          `${API_BASE_URL}/api/category`
        );
        setCategories(categoriesResponse.data.sort((a, b) => a.id - b.id));

        const productsResponse = await axios.get(
          `${API_BASE_URL}/api/products`
        );
        setProducts(productsResponse.data.sort((a, b) => a.id - b.id));

        const sortedProducts = productsResponse.data
          .sort((a, b) => b.sold - a.sold)
          .slice(0, 3);
        setTopProduct(sortedProducts);

        const recommendResponse = await axios.get(
          `${API_BASE_URL}/api/recommend`
        );
        setRecommend(recommendResponse.data.sort((a, b) => a.id - b.id));

        if (token) {
          const usersResponse = await axios.get(
            `${API_BASE_URL}/api/users/user/alluser`,
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );
          setUsers(usersResponse.data.sort((a, b) => a.id - b.id));

          const orderResponse = await axios.get(
            `${API_BASE_URL}/api/orders/allorder`,
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );
          setOrder(orderResponse.data.sort((a, b) => b.id - a.id));

          const today = new Date();
          const startOfDay = new Date(
            today.getFullYear(),
            today.getMonth(),
            today.getDate(),
            0,
            0,
            0
          );
          const endOfDay = new Date(
            today.getFullYear(),
            today.getMonth(),
            today.getDate(),
            23,
            59,
            59
          );

          const filteredOrders = orderResponse.data.filter((order) => {
            const orderDate = new Date(order.createdAt);
            return orderDate >= startOfDay && orderDate <= endOfDay;
          });

          const totalDailyRevenue = filteredOrders.reduce(
            (acc, order) => acc + order.total,
            0
          );
          setDailyRevenue(totalDailyRevenue);

          const hourlyRevenue = Array.from({ length: 24 }).fill(0);
          filteredOrders.forEach((order) => {
            const orderHour = new Date(order.createdAt).getHours();
            hourlyRevenue[orderHour] += order.total;
          });
          setHourlyData(hourlyRevenue);

          const startOfWeek = new Date(today);
          startOfWeek.setDate(today.getDate() - today.getDay());
          startOfWeek.setHours(0, 0, 0, 0);

          const endOfWeek = new Date(startOfWeek);
          endOfWeek.setDate(startOfWeek.getDate() + 6);
          endOfWeek.setHours(23, 59, 59, 999);

          const weeklyOrders = orderResponse.data.filter((order) => {
            const orderDate = new Date(order.createdAt);
            return orderDate >= startOfWeek && orderDate <= endOfWeek;
          });

          const weeklyRevenueTotal = weeklyOrders.reduce(
            (acc, order) => acc + order.total,
            0
          );
          setWeeklyRevenue(weeklyRevenueTotal);

          const weeklyRevenue = Array.from({ length: 7 }).fill(0);
          weeklyOrders.forEach((order) => {
            const orderDay = new Date(order.createdAt).getDay();
            weeklyRevenue[orderDay] += order.total;
          });
          setWeeklyData(weeklyRevenue);

          const startOfMonth = new Date(
            today.getFullYear(),
            today.getMonth(),
            1
          );
          const endOfMonth = new Date(
            today.getFullYear(),
            today.getMonth() + 1,
            0,
            23,
            59,
            59
          );

          const monthlyOrders = orderResponse.data.filter((order) => {
            const orderDate = new Date(order.createdAt);
            return orderDate >= startOfMonth && orderDate <= endOfMonth;
          });

          const totalMonthlyRevenue = monthlyOrders.reduce(
            (acc, order) => acc + order.total,
            0
          );
          setMonthlyRevenue(totalMonthlyRevenue);

          const daysInMonth = new Date(
            today.getFullYear(),
            today.getMonth() + 1,
            0
          ).getDate();
          const monthlyData = Array.from({ length: daysInMonth }).fill(0);

          monthlyOrders.forEach((order) => {
            const orderDate = new Date(order.createdAt).getDate();
            monthlyData[orderDate - 1] += order.total;
          });
          setMonthlyData(monthlyData);

          const startOfYear = new Date(today.getFullYear(), 0, 1);
          const endOfYear = new Date(today.getFullYear(), 11, 31, 23, 59, 59);

          const yearlyOrders = orderResponse.data.filter((order) => {
            const orderDate = new Date(order.createdAt);
            return orderDate >= startOfYear && orderDate <= endOfYear;
          });

          const totalYearlyRevenue = yearlyOrders.reduce(
            (acc, order) => acc + order.total,
            0
          );
          setYearlyRevenue(totalYearlyRevenue);

          const monthsInYear = 12;
          const yearlyData = Array.from({ length: monthsInYear }).fill(0);

          yearlyOrders.forEach((order) => {
            const orderMonth = new Date(order.createdAt).getMonth();
            yearlyData[orderMonth] += order.total;
          });
          setYearlyData(yearlyData);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [token]);

  const recentOrders = order.slice(-5);

  useEffect(() => {
    const renderChart = () => {
      if (hourlyData.length === 0) {
        return;
      }

      const existingChart = Chart.getChart("hourlyRevenueChart");
      if (existingChart) {
        existingChart.destroy();
      }

      const ctx = document.getElementById("hourlyRevenueChart");

      new Chart(ctx, {
        type: "line",
        data: {
          labels: Array.from({ length: 24 }, (_, i) => `${i}:00`),
          datasets: [
            {
              label: "Pendapatan per Jam",
              data: hourlyData,
              backgroundColor: "#152D29",
              borderColor: "#3A7B73",
              borderWidth: 1,
            },
          ],
        },
        options: {
          responsive: true,
          plugins: {
            legend: {
              display: false,
            },
            tooltip: {
              callbacks: {
                label: function (tooltipItem) {
                  return `Rp ${tooltipItem.raw.toLocaleString("id-ID")}`;
                },
              },
            },
          },
          scales: {
            x: {
              grid: {
                color: "#152D29",
              },
              ticks: {
                color: "#EEE",
              },
            },
            y: {
              beginAtZero: true,
              ticks: {
                callback: function (value) {
                  return `Rp ${value.toLocaleString("id-ID")}`;
                },
                color: "#EEE",
              },
              grid: {
                color: "#152D29",
              },
            },
          },
        },
      });
    };

    renderChart();

    return () => {
      const existingChart = Chart.getChart("hourlyRevenueChart");
      if (existingChart) {
        existingChart.destroy();
      }
    };
  }, [hourlyData]);

  useEffect(() => {
    const renderWeeklyChart = () => {
      if (weeklyData.length === 0) {
        return;
      }

      const existingChart = Chart.getChart("weeklyRevenueChart");
      if (existingChart) {
        existingChart.destroy();
      }

      const ctx = document.getElementById("weeklyRevenueChart");

      new Chart(ctx, {
        type: "line",
        data: {
          labels: [
            "Minggu",
            "Senin",
            "Selasa",
            "Rabu",
            "Kamis",
            "Jumat",
            "Sabtu",
          ],
          datasets: [
            {
              label: "Pendapatan per Hari",
              data: weeklyData,
              backgroundColor: "#152D29",
              borderColor: "#3A7B73",
              borderWidth: 1,
            },
          ],
        },
        options: {
          responsive: true,
          plugins: {
            legend: {
              display: false,
            },
            tooltip: {
              callbacks: {
                label: function (tooltipItem) {
                  return `Rp ${tooltipItem.raw.toLocaleString("id-ID")}`;
                },
              },
            },
          },
          scales: {
            x: {
              grid: {
                color: "#152D29",
              },
              ticks: {
                color: "#EEE",
              },
            },
            y: {
              beginAtZero: true,
              ticks: {
                callback: function (value) {
                  return `Rp ${value.toLocaleString("id-ID")}`;
                },
                color: "#EEE",
              },
              grid: {
                color: "#152D29",
              },
            },
          },
        },
      });
    };

    renderWeeklyChart();

    return () => {
      const existingChart = Chart.getChart("weeklyRevenueChart");
      if (existingChart) {
        existingChart.destroy();
      }
    };
  }, [weeklyData]);

  useEffect(() => {
    const renderMonthlyChart = () => {
      if (monthlyData.length === 0) {
        return;
      }

      const existingChart = Chart.getChart("monthlyRevenueChart");
      if (existingChart) {
        existingChart.destroy();
      }

      const ctx = document.getElementById("monthlyRevenueChart");

      new Chart(ctx, {
        type: "line",
        data: {
          labels: Array.from({ length: monthlyData.length }, (_, i) => i + 1),
          datasets: [
            {
              label: "Pendapatan per Hari",
              data: monthlyData,
              backgroundColor: "#152D29",
              borderColor: "#3A7B73",
              borderWidth: 1,
            },
          ],
        },
        options: {
          responsive: true,
          plugins: {
            legend: {
              display: false,
            },
            tooltip: {
              callbacks: {
                label: function (tooltipItem) {
                  return `Rp ${tooltipItem.raw.toLocaleString("id-ID")}`;
                },
              },
            },
          },
          scales: {
            x: {
              grid: {
                color: "#152D29",
              },
              ticks: {
                color: "#EEE",
              },
            },
            y: {
              beginAtZero: true,
              ticks: {
                callback: function (value) {
                  return `Rp ${value.toLocaleString("id-ID")}`;
                },
                color: "#EEE",
              },
              grid: {
                color: "#152D29",
              },
            },
          },
        },
      });
    };

    renderMonthlyChart();

    return () => {
      const existingChart = Chart.getChart("monthlyRevenueChart");
      if (existingChart) {
        existingChart.destroy();
      }
    };
  }, [monthlyData]);

  useEffect(() => {
    const renderYearlyChart = () => {
      if (yearlyData.length === 0) {
        return;
      }

      const existingChart = Chart.getChart("yearlyRevenueChart");
      if (existingChart) {
        existingChart.destroy();
      }

      const ctx = document.getElementById("yearlyRevenueChart");

      new Chart(ctx, {
        type: "line",
        data: {
          labels: [
            "Jan",
            "Feb",
            "Mar",
            "Apr",
            "May",
            "Jun",
            "Jul",
            "Aug",
            "Sep",
            "Oct",
            "Nov",
            "Dec",
          ],
          datasets: [
            {
              label: "Pendapatan per Bulan",
              data: yearlyData,
              backgroundColor: "#152D29",
              borderColor: "#3A7B73",
              borderWidth: 1,
            },
          ],
        },
        options: {
          responsive: true,
          plugins: {
            legend: {
              display: false,
            },
            tooltip: {
              callbacks: {
                label: function (tooltipItem) {
                  return `Rp ${tooltipItem.raw.toLocaleString("id-ID")}`;
                },
              },
            },
          },
          scales: {
            x: {
              grid: {
                color: "#152D29",
              },
              ticks: {
                color: "#EEE",
              },
            },
            y: {
              beginAtZero: true,
              ticks: {
                callback: function (value) {
                  return `Rp ${value.toLocaleString("id-ID")}`;
                },
                color: "#EEE",
              },
              grid: {
                color: "#152D29",
              },
            },
          },
        },
      });
    };

    renderYearlyChart();

    return () => {
      const existingChart = Chart.getChart("yearlyRevenueChart");
      if (existingChart) {
        existingChart.destroy();
      }
    };
  }, [yearlyData]);

  const decodeToken = (token) => {
    try {
      return jwtDecode(token);
    } catch (error) {
      console.error("Error decoding token:", error);
      return null;
    }
  };

  return (
    <div className="main-content">
      <div className="header">
        <div className="search-bars"></div>
        <div className="user-info">
          <span className="username">{username}</span>
          <FaUser className="user-info-icon" />
        </div>
      </div>
      <div className="content">
        <div className="overview">
          <div className="sales-overview">
            <h3>Ringkasan Penjualan</h3>
          </div>
          <div className="stats">
            <div className="stat-card">
              <p>Pendapatan Harian</p>
              <h4>Rp {dailyRevenue.toLocaleString("id-ID")}</h4>
              <div className="chart-placeholder">
                <canvas id="hourlyRevenueChart"></canvas>
              </div>
            </div>
            <div className="stat-card">
              <p>Pendapatan Mingguan</p>
              <h4>Rp {weeklyRevenue.toLocaleString("id-ID")}</h4>
              <div className="chart-placeholder">
                <canvas id="weeklyRevenueChart"></canvas>
              </div>
            </div>
            <div className="stat-card">
              <p>Pendapatan Bulanan</p>
              <h4>Rp {monthlyRevenue.toLocaleString("id-ID")}</h4>
              <div className="chart-placeholder">
                <canvas id="monthlyRevenueChart"></canvas>
              </div>
            </div>
            <div className="stat-card">
              <p>Pendapatan Tahunan</p>
              <h4>Rp {yearlyRevenue.toLocaleString("id-ID")}</h4>
              <div className="chart-placeholder">
                <canvas id="yearlyRevenueChart"></canvas>
              </div>
            </div>
          </div>
        </div>
        <div className="details">
          <div className="top-selling">
            <h4>Produk Terlaris</h4>
            <div className="product-list">
              <table>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Nama Produk</th>
                    <th>Category</th>
                    <th>Harga</th>
                    <th>Terjual</th>
                  </tr>
                </thead>
                <tbody>
                  {topProduct.map((product, index) => (
                    <tr key={index}>
                      <td>{product.id}</td>
                      <td>{product.name}</td>
                      <td>
                        {
                          categories.find(
                            (cat) => cat.id === product.categoryId
                          )?.name
                        }
                      </td>
                      <td>Rp {product.price.toLocaleString("id-ID")}</td>
                      <td>{product.sold}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <div className="latest-products">
            <h4>Pesanan Terbaru</h4>
            <div className="product-list">
              <table>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>User ID</th>
                    <th>Total</th>
                    <th>Status</th>
                    <th>Tanggal Pesanan</th>
                  </tr>
                </thead>
                <tbody>
                  {recentOrders.map((order, index) => (
                    <tr key={index}>
                      <td>{order.id}</td>
                      <td>{order.userId}</td>
                      <td>Rp {order.total.toLocaleString("id-ID")}</td>
                      <td>{order.status}</td>
                      <td>{formatDate(order.createdAt)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const formatDate = (isoDate) => {
  const date = new Date(isoDate);
  const options = {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "numeric",
    minute: "numeric",
    hour12: false,
  };
  return date.toLocaleDateString("en-US", options).replace(",", ",");
};

export default DashboardMenu;
