import { Cloudinary } from "cloudinary-core";

const cloudinary = new Cloudinary({
  cloud_name: process.env.dckbljq0f, // Add your Cloudinary Cloud Name
  secure: true,
});

export default cloudinary;
