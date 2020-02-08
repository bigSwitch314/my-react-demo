import { Form, Input, Modal, Radio, Select } from 'antd'
import React from 'react'
import { connect } from 'react-redux'
import { noSpecialChar, REGEXP_URL } from '@/utils/validator'

import { addOpenSourceProject, editOpenSourceProject } from '@/modules/openSourceProject'

const FormItem = Form.Item
const RadioGroup = Radio.Group

const formItemLayout = {
  labelCol: { span: 3, offset: 0 },
  wrapperCol: { span: 21, offset: 0 },
}

const Option = Select.Option
const { TextArea } = Input

@Form.create()
@connect(
  state => ({
    categoryList: state.category.categoryList,
  }),
  { addOpenSourceProject, editOpenSourceProject },
  null,
  { forwardRef: true },
)

class ProjectModal extends React.Component {
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
        name: editData.name,
        level: editData.level,
        url: editData.url,
        version: editData.version,
        introduction: editData.introduction,
        release: editData.release,
      })
      this.setState({ editData })
    } else {
      setFieldsValue({
        name: '',
        level: '',
        url: '',
        version: '',
        release: 0,
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

  showEditor() {
    this.setState({ editorVisible: true })
  }

  handleEditorExit() {
    this.setState({ editorVisible: false })
  }

  onOk() {
    const { validateFieldsAndScroll, getFieldsValue } = this.props.form
    const { addOpenSourceProject, isEdit, editOpenSourceProject } = this.props
    validateFieldsAndScroll((err) => {
      const { editData } = this.state
      if (!err) {
        const { name, level, url, version, introduction, release } = getFieldsValue()
        const param = {
          name,
          level,
          url,
          version,
          introduction,
          release,
        }

        if(isEdit) {
          param.id = editData.id
          editOpenSourceProject(param).then((res) => {
            if (res instanceof Error) return
            this.props.onOk()
          })
        } else {
          addOpenSourceProject(param).then((res) => {
            if (res instanceof Error) return
            this.props.onOk()
          })
        }
      }
    })
  }

  render() {
    const { visible, onCancel, isEdit } = this.props
    const { getFieldDecorator } = this.props.form

    return (
      <React.Fragment>
        {/* 编辑文章弹窗 */}
        <Modal
          width={740}
          title={isEdit ? '编辑项目' : '添加项目'}
          visible={visible}
          onOk={() => this.onOk()}
          onCancel={onCancel}
          okText='保存'
        >
          <FormItem
            label="名称"
            {...formItemLayout}
          >
            {getFieldDecorator('name', {
              rules: [{
                required: true,
                message: '请输入项目名称',
                whitespace: true,
              }, {
                message: '不能超过50个字符',
                max: 50,
              }, noSpecialChar],
            })(
              <Input
                type="text"
                style={{ width: 360 }}
                maxLength={32}
              />,
            )}
          </FormItem>
          <FormItem
            label="级别"
            {...formItemLayout}
          >
            {getFieldDecorator('level', {
              rules: [{
                required: true,
                message: '请选择项目级别',
                whitespace: true,
                type: 'number',
              }],
            })(
              <Select placeholder="请选择项目级别" style={{ width: 360 }}>
                <Option key={1} value={1}>系统</Option>
                <Option key={2} value={2}>插件</Option>
                <Option key={3} value={3}>组件</Option>
              </Select>
            )}
          </FormItem>
          <FormItem
            label="地址"
            {...formItemLayout}
          >
            {getFieldDecorator('url', {
              rules: [{
                required: true,
                message: '请输入项目地址',
                whitespace: true,
              }, {
                message: '不能超过50个字符',
                max: 50,
              }, {
                pattern: REGEXP_URL,
                message: '请输入正确url',
              }],
            })(
              <Input
                type="text"
                style={{ width: 360 }}
                maxLength={32}
              />,
            )}
          </FormItem>
          <FormItem
            label="版本"
            {...formItemLayout}
          >
            {getFieldDecorator('version', {
              rules: [{
                required: true,
                message: '请输入项目版本',
                whitespace: true,
              }, {
                message: '不能超过50个字符',
                max: 50,
              }, noSpecialChar],
            })(
              <Input
                type="text"
                style={{ width: 360 }}
                maxLength={8}
              />,
            )}
          </FormItem>
          <FormItem
            label="简介"
            {...formItemLayout}
          >
            {getFieldDecorator('introduction', {
              rules: [{
                message: '请输入项目简介',
                whitespace: true,
              }, {
                message: '不能超过300个字符',
                max: 300,
              }],
            })(
              <TextArea
                type="text"
                style={{ width: 560 }}
                rows={6}
              />,
            )}
          </FormItem>
          <FormItem
            label='发布'
            {...formItemLayout}
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
        </Modal>
      </React.Fragment>
    )
  }
}

export default ProjectModal

