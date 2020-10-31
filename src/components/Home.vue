<template>
    <el-container class="home-container">
        <!-- 头部区域 -->
        <el-header>
            <div>
                <img src="../assets/img/2.jpg" alt="">
                <span>电商管理系统</span>
            </div>
             <el-button type="info" @click="logout">退出</el-button>
        </el-header>
        <!-- 页面区域 -->
        <el-container>
            <!-- 侧边栏 -->
            <el-aside :width='isCollapse?"60px":"200px"'>
                <div class="toggle-button" @click="toggleCollapse">|||</div>
                <!-- 侧边栏   -->
                <el-menu default-active="2"
                         background-color="#333744"
                         text-color="#fff"
                         active-text-color="#409EFF"
                         unique-opened
                         :collapse="isCollapse"
                         :collapse-transition="false"
                         router
                         defaultActive="/home/user">
                         <!-- 一级菜单   -->
                    <el-submenu index="1">
                        <!-- 一级菜单模板区域 -->
                        <template slot="title">
                            <!-- 图标 -->
                            <i class="el-icon-user-solid"></i>
                            <!-- 文本 -->
                            <span>用户管理</span>
                        </template>
                        <!-- 二级菜单 -->
                        <el-menu-item index="/home/user">
                            <template slot="title">
                            <!-- 图标 -->
                            <i class="el-icon-menu"></i>
                            <!-- 文本 -->
                            <span>用户列表</span>
                        </template>
                        </el-menu-item>
                    </el-submenu>
                         <!-- 一级菜单   -->
                    <el-submenu index="2">
                        <!-- 一级菜单模板区域 -->
                        <template slot="title">
                            <!-- 图标 -->
                            <i class="el-icon-s-help"></i>
                            <!-- 文本 -->
                            <span>权限管理</span>
                        </template>
                        <!-- 二级菜单 -->
                        <el-menu-item index="/home/roles">
                            <template slot="title">
                            <!-- 图标 -->
                            <i class="el-icon-menu"></i>
                            <!-- 文本 -->
                            <span>角色列表</span>
                        </template>
                        </el-menu-item>
                        <el-menu-item index="/home/right">
                            <template slot="title">
                            <!-- 图标 -->
                            <i class="el-icon-menu"></i>
                            <!-- 文本 -->
                            <span>权限列表</span>
                        </template>
                        </el-menu-item>
                    </el-submenu>
                         <!-- 一级菜单   -->
                    <el-submenu index="3">
                        <!-- 一级菜单模板区域 -->
                        <template slot="title">
                            <!-- 图标 -->
                            <i class="el-icon-s-goods"></i>
                            <!-- 文本 -->
                            <span>商品管理</span>
                        </template>
                        <!-- 二级菜单 -->
                        <el-menu-item index="/home/goods">
                            <template slot="title">
                            <!-- 图标 -->
                            <i class="el-icon-menu"></i>
                            <!-- 文本 -->
                            <span>商品列表</span>
                        </template>
                        </el-menu-item>
                        <el-menu-item index="/home/params">
                            <template slot="title">
                            <!-- 图标 -->
                            <i class="el-icon-menu"></i>
                            <!-- 文本 -->
                            <span>分类参数</span>
                        </template>
                        </el-menu-item>
                        <el-menu-item index="/home/categories">
                            <template slot="title">
                            <!-- 图标 -->
                            <i class="el-icon-menu"></i>
                            <!-- 文本 -->
                            <span>商品参数</span>
                        </template>
                        </el-menu-item>
                    </el-submenu>
                    <el-submenu index="4">
                        <!-- 一级菜单模板区域 -->
                        <template slot="title">
                            <!-- 图标 -->
                            <i class="el-icon-s-order"></i>
                            <!-- 文本 -->
                            <span>订单管理</span>
                        </template>
                        <!-- 二级菜单 -->
                        <el-menu-item index="/home/orders">
                            <template slot="title">
                            <!-- 图标 -->
                            <i class="el-icon-menu"></i>
                            <!-- 文本 -->
                            <span>订单列表</span>
                        </template>
                        </el-menu-item>
                    </el-submenu>
                    <el-submenu index="5">
                        <!-- 一级菜单模板区域 -->
                        <template slot="title">
                            <!-- 图标 -->
                            <i class="el-icon-s-platform"></i>
                            <!-- 文本 -->
                            <span>数据统计</span>
                        </template>
                        <!-- 二级菜单 -->
                        <el-menu-item index="/home/reports">
                            <template slot="title">
                            <!-- 图标 -->
                            <i class="el-icon-menu"></i>
                            <!-- 文本 -->
                            <span>数据报表</span>
                        </template>
                        </el-menu-item>
                    </el-submenu>
                </el-menu>
            </el-aside>
            <!-- 右侧内容 主体-->
            <el-main>
                <router-view></router-view>
            </el-main>
        </el-container>
    </el-container>
</template>

<script>
export default {
  name: "home",
  data(){
    return {
       isCollapse:false
    }  
  },
  created(){
        
      },
  methods: {
    logout() {
      window.sessionStorage.clear();
      this.$router.push("/login");
    },
    toggleCollapse(){
         this.isCollapse=!this.isCollapse;  
    }
  }
};
</script>

<style lang="less" scoped>
.home-container {
  height: 100%;
}
.el-header {
  background-color: #373d41;
  display: flex;
  justify-content: space-between;
  padding-left: 0;
  align-items: center;
  color: #fff;
  font-size: 20px;
  img {
    width: 50px;
    height: 50px;
    border-radius: 50%;
  }
  > div {
    display: flex;
    align-items: center;
    span {
      margin-left: 15px;
    }
  }
}
.el-aside {
  background-color: #333744;
  transition:0.5s; 
}
.el-menu{
    border:none;
}
.el-main {
  background-color: #eaedf1;
}
.toggle-button{
    background-color: #4A5064;
    font-size: 10px;
    color:#fff;
    text-align: center;
    letter-spacing: 0.2em;
    line-height: 20px;
}
</style>
