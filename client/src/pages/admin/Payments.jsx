import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Table, Input, Spin, Avatar, Typography, Button } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";

const Payments = () => {
  const { currentUser } = useSelector((state) => state.user);
  const [allBookings, setAllBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  const getAllBookings = async () => {
    try {
      setLoading(true);
      const res = await fetch(
        `/api/booking/get-allBookings?searchTerm=${encodeURIComponent(search)}`
      );
      const data = await res.json();
      if (data?.success) {
        setAllBookings(data?.bookings || []);
        setError("");
      } else {
        setError(data?.message || "Failed to fetch bookings");
      }
    } catch (err) {
      console.error(err);
      setError("Something went wrong while fetching bookings.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getAllBookings();
  }, []); // Removed 'search' from dependency array to prevent auto-search on change

  const handleSearch = (e) => {
    if (e.type === "click" || (e.type === "keypress" && e.key === "Enter")) {
      if (!search.trim()) {
        message.warning("Please enter a search term.");
        return;
      }
      getAllBookings();
    }
  };

  const columns = [
    {
      title: "Package",
      dataIndex: "packageDetails",
      key: "package",
      render: (packageDetails) => (
        <Link to={`/package/${packageDetails?._id}`}>
          <Avatar
            shape="square"
            size={48}
            src={packageDetails?.packageImages?.[0]}
          />
        </Link>
      ),
    },
    {
      title: "Package Name",
      dataIndex: "packageDetails",
      key: "packageName",
      render: (pkg) => (
        <Link to={`/package/${pkg?._id}`}>
          <Typography.Text underline>{pkg?.packageName}</Typography.Text>
        </Link>
      ),
    },
    {
      title: "Buyer",
      dataIndex: "buyer",
      key: "buyerUsername",
      render: (buyer) => <>{buyer?.username}</>,
    },
    {
      title: "Email",
      dataIndex: "buyer",
      key: "buyerEmail",
      render: (buyer) => <>{buyer?.email}</>,
    },
    {
      title: "Booking Date",
      dataIndex: "date",
      key: "date",
    },
    {
      title: "Total Price",
      dataIndex: "totalPrice",
      key: "totalPrice",
      render: (price) => `$${price}`,
    },
  ];

  return (
    <div className="flex justify-center mt-8 px-4">
      <div className="w-full max-w-6xl">
        <h1 className="text-2xl font-bold mb-4 text-center">Payments</h1>

        <div className="mb-4 flex items-center gap-4">
          <Input
            placeholder="Search by username or email..."
            prefix={<SearchOutlined />}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyPress={handleSearch}
            allowClear
          />
          <Button
            type="primary"
            icon={<SearchOutlined />}
            onClick={handleSearch}
            style={{ backgroundColor: "#1890ff", borderColor: "#1890ff" }}
            className="hover:bg-blue-600 hover:border-blue-600"
          >
            Search
          </Button>
        </div>

        {error && (
          <p className="text-red-500 text-center text-lg mb-4">{error}</p>
        )}

        {loading ? (
          <div className="flex justify-center py-16">
            <Spin size="large" />
          </div>
        ) : (
          <Table
            dataSource={allBookings}
            columns={columns}
            rowKey="_id"
            bordered
            pagination={{ pageSize: 6 }}
          />
        )}
      </div>
    </div>
  );
};

export default Payments;
