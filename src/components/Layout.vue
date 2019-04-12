<template>
    <el-container>
        <el-header style="background: antiquewhite">
            <el-row type="flex" class="row-bg" justify="space-between">
                <el-col :span="6">
                    <img width="100px" height="50px" />
                    <span style="line-height: 50px;display: inline-block">LogSystem</span>
                </el-col>
                <el-col :span="6" style="text-align: right;line-height: 60px">
                    <el-dropdown>
                        <span class="el-dropdown-link">
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
        <el-main style="background: beige">
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
</style>