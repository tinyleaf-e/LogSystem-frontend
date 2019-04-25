<template>
    <el-container style="padding: 0">
        <el-header style="height: auto;">
            <el-row>
                <el-col :span="24" style="padding: 20px 0;background: rgba(255,255,255,0)">
                    <el-breadcrumb separator-class="el-icon-arrow-right">
                        <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
                        <el-breadcrumb-item>活动管理</el-breadcrumb-item>
                        <el-breadcrumb-item>活动列表</el-breadcrumb-item>
                        <el-breadcrumb-item>活动详情</el-breadcrumb-item>
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
                <el-col :span="8" v-for="i in formats" :key="i.name" class="block">
                    <el-card class="box-card" shadow="always">
                        <div slot="header" class="clearfix">
                            <span>{{i.Name}}</span>
                            <el-button style="float: right; padding: 3px 0" type="text" @click="toFormatItems(i.Id)">详情</el-button>
                            <el-button style="float: right; padding: 3px 0" type="text" @click="toLogs(i.Id)">日志</el-button>
                            <el-button style="float: right; padding: 3px 0" type="text" @click="deleteFormat(i.Id)">删除</el-button>
                        </div>
                        <div class="text item project-item">
                            <label>createTime:</label>
                            <span>{{i.CreateTime}}</span>
                        </div>
                        <div class="text item project-item">
                            <label>desc:</label>
                            <span>{{i.Desc}}</span>
                        </div>
                        <div class="text item project-item">
                            <label>todayAdded:</label>
                            <span>{{i.Name}}</span>
                        </div>
                        <div class="text item project-item divider">
                            <label>todayAdded:</label>
                            <span>{{i.Name}}</span>
                        </div>
                        <div class="text item project-item">
                            <label>todayAdded:</label>
                            <span>{{i.Name}}</span>
                        </div>
                        <div class="text item project-item">
                            <label>todayAdded:</label>
                            <span>{{i.Name}}</span>
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
        name: "Format",
        data: function () {
            return {
                userId: cookies.get("id"),
                projectId: this.$route.query.projectId,
                formats: [],
                dialogFormVisible: false,
                form: {
                    id: '',
                    desc: ''
                },
                formLabelWidth: '80px'
            }
        },
        mounted() {
            this.getFormats()
        },
        methods: {
            getFormats: function () {
                axios.get(config.serverUrl + "/format", {
                    params: {
                        projectId: this.projectId
                    },
                    validateStatus: function () {
                        return true
                    },
                    headers: {'Authorization': cookies.get("token")},
                })
                    .then(response => {
                        if (response.status == 200) {
                            this.formats = response.data.rel
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
            dialogCancel: function () {
                this.dialogFormVisible = false;
                this.form = {
                    id: '',
                    desc: ''
                }
            },
            dialogConfirm: function () {

                if (this.form.id.trim() == "" || this.form.desc.trim() == "") {
                    this.$message({
                        message: "ID和描述不能为空",
                        type: 'error'
                    });
                } else if (this.idExist(this.form.id)) {
                    this.$message({
                        message: "该格式ID已存在",
                        type: 'error'
                    });
                } else {
                    var postData = {
                        userId: this.userId,
                        name: this.form.id,
                        desc: this.form.desc,
                        projectId:this.projectId
                    };
                    this.$ajax.post(config.serverUrl + "/format", this.$qs.stringify(postData), {
                        validateStatus: function () {
                            return true
                        },
                        headers: {'Authorization': cookies.get("token")},
                    })
                        .then(response => {
                            if (response.status == 200) {
                                this.getFormats();
                                this.$message({
                                    message: response.data.rel,
                                    type: 'success'
                                });
                                this.dialogFormVisible = false
                            }
                            else
                                this.$message({
                                    message: response.data.msg,
                                    type: 'error'
                                });
                        })
                }
                this.dialogFormVisible = true;
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
                    headers: {'Authorization': cookies.get("token")},
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
    .item.divider{
        border-top: 1px solid #eee;
    }

    .item{
        margin:10px 0;
    }
</style>