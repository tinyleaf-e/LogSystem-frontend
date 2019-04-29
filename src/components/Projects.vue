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
                <el-button type="primary" icon="el-icon-plus" @click="addDialogFormVisible=true" style="margin-bottom: 20px">新增</el-button>
            </el-row>
            <el-row :gutter="20">
                <span v-if="dataTip!=''" style="font-size: 16px;margin-left: 10px">{{dataTip}}</span>
                <el-col :md="8" :sm="12" v-for="(i,idx) in projects" :key="i.name" class="block">
                    <el-card class="box-card">
                        <div slot="header" class="clearfix">
                            <span>{{i.Name}}</span>
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
                        <div class="card-footer">
                            <el-button size="small" class="footer-btn" icon="el-icon-document" type="primary" title="详情" @click="toFormats(i.Id)"></el-button>
                            <el-button size="small" class="footer-btn" icon="el-icon-edit" type="warning" title="编辑" @click="editDialogShow(idx)"></el-button>
                            <el-button size="small" class="footer-btn" icon="el-icon-delete" type="danger" title="删除" @click="deleteProject(i.Id)"></el-button>
                        </div>
                    </el-card>
                </el-col>
            </el-row>
            <el-dialog title="新增项目" :visible.sync="addDialogFormVisible">
                <el-form :model="addform">
                    <el-form-item label="项目ID: " :label-width="formLabelWidth">
                        <el-input v-model="addform.id" autocomplete="off"></el-input>
                    </el-form-item>
                    <el-form-item label="描述: " prop="desc" style="margin-bottom: 0" :label-width="formLabelWidth">
                        <el-input type="textarea" v-model="addform.desc"></el-input>
                    </el-form-item>
                </el-form>
                <div slot="footer" class="dialog-footer">
                    <el-button @click="addDialogCancel()">取 消</el-button>
                    <el-button type="primary" @click="addDialogConfirm()">确 定</el-button>
                </div>
            </el-dialog>
            <el-dialog title="编辑项目" :visible.sync="editDialogFormVisible">
                <el-form :model="editform">
                    <el-form-item label="项目ID: " :label-width="formLabelWidth">
                        <el-input v-model="editform.id" autocomplete="off"></el-input>
                    </el-form-item>
                    <el-form-item label="描述: " prop="desc" :label-width="formLabelWidth">
                        <el-input type="textarea" v-model="editform.desc"></el-input>
                    </el-form-item>
                    <el-form-item label="Ticket: " prop="desc" style="margin-bottom: 0" :label-width="formLabelWidth">
                        <span>{{editform.ticket}}</span>
                        <el-button type="text" style="margin-left: 10px" title="生成新的 Ticket" icon="el-icon-refresh"></el-button>
                    </el-form-item>
                </el-form>
                <div slot="footer" class="dialog-footer">
                    <el-button @click="editDialogCancel()">取 消</el-button>
                    <el-button type="primary" @click="editDialogConfirm()">确 定</el-button>
                </div>
            </el-dialog>
        </el-main>


    </el-container>
</template>

<script>
    export default {
        name: "Projects",
        data:function () {
            return {
                userId:this.$cookie.get("id"),
                projects:[],
                addDialogFormVisible: false,
                editDialogFormVisible: false,
                addform: {
                    id: '',
                    desc: ''
                },
                editform: {
                    id: '',
                    desc: '',
                    ticket: '',
                    projectId: ''
                },
                formLabelWidth: '80px',
                dataTip:"正在获取数据..."
            }
        },
        mounted(){
            this.getProjects()
        },
        methods:{
            getProjects:function () {
                this.$ajax.get(config.serverUrl+"/project", {
                    params: {
                        userId: this.userId
                    },
                    validateStatus: function () {
                        return true
                    },
                    headers: {'Authorization': this.$cookie.get("token")},
                })
                    .then(response=>{
                        if(response.status==200){
                            if(response.data.rel.length>0)
                                this.dataTip="";
                            else
                                this.dataTip="您还未创建项目";
                            this.projects=response.data.rel
                        }
                        else {
                            this.dataTip = "数据获取错误";
                            this.$message({
                                message: response.data.msg,
                                type: 'error'
                            });
                        }
                    })
            },
            toFormats:function (projectId) {
                this.$router.push({path:'/formats',query:{projectId:projectId}})
            },
            addDialogCancel:function(){
                this.addDialogFormVisible=false;
                this.addform={
                    id: '',
                    desc: ''
                }
            },
            addDialogConfirm:function () {

                if(this.addform.id.trim()==""||this.addform.desc.trim()==""){
                    this.$message({
                        message: "ID和描述不能为空",
                        type: 'error'
                    });
                }else if(this.idExist(this.addform.id)){
                    this.$message({
                        message: "该项目ID已存在",
                        type: 'error'
                    });
                }else {
                    var postData={
                        userId:this.userId,
                        name:this.addform.id,
                        desc:this.addform.desc
                    };
                    this.$ajax.post(config.serverUrl+"/project",this.$qs.stringify(postData),{
                        validateStatus: function () {
                            return true
                        },
                        headers: {'Authorization': this.$cookie.get("token")},
                    })
                        .then(response=>{
                            if(response.status==200){
                                this.getProjects();
                                this.$message({
                                    message: response.data.rel,
                                    type: 'success'
                                });
                                this.addDialogFormVisible=false
                            }
                            else
                                this.$message({
                                    message: response.data.msg,
                                    type: 'error'
                                });
                        })
                }
            },
            editDialogShow:function(idx){
                this.editDialogFormVisible=true;
                this.editform.ticket=this.projects[idx].Ticket;
                this.editform.projectId=this.projects[idx].Id;
                this.editform.id=this.projects[idx].Name;
                this.editform.desc=this.projects[idx].Desc;
            },
            editDialogCancel:function(){
                this.editDialogFormVisible=false;
                this.editform={
                    id: '',
                    desc: ''
                }
            },
            editDialogConfirm:function () {

                if(this.editform.id.trim()==""||this.editform.desc.trim()==""){
                    this.$message({
                        message: "ID和描述不能为空",
                        type: 'error'
                    });
                }else {
                    var postData={
                        name:this.editform.id,
                        desc:this.editform.desc
                    };
                    this.$ajax.post(config.serverUrl+"/project/"+this.editform.projectId,this.$qs.stringify(postData),{
                        validateStatus: function () {
                            return true
                        },
                        headers: {'Authorization': this.$cookie.get("token")},
                    })
                        .then(response=>{
                            if(response.status==200){
                                this.getProjects();
                                this.$message({
                                    message: response.data.rel,
                                    type: 'success'
                                });
                                this.editDialogFormVisible=false
                            }
                            else
                                this.$message({
                                    message: response.data.msg,
                                    type: 'error'
                                });
                        })
                }
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
                    headers: {'Authorization': this.$cookie.get("token")},
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
    .item span{
        margin-left: 5px;
        display: inline-block;
        width: calc(100% - 80px);
        vertical-align: top;
    }
    .card-footer{
        text-align: right;
        border-top: 1px solid #eee;
        padding: 15px 0 0 0;
        margin-bottom: -5px;
    }
    .footer-btn{
        padding: 9px 12px;
        margin-left: 5px;
    }
</style>