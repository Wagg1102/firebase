<template>
  <div v-loading="showLoading" id="chart-container" class="charts-row">
    <div ref="barChartRef" class="chart"></div>
    <div ref="pieChartRef" class="chart"></div>
  </div>
</template>

<script setup>
import request from '@/utils/request';
import * as echarts from 'echarts';
import { nextTick, ref } from 'vue';
const barChartRef = ref(null)
const pieChartRef = ref(null)
const showLoading = ref(false)
// 处理数据
const processData = (data) => {
  const durationData = data.map(item => ({
    name: item.title,
    value: Math.floor((new Date(item.endTime) - new Date(item.startTime)) / (1000 * 3600 * 24))
  }));

  const ratingCounts = {};
  data.forEach(item => {
    if (!ratingCounts[item.rating]) {
      ratingCounts[item.rating] = 0;
    }
    ratingCounts[item.rating]++;
  });

  return {
    durationData,
    ratingData: Object.entries(ratingCounts).map(([rating, count]) => ({ name: rating, value: count }))
  };
};

// 初始化图表
const initCharts = async () => {
  showLoading.value = true
  const { durationData, ratingData } = processData(await request('https://getallapplys-fyoxpel6ba-uc.a.run.app'))
  const barChart = echarts.init(barChartRef.value);
  const pieChart = echarts.init(pieChartRef.value);

  // 柱状图配置
  const barOption = {
    title: { text: 'Activity Duration' },
    tooltip: {},
    xAxis: { type: 'category', data: durationData.map(d => d.name) },
    yAxis: { type: 'value' },
    series: [{
      data: durationData.map(d => d.value),
      type: 'bar'
    }]
  };

  // 饼状图配置
  const pieOption = {
    title: { text: 'Rating Distribution' },
    tooltip: {},
    series: [{
      name: 'Rating',
      type: 'pie',
      radius: '55%',
      data: ratingData
    }]
  };

  barChart.setOption(barOption);
  pieChart.setOption(pieOption);
  showLoading.value = false
};

nextTick(() => {
  initCharts();
});
</script>

<style scoped>
.charts-row {
  height: 100%;
  width: 100%;
  display: flex;
  justify-content: space-between;
}

.chart {
  flex: 1;
  height: 100%;
}
</style>