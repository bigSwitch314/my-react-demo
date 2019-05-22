import React from 'react'
import { Modal } from 'antd'
import '../style/ArticleModal.less'

class PreviewModal extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
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
    const { visible, onOk, onCancel} = this.props

    return (
        <Modal
          width={700}
          visible={visible}
          onOk={onOk}
          onCancel={onCancel}
          okText="保存"
        >
          11111111111111111111111111111111111111111111
          222222222222222222222222222222
          33333333333333333
          444444444
          55555
          666
          77
          8
        </Modal>
    )
  }
}

export default PreviewModal

