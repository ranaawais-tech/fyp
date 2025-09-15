import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  updateUserStart,
  updateUserSuccess,
  updateUserFailure,
  updatePassStart,
  updatePassSuccess,
  updatePassFailure,
} from "../../redux/user/userSlice";
import {
  Card,
  Form,
  Input,
  Button,
  Typography,
  Tabs,
  message,
  Space,
} from "antd";
import {
  LockOutlined,
  UserOutlined,
  MailOutlined,
  HomeOutlined,
  PhoneOutlined,
} from "@ant-design/icons";

const { Title } = Typography;
const { TabPane } = Tabs;

const UpdateProfile = () => {
  const dispatch = useDispatch();
  const { currentUser, loading } = useSelector((state) => state.user);

  const [form] = Form.useForm();
  const [passwordForm] = Form.useForm();

  const [updatePassword, setUpdatePassword] = useState({
    oldpassword: "",
    newpassword: "",
  });

  useEffect(() => {
    if (currentUser) {
      form.setFieldsValue({
        username: currentUser.username,
        email: currentUser.email,
        address: currentUser.address,
        phone: currentUser.phone,
      });
    }
  }, [currentUser, form]);

  const handleProfileSubmit = async (values) => {
    const hasChanges = Object.keys(values).some(
      (key) => values[key] !== currentUser[key]
    );

    if (!hasChanges) {
      message.warning("Please change at least one field before submitting.");
      return;
    }

    try {
      dispatch(updateUserStart());

      const res = await fetch(`/api/user/update/${currentUser._id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      const data = await res.json();

      if (!data.success) {
        dispatch(updateUserFailure(data.message));
        message.error("Session expired. Please login again.");
        return;
      }

      dispatch(updateUserSuccess(data.user));
      message.success(data.message);
    } catch (err) {
      dispatch(updateUserFailure(err.message));
      message.error("Something went wrong.");
    }
  };

  const handlePasswordSubmit = async () => {
    const { oldpassword, newpassword } = updatePassword;

    if (!oldpassword || !newpassword) {
      message.warning("Please fill both fields.");
      return;
    }

    if (oldpassword === newpassword) {
      message.warning("New password cannot be the same as old password.");
      return;
    }

    try {
      dispatch(updatePassStart());

      const res = await fetch(`/api/user/update-password/${currentUser._id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatePassword),
      });

      const data = await res.json();

      if (!data.success) {
        dispatch(updatePassFailure(data.message));
        message.error("Session expired. Please login again.");
        return;
      }

      dispatch(updatePassSuccess());
      setUpdatePassword({ oldpassword: "", newpassword: "" });
      passwordForm.resetFields();
      message.success(data.message);
    } catch (err) {
      dispatch(updatePassFailure(err.message));
      message.error("Something went wrong.");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-[80vh] bg-gradient-to-br from-indigo-100 to-purple-100 py-10">
      <Card
        bordered={false}
        className="w-full max-w-md shadow-2xl rounded-xl bg-white"
        title={
          <Title level={3} className="text-center !mb-0">
            Profile Settings
          </Title>
        }
      >
        <Tabs defaultActiveKey="1" centered>
          <TabPane tab="Update Profile" key="1">
            <Form
              form={form}
              layout="vertical"
              onFinish={handleProfileSubmit}
              requiredMark="optional"
            >
              <Form.Item
                label="Username"
                name="username"
                rules={[{ required: true, message: "Please enter a username" }]}
              >
                <Input prefix={<UserOutlined />} />
              </Form.Item>

              <Form.Item
                label="Email"
                name="email"
                rules={[
                  { required: true, message: "Please enter an email" },
                  { type: "email", message: "Invalid email address" },
                ]}
              >
                <Input prefix={<MailOutlined />} />
              </Form.Item>

              <Form.Item
                label="Address"
                name="address"
                rules={[{ required: true, message: "Please enter an address" }]}
              >
                <Input.TextArea prefix={<HomeOutlined />} rows={3} />
              </Form.Item>

              <Form.Item
                label="Phone"
                name="phone"
                rules={[
                  { required: true, message: "Please enter a phone number" },
                  {
                    pattern: /^[0-9]{10,15}$/,
                    message: "Invalid phone number",
                  },
                ]}
              >
                <Input prefix={<PhoneOutlined />} />
              </Form.Item>

              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  block
                  loading={loading}
                >
                  Update Profile
                </Button>
              </Form.Item>
            </Form>
          </TabPane>

          <TabPane tab="Change Password" key="2">
            <Form
              form={passwordForm}
              layout="vertical"
              onFinish={handlePasswordSubmit}
              requiredMark="optional"
            >
              <Form.Item label="Old Password" required>
                <Input.Password
                  prefix={<LockOutlined />}
                  value={updatePassword.oldpassword}
                  onChange={(e) =>
                    setUpdatePassword({
                      ...updatePassword,
                      oldpassword: e.target.value,
                    })
                  }
                />
              </Form.Item>

              <Form.Item label="New Password" required>
                <Input.Password
                  prefix={<LockOutlined />}
                  value={updatePassword.newpassword}
                  onChange={(e) =>
                    setUpdatePassword({
                      ...updatePassword,
                      newpassword: e.target.value,
                    })
                  }
                />
              </Form.Item>

              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  block
                  loading={loading}
                >
                  Update Password
                </Button>
              </Form.Item>
            </Form>
          </TabPane>
        </Tabs>
      </Card>
    </div>
  );
};

export default UpdateProfile;
