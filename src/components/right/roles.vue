<template>
    <div id="roles">
     <!-- 面包屑导航区 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
                <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
                <el-breadcrumb-item>权限管理</el-breadcrumb-item>
                <el-breadcrumb-item>角色列表</el-breadcrumb-item>
        </el-breadcrumb>

          <!-- 卡片视图 -->
        <el-card>
            <!-- 添加角色按钮区域 -->
             <el-row>
                 <el-col>
                     <el-button type="primary" @click="addRolesOpen">添加角色</el-button>
                 </el-col>
             </el-row>
             
             <!-- 角色列表区域 -->
             <el-table :data="roleList" border stripe>
                 <!-- 展开列 -->
                  <el-table-column type="expand">
                      <template slot-scope="scope">
                        <el-row :class="['bdbottom',i==0?'dbtop':'','vcenter']" v-for="(item,i) in scope.row.children" :key="i">
                           <!-- 渲染一级权限   -->
                          <el-col :span="5">
                              <el-tag closable @close="removeRightById(scope.row,item.id)">
                                 {{item.authName}}
                              </el-tag>
                              <i class="el-icon-caret-right"></i>
                          </el-col>
                          <!-- 渲染二级三级权限 -->
                          <el-col :span="19">
                              <!-- 通过for循环嵌套渲染二级权限 -->
                              <el-row :class="[i1===0?'':'dbtop','vcenter']" v-for="(item1,i1) in item.children" :key="i1">
                                  <el-col :span="6">
                                      <el-tag closable @close="removeRightById(scope.row,item1.id)" type="success">{{item1.authName}}</el-tag>
                                      <i class="el-icon-caret-right"></i>
                                  </el-col>
                                  <el-col :span="18">
                                       <el-tag closable @close="removeRightById(scope.row,item2.id)" v-for="(item2,i2) in item1.children" :key="i2" type="warning">
                                           {{item2.authName}}
                                       </el-tag>
                                  </el-col>
                              </el-row>
                          </el-col>
                        </el-row>
                      </template>
                  </el-table-column>
                 <!-- 索引列 -->
                  <el-table-column type="index" label="#"></el-table-column>
                  <el-table-column label="角色名称" prop="roleName"></el-table-column>
                  <el-table-column label="角色描述" prop="roleDesc"></el-table-column>
                  <el-table-column label="操作" width="300px">
                      <template slot-scope="scope">
                           <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditInfo(scope.row.id)">编辑</el-button>
                           <el-button type="danger" icon="el-icon-delete" size="mini" @click="removeRoleById(scope.row.id)">删除</el-button>
                           <el-button type="warning" icon="el-icon-setting" size="mini"  @click="showSetRightDialog(scope.row)">分配权限</el-button>
                      </template>
                  </el-table-column>
             </el-table>
        </el-card>
        <!-- 添加角色对话框 -->
        <!-- 添加用户的对话框 -->
         <el-dialog title="提示"
                    :visible.sync="addDialogVisible"
                    width="50%" @close="addDialogClosed">
                <!-- 内容主体区域 -->
                <el-form :model="addRolesForm" :rules="addFormRules" ref="addFormRef" label-width="80px" >
                    <el-form-item label="角色名称" prop="roleName">
                        <el-input v-model="addRolesForm.roleName"></el-input>
                    </el-form-item>
                    <el-form-item label="角色描述" prop="roleDesc">
                        <el-input v-model="addRolesForm.roleDesc"></el-input>
                    </el-form-item>
                </el-form>
                <!-- 底部区域 -->
                <span slot="footer" class="dialog-footer">
                    <el-button @click="addDialogVisible= false">取 消</el-button>
                    <el-button type="primary" @click="addRoles">确 定</el-button>
                </span>
        </el-dialog>
        <!-- 添加编辑对话框 -->
        <el-dialog title="提示"
                    :visible.sync="editDialogVisible"
                    width="50%" @close="editDialogClosed">
                <!-- 内容主体区域 -->
                <el-form :model="editRolesForm" :rules="editFormRules" ref="editFormRef" label-width="80px" >
                    <el-form-item label="角色名称" prop="roleName">
                        <el-input v-model="editRolesForm.roleName"></el-input>
                    </el-form-item>
                    <el-form-item label="角色描述" prop="roleDesc">
                        <el-input v-model="editRolesForm.roleDesc"></el-input>
                    </el-form-item>
                </el-form>
                <!-- 底部区域 -->
                <span slot="footer" class="dialog-footer">
                    <el-button @click="editDialogVisible= false">取 消</el-button>
                    <el-button type="primary" @click="editRoles">确 定</el-button>
                </span>
        </el-dialog>
        <!-- 分配权限对话框 -->
        <el-dialog title="分配权限"
                    :visible.sync="setRightDialogVisible"
                    width="50%"
                    @close="setRightDialogClosed">
                <!-- 内容主体区域 -->
                <!-- 树形控件 -->
                <el-tree
                :data="rightslist"
                show-checkbox
                :props="treeProps"
                default-expand-all
                node-key="id"
                :default-checked-keys="defKeys"
                ref="treeRef">
                </el-tree>
                <!-- 底部区域 -->
                <span slot="footer" class="dialog-footer">
                    <el-button @click="setRightDialogVisible= false">取 消</el-button>
                    <el-button type="primary" @click="allotRights">确 定</el-button>
                </span>
        </el-dialog>
    </div>
