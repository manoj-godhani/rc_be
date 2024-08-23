import { NextFunction, Request, Response } from "express";
import { SupabaseClient } from "@supabase/supabase-js";
import Joi from "joi";
import { AppError, handleError } from "../../utils/erroHandler";
import { MESSEGES } from "../../constants/index";
import { nanoid } from "nanoid";

import {
  createTeam,
  updateTeam,
  fetchTeamById,
  createInviteUser,
  verifyInvitation,
  updateInvitationStatus,
  fetchAllTeams,
  fetchAllTeamMembers,
  deactivateTeamMember,
  deactivateTeam,
  isTeamNameUnique,
  updateTeamMemberRole,
  validateTeamOwnerRole,
} from "../../services/team/teamService";

import {
  createTeamSchema,
  updateTeamSchema,
  sendInvitationSchema,
  verifyInvitationSchema,
  getAllTeamMembersSchema,
  getAllTeamSchema,
  updateTeamMemberRoleSchema,
} from "../../services/team/teamValidation";
import { sendVerificationEmail } from "../../utils/email";
import {
  getOrganizationService,
  isOrganizationExists,
} from "../../services/organization/organizationService";
import {
  createUser,
  findSocialLoginByUidAndProvider,
  findUserByEmail,
} from "../../services/user/userServices";
import { createStripeCustomer } from "../../utils/stripe";

class TeamController {
  private validate(schema: Joi.ObjectSchema, data: any) {
    const { error } = schema.validate(data);
    if (error) {
      throw new AppError(error.details[0].message, 400);
    }
  }

  async createTeam(req: any, res: Response) {
    try {
      this.validate(createTeamSchema, req.body);

      const { name, description } = req.body;

      const user = req.user;

      if (!user) {
        throw new AppError(MESSEGES.USER_UNAUTHORIZED, 401);
      }
      const teamName = name.toLowerCase();

      const isUnique = await isTeamNameUnique(teamName);

      if (!isUnique) {
        throw new AppError(MESSEGES.ALREADY_TEAM_NAME, 400);
      }

      const organization = await getOrganizationService("owner_id", user?.id);

      if (!organization) {
        throw new AppError(MESSEGES.ORGANIZATION_NOT_FOUND, 400);
      }

      const data = await createTeam(
        teamName,
        description,
        user?.id,
        organization?.id
      );

      return res.status(201).json({
        isSuccess: true,
        message: MESSEGES.TEAM_CREATED,
        team: data,
      });
    } catch (error) {
      const { statusCode, message } = handleError(error);
      return res.status(statusCode).json({ isSuccess: false, message });
    }
  }

  async updateTeam(req: any, res: Response) {
    try {
      this.validate(updateTeamSchema, req.body);

      const { name, description, team_id } = req.body;

      const response: any = await fetchTeamById(team_id);

      if (response?.data?.name !== name) {
        const isUnique = await isTeamNameUnique(name);

        if (!isUnique) {
          throw new AppError(MESSEGES.UNIQUE_TEAM_NAME, 400);
        }
      }

      const data = await updateTeam(team_id, name, description);

      return res.status(200).json({
        isSuccess: true,
        message: MESSEGES.TEAM_UPDATED,
        team: data,
      });
    } catch (error) {
      const { statusCode, message } = handleError(error);
      return res.status(statusCode).json({ isSuccess: false, message });
    }
  }
  async sendInvitation(req: any, res: Response, next: NextFunction) {
    try {
      this.validate(sendInvitationSchema, req.body);

      const { team_id, email, role } = req.body;

      const user = req.user;

      const team = await fetchTeamById(team_id);

      if (team?.error) {
        throw new AppError(MESSEGES.TEAM_NOT_FOUND, 400);
      }

      if (user?.email === email) {
        throw new AppError(MESSEGES.OWNER_NOT_ALLOWED, 400);
      }

      if (role === "team_owner") {
        await validateTeamOwnerRole(team_id);
      }

      const resetToken = nanoid(100);
      const tokenExpiry = new Date(Date.now() + 3600 * 1000);

      const stripeResponse = await createStripeCustomer(email);

      let account_type = "member";

      const inivite = await createInviteUser(
        team_id,
        email,
        resetToken,
        tokenExpiry,
        role
      );

      await createUser({
        email,
        account_type,
        stripe_customer_id: stripeResponse,
        resetToken,
        token_expiry: tokenExpiry,
        is_email_verified: true,
        is_user_plan_active: true,
      });

      if (inivite) {
        await sendVerificationEmail(
          email,
          resetToken,
          "accountTeamEmailVerification",
          next
        );
      }

      return res.status(201).json({
        isSuccess: true,
        message: MESSEGES.INVITATION_SENT,
      });
    } catch (error) {
      const { statusCode, message } = handleError(error);
      return res.status(statusCode).json({ isSuccess: false, message });
    }
  }

  async verifyInvitation(req: Request, res: Response) {
    try {
      this.validate(verifyInvitationSchema, req.params);

      const { token }: any = req.params;

      const type: any = req.query.type;

      const invitationData = await verifyInvitation(token);

      if (invitationData?.token_expiry < new Date()) {
        throw new AppError(MESSEGES.INVITATION_EXPIRED, 400);
      }

      await updateInvitationStatus(invitationData?.id);
      return res.status(200).json({
        isSuccess: true,
        message: MESSEGES.INVITATION_VERIFIED,
        token,
      });
    } catch (error) {
      const { statusCode, message } = handleError(error);
      return res.status(statusCode).json({ isSuccess: false, message });
    }
  }

