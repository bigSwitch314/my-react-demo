import React from 'react'
import { connect } from 'react-redux'
import { Modal, Form, Select, Input, Radio, Message } from 'antd'
import { noSpecialChar } from '@/utils/validator'
import { getMenuList } from '@/modules/menu'
import { addNode, editNode } from '@/modules/node'
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
    menuList: state.menu.menuList,
    levelOneNode: state.node.levelOneNode,
  }),
  {
    getMenuList,
    addNode,
    editNode,
  },
  null,
  { forwardRef: true },
)

class NodeModal extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      menuList: [],
      menuTree: [],
      nameArr: [],
      isEdit: false,
      editData: [],
    }
  }

  static getDerivedStateFromProps(props, state) {
    const { menuList={}} = props
    if (menuList.list!== state.menuList) {
      return {
        menuList: menuList.list,
        menuTree: menuList.tree,
      }
    }

    return null
  }

  componentDidMount() {
    this.getMenuList()
  }

  // 获取菜单列表
  getMenuList = () => {
    this.props.getMenuList({})
  }

  setFieldsValue = (isEdit, editData) => {
    const { menuTree } = this.state
    const { setFieldsValue } = this.props.form
    if(isEdit) {
      setFieldsValue({
        name: editData.menu ? editData.menu_id : editData.name,
        parent: editData.pid,
        node: editData.node,
        status: editData.status,
        menu: editData.menu,
        group: editData.group_id,
      })

      const node = menuTree.find(item => {
        return item.id === editData.group_id
      })
      this.setState({
        editData,
        isEdit,
        nameArr: node && node.children || [],
      })
    } else {
      const { selectedRowKeys, levelOneNode } = this.props
      let parent = null
      if (selectedRowKeys.length === 1) {
        const key = selectedRowKeys[0]
        const node = levelOneNode.find(item => item.id === key)
        if (node) parent = key
      }
      this.setState({ isEdit }, () => setFieldsValue({
        name: null,
        parent: parent,
        node: null,
        status: 1,
        menu: parent ? 0 : 1,
        group: parent ? -1 : null,
      }))
    }
  }

  onOk = (isEdit) => {
    this.props.form.validateFieldsAndScroll((err) => {
      if (!err) {
        this.addNode(isEdit)
      }
    })
  }

  onCancel = () => {
    const { onCancel } = this.props
    onCancel()
    this.setState({
      nameArr: [],
    })
  }

  // 添加或编辑分类
  addNode = (isEdit) => {
    const { menuList } = this.state
    const { getFieldsValue } = this.props.form
    const { group, parent, node, name, menu, status } = getFieldsValue()
    let newName = name
    if (menu) {
      newName = menuList.find(item => item.id === name).name
    }

    const param = {
      name: newName,
      pid: parent,
      node,
      status,
      menu,
      menu_id: menu ? name : 0,
      group_id: group,
    }

    if(isEdit) {
      const { editData } = this.state
      param.id = editData.id
      this.props.editNode(param).then((res) => {
        if (res instanceof Error) return
        Message.success('修改成功', 1, () => {
          this.props.onOk()
          this.setState({
            isEdit: false,
            editData: {},
            nameArr: [],
          })
        })
      })
    } else {
      this.props.addNode(param).then((res) => {
        if (res instanceof Error) return
        Message.success('添加成功', 1, () => {
          this.props.onOk()
          this.setState({
            nameArr: [],
          })
        })
      })
    }
  }

  // 分组下拉值改变处理函数
  onParentChange = (value) => {
    const { setFieldsValue } = this.props.form
    if (value !== 0) {
      setFieldsValue({
        group: -1,
        menu: 0,
      })
    }
  }

  // 分组下拉值改变处理函数
  onGroupChange = (value) => {
    const { setFieldsValue } = this.props.form
    if (value === -1) {
      setFieldsValue({ menu: 0 })
      return
    }

    const { menuTree } = this.state
    const node = menuTree.find(item => {
      return item.id === value
    })
    this.setState({ nameArr: node.children})
  }

  // 名称下拉值改变处理函数
  onNameChange = (value) => {
    const { setFieldsValue } = this.props.form
    setFieldsValue({ name: value })
  }

  render() {
    const { visible, levelOneNode=[] } = this.props
    const { isEdit, menuList, nameArr } = this.state
    const { getFieldDecorator, getFieldsValue } = this.props.form
    const { group, menu, parent } = getFieldsValue()

    return (
      <Modal
        width={760}
        visible={visible}
        onCancel={() => this.onCancel()}
        onOk={() => this.onOk(isEdit)}
        title={'添加节点'}
        maskClosable={false}
      >
        <div>
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
              <Select
                onChange={(value) => this.onParentChange(value)}
                style={{ width: 360 }}
                disabled={isEdit}
              >
                <Option key={0} value={0}>顶级</Option>
                {levelOneNode && levelOneNode.map(item => (
                  <Option key={item.id} value={item.id}>{item.name}</Option>
                ))}
              </Select>
            )}
          </FormItem>
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
              <Select
                placeholder="请选择分组"
                style={{ width: 360 }}
                onChange={(value) => this.onGroupChange(value)}
              >
                <Option key={-1} value={-1} disabled={parent === 0}>无</Option>
                {menuList && menuList.filter(item => item.pid === 0).map(item => (
                  <Option key={item.id} value={item.id} disabled={parent !== 0}>{item.name}</Option>
                ))}
              </Select>
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
                disabled={group === -1}
              >
                <Radio value={1}>是</Radio>
                <Radio value={0}>否</Radio>
              </RadioGroup>,
            )}
          </FormItem>
          <FormItem
            label="名称"
            {...formItemLayout}
          >
            {menu ?
              getFieldDecorator('name', {
                rules: [{
                  required: true,
                  message: '请选择名称',
                  whitespace: true,
                  type: 'number',
                }],
              })(
                <Select style={{ width: 360 }}>
                  {nameArr && nameArr.map(item => (
                    <Option key={item.id} value={item.id}>{item.name}</Option>
                  ))}
                </Select>) :
              getFieldDecorator('name', {
                rules: [{
                  required: true,
                  message: '请输入名称',
                  whitespace: true,
                }, {
                  message: '不能超过50个字符',
                  max: 50,
                }, noSpecialChar],
              })(
                <Input
                  type="text"
                  style={{ width: 360 }}
                />
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
            label='状态'
            {...formItemLayout}
          >
            {getFieldDecorator('status', {
              rules: [{
                required: true,
                message: '请选择菜单状态',
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