</template>

<script>
    export default {
            data(){
                return {
                    //所有角色列表数据
                    roleList:[],
                    addRolesForm:{
                        roleName:"",
                        roleDesc:""
                    },
                    editRolesForm:{},
                    addDialogVisible:false,
                    editDialogVisible:false,
                    setRightDialogVisible:false,
                    rightslist:[],
                    // 属性控件的属性绑定对象
                    treeProps:{
                        label:"authName",
                        children:"children",
                    },
                    // 默认选中节点id值数组
                    defKeys:[105,116],
                    // 当前即将分配权限的角色id
                    roleId:"",
                    addFormRules:{
                        roleName:[
                             {required:true,message:"请输入角色名称",trigger:"blur"},
                             {min:3,max:10,message:"角色名称的长度在3~10个字符之间",trigger:"blur"}
                        ]
                    },
                    editFormRules:{
                        roleName:[
                             {required:true,message:"请输入角色名称",trigger:"blur"},
                             {min:3,max:10,message:"角色名称的长度在3~10个字符之间",trigger:"blur"}
                        ]
                    }
                    
                }
            },
            created(){
                this.getRolesList()
            },
            methods:{
                //获取所有角色的列表
                getRolesList(){
                    this.axios.get("/v1/roles").then(res=>{
                        if(res.data.meta.status!==200){
                            return this.$message.error("获取角色列表失败")
                        }
                        this.roleList=res.data.data;
                        
                    })
                },
                addRolesOpen(){
                    this.addDialogVisible=true
                },
                addDialogClosed(){
                this.$refs.addFormRef.resetFields();
                },
                addRoles(){
                    this.axios.post("/v1/roles",this.addRolesForm).then(res=>{
                        if(res.data.meta.status!==201){
                            return this.$message.error("添加角色失败")
                        }
                        this.$message.success("添加角色成功")
                        this.getRolesList();
                        this.addDialogVisible=false;
                    })
                },
                editDialogClosed(){
                    this.$refs.editFormRef.resetFields();
                },
                editRoles(){
                    this.$refs.editFormRef.validate(valid=>{
                        if(!valid) return ;
                        this.axios.put("/v1/roles/"+this.editRolesForm.roleId,{roleName:this.editRolesForm.roleName,roleDesc:this.editRolesForm.roleDesc}).then(res=>{
                           console.log(res)
                           if(res.data.meta.status!==200){
                                 return this.$message.error("更新角色信息失败");
                            }
                            this.editDialogVisible=false;
                            this.getRolesList();
                            this.$message.success("更新成功")
                        })
                    })
                },
                showEditInfo(id){
                     this.editDialogVisible=true;
                     this.axios.get("/v1/roles/"+id).then(res=>{
                            if(res.data.meta.status!==200){
                                return this.$message.error("查询角色信息失败")
                            }
                      this.editRolesForm=res.data.data
                })
                },
                removeRoleById(id){
                     // 弹框询问是否删除
                  let  confirmResult= this.$confirm('此操作将永久删除该用户信息, 是否继续?', '提示', {
                     confirmButtonText: '确定',
                     cancelButtonText: '取消',
                     type: 'warning'
                    }).then(res=>{
                      this.axios.delete("/v1/roles/"+id).then(res=>{
                        if(res.data.meta.status!==200){
                            return this.$message.error("删除角色失败")
                        }
                       this.$message.success("删除角色成功")
                       this.getRolesList();
                      })
                    }).catch(err=>{
                        this.$message.info("已取消删除")
                    })
                    //如果用户确认删除 则返回值为字符串 confirm
                    //如果用户取消了删除,则返回为字符串 cancel
                },
                removeRightById(role,rightId){
                       // 弹框询问是否删除
                  let  confirmResult= this.$confirm('此操作将永久删除该用户信息, 是否继续?', '提示', {
                     confirmButtonText: '确定',
                     cancelButtonText: '取消',
                     type: 'warning'
                    }).then(res=>{
                      this.axios.delete(`/v1/roles/${role.id}/rights/${rightId}`).then(res=>{
                        if(res.data.meta.status!==200){
                            return this.$message.error("删除角色权限失败")
                        }
                       this.$message.success("删除角色权限成功")
                       role.children=res.data.data
                      })
                    }).catch(err=>{
                        this.$message.info("已取消删除")
                    })
                    //如果用户确认删除 则返回值为字符串 confirm
                    //如果用户取消了删除,则返回为字符串 cancel
                },
                showSetRightDialog(role){
                    this.roleId=role.id;
                    this.axios.get("/v1/rights/tree").then(res=>{
                        if(res.data.meta.status!==200){
                            return this.$message.error("获取角色权限失败")
                        }
                        // 把获取到的权限数据保存到data中
                        this.rightslist=res.data.data
                        this.getLeafKeys(role,this.defKeys);
                        this.setRightDialogVisible=true;
                    })
                },
                 // 通过递归的方式获取角色下所有三级权限的id并保存到defKeys数组中
                    getLeafKeys(node,arr){
                        // 如果当前的node节点不包含children属性
                        // 则是三级节点
                        if(!node.children){
                            return arr.push(node.id)
                        }
                        node.children.forEach(item=>{
                            this.getLeafKeys(item,arr)
                        })
                    },
                    setRightDialogClosed(){
                        this.defKeys=[]
                    },
                    allotRights(){
                        const keys=this.$refs.treeRef.getCheckedKeys().concat(this.$refs.treeRef.getHalfCheckedKeys())
                        const idStr=keys.join(",");
                        this.axios.post(`/v1/roles/${this.roleId}/rights`,{rids:idStr}).then(res=>{
                            if(res.data.meta.status!==200){
                                return this.$message.error("分配角色权限失败")
                            }
                            this.$message.success("分配角色权限成功");
                            this.getRolesList()
                            this.setRightDialogVisible=false;
                        })
                    }
            }
    }
</script>

<style lang="less" scoped>
   .el-breadcrumb{
     margin-bottom:15px;
     font-size:12px;
 }
   
 .el-tag{
     margin:7px;
 }
 .bdbottom{
     border-bottom:1px solid #eee;
 }
 .dbtop{
      border-top:1px solid #eee;
 }
 .vcenter{
     display:flex;
     align-items: center;
 }
</style>
