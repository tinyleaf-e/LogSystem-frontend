<template>
    <el-container style="padding: 0">
        <el-header style="height: auto;">
            <el-row>
                <el-col :span="24" style="padding: 20px 0;background: rgba(255,255,255,0)">
                    <el-breadcrumb class="nav" separator-class="el-icon-arrow-right">
                        <el-breadcrumb-item :to="{ path: '/projects' }">首页</el-breadcrumb-item>
                        <el-breadcrumb-item :to="{path: this.nav.projectUrl}">{{this.nav.projectName}}</el-breadcrumb-item>
                        <el-breadcrumb-item :to="{path: this.nav.formatUrl}">{{this.nav.formatName}}</el-breadcrumb-item>
                        <el-breadcrumb-item>{{'Log'}}</el-breadcrumb-item>
                    </el-breadcrumb>
                </el-col>
            </el-row>
        </el-header>
        <el-main style="background: white;padding-top: 0">
            <el-row>
                <h3 >项目列表</h3>
            </el-row>
            <el-row style="border: 1px solid #eee">
                <h4 style="margin-left: 20px">检索条件</h4>
                <div class="query-item" v-for="(queryItem,idx) in queryData" :key="idx">
                    <span class="and-span" v-if="idx!=0">AND</span>
                    <el-button v-if="idx==0" size="mini" type="success" @click="addQueryItem()" icon="el-icon-plus" circle></el-button>
                    <el-select v-model="queryItem.key" placeholder="请选择" style="width: 200px;margin-left: 30px">
                        <el-option
                                v-for="(value,key,idx) in keySet"
                                :key="key"
                                :label="key"
                                :value="key">
                        </el-option>
                    </el-select>
                    <el-select v-model="queryItem.condition" placeholder="请选择" style="width: 100px">
                        <el-option
                                v-for="item in getConditionOfType(keySet[queryItem.key])"
                                :key="item"
                                :label="item"
                                :value="item">
                        </el-option>
                    </el-select>
                    <el-input v-if="queryItem.condition!='range'" v-model="queryItem.value" placeholder="请输入内容" style="width: 400px"></el-input>
                    <el-date-picker v-if="queryItem.condition=='range'"
                            v-model="queryItem.value"
                            type="datetimerange"
                            :picker-options="pickerOptions2"
                            range-separator="至"
                            start-placeholder="开始日期"
                            end-placeholder="结束日期"
                            align="right">
                    </el-date-picker>
                    <el-button type="danger" v-if="idx!=0" size="mini" style="margin-left: 8px" icon="el-icon-minus" @click="deleteQueryItem(idx)" circle></el-button>
                </div>

                <el-button type="primary" icon="el-icon-search" :loading="searchBtnLoading" @click="currentPage=1;doQuery()" size="small" style="margin: 15px 60px 20px 0;float: right">搜索</el-button>
            </el-row>
            <el-row>
                <div id="chartHolder"  style="height: 00px"></div>
            </el-row>
            <el-row>
                <el-container>
                    <el-aside style="padding-top: 40px;width: 400px;padding-left: 15px">
                        <label style="height: 40px;display: inline-block">共检索到 <span>{{logCount}}</span> 条日志</label>

                        <el-popover
                                ref="popover4"
                                placement="right"
                                trigger="click">
                                <div class="attr-item" v-for="(value,attr,idx) in logSummaryAttr" :key="idx">
                                    <el-checkbox style="font-size: 18px" v-model="logSummaryAttr[attr]">{{attr}}</el-checkbox>
                                </div>
                        </el-popover>

                        <el-button size="mini" style="float: right" v-popover:popover4 icon="el-icon-tickets"></el-button>

                        <div class="log-summary">
                            <el-table :data="logSet"
                                    highlight-current-row
                                      ref="logTable"
                                    @current-change="handleCurrentChange"
                                    style="width: 100%">
                                <el-table-column label="日志">
                                    <template slot-scope="scope">
                                        <div v-for="(value,attr,idx) in scope.row" :key="idx" v-if="logSummaryAttr[attr]" class="summary-item">
                                            <label style="font-weight: bold">{{ attr +':' }}</label>
                                            <span>{{ parseIfTime(attr,value) }}</span>
                                        </div>
                                    </template>
                                </el-table-column>
                            </el-table>
                        </div>
                        <el-pagination v-if="this.logCount>0" style="margin-top: 10px" @current-change="handleCurrentPageChange" :small="true" :total="logCount" :page-size="10" layout="prev, pager, next, jumper">
                        </el-pagination>

                    </el-aside>
                    <el-main style="padding-left: 30px;border-left: 1px dashed #eee;margin-left: 30px">
                        <h5>日志详情</h5>
                        <el-form class="log-detail-form" label-position="right" :label-width="labelWidth">
                            <el-form-item v-for="(value, attr,idx) in currentRow" :key="idx" :label="attr" style="font-weight: bold;font-size: 18px;margin-bottom: 0">
                                <span style="display: inline-block;margin-left: -8px;vertical-align: top">：</span>
                                <span style="font-weight: normal;font-size: 14px;display: inline-block;width: calc(100% - 20px);">{{parseIfTime(attr,value)}}</span>
                            </el-form-item>
                        </el-form>
                    </el-main>
                </el-container>
            </el-row>
        </el-main>
    </el-container>
