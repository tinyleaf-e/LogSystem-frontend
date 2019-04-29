<template>
    <el-container style="padding: 0">
        <el-header style="height: auto;">
            <el-row>
                <el-col :span="24" style="padding: 20px 0;background: rgba(255,255,255,0)">
                    <el-breadcrumb separator-class="el-icon-arrow-right">
                        <el-breadcrumb-item :to="{ path: '/projects' }">首页</el-breadcrumb-item>
                        <el-breadcrumb-item :to="{path: this.nav.projectUrl}">{{this.nav.projectName}}</el-breadcrumb-item>
                    </el-breadcrumb>
                </el-col>
            </el-row>
        </el-header>
        <el-main style="background: white;padding-top: 0">
            <el-row>
                <h3>格式列表</h3>
            </el-row>
            <el-row>
                <el-button type="primary" icon="el-icon-plus" @click="addDialogFormVisible=true" style="margin-bottom: 20px">新增</el-button>
            </el-row>
            <el-row :gutter="20">
                <span v-if="dataTip!=''" style="font-size: 16px;margin-left: 10px">{{dataTip}}</span>
                <el-col :md="8" :sm="12" v-for="(i,idx) in formats" :key="i.name" class="block">
                    <el-card class="box-card" shadow="always">
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
                        <div class="text item project-item divider">
                            <label>今日新增:</label>
                            <span>{{i.Name}}</span>
                        </div>
                        <div class="card-footer">
                            <el-button size="small" class="footer-btn" icon="el-icon-document" type="primary" title="详情" @click="toFormatItems(i.Id)"></el-button>
                            <el-button size="small" class="footer-btn" icon="el-icon-search" title="检索日志" @click="toLogs(i.Id)"></el-button>
                            <el-button size="small" class="footer-btn" icon="el-icon-edit" type="warning" title="编辑" @click="editDialogShow(idx)"></el-button>
                            <el-button size="small" class="footer-btn" icon="el-icon-delete" type="danger" title="删除" @click="deleteFormat(i.Id)"></el-button>
                        </div>
                    </el-card>
                </el-col>
            </el-row>
            <el-dialog title="新增格式" :visible.sync="addDialogFormVisible" custom-class="dialog">
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
            <el-dialog title="编辑格式" :visible.sync="editDialogFormVisible">
                <el-form :model="editform">
                    <el-form-item label="项目ID: " :label-width="formLabelWidth">
                        <el-input v-model="editform.id" autocomplete="off"></el-input>
                    </el-form-item>
                    <el-form-item label="描述: " prop="desc" :label-width="formLabelWidth">
                        <el-input type="textarea" v-model="editform.desc"></el-input>
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
        name: "Format",
        data: function () {
            return {
                userId: this.$cookie.get("id"),
                projectId: this.$route.query.projectId,
                nav:{
                    projectId:'',
                    projectName:''
                },
                formats: [],
                addDialogFormVisible: false,
                editDialogFormVisible: false,
                addform: {
                    id: '',
                    desc: ''
                },
                editform: {
                    id: '',
                    desc: '',
                    formatId: ''
                },
                formLabelWidth: '80px',
                dataTip:"正在获取数据..."
            }
        },
        mounted() {
            this.getFormats();
            this.initNav();
        },
        methods: {
            getFormats: function () {
                this.$ajax.get(config.serverUrl + "/format", {
                    params: {
                        projectId: this.projectId
                    },
                    validateStatus: function () {
                        return true
                    },
                    headers: {'Authorization': this.$cookie.get("token")},
                })
                    .then(response => {
                        if(response.status==200){
                            if(response.data.rel.length>0)
                                this.dataTip="";
                            else
                                this.dataTip="您还未创建格式";
                            this.formats=response.data.rel
                        }
                        else{
                            this.dataTip="数据获取错误";
                            this.$message({
                                message: response.data.msg,
                                type: 'error'
                            });
                        }

                    })
            },
            initNav:function(){
                this.$ajax.get(config.serverUrl+"/project/"+this.projectId, {
                    validateStatus: function () {
                        return true
                    },
                    headers: {'Authorization': this.$cookie.get("token")},
                })
                    .then(response=>{
                        if(response.status==200){
                            this.nav={
                                projectUrl:'/formats?projectId='+response.data.rel.Id,
                                projectName:response.data.rel.Name
                            }
                        }
                        else
                            this.$message({
                                message: response.data.msg,
                                type: 'error'
                            });
                    })
            },
            toFormatItems: function (formatId) {
                this.$router.push({path: '/format-items', query: {formatId: formatId}})
            },
            toLogs: function (formatId) {
                this.$router.push({path: '/logs', query: {formatId: formatId}})
            },
            addDialogCancel: function () {
                this.addDialogFormVisible = false;
                this.addform = {
                    id: '',
                    desc: ''
                }
            },
            addDialogConfirm: function () {

                if (this.addform.id.trim() == "" || this.addform.desc.trim() == "") {
                    this.$message({
                        message: "ID和描述不能为空",
                        type: 'error'
                    });
                } else if (this.idExist(this.addform.id)) {
                    this.$message({
                        message: "该格式ID已存在",
                        type: 'error'
                    });
                } else {
                    var postData = {
                        userId: this.userId,
                        name: this.addform.id,
                        desc: this.addform.desc,
                        projectId:this.projectId
                    };
                    this.$ajax.post(config.serverUrl + "/format", this.$qs.stringify(postData), {
                        validateStatus: function () {
                            return true
                        },
                        headers: {'Authorization': this.$cookie.get("token")},
                    })
                        .then(response => {
                            if (response.status == 200) {
                                this.getFormats();
                                this.$message({
                                    message: response.data.rel,
                                    type: 'success'
                                });
                                this.addDialogFormVisible = false
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
                this.editform.projectId=this.formats[idx].Id;
                this.editform.id=this.formats[idx].Name;
                this.editform.desc=this.formats[idx].Desc;
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
                    this.$ajax.post(config.serverUrl+"/format/"+this.editform.projectId,this.$qs.stringify(postData),{
                        validateStatus: function () {
                            return true
                        },
                        headers: {'Authorization': this.$cookie.get("token")},
                    })
                        .then(response=>{
                            if(response.status==200){
                                this.getFormats();
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
            idExist: function (id) {
                for (var i in this.formats) {
                    if (i.Name == id)
                        return true
                }
                return false
            },
            deleteFormat: function (id) {
                this.$ajax.delete(config.serverUrl + "/format/" + id, {
                    validateStatus: function () {
                        return true
                    },
                    headers: {'Authorization': this.$cookie.get("token")},
                })
                    .then(response => {
                        if (response.status == 200) {
                            this.getFormats();
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
    .item.divider{
        border-top: 1px solid #eee;
        padding-top: 10px;
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
    .dialog{
        max-width: 350px;
    }
</style>