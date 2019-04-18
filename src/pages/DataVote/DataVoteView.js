import React, { Component } from 'react';
import moment from 'moment';

import { Modal, Tabs, Form, Table, Button } from 'antd';
import DataVoteChart from './DataVoteChart';

class DataVoteView extends Component {
  state = {
    dataVoteInfo: {},
  };

  columns = [
    {
      title: '选项名称',
      dataIndex: 'options',
      key: 'options',
    },
    {
      title: '选项描述',
      dataIndex: 'content',
      width: '20%',
      key: 'content',
    },
    {
      title: '虚拟投票数',
      dataIndex: 'virtualCount',
      width: 100,
      key: 'virtualCount',
    },
    {
      title: '投票数',
      dataIndex: 'voteCount',
      width: 100,
      key: 'voteCount',
    },
    {
      title: '排序',
      dataIndex: 'orderno',
      width: 100,
      key: 'orderno',
    },
    {
      title: '操作',
      width: 100,
      render: (text, record) => <a onClick={e => this.download(e, record)}>导出</a>,
    },
  ];

  componentDidMount() {
    const root = this;
    const { dispatch, id } = root.props;
    dispatch({
      type: 'dataVote/view',
      payload: {
        id,
      },
      callback: response => {
        root.setState({
          dataVoteInfo: response,
        });
      },
    });
  }

  download = (e, record) => {
    e.stopPropagation();
    const { dispatch } = this.props;
    dispatch({
      type: 'dataVote/download1',
      payload: {
        id: record.voteid,
        optionId: record.id,
        fileTitle: `选项_${record.options}`,
      },
    });
  };

  download2 = e => {
    e.stopPropagation();
    const { dispatch } = this.props;
    const {
      dataVoteInfo: { dataVote = {} },
    } = this.state;
    dispatch({
      type: 'dataVote/download1',
      payload: {
        id: dataVote.id,
        fileTitle: `投票_${dataVote.title}`,
      },
    });
  };

  onChange = key => {
    if (parseInt(key, 10) === 2) {
      this.renderCharts();
    }
  };

  renderCharts = () => {
    const {
      dataVoteInfo: { dataVote = {}, dataVoteoptions = [] },
    } = this.state;
    const legendData = dataVoteoptions.map(function(item) {
      return item.options;
    });
    const seriesData = dataVoteoptions.map(function(item) {
      return { name: item.options, value: 3 };
    });
    return {
      title: {
        text: `${dataVote.title} 投票结果`,
        x: 'center',
      },
      tooltip: {
        trigger: 'item',
        formatter: '{a} <br/>{b} : {c} ({d}%)',
      },
      legend: {
        orient: 'vertical',
        left: 'left',
        data: legendData,
      },
      series: [
        {
          name: `${dataVote.title} 投票结果`,
          type: 'pie',
          radius: '55%',
          center: ['50%', '60%'],
          data: seriesData,
          itemStyle: {
            emphasis: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)',
            },
          },
        },
      ],
    };
  };

  render() {
    const { visible, onCancel } = this.props;
    const {
      dataVoteInfo: { dataVote = {}, dataVoteoptions = [] },
    } = this.state;
    const formItemLayout = {
      labelCol: { span: 4 },
      wrapperCol: { span: 20 },
    };

    return (
      <Modal
        visible={visible}
        width="50%"
        footer={[
          <Button onClick={this.download2} type="primary">
            导出全部记录
          </Button>,
        ]}
        okText="导出明细"
        onCancel={onCancel}
        title={dataVote.title || ''}
      >
        <Tabs defaultActiveKey="1" onChange={this.onChange}>
          <Tabs.TabPane tab="基本信息" key="1">
            <Form {...formItemLayout} onSubmit={this.handleSubmit}>
              <Form.Item label="投票标题">
                <span className="ant-form-text">{dataVote.title}</span>
              </Form.Item>
              <Form.Item label="可选答案数">
                <span className="ant-form-text">{dataVote.voteMax}</span>
              </Form.Item>
              <Form.Item label="有效时间">
                <span className="ant-form-text">
                  {moment(dataVote.starttime).format('YYYY-MM-DD HH:mm:ss')}~
                  {moment(dataVote.endtime).format('YYYY-MM-DD HH:mm:ss')}
                </span>
              </Form.Item>
              <Form.Item label="序号">
                <span className="ant-form-text">{dataVote.title}</span>
              </Form.Item>
              <Form.Item label="选项">
                <Table
                  scroll={{ y: 300 }}
                  rowKey="id"
                  style={{ width: '100%' }}
                  bordered
                  size="small"
                  dataSource={dataVoteoptions}
                  columns={this.columns}
                  pagination={false}
                />
              </Form.Item>
            </Form>
          </Tabs.TabPane>
          <Tabs.TabPane tab="投票结构图" key="2">
            <DataVoteChart option={this.renderCharts()} />
          </Tabs.TabPane>
        </Tabs>
      </Modal>
    );
  }
}

export default DataVoteView;
