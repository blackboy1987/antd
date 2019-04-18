import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import {
  Row,
  Col,
  Card,
  Form,
  Input,
  Select,
  Button,
  DatePicker,
  Modal,
  message,
  InputNumber,
} from 'antd';
import StandardTable from '@/components/StandardTable6';
import styles from './index.less';
import GridContent from '@/components/PageHeaderWrapper/GridContent';
import Add from '../Add';
import Edit from '../Edit';

const FormItem = Form.Item;
const { Option } = Select;
const getValue = obj =>
  Object.keys(obj)
    .map(key => obj[key])
    .join(',');

@connect(({ dataComments, loading }) => ({
  dataComments,
  loading: loading.effects['dataComments/list'],
}))
@Form.create()
class Index extends PureComponent {
  state = {
    selectedRows: [],
    record: {},
    timer: null,
    addCommentVisible: false,
    editCommentVisible: false,
    autoRefresh: false,
    tableHeight: window.innerHeight - 308,
    formValues: {
      status: '',
      newsid: '',
      userid: '',
      beginDate: moment()
        .add('days', -7)
        .format('YYYY-MM-DD 00:00:00'),
      endDate: moment().format('YYYY-MM-DD 23:59:59'),
    },
  };

  columns = [
    {
      title: '评论内容',
      dataIndex: 'comment',
    },
    {
      title: '操作',
      width: 120,
      render: (text, record) => (
        <Fragment>
          {record.status !== 1 ? (
            <span
              className="pailian-icon pailian-icon-tongguo"
              onClick={e => this.pass(e, record)}
              title="通过"
            />
          ) : null}
          {record.status === 1 ? (
            <span
              onClick={e => this.reject(e, record)}
              className="pailian-icon pailian-icon-bohui"
              title="驳回"
            />
          ) : null}
          {record.status === 1 ? (
            <span
              onClick={e => this.edit(e, record)}
              className="pailian-icon pailian-icon-bianji"
              title="编辑"
            />
          ) : null}
          {record.status === 1 ? (
            <span
              onClick={e => this.addComments(e, record)}
              className="pailian-icon pailian-icon-pinglun"
              title="评论"
            />
          ) : null}
          {record.status !== 3 ? (
            <span
              className="pailian-icon pailian-icon-shanchu"
              onClick={e => this.delete(e, record)}
              title="删除"
            />
          ) : null}
        </Fragment>
      ),
    },
    {
      title: '新闻标题',
      width: 200,
      dataIndex: 'title',
      render: (text, record) => <a onClick={e => this.list(e, record, 'dataNews')}>{text}</a>,
    },
    {
      title: '会员昵称',
      width: 100,
      dataIndex: 'nickname',
      render: (text, record) => <a onClick={e => this.list(e, record, 'users')}>{text}</a>,
    },
    {
      title: '点赞数',
      width: 60,
      dataIndex: 'countParise',
    },
    {
      title: '上级评论',
      width: 200,
      dataIndex: 'parentComment',
    },
    {
      title: '评论时间',
      dataIndex: 'time',
      width: 150,
      render: text => <span>{moment(text).format('YYYY-MM-DD HH:mm:ss')}</span>,
    },
    {
      title: '状态',
      width: 80,
      dataIndex: 'status',
      render: text => {
        if (text === 0) {
          return '待审核';
        }
        if (text === 1) {
          return '已通过';
        }
        if (text === 2) {
          return '已拒绝';
        }
        if (text === 3) {
          return '已删除';
        }

        return text;
      },
    },
  ];

  componentDidMount() {
    const root = this;
    const { dispatch } = root.props;
    const { formValues } = root.state;
    dispatch({
      type: 'dataComments/list',
      payload: {
        ...formValues,
      },
    });

    window.addEventListener('resize', function() {
      root.setState({
        tableHeight: window.innerHeight - 308,
      });
    });
  }

  handleStandardTableChange = (pagination, filtersArg, sorter) => {
    const { dispatch } = this.props;
    const { formValues } = this.state;

    const filters = Object.keys(filtersArg).reduce((obj, key) => {
      const newObj = { ...obj };
      newObj[key] = getValue(filtersArg[key]);
      return newObj;
    }, {});

    const params = {
      pageNumber: pagination.current,
      pageSize: pagination.pageSize,
      ...formValues,
      ...filters,
    };
    if (sorter.field) {
      params.sorter = `${sorter.field}_${sorter.order}`;
    }

    dispatch({
      type: 'dataComments/list',
      payload: params,
    });
  };

