<template>
    <div>
        <div style="display: flex; grid-gap: 10px;">
            <div class="card" style="flex: 1;margin: auto">
                <div id="main" style="width: 700px;height:80vh;"></div>
            </div>
        </div>
    </div>
</template>

<script>
import * as echarts from 'echarts';
import axios from 'axios';
import { ElMessage } from 'element-plus'; // 引入 ElMessage
import '@wangeditor/editor/dist/css/style.css';
import { Editor, Toolbar } from '@wangeditor/editor-for-vue';

export default {
    components: { Editor, Toolbar },
    data() {
        return {
            data: [],
            option: {
                title: {
                    text: '论坛各帖子占比',
                    subtext: '实时更新',
                    left: 'center'
                },
                tooltip: {
                    trigger: 'item'
                },
                legend: {
                    orient: 'vertical',
                    left: 'left'
                },
                series: [
                    {
                        name: '查看数据',
                        type: 'pie',
                        radius: '50%',
                        data: [
                            
                        ],
                        emphasis: {
                            itemStyle: {
                                shadowBlur: 10,
                                shadowOffsetX: 0,
                                shadowColor: 'rgba(0, 0, 0, 0.5)'
                            }
                        }
                    }
                ]
            },
            myChart: null
        };
    },
    created() {
        this.getdata();
    },
    mounted() {
        this.myChart = echarts.init(document.getElementById('main'));
        this.myChart.setOption(this.option);
    },
    methods: {
        getdata() {
            axios.get("http://127.0.0.1:8000/getblogs").then((res) => {
                console.log(res.data);
                this.data = res.data.blogs;
                this.updateChartData();
            }).catch(error => {
                ElMessage.error('获取数据失败，请稍后重试');
                console.error(error);
            });
        },
        updateChartData() {
            const typeCount = {};
            // 统计每种 type 的数量
            this.data.forEach(item => {
                const type = item.type; // 假设后端数据中有 type 字段
                if (typeCount[type]) {
                    typeCount[type]++;
                } else {
                    typeCount[type] = 1;
                }
            });
            console.log(typeCount)
            const seriesData = this.option.series[0].data;
            // 更新 series.data
            Object.keys(typeCount).forEach(type => {
                const existingItem = seriesData.find(item => item.name === type);
                if (existingItem) {
                    existingItem.value = typeCount[type];
                } else {
                    seriesData.push({ value: typeCount[type], name: type });
                }
            });
            console.log(seriesData)
            // 更新 ECharts 图表
            this.myChart.setOption(this.option);
        }
    }
};
</script>

<style scoped>

</style>