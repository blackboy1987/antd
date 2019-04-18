import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Form, Modal, Input, InputNumber, message } from 'antd';

const FormItem = Form.Item;

@connect(({ dataComments }) => ({
  dataComments,
}))
@Form.create()
class Edit extends PureComponent {
  onOk = () => {
    const { onOk, form, dispatch } = this.props;
    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        dispatch({
          type: 'dataComments/updatePraise',
          payload: values,
          callback: response => {
            if (response.type === 'success') {
              message.success(response.content);
              onOk();
            } else {
              message.error(response.content);
            }
          },
        });
      }
    });
  };

  render() {
    const {
      visible,
      onOk,
      form: { getFieldDecorator },
      values,
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

    return (
      <Modal visible={visible} onOk={this.onOk} onCancel={onOk} destroyOnClose maskClosable={false}>
        <Form onSubmit={this.handleSubmit} style={{ marginTop: 8 }}>
          {getFieldDecorator('id', { initialValue: values.id1 })(<Input type="hidden" />)}
          {getFieldDecorator('newsid', { initialValue: values.newsid })(<Input type="hidden" />)}
          {getFieldDecorator('userId', { initialValue: values.userid })(<Input type="hidden" />)}
          {getFieldDecorator('nickName', { initialValue: values.nickname })(
            <Input type="hidden" />
          )}

          <FormItem {...formItemLayout} label="新闻标题">
            <span className="ant-text">{values.title}</span>
          </FormItem>
          <FormItem {...formItemLayout} label="评论人">
            <span className="ant-text">{values.nickname}</span>
          </FormItem>
          <FormItem {...formItemLayout} label="评论内容">
            <span className="ant-text">{values.comment}</span>
          </FormItem>
          <FormItem {...formItemLayout} label="点赞数">
            <span className="ant-text">{values.countParise}</span>
          </FormItem>
          <FormItem {...formItemLayout} label="调整数量">
            {getFieldDecorator('praiseCount', {
              rules: [
                {
                  required: true,
                  message: '必填',
                },
              ],
            })(<InputNumber style={{ width: '100%' }} min={0} precision={0} step={1} />)}
          </FormItem>
        </Form>
      </Modal>
    );
  }
}

export default Edit;
