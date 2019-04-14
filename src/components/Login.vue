<template>
    <el-card class="box-card" shadow="always" style="width: 400px;margin-left: calc(50% - 200px);text-align: center">
        <div slot="header" class="clearfix">
            <span>卡片名称</span>
        </div>
        <div class="text item">
            <el-input v-model="userId" placeholder="请输入用户名">
                <template slot="preppend" icon="el-icon-search"></template>
            </el-input>
        </div>
        <div class="text item">
            <el-input v-model="passwd" @keyup.enter.native="login" show-password placeholder="请输入密码">
                <template slot="preppend" icon="el-icon-search"></template>
            </el-input>
        </div>
        <div class="text item">
            <el-button type="primary" @click="login" style="width: 100%">登录</el-button>
        </div>
    </el-card>
</template>

<script>
    import axios from "axios";
    import cookies from "js-cookie"
    export default {
        name: "Login",
        data:function(){
            return {
                userId:"",
                passwd:""
            }
        },
        methods:{
            login:function () {
                axios.get(config.serverUrl+"/token",{
                    params:{
                        id:this.userId,
                        passwd:this.passwd
                    },
                    validateStatus:function () {
                        return true
                    }
                })
                    .then(response => {
                        if(response.status==200){
                            cookies.set("token",response.data.data);
                            cookies.set("id",this.userId);
                            this.$router.push({path:"/projects"})
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
    .item{
        margin: 25px 0;
    }
</style>