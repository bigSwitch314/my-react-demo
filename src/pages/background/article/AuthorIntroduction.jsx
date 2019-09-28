import React from 'react'
import HeaderBar from '@/components/shared/HeaderBar'
import { Button, Modal } from 'antd'
import Editor from '@/components/markdown';
import '@/components/markdown/editor/index.less';
import handleCode from '@/components/markdown/helpers/handelCode';
import marked from '@/components/markdown/helpers/marked';


class AuthorIntroduction extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      visible: false,
      value: null,
      htmlValue: null,
    }
  }

  static getDerivedStateFromProps(props, state) {
    if (props.userList !== state.userList) {
      return { userList: props.userList }
    }

    return null
  }

  componentDidMount() {
    const value =
`# 个人简介
罗强<br/>
QQ：2807884436<br/>
Email: luoqiang314@gmail.com<br/>
喜欢学习，喜欢实践
# 开发语言
* javascript
* php
* golang


# 技术栈
## 1.服务端
* PHP：ThinkPHP5
* NodeJs: Koa/socket.io
* Golang: Beego/http

## 2.前端
* Javascript: Vue/React

## 3.数据库
* Mysql
* Redis
* MongoDB

## 4.操作系统
* CentOS
* Ubuntu
`
    this.setState({
      value,
      htmlValue: handleCode(marked(value)),
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
  }

  editHandler() {
    this.setState({ visible: true })
  }

  render() {
    const { value, visible, htmlValue } = this.state

    return (
      <div className="container">
        <div className="button-group">
          <HeaderBar>
            <HeaderBar.Left>
              <Button type="primary" onClick={() => this.editHandler()}>编辑</Button>
              <Button className="button" onClick={() => this.delete()}>删除</Button>
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
