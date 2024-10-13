import{r as v}from"./request-B1Pnm9MM.js";import{_ as E,f as c,j as h,k as L,h as N,g as A,c as B,w as a,r as n,i as D,o as q,b as U,a as o,d as u}from"./index-CQa1UL8_.js";const F={setup(){const g=c(!1),l=c([]),m=c(!1),e=h({id:null,name:"",email:""}),_=c("Add User"),k="120px",i={password:[{required:!0,message:"Please input the password",trigger:"blur"}],email:[{required:!0,message:"Please input the email",trigger:"blur"}],role:[{required:!0,message:"Please select the role",trigger:"blur"}]},d=h({page:1,pageSize:10,search_field:"email"}),p=c(null),s=()=>{g.value=!0,v.get("https://users-fyoxpel6ba-uc.a.run.app",{params:d}).then(t=>{l.value=t,g.value=!1})},w=t=>{v.post("https://users-fyoxpel6ba-uc.a.run.app",t).then(()=>{s(),m.value=!1})},C=t=>{e.id=t.id,e.role=t.role,e.email=t.email,e.password=t.password,_.value="Edit User",m.value=!0},f=()=>{v.put("https://users-fyoxpel6ba-uc.a.run.app",e).then(()=>{s(),m.value=!1})},b=t=>{v.delete(`https://users-fyoxpel6ba-uc.a.run.app?id=${t}`).then(()=>{s()})},V=()=>{e.id=null,e.role="",e.password="",e.email="",_.value="Add User",m.value=!0},y=()=>{p.value.validate(t=>{t&&(e.id?f():w(e))})};return L(()=>{s()}),{query:d,getUsers:s,users:l,dialogVisible:m,form:e,formTitle:_,formLabelWidth:k,rules:i,userFormRef:p,editUser:C,deleteUser:b,addNewUser:V,submitForm:y,showLoading:g,onPage:t=>{d.page=t,s()},exportCsv:()=>{location.href="https://exportusers-fyoxpel6ba-uc.a.run.app"}}}},R={style:{"margin-bottom":"20px"}},S={style:{"margin-top":"20px"}},W={slot:"footer",class:"dialog-footer"};function T(g,l,m,e,_,k){const i=n("el-button"),d=n("el-input"),p=n("el-space"),s=n("el-table-column"),w=n("el-table"),C=n("el-pagination"),f=n("el-form-item"),b=n("el-option"),V=n("el-select"),y=n("el-form"),x=n("el-dialog"),t=n("el-card"),P=D("loading");return q(),N("div",null,[A((q(),B(t,null,{default:a(()=>[U("div",R,[o(p,null,{default:a(()=>[o(i,{onClick:e.addNewUser,type:"success"},{default:a(()=>l[6]||(l[6]=[u("Add User")])),_:1},8,["onClick"]),o(i,{onClick:e.exportCsv,type:"warning"},{default:a(()=>l[7]||(l[7]=[u("Export CSV")])),_:1},8,["onClick"]),o(p,null,{default:a(()=>[o(d,{modelValue:e.query.search,"onUpdate:modelValue":l[0]||(l[0]=r=>e.query.search=r),placeholder:"Search email"},null,8,["modelValue"]),o(i,{onClick:e.getUsers},{default:a(()=>l[8]||(l[8]=[u("search")])),_:1},8,["onClick"])]),_:1})]),_:1})]),o(w,{data:e.users.data,style:{width:"100%"}},{default:a(()=>[o(s,{align:"center",prop:"id",label:"ID"}),o(s,{align:"center",prop:"email",label:"Email"}),o(s,{align:"center",prop:"role",label:"Role"}),o(s,{align:"center",label:"Actions"},{default:a(({row:r})=>[o(i,{onClick:z=>e.editUser(r),type:"primary",size:"small"},{default:a(()=>l[9]||(l[9]=[u("Edit")])),_:2},1032,["onClick"]),o(i,{onClick:z=>e.deleteUser(r.id),type:"danger",size:"small"},{default:a(()=>l[10]||(l[10]=[u("Delete")])),_:2},1032,["onClick"])]),_:1})]),_:1},8,["data"]),U("div",S,[o(C,{"current-page":e.users.page,"page-size":e.users.pageSize,total:e.users.total,onCurrentChange:e.onPage,background:"",layout:"prev, pager, next"},null,8,["current-page","page-size","total","onCurrentChange"])]),o(x,{title:e.formTitle,modelValue:e.dialogVisible,"onUpdate:modelValue":l[5]||(l[5]=r=>e.dialogVisible=r),width:"30%"},{default:a(()=>[o(y,{model:e.form,ref:"userFormRef",rules:e.rules},{default:a(()=>[o(f,{label:"Email","label-width":e.formLabelWidth,prop:"email"},{default:a(()=>[o(d,{modelValue:e.form.email,"onUpdate:modelValue":l[1]||(l[1]=r=>e.form.email=r),autocomplete:"off"},null,8,["modelValue"])]),_:1},8,["label-width"]),o(f,{label:"Password","label-width":e.formLabelWidth,prop:"password"},{default:a(()=>[o(d,{modelValue:e.form.password,"onUpdate:modelValue":l[2]||(l[2]=r=>e.form.password=r),autocomplete:"off"},null,8,["modelValue"])]),_:1},8,["label-width"]),o(f,{label:"Role","label-width":e.formLabelWidth,prop:"role"},{default:a(()=>[o(V,{modelValue:e.form.role,"onUpdate:modelValue":l[3]||(l[3]=r=>e.form.role=r),placeholder:"role"},{default:a(()=>[o(b,{label:"admin",value:"admin"}),o(b,{label:"user",value:"user"})]),_:1},8,["modelValue"])]),_:1},8,["label-width"])]),_:1},8,["model","rules"]),U("div",W,[o(i,{onClick:l[4]||(l[4]=r=>e.dialogVisible=!1)},{default:a(()=>l[11]||(l[11]=[u("Cancel")])),_:1}),o(i,{type:"primary",onClick:e.submitForm},{default:a(()=>l[12]||(l[12]=[u("Confirm")])),_:1},8,["onClick"])])]),_:1},8,["title","modelValue"])]),_:1})),[[P,e.showLoading]])])}const M=E(F,[["render",T],["__scopeId","data-v-a5ef9fef"]]);export{M as default};
