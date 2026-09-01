import cloudinary from '../../config/cloudinary.js';
import { sendSuccess, sendError } from '../../utils/response.js';

export const uploadImage = async (req, res) => {
  try {
    const file = req.file || (req.files && req.files[0]);
    if (!file) {
      return sendError(res, 400, 'No file uploaded');
    }

    // Streams multer file buffer directly to Cloudinary with auto-format and auto-quality
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: 'surangi_naar',
        resource_type: 'image',
        transformation: [
          { quality: 'auto', fetch_format: 'auto' }
        ],
      },
      (error, result) => {
        if (error) {
          console.error('Cloudinary Upload Error:', error);
          return sendError(res, 500, 'Image upload to Cloudinary failed', error);
        }
        let url = result.secure_url;
        if (url && url.includes('/upload/') && !url.includes('/f_auto,q_auto')) {
          url = url.replace('/upload/', '/upload/f_auto,q_auto/');
        }
        return sendSuccess(res, 200, { url }, 'Image uploaded successfully');
      }
    );

    uploadStream.end(file.buffer);
  } catch (error) {
    console.error('Upload Error:', error);
    return sendError(res, 500, error.message);
  }
};
