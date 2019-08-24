import { Form, Input, Modal, Radio } from 'antd';
import React from 'react';
import { connect } from 'react-redux';
import Editor from '@/components/markdown';
import '@/components/markdown/editor/index.less';
import handleCode from '@/components/markdown/helpers/handelCode';
import marked from '@/components/markdown/helpers/marked';
import { addTransshipmentArticle, editTransshipmentArticle } from '@/modules/TransshipmentArticle';
import { noSpecialChar, REGEXP_URL } from '@/utils/validator'
import '../style/TransshipmentModal.less'

const FormItem = Form.Item
const RadioGroup = Radio.Group

const formItemLayout = {
  labelCol: { span: 2 },
  wrapperCol: { span: 12 },
}

const formItemLayoutRadio = {
  labelCol: { span: 2 },
  wrapperCol: { span: 20 },
}

const formItemLayoutContent = {
  labelCol: {span: 2 },
  wrapperCol: { span: 21 },
}

@Form.create()
@connect(
  null,
  { addTransshipmentArticle, editTransshipmentArticle },
  null,
  { forwardRef: true },
)

class ArticleModal extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      currentPage: 1,
      pageSize: 10,
      selectedRowKeys: [],
      category: null,
      editorValue: null,
      editorVisible: false,
      htmlValue: null,
      hasContentMessage: false,
      editData: null,
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

  setFieldsValue = (isEdit, editData) => {
    const { setFieldsValue } = this.props.form
    if(isEdit) {
      setFieldsValue({
        title: editData.title,
        author: editData.author,
        link: editData.link,
        release: editData.release,
      })
      this.setState({
        htmlValue: marked(editData.content_md),
        editorValue: editData.content_md,
        editData,
      })
    } else {
      setFieldsValue({
        title: null,
        author: null,
        link: null,
        release: 0,
      })
      this.setState({
        htmlValue: null,
        editorValue: null,
      })
    }
  }

  onRadioChange = (e) => {
    console.log('radio checked', e.target.value);
    this.setState({
      value: e.target.value,
    });
  }

  onEditorChange(value) {
    this.setState({ editorValue: value })
  }

  onEditorSave(value) {
    console.log(value)
    const htmlValue = marked(value)
    // const encode = htmlEncode(htmlValue)
    // this.props.form.setFieldsValue({ content: encode })
    if(htmlValue) {
      this.setState({ hasContentMessage: false })
    }
    this.setState({
      editorVisible: false,
      htmlValue,
    })
  }

  showEditor() {
    this.setState({ editorVisible: true })
  }

  handleEditorExit() {
    this.setState({ editorVisible: false })
  }

  onOk() {
    const { validateFieldsAndScroll, getFieldsValue } = this.props.form
    const { addTransshipmentArticle, isEdit, editTransshipmentArticle } = this.props
    validateFieldsAndScroll((err) => {
      const { htmlValue, editorValue, editData } = this.state
      if (!err) {
        if(!htmlValue) {
          this.setState({ hasContentMessage: true })
          return
        }

        // 保存文章
        const { title, author, link, release } = getFieldsValue()
        const param = {
          title,
          author: author,
          link: link,
          content_md: editorValue,
          release,
        }

        if(isEdit) {
          param.id = editData.id
          editTransshipmentArticle(param).then((res) => {
            if (res instanceof Error) { return }
            this.props.onOk()
            this.setState({ htmlValue: null })
          })
        } else {
          addTransshipmentArticle(param).then((res) => {
            if (res instanceof Error) { return }
            this.props.onOk()
            this.setState({ htmlValue: null })
          })
        }
      } else {
        if (!htmlValue) {
          this.setState({ hasContentMessage: true })
          return
        }
      }
    })
  }

  render() {
    const { editorValue, editorVisible, htmlValue, hasContentMessage } = this.state
    const { visible, onCancel, isEdit } = this.props
    const { getFieldDecorator } = this.props.form


    return (
      <React.Fragment>
        {/* 编辑文章弹窗 */}
        <Modal
          width={920}
          title={isEdit ? '编辑文章' : '添加文章'}
          visible={visible}
          onOk={() => this.onOk()}
          onCancel={onCancel}
          okText='保存'
        >
          <div className='Transshipment-modal'>
            <FormItem
              label='标题'
              {...formItemLayout}
              style={{ left: 8 }}
            >
              {getFieldDecorator('title', {
                rules: [{
                  required: true,
                  message: '请输入标题',
                  whitespace: true,
                }, noSpecialChar],
              })(
                <Input maxLength={200} />,
              )}
            </FormItem>
            <FormItem
              label='作者'
              {...formItemLayout}
              style={{ left: 8 }}
            >
              {getFieldDecorator('author', {
                rules: [{
                  required: true,
                  message: '请输入作者',
                  whitespace: true,
                }, noSpecialChar],
              })(
                <Input maxLength={200} />,
              )}
            </FormItem>
            <FormItem
              label='原文链接'
              {...formItemLayout}
            >
              {getFieldDecorator('link', {
                rules: [{
                  required: true,
                  message: '请输入原文链接',
                  whitespace: true,
                }, {
                  pattern: REGEXP_URL,
                  message: '请输入正确url',
                }],
              })(
                <Input style={{ left: 8 }} maxLength={300} />,
              )}
            </FormItem>
            <FormItem
              label='发布'
              {...formItemLayoutRadio}
              style={{ left: 8 }}
            >
              {getFieldDecorator('release', {
                rules: [{
                  required: true,
                  message: '请选择类型',
                  whitespace: true,
                  type: 'number',
                }],
              })(
                <RadioGroup
                  onChange={this.onTypeChange}
                >
                  <Radio value={1}>是</Radio>
                  <Radio value={0}>否</Radio>
                </RadioGroup>,
              )}
            </FormItem>
            <span className='edit' onClick={() => this.showEditor()}>编辑</span>
            <FormItem
              label='内容'
              {...formItemLayoutContent}
              style={{ left: 8 }}
            >
              {getFieldDecorator('content', {
                rules: [{
                  required: true,
                  message: ' ',
                }],
                initialValue: ' ',
              })(
                <div
                  className='content for-preview for-markdown-preview'
                  style={{ borderColor: hasContentMessage ? '#f5222d' : '#d9d9d9' }}
                  dangerouslySetInnerHTML={{ __html: handleCode(htmlValue) }}
                />
              )}
            </FormItem>
            {hasContentMessage && <span className='content-message'>请输入内容</span>}
          </div>
        </Modal>

        {/* markdown编辑器弹窗 */}
        <Modal
          width={'100%'}
          height={'100%'}
          visible={editorVisible}
          onCancel={this.onEditorCancel}
          footer={null}
          closable={false}
          maskClosable={false}
        >
          <Editor
            value={editorValue}
            onChange={this.onEditorChange.bind(this)}
            onSave={this.onEditorSave.bind(this)}
            onExit={this.handleEditorExit.bind(this)}
          />
        </Modal>
      </React.Fragment>
    )
  }
}

// export default Form.create()(ArticleModal)
export default ArticleModal

