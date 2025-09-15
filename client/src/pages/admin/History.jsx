import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import {
  Table,
  Input,
  Spin,
  Avatar,
  Button,
  Popconfirm,
  message,
  Typography,
} from "antd";
import { SearchOutlined, DeleteOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";

const History = () => {
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
        // Sort the bookings based on relevance to the search term
        const sortedBookings = (data?.bookings || []).sort((a, b) => {
          const searchTerm = search.trim().toLowerCase();
          if (!searchTerm) return 0; // No sorting if search term is empty

          // Extract fields for comparison
          const aPackageName =
            a.packageDetails?.packageName?.toLowerCase() || "";
          const bPackageName =
            b.packageDetails?.packageName?.toLowerCase() || "";
          const aUsername = a.buyer?.username?.toLowerCase() || "";
          const bUsername = b.buyer?.username?.toLowerCase() || "";
          const aEmail = a.buyer?.email?.toLowerCase() || "";
          const bEmail = b.buyer?.email?.toLowerCase() || "";

          // Check matches in packageName, username, and email
          const aPackageMatch = aPackageName.includes(searchTerm);
          const bPackageMatch = bPackageName.includes(searchTerm);
          const aUsernameMatch = aUsername.includes(searchTerm);
          const bUsernameMatch = bUsername.includes(searchTerm);
          const aEmailMatch = aEmail.includes(searchTerm);
          const bEmailMatch = bEmail.includes(searchTerm);

          // Prioritize packageName matches
          if (aPackageMatch && !bPackageMatch) return -1; // a comes first if it matches packageName and b doesn't
          if (!aPackageMatch && bPackageMatch) return 1; // b comes first if it matches packageName and a doesn't

          // If both match in packageName, refine further
          if (aPackageMatch && bPackageMatch) {
            const aStartsWithPackage = aPackageName.startsWith(searchTerm);
            const bStartsWithPackage = bPackageName.startsWith(searchTerm);
            if (aStartsWithPackage && !bStartsWithPackage) return -1;
            if (!aStartsWithPackage && bStartsWithPackage) return 1;
            return aPackageName.localeCompare(bPackageName); // Alphabetical sorting for ties
          }

          // If neither matches packageName, prioritize username matches
          if (aUsernameMatch && !bUsernameMatch) return -1;
          if (!aUsernameMatch && bUsernameMatch) return 1;

          // If both match in username, refine further
          if (aUsernameMatch && bUsernameMatch) {
            const aStartsWithUsername = aUsername.startsWith(searchTerm);
            const bStartsWithUsername = bUsername.startsWith(searchTerm);
            if (aStartsWithUsername && !bStartsWithUsername) return -1;
            if (!aStartsWithUsername && bStartsWithUsername) return 1;
            return aUsername.localeCompare(bUsername); // Alphabetical sorting for ties
          }

          // If neither matches username, prioritize email matches
          if (aEmailMatch && !bEmailMatch) return -1;
          if (!aEmailMatch && bEmailMatch) return 1;

          // If both match in email, refine further
          if (aEmailMatch && bEmailMatch) {
            const aStartsWithEmail = aEmail.startsWith(searchTerm);
            const bStartsWithEmail = bEmail.startsWith(searchTerm);
            if (aStartsWithEmail && !bStartsWithEmail) return -1;
            if (!aStartsWithEmail && bStartsWithEmail) return 1;
            return aEmail.localeCompare(bEmail); // Alphabetical sorting for ties
          }

          // If no matches in any field, maintain original order
          return 0;
        });

        setAllBookings(sortedBookings);
        setError("");
      } else {
        setError(data?.message || "Failed to fetch history");
      }
    } catch (err) {
      console.error(err);
      setError("Something went wrong while fetching history.");
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

  const handleHistoryDelete = async (id) => {
    try {
      setLoading(true);
      const res = await fetch(
        `/api/booking/delete-booking-history/${id}/${currentUser._id}`,
        {
          method: "DELETE",
        }
      );
      const data = await res.json();
      if (data?.success) {
        message.success(data.message);
        getAllBookings();
      } else {
        message.error(data.message);
      }
    } catch (err) {
      console.error(err);
      message.error("Failed to delete history");
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    {
      title: "Package",
      dataIndex: "packageDetails",
      key: "packageImage",
      render: (pkg) => (
        <Link to={`/package/${pkg?._id}`}>
          <Avatar shape="square" size={48} src={pkg?.packageImages?.[0]} />
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
      sorter: (a, b) =>
        a.packageDetails?.packageName?.localeCompare(
          b.packageDetails?.packageName
        ),
    },
    {
      title: "Username",
      dataIndex: "buyer",
      key: "username",
      render: (buyer) => <>{buyer?.username}</>,
      sorter: (a, b) => a.buyer?.username?.localeCompare(b.buyer?.username),
    },
    {
      title: "Email",
      dataIndex: "buyer",
      key: "email",
      render: (buyer) => <>{buyer?.email}</>,
      sorter: (a, b) => a.buyer?.email?.localeCompare(b.buyer?.email),
    },
    {
      title: "Date",
      dataIndex: "date",
      key: "date",
      sorter: (a, b) => new Date(a.date) - new Date(b.date),
    },
    {
      title: "Action",
      key: "action",
      render: (_, booking) => {
        const isPastOrCancelled =
          new Date(booking.date).getTime() < new Date().getTime() ||
          booking.status === "Cancelled";
        return isPastOrCancelled ? (
          <Popconfirm
            title="Delete this history?"
            description="Are you sure you want to delete this booking history?"
            onConfirm={() => handleHistoryDelete(booking._id)}
            okText="Yes"
            cancelText="No"
          >
            <Button danger icon={<DeleteOutlined />} />
          </Popconfirm>
        ) : (
          <Typography.Text type="secondary">N/A</Typography.Text>
        );
      },
    },
  ];

  return (
    <div className="flex justify-center mt-8 px-4">
      <div className="w-full max-w-6xl">
        <h1 className="text-2xl font-bold mb-4 text-center">Booking History</h1>

        <div className="mb-4 flex items-center gap-4">
          <Input
            placeholder="Search Username or Email..."
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

export default History;
