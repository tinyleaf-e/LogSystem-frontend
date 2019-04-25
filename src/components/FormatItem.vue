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
            <el-row>
                <el-table border
                        :data="formatItems"
                        style="width: 100%">
                    <el-table-column type="expand">
                        <template slot-scope="props">
                            <el-form label-position="left" inline class="demo-table-expand">
                                <el-form-item label="描述">
                                    <span>{{ props.row.Desc }}</span>
                                </el-form-item>
                                <el-form-item label="示例">
                                    <span>{{ props.row.Example }}</span>
                                </el-form-item>
                            </el-form>
                        </template>
                    </el-table-column>
                    <el-table-column
                            label="字段ID"
                            prop="Name">
                    </el-table-column>
                    <el-table-column
                            label="类型">
                        <template slot-scope="scope">
                            <span>{{ scope.row.Type.substring(0,scope.row.Type.length-1) }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column
                            label="可否编辑">
                        <template slot-scope="scope">
                            <span>{{ scope.row.Editable?"是":"否" }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column
                            fixed="right"
                            label="操作"
                            width="100">
                        <template slot-scope="scope">
                            <el-button @click="handleClick(scope.row)" type="text" size="small">编辑</el-button>
                            <el-button type="text" size="small" @click="deleteFormatItem(scope.row.Id)">删除</el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </el-row>
            <el-dialog title="新增字段" :visible.sync="dialogFormVisible">
                <el-form :model="form">
                    <el-form-item label="字段ID" :label-width="formLabelWidth">
                        <el-input v-model="form.id" autocomplete="off"></el-input>
                    </el-form-item>
                    <el-form-item label="类型" :label-width="formLabelWidth">
                        <el-select v-model="form.type" placeholder="请选择字段类型">
                            <el-option label="shortString" value="shortString"></el-option>
                            <el-option label="int" value="int"></el-option>
                            <el-option label="bool" value="bool"></el-option>
                            <el-option label="longString" value="longString"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="描述" prop="desc" :label-width="formLabelWidth">
                        <el-input type="textarea" v-model="form.desc"></el-input>
                    </el-form-item>
                    <el-form-item label="示例" prop="desc" :label-width="formLabelWidth">
                        <el-input type="textarea" v-model="form.example"></el-input>
                    </el-form-item>
                    <el-form-item label="可编辑" :label-width="formLabelWidth">
                        <el-switch  v-model="form.editable" active-color="#13ce66">
                        </el-switch>
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
        name: "FormatItem",
        data:function () {
            return {
                userId:cookies.get("id"),
                formatId:this.$route.query.formatId,
                formatItems:[],
                dialogFormVisible: false,
                form: {
                    id: '',
                    editable: false,
                    type: '',
                    example: '',
                    desc: ''
                },
                formLabelWidth: '80px'
            }
        },
        mounted(){
            this.getFormatItems()
        },
        methods:{
            getFormatItems:function () {
                axios.get(config.serverUrl+"/format-item", {
                    params: {
                        formatId: this.formatId
                    },
                    validateStatus: function () {
                        return true
                    },
                    headers: {'Authorization': cookies.get("token")},
                })
                    .then(response=>{
                        if(response.status==200){
                            this.formatItems=response.data.rel
                        }
                        else
                            this.$message({
                                message: response.data.msg,
                                type: 'error'
                            });
                    })
            },
            dialogCancel:function(){
                this.dialogFormVisible=false;
                this.form={
                    id: '',
                    editable: false,
                    type: '',
                    example: '',
                    desc: ''
                }
            },
            dialogConfirm:function () {
                var typeCountMax={
                    "longString":5,
                    "shortString":10,
                    "int":5,
                    "bool":3
                };
                var editableMax=2;

                if(this.form.id.trim()==""||this.form.type==""){
                    this.$message({
                        message: "必填字段不能为空",
                        type: 'error'
                    });
                }else if(this.typeCount(this.form.type)>=typeCountMax[this.form.type]){
                    this.$message({
                        message: this.form.type+" 类型数量不能超过"+typeCountMax[this.form.type]+"个",
                        type: 'error'
                    });
                }else if(this.editable&&this.editableCount()>=editableMax){
                    this.$message({
                        message: "可编辑的字段不能超过"+editableMax+"个",
                        type: 'error'
                    });
                }else if(this.idExist(this.form.id)){
                    this.$message({
                        message: "该字段ID已存在",
                        type: 'error'
                    });
                }else {
                    var postData={
                        formatId:this.formatId,
                        name:this.form.id,
                        desc:this.form.desc,
                        example:this.form.example,
                        editable:this.form.editable,
                        type:this.form.type
                    };
                    this.$ajax.post(config.serverUrl+"/format-item",this.$qs.stringify(postData),{
                        validateStatus: function () {
                            return true
                        },
                        headers: {'Authorization': cookies.get("token")},
                    })
                        .then(response=>{
                            if(response.status==200){
                                this.getFormatItems();
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
            typeCount:function (type) {
                var count = 0;
                for(var i in this.formatItems){
                    if(i.Type==type)
                        count++
                }
                return count
            },
            idExist:function (id) {
                for(var i in this.formatItems){
                    if(i.Id==id)
                        return true
                }
                return false
            },
            deleteFormatItem:function (id) {
                this.$ajax.delete(config.serverUrl+"/format-item/"+id,{
                    validateStatus: function () {
                        return true
                    },
                    headers: {'Authorization': cookies.get("token")},
                })
                    .then(response=>{
                        if(response.status==200){
                            this.getFormatItems();
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
        },
        computed:{
            editableCount:function () {
                var count = 0;
                for(var i in this.formatItems){
                    if(i.editable==true)
                        count++
                }
                return count
            }
        }
    }
</script>

<style scoped>
    .demo-table-expand {
        font-size: 0;
    }
    .demo-table-expand label {
        width: 90px;
        color: #99a9bf;
    }
    .demo-table-expand .el-form-item {
        margin-right: 0;
        margin-bottom: 0;
        width: 50%;
    }
</style>