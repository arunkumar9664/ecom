import prisma from '../../config/db.js';
import { sendSuccess, sendError } from '../../utils/response.js';

export const getStoreSettings = async (req, res) => {
  try {
    let settings = await prisma.storeSettings.findUnique({
      where: { id: 1 },
    });

    if (!settings) {
      settings = await prisma.storeSettings.findFirst();
    }

    if (!settings) {
      settings = await prisma.storeSettings.create({
        data: {
          id: 1,
          phone: "+919116655814",
          displayPhone: "+91 91166 55814",
          email: "surangi.naar@gmail.com",
          instagram: "https://www.instagram.com/surangi.naar",
          instagramHandle: "@surangi.naar",
          facebook: "https://www.facebook.com/profile.php?id=1274421192401737&hr=1&wtsid=rdr_0GcwbFGifB7kgtTxr",
          whatsapp: "https://wa.me/919116655814",
          address: "13-16, Paras Apartment, Chopra Enclave, Mangyawas, Mansarovar, Jaipur, Rajasthan, India",
          googleMaps: "https://maps.app.goo.gl/9kU8jVfN7ZBhj5fG9",
          hours: "Mon - Sat: 10:30 AM - 7:30 PM IST",
          shippingFee: 250,
          freeShippingThreshold: 5000,
        },
      });
    }

    return sendSuccess(res, 200, { settings }, 'Store settings fetched successfully');
  } catch (error) {
    return sendError(res, 500, error.message);
  }
};
