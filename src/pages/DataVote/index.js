import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import { Row, Col, Card, Form, Input, Button, Divider, Table, Badge, Radio } from 'antd';
import StandardTable from '@/components/StandardTable5';
import GridContent from '@/components/PageHeaderWrapper/GridContent';
import Link from 'umi/link';
import styles from './index.less';
import { formatRangeDate } from '@/utils/utils';
import DataVoteView from './DataVoteView';

const FormItem = Form.Item;
const getValue = obj =>
  Object.keys(obj)
    .map(key => obj[key])
    .join(',');

@connect(({ dataVote, loading }) => ({
  dataVote,
  loading: loading.models.dataVote,
}))
@Form.create()
class DataVote extends PureComponent {
  state = {
    selectedRows: [],
    dataVoteViewModalVisible: false,
    dataVoteId: 0,
  };

  columns = [
    {
      title: '新闻标题',
      dataIndex: 'newsTitle',
    },
    {
      title: '标题',
      dataIndex: 'name',
    },
    {
      title: '投票时间',
      dataIndex: 'beginDate',
      render: (text, record) => (
        <span>
          {moment(text).format('YYYY-MM-DD HH:mm:ss')}~
          {moment(record.endDate).format('YYYY-MM-DD HH:mm:ss')}
        </span>
      ),
    },
    {
      title: '创建时间',
      dataIndex: 'createDate',
      render: val => <span>{moment(val).format('YYYY-MM-DD HH:mm:ss')}</span>,
    },
    {
      title: '状态',
      dataIndex: 'isEnabled',
      render: text =>
        text ? (
          <Badge count="启用" style={{ backgroundColor: '#52c41a' }} />
        ) : (
          <Badge count="禁用" />
        ),
    },
    {
      title: '操作',
      render: (text, record) => (
        <Fragment>
          <span
            className="pailian-icon pailian-icon-xiazai"
            onClick={e => this.download(e, `${record.newsid}`, 0)}
            title="导出"
          />
          <Divider type="vertical" />
          <Link to={`/dataVote/edit/${record.id}`}>
            <span
              className="pailian-icon pailian-icon-edit"
              title="编辑"
              style={{ color: 'green' }}
            />
          </Link>
          {record.newsid ? null : (
            <Fragment>
              <Divider type="vertical" />
              <span
                className="pailian-icon pailian-icon-shanchu"
                onClick={e => this.remove(e, `${record.id}`, 0)}
                title="删除"
              />
            </Fragment>
          )}
        </Fragment>
      ),
    },
  ];

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'dataVote/list',
    });
  }

  expandedRowRender = record => {
    const columns1 = [
      {
        title: '投票标题',
        dataIndex: 'title',
      },
      {
        title: '可选答案数',
        dataIndex: 'voteMax',
      },
      {
        title: '状态',
        dataIndex: 'enable',
        render: text => (text ? '启用' : '禁用'),
      },
      {
        title: '序号',
        dataIndex: 'orderno',
      },
      {
        title: '操作',
        render: (text, record1) => (
          <Fragment>
            <span
              className="pailian-icon pailian-icon-xiazai"
              onClick={e => this.download(e, `${record1.id}`, 2)}
              title="导出"
            />
            <Divider type="vertical" />
            <span
              className="pailian-icon pailian-icon-yulan"
              onClick={e => this.view(e, `${record1.id}`)}
              title="查看"
            />
          </Fragment>
        ),
      },
    ];

    return (
      <Table
        columns={columns1}
        size="small"
        rowClassName={styles.dataVote_2}
        dataSource={record.dataVotes}
        pagination={false}
      />
    );
  };

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
      type: 'dataVote/list',
      payload: params,
    });
  };

  handleFormReset = () => {
    const { form, dispatch } = this.props;
    form.resetFields();
    this.setState({
      formValues: {},
    });
    dispatch({
      type: 'sms/list',
      payload: {},
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

    form.validateFields((err, fieldsValue) => {
      if (err) return;

      const values = {
        ...fieldsValue,
      };
      if (fieldsValue.rangeDate) {
        const { beginDate, endDate } = formatRangeDate(fieldsValue.rangeDate);
        values.startDate = beginDate;
        values.endDate = endDate;
      }
      delete values.rangeDate;

      this.setState({
        formValues: values,
      });

      dispatch({
        type: 'dataVote/list',
        payload: values,
      });
    });
  };

  download = (e, id, type) => {
    e.stopPropagation();
    const { dispatch } = this.props;
    dispatch({
      type: 'dataVote/download',
      payload: {
        id,
        type,
      },
    });
  };

  view = (e, id) => {
    e.stopPropagation();
    this.setState({
      dataVoteViewModalVisible: true,
      dataVoteId: id,
    });
  };

  onClose = () => {
    this.setState({
      dataVoteViewModalVisible: false,
      dataVoteId: '',
    });
  };

  remove = (e, id, type) => {
    e.stopPropagation();
    const { dispatch } = this.props;
    dispatch({
      type: 'dataVote/remove',
      payload: {
        id,
        type,
      },
      callback: () => {
        this.componentDidMount();
      },
    });
  };

  renderSimpleForm() {
    const {
      form: { getFieldDecorator },
    } = this.props;

    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <Form.Item>
              {getFieldDecorator('status', {
                initialValue: '',
              })(
                <Radio.Group>
                  <Radio value="">全部</Radio>
                  <Radio value="0">已使用</Radio>
                  <Radio value="1">未使用</Radio>
                </Radio.Group>
              )}
            </Form.Item>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="新闻标题">{getFieldDecorator('newsTitle')(<Input />)}</FormItem>
          </Col>
          <Col md={8} sm={24}>
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

  renderForm() {
    return this.renderSimpleForm();
  }

  render() {
    const {
      dataVote: { data },
      loading,
      dispatch,
    } = this.props;
    const { selectedRows, dataVoteViewModalVisible, dataVoteId } = this.state;

    return (
      <GridContent>
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>{this.renderForm()}</div>
            <div className={styles.tableListOperator}>
              <Link to="/dataVote/add">
                <Button icon="plus" type="primary">
                  添加
                </Button>
              </Link>
            </div>
            <StandardTable
              selectedRows={selectedRows}
              loading={loading}
              rowKey="id"
              data={data}
              rowClassName={styles.dataVote_1}
              columns={this.columns}
              onSelectRow={this.handleSelectRows}
              onChange={this.handleStandardTableChange}
              bordered
              size="small"
              expandRowByClick
              expandedRowRender={this.expandedRowRender}
            />
          </div>
          {dataVoteId ? (
            <DataVoteView
              onCancel={this.onClose}
              visible={dataVoteViewModalVisible}
              id={dataVoteId}
              dispatch={dispatch}
            />
          ) : null}
        </Card>
      </GridContent>
    );
  }
}

export default DataVote;