</template>

<script>
    // 引入 ECharts 主模块
    import echarts from 'echarts/lib/echarts'
    // 引入柱状图
    import 'echarts/lib/chart/bar';
    // 引入提示框和标题组件
    import 'echarts/lib/component/tooltip';
    import 'echarts/lib/component/title';
    import dateFormat from 'dateformat';


    export default {
        name: "LogView",
        data: function () {
            var defaultEnd = new Date();
            var defaultStart = new Date();
            defaultStart.setTime(defaultStart.getTime() - 3600 * 1000 * 24);
            return {
                queryData:[
                    {
                        key:"create_time",
                        condition:"range",
                        value:[defaultStart, defaultEnd]
                    }

                ],
                pickerOptions2: {
                    shortcuts: [{
                        text: '最近一小时',
                        onClick(picker) {
                            const end = new Date();
                            const start = new Date();
                            start.setTime(start.getTime() - 3600 * 1000 * 1);
                            picker.$emit('pick', [start, end]);
                        }
                    },{
                        text: '最近一天',
                        onClick(picker) {
                            const end = new Date();
                            const start = new Date();
                            start.setTime(start.getTime() - 3600 * 1000 * 24 * 1);
                            picker.$emit('pick', [start, end]);
                        }
                    },{
                        text: '最近三天',
                        onClick(picker) {
                            const end = new Date();
                            const start = new Date();
                            start.setTime(start.getTime() - 3600 * 1000 * 24 * 3);
                            picker.$emit('pick', [start, end]);
                        }
                    },{
                        text: '最近一周',
                        onClick(picker) {
                            const end = new Date();
                            const start = new Date();
                            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
                            picker.$emit('pick', [start, end]);
                        }
                    }, {
                        text: '最近一个月',
                        onClick(picker) {
                            const end = new Date();
                            const start = new Date();
                            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
                            picker.$emit('pick', [start, end]);
                        }
                    }, {
                        text: '最近三个月',
                        onClick(picker) {
                            const end = new Date();
                            const start = new Date();
                            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
                            picker.$emit('pick', [start, end]);
                        }
                    }]
                },
                chart:null,
                logSet:[],
                currentRow:null,
                formatId:this.$route.query.formatId,
                nav: {
                    projectUrl:'',
                    projectName:'',
                    formatUrl:'',
                    formatName:''
                },
                keySet:{},
                logSummaryAttr:{},
                searchBtnLoading:false,
                logCount:0,
                currentPage:1,
                labelWidth:'80px'
            };
        },
        created(){
            this.initKeySet()
        },
        mounted(){
            //this.initChart();
            this.completeKeySet();
            this.initNav();
            this.doQuery();
        },
        methods:{
            initChart(){
                this.chart = echarts.init(document.getElementById("chartHolder"));
                this.chart.setOption({
                    title: {
                        text: 'ECharts 入门示例'
                    },
                    tooltip: {},
                    xAxis: {
                        data: ['衬衫', '羊毛衫', '雪纺衫', '裤子', '高跟鞋', '袜子']
                    },
                    yAxis: {},
                    series: [{
                        name: '销量',
                        type: 'bar',
                        data: [5, 20, 36, 10, 10, 20]
                    }]
                });
            },
            initKeySet(){
                for(var item in config.staticKeySet){
                    this.$set(this.keySet,item,config.staticKeySet[item])
                }
            },
            initLogSummaryAttr(logItem){
                var arr={};
                for(var key in logItem){
                    if(this.existInArray(key, config.defaultShowAttr))
                        arr[key]=true;
                    else
                        arr[key]=false;
                }
                this.logSummaryAttr= arr;
            },
            initNav:function(){
                this.$ajax.get(config.serverUrl+"/format/"+this.formatId, {
                    validateStatus: function () {
                        return true
                    },
                    headers: {'Authorization': this.$cookie.get("token")},
                })
                    .then(response=>{
                        if(response.status==200){
                            if(response.data.link.project.status=="ok"){
                                this.nav={
                                    projectUrl:'/formats?projectId='+response.data.link.project.id,
                                    projectName:response.data.link.project.name,
                                    formatUrl:'/format-items?formatId='+response.data.rel.Id,
                                    formatName:response.data.rel.Name
                                }
                            }
                            else
                                this.$message({
                                    message: '导航栏信息获取失败'+response.data.msg,
                                    type: 'error'
                                });
                        }
                        else
                            this.$message({
                                message: response.data.msg,
                                type: 'error'
                            });
                    })
            },
            completeKeySet(){
                this.$ajax.get(config.serverUrl+"/format-item", {
                    params: {
                        formatId: this.formatId
                    },
                    validateStatus: function () {
                        return true
                    },
                    headers: {'Authorization': this.$cookie.get("token")},
                })
                    .then(response=>{
                        if(response.status==200){
                            for(var item of response.data.rel){
                                this.$set(this.keySet,item.Name,item.Type.substring(0,item.Type.length-1))
                            }
                        }
                        else
                            this.$message({
                                message: response.data.msg,
                                type: 'error'
                            });
                    })
            },
            getConditionOfType(type){
                var rel=[];
                for(var i in config.queryConfig.type[type]){
                    rel.push(i)
                }
                return rel
            },
            addQueryItem(){
                var defaultQuery={
                    key:"",
                    condition:"",
                    value:""
                };
                this.queryData.push(defaultQuery);
            },
            deleteQueryItem(idx){
                this.queryData.splice(idx,1);
            },
            parseQuery(){
                var query=[];
                for(var item of this.queryData){
                    if(item.condition=="range"){
                        var j1={
                            key:item.key,
                            condition:">=",
                            value:dateFormat(item.value[0],'yyyy-mm-dd HH:MM:ss')
                        }
                        var j2={
                            key:item.key,
                            condition:"<=",
                            value:dateFormat(item.value[1],'yyyy-mm-dd HH:MM:ss')
                        }
                        query.push(j1);
                        query.push(j2);
                    }else{
                        query.push(item)
                    }
                }
                return query
            },
            doQuery(){
                this.searchBtnLoading=true;
                var postData={
                    formatId:this.formatId,
                    query:this.parseQuery(),
                    page:this.currentPage,
                    pageSize:10
                };
                this.$ajax.post(config.serverUrl+"/queryLog",postData,{
                    validateStatus: function () {
                        return true
                    },
                    headers: {'Authorization': this.$cookie.get("token")},
                })
                    .then(response=>{
                        this.searchBtnLoading=false;
                        if(response.status==200){
                            this.logSet=response.data.rel;
                            if(response.data.rel.length>0)
                            {
                                this.logCount=response.data.count;
                                this.initLabelWidth(response.data.rel[0]);
                                this.initLogSummaryAttr(response.data.rel[0]);
                                this.$refs.logTable.setCurrentRow(this.logSet[0])
                                this.currentRow=this.logSet[0]
                            }else{
                                this.logCount=0;
                            }
                        }
                        else
                            this.$message({
                                message: response.data.msg,
                                type: 'error'
                            });
                    })
            },
            handleCurrentPageChange(val){
                this.currentPage=val;
                this.doQuery()
            },
            handleCurrentChange(val) {
                this.currentRow = val;
            },
            existInArray(obj,arr){
                var i = arr.length;
                while (i--) {
                    if (arr[i] === obj) {
                        return true;
                    }
                }
                return false;
            },
            setDefaultValueOfQuery(condition,idx){
                console.log(condition,idx)
            },
            parseIfTime(key,val){
                if(this.keySet[key]=="time")
                    return this.$dateformat(val,'yyyy-mm-dd HH:MM:ss')
                else
                    return val
            },
            getStrLength(str) {
                return str.replace(/[\u0391-\uFFE5]/g,"aa").length;  //先把中文替换成两个字节的英文，在计算长度
            },
            initLabelWidth(row){
                var max=0;
                for(var i in row){
                    if(this.getStrLength(i)>max)
                        max=this.getStrLength(i)
                }
                this.labelWidth=(max*8)+"px";
            }
    }
    }
</script>

<style scoped>
    .query-item{
        padding: 8px 20px;
        margin-left: calc(50% - 430px);
    }
    .and-span{
        width: 28px;
        display: inline-block;
    }
    .attr-item{
        padding: 5px 10px;
    }
    .log-detail-form{
        margin: 8px 0;
        border: 1px solid #eee;
        padding: 10px;
        min-height: 85px;
    }
    .nav span{
        font-weight: normal!important;
    }
</style>