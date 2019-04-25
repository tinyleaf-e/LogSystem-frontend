<template>
    <el-container>
        <el-header class="header" >
            <el-row type="flex" class="row-bg" style="max-width: 1200px;width: 100%;margin: 0 auto;overflow: hidden" justify="space-between">
                <el-col :span="6">
                    <img height="50px" src="../assets/logsystem-logo-svg.svg" />
                </el-col>
                <el-col :span="6" style="text-align: right;line-height: 50px">
                    <el-dropdown>
                        <span class="el-dropdown-link" style="font-size: 16px">
                            14211054<i class="el-icon-arrow-down el-icon--right"></i>
                        </span>
                        <el-dropdown-menu slot="dropdown">
                            <el-dropdown-item>个人信息</el-dropdown-item>
                            <el-dropdown-item divided>修改密码</el-dropdown-item>
                        </el-dropdown-menu>
                    </el-dropdown>
                </el-col>
            </el-row>
        </el-header>
        <el-main  style="max-width: 1200px;width: 100%;margin: 0 auto;overflow: hidden;padding: 0">
            <keep-alive>
                <router-view></router-view>
            </keep-alive>


        </el-main>
    </el-container>
</template>

<script>
    export default {
        name: "Layout"
    }
</script>

<style scoped>
    .header{
        background: white;
        padding: 15px 28px 12px 28px;
        box-shadow: 0px 5px 12px 0px rgba(0,0,0,0.1);
        height: auto!important;
    }
</style>