import React from 'react'
import { getAllUser } from '@/modules/user'
import { connect } from 'react-redux'
import { Table, Switch, Button, Modal, Checkbox, Row, Col } from 'antd'
import OperatorIcons from '@/components/shared/OperatorIcon'
import Pagination from '@/components/shared/Pagination'
import HeaderBar from '@/components/shared/HeaderBar'
import { addRole, getRoleList, changeStatus, deleteRole, editRole } from '@/modules/role'

import './index.less'

const CheckboxGroup = Checkbox.Group;
const plainOptions = [
  { id: 1, name: 'name01' },
  { id: 2, name: 'name02' },
  { id: 3, name: 'name03' },
  { id: 4, name: 'name04' },
  { id: 5, name: 'name05' },
  { id: 6, name: 'name06' },
];
const defaultCheckedList = [1, 2];

@connect(
  state => ({
    allUser: state.user.allUser,
    roleList: state.role.roleList,
    // loading: state.loading['role/getRoleList'],
  }),
  {
    getAllUser,
    getRoleList,
    addRole,
    editRole,
    changeStatus,
    deleteRole,
  },
)

class TabRole extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      currentPage: 1,
      pageSize: 5,
      bindVisible: false,
      checkedList: [],
      indeterminate: true,
      checkAll: false,
    }
  }

  static getDerivedStateFromProps(props, state) {
    if (props.allUser !== state.allUser) {
      return { allUser: props.allUser }
    }

    return null
  }

  componentDidMount() {
    this.getAllUser()
    this.getRoleList()
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

  /** 表格分頁 */
  changePage = (currentPage, pageSize) => {
    this.setState({ currentPage, pageSize }, this.getRoleList)
  }

  onShowSizeChange = (currentPage, pageSize) => {
    this.setState({ currentPage: 1, pageSize }, this.getRoleList)
  }

  // 角色绑定
  showBindModal(record){
    const checkedList=record.grant_account.map(item=>item.user_id)||[]
    this.setState({ bindVisible: true, checkedList: checkedList })
  }

  onOkBind(){
    // lj

    this.setState({ bindVisible: false })
  }

  onCancelBind(){
    this.setState({ bindVisible: false })
  }

  onChange = checkedList => {
    log(checkedList)
    log(checkedList.length, this.props.allUser.list.length)
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

  render() {
    const { allUser } = this.props
    const { currentPage, pageSize } = this.state

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
        dataIndex: 'grant_account',
        render(text, record) {
          if (!record.grant_account) return
          const account = record.grant_account.map(item => item.user_name)
          return account.join(',')
        },
      },
      {
        title: '角色状态',
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
          <OperatorIcons>
            <OperatorIcons.Icon title="编辑" type="edit" onClick={() => this.editHandler(record)} />
            <OperatorIcons.Icon title="绑定" type="info-circle" onClick={() => this.showBindModal(record)} />
            <OperatorIcons.Icon title="删除" type="delete" onClick={() => this.showConfirm(record.id)} />
          </OperatorIcons>
        ),
      },
    ];
    const data = [
      {
        id: 1,
        name: '超级管理员',
        grant_account: [{
          user_id: 18,
          user_name: '刘海',
        }, {
          user_id: 19,
          user_name: '李军',
        }],
        status: 1,
      },
      {
        id: 2,
        name: '管理员',
        grant_account: [{
          user_id: 2,
          user_name: 'luoqiang',
        }],
        status: 0,
      },
      {
        id: 3,
        name: '运维',
        grant_account: [{
          user_id: 17,
          user_name: '李晨',
        }],
        status: 1,
      },
    ];
    // rowSelection object indicates the need for row selection
    const rowSelection = {
      onChange: (selectedRowKeys, selectedRows) => {
        console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
      },
      getCheckboxProps: record => ({
        disabled: record.name === 'Disabled User', // Column configuration not to be checked
        name: record.name,
      }),
    };
    return (
      <div className="container">
        <HeaderBar>
          <HeaderBar.Left>
            <Button type="primary" onClick={this.addHandler}>添加</Button>
            <Button className="button" onClick={this.batchDelete}>批量删除</Button>
          </HeaderBar.Left>
        </HeaderBar>
        <Table
          rowSelection={rowSelection}
          columns={columns}
          dataSource={data}
          pagination={false}
        />
        <Pagination
          current={currentPage}
          pageSize={pageSize}
          pageSizeOptions={['5', '10', '15', '20']}
          total={3 || 0}
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
      </div>
    )
  }
}

export default TabRole