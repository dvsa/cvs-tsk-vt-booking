import Joi from 'joi';
import logger from '../logger';

const schema = Joi.object().keys({
  name: Joi.string().required(),
  bookingDate: Joi.date().required(),
  vrm: Joi.string().required(),
  testCode: Joi.string().required(),
  testDate: Joi.date().required(),
  pNumber: Joi.string().required(),
});

export const validateVtBooking = (vtBooking: unknown) => {
  const validationResult = schema.validate(vtBooking, { abortEarly: false });
  if (validationResult.error) {
    logger.error(
      validationResult.error.details.map(
        (detail: { message: string }) => detail.message,
      ),
    );

    throw new Error('Invalid event received.');
  }
};
