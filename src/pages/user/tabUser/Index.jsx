import React from 'react'
import { Table, Switch, Button, Modal, Input, message, Form, Checkbox, Col, Row, Radio } from 'antd'
import { addUser, getUserList, changeStatus, deleteUser, editUser } from '@/modules/user'
import { getAllRole } from '@/modules/role'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import OperatorIcons from '@/components/shared/OperatorIcon'
import Pagination from '@/components/shared/Pagination'
import HeaderBar from '@/components/shared/HeaderBar'
import { deleteConfirm, deleteBatchConfirm, removeArr } from 'components/shared/Confirm'
import { noSpecialChar, passwordValidate, REGEXP_MAIL } from '@/utils/validator'
import { removeLogin } from '@/components/Authentication/util'
import './Index.less'

const CheckboxGroup = Checkbox.Group
const RadioGroup = Radio.Group

const formItemLayout = {
  labelCol: { span: 4, offset: 0 },
  wrapperCol: { span: 20, offset: 0 },
}

const FormItem = Form.Item

@Form.create()
@connect(
  state => ({
    userList: state.user.userList,
    allRole: state.role.allRole,
    loading: state.loading['user/getUserList'],
    currentUser: [state],
  }),
  dispatch => bindActionCreators({
    getUserList,
    addUser,
    editUser,
    changeStatus,
    deleteUser,
    getAllRole,
  }, dispatch),
  null,
  { forwardRef: true },
)


