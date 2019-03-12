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
  Icon,
  Button,
  DatePicker,
  Divider,
  TreeSelect,
  Modal,
  message,
} from 'antd';
import StandardTable from '@/components/StandardTable1';
import styles from './index.less';
import GridContent from '@/components/PageHeaderWrapper/GridContent';

const FormItem = Form.Item;
const { Option } = Select;
const getValue = obj =>
  Object.keys(obj)
    .map(key => obj[key])
    .join(',');

@connect(({ dataNews, loading }) => ({
  dataNews,
  loading: loading.models.rule,
}))
@Form.create()
class Index extends PureComponent {
  state = {
    expandForm: false,
    selectedRows: [],
    formValues: {
      flowStatus: 8,
      mediaType: -1,
      startDate: moment()
        .add('days', -20)
        .format('YYYY-MM-DD 00:00:00'),
      endDate: moment().format('YYYY-MM-DD 23:59:59'),
    },
    configChannels: [],
    configTopics: [],
  };

  columns = [
    {
      title: '标题',
      dataIndex: 'title',
    },
    {
      title: '类型',
      dataIndex: 'mediaTypeName',
    },
    {
      title: '作者',
      dataIndex: 'author',
    },
    {
      title: '状态',
      dataIndex: 'flowStatusName',
    },
    {
      title: '更新时间',
      dataIndex: 'updateTime',
      render: text => <span>{moment(text).format('YYYY-MM-DD HH:mm:ss')}</span>,
    },
    {
      title: '栏目',
      dataIndex: 'nodeNames',
    },
    {
      title: '创建人',
      dataIndex: 'createUserName',
    },
    {
      title: '创建时间',
      dataIndex: 'createDate',
      render: text => <span>{moment(text).format('YYYY-MM-DD HH:mm:ss')}</span>,
    },
    {
      title: '编辑',
      dataIndex: 'modifyUserName',
    },
    {
      title: '锁定用户',
      dataIndex: 'lockedUserName',
    },
    {
      title: '操作',
      render: (text, record) => (
        <Fragment>
          <a onClick={() => this.handleUpdateModalVisible(true, record)}>配置</a>
          <Divider type="vertical" />
          <a href="">订阅警报</a>
        </Fragment>
      ),
    },
  ];

  componentDidMount() {
    const root = this;
    const { dispatch } = root.props;
    const { formValues } = root.state;
    dispatch({
      type: 'dataNews/list',
      payload: {
        ...formValues,
      },
    });

    dispatch({
      type: 'dataNews/configChannel',
      callback: response => {
        root.setState({
          configChannels: Array.isArray(response) ? response : [],
        });
      },
    });
    dispatch({
      type: 'dataNews/configTopic',
      callback: response => {
        root.setState({
          configTopics: Array.isArray(response) ? response : [],
        });
      },
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
      currentPage: pagination.current,
      pageSize: pagination.pageSize,
      ...formValues,
      ...filters,
    };
    if (sorter.field) {
      params.sorter = `${sorter.field}_${sorter.order}`;
    }

    dispatch({
      type: 'dataNews/list',
      payload: params,
    });
  };

  handleFormReset = () => {
    const { form, dispatch } = this.props;
    const { formValues } = this.state;
    form.resetFields();
    this.setState({
      formValues: {
        flowStatus: 8,
        mediaType: -1,
        startDate: moment()
          .add('days', -20)
          .format('YYYY-MM-DD 00:00:00'),
        endDate: moment().format('YYYY-MM-DD 23:59:59'),
      },
    });

    dispatch({
      type: 'dataNews/list',
      payload: {
        ...formValues,
      },
    });
  };

  toggleForm = () => {
    const { expandForm } = this.state;
    this.setState({
      expandForm: !expandForm,
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
        values.startDate = moment(fieldsValue.rangeDate[0]).format('YYYY-MM-DD 00:00:00');
        values.endDate = moment(fieldsValue.rangeDate[1]).format('YYYY-MM-DD 00:00:00');
      }
      values.flowStatus = formValues.flowStatus;
      delete values.rangeDate;

      this.setState({
        formValues: values,
      });

      dispatch({
        type: 'dataNews/list',
        payload: values,
      });
    });
  };

  renderTree = nodes => {
    return nodes.map(item => {
      if (item.children) {
        return (
          <TreeSelect.TreeNode value={item.id} title={item.name} key={item.id}>
            {this.renderTree(item.children)}
          </TreeSelect.TreeNode>
        );
      }
      return <TreeSelect.TreeNode value={item.id} title={item.name} key={item.id} />;
    });
  };

