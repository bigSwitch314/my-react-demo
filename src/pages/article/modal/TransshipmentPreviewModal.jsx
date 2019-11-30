import React from 'react'
import { connect } from 'react-redux'
import { Modal } from 'antd'
import '../style/PreviewModal.less'
import marked from '@/components/markdown/helpers/marked'
import handleCode from '@/components/markdown/helpers/handelCode'
import { getTransshipmentArticle } from '@/modules/transshipmentArticle'


@connect(
  state => ({
    transshipmentArticle: state.transshipmentArticle.transshipmentArticle,
  }),
  { getTransshipmentArticle },
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

  // 获取文章
  getArticle = (id) => {
    return this.props.getTransshipmentArticle({ id })
  }

  getRecord(record) {
    this.getArticle(record.id).then(res => {
      console.log(res)
      this.setState({ article: res.payload})
    })
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

