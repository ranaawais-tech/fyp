import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Input,
  Button,
  Spin,
  Tabs,
  Card,
  Row,
  Col,
  Image,
  message,
  Space,
  Typography,
} from "antd";
import {
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
  SearchOutlined,
} from "@ant-design/icons";

const { TabPane } = Tabs;
const { Title, Text } = Typography;

const AllPackages = () => {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [showMoreBtn, setShowMoreBtn] = useState(false);

  const getPackages = async () => {
    setPackages([]);
    try {
      setLoading(true);
      let url =
        filter === "offer"
          ? `/api/package/get-packages?searchTerm=${encodeURIComponent(
              search
            )}&offer=true`
          : filter === "latest"
          ? `/api/package/get-packages?searchTerm=${encodeURIComponent(
              search
            )}&sort=createdAt`
          : filter === "top"
          ? `/api/package/get-packages?searchTerm=${encodeURIComponent(
              search
            )}&sort=packageRating`
          : `/api/package/get-packages?searchTerm=${encodeURIComponent(
              search
            )}`;

      const res = await fetch(url);
      const data = await res.json();

      if (data?.success) {
        setPackages(data?.packages);
      } else {
        message.error(data?.message || "Something went wrong!");
      }

      setShowMoreBtn(data?.packages?.length > 8);
    } catch (error) {
      console.error(error);
      message.error("Something went wrong while fetching packages!");
    } finally {
      setLoading(false);
    }
  };

  const onShowMoreSClick = async () => {
    const startIndex = packages.length;
    let url =
      filter === "offer"
        ? `/api/package/get-packages?searchTerm=${encodeURIComponent(
            search
          )}&offer=true&startIndex=${startIndex}`
        : filter === "latest"
        ? `/api/package/get-packages?searchTerm=${encodeURIComponent(
            search
          )}&sort=createdAt&startIndex=${startIndex}`
        : filter === "top"
        ? `/api/package/get-packages?searchTerm=${encodeURIComponent(
            search
          )}&sort=packageRating&startIndex=${startIndex}`
        : `/api/package/get-packages?searchTerm=${encodeURIComponent(
            search
          )}&startIndex=${startIndex}`;

    const res = await fetch(url);
    const data = await res.json();

    setPackages((prev) => [...prev, ...data?.packages]);
    setShowMoreBtn(data?.packages?.length >= 9);
  };

  const handleDelete = async (packageId) => {
    try {
      setLoading(true);
      const res = await fetch(`/api/package/delete-package/${packageId}`, {
        method: "DELETE",
      });
      const data = await res.json();
      message.success(data?.message);
      getPackages();
    } catch (error) {
      console.error(error);
      message.error("Failed to delete package");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    if (e.type === "click" || (e.type === "keypress" && e.key === "Enter")) {
      if (!search.trim()) {
        message.warning("Please enter a search term.");
        return;
      }
      getPackages();
    }
  };

  useEffect(() => {
    getPackages();
  }, [filter]); // Removed 'search' from dependency array to prevent auto-search on change

  return (
    <div className="p-5">
      {loading ? (
        <div
          style={{
            height: "80vh",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Spin tip="Loading..." size="large" />
        </div>
      ) : (
        <Space direction="vertical" size="large" style={{ width: "100%" }}>
          <div className="flex items-center gap-4">
            <Input
              prefix={<SearchOutlined />}
              placeholder="Search packages"
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

          <Tabs defaultActiveKey="all" onChange={setFilter} activeKey={filter}>
            <TabPane tab="All" key="all" />
            <TabPane tab="Offer" key="offer" />
            <TabPane tab="Latest" key="latest" />
            <TabPane tab="Top Rated" key="top" />
          </Tabs>

          {packages.length ? (
            <Row gutter={[16, 16]}>
              {packages.map((pack) => (
                <Col xs={24} sm={12} md={8} lg={6} key={pack._id}>
                  <Card
                    hoverable
                    cover={
                      <Image
                        alt="example"
                        src={pack.packageImages[0]}
                        height={150}
                        preview={false}
                      />
                    }
                    actions={[
                      <Link to={`/profile/admin/update-package/${pack._id}`}>
                        <EditOutlined key="edit" />
                      </Link>,
                      <DeleteOutlined
                        key="delete"
                        onClick={() => handleDelete(pack._id)}
                      />,
                      <Link to={`/package/${pack._id}`}>
                        <EyeOutlined key="view" />
                      </Link>,
                    ]}
                  >
                    <Card.Meta
                      title={<Text strong>{pack.packageName}</Text>}
                      description={
                        <Link to={`/package/${pack._id}`}>View details</Link>
                      }
                    />
                  </Card>
                </Col>
              ))}
            </Row>
          ) : (
            <Title level={4} style={{ textAlign: "center" }}>
              No Packages Yet!
            </Title>
          )}

          {showMoreBtn && (
            <div style={{ textAlign: "center" }}>
              <Button type="primary" onClick={onShowMoreSClick}>
                Show More
              </Button>
            </div>
          )}
        </Space>
      )}
    </div>
  );
};

export default AllPackages;
