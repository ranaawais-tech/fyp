import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import {
  Form,
  Input,
  InputNumber,
  Checkbox,
  Upload,
  Button,
  Select,
  Typography,
  message,
  Spin,
  Image,
  Space,
} from "antd";
import { UploadOutlined, DeleteOutlined } from "@ant-design/icons";

const { TextArea } = Input;
const { Title } = Typography;

const UpdatePackage = () => {
  const [form] = Form.useForm();
  const params = useParams();
  const navigate = useNavigate();
  const [packageImages, setPackageImages] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(false);

  const cloudName = "dckbljq0f";
  const uploadPreset = "user_profile_photo";

  useEffect(() => {
    if (params.id) getPackageData();
  }, [params.id]);

  const getPackageData = async () => {
    try {
      const res = await fetch(`/api/package/get-package-data/${params.id}`);
      const data = await res.json();
      if (data.success) {
        const pkg = data.packageData;
        form.setFieldsValue(pkg);
        setPackageImages(pkg.packageImages || []);
      } else {
        message.error(data.message || "Something went wrong!");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const storeImageToCloudinary = async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", uploadPreset);
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
      {
        method: "POST",
        body: formData,
      }
    );
    const data = await response.json();
    if (!data.secure_url) throw new Error("Upload failed");
    return data.secure_url;
  };

  const handleImageUpload = async ({ file, onSuccess, onError }) => {
    try {
      setUploading(true);
      const url = await storeImageToCloudinary(file);
      setPackageImages((prev) => [...prev, url]);
      onSuccess("ok");
      message.success("Image uploaded successfully");
    } catch (err) {
      onError(err);
      message.error("Image upload failed");
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteImage = (url) => {
    setPackageImages((prev) => prev.filter((img) => img !== url));
  };

  const onFinish = async (values) => {
    if (packageImages.length === 0) {
      message.error("At least one image is required");
      return;
    }

    if (
      values.packageOffer &&
      values.packageDiscountPrice >= values.packagePrice
    ) {
      message.error("Discount price must be less than regular price");
      return;
    }

    const finalData = {
      ...values,
      packageImages,
      packageDiscountPrice: values.packageOffer
        ? values.packageDiscountPrice
        : 0,
    };

    try {
      setLoading(true);
      const res = await fetch(`/api/package/update-package/${params.id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(finalData),
      });
      const data = await res.json();
      if (data.success) {
        message.success(data.message);
        navigate(`/package/${params.id}`);
      } else {
        message.error(data.message);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto mt-20">
      <Title level={2} className="text-center">
        Update Package
      </Title>
      <Spin spinning={loading}>
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          initialValues={{
            packageDays: 1,
            packageNights: 1,
            packageOffer: false,
            packagePrice: 500,
            packageDiscountPrice: 0,
          }}
        >
          <Form.Item
            name="packageName"
            label="Package Name"
            rules={[{ required: true }]}
          >
            {" "}
            <Input />{" "}
          </Form.Item>
          <Form.Item
            name="packageDescription"
            label="Description"
            rules={[{ required: true }]}
          >
            {" "}
            <TextArea rows={3} />{" "}
          </Form.Item>
          <Form.Item
            name="packageDestination"
            label="Destination"
            rules={[{ required: true }]}
          >
            {" "}
            <Input />{" "}
          </Form.Item>
          <Form.Item
            name="packageAccommodation"
            label="Accommodation"
            rules={[{ required: true }]}
          >
            {" "}
            <TextArea rows={2} />{" "}
          </Form.Item>
          <Form.Item
            name="packageTransportation"
            label="Transportation"
            rules={[{ required: true }]}
          >
            <Select>
              <Select.Option value="Flight">Flight</Select.Option>
              <Select.Option value="Train">Train</Select.Option>
              <Select.Option value="Boat">Boat</Select.Option>
              <Select.Option value="Other">Other</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item
            name="packageMeals"
            label="Meals"
            rules={[{ required: true }]}
          >
            {" "}
            <TextArea rows={2} />{" "}
          </Form.Item>
          <Form.Item
            name="packageActivities"
            label="Activities"
            rules={[{ required: true }]}
          >
            {" "}
            <TextArea rows={2} />{" "}
          </Form.Item>

          <Form.Item
            name="packageDays"
            label="Days"
            rules={[{ required: true }]}
          >
            {" "}
            <InputNumber min={1} className="w-full" />{" "}
          </Form.Item>
          <Form.Item
            name="packageNights"
            label="Nights"
            rules={[{ required: true }]}
          >
            {" "}
            <InputNumber min={1} className="w-full" />{" "}
          </Form.Item>
          <Form.Item
            name="packagePrice"
            label="Price"
            rules={[{ required: true, type: "number", min: 500 }]}
          >
            {" "}
            <InputNumber className="w-full" />{" "}
          </Form.Item>
          <Form.Item name="packageOffer" valuePropName="checked">
            <Checkbox>Offer</Checkbox>
          </Form.Item>

          <Form.Item
            shouldUpdate={(prev, curr) =>
              prev.packageOffer !== curr.packageOffer
            }
          >
            {({ getFieldValue }) =>
              getFieldValue("packageOffer") && (
                <Form.Item
                  name="packageDiscountPrice"
                  label="Discount Price"
                  rules={[{ required: true, type: "number" }]}
                >
                  <InputNumber className="w-full" />
                </Form.Item>
              )
            }
          </Form.Item>

          <Form.Item label="Upload Images">
            <Upload
              customRequest={handleImageUpload}
              multiple
              showUploadList={false}
              accept="image/*"
              disabled={uploading || packageImages.length >= 5}
            >
              <Button icon={<UploadOutlined />}>Upload (Max 5)</Button>
            </Upload>
          </Form.Item>

          <Space wrap>
            {packageImages.map((url, index) => (
              <div key={index} className="relative">
                <Image
                  src={url}
                  width={100}
                  height={100}
                  style={{ borderRadius: 8 }}
                />
                <Button
                  type="text"
                  danger
                  icon={<DeleteOutlined />}
                  onClick={() => handleDeleteImage(url)}
                >
                  Delete
                </Button>
              </div>
            ))}
          </Space>

          <Form.Item className="mt-4">
            <Button
              type="primary"
              htmlType="submit"
              loading={loading || uploading}
              disabled={uploading}
              block
            >
              Update Package
            </Button>
          </Form.Item>
        </Form>
      </Spin>
    </div>
  );
};

export default UpdatePackage;
