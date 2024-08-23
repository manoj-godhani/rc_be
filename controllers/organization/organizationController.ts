import { NextFunction, Response } from "express";

import { AppError, handleError } from "../../utils/erroHandler";
import {
  createOrganizationSchema,
  getAllNotification,
  updateOrganizationSchema,
} from "../../services/organization/organizationValidation";
import {
  createOrganizationService,
  deleteOrganizationService,
  getAllNotificationById,
  getAllOrganization,
  getOrganizationService,
  getOrganizationsForMember,
  isOrganizationExists,
  isOrganizationNameUnique,
  isUpdateOrganizationNameUnique,
  updateOrganizationService,
} from "../../services/organization/organizationService";
import { MESSEGES } from "../../constants/index";
import Joi from "joi";

class OrganizationController {
  private validate(schema: Joi.ObjectSchema, data: any) {
    const { error } = schema.validate(data);
    if (error) {
      throw new AppError(error.details[0].message, 400);
    }
  }

  async createOrganization(req: any, res: Response) {
    try {
      this.validate(createOrganizationSchema, req.body);

      const { name, description, phone, email } = req.body;
      const user = req.user;

      if (!user) {
        throw new AppError(MESSEGES.USER_UNAUTHORIZED, 401);
      }

      const userHasOrganization = await isOrganizationExists(user.id);

      if (userHasOrganization) {
        throw new AppError(MESSEGES.ORGANIZATION_ALREADY_EXISTS, 400);
      }

      const isUniqueName = await isOrganizationNameUnique(name);
      if (!isUniqueName) {
        throw new AppError(MESSEGES.ALREADY_ORGANIZATION_NAME, 400);
      }

      const data = await createOrganizationService({
        name,
        description,
        phone,
        email,
        userId: user.id,
      });

      return res.status(201).json({
        isSuccess: true,
        message: MESSEGES.ORGANIZATION_CREATED,
        organization: data,
      });
    } catch (error) {
      const { statusCode, message } = handleError(error);
      return res.status(statusCode).json({ isSuccess: false, message });
    }
  }

  async getOrganization(req: any, res: Response) {
    try {
      const user = req.user;

      if (!user) {
        throw new AppError(MESSEGES.USER_UNAUTHORIZED, 401);
      }

      const userId = user.id;
      let organizations;
      if (user.account_type === "member") {
        organizations = await getOrganizationsForMember(userId);
      } else {
        organizations = await getAllOrganization("owner_id", userId);
      }
      return res.status(200).json({
        isSuccess: true,
        organizations,
      });
    } catch (error) {
      const { statusCode, message } = handleError(error);
      return res.status(statusCode).json({ isSuccess: false, message });
    }
  }

  async deleteOrganization(req: any, res: Response) {
    try {
      const { organizationId } = req.params;

      const userId = req.user?.id;

      const organization = await getOrganizationService("id", organizationId);
      if (!organization) {
        throw new AppError(MESSEGES.ORGANIZATION_NOT_FOUND, 404);
      }
      if (organization.owner_id !== userId) {
        throw new AppError(MESSEGES.NOT_ORGANIZATION_OWNER, 403);
      }

      const respone = await deleteOrganizationService(organizationId);

      return res.status(200).json({
        isSuccess: true,
        message: MESSEGES.ORGANIZATION_DELETED,
      });
    } catch (error) {
      const { statusCode, message } = handleError(error);
      return res.status(statusCode).json({ isSuccess: false, message });
    }
  }

  async updateOrganization(req: any, res: Response) {
    try {
      this.validate(updateOrganizationSchema, req.body);

      const { organizationId, name, description } = req.body;
      const userId = req.user?.id;

      if (!organizationId) {
        throw new AppError(MESSEGES.ORGANIZATION_NOT_FOUND, 404);
      }
      const organization = await getOrganizationService("id", organizationId);
      if (organization.owner_id !== userId) {
        throw new AppError(MESSEGES.NOT_ORGANIZATION_OWNER, 403);
      }

      if (!organization) {
        throw new AppError(MESSEGES.ORGANIZATION_NOT_FOUND, 404);
      }

      const isUniqueName = await isUpdateOrganizationNameUnique(
        name,
        organizationId
      );
      if (!isUniqueName) {
        throw new AppError(MESSEGES.ALREADY_ORGANIZATION_NAME, 400);
      }

      const updatedOrganization = await updateOrganizationService(
        organizationId,
        {
          name,
          description,
        }
      );

      return res.status(200).json({
        isSuccess: true,
        message: MESSEGES.ORGANIZATION_UPDATED,
        organization: updatedOrganization,
      });
    } catch (error) {
      const { statusCode, message } = handleError(error);
      return res.status(statusCode).json({ isSuccess: false, message });
    }
  }

  async subscriptionNotification(req: any, res: Response, next: NextFunction) {
    try {
      this.validate(getAllNotification, { ...req.query });

      const { pageNo = 1, limit = 10 }: any = req.query;
      const pageNumber = parseInt(pageNo as string, 10);
      const limitNumber = parseInt(limit as string, 10);

      if (pageNumber < 1 || limitNumber < 5) {
        throw new AppError(MESSEGES.PAGE_LIMIT, 400);
      }

      const user = req.user;
      if (!user) {
        throw new AppError(MESSEGES.USER_UNAUTHORIZED, 401);
      }
      const { data, count } = await getAllNotificationById(
        user?.email,
        pageNumber,
        limitNumber
      );

      return res.status(200).json({
        isSuccess: true,
        data: data,
        totalDocuments: count,
      });
    } catch (error) {
      const { statusCode, message } = handleError(error);
      return res.status(statusCode).json({ isSuccess: false, message });
    }
  }
}

export default OrganizationController;
