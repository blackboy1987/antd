import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Form, Modal, Input, message } from 'antd';

const FormItem = Form.Item;

@connect(({ dataComments }) => ({
  dataComments,
}))
@Form.create()
class Add extends PureComponent {
  onOk = () => {
    const { onOk, form, dispatch } = this.props;
    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        dispatch({
          type: 'dataComments/addComments',
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
          {getFieldDecorator('newsid', { initialValue: values.newsid })(<Input type="hidden" />)}
          {getFieldDecorator('commentid', { initialValue: values.id1 })(<Input type="hidden" />)}
          {getFieldDecorator('userId', { initialValue: values.userid })(<Input type="hidden" />)}
          {getFieldDecorator('nickName', { initialValue: values.nickname })(
            <Input type="hidden" />
          )}

          <FormItem {...formItemLayout} label="新闻标题">
            <span className="ant-text">{values.title}</span>
          </FormItem>
          <FormItem {...formItemLayout} label="上级评论">
            <span className="ant-text">{values.comment}</span>
          </FormItem>
          <FormItem {...formItemLayout} label="评论内容">
            {getFieldDecorator('praiseCount', {
              rules: [
                {
                  required: true,
                  message: '必填',
                },
              ],
            })(<Input.TextArea style={{ resize: 'none' }} autosize={{ minRows: 4, maxRows: 4 }} />)}
          </FormItem>
        </Form>
      </Modal>
    );
  }
}

export default Add;
