<template>
    <el-container>
        <el-header class="header" >
            <el-row type="flex" class="row-bg" style="max-width: 1200px;width: 100%;margin: 0 auto;overflow: hidden" justify="space-between">
                <el-col :span="6">
                    <img height="50px" @click="this.$router.push({path: '/projects'})" src="../assets/logsystem-logo-svg.svg" />
                </el-col>
                <el-col v-if="infoVisible" :span="6" style="text-align: right;line-height: 50px">
                    <el-dropdown trigger="click" @command="handleCommand">
                        <span class="el-dropdown-link" style="font-size: 16px">
                            {{userId}}<i class="el-icon-arrow-down el-icon--right"></i>
                        </span>
                        <el-dropdown-menu slot="dropdown">
                            <el-dropdown-item v-if="false" command="showEmailDialog">修改邮箱</el-dropdown-item>
                            <el-dropdown-item command="showPasswdDialog">修改密码</el-dropdown-item>
                            <el-dropdown-item command="logout">退出登录</el-dropdown-item>
                        </el-dropdown-menu>
                    </el-dropdown>
                </el-col>
            </el-row>
        </el-header>
        <el-main  style="max-width: 1200px;width: 100%;margin: 0 auto;overflow: hidden;padding: 0">
                <router-view v-on:initUserInfo="initUserInfo" v-on:hideUserInfo="hideUserInfo"></router-view>

        </el-main>
        <el-dialog title="修改密码" :visible.sync="editPasswdDialogFormVisible">
            <el-form :model="editPasswdForm">
                <el-form-item label="原密码" :label-width="formLabelWidth">
                    <el-input v-model="editPasswdForm.old" autocomplete="off" type="password"></el-input>
                </el-form-item>
                <el-form-item label="新密码" :label-width="formLabelWidth">
                    <el-input v-model="editPasswdForm.new" autocomplete="off" type="password"></el-input>
                </el-form-item>
                <el-form-item label="确认密码" style="margin-bottom: 0" :label-width="formLabelWidth">
                    <el-input v-model="editPasswdForm.confirm" autocomplete="off" type="password"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="editPasswdDialogFormVisible=false">取 消</el-button>
                <el-button type="primary" @click="editPasswdDialogConfirm()">确 定</el-button>
            </div>
        </el-dialog>
        <el-dialog title="修改邮箱" :visible.sync="editEmailDialogFormVisible">
            <el-form :model="editEmailForm">
                <el-form-item label="邮箱" style="margin-bottom: 0" :label-width="'50px'">
                    <el-input v-model="editEmailForm.email" autocomplete="off"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="editEmailDialogFormVisible=false">取 消</el-button>
                <el-button type="primary" @click="editEmailDialogConfirm()">确 定</el-button>
            </div>
        </el-dialog>
    </el-container>
</template>

<script>
    export default {
        name: "Layout",
        data:function(){
            return {
                userId:this.$cookie.get("id"),
                email:'',
                infoVisible:true,
                editEmailDialogFormVisible:false,
                editPasswdDialogFormVisible:false,
                editPasswdForm:{
                    old:'',
                    new:'',
                    confirm:''
                },
                editEmailForm:{
                    email:''
                },
                formLabelWidth:'70px'
            }
        },
        methods:{
            handleCommand:function(command){
                switch (command){
                    case 'logout':
                        this.$cookie.remove("token");
                        this.$cookie.remove("id");
                        this.infoVisible=false;
                        this.$router.push({path: '/login'});
                        break;
                    case 'showEmailDialog':
                        this.editEmailDialogFormVisible=true;
                        break;
                    case 'showPasswdDialog':
                        this.editPasswdDialogFormVisible=true;
                        break;
                }
            },
            editEmailDialogConfirm:function () {

            },
            editPasswdDialogConfirm:function () {

            },
            initUserInfo:function () {
                this.userId=this.$cookie.get("id");
                this.infoVisible=true;
            },
            hideUserInfo:function () {
                this.infoVisible=false;
            }
        }
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