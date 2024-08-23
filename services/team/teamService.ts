import { AppError } from "../../utils/erroHandler";
import { MESSEGES } from "../../constants";
import supabase from "../db/supabase";
import { PostgrestError, PostgrestResponse } from '@supabase/supabase-js';

interface Team {
    id: string;
    organization_id: string;
    is_team_active: boolean;
    created_at: string;
    name: string; // Add other fields as needed
  }
  
  // Type for the query builder
  type TeamQueryBuilder = PostgrestResponse<Team>|any;
 
export const createTeam = async (
    name: string,
    description: string,
    userId: string,
    organization_id: number

  
) => {
    const { data, error } = await supabase.getClient()
        .from("teams")
        .insert({
            name,
            description,
            owner_id: userId,
            created_at: new Date(),
            updated_at: new Date(),
            organization_id
        })
        .select()
        .single();

    if (error) {
        throw new AppError(error.message, 500);
    }

    return data;
};

export async function isTeamNameUnique( teamName: string): Promise<boolean> {

    const response: any = await supabase.getClient()
        .from('teams')
        .select('*')
        .eq('name', teamName)
        .single()
    
        if(response?.error?.code==="PGRST116"){
            return true
        }
       

    return response?.data?.name ? false :true;

}

export const updateTeam = async (
    team_id: string,
    name: string,
    description: string
) => {
    const { data, error } = await supabase.getClient()
        .from("teams")
        .update({ name, description, updated_at: new Date() })
        .eq("id", team_id)
        .select()
        .single();

    if (!data) {
        throw new Error(MESSEGES.TEAM_NOT_FOUND);
    }

    if (error) {
        throw new AppError(error.message, 500);
    }

    return data;
};

export const fetchTeamById = async (
    team_id: string
) => {
    return await supabase.getClient()
        .from("teams")
        .select("*")
       .eq("is_team_active", true)
        .eq("id", team_id)
        .single()
};



export const createInviteUser = async (
    team_id: string,
    email: string,
    resetToken: string,
    tokenExpiry: Date,
    role: string,

) => {
    const { data: existingMemberships, error: checkError } = await supabase.getClient()
        .from("invitations")
        .select("*")
        .eq("team_id", team_id)
        .eq("email", email);

    if (checkError) {
        throw new AppError(checkError.message, 500);
    }

    if (existingMemberships.length > 0) {
        throw new AppError(MESSEGES.ALREADY_TEAM_MEMBERS, 400);
    }

    const { data, error } = await supabase.getClient()
        .from("invitations")
        .insert([
            {
                team_id,
                email,
                status: "pending",
                invited_at: new Date(),
                reset_token: resetToken,
                token_expiry: tokenExpiry,
                role: role,
            },
        ])
        .select()
        .single();

    if (error) {
        throw new AppError(error.message, 500);
    }

    return data;
};

export const verifyInvitation = async (
    token: any
) => {
      const { data, error, status } = await supabase.getClient()
        .from("invitations")
        .select("*")
        .eq("reset_token", token )
        .single();
        

    if (!data||data?.reset_token === null) {
        throw new AppError(MESSEGES.INVALID_OR_EXPIRED_TOKEN, 404);
    }
    return data;

};
export const updateInvitationStatus = async (
    invitationId: string
) => {
    const { data, error } = await supabase.getClient()
        .from("invitations")
        .update({  status: 'active', accepted_at: new Date() })
        .eq("id", invitationId)
        .single();

    if (error) {
        throw new AppError(error.message, 500);
    }

    return data;
};


export const  validateTeamOwnerRole = async ( teamId: string) => {
    const { data: teamMembers, error } = await supabase.getClient()
      .from('invitations')
      .select('*')
      .eq('team_id', teamId)
      .eq('role', 'team_owner');

   console.log();
   
    if (teamMembers.length > 0) {
      throw new AppError(MESSEGES.OWNER_EXISTS, 400);
    }
  }

export const updateTeamMemberRole = async (
    team_id: string,
    member_id: number,
    new_role: string
) => {

 
    
    const { data: existingMember, error: fetchError } = await supabase.getClient()
        .from('invitations')
        .select('*')
        .eq('team_id', team_id)
        .eq('is_team_member_active', true) 
        .eq('id', member_id)
        .single();


    if (fetchError || !existingMember) {
        throw new AppError(MESSEGES.TEAM_NOT_FOUND, 404);
    }

    const { data, error } = await supabase.getClient()
        .from('invitations')
        .update({ role: new_role })
        .eq('team_id', team_id)
        .eq('id', member_id)
        .select('id, email, team_id, role, status, created_at')
        .single();

    if (error) {
        throw new AppError(error.message, 500);
    }

    return data;
};



