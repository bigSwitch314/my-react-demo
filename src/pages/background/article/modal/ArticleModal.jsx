import React from 'react'
import { Form, Modal } from 'antd'
import '../style/ArticleModal.less'

const FormItem = Form.Item

// @Form.create()

class AddArticle extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      currentPage: 1,
      pageSize: 10,
      selectedRowKeys: [],
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

  render() {

    return (
      <div className="origin-article">
        <Modal
          title="Basic Modal"
          visible={true}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
        >
          <p>添加文章</p>
        </Modal>
      </div>
    )
  }
}

export default Form.create()(AddArticle)
