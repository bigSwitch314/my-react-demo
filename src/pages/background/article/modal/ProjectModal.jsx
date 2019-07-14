import { Form, Input, Modal, Radio, } from 'antd';
import React from 'react';
import { connect } from 'react-redux';
import { addArticle, editArticle } from '@/modules/article';
import '../style/ArticleModal.less';

const FormItem = Form.Item
const RadioGroup = Radio.Group

const formItemLayout = {
  labelCol: {
    sm: { span: 2 },
  },
  wrapperCol: {
    sm: { span: 20 },
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
      this.setState({ htmlValue: '' })
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
          return
        }
      }
    })
  }

  render() {
    const { editorValue, editorVisible } = this.state
    const { visible, onCancel, isEdit } = this.props
    const { getFieldDecorator } = this.props.form

    return (
      <React.Fragment>
        {/* 编辑文章弹窗 */}
        <Modal
          width={920}
          title={isEdit ? '编辑项目' : '添加项目'}
          visible={visible}
          onOk={() => this.onOk()}
          onCancel={onCancel}
          okText='保存'
        >
          <div className='article-modal'>
            <FormItem
              label='项目名称'
              {...formItemLayout}
            >
              {getFieldDecorator('name', {
                rules: [{
                  required: true,
                  message: '请输入项目名称',
                  whitespace: true,
                }, {
                  // validator: this.validateOldPassword,
                }],
              })(
                <Input style={{ width: 30}}/>,
              )}
            </FormItem>
            <FormItem
              label='开源'
              {...formItemLayoutRadio}
            >
              {getFieldDecorator('openSource', {
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
          </div>
        </Modal>
      </React.Fragment>
    )
  }
}

// export default Form.create()(ArticleModal)
export default ArticleModal

