import Joi from "joi";




export const createOrganizationSchema = Joi.object({
    name: Joi.string().min(3).max(100).required(),
    description: Joi.string().max(1500).optional().allow(""),
    phone: Joi.string().max(20).optional().allow(""),
    email: Joi.string().email().optional().allow(""),

});
export const updateOrganizationSchema = Joi.object({
    organizationId:Joi.number().required(),
    name: Joi.string().min(3).max(30).required(),
    description: Joi.string().max(500).optional().allow(""),
    phone: Joi.string().min(10).max(15).optional().allow(""),
    email: Joi.string().email().optional().allow(""),
  });
  export const getAllNotification = Joi.object({
    pageNo: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).default(10),
  });