  handleFormReset = () => {
    const root = this;
    const { form, dispatch } = root.props;
    form.resetFields();
    this.setState({
      formValues: {
        status: '',
        newsid: '',
        userid: '',
        beginDate: moment()
          .add('days', -7)
          .format('YYYY-MM-DD 00:00:00'),
        endDate: moment().format('YYYY-MM-DD 23:59:59'),
      },
    });
    dispatch({
      type: 'dataComments/list',
      payload: {
        status: '',
        newsid: '',
        userid: '',
        beginDate: moment()
          .add('days', -7)
          .format('YYYY-MM-DD 00:00:00'),
        endDate: moment().format('YYYY-MM-DD 23:59:59'),
      },
    });
  };

  handleSelectRows = rows => {
    this.setState({
      selectedRows: rows,
    });
  };

  handleSearch = e => {
    e.preventDefault();

    const { dispatch, form } = this.props;
    const { formValues } = this.state;
    form.validateFields((err, fieldsValue) => {
      if (err) return;

      const values = {
        ...fieldsValue,
      };
      if (fieldsValue.rangeDate) {
        values.beginDate = moment(fieldsValue.rangeDate[0]).format('YYYY-MM-DD 00:00:00');
        values.endDate = moment(fieldsValue.rangeDate[1]).format('YYYY-MM-DD 00:00:00');
      }
      values.flowStatus = formValues.flowStatus;
      delete values.rangeDate;

      this.setState({
        formValues: values,
      });

      dispatch({
        type: 'dataComments/list',
        payload: values,
      });
    });
  };

  delete = (e, record) => {
    const root = this;
    const { dispatch } = root.props;
    const { selectedRows } = root.state;
    const ids = record
      ? [record.id1]
      : selectedRows.filter(item => item.status !== 3).map(item => item.id1);
    if (ids.length === 0) {
      message.error('没有需要通过的评论');
      return;
    }
    e.stopPropagation();
    Modal.confirm({
      title: '警告',
      content: '确定将该评论进行删除？',
      okText: '确定',
      cancelText: '取消',
      onOk: () => {
        dispatch({
          type: 'dataComments/remove',
          payload: {
            ids: ids.join(','),
          },
          callback: response => {
            if (response.type === 'success') {
              message.success(response.content);
              root.componentDidMount();
              root.setState({
                selectedRows: [],
              });
            } else {
              message.error(response.content);
            }
          },
        });
      },
    });
  };

  pass = (e, record) => {
    const root = this;
    const { dispatch } = root.props;
    const { selectedRows } = root.state;
    const ids = record
      ? [record.id1]
      : selectedRows.filter(item => item.status !== 1).map(item => item.id1);

    if (ids.length === 0) {
      message.error('没有需要通过的评论');
      return;
    }

    e.stopPropagation();
    dispatch({
      type: 'dataComments/pass',
      payload: {
        ids: ids.join(','),
      },
      callback: response => {
        if (response.type === 'success') {
          message.success(response.content);
          root.componentDidMount();
          root.setState({
            selectedRows: [],
          });
        } else {
          message.error(response.content);
        }
      },
    });
  };

  reject = (e, record) => {
    const root = this;
    const { dispatch } = root.props;
    const { selectedRows } = root.state;
    const ids = record
      ? [record.id1]
      : selectedRows.filter(item => item.status !== 2).map(item => item.id1);

    if (ids.length === 0) {
      message.error('没有需要通过的评论');
      return;
    }
    e.stopPropagation();
    dispatch({
      type: 'dataComments/reject',
      payload: {
        ids: ids.join(','),
      },
      callback: response => {
        if (response.type === 'success') {
          message.success(response.content);
          root.componentDidMount();
          root.setState({
            selectedRows: [],
          });
        } else {
          message.error(response.content);
        }
      },
    });
  };

  list = (e, record, type) => {
    const { formValues } = this.state;
    e.stopPropagation();
    if (type === 'dataNews') {
      this.setState(
        {
          formValues: {
            ...formValues,
            newsid: record.newsid,
            beginDate: moment().add('days', -20),
          },
        },
        () => {
          this.handleSearch(e);
        }
      );
    } else if (type === 'users') {
      this.setState(
        {
          formValues: {
            ...formValues,
            beginDate: moment().add('days', -365),
            userid: record.userid,
          },
        },
        () => {
          this.handleSearch(e);
        }
      );
    }
  };

  addComments = (e, record) => {
    e.stopPropagation();
    this.setState({
      record: record || {},
      addCommentVisible: true,
    });
  };

  edit = (e, record) => {
    e.stopPropagation();
    this.setState({
      record: record || {},
      editCommentVisible: true,
    });
  };

  onOk = () => {
    this.setState({
      record: {},
      addCommentVisible: false,
    });
    this.componentDidMount();
  };

  onOk1 = () => {
    this.setState({
      record: {},
      editCommentVisible: false,
    });
    this.componentDidMount();
  };

