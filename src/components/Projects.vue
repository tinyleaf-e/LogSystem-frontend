<template>
    <el-container style="padding: 0">
        <el-header style="height: auto;">
            <el-row>
                <el-col :span="24" style="padding: 20px 0;background: rgba(255,255,255,0)">
                    <el-breadcrumb separator-class="el-icon-arrow-right">
                        <el-breadcrumb-item :to="{ path: '/projects' }">首页</el-breadcrumb-item>
                    </el-breadcrumb>
                </el-col>
            </el-row>
        </el-header>
        <el-main style="background: white;padding-top: 0">
            <el-row>
                <h3>项目列表</h3>
            </el-row>
            <el-row>
                <el-button type="primary" icon="el-icon-plus" @click="dialogFormVisible=true" style="margin-bottom: 20px">新增</el-button>
            </el-row>
            <el-row :gutter="20">
                <el-col :span="8" v-for="i in projects" :key="i.name" class="block">
                    <el-card class="box-card">
                        <div slot="header" class="clearfix">
                            <span>{{i.Name}}</span>
                            <el-button style="float: right; padding: 3px 0" type="text" @click="toFormats(i.Id)">详情</el-button>
                            <el-button style="float: right; padding: 3px 0" type="text" @click="deleteProject(i.Id)">删除</el-button>
                        </div>
                        <div class="text item project-item">
                            <label>创建时间:</label>
                            <span>{{$dateformat( i.CreateTime,'yyyy-mm-dd HH:MM:ss')}}</span>
                        </div>
                        <div class="text item project-item">
                            <label>描述:</label>
                            <span>{{i.Desc}}</span>
                        </div>
                        <div class="text item project-item">
                            <label>Ticket:</label>
                            <span>{{i.Ticket}}</span>
                        </div>
                    </el-card>
                </el-col>
            </el-row>
            <el-dialog title="新增项目" :visible.sync="dialogFormVisible">
                <el-form :model="form">
                    <el-form-item label="项目ID" :label-width="formLabelWidth">
                        <el-input v-model="form.id" autocomplete="off"></el-input>
                    </el-form-item>
                    <el-form-item label="描述" prop="desc" :label-width="formLabelWidth">
                        <el-input type="textarea" v-model="form.desc"></el-input>
                    </el-form-item>
                </el-form>
                <div slot="footer" class="dialog-footer">
                    <el-button @click="dialogCancel()">取 消</el-button>
                    <el-button type="primary" @click="dialogConfirm()">确 定</el-button>
                </div>
            </el-dialog>
        </el-main>


    </el-container>
</template>

<script>
    import axios from "axios";
    import cookies from "js-cookie"
    export default {
        name: "Projects",
        data:function () {
            return {
                userId:cookies.get("id"),
                projects:[],
                dialogFormVisible: false,
                form: {
                    id: '',
                    desc: ''
                },
                formLabelWidth: '80px'
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
            },
            toFormats:function (projectId) {
                this.$router.push({path:'/formats',query:{projectId:projectId}})
            },
            dialogCancel:function(){
                this.dialogFormVisible=false;
                this.form={
                    id: '',
                    desc: ''
                }
            },
            dialogConfirm:function () {

                if(this.form.id.trim()==""||this.form.desc.trim()==""){
                    this.$message({
                        message: "ID和描述不能为空",
                        type: 'error'
                    });
                }else if(this.idExist(this.form.id)){
                    this.$message({
                        message: "该项目ID已存在",
                        type: 'error'
                    });
                }else {
                    var postData={
                        userId:this.userId,
                        name:this.form.id,
                        desc:this.form.desc
                    };
                    this.$ajax.post(config.serverUrl+"/project",this.$qs.stringify(postData),{
                        validateStatus: function () {
                            return true
                        },
                        headers: {'Authorization': cookies.get("token")},
                    })
                        .then(response=>{
                            if(response.status==200){
                                this.getProjects();
                                this.$message({
                                    message: response.data.rel,
                                    type: 'success'
                                });
                                this.dialogFormVisible=false
                            }
                            else
                                this.$message({
                                    message: response.data.msg,
                                    type: 'error'
                                });
                        })
                }
                this.dialogFormVisible=true;
            },

            idExist:function (id) {
                for(var i in this.projects){
                    if(i.Name==id)
                        return true
                }
                return false
            },
            deleteProject:function (id) {
                this.$ajax.delete(config.serverUrl+"/project/"+id,{
                    validateStatus: function () {
                        return true
                    },
                    headers: {'Authorization': cookies.get("token")},
                })
                    .then(response=>{
                        if(response.status==200){
                            this.getProjects();
                            this.$message({
                                message: response.data.rel,
                                type: 'success'
                            });
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

    .block{
        padding-bottom: 30px;
    }
    .item label{
        font-weight: bold;
        width: 70px;
        display: inline-block;
        text-align: right;
    }
    .item{
        margin:10px 0;
    }
</style>