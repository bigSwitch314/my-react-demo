import React from 'react'
import { getAllUser } from '@/modules/user'
import { connect } from 'react-redux'
import { Table, Switch, Button, Modal, Checkbox, Row, Col, message } from 'antd'
import OperatorIcons from '@/components/shared/OperatorIcon'
import Pagination from '@/components/shared/Pagination'
import HeaderBar from '@/components/shared/HeaderBar'
import { deleteConfirm, deleteBatchConfirm, removeArr } from '@/components/shared/Confirm'
import { addRole, getRoleList, changeStatus, deleteRole, editRole, bindAccount } from '@/modules/role'
import RoleModal from './RoleModal'

import './Index.less'

const CheckboxGroup = Checkbox.Group;

@connect(
  state => ({
    allUser: state.user.allUser,
    roleList: state.role.roleList,
    loading: state.loading['role/getRoleList'],
  }),
  {
    getAllUser,
    getRoleList,
    addRole,
    editRole,
    changeStatus,
    deleteRole,
    bindAccount,
  },
  null,
  { forwardRef: true },
)

class TabRole extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      currentPage: 1,
      pageSize: 5,
      bindVisible: false,
      checkedList: [],
      indeterminate: false,
      checkAll: false,
      roleVisible: false,
      editData: {},
      selectedRowKeys: [],
      bindRoleId: null,
    }
    this.roleModelRef = React.createRef()
    this.modelRef = React.createRef()
  }

  static getDerivedStateFromProps(props, state) {
    if (props.allUser !== state.allUser) {
      return { allUser: props.allUser }
    }

    return null
  }

  componentDidMount() {
    this.getAllUser()
  }

  // 获取用户列表
  getAllUser = () => {
    this.props.getAllUser({
      page_no: 1,
      page_size: 100,
    })
  }

  // 获取角色列表
  getRoleList = () => {
    const { currentPage, pageSize } = this.state
    this.props.getRoleList({
      page_no: currentPage,
      page_size: pageSize,
    })
  }

  bindAccount = () => {
    const { checkedList, bindRoleId } = this.state
    return this.props.bindAccount({
      role_id: bindRoleId,
      account_ids: checkedList,
    })
  }

  /** 表格分頁 */
  changePage = (currentPage, pageSize) => {
    this.setState({ currentPage, pageSize }, this.getRoleList)
  }

  onShowSizeChange = (currentPage, pageSize) => {
    this.setState({ currentPage: 1, pageSize }, this.getRoleList)
  }

  // 角色绑定
  showBindModal(record){
    const checkedList=record.accounts.map(item=>item.id)||[]
    this.onChange(checkedList)
    this.setState({
      bindVisible: true,
      checkedList: checkedList,
      bindRoleId: record.id,
    })
  }

  // 绑定角色
  onOkBind() {
    this.bindAccount().then(res => {
      if (res instanceof Error) return
      message.success('绑定成功', 1, () => {
        this.setState({
          bindVisible: false,
          bindRoleId: null,
        })
        this.getRoleList()
        this.props.onChange()
      })
    })
  }

  onCancelBind(){
    this.setState({ bindVisible: false })
  }

  changeStatus = (checked, record) => {
    this.props.changeStatus({
      id: record.id,
      status: Number(checked),
    }).then(res => {
      if (res instanceof Error) return
      this.getRoleList()
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
    this.props.deleteRole({
      id: idArr.join(','),
    }).then((res) => {
      if (res instanceof Error) return
      message.success('删除成功', 1, () => {
        const { currentPage, pageSize } = this.state
        const { roleList, onChange } = this.props
        const totalPage = Math.ceil((roleList.count - idArr.length) / pageSize)
        if (currentPage > totalPage) {
          this.setState({ currentPage: 1 }, () => {
            this.getRoleList()
          })
        } else {
          this.getRoleList()
        }
        onChange()
      })
      const selectedRowKeys = removeArr(this.state.selectedRowKeys, id)
      this.setState({ selectedRowKeys })
    })
  }


  // 添加/编辑角色
  showRoleModal(record=null){
    this.setState({
      roleVisible: true,
      isEdit: record,
    })
    this.roleModelRef.setFieldsValue(record)
  }

  onOkRole(){
    this.setState({
      currentPage: 1,
      roleVisible: false,
    }, this.getRoleList)
  }

  onCancelRole(){
    this.setState({ roleVisible: false })
  }

  onChange = checkedList => {
    this.setState({
      checkedList,
      indeterminate: !!checkedList.length && checkedList.length < this.props.allUser.list.length,
      checkAll: checkedList.length === this.props.allUser.list.length,
    });
  };

  onCheckAllChange = e => {
    const plainOptionsIds = this.props.allUser.list.map(item => item.id)
    this.setState({
      checkedList: e.target.checked ? plainOptionsIds : [],
      indeterminate: false,
      checkAll: e.target.checked,
    });
  };

  /** 表格复选框选中 */
  onSelectChange = (selectedRowKeys) => {
    this.setState({
      selectedRowKeys,
    })
  }

  render() {
    const { allUser, roleList={}, onChange: onChangeRole, loading } = this.props
    const { currentPage, pageSize, roleVisible, selectedRowKeys} = this.state

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
        title: '角色名',
        dataIndex: 'name',
      },
      {
        title: '授权账号',
        dataIndex: 'accounts',
        width: '30%',
        render: (text, record) => {
          if (!record.accounts) return
          const account = record.accounts.map(item => item.name)
          const content = account.length ? account.join(', ') : '暂无'
          return (
            <div style={{ wordWrap: 'break-word', wordBreak: 'break-word' }}>
              {content}
            </div>
          )
        },
      },
      {
        title: '角色状态',
        dataIndex: 'status',
        render: (text, record) => (
          <Switch
            checked={!!record.status}
            onChange={(checked) => this.changeStatus(checked, record)}
          />
        ),
      }, {
        title: '操作',
        dataIndex: 'operation',
        key: 'operation',
        width: 150,
        render: (text, record) => (
          <OperatorIcons>
            <OperatorIcons.Icon title="编辑" type="edit" onClick={() => this.showRoleModal(record)} />
            <OperatorIcons.Icon title="绑定" type="info-circle" onClick={() => this.showBindModal(record)} />
            <OperatorIcons.Icon title="删除" type="delete" onClick={() => this.showConfirm(record.id)} />
          </OperatorIcons>
        ),
      },
    ];

    return (
      <div className="container">
        <HeaderBar>
          <HeaderBar.Left>
            <Button type="primary" onClick={() =>this.showRoleModal()}>添加</Button>
            <Button className="button" onClick={this.batchDelete}>批量删除</Button>
          </HeaderBar.Left>
        </HeaderBar>
        <Table
          rowSelection={{
            selectedRowKeys,
            onChange: this.onSelectChange,
          }}
          loading={loading}
          rowKey={record => record.id}
          columns={columns}
          dataSource={roleList.list || []}
          pagination={false}
        />
        <Pagination
          current={currentPage}
          pageSize={pageSize}
          pageSizeOptions={['5', '10', '15', '20']}
          total={roleList.count || 0}
          onChange={this.changePage}
          onShowSizeChange={this.onShowSizeChange}
        />
        <Modal
          title="角色绑定"
          visible={this.state.bindVisible}
          onOk={() => this.onOkBind()}
          onCancel={() => this.onCancelBind()}
          className="user-table-role-bind-modal"
        >
          <div className="title">请选择以下哪些账号要与角色绑定</div>
          <div>
            <div>
              <Checkbox
                indeterminate={this.state.indeterminate}
                onChange={this.onCheckAllChange}
                checked={this.state.checkAll}
              >
                全选
              </Checkbox>
            </div>
            <div className='hover-scroll'>
              <CheckboxGroup
                value={this.state.checkedList}
                onChange={this.onChange}
              >
                <Row>
                  {allUser && allUser.list && allUser.list.map(item => (
                    <Col key={item.id} span={12}>
                      <Checkbox value={item.id}>
                        {item.username}
                      </Checkbox>
                    </Col>
                  ))}
                </Row>
              </CheckboxGroup>
            </div>
          </div>
        </Modal>

        {/* 添加/编辑角色弹窗 */}
        <RoleModal
          visible={roleVisible}
          onOk={() => this.onOkRole()}
          onCancel={() => this.onCancelRole()}
          wrappedComponentRef={(node) => this.roleModelRef = node}
          onChange={onChangeRole}
        />
      </div>
    )
  }
}

export default TabRole