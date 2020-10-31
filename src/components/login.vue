<template>
    <div class="login_container">
        <div class="login_box">
            <!-- 头像区域     -->
            <div class="avatar_box">
              <img src="../assets/img/1.jpg" alt="">
            </div>
            <!-- 登录表单区域 -->
            <el-form label-width="0px" ref="loginFormRef" class="login_form" :model="loginForm" :rules="loginFormRules">
                <!-- 账号 -->
                <el-form-item prop="username">
                    <el-input  prefix-icon="iconfont icon-RectangleCopy" v-model="loginForm.username">
                    </el-input>
                </el-form-item>
                <!-- 密码 -->
                <el-form-item  prop="password">
                    <el-input type="password" prefix-icon="iconfont icon-RectangleCopy1" v-model="loginForm.password"></el-input>
                </el-form-item>
                <!-- 按钮 -->
                <el-form-item class="btns">
                    <el-button type="primary" @click="login">登录</el-button>
                    <el-button type="info" @click="reset">重置</el-button>
                </el-form-item>
            </el-form>
        </div>
    </div>
</template>

<script>
    export default {
        name:"login",
        data(){
            return {
                loginForm:{
                      username:"admin",
                      password:"123456"
                },
                loginFormRules:{
                    username:[
                        {required:true,message:"请输入登录名称",trigger:"blur"},
                        {min:3,max:10,message:"长度在 3 到 10 个字符",trigger:"blur"}
                    ],
                    password:[
                         {required:true,message:"请输入登录密码",trigger:"blur"},
                         {min:6,max:15,message:"长度在 6 到 15 个字符",trigger:"blur"}
                    ]
                }
            }
        },
        methods:{
            reset(){
                console.log(this);
                // 点击重置按钮 重置登陆表单
                this.$refs.loginFormRef.resetFields();
            },
            login(){
                // 登录按钮发送请求
                this.$refs.loginFormRef.validate((valid)=>{
                    if(!valid)return;
                        this.axios.post("/login",this.loginForm).then((result)=>{
                        console.log(result);
                       if(result.data.meta.status !==200){
                           return this.$message.error("登陆失败")
                       }
                    //    将登陆之后的token 保存到客户端的sessionStorage中
                        // 项目中的除了登录之外的其它API接口 必须在登陆之后才能访问
                        // token 只应在当前网站打开期间生效 所以将token 保存在sessionStorage中
                       this.$message.success("登陆成功");
                    //    console.log(result)
                    //    通过编程式导航跳转到后台主页 路由是/home
                       window.sessionStorage.setItem("token",result.data.data.token)
                       this.$router.push("/home");
                       
                    })
                })
            }
        }
    }
</script>

<style lang="less" scoped>
   .login_container{
       background-color: #2b4b6b;
       height:100%;
   }
   .login_box{
       width:450px;
       height:300px;
       background-color: #fff;
       border-radius: 3px;
       position: absolute;
       top:50%;
       left:50%;
       transform:translate(-50%,-50%);
        .avatar_box{
            height:130px;
            width:100px;
            border:1px solid #eee;
            padding:10px;
            box-shadow:0 0 10px #ddd;
            border-radius: 50%;
            position: absolute;
            left: 50%;
            transform:translate(-50%,-50%);
            img{
                width:100%;
                height:100%;
                border-radius: 50%;
            }
            
        }
   }
   .login_form{
      position: absolute;
      bottom:0px;
      width:100%;
      padding:0 20px;
      box-sizing: border-box;
   }
   .btns{
       display:flex;
       justify-content: flex-end;
   }
</style>
