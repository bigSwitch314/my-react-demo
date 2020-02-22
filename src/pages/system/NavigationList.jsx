import React from 'react'
import { Table, Button, Modal, Input, Message, Form, Select, Alert } from 'antd'
import { getMenuList, addMenu, editMenu, deleteMenu, batchUpdateSort } from '@/modules/menu'
import { connect } from 'react-redux'
import { DndProvider } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import update from 'immutability-helper';

import OperatorIcons from '@/components/shared/OperatorIcon'
import HeaderBar from '@/components/shared/HeaderBar'
import DragableBodyRow from './DragableBodyRow'
import { deleteConfirm, deleteBatchConfirm, removeArr } from 'components/shared/Confirm'
import { noSpecialChar } from '@/utils/validator'

import './style/NavigationList.less'

const formItemLayout = {
  labelCol: { span: 4, offset: 0 },
  wrapperCol: { span: 20, offset: 0 },
}

const FormItem = Form.Item
const Option = Select.Option

@Form.create()
@connect(
  state => ({
    menuList: state.menu.menuList,
    loading: state.loading['menu/getMenuList'],
  }),
  {
    getMenuList,
    addMenu,
    editMenu,
    deleteMenu,
    batchUpdateSort,
  },
)


class MenuManage extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      isEdit: false,
      visible: false,
      menuTree: [],
      menuList: [],
      selectedRowKeys: [],
      confirmDirty: false,
      divisionValue: [],
      data: [],
      expandedRowKeys: [],
      selectedRowPid: null,
    }
    this.editData = {}
  }

  static getDerivedStateFromProps(props, state) {
    if (props.menuList && props.menuList.list !== state.menuList) {
      return {
        menuList: props.menuList.list,
      }
    }

    return null
  }

  componentDidMount() {
    this.getMenuList()
  }

  // 获取菜单列表
  getMenuList = () => {
    return this.props.getMenuList({}).then(res => {
      if (res instanceof Error) return
      const tree = res.payload ? res.payload.tree : []
      this.setState({ menuTree: tree })
    })
  }

  // 添加或编辑分类
  addMenu = (isEdit) => {
    const { getFieldsValue } = this.props.form
    const { name, pid } = getFieldsValue()
    const param = { name, pid, sort: 1 }

    if(isEdit) {
      param.id = this.editData.id
      this.props.editMenu(param).then((res) => {
        if (res instanceof Error) return
        Message.success('修改成功', 1, () => {
          this.setState({ currentPage: 1 }, this.getMenuList)
          this.setState({ visible: false })
          this.editData = {}
        })
      })
    } else {
      this.props.addMenu(param).then((res) => {
        if (res instanceof Error) return
        Message.success('添加成功', 1, () => {
          this.setState({ visible: false }, () => this.getMenuList())
        })
      })
    }
  }

  batchUpdateSort = (paramList) => {
    return this.props.batchUpdateSort(paramList)
  }

  editHandler = (record) => {
    this.editData = record
    console.log(record)
    const { name, pid } = record
    this.props.form.setFieldsValue({ name, pid })

    this.setState({
      isEdit: true,
      visible: true,
    });
  }

  addHandler = () => {
    const { selectedRowKeys } = this.state
    const { resetFields, setFieldsValue } = this.props.form
    resetFields()
    if (selectedRowKeys.length ===1 ) {
      setFieldsValue({ pid: selectedRowKeys[0]})
    }

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
        this.addMenu(isEdit)
      }
    })
  }

  /** 表格分頁 */
  changePage = (currentPage, pageSize) => {
    this.setState({ currentPage, pageSize }, this.getMenuList)
  }

  onShowSizeChange = (currentPage, pageSize) => {
    this.setState({ currentPage: 1, pageSize }, this.getMenuList)
  }

  /** 表格复选框选中 */
  onSelectChange = (selectedRowKeys) => {
    this.setState({
      selectedRowKeys,
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
    this.props.deleteMenu({
      id: idArr.join(','),
    }).then((res) => {
      if (res instanceof Error) return
      Message.success('删除成功', 1, () => {
        const { currentPage, pageSize, userList = {} } = this.state
        const totalPage = Math.ceil((userList.count - idArr.length) / pageSize)
        if (currentPage > totalPage) {
          this.setState({ currentPage: 1 }, () => {
            this.getMenuList()
          })
        } else {
          this.getMenuList()
        }
      })
      const selectedRowKeys = removeArr(this.state.selectedRowKeys, id)
      this.setState({ selectedRowKeys })
    })
  }

  setSort(preData, data) {
    const newSort = []
    data.forEach((item, index) => {
      if (item.id !== preData[index].id || item.pid === preData[index].pid) {
        newSort.push({
          id: item.id,
          sort: index + 1,
        })
      }
    })
    this.batchUpdateSort({
      list: newSort,
    }).then(res => {
      if (res instanceof Error) return
      this.getMenuList()
    }).catch(err => {
      console.log(err)
    })
  }

  onExpandHandler = (expanded, record) => {
    this.setState({
      expandedRowKeys: expanded ? [record.id] : [],
    })
  }

  /** 拖动组件 */
  components = {
    body: {
      row: DragableBodyRow,
    },
  };

  /** 拖动行 */
  moveRow = (dragIndex, hoverIndex, isChildrenDragable, record) => {
    const { menuTree } = this.state;

    if (isChildrenDragable === false) {
      const dragRow = menuTree[dragIndex];
      const { menuTree: newData } = update(this.state, {
        menuTree: {
          $splice: [[dragIndex, 1], [hoverIndex, 0, dragRow]],
        },
      })
      this.setSort(menuTree, newData)

    } else {
      const pid = record.pid
      const index = menuTree.findIndex(item => item.id === pid)
      const dragRow = menuTree[index].children[dragIndex]

      const { menuTree: newData } = update(this.state, {
        menuTree: { [index]: { children: {
          $splice: [[dragIndex, 1], [hoverIndex, 0, dragRow]],
        }}},
      })

      this.setSort(menuTree[index].children, newData[index].children)
    }
  }

  render() {
    const {
      visible,
      isEdit,
      menuTree,
      menuList,
      expandedRowKeys,
      selectedRowKeys,
    } = this.state

    const { loading } = this.props
    const { getFieldDecorator } = this.props.form

    const columns = [
      {
        title: '序号',
        dataIndex: 'serial_number',
      }, {
        title: '名称',
        dataIndex: 'name',
      }, {
        title: '父级',
        dataIndex: 'pName',
      }, {
        title: '操作',
        dataIndex: 'operation',
        width: 150,
        render: (text, record) => (
          <OperatorIcons>
            <OperatorIcons.Icon title="编辑" type="edit" onClick={() => this.editHandler(record)} />
            <OperatorIcons.Icon title="删除" type="delete" onClick={() => this.showConfirm(record.id)} />
          </OperatorIcons>
        ),
      },
    ]

    return (
      <React.Fragment>
        <div className="container">
          <div className="button-group">
            <HeaderBar>
              <HeaderBar.Left>
                <Button type="primary" onClick={this.addHandler}>添加</Button>
                <Button className="button" onClick={this.batchDelete}>批量删除</Button>
              </HeaderBar.Left>
            </HeaderBar>
          </div>
          <Alert
            description="菜单列表支持拖动排序。拖动排序后，需手动刷新页面，以同步左侧导航菜单顺序。"
            type="info"
            showIcon
            closable
          />
          <DndProvider backend={HTML5Backend}>
            <Table
              rowSelection={{
                selectedRowKeys,
                onChange: this.onSelectChange,
                getCheckboxProps: this.getCheckboxProps,
              }}
              onRow={(record, index) => ({
                index,
                moveRow: (dragIndex, hoverIndex, isChildrenDragable) =>
                  this.moveRow(dragIndex, hoverIndex, isChildrenDragable, record),
              })}
              components={this.components}
              expandedRowKeys={expandedRowKeys}
              onExpand={this.onExpandHandler}
              loading={loading}
              columns={columns}
              dataSource={menuTree || []}
              rowKey={record => record.id}
              pagination={false}
            />
          </DndProvider>
          <Modal
            title={isEdit ? '编辑导航' : '添加导航'}
            visible={visible}
            width={740}
            maskClosable={false}
            onCancel={this.onCancel}
            onOk={() => this.onOk(isEdit)}
          >
            <div>
              <FormItem
                label="父级"
                {...formItemLayout}
              >
                {getFieldDecorator('pid', {
                  rules: [{
                    required: true,
                    message: '请选择父级',
                    whitespace: true,
                    type: 'number',
                  }],
                })(
                  <Select placeholder="请选择父级" style={{ width: 360 }} disabled={isEdit}>
                    <Option key={0} value={0}>顶级</Option>
                    {menuList && menuList.filter(item => item.pid === 0).map(item => (
                      <Option key={item.id} value={item.id}>{item.name}</Option>
                    ))}
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
                    message: '不能超过12个字符',
                    max: 12,
                  }, noSpecialChar],
                })(
                  <Input
                    type="text"
                    style={{ width: 360 }}
                    maxLength={12}
                  />,
                )}
              </FormItem>
            </div>
          </Modal>
        </div>
      </React.Fragment>
    )
  }
}

export default MenuManage
