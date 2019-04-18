import React, { PureComponent } from 'react';
import { Card } from 'antd';

import GridContent from '@/components/PageHeaderWrapper/GridContent';
import Local from './Local';
import NetWork from './NetWork';

class Select extends PureComponent {
  state = {
    noTitleKey: '1',
  };

  onTabChange = (key, type) => {
    this.setState({ [type]: key });
  };

  render() {
    const { noTitleKey } = this.state;
    const contentListNoTitle = {
      1: <Local />,
      2: <NetWork />,
    };

    const tabListNoTitle = [
      {
        key: '1',
        tab: '本地上传',
      },
      {
        key: '2',
        tab: '网络地址',
      },
    ];
    return (
      <GridContent>
        <Card
          style={{ width: '100%' }}
          tabList={tabListNoTitle}
          activeTabKey={noTitleKey}
          onTabChange={key => {
            this.onTabChange(key, 'noTitleKey');
          }}
        >
          {contentListNoTitle[noTitleKey]}
        </Card>
      </GridContent>
    );
  }
}

export default Select;
