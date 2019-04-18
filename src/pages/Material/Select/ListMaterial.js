import React, { PureComponent } from 'react';
import { Card, Button, Form, Row, Col, Input } from 'antd';
import GridContent from '@/components/PageHeaderWrapper/GridContent';
import styles from './ListMaterial.less';

const FormItem = Form.Item;

@Form.create()
class ListMaterial extends PureComponent {
  renderSimpleForm() {
    const {
      form: { getFieldDecorator },
    } = this.props;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem label="规则名称">
              {getFieldDecorator('name')(<Input placeholder="请输入" />)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <span className={styles.submitButtons}>
              <Button type="primary" htmlType="submit">
                查询
              </Button>
              <Button style={{ marginLeft: 8 }} icon="plus" type="primary">
                上传
              </Button>
            </span>
          </Col>
        </Row>
      </Form>
    );
  }

  render() {
    return (
      <GridContent>
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>{this.renderSimpleForm()}</div>
            <div>asdfasdfads</div>
          </div>
        </Card>
      </GridContent>
    );
  }
}

export default ListMaterial;
