<template>
    <div>
        <!-- 面包屑导航区 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
                <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
                <el-breadcrumb-item>用户管理</el-breadcrumb-item>
                <el-breadcrumb-item>用户列表</el-breadcrumb-item>
        </el-breadcrumb>
        <!-- 卡片 -->
        <el-card class="box-card">
            <!-- 搜索与添加区域 -->
             <el-row :gutter="20">
                 <el-col :span="8">
                    <el-input placeholder="请输入内容"  v-model="queryInfo.query" clearable @clear="getUserList">
                        <el-button slot="append" icon="el-icon-search" @click="getUserList"></el-button>
                    </el-input>  
                 </el-col>
                 <el-col :span="4">
                    <el-button type="primary" @click="addDialogVisible=true">添加用户</el-button>
                 </el-col>
             </el-row>  
             <!-- 用户列表区  -->
             <el-table :data="userList" border stripe>
                 <el-table-column type="index" label="#"></el-table-column>
                 <el-table-column label="姓名" prop="username"></el-table-column>
                 <el-table-column label="邮箱" prop="email"></el-table-column>
                 <el-table-column label="电话" prop="mobile"></el-table-column>
                 <el-table-column label="角色" prop="role_name"></el-table-column>
                 <el-table-column label="状态" prop="mg_state">
                     <template slot-scope="scope">
                          <el-switch v-model="scope.row.mg_state" @change="userStateChanged(scope.row)">
                          </el-switch>
                     </template>
                 </el-table-column>
                 <el-table-column label="操作" width="180px">
                      <template slot-scope="scope">
                          <!-- 修改按钮 -->
                          <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditDialog(scope.row.id)"></el-button>
                          <!-- 删除按钮 -->
                          <el-button type="danger" icon="el-icon-delete" size="mini" @click="removeUserById(scope.row.id)"></el-button>
                          <!-- 分配角色按钮 -->
                           <el-tooltip effect="dark" content="分配角色" placement="top" :enterable="false">
                                  <el-button type="warning" icon="el-icon-setting" size="mini"></el-button>
                           </el-tooltip>
                     </template>
                 </el-table-column>
             </el-table>
             <!-- 分页区域 -->
              <el-pagination
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="queryInfo.pagenum"
                :page-sizes="[1, 2, 3, 4]"
                :page-size="queryInfo.pagesize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="total">
               </el-pagination>
         </el-card>
         <!-- 添加用户的对话框 -->
         <el-dialog title="提示"
                    :visible.sync="addDialogVisible"
                    width="50%" @close="addDialogClosed">
                <!-- 内容主体区域 -->
                <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="70px" >
                    <el-form-item label="用户名" prop="username">
                        <el-input v-model="addForm.username"></el-input>
                    </el-form-item>
                    <el-form-item label="密码" prop="password">
                        <el-input v-model="addForm.password"></el-input>
                    </el-form-item>
                    <el-form-item label="邮箱" prop="email">
                        <el-input v-model="addForm.email"></el-input>
                    </el-form-item>
                    <el-form-item label="手机" prop="mobile">
                        <el-input v-model="addForm.mobile"></el-input>
                    </el-form-item>
                </el-form>
                <!-- 底部区域 -->
                <span slot="footer" class="dialog-footer">
                    <el-button @click="addDialogVisible = false">取 消</el-button>
                    <el-button type="primary" @click="addUser">确 定</el-button>
                </span>
        </el-dialog>
        <!-- 修改用户的对话框 -->
        <el-dialog title="修改用户"
                    :visible.sync="editDialogVisible"
                    width="50%"
                    @close="editDialogClosed">
                <!-- 内容主体区域 -->
                <el-form :model="editForm" :rules="editFormRules" ref="editFormRef" label-width="70px" >
                    <el-form-item label="用户名">
                        <el-input v-model="editForm.username" disabled></el-input>
                    </el-form-item>
                    <el-form-item label="邮箱" prop="email">
                        <el-input v-model="editForm.email"></el-input>
                    </el-form-item>
                    <el-form-item label="手机" prop="mobile">
                        <el-input v-model="editForm.mobile"></el-input>
                    </el-form-item>
                </el-form>
                <!-- 底部区域 -->
                <span slot="footer" class="dialog-footer">
                    <el-button @click="editDialogVisible = false">取 消</el-button>
                    <el-button type="primary" @click="editUserInfo">确 定</el-button>
                </span>
        </el-dialog>
    </div>
</template>

