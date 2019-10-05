import React from 'react'
import { connect } from 'react-redux'
import HeaderBar from '@/components/shared/HeaderBar'
import { Button, Modal, message } from 'antd'
import Editor from '@/components/markdown';
import '@/components/markdown/editor/index.less';
import handleCode from '@/components/markdown/helpers/handelCode';
import marked from '@/components/markdown/helpers/marked';
import {
  addIntroduction,
  getIntroduction,
  editIntroduction,
  deleteIntroduction,
} from '@/modules/introduction'
import { deleteConfirm } from 'components/shared/Confirm'


@connect(
  state => ({
    introduction: state.introduction.introduction,
    loading: state.loading['introduction/introduction'],
  }), {
    addIntroduction,
    getIntroduction,
    editIntroduction,
    deleteIntroduction,
  }
)

class AuthorIntroduction extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      visible: false,
      value: '',
      htmlValue: '',
    }
  }

  static getDerivedStateFromProps(props, state) {
    if (props.userList !== state.userList) {
      return { userList: props.userList }
    }

    return null
  }

  componentDidMount() {
    this.getIntroduction()
  }

  // 查询个人简介
  getIntroduction() {
    this.props.getIntroduction({ type: 1 }).then(res => {
      const { payload } =res
      const value = payload ? payload.text_data : ''
      this.setState({
        value: value,
        htmlValue: handleCode(marked(value)),
      })
    })
  }

  onEditorChange(value) {
    console.log(value)
    this.setState({ value })
  }

  onEditorSave(value) {
    console.log(marked(value))
    this.setState({
      htmlValue: marked(value),
      visible: false,
    })
    // 保存数据
    const { addIntroduction, editIntroduction, introduction } = this.props
    const param = {
      type: 1,
      text_data: value,
    }
    if (introduction.id) {
      param.id = introduction.id
      editIntroduction(param).then(res => {
        if (res instanceof Error) return
        message.success('修改成功', 1, () => {
          this.getIntroduction()
        })
      })
    } else {
      addIntroduction(param).then(res => {
        if (res instanceof Error) return
        message.success('添加成功', 1, () => {
          this.getIntroduction()
        })
      })
    }
  }

  editHandler() {
    this.setState({ visible: true })
  }

  /** 删除弹框 */
  showConfirm = () => {
    const { id } = this.props.introduction
    deleteConfirm(() => this.deleteData(id), '确定删除吗？')
  }

  /** 删除数据方法 */
  deleteData = (id) => {
    let idArr = []
    id instanceof Array ? idArr = id : idArr.push(id)
    this.props.deleteIntroduction({
      id: idArr.join(','),
    }).then((res) => {
      if (res instanceof Error) return
      message.success('删除成功', 1, () => {
        this.getIntroduction()
      })
    })
  }

  render() {
    const { value, visible, htmlValue } = this.state
    const { introduction } = this.props
    const { text_data } = introduction

    return (
      <div className="container">
        <div className="button-group">
          <HeaderBar>
            <HeaderBar.Left>
              <Button type="primary" onClick={() => this.editHandler()}>{ !text_data ? '添加' : '编辑'}</Button>
              <Button className="button" onClick={() => this.showConfirm()} disabled={!text_data}>删除</Button>
            </HeaderBar.Left>
          </HeaderBar>
        </div>

        <div
          className="content for-preview for-markdown-preview"
          dangerouslySetInnerHTML={{ __html: handleCode(htmlValue) }}
        />

        {/* markdown编辑器弹窗 */}
        <Modal
          width={'100%'}
          height={'100%'}
          visible={visible}
          onCancel={this.onEditorCancel}
          footer={null}
          closable={false}
          maskClosable={false}
        >
          <Editor
            value={value}
            onChange={(val) => this.onEditorChange(val)}
            onSave={(val) => this.onEditorSave(val)}
          />
        </Modal>
      </div>
    )
  }
}

export default AuthorIntroduction
