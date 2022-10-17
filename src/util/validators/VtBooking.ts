import Joi from 'joi';
import { VtBooking } from '../../interfaces/VtBooking';
import logger from '../logger';

const schema = Joi.object().keys({
  name: Joi.string().required(),
  bookingDate: Joi.date().required(),
  vrm: Joi.string(),
  trailerId: Joi.string(),
  testCode: Joi.string().required(),
  testDate: Joi.date().required(),
  pNumber: Joi.string().required(),
}).xor('vrm', 'trailerId');

export const validateVtBooking = (vtBooking: unknown): VtBooking => {
  const validationResult = schema.validate(vtBooking, { abortEarly: false });
  if (validationResult.error) {
    logger.error(
      validationResult.error.details.map(
        (detail: { message: string }) => detail.message,
      ),
    );

    throw new Error('Invalid event received.');
  }

  return vtBooking as VtBooking;
};
