import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { formatMessage, FormattedMessage } from 'umi/locale';
import router from 'umi/router';
import Link from 'umi/link';

import {
  Form,
  Input,
  DatePicker,
  Button,
  Card,
  InputNumber,
  Table,
  Popconfirm,
  Checkbox,
  message,
  Divider,
  Icon,
} from 'antd';
import moment from 'moment';

import GridContent from '@/components/PageHeaderWrapper/GridContent';
import VoteAdd from './VoteAdd';

const FormItem = Form.Item;
const { RangePicker } = DatePicker;

@connect(({ dataVote, loading }) => ({
  dataVote,
  submitting: loading.effects['dataVote/save'],
}))
@Form.create()
class Add extends PureComponent {
  state = {
    voteAddModalVisible: false,
    dataVotes: [],
    dataVote: {},
  };

  columns = [
    {
      title: '排序',
      dataIndex: 'orderno',
      key: 'orderno',
      width: 50,
    },
    {
      title: '投票标题',
      dataIndex: 'title',
      key: 'title',
    },
    {
      title: '可选答案数',
      dataIndex: 'voteMax',
      key: 'voteMax',
      width: 100,
    },
    {
      title: '状态',
      dataIndex: 'enable',
      key: 'enable',
      width: 50,
      render: text =>
        text ? <Icon type="check" /> : <Icon type="close" style={{ color: 'red' }} />,
    },
    {
      title: '操作',
      key: 'action',
      width: 120,
      render: (text, record) => {
        return (
          <span>
            <Popconfirm
              title={record.id ? '是否要禁用此项投票？' : '是否要移除此项投票？'}
              onConfirm={() => this.remove(record)}
            >
              <a>{this.renderOperator(record)}</a>
            </Popconfirm>
            <Divider type="vertical" />
            <span
              className="pailian-icon pailian-icon-edit"
              title="编辑"
              onClick={() => this.addVote(record)}
            />
          </span>
        );
      },
    },
  ];

  componentDidMount() {
    const root = this;
    const {
      match: { params = {} },
    } = root.props;
    if (params && Object.keys(params).length > 0) {
      const { dispatch } = this.props;
      dispatch({
        type: 'dataVote/edit',
        payload: params,
        callback: response => {
          root.setState({
            dataVotes: Array.isArray(response.dataVotes) ? response.dataVotes : [],
          });
        },
      });
    }
  }

  renderOperator = record => {
    if (record.id) {
      if (record.enable) {
        return <span className="pailian-icon pailian-icon-jinyong" title="禁用" />;
      }
      return <span className="pailian-icon pailian-icon-qiyong" title="启用" />;
    }
    return <span className="pailian-icon pailian-icon-delete" title="移除" />;
  };

