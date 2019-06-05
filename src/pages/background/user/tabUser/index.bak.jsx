/**
 * @author fengyu
 */
import React from 'react'
import { Table, Switch, Button, Modal, Input, message, Form, Select } from 'antd'
// import { getUserList, postUser, deleteUser } from '../../modules/userManage'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import OperatorIcons from '@/components/shared/OperatorIcon'
import Pagination from '@/components/shared/Pagination'
import HeaderBar from '@/components/shared/HeaderBar'
import { deleteConfirm, deleteBatchConfirm, removeArr } from 'components/shared/Confirm'
import { REGEXP_MAIL, REGEXP_YD_PHONE, REGEXP_GD_PHONE, passwordValidate, noSpecialChar } from '@/utils/validator'
import './index.less'

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 7 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 12 },
  },
}

const FormItem = Form.Item
const Option = Select.Option

@Form.create()
@connect(
  state => ({
    userList: [],
    loading: true,
    currentUser: [state],
  }),
  dispatch => bindActionCreators({
    // getUserList,
    // postUser,
    // deleteUser,
    // fetSelectData,
  }, dispatch),
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
    this.getUserList()
  }

  // 操作员类型用户，无增删改用户权限
  getCurrentUserAuth = () => {
    const { type } = this.props.currentUser
    if (Number(type) === 0) {
      return true
    } else {
      message.error('没有操作权限')
      return false
    }
  }

  // 获取用户列表
  getUserList = () => {
    // const { currentPage, pageSize } = this.state
    // this.props.getUserList({
    //   current: currentPage,
    //   size: pageSize,
    // })
  }

  // 添加或编辑用户
  postUser = () => {
    // const { getFieldsValue } = this.props.form
    // const { userType, userName, password, confirm: confirmPassword, mail, phone } = getFieldsValue()
    // const divisionValue = this.state.divisionValue
    // if (password && password !== confirmPassword) {
    //   message.error('登录密码与确认密码不一致')
    //   return
    // }
    // let code = ''
    // for (let i = 2; i >= 0; i--) {
    //   if (divisionValue && divisionValue[i] && divisionValue[i].selected) {
    //     code = divisionValue[i].code
    //     break
    //   }
    // }
    // const id = this.editData.id
    // this.props.postUser({
    //   id,
    //   type: userType,
    //   name: userName,
    //   password: password || '',
    //   xzqhdm: code,
    //   mail: mail || '',
    //   phone: phone || '',
    // }).then((res) => {
    //   if (res instanceof Error) return
    //   this.setState({ currentPage: 1 }, this.getUserList)
    //   this.setState({ visible: false })
    //   this.editData = {}
    // })
  }

  // 删除用户
  deleteUser = () => {
    // const { currentPage, pageSize } = this.state
    // this.props.deleteUser({
    //   current: currentPage,
    //   size: pageSize,
    // })
  }

  editHandler = (record) => {
    const auth = this.getCurrentUserAuth()
    if (auth === false) {
      return
    }
    this.editData = record
    const { type, name, mail, phone } = record
    this.props.form.setFieldsValue({
      userType: type,
      userName: name,
      mail,
      phone,
      password: '',
      confirm: '',
    })
  
    this.setState({
      isEdit: true,
      visible: true,
    });
  }

  addHandler = () => {
    const auth = this.getCurrentUserAuth()
    if (auth === false) {
      return
    }
    this.props.form.resetFields()
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
        this.postUser(isEdit)
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
    disabled: record.name === 'system',
    name: record.name,
  })

  /** 批量删除 */
  batchDelete = () => {
    const auth = this.getCurrentUserAuth()
    if (auth === false) {
      return
    }
    const { selectedRowKeys } = this.state;
    deleteBatchConfirm(selectedRowKeys, () => this.deleteData(selectedRowKeys))
  }

  /** 删除弹框 */
  showConfirm = (id) => {
    const auth = this.getCurrentUserAuth()
    if (auth === false) {
      return
    }
    deleteConfirm(() => this.deleteData(id))
  }

  /** 删除数据方法 */
  deleteData = (id) => {
    let idArr = []
    id instanceof Array ? idArr = id : idArr.push(id)
    this.props.deleteUser({
      ids: idArr,
    }).then((res) => {
      if (res instanceof Error) return
      message.success('删除成功', 1, () => {
        this.getUserList()
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
    const { isEdit } = this.state

    const testData = [
      {name: 'admin', role: '管理员', mail: '280784436@qq.com', 'last_login_time': '2019-05-12 13:48'},
      {name: 'admin2', role: '普通用户', mail: '222299999@qq.com', 'last_login_time': '2019-05-19 08:51'},
      {name: 'system', role: '管理员', mail: '280784436@qq.com', 'last_login_time': '2019-05-12 13:48'},
    ]

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
        dataIndex: 'name',
        key: 'name',
      }, {
        title: '角色',
        dataIndex: 'role',
        key: 'role',
      }, {
        title: '邮箱',
        dataIndex: 'mail',
        key: 'mail',
      }, {
        title: '最近登录时间',
        dataIndex: 'last_login_time',
        key: 'last_login_time',
      }, {
        title: '禁用/启用',
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
          record.name === 'system' ?
            <OperatorIcons>
              <OperatorIcons.Icon title="编辑" type="edit" onClick={() => this.editHandler(record)} />
            </OperatorIcons> :
            <OperatorIcons>
              <OperatorIcons.Icon title="编辑" type="edit" onClick={() => this.editHandler(record)} />
              <OperatorIcons.Icon title="删除" type="delete" onClick={() => this.showConfirm(record.id)} />
            </OperatorIcons>
        ),
      }]

    const {
      visible,
      currentPage,
      pageSize,
      selectedRowKeys,
      userList,
    } = this.state

    const { loading } = this.props
    const { getFieldDecorator } = this.props.form

    let records = []
    let total = 0
    if (Object.keys(userList)) {
      records = userList.records
      total = userList.total
    }

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
            // loading={loading}
            columns={columns}
            // dataSource={records}
            dataSource={testData}
            rowKey={record => record.id}
            pagination={false}
          />
          <Pagination
            current={currentPage}
            pageSize={pageSize}
            pageSizeOptions={['5', '10', '15', '20']}
            total={total}
            onChange={this.changePage}
            onShowSizeChange={this.onShowSizeChange}
          />
          <Modal
            title={isEdit ? '用户管理-编辑' : '用户管理-添加'}
            visible={visible}
            width={560}
            maskClosable={false}
            onCancel={this.onCancel}
            onOk={() => this.onOk(isEdit)}
            className="userModalSty"
          >
            <div style={{ position: 'relative', paddingLeft: '38px' }}>
              <FormItem
                label="用户类型"
                {...formItemLayout}
                className="form-item"
                style={{ marginBottom: '14px' }}
              >
                {getFieldDecorator('userType', {
                  rules: [{
                    type: 'number',
                    required: true,
                    message: '请选择用户类型!',
                    whitespace: true,
                  }],
                })(
                  <Select
                    placeholder="请选择"
                    style={{ width: '224px' }}
                    disabled={isEdit && this.editData.name === 'system'}
                  >
                    <Option value={0}>管理员</Option>
                    <Option value={1}>操作员</Option>
                  </Select>,
                )}
              </FormItem>
              <FormItem
                label="用户姓名"
                {...formItemLayout}
                style={{ marginBottom: '14px' }}
              >
                {getFieldDecorator('userName', {
                  rules: [{
                    required: true,
                    message: '请输入用户姓名',
                    whitespace: true,
                  }, {
                    message: '不能超过50个字符',
                    max: 50,
                  }, noSpecialChar],
                })(
                  <Input
                    type="text"
                    style={{ width: '224px' }}
                    disabled={isEdit && this.editData.name === 'system'}
                  />,
                )}
              </FormItem>
              <FormItem
                label="登录密码"
                {...formItemLayout}
                style={{ marginBottom: '14px' }}
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
                  <Input type="password" style={{ width: '224px' }} />,
                )}
              </FormItem>
              <FormItem
                label="确认密码"
                {...formItemLayout}
                style={{ marginBottom: '14px' }}
              >
                {getFieldDecorator('confirm', {
                  rules: [
                    { required: !isEdit, message: '请确认密码' },
                    { validator: this.compareToFirstPassword },
                  ],
                  initialValue: '',
                })(
                  <Input type="password" style={{ width: '224px' }} onBlur={this.handleConfirmBlur} />,
                )}
              </FormItem>
              <FormItem
                label="电子邮箱"
                {...formItemLayout}
                style={{ marginBottom: '14px' }}
              >
                {getFieldDecorator('mail', {
                  rules: [
                    { pattern: new RegExp(REGEXP_MAIL), message: '请输入正确电子邮件' },
                  ],
                  initialValue: '',
                })(
                  <Input type="text" style={{ width: '224px' }} maxLength="200" />,
                )}
              </FormItem>
              <FormItem
                label="联系电话"
                {...formItemLayout}
                style={{ marginBottom: '14px' }}
              >
                {getFieldDecorator('phone', {
                  rules: [{
                    pattern: REGEXP_YD_PHONE || REGEXP_GD_PHONE,
                    message: '请输入11位手机号码或固定电话（区号-电话，如010-88888888）',
                  }],
                  initialValue: '',
                })(
                  <Input type="text" style={{ width: '224px' }} />,
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