class UserList extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      isEdit: false,
      visible: false,
      userList: {},
      currentPage: 1,
      pageSize: 5,
      selectedRowKeys: [],
      confirmDirty: false,
      divisionValue: [],
    }
    this.editData = {}
  }

  static getDerivedStateFromProps(props, state) {
    if (props.userList !== state.userList) {
      return { userList: props.userList }
    }

    return null
  }

  componentDidMount() {
    this.getAllRole()
  }

  // 获取全部角色22
  getAllRole = () => {
    this.props.getAllRole({
      page_no: 1,
      page_size: 100,
    })
  }

  // 获取用户列表
  getUserList = () => {
    const { currentPage, pageSize } = this.state
    this.props.getUserList({
      page_no: currentPage,
      page_size: pageSize,
    })
  }

  // 添加或编辑用户
  addUser = (isEdit) => {
    const { getFieldsValue } = this.props.form
    const { userName, password, confirm: confirmPassword, mail, role, status } = getFieldsValue()
    if (password && password !== confirmPassword) {
      message.error('登录密码与确认密码不一致')
      return
    }

    const param = {
      username: userName,
      password,
      email: mail,
      roles: role,
      status,
    }

    if(isEdit) {
      param.id = this.editData.id
      this.props.editUser(param).then((res) => {
        if (res instanceof Error) return
        const userInfo = sessionStorage.getItem('userInfo')
        const { userId } = JSON.parse(userInfo)
        const msg = userId === param.id ? '，请重新登录' : ''

        message.success('修改成功' + msg, 1, () => {
          this.setState({ currentPage: 1 }, this.getUserList)
          this.setState({ visible: false })
          this.editData = {}
          this.props.onChange()
          if (userId === param.id) {
            removeLogin()
            window.location.reload()
          }
        })
      })
    } else {
      this.props.addUser(param).then((res) => {
        if (res instanceof Error) return
        message.success('添加成功', 1, () => {
          this.setState({ currentPage: 1 }, this.getUserList)
          this.setState({ visible: false })
          this.props.onChange()
        })
      })
    }
  }

  editHandler = (record) => {
    this.editData = record
    const { username: userName, email: mail, roles, status } = record
    const role_ids = roles.map(item => item.id)

    this.props.form.setFieldsValue({
      userName,
      password: null,
      confirm: null,
      mail,
      role: role_ids,
      status,
    })

    this.setState({
      isEdit: true,
      visible: true,
    });
  }

  addHandler = () => {
    const { resetFields, setFieldsValue } = this.props.form
    resetFields()
    setFieldsValue({ status: 1 })

    this.setState({
      isEdit: false,
      visible: true,
      divisionValue: [],
    })
  }

  onCancel = () => {
    this.setState({ visible: false })
    this.editData = {}
  }

  onOk = (isEdit) => {
    this.props.form.validateFieldsAndScroll((err) => {
      if (!err) {
        this.addUser(isEdit)
      }
    })
  }

  /** 表格分頁 */
  changePage = (currentPage, pageSize) => {
    this.setState({ currentPage, pageSize }, this.getUserList)
  }

  onShowSizeChange = (currentPage, pageSize) => {
    this.setState({ currentPage: 1, pageSize }, this.getUserList)
  }

  /** 表格复选框选中 */
  onSelectChange = (selectedRowKeys) => {
    this.setState({
      selectedRowKeys,
    })
  }

  getCheckboxProps = record => ({
    disabled: record.username === 'system',
    name: record.username,
  })

  changeSwitchStatus = (checked, record) => {
    this.props.changeStatus({
      id: record.id,
      status: Number(checked),
    }).then(res => {
      if (res instanceof Error) return
      this.getUserList()
    })
  }

  /** 批量删除 */
  batchDelete = () => {
    const { selectedRowKeys } = this.state;
    deleteBatchConfirm(selectedRowKeys, () => this.deleteData(selectedRowKeys))
  }

  /** 删除弹框 */
  showConfirm = (id) => {
    deleteConfirm(() => this.deleteData(id))
  }

  /** 删除数据方法 */
  deleteData = (id) => {
    let idArr = []
    id instanceof Array ? idArr = id : idArr.push(id)
    this.props.deleteUser({
      id: idArr.join(','),
    }).then((res) => {
      if (res instanceof Error) return
      message.success('删除成功', 1, () => {
        const { currentPage, pageSize, userList = {} } = this.state
        const totalPage = Math.ceil((userList.count - idArr.length) / pageSize)
        if (currentPage > totalPage) {
          this.setState({ currentPage: 1 }, () => {
            this.getUserList()
          })
        } else {
          this.getUserList()
        }
        this.props.onChange()
      })
      const selectedRowKeys = removeArr(this.state.selectedRowKeys, id)
      this.setState({ selectedRowKeys })
    })
  }

  validateToNextPassword = (rule, value, callback) => {
    const form = this.props.form;
    if (value && this.state.confirmDirty) {
      form.validateFields(['confirm'], { force: true });
    }
    callback();
  }

  compareToFirstPassword = (rule, value, callback) => {
    const form = this.props.form;
    if (value && value !== form.getFieldValue('password')) {
      callback('密码必须一致!');
    } else {
      callback();
    }
  }

  handleConfirmBlur = (e) => {
    const value = e.target.value;
    this.setState({ confirmDirty: this.state.confirmDirty || !!value });
  }

  divisionChange = (divisionList) => {
    this.setState({
      divisionValue: divisionList,
    })
  }

  render() {
    const {
      visible,
      currentPage,
      pageSize,
      selectedRowKeys,
      isEdit,
    } = this.state

    const { userList, loading, allRole } = this.props
    const { getFieldDecorator } = this.props.form

    const columns = [
      {
        title: '序号',
        key: 'xuhao',
        render(text, record, index) {
          return (
            <span>{(currentPage - 1) * pageSize + index + 1}</span>
          )
        },
      }, {
        title: '姓名',
        dataIndex: 'username',
        key: 'name',
      }, {
        title: '角色',
        dataIndex: 'roles',
        key: 'role',
        render: (text, record) => {
          if (!record.roles) return
          const role = record.roles.map(item => item.name)
          const content = role.length ? role.join(', ') : '暂无'
          return (
            <div style={{ wordWrap: 'break-word', wordBreak: 'break-word' }}>
              {content}
            </div>
          )
        },
      }, {
        title: '邮箱',
        dataIndex: 'email',
        key: 'mail',
        render: (text) => (
          <div style={{ wordWrap: 'break-word', wordBreak: 'break-word' }}>
            {text}
          </div>
        ),
      }, {
        title: '最近登录时间',
        dataIndex: 'last_login_time',
        key: 'last_login_time',
        width: 160,
      }, {
        title: '启用/禁用',
        dataIndex: 'status',
        render: (text, record) => (
          <Switch
            checked={!!record.status}
            onChange={(checked) => this.changeSwitchStatus(checked, record)}
          />
        ),
      }, {
        title: '操作',
        dataIndex: 'operation',
        key: 'operation',
        width: 150,
        render: (text, record) => (
          record.username === 'system' ?
            <OperatorIcons>
              <OperatorIcons.Icon title="编辑" type="edit" onClick={() => this.editHandler(record)} />
            </OperatorIcons> :
            <OperatorIcons>
              <OperatorIcons.Icon title="编辑" type="edit" onClick={() => this.editHandler(record)} />
              <OperatorIcons.Icon title="删除" type="delete" onClick={() => this.showConfirm(record.id)} />
            </OperatorIcons>
        ),
      }]

    return (
      <React.Fragment>
        <div className="content-div">
          <div className="button-group">
            <HeaderBar>
              <HeaderBar.Left>
                <Button type="primary" onClick={this.addHandler}>添加</Button>
                <Button className="button" onClick={this.batchDelete}>批量删除</Button>
              </HeaderBar.Left>
            </HeaderBar>
          </div>
          <Table
            rowSelection={{
              selectedRowKeys,
              onChange: this.onSelectChange,
              getCheckboxProps: this.getCheckboxProps,
            }}
            loading={loading}
            columns={columns}
            dataSource={userList.list || []}
            rowKey={record => record.id}
            pagination={false}
          />
          <Pagination
            current={currentPage}
            pageSize={pageSize}
            pageSizeOptions={['5', '10', '15', '20']}
            total={userList.count || 0}
            onChange={this.changePage}
            onShowSizeChange={this.onShowSizeChange}
          />
          <Modal
            title={isEdit ? '编辑用户' : '添加用户'}
            visible={visible}
            width={740}
            maskClosable={false}
            onCancel={this.onCancel}
            onOk={() => this.onOk(isEdit)}
            className="user-modal"
          >
            <div>
              <FormItem
                label="账号"
                {...formItemLayout}
              >
                {getFieldDecorator('userName', {
                  rules: [{
                    required: true,
                    message: '请输入账号',
                    whitespace: true,
                  }, {
                    message: '不能超过12个字符',
                    max: 12,
                  }, noSpecialChar],
                })(
                  <Input
                    type="text"
                    style={{ width: 360 }}
                    disabled={isEdit && this.editData.username === 'system'}
                    maxLength={12}
                  />,
                )}
              </FormItem>
              <FormItem
                label="登录密码"
                {...formItemLayout}
              >
                {getFieldDecorator('password', {
                  rules: [
                    { required: !isEdit, message: '请输入密码' },
                    { validator: this.validateToNextPassword },
                    { min: 6, max: 16, message: '密码为6-16位' },
                    ...passwordValidate,
                  ],
                  initialValue: '',
                })(
                  <Input type="password" style={{ width: 360 }} />,
                )}
              </FormItem>
              <FormItem
                label="确认密码"
                {...formItemLayout}
              >
                {getFieldDecorator('confirm', {
                  rules: [
                    { required: !isEdit, message: '请确认密码' },
                    { validator: this.compareToFirstPassword },
                  ],
                  initialValue: '',
                })(
                  <Input type="password" style={{ width: 360 }} onBlur={this.handleConfirmBlur} />,
                )}
              </FormItem>
              <FormItem
                label="电子邮箱"
                {...formItemLayout}
              >
                {getFieldDecorator('mail', {
                  rules: [{
                    required: true,
                    message: '请输入账号',
                    whitespace: true,
                  }, {
                    pattern: new RegExp(REGEXP_MAIL),
                    message: '请输入正确电子邮件',
                  }, {
                    message: '不能超过32个字符',
                    max: 32,
                  },
                  ],
                  initialValue: '',
                })(
                  <Input type="text" style={{ width: 360 }} maxLength={32} />,
                )}
              </FormItem>
              <FormItem
                label="角色"
                {...formItemLayout}
                className="role"
              >
                {getFieldDecorator('role', {
                  rules: [{
                    required: false,
                  }],
                })(
                  <CheckboxGroup>
                    <Row>
                      {allRole && allRole.list && allRole.list.map(item => (
                        <Col key={item.id} span={5} style={{ height: 30 }}>
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
                label="是否启用"
                {...formItemLayout}
              >
                {getFieldDecorator('status', {
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
        </div>
      </React.Fragment>
    )
  }
}

export default UserList
