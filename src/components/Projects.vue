<template>
    <div>
        <el-row>
            <el-col :span="24" style="padding-bottom: 10px;border-bottom: 1px solid #eee;margin-bottom: 20px">
                <el-breadcrumb separator-class="el-icon-arrow-right">
                    <el-breadcrumb-item :to="{ path: '/pojects' }">首页</el-breadcrumb-item>
                </el-breadcrumb>
            </el-col>
        </el-row>
        <el-row>
            <h3>项目列表</h3>
        </el-row>
        <el-row :gutter="20">
            <el-col :span="12" v-for="i in projects" :key="i.name" class="project-block">
                <el-card class="box-card">
                    <div slot="header" class="clearfix">
                        <span>{{i.Name}}</span>
                        <el-button style="float: right; padding: 3px 0" type="text">详情</el-button>
                    </div>
                    <div class="text item project-item">
                        <label>创建时间:</label>
                        <span>{{i.CreateTime}}</span>
                    </div>
                    <div class="text item project-item">
                        <label>描述:</label>
                        <span>{{i.Desc}}</span>
                    </div>
                    <div class="text item project-item">
                        <label>今日新增:</label>
                        <span>{{i.Name}}</span>
                    </div>
                </el-card>
            </el-col>
        </el-row>
    </div>
</template>

<script>
    import axios from "axios";
    import cookies from "js-cookie"
    export default {
        name: "Projects",
        data:function () {
            return {
                userId:cookies.get("id"),
                projects:[]
            }
        },
        mounted(){
            this.getProjects()
        },
        methods:{
            getProjects:function () {
                axios.get(config.serverUrl+"/project", {
                    params: {
                        userId: this.userId
                    },
                    validateStatus: function () {
                        return true
                    },
                    headers: {'Authorization': cookies.get("token")},
                })
                    .then(response=>{
                        if(response.status==200){
                            this.projects=response.data.rel
                        }
                        else
                            this.$message({
                                message: response.data.msg,
                                type: 'error'
                            });
                    })
            }
        }
    }
</script>

<style scoped>

    .project-block{
        padding-bottom: 20px;
    }
    .item label{
        font-weight: bold;
        width: 70px;
        display: inline-block;
        text-align: right;
    }
</style>