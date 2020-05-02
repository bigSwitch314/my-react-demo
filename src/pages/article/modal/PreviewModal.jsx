import React from 'react'
import { connect } from 'react-redux'
import { Modal } from 'antd'
import '../style/PreviewModal.less'
import marked from '@/components/markdown/helpers/marked'
import handleCode from '@/components/markdown/helpers/handelCode'


@connect(
  state => ({
    categoryList: state.category.categoryList,
  }),
  null,
  null,
  { forwardRef: true },
)

class PreviewModal extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      article: null,
      categoryName: null,
    }
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
    const { categoryList } = this.props
    const category = categoryList.list.find(item => item.id === record.category_id)
    this.setState({
      article: record,
      categoryName: category ? category.name: '',
    })
  }

  render() {
    const { visible, onCancel} = this.props
    const { article, categoryName } = this.state
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
              <div className="meta-info">
                <span className="block">3天前</span>
                <span className="block">{categoryName}</span>
                <span className="block">阅读约4分钟</span>
              </div>
              <div
                className="for-preview for-markdown-preview"
                dangerouslySetInnerHTML={{ __html: handleCode(marked(article.content_md)) }}
              />
              {
    console.log('handleCode(marked(article.content_md))--------', handleCode(marked(article.content_md)))

              }
            </React.Fragment>
            : null}
        </div>
      </Modal>
    )
  }
}

export default PreviewModal