  export = e => {
    e.stopPropagation();
    const { dispatch } = this.props;
    const { selectedRows, formValues } = this.state;
    const ids = selectedRows
      ? selectedRows.filter(item => item.status !== 2).map(item => item.id1)
      : [];
    dispatch({
      type: 'dataComments/download',
      payload: {
        ...formValues,
        newsids: ids.join(','),
        fileTitle: '评论导出',
      },
      callback: response => {
        console.log(response);
      },
    });
  };

  onChange = value => {
    this.refresh(value * 1000);
  };

  refresh = timeout => {
    const timeout1 = timeout || 5000;
    const { timer } = this.state;
    if (timer) {
      clearInterval(timer);
      this.setState({
        timer: null,
      });
    } else {
      const timer1 = setInterval(() => this.componentDidMount(), timeout1);
      this.setState({
        timer: timer1,
      });
    }
  };

  openAutoRefresh = () => {
    const { timer, autoRefresh } = this.state;

    const autoRefresh1 = !autoRefresh;
    this.setState({
      autoRefresh: autoRefresh1,
    });
    if (autoRefresh1) {
      this.refresh(timer);
    } else {
      clearInterval(timer);
      this.setState({
        timer: null,
      });
    }
  };

  renderSimpleForm() {
    const {
      form: { getFieldDecorator },
    } = this.props;
    const { formValues } = this.state;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        {getFieldDecorator('newsid', {
          initialValue: formValues.newsid,
        })(<Input type="hidden" />)}
        {getFieldDecorator('userid', {
          initialValue: formValues.userid,
        })(<Input type="hidden" />)}

        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={6} sm={24}>
            <FormItem label="查询时间">
              {getFieldDecorator('rangeDate', {
                initialValue: [moment(formValues.beginDate), moment(formValues.endDate)],
              })(<DatePicker.RangePicker style={{ width: '100%' }} />)}
            </FormItem>
          </Col>
          <Col md={4} sm={24}>
            <FormItem label="状态">
              {getFieldDecorator('status', {
                initialValue: `${formValues.status}`,
              })(
                <Select placeholder="请选择" style={{ width: '100%' }}>
                  <Option value="">全部</Option>
                  <Option value="0">待审核</Option>
                  <Option value="1">已通过</Option>
                  <Option value="2">已拒绝</Option>
                  <Option value="3">已删除</Option>
                </Select>
              )}
            </FormItem>
          </Col>
          <Col md={6} sm={24}>
            <FormItem label="评论内容">{getFieldDecorator('title')(<Input />)}</FormItem>
          </Col>
          <Col md={2} sm={24}>
            <span className={styles.submitButtons}>
              <Button type="primary" htmlType="submit">
                查询
              </Button>
              <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>
                重置
              </Button>
            </span>
          </Col>
        </Row>
      </Form>
    );
  }

  render() {
    const {
      dataComments: { data },
      loading,
    } = this.props;
    const {
      selectedRows,
      tableHeight,
      addCommentVisible,
      record,
      editCommentVisible,
      autoRefresh,
    } = this.state;
    return (
      <GridContent>
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>{this.renderSimpleForm()}</div>
            <div className={styles.tableListOperator}>
              <Button
                type="primary"
                size="small"
                className="pailian-btn"
                onClick={e => this.pass(e)}
              >
                通过
              </Button>
              <Button
                type="primary"
                size="small"
                className="pailian-btn"
                onClick={e => this.reject(e)}
              >
                拒绝
              </Button>
              <Button
                type="primary"
                size="small"
                className="pailian-btn"
                onClick={e => this.delete(e)}
              >
                删除
              </Button>
              <Button
                type="primary"
                size="small"
                className="pailian-btn"
                onClick={e => this.export(e)}
              >
                导出
              </Button>
              <Button
                type="primary"
                size="small"
                className="pailian-btn"
                onClick={() => this.openAutoRefresh()}
              >
                {autoRefresh ? '关闭定时刷新' : '开启定时刷新'}
              </Button>
              {autoRefresh ? (
                <InputNumber
                  defaultValue={5}
                  onChange={this.onChange}
                  min={5}
                  precision={0}
                  step={1}
                  style={{ width: 100 }}
                />
              ) : null}
            </div>
            <StandardTable
              selectedRows={selectedRows}
              loading={loading}
              data={data}
              rowKey="id1"
              columns={this.columns}
              onSelectRow={this.handleSelectRows}
              onChange={this.handleStandardTableChange}
              bordered
              size="small"
              scroll={{ y: tableHeight }}
              onRow={() => {
                return {
                  onClick: e => {
                    e.target.parentNode.getElementsByTagName('input')[0].click();
                  },
                };
              }}
            />
          </div>
          {record && Object.keys(record).length ? (
            <Add visible={addCommentVisible} onOk={this.onOk} values={record} />
          ) : null}
          {record && Object.keys(record).length ? (
            <Edit visible={editCommentVisible} onOk={this.onOk1} values={record} />
          ) : null}
        </Card>
      </GridContent>
    );
  }
}

export default Index;
