import React, { Component } from 'react';
import echarts from 'echarts';

class DataVoteChart extends Component {
  componentDidMount() {
    const { option } = this.props;
    const myChart = echarts.init(document.getElementById('main'));
    myChart.setOption(option);
  }

  render() {
    return <div id="main" style={{ width: '100%', height: 500 }} />;
  }
}

export default DataVoteChart;
