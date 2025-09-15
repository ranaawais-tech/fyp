import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  loginStart,
  loginSuccess,
  loginFailure,
} from "../redux/user/userSlice.js";
import { Form, Input, Button, Typography, Card, Space, message } from "antd";

const { Title, Text } = Typography;

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading } = useSelector((state) => state.user);

  const [form] = Form.useForm();

  // Reset loading state on mount
  useEffect(() => {
    dispatch(loginFailure(null)); // Reset loading and error
  }, [dispatch]);

  const onFinish = async (values) => {
    try {
      dispatch(loginStart());
      const res = await fetch(`/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const data = await res.json();

      if (data?.success) {
        dispatch(loginSuccess(data?.user));
        message.success(data?.message || "Login successful!");
        navigate("/");
      } else {
        dispatch(loginFailure(data?.message));
        message.error(data?.message || "Login failed");
        form.resetFields(); // Reset form fields on failure
      }
    } catch (error) {
      dispatch(loginFailure(error.message));
      message.error("Something went wrong");
      form.resetFields(); // Reset form fields on error
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4 bg-cover bg-center"
      style={{
        backgroundImage:
          "url('https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1500&q=80')",
      }}
    >
      <Card
        variant="borderless"
        className="w-full max-w-md shadow-2xl backdrop-blur-md"
        style={{
          backgroundColor: "rgba(255, 255, 255, 0.85)",
          borderRadius: 16,
          boxShadow: "0 8px 24px rgba(0, 0, 0, 0.2)",
        }}
      >
        <Title
          level={2}
          className="text-center mb-6"
          style={{
            color: "#1e3a8a",
            fontWeight: "bold",
            fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
          }}
        >
          Welcome Back, Explorer!
        </Title>

        <Form
          form={form}
          name="loginForm"
          layout="vertical"
          onFinish={onFinish}
          requiredMark={false}
        >
          <Form.Item
            name="email"
            label={<strong>Email</strong>}
            rules={[
              { required: true, message: "Please input your email!" },
              { type: "email", message: "Enter a valid email!" },
            ]}
          >
            <Input
              placeholder="you@example.com"
              className="rounded-md"
              style={{ padding: "10px" }}
            />
          </Form.Item>

          <Form.Item
            name="password"
            label={<strong>Password</strong>}
            rules={[{ required: true, message: "Please input your password!" }]}
          >
            <Input.Password
              placeholder="Enter password"
              className="rounded-md"
              style={{ padding: "10px" }}
            />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              block
              className="rounded-md"
              style={{
                backgroundColor: "#1e40af",
                borderColor: "#1e40af",
                height: "40px",
              }}
            >
              {loading ? "Logging in..." : "Login"}
            </Button>
          </Form.Item>

          <Space direction="vertical" className="w-full text-center">
            <Text>
              Don't have an account?{" "}
              <Link to="/signup">
                <Text underline type="primary">
                  Sign Up
                </Text>
              </Link>
            </Text>
          </Space>
        </Form>
      </Card>
    </div>
  );
};

export default Login;
