import prisma from '../../config/db.js';
import { sendSuccess, sendError } from '../../utils/response.js';

export const getAddresses = async (req, res) => {
  try {
    const userId = req.user.id;
    const addresses = await prisma.address.findMany({
      where: { userId },
    });
    return sendSuccess(res, 200, { addresses }, 'Addresses fetched');
  } catch (error) {
    return sendError(res, 500, error.message);
  }
};

export const addAddress = async (req, res) => {
  try {
    const userId = req.user.id;
    const { fullName, phone, street, city, state, pincode, isDefault } = req.body;

    const cleanPhone = (phone || '').toString().trim().replace(/\D/g, '');
    if (!/^[6-9]\d{9}$/.test(cleanPhone)) {
      return sendError(res, 400, 'Enter a valid 10-digit mobile number');
    }

    if (isDefault) {
      await prisma.address.updateMany({
        where: { userId },
        data: { isDefault: false },
      });
    }

    const address = await prisma.address.create({
      data: {
        userId,
        fullName,
        phone: cleanPhone,
        street,
        city,
        state,
        pincode,
        isDefault: !!isDefault,
      },
    });

    return sendSuccess(res, 201, { address }, 'Address added successfully');
  } catch (error) {
    return sendError(res, 400, error.message);
  }
};

export const updateAddress = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;
    const { fullName, phone, street, city, state, pincode, isDefault } = req.body;

    const existingAddress = await prisma.address.findFirst({
      where: { id, userId },
    });

    if (!existingAddress) {
      return sendError(res, 404, 'Address not found or unauthorized');
    }

    let cleanPhone = undefined;
    if (phone !== undefined) {
      cleanPhone = (phone || '').toString().trim().replace(/\D/g, '');
      if (!/^[6-9]\d{9}$/.test(cleanPhone)) {
        return sendError(res, 400, 'Enter a valid 10-digit mobile number');
      }
    }

    if (isDefault) {
      await prisma.address.updateMany({
        where: { userId },
        data: { isDefault: false },
      });
    }

    const address = await prisma.address.update({
      where: { id },
      data: {
        fullName,
        phone: cleanPhone !== undefined ? cleanPhone : existingAddress.phone,
        street,
        city,
        state,
        pincode,
        isDefault,
      },
    });

    return sendSuccess(res, 200, { address }, 'Address updated successfully');
  } catch (error) {
    return sendError(res, 400, error.message);
  }
};

export const deleteAddress = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    const existingAddress = await prisma.address.findFirst({
      where: { id, userId },
    });

    if (!existingAddress) {
      return sendError(res, 404, 'Address not found or unauthorized');
    }

    await prisma.address.delete({ where: { id } });
    return sendSuccess(res, 200, {}, 'Address deleted');
  } catch (error) {
    return sendError(res, 400, error.message);
  }
};