  reset = e => {
    const root = this;
    const { selectedRows } = root.state;
    const { dispatch } = root.props;
    e.stopPropagation();
    const ids = selectedRows.map(item => item.id);
    Modal.confirm({
      title: '警告',
      content: '本次操作将会把选中新闻恢复成已审核状态，请谨慎操作！',
      okText: '确定',
      cancelText: '取消',
      onOk() {
        dispatch({
          type: 'dataNews/reset',
          payload: {
            ids: ids.join(','),
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
      },
    });
  };

  renderSimpleForm() {
    const {
      form: { getFieldDecorator },
    } = this.props;
    const { formValues, configChannels } = this.state;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={6} sm={24}>
            <FormItem label="创建时间">
              {getFieldDecorator('rangeDate', {
                initialValue: [moment(formValues.startDate), moment(formValues.endDate)],
              })(<DatePicker.RangePicker style={{ width: '100%' }} />)}
            </FormItem>
          </Col>
          <Col md={4} sm={24}>
            <FormItem label="类型">
              {getFieldDecorator('mediaType', {
                initialValue: `${formValues.mediaType}`,
              })(
                <Select placeholder="请选择" style={{ width: '100%' }}>
                  <Option value="-1">全部</Option>
                  <Option value="1">普通</Option>
                  <Option value="4">外链</Option>
                  <Option value="2">图片</Option>
                  <Option value="3">视频</Option>
                  <Option value="6">直播新闻</Option>
                </Select>
              )}
            </FormItem>
          </Col>
          <Col md={4} sm={24}>
            <FormItem label="栏目">
              {getFieldDecorator('nodeId')(
                <TreeSelect
                  showSearch
                  dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                  placeholder="选择栏目"
                  allowClear
                  treeDefaultExpandAll
                  filterTreeNode={(inputValue, treeNode) =>
                    treeNode.props.title.indexOf(inputValue) >= 0
                  }
                >
                  {this.renderTree(configChannels)}
                </TreeSelect>
              )}
            </FormItem>
          </Col>
          <Col md={6} sm={24}>
            <FormItem label="标题">{getFieldDecorator('title')(<Input />)}</FormItem>
          </Col>
          <Col md={2} sm={24}>
            <span className={styles.submitButtons}>
              <Button type="primary" htmlType="submit">
                查询
              </Button>
              <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>
                重置
              </Button>
              <a style={{ marginLeft: 8 }} onClick={this.toggleForm}>
                展开 <Icon type="down" />
              </a>
            </span>
          </Col>
        </Row>
      </Form>
    );
  }

  renderAdvancedForm() {
    const {
      form: { getFieldDecorator },
    } = this.props;
    const { formValues, configChannels, configTopics } = this.state;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={6} sm={24}>
            <FormItem label="创建时间">
              {getFieldDecorator('rangeDate', {
                initialValue: [moment(formValues.startDate), moment(formValues.endDate)],
              })(<DatePicker.RangePicker style={{ width: '100%' }} />)}
            </FormItem>
          </Col>
          <Col md={4} sm={24}>
            <FormItem label="类型">
              {getFieldDecorator('mediaType', {
                initialValue: `${formValues.mediaType}`,
              })(
                <Select placeholder="请选择" style={{ width: '100%' }}>
                  <Option value="-1">全部</Option>
                  <Option value="1">普通</Option>
                  <Option value="4">外链</Option>
                  <Option value="2">图片</Option>
                  <Option value="3">视频</Option>
                  <Option value="6">直播新闻</Option>
                </Select>
              )}
            </FormItem>
          </Col>
          <Col md={4} sm={24}>
            <FormItem label="栏目">
              {getFieldDecorator('nodeId')(
                <TreeSelect
                  showSearch
                  dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                  placeholder="选择栏目"
                  allowClear
                  treeDefaultExpandAll
                  filterTreeNode={(inputValue, treeNode) =>
                    treeNode.props.title.indexOf(inputValue) >= 0
                  }
                >
                  {this.renderTree(configChannels)}
                </TreeSelect>
              )}
            </FormItem>
          </Col>
          <Col md={6} sm={24}>
            <FormItem label="标题">{getFieldDecorator('title')(<Input />)}</FormItem>
          </Col>
        </Row>
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={6} sm={24}>
            <FormItem label="关键字">{getFieldDecorator('keywords')(<Input />)}</FormItem>
          </Col>
          <Col md={4} sm={24}>
            <FormItem label="正文">{getFieldDecorator('content')(<Input />)}</FormItem>
          </Col>
          <Col md={4} sm={24}>
            <FormItem label="稿源">{getFieldDecorator('source')(<Input />)}</FormItem>
          </Col>
          <Col md={6} sm={24}>
            <FormItem label="作者">{getFieldDecorator('author')(<Input />)}</FormItem>
          </Col>
        </Row>

        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={6} sm={24}>
            <FormItem label="专题">
              {getFieldDecorator('queryTopicId')(
                <TreeSelect
                  showSearch
                  dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                  placeholder="选择栏目"
                  allowClear
                  treeDefaultExpandAll
                  filterTreeNode={(inputValue, treeNode) =>
                    treeNode.props.title.indexOf(inputValue) >= 0
                  }
                >
                  {this.renderTree(configTopics)}
                </TreeSelect>
              )}
            </FormItem>
          </Col>
          <Col md={4} sm={24}>
            <FormItem label="	创建者">{getFieldDecorator('createUserName')(<Input />)}</FormItem>
          </Col>
        </Row>
        <div style={{ overflow: 'hidden' }}>
          <div style={{ marginBottom: 24 }}>
            <Button type="primary" htmlType="submit">
              查询
            </Button>
            <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>
              重置
            </Button>
            <a style={{ marginLeft: 8 }} onClick={this.toggleForm}>
              收起 <Icon type="up" />
            </a>
          </div>
        </div>
      </Form>
    );
  }

  renderForm() {
    const { expandForm } = this.state;
    return expandForm ? this.renderAdvancedForm() : this.renderSimpleForm();
  }

  render() {
    const {
      dataNews: { data },
      loading,
    } = this.props;
    const { selectedRows } = this.state;

    return (
      <GridContent>
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>{this.renderForm()}</div>
            <div className={styles.tableListOperator}>
              <Button
                type="primary"
                disabled={selectedRows.length === 0}
                onClick={e => this.reset(e)}
              >
                恢复
              </Button>
            </div>
            <StandardTable
              selectedRows={selectedRows}
              loading={loading}
              data={data}
              columns={this.columns}
              onSelectRow={this.handleSelectRows}
              onChange={this.handleStandardTableChange}
              bordered
              size="small"
              onRow={() => {
                return {
                  onClick: e => {
                    e.target.parentNode.getElementsByTagName('input')[0].click();
                  },
                };
              }}
            />
          </div>
        </Card>
      </GridContent>
    );
  }
}

export default Index;
