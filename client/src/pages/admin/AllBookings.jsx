import React, { useEffect, useState } from "react";
import { Table, Input, Spin, Button, Avatar, message, Space, Tag } from "antd";
import { SearchOutlined, ExclamationCircleOutlined } from "@ant-design/icons";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import dayjs from "dayjs";

const MyBookings = () => {
  const { currentUser } = useSelector((state) => state.user);
  const [currentBookings, setCurrentBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");

  const getAllBookings = async () => {
    try {
      setLoading(true);
      const res = await fetch(
        `/api/booking/get-UserCurrentBookings/${
          currentUser?._id
        }?searchTerm=${encodeURIComponent(search)}`
      );
      const data = await res.json();
      if (data?.success) {
        setCurrentBookings(data.bookings);
      } else {
        message.error(data.message);
      }
    } catch (error) {
      console.error(error);
      message.error("Failed to fetch bookings.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (currentUser?._id) {
      getAllBookings();
    }
  }, [currentUser]); // Only triggers on initial load or currentUser change

  const handleSearch = (e) => {
    if (e.type === "click" || (e.type === "keypress" && e.key === "Enter")) {
      if (!search.trim()) {
        message.warning("Please enter a search term.");
        return;
      }
      getAllBookings();
    }
  };

  const handleCancel = async (id) => {
    try {
      setLoading(true);
      const res = await fetch(
        `/api/booking/cancel-booking/${id}/${currentUser._id}`,
        {
          method: "POST",
        }
      );
      const data = await res.json();
      if (data?.success) {
        message.success(data.message);
        getAllBookings();
      } else {
        message.error(data.message);
      }
    } catch (error) {
      console.error(error);
      message.error("Failed to cancel booking.");
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    {
      title: "Package",
      dataIndex: "packageDetails",
      key: "package",
      render: (packageDetails) => (
        <Space>
          <Avatar
            shape="square"
            size={48}
            src={packageDetails?.packageImages?.[0]}
            style={{ borderRadius: 8 }}
          />
          <div>
            <Link
              to={`/package/${packageDetails?._id}`}
              className="font-semibold hover:text-blue-600 transition"
            >
              {packageDetails?.packageName}
            </Link>
            <div className="text-gray-400 text-sm">
              {packageDetails?.location}
            </div>
          </div>
        </Space>
      ),
    },
    {
      title: "Customer",
      dataIndex: "buyer",
      key: "customer",
      render: (buyer) => (
        <Space direction="vertical" size={2}>
          <span className="font-medium">{buyer?.username}</span>
          <span className="text-gray-500 text-sm">{buyer?.email}</span>
        </Space>
      ),
    },
    {
      title: "Booking Date",
      dataIndex: "date",
      key: "date",
      render: (date) => (
        <span className="text-gray-700">
          {dayjs(date).format("MMM D, YYYY")}
        </span>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => {
        const color =
          status === "active"
            ? "green"
            : status === "Cancelled"
            ? "red"
            : "gold";
        const icon =
          status === "active" ? "✅" : status === "Cancelled" ? "❌" : "⏳";
        return (
          <Tag color={color}>
            {icon} {status.toUpperCase()}
          </Tag>
        );
      },
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => {
        const isCancelable =
          new Date(record.date).getTime() > Date.now() &&
          record.status !== "Cancelled";

        return isCancelable ? (
          <Button
            danger
            icon={<ExclamationCircleOutlined />}
            onClick={() => handleCancel(record._id)}
          >
            Cancel
          </Button>
        ) : (
          <span className="text-gray-400 italic">Not allowed</span>
        );
      },
    },
  ];

  return (
    <div className="flex justify-center mt-8 px-4">
      <div className="w-full max-w-6xl">
        <h1 className="text-2xl font-bold mb-6 text-center">
          My Current Bookings
        </h1>

        <div className="mb-6 flex items-center gap-4">
          <Input
            placeholder="Search bookings..."
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

        {loading ? (
          <div className="flex justify-center py-16">
            <Spin size="large" />
          </div>
        ) : (
          <Table
            dataSource={currentBookings}
            columns={columns}
            rowKey="_id"
            pagination={{ pageSize: 6 }}
            bordered
          />
        )}
      </div>
    </div>
  );
};

export default MyBookings;
