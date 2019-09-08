import React from 'react'
import { connect } from 'react-redux'
import { Modal, Form, Select, Input, Radio } from 'antd'
import { noSpecialChar } from '@/utils/validator'
import '../style/NodeModal.less'

const FormItem = Form.Item
const Option = Select.Option
const RadioGroup = Radio.Group

const formItemLayout = {
  labelCol: { span: 4, offset: 0 },
  wrapperCol: { span: 20, offset: 0 },
}

@Form.create()
@connect(
  state => ({
    categoryList: state.category.categoryList,
  }),
  null,
  null,
  { forwardRef: true },
)

class NodeModal extends React.Component {
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

  getRecord(record) {
    const { categoryList } = this.props
    const category = categoryList.list.find(item => item.id === record.category_id)
    this.setState({
      article: record,
      categoryName: category.name,
    })
  }

  render() {
    const { visible, onCancel } = this.props
    // const {} = this.state
    const { getFieldDecorator } = this.props.form

    return (
      <Modal
        width={760}
        visible={visible}
        onCancel={onCancel}
        title={'添加节点'}
        maskClosable={false}
      >
        <div>
          <FormItem
            label="分组"
            {...formItemLayout}
          >
            {getFieldDecorator('group', {
              rules: [{
                required: true,
                message: '请选择分组',
                whitespace: true,
                type: 'number',
              }],
            })(
              <Select placeholder="请选择分组" style={{ width: 360 }}>
                <Option key={1} value={1}>顶级</Option>
                <Option key={2} value={2}>--文章管理</Option>
                <Option key={21} value={2}>----原创文章</Option>
                <Option key={22} value={2}>----转载文章</Option>
                <Option key={3} value={3}>--分类管理</Option>
                <Option key={4} value={4}>--标签管理</Option>
                <Option key={5} value={5}>--账号管理</Option>
              </Select>
            )}
          </FormItem>
          <FormItem
            label="父级"
            {...formItemLayout}
          >
            {getFieldDecorator('parent', {
              rules: [{
                required: true,
                message: '请选择父级',
                whitespace: true,
                type: 'number',
              }],
            })(
              <Select placeholder="请选择父级" style={{ width: 360 }}>
                <Option key={1} value={1}>顶级</Option>
                <Option key={2} value={2}>--原创文章</Option>
                <Option key={3} value={3}>--转载文章</Option>
                <Option key={4} value={4}>--标签</Option>
                <Option key={5} value={5}>--账号</Option>
              </Select>
            )}
          </FormItem>
          <FormItem
            label="名称"
            {...formItemLayout}
          >
            {getFieldDecorator('name', {
              rules: [{
                required: true,
                message: '请输入分类名称',
                whitespace: true,
              }, {
                message: '不能超过50个字符',
                max: 50,
              }, noSpecialChar],
            })(
              <Input
                type="text"
                style={{ width: 360 }}
              />,
            )}
          </FormItem>
          <FormItem
            label="节点"
            {...formItemLayout}
          >
            {getFieldDecorator('node', {
              rules: [{
                required: true,
                message: '请输入节点',
                whitespace: true,
              }, {
                message: '不能超过50个字符',
                max: 50,
              }, noSpecialChar],
            })(
              <Input
                type="text"
                style={{ width: 360 }}
              />,
            )}
          </FormItem>
          <FormItem
            label='菜单'
            {...formItemLayout}
          >
            {getFieldDecorator('menu', {
              rules: [{
                required: true,
                message: '请选择是否为菜单',
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
          <FormItem
            label='状态'
            {...formItemLayout}
          >
            {getFieldDecorator('menu', {
              rules: [{
                required: true,
                message: '请选择是否为菜单',
                whitespace: true,
                type: 'number',
              }],
            })(
              <RadioGroup
                onChange={this.onTypeChange}
              >
                <Radio value={1}>正常</Radio>
                <Radio value={0}>禁用</Radio>
              </RadioGroup>,
            )}
          </FormItem>
        </div>
      </Modal>
    )
  }
}

export default NodeModal

