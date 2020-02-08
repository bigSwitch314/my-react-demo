import { Checkbox, Col, Form, Input, Modal, Radio, Row, message } from 'antd';
import React from 'react';
import { connect } from 'react-redux';
import Editor from '@/components/markdown';
import '@/components/markdown/editor/index.less';
import handleCode from '@/components/markdown/helpers/handelCode';
import marked from '@/components/markdown/helpers/marked';
import { addArticle, editArticle } from '@/modules/article';
import { fadeIn, fadeOut } from '@/utils/common'
import '../style/ArticleModal.less';

const FormItem = Form.Item
const RadioGroup = Radio.Group
const CheckboxGroup = Checkbox.Group

const formItemLayout = {
  labelCol: {
    sm: { span: 2 },
  },
  wrapperCol: {
    sm: { span: 12 },
  },
}

const formItemLayoutRadio = {
  labelCol: {
    sm: { span: 2 },
  },
  wrapperCol: {
    sm: { span: 20 },
  },
}

const formItemLayoutContent = {
  labelCol: {
    sm: { span: 2 },
  },
  wrapperCol: {
    sm: { span: 21 },
  },
}

@Form.create()
@connect(
  state => ({
    categoryList: state.category.categoryList,
    labelList: state.label.labelList,
  }),
  { addArticle, editArticle },
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
        category: editData.category_id,
        label: editData.label_ids,
        title: editData.title,
        release: editData.release,
      })
      this.setState({
        htmlValue: marked(editData.content_md),
        editorValue: editData.content_md,
        editData,
      })
    } else {
      setFieldsValue({
        category: undefined,
        label: [],
        title: '',
        release: 0,
      })
      this.setState({
        htmlValue: '',
        editorValue: '',
      })
    }
  }

  onRadioChange = (e) => {
    console.log('radio checked', e.target.value);
    this.setState({
      value: e.target.value,
    });
  }

  onLabelChange = (checkedValue) => {
    if (checkedValue.length>4) {
      message.warning('标签不能多于4个')
      checkedValue.pop()
    }

    this.props.form.setFieldsValue({
      label: checkedValue,
    })
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
      fadeOut('content-message')
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
    const { addArticle, isEdit, editArticle } = this.props
    validateFieldsAndScroll((err) => {
      const { htmlValue, editorValue, editData } = this.state
      if (!err) {
        if(!htmlValue) {
          this.setState({ hasContentMessage: true })
          fadeIn('content-message')
          return
        }

        // 保存文章
        const { title, category, label, release } = getFieldsValue()
        const param = {
          title,
          category_id: category,
          label_ids: label.join(','),
          content_md: editorValue,
          content_html: 'not_has_html',
          release,
          type: 1,
        }

        if(isEdit) {
          param.id = editData.id
          editArticle(param).then((res) => {
            if (res instanceof Error) { return }
            this.props.onOk()
            this.setState({ htmlValue: null })
          })
        } else {
          addArticle(param).then((res) => {
            if (res instanceof Error) { return }
            this.props.onOk()
            this.setState({ htmlValue: null })
          })
        }
      } else {
        if (!htmlValue) {
          this.setState({ hasContentMessage: true })
          fadeIn('content-message')
          return
        }
      }
    })
  }

  onCancel() {
    this.setState({ hasContentMessage: false })
    fadeOut('content-message')
    this.props.onCancel()
  }

  render() {
    const { editorValue, editorVisible, htmlValue, hasContentMessage } = this.state
    const { visible, categoryList, labelList, isEdit } = this.props
    const { getFieldDecorator } = this.props.form

    let CategoryOptions = []
    if(categoryList && categoryList.list) {
      CategoryOptions = categoryList.list
    }

    let labelOptions = []
    if(labelList && labelList.list) {
      labelOptions = labelList.list
    }

    return (
      <React.Fragment>
        {/* 编辑文章弹窗 */}
        <Modal
          width={920}
          title={isEdit ? '编辑文章' : '添加文章'}
          visible={visible}
          onOk={() => this.onOk()}
          onCancel={() => this.onCancel()}
          okText='保存'
        >
          <div className='article-modal'>
            <FormItem
              label='标题'
              {...formItemLayout}
            >
              {getFieldDecorator('title', {
                rules: [{
                  required: true,
                  message: '请输入标题',
                  whitespace: true,
                }, {
                  // validator: this.validateOldPassword,
                }],
              })(
                <Input maxLength={26}/>,
              )}
            </FormItem>
            <FormItem
              label='分类'
              {...formItemLayoutRadio}
            >
              {getFieldDecorator('category', {
                rules: [{
                  required: true,
                  message: '请选择分类',
                  whitespace: true,
                  type: 'number',
                }],
              })(
                <RadioGroup onChange={this.onRadioChange}>
                  <Row>
                    {CategoryOptions.map(item => (
                      <Col key={item.id} span={4} style={{ height: 30 }}>
                        <Radio value={item.id}>{item.name}</Radio>
                      </Col>
                    ))}
                  </Row>
                </RadioGroup>,
              )}
            </FormItem>
            <FormItem
              label='标签'
              {...formItemLayoutRadio}
            >
              {getFieldDecorator('label', {
                rules: [{
                  required: false,
                }],
              })(
                <CheckboxGroup
                  onChange={this.onLabelChange}
                >
                  <Row>
                    {labelOptions.map(item => (
                      <Col key={item.id} span={4} style={{ height: 30 }}>
                        <Checkbox value={item.id}>
                          {item.name}
                        </Checkbox>
                      </Col>
                    ))}
                  </Row>
                </CheckboxGroup>,
              )}
            </FormItem>
            <FormItem
              label='发布'
              {...formItemLayoutRadio}
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
            <span id='content-message' className='content-message'>请输入内容</span>
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