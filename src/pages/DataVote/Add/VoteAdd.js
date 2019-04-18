import React, { PureComponent } from 'react';
import { Modal, Form, Input, InputNumber, Checkbox } from 'antd';
import TableForm from './TableForm';

let tableData = [
  {
    index: '1',
    key: '1',
    options: '',
    content: '',
    orderno: '1',
    enable: true,
    editable: true,
  },
];

class VoteAdd extends PureComponent {
  onOk = e => {
    const { onOk, form } = this.props;
    e.preventDefault();
    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        const formValues = {
          ...values,
          key: new Date().getTime(),
        };
        console.log(tableData);
        onOk(formValues);
      }
    });
  };

  render() {
    const {
      voteAddModalVisible,
      onCancel,
      form: { getFieldDecorator },
      dataVote,
    } = this.props;
    if (dataVote && dataVote.dataVoteoptions) {
      tableData = [];
      tableData = dataVote.dataVoteoptions.map((item, index) => {
        return {
          index: `${index}`,
          key: `${item.id}`,
          id: `${item.id}`,
          options: `${item.options}`,
          content: `${item.content}`,
          orderno: `${item.orderno}`,
          enable: `${item.enable}`,
          editable: true,
        };
      });
    }

    return (
      <Modal
        visible={voteAddModalVisible}
        onOk={this.onOk}
        onCancel={onCancel}
        title="添加投票"
        width="80%"
        destroyOnClose
        maskClosable={false}
      >
        <Form layout="horizontal">
          {getFieldDecorator('id', {
            initialValue: dataVote.id,
          })(<Input type="hidden" />)}
          <Form.Item label="标题" labelCol={{ span: 5 }} wrapperCol={{ span: 15 }}>
            {getFieldDecorator('title', {
              initialValue: dataVote.title,
              rules: [{ required: true, message: '必填' }],
            })(<Input />)}
          </Form.Item>
          <Form.Item label="可选答案数" labelCol={{ span: 5 }} wrapperCol={{ span: 15 }}>
            {getFieldDecorator('voteMax', {
              initialValue: dataVote.voteMax,
              rules: [{ required: true, message: '必填' }],
            })(<InputNumber min={1} precision={0} step={1} />)}
          </Form.Item>
          <Form.Item label="排序" labelCol={{ span: 5 }} wrapperCol={{ span: 15 }}>
            {getFieldDecorator('orderno', {
              initialValue: dataVote.orderno,
            })(<InputNumber min={1} precision={0} step={1} />)}
          </Form.Item>
          <Form.Item label="设置" labelCol={{ span: 5 }} wrapperCol={{ span: 15 }}>
            {getFieldDecorator('isEnabled', {
              valuePropName: 'checked',
              initialValue: dataVote.enable || true,
            })(<Checkbox>是否启用</Checkbox>)}
          </Form.Item>
          <Form.Item label="选项" labelCol={{ span: 5 }} wrapperCol={{ span: 15 }}>
            {getFieldDecorator('dataVoteoptions', {
              initialValue: tableData,
            })(<TableForm style={{ height: 800, overflowY: 'auto' }} onChange={this.onChange} />)}
          </Form.Item>
        </Form>
      </Modal>
    );
  }
}

export default Form.create()(VoteAdd);
