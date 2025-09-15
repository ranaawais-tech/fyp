import React, { useEffect, useState } from "react";
import { Table, Input, Spin, Button, Avatar, message } from "antd";
import { SearchOutlined } from "@ant-design/icons";
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
        `/api/booking/get-UserCurrentBookings/${currentUser?._id}?searchTerm=${search}`
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
  }, [search, currentUser]);

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
      title: "Image",
      dataIndex: "packageDetails",
      key: "image",
      render: (pkg) => (
        <Link to={`/package/${pkg?._id}`}>
          <Avatar
            shape="square"
            size={64}
            src={pkg?.packageImages?.[0]}
            alt="Package"
          />
        </Link>
      ),
    },
    {
      title: "Package",
      dataIndex: "packageDetails",
      key: "packageName",
      render: (pkg) => (
        <Link to={`/package/${pkg?._id}`}>
          <span className="hover:underline font-medium">
            {pkg?.packageName}
          </span>
        </Link>
      ),
    },
    {
      title: "Buyer",
      dataIndex: "buyer",
      key: "buyer",
      render: (buyer) => (
        <div>
          <div>{buyer?.username}</div>
          <div className="text-gray-500 text-sm">{buyer?.email}</div>
        </div>
      ),
    },
    {
      title: "Date",
      dataIndex: "date",
      key: "date",
      render: (date) => <span>{dayjs(date).format("MMM D, YYYY")}</span>,
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => (
        <span
          className={`px-2 py-1 rounded text-xs font-semibold ${
            status === "Cancelled"
              ? "bg-red-100 text-red-600"
              : status === "Confirmed"
              ? "bg-green-100 text-green-600"
              : "bg-yellow-100 text-yellow-600"
          }`}
        >
          {status}
        </span>
      ),
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => {
        const isCancelable =
          new Date(record.date).getTime() > Date.now() &&
          record.status !== "Cancelled";

        return isCancelable ? (
          <Button danger onClick={() => handleCancel(record._id)}>
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

        <Input
          placeholder="Search bookings..."
          prefix={<SearchOutlined />}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          allowClear
          className="mb-6"
        />

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
