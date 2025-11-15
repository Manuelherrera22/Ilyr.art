import{s as r}from"./index-1d1ce9ed.js";const _=async s=>{const{data:e,error:t}=await r.from("project_assignments").select(`
      id,
      project_id,
      role,
      stage,
      status,
      workload,
      created_at,
      projects (
        id,
        title,
        status,
        created_at,
        project_briefs (
          id,
          objective,
          deadline_date
        ),
        project_milestones (
          id,
          name,
          due_at,
          status,
          description
        )
      )
    `).eq("user_id",s).eq("status","active").order("created_at",{ascending:!1});if(t)throw console.error("Error fetching creative assignments:",t),new Error(t.message);return e||[]},l=async s=>{const{data:e,error:t}=await r.from("project_assignments").select(`
      id,
      user_id,
      role,
      stage,
      status,
      workload,
      created_at,
      profiles:user_id (
        id,
        full_name,
        profile_type
      )
    `).eq("project_id",s).order("created_at",{ascending:!1});if(t)throw console.error("Error fetching project assignments:",t),new Error(t.message);return e||[]},g=async(s,e,t,o=null,i={})=>{const{data:a}=await r.from("project_assignments").select("id").eq("project_id",s).eq("user_id",e).eq("status","active").single();if(a)throw new Error("Este usuario ya está asignado a este proyecto");const{data:c,error:n}=await r.from("project_assignments").insert([{project_id:s,user_id:e,role:t,stage:o,status:"active",workload:i}]).select(`
      id,
      user_id,
      role,
      stage,
      status,
      created_at,
      profiles:user_id (
        id,
        full_name,
        profile_type
      )
    `).single();if(n)throw console.error("Error creating assignment:",n),new Error(n.message);return c},m=async s=>{const{error:e}=await r.from("project_assignments").update({status:"inactive",updated_at:new Date().toISOString()}).eq("id",s);if(e)throw console.error("Error removing assignment:",e),new Error(e.message);return!0},p=async(s,e)=>{const{data:t,error:o}=await r.from("project_assignments").select("id, role, stage, status").eq("project_id",s).eq("user_id",e).eq("status","active").single();if(o||!t)throw new Error("No tienes acceso a este proyecto");const{data:i,error:a}=await r.from("projects").select(`
      id,
      title,
      status,
      created_at,
      project_briefs (
        id,
        objective,
        audience,
        key_messages,
        deadline_date,
        references_payload,
        attachments
      ),
      project_milestones (
        id,
        name,
        description,
        due_at,
        status,
        approved_at
      ),
      project_assets (
        id,
        version,
        type,
        file_url,
        notes,
        is_final,
        created_at,
        uploaded_by
      ),
      project_comments (
        id,
        message,
        visibility,
        attachments,
        created_at,
        author_id,
        profiles:author_id (
          full_name,
          profile_type
        )
      )
    `).eq("id",s).single();if(a)throw console.error("Error fetching project details:",a),new Error(a.message);return{...i,assignment:t}};export{_ as a,p as b,g as c,l as g,m as r};