  async updateTeamMemberRoleHandler(
    req: any,
    res: Response,
    next: NextFunction
  ) {
    try {
      this.validate(updateTeamMemberRoleSchema, req.body);

      const { team_id, member_id, new_role } = req.body;

      if (new_role === "team_owner") {
        await validateTeamOwnerRole(team_id);
      }

      const updatedMember = await updateTeamMemberRole(
        team_id,
        member_id,
        new_role
      );

      return res.status(200).json({
        isSuccess: true,
        message: MESSEGES.UPDATE_TEAM_ROLE,
        member: updatedMember,
      });
    } catch (error) {
      const { statusCode, message } = handleError(error);
      return res.status(statusCode).json({ isSuccess: false, message });
    }
  }

  async getAllTeamMembers(req: any, res: Response) {
    try {
      this.validate(getAllTeamMembersSchema, { ...req.query });

      const { team_id, pageNo = 1, limit = 10, search = "" }: any = req.query;
      const pageNumber = parseInt(pageNo as string, 10);
      const limitNumber = parseInt(limit as string, 10);

      if (pageNumber < 1 || limitNumber < 5) {
        throw new AppError(MESSEGES.PAGE_LIMIT, 400);
      }

      const user = req.user;

      if (!user) {
        throw new AppError(MESSEGES.USER_UNAUTHORIZED, 401);
      }

      let memberFilter: any = {};
      if (user.account_type === "member") {
        memberFilter = { email: user.email };
      }

      const { data, count, error }: any = await fetchAllTeamMembers(
        team_id,
        pageNumber,
        limitNumber,
        search,
        memberFilter
      );
      if (error) {
        throw new AppError(error.message, 500);
      }

      const organization = await getOrganizationService("owner_id", user?.id);

      if (!organization) {
        return res.status(200).json({
          isSuccess: true,
          message: MESSEGES.TEAM_MEMBERS,
          members: [],
          totalMembers: count,
          totalPages: Math.ceil(count / limitNumber),
          currentPage: pageNumber,
        });
      }

      return res.status(200).json({
        isSuccess: true,
        message: MESSEGES.TEAM_MEMBERS,
        members: data,
        totalMembers: count,
        totalPages: Math.ceil(count / limitNumber),
        currentPage: pageNumber,
      });
    } catch (error) {
      const { statusCode, message } = handleError(error);
      return res.status(statusCode).json({ isSuccess: false, message });
    }
  }

  async getAllTeams(req: any, res: Response) {
    try {
      this.validate(getAllTeamSchema, { ...req.query });

      const { pageNo = "1", limit = "10", search = "" }: any = req.query;
      const pageNumber = parseInt(pageNo, 10);
      const limitNumber = parseInt(limit, 10);

      if (pageNumber < 1 || limitNumber < 5) {
        throw new AppError(MESSEGES.PAGE_LIMIT, 400);
      }

      const user = req.user;

      if (!user) {
        throw new AppError(MESSEGES.USER_UNAUTHORIZED, 401);
      }

      let teamFilter: any = {};
      if (user.account_type === "member") {
        teamFilter = { email: user.email };
      }
      const organization = await getOrganizationService("owner_id", user?.id);

      if (!organization) {
        return res.status(200).json({
          isSuccess: true,
          message: MESSEGES.TEAM_MEMBERS,
          teams: [],
          totalTeams: 0,
          totalPages: 0,
          currentPage: pageNumber,
        });
      }
      const { data, count } = await fetchAllTeams(
        organization?.id,
        pageNumber,
        limitNumber,
        search,
        teamFilter
      );

      return res.status(200).json({
        isSuccess: true,
        message: MESSEGES.TEAM_MEMBERS,
        teams: data,
        totalTeams: count,
        totalPages: Math.ceil(count / limitNumber),
        currentPage: pageNumber,
      });
    } catch (error) {
      const { statusCode, message } = handleError(error);
      return res.status(statusCode).json({ isSuccess: false, message });
    }
  }

  async getSingleTeam(req: Request, res: Response) {
    try {
      const { id } = req.params;

      if (!id) {
        throw new AppError(MESSEGES.INVALID_ID, 400);
      }

      const team = await fetchTeamById(id);

      if (team?.error) {
        throw new AppError(MESSEGES.TEAM_NOT_FOUND, 400);
      }

      return res.status(200).json({
        isSuccess: true,
        message: MESSEGES.TEAM_MEMBERS,
        team,
      });
    } catch (error) {
      const { statusCode, message } = handleError(error);
      return res.status(statusCode).json({ isSuccess: false, message });
    }
  }

  async deactivateTeamMember(req: any, res: Response) {
    try {
      const membership_id: any = req.params;

      if (!membership_id) {
        throw new AppError(MESSEGES.TEAM_MEMBER_NOT_FOUND, 401);
      }

      const user = req.user;

      if (!user) {
        throw new AppError(MESSEGES.USER_UNAUTHORIZED, 401);
      }
      await deactivateTeamMember(membership_id, user?.id);

      return res.status(200).json({
        isSuccess: true,
        message: MESSEGES.TEAM_MEMBER_DELETED,
      });
    } catch (error) {
      const { statusCode, message } = handleError(error);
      return res.status(statusCode).json({ isSuccess: false, message });
    }
  }

  async deactivateTeam(req: any, res: Response) {
    try {
      const team_id = req.params?.id;
      const user = req.user;

      if (!user) {
        throw new AppError(MESSEGES.USER_UNAUTHORIZED, 401);
      }
      await deactivateTeam(team_id, user.id);

      return res.status(200).json({
        isSuccess: true,
        message: MESSEGES.TEAM_DELETED,
      });
    } catch (error) {
      const { statusCode, message } = handleError(error);
      return res.status(statusCode).json({ isSuccess: false, message });
    }
  }
}

export default TeamController;
