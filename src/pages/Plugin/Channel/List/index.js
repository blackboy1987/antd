import React, { Fragment, PureComponent } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import { Card, Form, Modal, message, Divider } from 'antd';
import StandardTable from '@/components/StandardTable4';
import { Link } from 'umi';
import styles from './index.less';
import GridContent from '@/components/PageHeaderWrapper/GridContent';

@connect(({ channelPlugin, loading }) => ({
  channelPlugin,
  loading: loading.models.channelPlugin,
}))
@Form.create()
class List extends PureComponent {
  columns = [
    {
      title: '渠道名称',
      dataIndex: 'name',
    },
    {
      title: '作者',
      dataIndex: 'author',
    },
    {
      title: '状态',
      dataIndex: 'isEnabled',
      render: text => <span>{text ? '启用' : '禁用'}</span>,
    },
    {
      title: '创建时间',
      dataIndex: 'createDate',
      render: text => <span>{moment(text).format('YYYY-MM-DD HH:mm:ss')}</span>,
    },
    {
      title: '操作',
      render: (text, record) => (
        <Fragment>
          {record.isInstalled ? (
            <Fragment>
              <Link to={`channel/setting/${record.id}`}>设置</Link>
              <Divider type="vertical" />
              <a onClick={() => this.uninstall(record)}>卸载</a>
            </Fragment>
          ) : (
            <a onClick={() => this.install(record)}>安装</a>
          )}
        </Fragment>
      ),
    },
  ];

  componentDidMount() {
    const root = this;
    const { dispatch } = root.props;
    dispatch({
      type: 'channelPlugin/list',
    });
  }

  install = record => {
    Modal.confirm({
      title: '提醒',
      content: '确定安装该渠道插件',
      okText: '确定',
      cancelText: '取消',
      onOk: () => {
        const root = this;
        const { dispatch } = root.props;
        dispatch({
          type: 'channelPlugin/install',
          payload: {
            id: record.id,
            installUrl: record.installUrl,
          },
          callback: response => {
            if (response.type === 'success') {
              message.success(response.content);
              this.componentDidMount();
            } else {
              message.error(response.content);
            }
          },
        });
      },
    });
  };

  uninstall = record => {
    Modal.confirm({
      title: '提醒',
      content: '确定卸载该渠道插件',
      okText: '确定',
      cancelText: '取消',
      onOk: () => {
        const root = this;
        const { dispatch } = root.props;
        dispatch({
          type: 'channelPlugin/uninstall',
          payload: {
            id: record.id,
            uninstallUrl: record.uninstallUrl,
          },
          callback: response => {
            if (response.type === 'success') {
              message.success(response.content);
              this.componentDidMount();
            } else {
              message.error(response.content);
            }
          },
        });
      },
    });
  };

  render() {
    const {
      channelPlugin: { data },
      loading,
    } = this.props;
    return (
      <GridContent>
        <Card bordered={false}>
          <div className={styles.tableList}>
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
