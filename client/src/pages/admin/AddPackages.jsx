import React, { useState } from "react";
import {
  Form,
  Input,
  InputNumber,
  Checkbox,
  Button,
  Upload,
  Select,
  Typography,
  Alert,
  Progress,
  Image,
  Space,
  Row,
  Col,
  Divider,
  Card,
} from "antd";
import { UploadOutlined, DeleteOutlined } from "@ant-design/icons";

const { TextArea } = Input;
const { Title, Text } = Typography;

const AddPackages = () => {
  const [formData, setFormData] = useState({
    packageName: "",
    packageDescription: "",
    packageDestination: "",
    packageDays: 1,
    packageNights: 1,
    packageAccommodation: "",
    packageTransportation: "",
    packageMeals: "",
    packageActivities: "",
    packagePrice: 500,
    packageDiscountPrice: 0,
    packageOffer: false,
    packageImages: [],
  });

  const [images, setImages] = useState([]);
  const [imageUploadError, setImageUploadError] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [imageUploadPercent, setImageUploadPercent] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const handleChange = (e) => {
    const { id, value, checked, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: type === "checkbox" ? checked : value,
    }));
  };

  const handleImageSubmit = async () => {
    if (
      images.length > 0 &&
      images.length + formData.packageImages.length <= 5
    ) {
      setUploading(true);
      setImageUploadError(false);
      const uploadedUrls = [];

      for (let i = 0; i < images.length; i++) {
        const file = images[i];
        if (file.size > 2 * 1024 * 1024) {
          setImageUploadError("Each image must be under 2MB.");
          setUploading(false);
          return;
        }

        const formDataImage = new FormData();
        formDataImage.append("file", file);
        formDataImage.append("upload_preset", "user_profile_photo");

        try {
          const res = await fetch(
            "https://api.cloudinary.com/v1_1/dckbljq0f/image/upload",
            {
              method: "POST",
              body: formDataImage,
            }
          );

          const data = await res.json();
          if (data.secure_url) {
            uploadedUrls.push(data.secure_url);
          } else {
            throw new Error("Upload failed");
          }

          setImageUploadPercent(Math.floor(((i + 1) / images.length) * 100));
        } catch (err) {
          console.error(err);
          setImageUploadError("Image upload failed (2MB max per image).");
          setUploading(false);
          return;
        }
      }

      setFormData((prev) => ({
        ...prev,
        packageImages: prev.packageImages.concat(uploadedUrls),
      }));
      setUploading(false);
      setImages([]);
    } else {
      setImageUploadError("You can only upload up to 5 images.");
    }
  };

  const handleDeleteImage = (index) => {
    setFormData((prev) => ({
      ...prev,
      packageImages: prev.packageImages.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.packageImages.length === 0) {
      alert("You must upload at least 1 image");
      return;
    }

    if (
      formData.packageName === "" ||
      formData.packageDescription === "" ||
      formData.packageDestination === "" ||
      formData.packageAccommodation === "" ||
      formData.packageTransportation === "" ||
      formData.packageMeals === "" ||
      formData.packageActivities === "" ||
      formData.packagePrice === 0
    ) {
      alert("All fields are required!");
      return;
    }

    if (formData.packagePrice < 0) {
      alert("Price should be greater than 500!");
      return;
    }

    if (formData.packageDiscountPrice >= formData.packagePrice) {
      alert("Regular Price should be greater than Discount Price!");
      return;
    }

    if (!formData.packageOffer) {
      formData.packageDiscountPrice = 0;
    }

    try {
      setLoading(true);
      setError(false);

      const res = await fetch("/api/package/create-package", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (data?.success === false) {
        setError(data?.message);
        setLoading(false);
        return;
      }

      alert(data?.message || "Package added!");
      setLoading(false);
      setError(false);
      setFormData({
        packageName: "",
        packageDescription: "",
        packageDestination: "",
        packageDays: 1,
        packageNights: 1,
        packageAccommodation: "",
        packageTransportation: "",
        packageMeals: "",
        packageActivities: "",
        packagePrice: 500,
        packageDiscountPrice: 0,
        packageOffer: false,
        packageImages: [],
      });
      setImages([]);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  return (
    <Row justify="center" className="mt-20">
      <Col xs={24} md={20} lg={14}>
        <Card bordered className="shadow-lg">
          <Title level={2} className="text-center">
            Add Package
          </Title>
          <Form layout="vertical" onSubmitCapture={handleSubmit}>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item label="Name">
                  <Input
                    id="packageName"
                    value={formData.packageName}
                    onChange={handleChange}
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="Destination">
                  <Input
                    id="packageDestination"
                    value={formData.packageDestination}
                    onChange={handleChange}
                  />
                </Form.Item>
              </Col>
            </Row>

            <Form.Item label="Description">
              <TextArea
                id="packageDescription"
                rows={3}
                value={formData.packageDescription}
                onChange={handleChange}
              />
            </Form.Item>

            <Row gutter={16}>
              <Col span={12}>
                <Form.Item label="Days">
                  <InputNumber
                    id="packageDays"
                    min={1}
                    className="w-full"
                    value={formData.packageDays}
                    onChange={(value) =>
                      handleChange({ target: { id: "packageDays", value } })
                    }
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="Nights">
                  <InputNumber
                    id="packageNights"
                    min={1}
                    className="w-full"
                    value={formData.packageNights}
                    onChange={(value) =>
                      handleChange({ target: { id: "packageNights", value } })
                    }
                  />
                </Form.Item>
              </Col>
            </Row>

            {["Accommodation", "Meals", "Activities"].map((field) => (
              <Form.Item key={field} label={field}>
                <TextArea
                  id={`package${field}`}
                  rows={2}
                  value={formData[`package${field}`]}
                  onChange={handleChange}
                />
              </Form.Item>
            ))}

            <Form.Item label="Transportation">
              <Select
                id="packageTransportation"
                value={formData.packageTransportation}
                onChange={(value) =>
                  handleChange({
                    target: { id: "packageTransportation", value },
                  })
                }
              >
                {["Select", "Bus", "Flight", "Car", "Other"].map((option) => (
                  <Select.Option key={option} value={option}>
                    {option}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>

            <Row gutter={16}>
              <Col span={12}>
                <Form.Item label="Price">
                  <InputNumber
                    id="packagePrice"
                    min={500}
                    className="w-full"
                    value={formData.packagePrice}
                    onChange={(value) =>
                      handleChange({ target: { id: "packagePrice", value } })
                    }
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="Offer">
                  <Checkbox
                    id="packageOffer"
                    checked={formData.packageOffer}
                    onChange={handleChange}
                  >
                    Is Offer?
                  </Checkbox>
                </Form.Item>
              </Col>
            </Row>

            {formData.packageOffer && (
              <Form.Item label="Discount Price">
                <InputNumber
                  id="packageDiscountPrice"
                  min={0}
                  className="w-full"
                  value={formData.packageDiscountPrice}
                  onChange={(value) =>
                    handleChange({
                      target: { id: "packageDiscountPrice", value },
                    })
                  }
                />
              </Form.Item>
            )}

            <Form.Item label="Images">
              <Input
                type="file"
                multiple
                accept="image/*"
                onChange={(e) => setImages(e.target.files)}
              />
              <Text type="secondary">
                Images must be under 2MB, max 5 images allowed.
              </Text>
            </Form.Item>

            {imageUploadError && (
              <Alert type="error" message={imageUploadError} />
            )}
            {error && <Alert type="error" message={error} />}
            {uploading && <Progress percent={imageUploadPercent} />}

            <Space direction="vertical" style={{ width: "100%" }}>
              {images.length > 0 && (
                <Button
                  icon={<UploadOutlined />}
                  loading={uploading}
                  onClick={handleImageSubmit}
                  disabled={uploading || loading}
                >
                  Upload Images
                </Button>
              )}
              <Button
                type="primary"
                className="bg-blue-500"
                htmlType="submit"
                loading={loading}
                disabled={uploading || loading}
              >
                {loading ? "Adding Package..." : "Add Package"}
              </Button>
            </Space>

            {formData.packageImages.length > 0 && (
              <div style={{ marginTop: 24 }}>
                <Divider orientation="left">Uploaded Images</Divider>
                <Row gutter={[16, 16]}>
                  {formData.packageImages.map((url, i) => (
                    <Col key={i} span={6}>
                      <Card
                        cover={<Image src={url} alt="Uploaded" height={100} />}
                        actions={[
                          <DeleteOutlined
                            key="delete"
                            onClick={() => handleDeleteImage(i)}
                          />,
                        ]}
                      />
                    </Col>
                  ))}
                </Row>
              </div>
            )}
          </Form>
        </Card>
      </Col>
    </Row>
  );
};

export default AddPackages;
