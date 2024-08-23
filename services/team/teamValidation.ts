import Joi from "joi";

export const createTeamSchema = Joi.object({
    name: Joi.string().min(3).max(30).required(),
    description: Joi.string().min(3).max(255).required(),
});

export const updateTeamSchema = Joi.object({
    team_id:Joi.number().required(),
    name: Joi.string().min(3).max(30).required(),
    description: Joi.string().min(3).max(255).optional(),
});

export const sendInvitationSchema = Joi.object({
    team_id:Joi.number().required(),
    email: Joi.string().email().required(),
    role: Joi.string().valid('team_owner', 'team_member').required()
});

export const verifyInvitationSchema = Joi.object({ 
    token: Joi.string().required(),
});
export const updateTeamMemberRoleSchema = Joi.object({
    team_id: Joi.number().required(),
    member_id: Joi.number().required(),
    new_role: Joi.string().valid('team_owner', 'team_member').required()
  });

export const createTeamMembershipSchema = Joi.object({
    team_id: Joi.number().required(),
    role: Joi.string().min(3).max(30).required(),
});

export const getAllTeamMembersSchema = Joi.object({
    team_id:Joi.number().required(),
    pageNo: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).default(10),
    search: Joi.string().optional().allow('').default(''),

});
export const getAllTeamSchema = Joi.object({
    pageNo: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).default(10),
    search: Joi.string().optional().allow('').default(''),
});
export const deactivateTeamMemberSchema = Joi.object({
    membership_id: Joi.number().required(),
});

export const deactivateTeamSchema = Joi.object({
    id: Joi.string().required(),
});

