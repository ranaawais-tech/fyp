import React from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Form,
  Input,
  Button,
  Card,
  Typography,
  message,
  Space,
  Row,
  Col,
} from "antd";
import { GlobalOutlined } from "@ant-design/icons";

const { Title, Text } = Typography;

const Signup = () => {
  const navigate = useNavigate();

  const onFinish = async (values) => {
    try {
      const res = await axios.post(`/api/auth/signup`, values);
      if (res?.data?.success) {
        message.success(res?.data?.message || "Signup successful!");
        navigate("/login");
      } else {
        message.error(res?.data?.message || "Signup failed");
      }
    } catch (error) {
      message.error("Something went wrong");
      console.error(error);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4 py-10"
      style={{
        backgroundImage:
          "url('https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1600&q=80')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div className="w-full max-w-4xl">
        <Card
          variant="borderless"
          className="shadow-2xl backdrop-blur-md"
          style={{
            backgroundColor: "rgba(255, 255, 255, 0.95)",
            borderRadius: 24, // bigger border-radius on card
            padding: "2rem",
          }}
        >
          <div className="flex justify-center items-center mb-4">
            <GlobalOutlined style={{ fontSize: "2.5rem", color: "#1890ff" }} />
          </div>

          <Title
            level={2}
            className="text-center"
            style={{ color: "#1d4ed8", marginBottom: 24 }}
          >
            Start Your Travel Journey
          </Title>

          <Form
            layout="vertical"
            onFinish={onFinish}
            requiredMark={false}
            style={{ borderRadius: 24 }} // border-radius for the form wrapper (optional)
          >
            <Row gutter={16}>
              <Col xs={24} md={12}>
                <Form.Item
                  name="username"
                  label={<strong>Username</strong>}
                  rules={[{ required: true, message: "Please enter username" }]}
                  style={{ borderRadius: 24 }}
                >
                  <Input
                    placeholder="JohnDoe"
                    style={{ borderRadius: 12 }} // rounded input corners
                  />
                </Form.Item>

                <Form.Item
                  name="email"
                  label={<strong>Email</strong>}
                  rules={[
                    { required: true, message: "Please enter email" },
                    { type: "email", message: "Invalid email format" },
                  ]}
                >
                  <Input
                    placeholder="you@example.com"
                    style={{ borderRadius: 12 }}
                  />
                </Form.Item>

                <Form.Item
                  name="password"
                  label={<strong>Password</strong>}
                  rules={[{ required: true, message: "Please enter password" }]}
                >
                  <Input.Password
                    placeholder="Enter password"
                    style={{ borderRadius: 12 }}
                  />
                </Form.Item>
              </Col>

              <Col xs={24} md={12}>
                <Form.Item
                  name="address"
                  label={<strong>Address</strong>}
                  rules={[{ required: true, message: "Please enter address" }]}
                >
                  <Input.TextArea
                    rows={3}
                    maxLength={200}
                    placeholder="Enter your address"
                    showCount
                    style={{ borderRadius: 12 }}
                  />
                </Form.Item>

                <Form.Item
                  name="phone"
                  label={<strong>Phone</strong>}
                  rules={[
                    { required: true, message: "Please enter phone number" },
                    {
                      pattern: /^[0-9]{10,15}$/,
                      message: "Enter a valid phone number",
                    },
                  ]}
                >
                  <Input
                    placeholder="e.g., 1234567890"
                    style={{ borderRadius: 12 }}
                  />
                </Form.Item>
              </Col>
            </Row>

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                block
                className="bg-blue-600 hover:bg-blue-700"
                style={{
                  height: "40px",
                  fontWeight: 600,
                  borderRadius: 12,
                }}
              >
                Signup
              </Button>
            </Form.Item>

            <Space direction="vertical" className="w-full text-center mt-3">
              <Text>
                Already have an account?{" "}
                <Link to="/login">
                  <Text underline type="primary">
                    Login
                  </Text>
                </Link>
              </Text>
            </Space>
          </Form>
        </Card>
      </div>
    </div>
  );
};

export default Signup;
