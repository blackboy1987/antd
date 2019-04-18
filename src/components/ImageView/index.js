import React, { PureComponent } from 'react';
import { Upload, Modal } from 'antd';

import './index.less';

class ImageView extends PureComponent {
  state = {
    previewVisible: false,
    previewImage: '',
  };

  handlePreview = file => {
    this.setState({
      previewImage: file.url || file.thumbUrl,
      previewVisible: true,
    });
  };

  handleCancel = () => this.setState({ previewVisible: false });

  render() {
    const { previewVisible, previewImage } = this.state;
    const { title, prevUrl } = this.props;
    const fileList = [];
    fileList.push({
      uid: 1,
      name: title,
      url: prevUrl,
    });

    return (
      <div onClick={e => e.stopPropagation()}>
        <Upload listType="picture-card" fileList={fileList} onPreview={this.handlePreview} />
        <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
          <img alt="example" style={{ width: '100%' }} src={previewImage} />
        </Modal>
      </div>
    );
  }
}

export default ImageView;