  handleSubmit = e => {
    const { dispatch, form } = this.props;
    const { dataVotes } = this.state;
    e.preventDefault();
    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        const formValues = {
          ...values,
          dataVotes,
        };
        formValues.beginDate = moment(values.date[0]).format('YYYY-MM-DD HH:mm:ss');
        formValues.endDate = moment(values.date[1]).format('YYYY-MM-DD HH:mm:ss');
        delete formValues.date;
        dispatch({
          type: 'dataVote/save',
          payload: formValues,
          callback: response => {
            if (response.type === 'success') {
              message.success(response.content);
              router.push('/dataVote');
            } else {
              message.error(response.content);
            }
          },
        });
      }
    });
  };

  addVote = record => {
    this.setState({
      voteAddModalVisible: true,
      dataVote: record || {},
    });
  };

  onOk = data => {
    const { dataVotes } = this.state;
    const dataVotes1 = [...dataVotes];
    if (data.id) {
      for (let i = 0; i < dataVotes.length; i += 1) {
        console.log(parseInt(data.id, 10) === parseInt(dataVotes[i].id, 10));
        if (parseInt(data.id, 10) === parseInt(dataVotes[i].id, 10)) {
          dataVotes1.splice(i, 1, data);
        }
      }
      // dataVotes1.push(data);
    } else {
      dataVotes1.push(data);
    }

    this.setState({
      voteAddModalVisible: false,
      dataVotes: dataVotes1,
    });
  };

  onCancel = () => {
    this.setState({
      voteAddModalVisible: false,
    });
  };

  remove(record) {
    const root = this;
    const { dataVotes } = root.state;
    const { dispatch } = root.props;
    if (record.id) {
      // const newData = dataVotes.filter(item => item.id !== record.id);
      // this.setState({ dataVotes: newData });
      // 通过接口来处理该投票禁用效果
      dispatch({
        type: 'dataVote/updateDataVote',
        payload: {
          dataVoteId: record.id,
          dataVoteGroupId: record.dataVoteGroupId,
          enable: !record.enable,
        },
        callback: response => {
          if (response.type === 'success') {
            message.success(response.content);
            root.componentDidMount();
          } else {
            message.error(response.content);
          }
        },
      });
    } else {
      const newData = dataVotes.filter(item => item.key !== record.key);
      this.setState({ dataVotes: newData });
    }
  }

  render() {
    const {
      submitting,
      dataVote: { values = {} },
    } = this.props;
    const { voteAddModalVisible, dataVotes, dataVote } = this.state;
    const {
      form: { getFieldDecorator },
    } = this.props;

    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 4 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 20 },
      },
    };

    const submitFormLayout = {
      wrapperCol: {
        xs: { span: 24, offset: 0 },
        sm: { span: 10, offset: 7 },
      },
    };

    return (
      <GridContent>
        <Card bordered={false}>
          <Form onSubmit={this.handleSubmit} style={{ marginTop: 8 }}>
            {getFieldDecorator('id', {
              initialValue: values.id,
            })(<Input type="hidden" />)}
            <FormItem {...formItemLayout} label="标题">
              {getFieldDecorator('name', {
                initialValue: values.name,
                rules: [
                  {
                    required: true,
                    message: '必填',
                  },
                ],
              })(<Input />)}
            </FormItem>
            <FormItem {...formItemLayout} label={<FormattedMessage id="form.date.label" />}>
              {getFieldDecorator('date', {
                initialValue: [moment(values.beginDate), moment(values.endDate)],
                rules: [
                  {
                    required: true,
                    message: '必填',
                  },
                ],
              })(
                <RangePicker
                  style={{ width: '100%' }}
                  showTime
                  placeholder={[
                    formatMessage({ id: 'form.date.placeholder.start' }),
                    formatMessage({ id: 'form.date.placeholder.end' }),
                  ]}
                />
              )}
            </FormItem>
            <FormItem
              {...formItemLayout}
              help={
                <span className="tips">
                  用来调整设置虚拟投票数的。真实投票一个，那么虚拟投票数就增加这么多个。默认为4
                </span>
              }
              label="随机数设置"
            >
              {getFieldDecorator('maxNumber', {
                initialValue: values.maxNumber || 4,
                rules: [
                  {
                    required: true,
                    message: '必填',
                  },
                ],
              })(<InputNumber min={1} precision={0} step={1} />)}
            </FormItem>
            <Form.Item {...formItemLayout} label="设置">
              {getFieldDecorator('isEnabled', {
                valuePropName: 'checked',
                initialValue: values.isEnabled || true,
              })(<Checkbox>是否启用</Checkbox>)}
              {getFieldDecorator('isLogin', {
                valuePropName: 'checked',
                initialValue: values.isLogin || false,
              })(<Checkbox>是否需要登陆</Checkbox>)}
              {getFieldDecorator('isVirtual', {
                valuePropName: 'checked',
                initialValue: values.isVirtual || false,
              })(<Checkbox>开启虚拟投票</Checkbox>)}
            </Form.Item>
            <Form.Item {...formItemLayout} label="投票">
              <Button type="primary" icon="plus" onClick={this.addVote}>
                添加投票
              </Button>
              <Table
                columns={this.columns}
                pagination={false}
                rowKey="key"
                size="small"
                bordered
                dataSource={dataVotes}
              />
            </Form.Item>
            <FormItem {...submitFormLayout} style={{ marginTop: 32 }}>
              <Button type="primary" htmlType="submit" loading={submitting}>
                <FormattedMessage id="form.save" />
              </Button>
              <Button style={{ marginLeft: 8 }}>
                <Link to="/dataVote">
                  <FormattedMessage id="form.back" />
                </Link>
              </Button>
            </FormItem>
          </Form>
        </Card>
        <VoteAdd
          voteAddModalVisible={voteAddModalVisible}
          onOk={this.onOk}
          onCancel={this.onCancel}
          dataVote={dataVote}
        />
      </GridContent>
    );
  }
}

export default Add;
