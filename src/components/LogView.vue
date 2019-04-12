<template>
    <el-container>
        <el-header>
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
        </el-header>
        <el-main>
            <el-row>
                <h3>项目列表</h3>
            </el-row>
            <el-row>
                <el-button type="primary" icon="el-icon-plus" @click="dialogFormVisible=true">搜索</el-button>
            </el-row>
            <el-row>
                <h5>检索条件</h5>
                <div class="query-item">
                    <span>and</span>
                    <el-select v-model="value4" placeholder="请选择" style="width: 200px">
                        <el-option
                                v-for="item in options"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                        </el-option>
                    </el-select>
                    <el-select v-model="value4" placeholder="请选择" style="width: 30px">
                        <el-option
                                v-for="item in options"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                        </el-option>
                    </el-select>
                    <el-input v-model="input" placeholder="请输入内容" style="width: 200px"></el-input>
                    <el-date-picker
                            v-model="value5"
                            type="datetimerange"
                            :picker-options="pickerOptions2"
                            range-separator="至"
                            start-placeholder="开始日期"
                            end-placeholder="结束日期"
                            align="right">
                    </el-date-picker>
                    <el-button type="success" icon="el-icon-plus" circle></el-button>
                    <el-button type="danger" icon="el-icon-minus" circle></el-button>
                </div>
            </el-row>
            <el-row>
                <div id="chartHolder" style="height: 200px"></div>
            </el-row>
            <el-row>
                <el-container>
                    <el-aside>
                        <p>there are <span>1</span> logs</p>
                        <div class="log-summary">
                            <p class="log-item">
                                <label>createTime:</label>
                                <span>123231</span>
                            </p>
                        </div>

                    </el-aside>
                    <el-main>
                        <el-form label-position="right" label-width="80px" :model="formLabelAlign">
                            <el-form-item label="名称">
                                <p>1233213213</p>
                            </el-form-item>
                            <el-form-item label="名称">
                                <p>1233213213</p>
                            </el-form-item>
                            <el-form-item label="名称">
                                <p>1233213213</p>
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


    export default {
        name: "LogView",
        data: function () {
            return {
                pickerOptions2: {
                    shortcuts: [{
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
                value4: [new Date(2000, 10, 10, 10, 10), new Date(2000, 10, 11, 10, 10)],
                value5: '',
                options: [{
                    value: '选项1',
                    label: '黄金糕'
                }, {
                    value: '选项2',
                    label: '双皮奶'
                }, {
                    value: '选项3',
                    label: '蚵仔煎'
                }, {
                    value: '选项4',
                    label: '龙须面'
                }, {
                    value: '选项5',
                    label: '北京烤鸭'
                }],
                value: '',
                input: '12',
                chart:null
            };
        },
        mounted(){
            this.initChart();
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
            }
        }
    }
</script>

<style scoped>

</style>