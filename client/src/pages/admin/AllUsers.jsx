import React, { useEffect, useState } from "react";
import { Table, Input, Spin, Popconfirm, message, Avatar, Button } from "antd";
import {
  SearchOutlined,
  DeleteOutlined,
  UserOutlined,
} from "@ant-design/icons";

const AllUsers = () => {
  const [allUsers, setAllUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const getUsers = async () => {
    try {
      setLoading(true);
      const res = await fetch(
        `/api/user/getAllUsers?searchTerm=${encodeURIComponent(search)}`
      );
      const data = await res.json();

      if (data?.success === false) {
        setError(data.message);
      } else {
        setAllUsers(data);
        setError("");
      }
    } catch (err) {
      console.error(err);
      setError("Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getUsers();
  }, []); // Removed 'search' from dependency array to prevent auto-search on change

  const handleSearch = (e) => {
    if (e.type === "click" || (e.type === "keypress" && e.key === "Enter")) {
      if (!search.trim()) {
        message.warning("Please enter a search term.");
        return;
      }
      getUsers();
    }
  };

  const handleUserDelete = async (userId) => {
    try {
      setLoading(true);
      const res = await fetch(`/api/user/delete-user/${userId}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data?.success === false) {
        message.error("Something went wrong!");
        return;
      }
      message.success(data?.message);
      getUsers();
    } catch (err) {
      console.error(err);
      message.error("Error deleting user");
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    {
      title: "Avatar",
      dataIndex: "username",
      key: "avatar",
      render: (_, record) => (
        <Avatar icon={<UserOutlined />} src={record.profilePic} />
      ),
    },
    {
      title: "Username",
      dataIndex: "username",
      key: "username",
      sorter: (a, b) => a.username.localeCompare(b.username),
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Address",
      dataIndex: "address",
      key: "address",
      responsive: ["md"],
    },
    {
      title: "Phone",
      dataIndex: "phone",
      key: "phone",
      responsive: ["md"],
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Popconfirm
          title="Delete this user?"
          description="Are you sure the account will be permanently deleted?"
          onConfirm={() => handleUserDelete(record._id)}
          okText="Yes"
          cancelText="No"
        >
          <DeleteOutlined className="text-red-500 hover:text-red-700 cursor-pointer text-lg" />
        </Popconfirm>
      ),
    },
  ];

  return (
    <div className="flex justify-center mt-8 px-4">
      <div className="w-full max-w-6xl">
        <h1 className="text-2xl font-bold mb-4 text-center">All Users</h1>

        <div className="mb-4 flex items-center gap-4">
          <Input
            placeholder="Search name, email or phone..."
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

        <h2 className="text-lg font-medium mb-4">
          Total Users: {allUsers.length}
        </h2>

        {error && (
          <p className="text-red-500 text-center text-lg mb-4">{error}</p>
        )}

        {loading ? (
          <div className="flex justify-center py-16">
            <Spin size="large" />
          </div>
        ) : (
          <Table
            dataSource={allUsers}
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

export default AllUsers;
