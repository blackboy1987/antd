import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { FormattedMessage } from 'umi/locale';
import { Form, Input, Button, Card } from 'antd';
import GridContent from '@/components/PageHeaderWrapper/GridContent';

const FormItem = Form.Item;

@connect(({ channelPlugin, loading }) => ({
  channelPlugin,
  submitting: loading.effects['form/submitRegularForm'],
}))
@Form.create()
class GuangDian extends PureComponent {
  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'channelPlugin/setting',
      payload: {
        settingUrl: 'guang_dian/setting',
      },
    });
  }

  handleSubmit = e => {
    const { dispatch, form } = this.props;
    e.preventDefault();
    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        dispatch({
          type: 'channelPlugin/update',
          payload: {
            ...values,
            updateUrl: 'guang_dian/update',
          },
        });
      }
    });
  };

  render() {
    const {
      submitting,
      channelPlugin: {
        channelPluginInfo: { attributes = {} },
      },
    } = this.props;
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
            <FormItem {...formItemLayout} label="接口地址" help="不能以“/”结尾">
              {getFieldDecorator('url', {
                initialValue: attributes.url,
                rules: [
                  {
                    required: true,
                    message: '必填',
                  },
                ],
              })(<Input />)}
            </FormItem>
            <FormItem {...formItemLayout} label="用户名">
              {getFieldDecorator('username', {
                initialValue: attributes.username,
                rules: [
                  {
                    required: true,
                    message: '必填',
                  },
                ],
              })(<Input />)}
            </FormItem>
            <FormItem {...formItemLayout} label="密码">
              {getFieldDecorator('password', {
                initialValue: attributes.password,
                rules: [
                  {
                    required: true,
                    message: '必填',
                  },
                ],
              })(<Input />)}
            </FormItem>
            <FormItem {...submitFormLayout} style={{ marginTop: 32 }}>
              <Button type="primary" htmlType="submit" loading={submitting}>
                <FormattedMessage id="form.submit" />
              </Button>
              <Button style={{ marginLeft: 8 }}>
                <FormattedMessage id="form.save" />
              </Button>
            </FormItem>
          </Form>
        </Card>
      </GridContent>
    );
  }
}

export default GuangDian;
