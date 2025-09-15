import React, { useEffect, useState } from "react";
import {
  Table,
  Input,
  Tabs,
  Avatar,
  Button,
  Rate,
  Spin,
  Typography,
  message,
} from "antd";
import { SearchOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";

const { TabPane } = Tabs;

const RatingsReviews = () => {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [showMoreBtn, setShowMoreBtn] = useState(false);

  const getPackages = async () => {
    try {
      setLoading(true);
      setPackages([]);

      let url =
        filter === "most"
          ? `/api/package/get-packages?searchTerm=${encodeURIComponent(
              search
            )}&sort=packageTotalRatings`
          : `/api/package/get-packages?searchTerm=${encodeURIComponent(
              search
            )}&sort=packageRating`;

      const res = await fetch(url);
      const data = await res.json();

      if (data?.success) {
        setPackages(data?.packages || []);
        setShowMoreBtn(data?.packages?.length > 8);
      } else {
        message.error(data?.message || "Failed to load packages");
      }
    } catch (error) {
      console.error(error);
      message.error("Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  const onShowMoreClick = async () => {
    const startIndex = packages.length;
    let url =
      filter === "most"
        ? `/api/package/get-packages?searchTerm=${encodeURIComponent(
            search
          )}&sort=packageTotalRatings&startIndex=${startIndex}`
        : `/api/package/get-packages?searchTerm=${encodeURIComponent(
            search
          )}&sort=packageRating&startIndex=${startIndex}`;

    try {
      const res = await fetch(url);
      const data = await res.json();

      if (data?.packages?.length < 9) setShowMoreBtn(false);
      setPackages((prev) => [...prev, ...data?.packages]);
    } catch (err) {
      console.error(err);
      message.error("Unable to load more packages");
    }
  };

  useEffect(() => {
    getPackages();
  }, [filter]); // Removed 'search' from dependency array to prevent auto-search on change

  const handleSearch = (e) => {
    if (e.type === "click" || (e.type === "keypress" && e.key === "Enter")) {
      if (!search.trim()) {
        message.warning("Please enter a search term.");
        return;
      }
      getPackages();
    }
  };

  const columns = [
    {
      title: "Image",
      dataIndex: "packageImages",
      key: "image",
      render: (images, record) => (
        <Link to={`/package/ratings/${record._id}`}>
          <Avatar shape="square" size={64} src={images?.[0]} />
        </Link>
      ),
    },
    {
      title: "Package Name",
      dataIndex: "packageName",
      key: "name",
      render: (text, record) => (
        <Link to={`/package/ratings/${record._id}`}>
          <Typography.Text underline className="font-medium">
            {text}
          </Typography.Text>
        </Link>
      ),
    },
    {
      title: "Rating",
      key: "rating",
      render: (_, record) => (
        <span className="flex items-center gap-2">
          <Rate disabled value={record.packageRating} allowHalf />
          <span>({record.packageTotalRatings})</span>
        </span>
      ),
    },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      <Typography.Title level={3} className="text-center mb-6">
        Package Ratings & Reviews
      </Typography.Title>

      <div className="mb-4 flex items-center gap-4">
        <Input
          placeholder="Search packages..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          prefix={<SearchOutlined />}
          allowClear
          onKeyPress={handleSearch}
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

      <Tabs defaultActiveKey="all" activeKey={filter} onChange={setFilter}>
        <TabPane tab="All" key="all" />
        <TabPane tab="Most Rated" key="most" />
      </Tabs>

      {loading ? (
        <div className="flex justify-center py-16">
          <Spin size="large" />
        </div>
      ) : packages?.length ? (
        <>
          <Table
            dataSource={packages}
            columns={columns}
            rowKey="_id"
            pagination={false}
            bordered
            className="mb-4"
          />

          {showMoreBtn && (
            <div className="flex justify-center">
              <Button
                onClick={onShowMoreClick}
                type="primary"
                className="bg-green-600 hover:bg-green-700"
              >
                Show More
              </Button>
            </div>
          )}
        </>
      ) : (
        <Typography.Text type="secondary" className="block text-center mt-6">
          No Ratings Available!
        </Typography.Text>
      )}
    </div>
  );
};

export default RatingsReviews;
