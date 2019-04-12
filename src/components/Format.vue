<template>
    <div>
        <el-row>
            <el-col :span="24" style="padding-bottom: 10px;border-bottom: 1px solid #eee;margin-bottom: 20px">
                <el-breadcrumb separator-class="el-icon-arrow-right">
                    <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
                    <el-breadcrumb-item>活动管理</el-breadcrumb-item>
                    <el-breadcrumb-item>活动列表</el-breadcrumb-item>
                    <el-breadcrumb-item>活动详情</el-breadcrumb-item>
                </el-breadcrumb>
            </el-col>
        </el-row>
        <el-row>
            <h3>项目列表</h3>
        </el-row>
        <el-row :gutter="20">
            <el-col :span="12" v-for="i in projects" :key="i.name" class="project-block">
                <el-card class="box-card" shadow="always">
                    <div slot="header" class="clearfix">
                        <span>{{i.name}}</span>
                        <el-button style="float: right; padding: 3px 0" type="text">操作按钮</el-button>
                    </div>
                    <div class="text item project-item">
                        <label>createTime:</label>
                        <span>{{i.createTime}}</span>
                    </div>
                    <div class="text item project-item">
                        <label>desc:</label>
                        <span>{{i.desc}}</span>
                    </div>
                    <div class="text item project-item">
                        <label>todayAdded:</label>
                        <span>{{i.name}}</span>
                    </div>
                    <div class="text item project-item divider">
                        <label>todayAdded:</label>
                        <span>{{i.name}}</span>
                    </div>
                    <div class="text item project-item">
                        <label>todayAdded:</label>
                        <span>{{i.name}}</span>
                    </div>
                    <div class="text item project-item">
                        <label>todayAdded:</label>
                        <span>{{i.name}}</span>
                    </div>
                </el-card>
            </el-col>
        </el-row>
    </div>
</template>

<script>
    export default {
        name: "Format",
        data:function () {

            return {
                projects:[
                    {
                        name:"Format 1",
                        createTime:"2019-09-09 12:11",
                        desc:"test test test"
                    },
                    {
                        name:"Format 2",
                        createTime:"2019-09-09 12:11",
                        desc:"test test test"
                    },
                    {
                        name:"Format 3",
                        createTime:"2019-09-09 12:11",
                        desc:"test test test"
                    },
                ]
            }
        }
    }
</script>

<style scoped>

    .project-block{
        padding-bottom: 20px;
    }
    .item.divider{
        border-top: 1px solid #eee;
    }
</style>