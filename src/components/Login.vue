<template>
    <el-card class="box-card" shadow="always" style="width: 400px;margin-left: calc(50% - 200px);text-align: center;margin-top: 100px">
        <div slot="header" class="clearfix">
            <span>登 录</span>
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
            <el-button type="primary" @click="login" style="width: 100%;margin-top: 10px">登录</el-button>
        </div>
    </el-card>
</template>

<script>
    export default {
        name: "Login",
        data:function(){
            return {
                userId:"",
                passwd:""
            }
        },
        created:function (){
            this.$emit('hideUserInfo');
        },
        methods:{
            login:function () {
                this.$ajax.get(config.serverUrl+"/token",{
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
                            this.$cookie.set("token",response.data.data);
                            this.$cookie.set("id",this.userId);
                            this.$emit('initUserInfo');
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