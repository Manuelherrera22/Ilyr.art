import{a0 as P,a1 as j,r as g,a2 as V,a3 as k,j as u,a4 as G,a5 as _,a6 as L,a7 as z,a8 as y,a9 as K,R as h,x as w,s as d}from"./index-1d1ce9ed.js";var b="Tabs",[B,X]=P(b,[j]),x=j(),[U,T]=B(b),E=g.forwardRef((e,s)=>{const{__scopeTabs:t,value:o,onValueChange:a,defaultValue:c,orientation:r="horizontal",dir:l,activationMode:f="automatic",...m}=e,n=V(l),[i,p]=k({prop:o,onChange:a,defaultProp:c??"",caller:b});return u.jsx(U,{scope:t,baseId:G(),value:i,onValueChange:p,orientation:r,dir:n,activationMode:f,children:u.jsx(_.div,{dir:n,"data-orientation":r,...m,ref:s})})});E.displayName=b;var N="TabsList",C=g.forwardRef((e,s)=>{const{__scopeTabs:t,loop:o=!0,...a}=e,c=T(N,t),r=x(t);return u.jsx(L,{asChild:!0,...r,orientation:c.orientation,dir:c.dir,loop:o,children:u.jsx(_.div,{role:"tablist","aria-orientation":c.orientation,...a,ref:s})})});C.displayName=N;var R="TabsTrigger",A=g.forwardRef((e,s)=>{const{__scopeTabs:t,value:o,disabled:a=!1,...c}=e,r=T(R,t),l=x(t),f=I(r.baseId,o),m=M(r.baseId,o),n=o===r.value;return u.jsx(z,{asChild:!0,...l,focusable:!a,active:n,children:u.jsx(_.button,{type:"button",role:"tab","aria-selected":n,"aria-controls":m,"data-state":n?"active":"inactive","data-disabled":a?"":void 0,disabled:a,id:f,...c,ref:s,onMouseDown:y(e.onMouseDown,i=>{!a&&i.button===0&&i.ctrlKey===!1?r.onValueChange(o):i.preventDefault()}),onKeyDown:y(e.onKeyDown,i=>{[" ","Enter"].includes(i.key)&&r.onValueChange(o)}),onFocus:y(e.onFocus,()=>{const i=r.activationMode!=="manual";!n&&!a&&i&&r.onValueChange(o)})})})});A.displayName=R;var S="TabsContent",$=g.forwardRef((e,s)=>{const{__scopeTabs:t,value:o,forceMount:a,children:c,...r}=e,l=T(S,t),f=I(l.baseId,o),m=M(l.baseId,o),n=o===l.value,i=g.useRef(n);return g.useEffect(()=>{const p=requestAnimationFrame(()=>i.current=!1);return()=>cancelAnimationFrame(p)},[]),u.jsx(K,{present:a||n,children:({present:p})=>u.jsx(_.div,{"data-state":n?"active":"inactive","data-orientation":l.orientation,role:"tabpanel","aria-labelledby":f,hidden:!p,id:m,tabIndex:0,...r,ref:s,style:{...e.style,animationDuration:i.current?"0s":void 0},children:p&&c})})});$.displayName=S;function I(e,s){return`${e}-trigger-${s}`}function M(e,s){return`${e}-content-${s}`}var H=E,q=C,D=A,F=$;const Y=H,O=h.forwardRef(({className:e,...s},t)=>u.jsx(q,{ref:t,className:w("inline-flex h-10 items-center justify-center rounded-md bg-muted p-1 text-muted-foreground",e),...s}));O.displayName=q.displayName;const J=h.forwardRef(({className:e,...s},t)=>u.jsx(D,{ref:t,className:w("inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm",e),...s}));J.displayName=D.displayName;const Q=h.forwardRef(({className:e,...s},t)=>u.jsx(F,{ref:t,className:w("mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",e),...s}));Q.displayName=F.displayName;const Z=async(e,s,t,o={})=>{const a=t.name.split(".").pop(),r=`project-assets/${`${e}/${Date.now()}_${Math.random().toString(36).substring(7)}.${a}`}`,{data:l,error:f}=await d.storage.from("project-assets").upload(r,t,{cacheControl:"3600",upsert:!1});if(f)throw console.error("Error uploading file:",f),new Error(f.message);const{data:{publicUrl:m}}=d.storage.from("project-assets").getPublicUrl(r),{data:n}=await d.from("project_assets").select("version").eq("project_id",e).order("version",{ascending:!1}).limit(1).single(),i=n?n.version+1:1,{data:p,error:v}=await d.from("project_assets").insert([{project_id:e,uploaded_by:s,version:i,type:o.type||"draft",file_url:m,notes:o.notes||"",is_final:o.is_final||!1,metadata:{file_name:t.name,file_size:t.size,file_type:t.type,...o}}]).select().single();if(v)throw console.error("Error creating asset record:",v),await d.storage.from("project-assets").remove([r]),new Error(v.message);return p},ee=async e=>{const{data:s,error:t}=await d.from("project_assets").select(`
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
    `).eq("project_id",e).order("version",{ascending:!1});if(t)throw console.error("Error fetching project assets:",t),new Error(t.message);return s||[]},te=async(e,s)=>{const{data:t}=await d.from("project_assignments").select("id").eq("project_id",e).eq("user_id",s).eq("status","active").maybeSingle(),{data:o}=await d.from("projects").select("client_account_id, created_by").eq("id",e).single(),{data:a}=await d.from("profiles").select("client_account_id, profile_type").eq("id",s).single();if(!(t||(a==null?void 0:a.profile_type)==="client"&&(a==null?void 0:a.client_account_id)===(o==null?void 0:o.client_account_id)||(a==null?void 0:a.profile_type)==="producer"||(a==null?void 0:a.profile_type)==="admin"))throw new Error("No tienes acceso a los comentarios de este proyecto");const{data:r,error:l}=await d.from("project_comments").select(`
      id,
      message,
      visibility,
      attachments,
      created_at,
      updated_at,
      author_id,
      parent_id,
      profiles:author_id (
        full_name,
        profile_type
      )
    `).eq("project_id",e).order("created_at",{ascending:!0});if(l)throw console.error("Error fetching comments:",l),new Error(l.message);return r||[]},ae=async(e,s,t,o="client",a=null)=>{const{data:c,error:r}=await d.from("project_comments").insert([{project_id:e,author_id:s,message:t,visibility:o,parent_id:a}]).select(`
      id,
      message,
      visibility,
      created_at,
      author_id,
      parent_id,
      profiles:author_id (
        full_name,
        profile_type
      )
    `).single();if(r)throw console.error("Error creating comment:",r),new Error(r.message);return c};export{Y as T,O as a,J as b,Q as c,te as d,ae as e,ee as g,Z as u};
