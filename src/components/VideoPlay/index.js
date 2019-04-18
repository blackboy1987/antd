import React, { PureComponent } from 'react';
import { Player } from 'video-react';

import './index.less';

class VideoPlay extends PureComponent {
  render() {
    return (
      <div onClick={e => e.stopPropagation()}>
        <Player {...this.props} />
      </div>
    );
  }
}

export default VideoPlay;
