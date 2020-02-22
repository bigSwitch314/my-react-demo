import React from 'react'
import { Table, Button, message, Form } from 'antd'
import { getNodeList, addNode, editNode, deleteNode, getLevelOneNode } from '@/modules/node'
import { connect } from 'react-redux'
import { Tag } from 'antd';

import Pagination from '@/components/shared/Pagination'
import OperatorIcons from '@/components/shared/OperatorIcon'
import HeaderBar from '@/components/shared/HeaderBar'
import { deleteConfirm, deleteBatchConfirm, removeArr } from 'components/shared/Confirm'
import NodeModal from './modal/NodeModal'

import './style/NodeManage.less'


@Form.create()
@connect(
  state => ({
    nodeList: state.node.nodeList,
    loading: state.loading['node/getNodeList'],
  }),
  {
    getNodeList,
    addNode,
    editNode,
    deleteNode,
    getLevelOneNode,
  },
)

class NodeManage extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      isEdit: false,
      visible: false,
      nodeList: {},
      currentPage: 1,
      pageSize: 5,
      selectedRowKeys: [],
      confirmDirty: false,
      divisionValue: [],
      expandedRowKeys: [],
    }
    this.NodeModelRef = React.createRef()
  }

  static getDerivedStateFromProps(props, state) {
    if (props.nodeList !== state.nodeList) {
      return { nodeList: props.nodeList }
    }

    return null
  }

  componentDidMount() {
    this.getNodeList()
    this.props.getLevelOneNode()
  }

  // 获取节点列表
  getNodeList = () => {
    const { currentPage, pageSize } = this.state
    this.props.getNodeList({
      page_no: currentPage,
      page_size: pageSize,
    })
  }

  addHandler = () => {
    this.setState({
      isEdit: false,
      visible: true,
    })
    this.NodeModelRef.setFieldsValue(false, null)
  }

  editHandler = (record) => {
    this.setState({
      isEdit: true,
      visible: true,
    })
    this.NodeModelRef.setFieldsValue(true, record)
  }

  onCancel = () => {
    this.setState({ visible: false })
  }

  onOk = (isEdit) => {
    this.setState({
      currentPage: isEdit ? this.state.currentPage : 1,
      visible: false,
    }, () => {
      this.getNodeList()
      this.props.getLevelOneNode()
    })
  }

  /** 表格分頁 */
  changePage = (currentPage, pageSize) => {
    this.setState({ currentPage, pageSize }, this.getNodeList)
  }

  onShowSizeChange = (currentPage, pageSize) => {
    this.setState({ currentPage: 1, pageSize }, this.getNodeList)
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
    this.props.deleteNode({
      id: idArr.join(','),
    }).then((res) => {
      if (res instanceof Error) return
      message.success('删除成功', 1, () => {
        const { currentPage, pageSize, userList = {} } = this.state
        const totalPage = Math.ceil((userList.count - idArr.length) / pageSize)
        if (currentPage > totalPage) {
          this.setState({ currentPage: 1 }, () => {
            this.getNodeList()
          })
        } else {
          this.getNodeList()
        }
      })
      const selectedRowKeys = removeArr(this.state.selectedRowKeys, id)
      this.setState({ selectedRowKeys })
    })
  }

  onExpandHandler = (expanded, record) => {
    this.setState({
      expandedRowKeys: expanded ? [record.id] : [],
    })
  }

  render() {
    const {
      visible,
      currentPage,
      pageSize,
      isEdit,
      expandedRowKeys,
      selectedRowKeys,
      nodeList,
    } = this.state

    const { list=[], count=0 } = nodeList || {}

    const { loading } = this.props

    const columns = [
      {
        title: '序号',
        dataIndex: 'serial_number',
      }, {
        title: '名称',
        dataIndex: 'name',
      }, {
        title: '节点',
        dataIndex: 'node',
      }, {
        title: '状态',
        dataIndex: 'status',
        render(text) {
          const color = text === 1 ? 'green' : 'red'
          const status = text === 1 ? '正常' : '禁用'
          return <Tag color={color}> {status} </Tag>
        },
      // }, {
      //   title: '父级',
      //   dataIndex: 'pname',
      }, {
        title: '菜单',
        dataIndex: 'menu',
        render(text) {
          if(text === 1 ) return '是'
          if(text === 0 ) return '否'
        },
      }, {
        title: '组',
        dataIndex: 'group_name',
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
          <Table
            rowSelection={{
              selectedRowKeys,
              onChange: this.onSelectChange,
            }}
            expandedRowKeys={expandedRowKeys}
            onExpand={this.onExpandHandler}
            loading={loading}
            columns={columns}
            dataSource={list}
            rowKey={record => record.id}
            pagination={false}
          />
          <Pagination
            current={currentPage}
            pageSize={pageSize}
            pageSizeOptions={['5', '10', '15', '20']}
            total={count}
            onChange={this.changePage}
            onShowSizeChange={this.onShowSizeChange}
          />

          {/* 添加编辑弹窗 */}
          <NodeModal
            isEdit={isEdit}
            visible={visible}
            onOk={this.onOk}
            onCancel={this.onCancel}
            wrappedComponentRef={(node) => this.NodeModelRef = node}
            selectedRowKeys={selectedRowKeys}
          />
        </div>
      </React.Fragment>
    )
  }
}

export default NodeManage
