import { AppError } from "../../utils/erroHandler";
import supabase from "../db/supabase";


interface Organization {
  name: string;
  description?: string;
  phone?: string;
  email: string;
  userId: string;
}

export const createOrganizationService = async ( organization: Organization) => {
  const { data, error } = await supabase.getClient()
    .from('organizations')
    .insert([
      {
        name: organization.name,
        description: organization.description,
        phone: organization.phone,
        email: organization.email,
        owner_id: organization.userId,
      }
    ])
    .select();

  if (error) {
    throw new AppError(error.message, 500);
  }

  return data;
};

export async function getOrganizationService( column: string, value: string) {
  
  const { data, error } = await supabase.getClient()
    .from('organizations')
    .select('*')
    .eq(column, value)
    .single();
    
  if (error) return null;
  return data;
}

export async function getAllOrganization( column: string, value: string) {
  
  const { data, error } = await supabase.getClient()
    .from('organizations')
    .select('*')
    .eq(column, value);
    
  if (error) return null;
  return data;
}

export async function isOrganizationExists( userId: string) {
  const { data, error } = await supabase.getClient()
    .from('organizations')
    .select('*')
    .eq('owner_id', userId)
    .single();

  if (error) return false;
  return !!data;
}

export async function isOrganizationNameUnique( name: string): Promise<boolean> {
  const { data, error } = await supabase.getClient()
    .from('organizations')
    .select('*')
    .eq('name', name)
    .single();

  if (error && error.code === 'PGRST116') {

    return true;
  }

  return !data;
}

export async function isUpdateOrganizationNameUnique( name: string, organizationId?: string) {
  let query = supabase.getClient()
    .from('organizations')
    .select('id')
    .eq('name', name);

  if (organizationId) {
    query = query.neq('id', organizationId);
  }

  const { data, error } = await query;
  if (error) {
    throw new AppError(error.message, 400);
  }

  return data.length === 0;
}


export async function deleteOrganizationService( organizationId: string) {

  const { data: teams, error: teamError } = await supabase.getClient()
    .from('teams')
    .select('id')
    .eq('organization_id', organizationId);


  if (teamError) {
    throw new Error(`Error fetching teams: ${teamError.message}`);
  }

  if (teams && teams.length > 0) {
    const teamIds = teams.map(team => team.id);

    const { error: teamMembersError } = await supabase.getClient()
      .from('invitations')
      .delete()
      .in('team_id', teamIds);

    if (teamMembersError) {
      throw new Error(`Error deleting team members: ${teamMembersError.message}`);
    }


    const { error: teamsError } = await supabase.getClient()
      .from('teams')
      .delete()
      .in('id', teamIds);

    if (teamsError) {
      throw new Error(`Error deleting teams: ${teamsError.message}`);
    }
  }


  const { error: organizationError } = await supabase.getClient()
    .from('organizations')
    .delete()
    .eq('id', organizationId);

  if (organizationError) {
    throw new Error(`Error deleting organization: ${organizationError.message}`);
  }
}


export async function updateOrganizationService( organizationId: string, updates: any) {
  const { data, error } = await supabase.getClient()
    .from('organizations')
    .update(updates)
    .eq('id', organizationId)
    .select();

  if (error) {
    throw new AppError(error.message, 400);
  }

  return data;
}
export async function getAllNotificationById(owner_email: string, pageNumber: number, limitNumber: number) {

    let query = supabase.getClient()
    .from('notification')
    .select('*', { count: 'exact' })
    .eq('owner_email', owner_email)
    .order('created_at', { ascending: false });

    const { data: allData, count, error } = await query;
  
    if (error) {
      throw new AppError(error.message, 500);
    }
  
    const start = (pageNumber - 1) * limitNumber;
    const end = start + limitNumber;
    const paginatedData = allData.slice(start, end);
  
    return { data: paginatedData, count };
}

export async function getOrganizationsForMember(memberId: string) {
  
  
  const { data: memberTeams, error: memberTeamsError } = await supabase.getClient()
    .from('invitations') 
    .select('team_id')
    .eq('memberId', memberId);

    
  if (memberTeamsError) {
    console.error('Error fetching member teams:', memberTeamsError);
    return null;
  }

  const teamIds = memberTeams.map((team: any) => team.team_id);

  
  if (teamIds.length === 0) {
    return []; 
  }

  const { data: teams, error: teamsError } = await supabase.getClient()
    .from('teams')
    .select('organization_id')
    .in('id', teamIds);

    
    
  if (teamsError) {
    console.error('Error fetching teams:', teamsError);
    return null;
  }

  const organizationIds = teams.map((team: any) => team.organization_id);

  if (organizationIds.length === 0) {
    return []; 
  }

  const { data: organizations, error: organizationsError } = await supabase.getClient()
    .from('organizations')
    .select('*')
    .in('id', organizationIds);

    
  if (organizationsError) {
    console.error('Error fetching organizations:', organizationsError);
    return null;
  }

  return organizations;
}