export const fetchAllTeams = async ( organizationId: string, pageNumber: number, limitNumber: number, search: string,teamFilter: any = {}) => {


    let query : TeamQueryBuilder = await supabase.getClient()
      .from('teams')
      .select('*', { count: 'exact' })
      .eq('organization_id', organizationId)
     .eq('is_team_active', true)
      .order('created_at', { ascending: false });
  

      
      
      let teamIds: string[] = [];
      if (teamFilter.email) {
        const { data: invitations, error: invitationError } = await supabase.getClient()
          .from('invitations')
          .select('team_id')
          .eq('email', teamFilter.email);
  
        if (invitationError) {
          throw new AppError(invitationError.message, 500);
        }
  
        teamIds = invitations.map((invitation: { team_id: string }) => invitation.team_id);
        if (!teamIds.length) {
          return { data: [], count: 0 };}
      
          if (teamIds.length > 0) {
        await supabase.getClient()
          .from('teams')
          .select('*', { count: 'exact' })
        
           .in('id', teamIds);
          }
          
      }
      
    if (search) {
      query = query.ilike('name', `%${search}%`);
    }
 
    const { data: allData, count, error } = await query;
  
    if (error) {
      throw new AppError(error.message, 500);
    }
  
    const start = (pageNumber - 1) * limitNumber;
    const end = start + limitNumber;
    const paginatedData = allData.slice(start, end);
  
    return { data: paginatedData, count };
  };
  

export const fetchAllTeamMembers = async ( team_id: string, pageNumber: number, limitNumber: number, search: string, memberFilter: any = {}  ) => {

    
    let query = supabase.getClient()
        .from('invitations')
        .select('id, email, team_id, role, status, created_at', { count: 'exact' })
        .eq('team_id', team_id)
        .eq('is_team_member_active', true)
        .order('created_at', { ascending: false });


    if (search) {
        query = query.ilike('email', `%${search}%`);
    }

    
    if (Object.keys(memberFilter).length) {
        query = query.eq('email', memberFilter.email);
     }



    const { data: allData, count, error } = await query;

    if (error) {
        throw new AppError(error.message, 500);
    }

    const start = (pageNumber - 1) * limitNumber;
    const end = start + limitNumber;
    const paginatedData = allData.slice(start, end);

    return { data: paginatedData, count };
};


export async function deactivateTeamMember( membership_id: any, userId: string) {

    const { data: membershipData, error: fetchError } = await supabase.getClient()
        .from("invitations")
        .select("*")
        .eq("id", membership_id?.id)
        .single();

    if (fetchError || !membershipData) {
        throw new AppError(MESSEGES.TEAM_MEMBER_NOT_FOUND, 404);
    }
 
    const teamData = await fetchTeamById( membershipData.team_id);

    if (!teamData || userId !== teamData?.data.owner_id) {
        throw new AppError(
            MESSEGES.PERMISSION_DENIED
            , 403);
    }


    const { data, error: deleteError } = await supabase.getClient()
        .from("invitations")
        .delete()
        .eq("id", membership_id?.id)
        .single();

    if (deleteError) {
        throw new AppError(deleteError.message, 500);
    }
    const { data: deleteUserData, error: deleteUserError } = await supabase.getClient()
    .from("users")
    .delete()
    .eq("email", membershipData.email)
    .single();
    
    if (deleteUserError) {
        throw new AppError(deleteUserError.message, 500);
    }

    return data;
}

export async function deactivateTeam( team_id: string, userId: string) {

    const { data: teamData, error: fetchTeamError } = await supabase.getClient()
        .from("teams")
        .select("*")
        .eq("id", team_id)
        .single();

    if (fetchTeamError || !teamData) {
        throw new AppError(

            MESSEGES.TEAM_NOT_FOUND, 404);
    }


    const { error: deleteTeamMembersError } = await supabase.getClient()
        .from("invitations")
        .delete()
        .eq("team_id", team_id);

    if (deleteTeamMembersError) {
        throw new AppError(MESSEGES.ERROR, 500);
    }

    const { error: deleteTeamError } = await supabase.getClient()
        .from("teams")
        .delete()
        .eq("id", team_id);

    if (deleteTeamError) {
        throw new AppError(deleteTeamError.message, 500);
    }

    return {
        message:
            MESSEGES.SUCCESS
    };
}




