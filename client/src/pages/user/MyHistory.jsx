import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import {
  Table,
  Input,
  Button,
  Space,
  Avatar,
  Modal,
  Spin,
  message,
} from "antd";
import { ExclamationCircleOutlined, SearchOutlined } from "@ant-design/icons";
import dayjs from "dayjs";

const { confirm } = Modal;

const MyHistory = () => {
  const { currentUser } = useSelector((state) => state.user);
  const [allBookings, setAllBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");

  const getAllBookings = async () => {
    try {
      setLoading(true);
      const res = await fetch(
        `/api/booking/get-allUserBookings/${currentUser?._id}?searchTerm=${search}`
      );
      const data = await res.json();
      if (data?.success) {
        setAllBookings(data?.bookings);
      } else {
        message.error(data?.message);
      }
    } catch (error) {
      console.error(error);
      message.error("Failed to fetch booking history");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getAllBookings();
  }, [search]);

  const handleHistoryDelete = (id) => {
    confirm({
      title: "Are you sure you want to delete this booking?",
      icon: <ExclamationCircleOutlined />,
      okText: "Yes",
      okType: "danger",
      cancelText: "No",
      async onOk() {
        try {
          setLoading(true);
          const res = await fetch(
            `/api/booking/delete-booking-history/${id}/${currentUser._id}`,
            { method: "DELETE" }
          );
          const data = await res.json();
          if (data?.success) {
            message.success(data?.message);
            getAllBookings();
          } else {
            message.error(data?.message);
          }
        } catch (error) {
          console.error(error);
          message.error("Deletion failed");
        } finally {
          setLoading(false);
        }
      },
    });
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
      title: "Action",
      key: "action",
      render: (_, record) => {
        const isPastOrCancelled =
          new Date(record.date).getTime() < Date.now() ||
          record.status === "Cancelled";
        return isPastOrCancelled ? (
          <Button danger onClick={() => handleHistoryDelete(record._id)}>
            Delete
          </Button>
        ) : null;
      },
    },
  ];

  return (
    <div className="flex justify-center mt-8 px-4">
      <div className="w-full max-w-6xl">
        <h1 className="text-2xl font-bold mb-6 text-center">Booking History</h1>

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
            dataSource={allBookings}
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

export default MyHistory;
