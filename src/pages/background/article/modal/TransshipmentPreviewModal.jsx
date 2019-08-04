import React from 'react'
import { connect } from 'react-redux'
import { Modal } from 'antd'
import '../style/PreviewModal.less'
import marked from '../../../../components/markdown/helpers/marked'
import handleCode from '../../../../components/markdown/helpers/handelCode'


@connect(
  null,
  null,
  null,
  { forwardRef: true },
)

class TransshipmentPreviewModal extends React.Component {
  constructor(props) {
    super(props)
    this.state = { article: null }
  }

  static getDerivedStateFromProps(props, state) {
    if (props.userList !== state.userList) {
      return { userList: props.userList }
    }

    return null
  }

  componentDidMount() {
  }

  getRecord(record) {
    this.setState({ article: record })
  }

  render() {
    const { visible, onCancel} = this.props
    const { article } = this.state

    return (
      <Modal
        width={760}
        visible={visible}
        onCancel={onCancel}
        title={'文章预览'}
        footer={null}
        maskClosable={false}
      >
        <div className="preview-modal">
          {article ?
            <React.Fragment>
              <div className="title">{article.title}</div>
              <div
                className="content for-preview for-markdown-preview"
                dangerouslySetInnerHTML={{ __html: handleCode(marked(article.content_md)) }}
              />
            </React.Fragment>
            : null}
        </div>
      </Modal>
    )
  }
}

export default TransshipmentPreviewModal

