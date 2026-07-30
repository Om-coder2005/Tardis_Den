import { v2 as cloudinary } from 'cloudinary';

const isCloudinaryConfigured = (): boolean => {
  return Boolean(
    process.env.CLOUDINARY_URL ||
    (process.env.CLOUDINARY_CLOUD_NAME &&
     process.env.CLOUDINARY_API_KEY &&
     process.env.CLOUDINARY_API_SECRET)
  );
};

if (isCloudinaryConfigured()) {
  if (process.env.CLOUDINARY_URL) {
    cloudinary.config({
      cloudinary_url: process.env.CLOUDINARY_URL,
    });
  } else {
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });
  }
}

export interface CloudinaryUploadResult {
  url: string;
  publicId?: string;
}

export const CloudinaryService = {
  isConfigured(): boolean {
    return isCloudinaryConfigured();
  },

  async uploadBase64(base64Data: string, folder: string = 'the_space_uploads'): Promise<CloudinaryUploadResult | null> {
    if (!this.isConfigured()) {
      return null;
    }

    try {
      const dataUri = base64Data.startsWith('data:') 
        ? base64Data 
        : `data:image/png;base64,${base64Data}`;

      const res = await cloudinary.uploader.upload(dataUri, {
        folder,
        resource_type: 'auto',
      });

      return {
        url: res.secure_url,
        publicId: res.public_id,
      };
    } catch (error) {
      console.error('Cloudinary upload failure, falling back to local storage:', error);
      return null;
    }
  },

  async uploadBuffer(buffer: Buffer, folder: string = 'the_space_uploads'): Promise<CloudinaryUploadResult | null> {
    if (!this.isConfigured()) {
      return null;
    }

    return new Promise((resolve) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        { folder, resource_type: 'auto' },
        (error, result) => {
          if (error || !result) {
            console.error('Cloudinary stream upload failure, falling back to local storage:', error);
            resolve(null);
          } else {
            resolve({
              url: result.secure_url,
              publicId: result.public_id,
            });
          }
        }
      );
      uploadStream.end(buffer);
    });
  }
};