<script>
export default {
      data(){
        //   验证邮箱规则
          var checkEmail=(rule,value,cb)=>{
            //   验证邮箱的正则表达式
              const regEmail =/^[a-zA-Z0-9_-]+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/
              if(regEmail.test(value)){
                  return cb()
              }
              cb(new Error("请输入合法邮箱"))
          }
          var checkMobile=(rule,value,cb)=>{
              const regMobile =/^(0|86|17951)?(13[0-9]|15[0123456789]|17[678]|18[0-9]|14[57])[0-9]{8}$/
              if(regMobile.test(value)){
                  return cb()
              }
              cb(new Error("请输入合法手机号"))
          }
           return {
             queryInfo:{
                 query:"",
                 pagenum:1,
                 pagesize:4
             },
             userList:[],
             total:0,
             addDialogVisible:false,
             addForm:{
                 username:"",
                 password:"",
                 email:"",
                 mobile:""
             },
             addFormRules:{
                 username:[
                     {required:true,message:"请输入用户名",trigger:"blur"},
                     {min:3,max:10,message:"用户名的长度在3~10个字符之间",trigger:"blur"}
                 ],
                 password:[
                     {required:true,message:"请输入密码",trigger:"blur"},
                     {min:3,max:10,message:"密码的长度在6~12个字符之间",trigger:"blur"}
                 ],
                 email:[
                     {required:true,message:"请输入邮箱",trigger:"blur"},{validator:checkEmail,trigger:"blur"}
                 ],
                 mobile:[
                     {required:true,message:"请输入手机号",trigger:"blur"},
                     {validator:checkMobile,trigger:"blur"}
                 ]
             },
             editDialogVisible:false,
             editForm:{},
             editFormRules:{
                 email:[
                      {required:true,message:"请输入邮箱",trigger:"blur"},{validator:checkEmail,trigger:"blur"}
                 ],
                 mobile:[
                     {required:true,message:"请输入手机号",trigger:"blur"},
                     {validator:checkMobile,trigger:"blur"}
                 ]
             }

           }
      },
      created(){
          this.getUserList();
      },
      methods:{
          getUserList(){
              this.axios.get("/v1/users",{params:this.queryInfo}).then(result=>{
                console.log(result)
                if(result.data.meta.status!==200){
                   return this.$message.error("获取用户列表失败")
               }
               this.userList=result.data.data.users;
               this.total=result.data.data.total;
              })
          },
        //   监听 pagesize
          handleSizeChange(newSize){
               this.queryInfo.pagesize=newSize;
               this.getUserList();
          },
        //   监听页值只改变
          handleCurrentChange(newPage){
                this.queryInfo.pagenum=newPage;
                this.getUserList();
            },
            // 监听switch状态的改变
            userStateChanged(userInfo){
                this.axios.put(`/v1/users/${userInfo.id}/state/${userInfo.mg_state}`).then(res=>{
                    console.log(res)
                   if(res.data.meta.status!==200){
                       userInfo.mg_state=!userInfo.mg_state
                      return this.$message.error("更新用户状态失败")
                   }
                   this.$message.success("更新状态成功")
                })
            },
            addDialogClosed(){
            this.$refs.addFormRef.resetFields();
            },
            // 添加用户
            addUser(){
                this.$refs.addFormRef.validate(valid=>{
                    // console.log(valid)
                    if(!valid) return 
                    // 可以发起添加用户的请求
                    this.axios.post("/v1/users",this.addForm).then(res=>{
                        // console.log(res)
                        if(res.data.meta.status!==201){
                            this.$message.error("添加用户失败")
                            return;
                        }
                        this.$message.success("添加用户成功！");
                        this.addDialogVisible=false;
                        this.getUserList();
                    })
                })
            },
            // 编辑用户的对话框
            showEditDialog(id){
                this.editDialogVisible=true;
                this.axios.get("/v1/users/"+id).then(res=>{
                    console.log(res)
                    if(res.data.meta.status!==200){
                        return this.$message.error("查询用户信息失败")
                    }
                    this.editForm=res.data.data
                    
                })
            },
            editDialogClosed(){
                this.$refs.editFormRef.resetFields()
            },
            editUserInfo(){
                this.$refs.editFormRef.validate(valid=>{
                    if(!valid) return ;
                    this.axios.put("/v1/users/"+this.editForm.id,{email:this.editForm.email,mobile:this.editForm.mobile}).then(res=>{
                        if(res.data.meta.status!==200){
                            this.$message.error("更新用户失败");
                            return;
                            
                        }
                        this.editDialogVisible=false;
                        this.getUserList();
                        this.$message.success("g更新成功")
                        })
                })
            },
            // 根据id删除对应的用户信息
            removeUserById(id){
                // 弹框询问是否删除
                  let  confirmResult= this.$confirm('此操作将永久删除该用户信息, 是否继续?', '提示', {
                     confirmButtonText: '确定',
                     cancelButtonText: '取消',
                     type: 'warning'
                    }).then(res=>{
                      this.axios.delete("/v1/users/"+id).then(res=>{
                        console.log(res.data.meta.status)
                        if(res.data.meta.status!==200){
                            return this.$message.error("删除用户失败")
                        }
                       this.$message.success("删除用户成功")
                       this.getUserList();
                      })
                    }).catch(err=>{
                        this.$message.info("已取消删除")
                    })
                    //如果用户确认删除 则返回值为字符串 confirm
                    //如果用户取消了删除,则返回为字符串 cancel
             }
      }
}
</script>

<style lang="less" scoped>
 .el-breadcrumb{
     margin-bottom:15px;
     font-size:12px;
 }
 .el-card{
     box-shadow: 0 1px 1px rgba(0,0,0,0.15);
 }
 .el-table{
     margin-top:15px;
     font-size:12px;
 }
 .el-pagination{
     margin-top:15px;
 }
</style>
