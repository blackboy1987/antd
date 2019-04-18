import React, { PureComponent } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import { Row, Col, Card, Form, Input, Button, Checkbox } from 'antd';
import StandardTable from '@/components/StandardTable3';
import styles from './index.less';
import GridContent from '@/components/PageHeaderWrapper/GridContent';
import ImageView from '../../../components/ImageView';

const FormItem = Form.Item;
const getValue = obj =>
  Object.keys(obj)
    .map(key => obj[key])
    .join(',');

@connect(({ material, loading }) => ({
  material,
  loading: loading.models.material,
}))
@Form.create()
class List extends PureComponent {
  state = {
    formValues: {
      virtualfileTypeArrayStr: ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10'],
    },
  };

  columns = [
    {
      title: '文件名称',
      dataIndex: 'virtualfileName',
    },
    {
      title: '类型',
      dataIndex: 'virtualfileType',
      render: text => {
        let result = '未知类型';
        if (text === 0) {
          result = '未知类型';
        } else if (text === 1) {
          result = '图片';
        } else if (text === 2) {
          result = '视频';
        } else if (text === 3) {
          result = '音频';
        } else if (text === 4) {
          result = '视音频';
        } else if (text === 5) {
          result = '文本';
        } else if (text === 6) {
          result = 'word';
        } else if (text === 7) {
          result = 'PPT';
        } else if (text === 8) {
          result = 'excel';
        } else if (text === 9) {
          result = '文件夹';
        }

        return result;
      },
    },
    {
      title: '创建人',
      dataIndex: 'createMemberName',
    },
    {
      title: '文件大小',
      dataIndex: 'virtualfileSize',
    },
    {
      title: '预览图',
      dataIndex: 'middleIcon',
      render: (text, record) => {
        if (record.virtualfileType === 1) {
          return (
            <ImageView
              title={record.realfileName}
              prevUrl={`http://119.3.68.195/img/${record.realfilePath}${record.realfileName}`}
              {...record}
            />
          );
        }
        return '';
      },
    },
    {
      title: '创建时间',
      dataIndex: 'createdDatetime',
      render: text => <span>{moment(text).format('YYYY-MM-DD HH:mm:ss')}</span>,
    },
  ];

  componentDidMount() {
    const root = this;
    const { dispatch } = root.props;
    const { formValues } = root.state;
    dispatch({
      type: 'material/list',
      payload: {
        ...formValues,
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
      pageNumber: pagination.current,
      pageSize: pagination.pageSize,
      ...formValues,
      ...filters,
    };
    if (sorter.field) {
      params.sorter = `${sorter.field}_${sorter.order}`;
    }
    dispatch({
      type: 'material/list',
      payload: params,
    });
  };

  handleFormReset = () => {
    const { form, dispatch } = this.props;
    const { formValues } = this.state;
    form.resetFields();
    dispatch({
      type: 'material/list',
      payload: {
        ...formValues,
      },
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
      console.log(
        fieldsValue.virtualfileTypeArrayStr,
        fieldsValue.virtualfileTypeArrayStr.toString()
      );
      dispatch({
        type: 'material/list',
        payload: values,
      });
    });
  };

  renderSimpleForm() {
    const {
      form: { getFieldDecorator },
    } = this.props;
    const { formValues } = this.state;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={12} sm={24}>
            <FormItem label="文件类型">
              {getFieldDecorator('virtualfileTypeArrayStr', {
                initialValue: formValues.virtualfileTypeArrayStr,
              })(
                <Checkbox.Group style={{ width: '100%' }}>
                  <Row>
                    <Col span={2}>
                      <Checkbox value="1">图片</Checkbox>
                    </Col>
                    <Col span={2}>
                      <Checkbox value="2">视频</Checkbox>
                    </Col>
                    <Col span={2}>
                      <Checkbox value="3">音频</Checkbox>
                    </Col>
                    <Col span={2}>
                      <Checkbox value="4">视音频</Checkbox>
                    </Col>
                    <Col span={2}>
                      <Checkbox value="5">文本</Checkbox>
                    </Col>
                    <Col span={2}>
                      <Checkbox value="6">word</Checkbox>
                    </Col>
                    <Col span={2}>
                      <Checkbox value="7">PPT</Checkbox>
                    </Col>
                    <Col span={2}>
                      <Checkbox value="8">excel</Checkbox>
                    </Col>
                    <Col span={2}>
                      <Checkbox value="9">文件夹</Checkbox>
                    </Col>
                    <Col span={2}>
                      <Checkbox value="0">其他</Checkbox>
                    </Col>
                  </Row>
                </Checkbox.Group>
              )}
            </FormItem>
          </Col>
          <Col md={5} sm={24}>
            <FormItem label="文件名称">{getFieldDecorator('virtualfileName')(<Input />)}</FormItem>
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

  renderForm() {
    return this.renderSimpleForm();
  }

  render() {
    const {
      material: { data },
      loading,
    } = this.props;
    return (
      <GridContent>
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>{this.renderForm()}</div>
            <StandardTable
              loading={loading}
              data={data}
              columns={this.columns}
              onSelectRow={this.handleSelectRows}
              onChange={this.handleStandardTableChange}
              bordered
              size="small"
            />
          </div>
        </Card>
      </GridContent>
    );
  }
}

export default List;
