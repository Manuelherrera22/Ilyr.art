import{r as n,j as c,x as d,s as a}from"./index-1d1ce9ed.js";const l=n.forwardRef(({className:t,orientation:e="horizontal",...r},s)=>c.jsx("div",{ref:s,role:"separator","aria-orientation":e,className:d("shrink-0 bg-border",e==="horizontal"?"h-[1px] w-full":"h-full w-[1px]",t),...r}));l.displayName="Separator";const p=async t=>{if(!t)return{data:[],error:new Error("Cuenta de cliente no encontrada")};const{data:e,error:r}=await a.from("projects").select(`
      id,
      title,
      status,
      created_at,
      metadata,
      project_briefs (
        id,
        status,
        objective,
        audience,
        key_messages,
        budget_range,
        deadline_date,
        created_at
      ),
      project_assignments (
        id,
        user_id,
        role,
        status
      ),
      project_milestones (
        id,
        name,
        due_at,
        status
      )
    `).eq("client_account_id",t).order("created_at",{ascending:!1});return{data:e,error:r}},u=async(t,e)=>{const{data:r,error:s}=await a.from("projects").select("id, client_account_id").eq("id",t).eq("client_account_id",e).single();if(s||!r)throw new Error("No tienes acceso a este proyecto");const{data:i,error:o}=await a.from("projects").select(`
      id,
      title,
      status,
      created_at,
      updated_at,
      metadata,
      project_briefs (
        id,
        objective,
        audience,
        key_messages,
        budget_range,
        deadline_date,
        references_payload,
        status,
        created_at
      ),
      project_milestones (
        id,
        name,
        description,
        due_at,
        status,
        approved_at,
        approved_by,
        created_at
      ),
      project_assets (
        id,
        version,
        type,
        file_url,
        notes,
        is_final,
        metadata,
        created_at,
        uploaded_by,
        profiles:uploaded_by (
          full_name
        )
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
      ),
      project_assignments (
        id,
        role,
        stage,
        profiles:user_id (
          full_name,
          profile_type
        )
      )
    `).eq("id",t).single();if(o)throw console.error("Error fetching project details:",o),new Error(o.message);return i},f=async()=>{const{data:t,error:e}=await a.from("project_briefs").select(`
      id,
      project_id,
      status,
      objective,
      deadline_date,
      created_at,
      projects (
        id,
        title,
        status,
        created_at
      )
    `).eq("status","submitted").order("created_at",{ascending:!1});if(e)throw console.error("Error listing incoming briefs:",e),new Error(e.message);return t||[]},m=async(t,e)=>{const{error:r}=await a.from("project_briefs").update({status:e}).eq("id",t);if(r)throw console.error("Error updating brief status:",r),new Error(r.message);return!0};export{l as S,f as a,u as g,p as l,m as u};
