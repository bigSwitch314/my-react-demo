import React from 'react'
import { Table, Button, message, Form } from 'antd'
import { getCategoryList, addCategory, editCategory, deleteCategory } from '@/modules/category'
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
    categoryList: state.category.categoryList,
    loading: state.loading['category/getCategoryList'],
  }),
  {
    getCategoryList,
    addCategory,
    editCategory,
    deleteCategory,
  },
)

class NodeManage extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      isEdit: false,
      visible: false,
      categoryList: {},
      currentPage: 1,
      pageSize: 5,
      selectedRowKeys: [],
      confirmDirty: false,
      divisionValue: [],
      data: [],
      expandedRowKeys: [],
    }
    this.editData = {}
    this.NodeModelRef = React.createRef()
  }

  static getDerivedStateFromProps(props, state) {
    if (props.categoryList !== state.categoryList) {
      return { categoryList: props.categoryList }
    }

    return null
  }

  componentDidMount() {
    const testData = [
      { id: 1, name: '原创文章', pId: 0, pName: '顶级', node: 'OriginalArticle', status: 1, menu: 1, group: '文章管理', sort: 1, children:
        [
          { id: 11, name: '添加', pId: 1, pName: '原创文章', node: 'addArticle', status: 1, menu: 0, group: '原创文章', sort: 1 },
          { id: 12, name: '编辑', pId: 1, pName: '原创文章', node: 'editArticle', status: 1, menu: 0, group: '原创文章', sort: 2 },
          { id: 13, name: '删除', pId: 1, pName: '原创文章', node: 'delArticle', status: 1, menu: 0, group: '原创文章', sort: 3 },
          { id: 14, name: '预览', pId: 1, pName: '原创文章', node: 'previewArticle', status: 1, menu: 0, group: '原创文章', sort: 4 },
          { id: 15, name: '发布', pId: 1, pName: '原创文章', node: 'release', status: 1, menu: 0, group: '原创文章', sort: 5 },
        ],
      },
      { id: 2, name: '开源项目', pId: 0, pName: '顶级', node: 'OpenProject', status: 1, menu: 1, group: '文章管理', sort: 2, children:
        [
          { id: 11, name: '添加', pId: 1, pName: '开源项目', node: 'addProject', status: 1, menu: 0, group: '开源项目', sort: 1 },
          { id: 12, name: '编辑', pId: 1, pName: '开源项目', node: 'editroject', status: 1, menu: 0, group: '开源项目', sort: 2 },
          { id: 13, name: '删除', pId: 1, pName: '开源项目', node: 'delProject', status: 1, menu: 0, group: '开源项目', sort: 3 },
          { id: 14, name: '发布', pId: 1, pName: '开源项目', node: 'release', status: 1, menu: 0, group: '开源项目', sort: 4 },
        ],
      },
      { id: 3, name: '导航列表', pId: 0, pName: '顶级', node: 'NavigationList', status: 0, menu: 1, group: '系统管理', sort: 3, children:
        [
          { id: 31, name: '添加', pId: 3, pName: '导航列表', node: 'add', status: 1, menu: 0, group: '导航列表', sort: 1 },
          { id: 32, name: '删除', pId: 3, pName: '导航列表', node: 'del', status: 1, menu: 0, group: '导航列表', sort: 2 },
        ],
      },
    ]

    this.setState({ data: testData })
  }

  // 获取分类列表
  getCategoryList = () => {
    const { currentPage, pageSize } = this.state
    this.props.getCategoryList({
      page_no: currentPage,
      page_size: pageSize,
    })
  }

  addHandler = () => {
    const { resetFields } = this.props.form
    resetFields()

    this.setState({
      isEdit: false,
      visible: true,
      divisionValue: [],
    })
  }

  editHandler = (record) => {
    this.editData = record
    this.setState({
      isEdit: true,
      visible: true,
    });
  }

  onCancel = () => {
    this.setState({ visible: false })
    this.editData = {}
  }

  onOk = () => {

  }

  /** 表格分頁 */
  changePage = (currentPage, pageSize) => {
    this.setState({ currentPage, pageSize }, this.getCategoryList)
  }

  onShowSizeChange = (currentPage, pageSize) => {
    this.setState({ currentPage: 1, pageSize }, this.getCategoryList)
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
    this.props.deleteCategory({
      id: idArr.join(','),
    }).then((res) => {
      if (res instanceof Error) return
      message.success('删除成功', 1, () => {
        const { currentPage, pageSize, userList = {} } = this.state
        const totalPage = Math.ceil((userList.count - idArr.length) / pageSize)
        if (currentPage > totalPage) {
          this.setState({ currentPage: 1 }, () => {
            this.getCategoryList()
          })
        } else {
          this.getCategoryList()
        }
      })
      const selectedRowKeys = removeArr(this.state.selectedRowKeys, id)
      this.setState({ selectedRowKeys })
    })
  }

  setOrder(preData, data) {
    const newOrder = []
    data.forEach((item, index) => {
      if (item.id !== preData[index].id) {
        newOrder.push({
          id: item.id,
          order: index + 1,
        })
      }
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
      data,
      expandedRowKeys,
      selectedRowKeys,
    } = this.state

    const { loading } = this.props

    const columns = [
      {
        title: '序号',
        key: 'xuhao',
        render(text, record, index) {
          const number = (currentPage - 1) * pageSize + index + 1
          if (record.pId === 0) {
            return number
          } else {
            return `${record.pId}-${number}`
          }
        },
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
      }, {
        title: '父级',
        dataIndex: 'pName',
      }, {
        title: '菜单',
        dataIndex: 'menu',
        render(text) {
          if(text === 1 ) return '是'
          if(text === 0 ) return '否'
        },
      }, {
        title: '组',
        dataIndex: 'group',
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
      }]

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
              getCheckboxProps: this.getCheckboxProps,
            }}
            expandedRowKeys={expandedRowKeys}
            onExpand={this.onExpandHandler}
            loading={loading}
            columns={columns}
            dataSource={data || []}
            rowKey={record => record.id}
            pagination={false}
          />
          <Pagination
            current={currentPage}
            pageSize={pageSize}
            pageSizeOptions={['5', '10', '15', '20']}
            total={data.length || 0}
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
          />
        </div>
      </React.Fragment>
    )
  }
}

export default NodeManage
