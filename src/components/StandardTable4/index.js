import React, { PureComponent } from 'react';
import { Table } from 'antd';
import styles from './index.less';

class StandardTable4 extends PureComponent {
  render() {
    const { data = {}, rowKey, ...rest } = this.props;
    const { list = [] } = data;

    return (
      <div className={styles.standardTable}>
        <Table
          rowKey={rowKey || 'id'}
          dataSource={list}
          onChange={this.handleTableChange}
          {...rest}
        />
      </div>
    );
  }
}

export default StandardTable4;
