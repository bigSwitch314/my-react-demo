import React from 'react'
import { Table, Button, Modal, Input, message, Form, Select } from 'antd'
import { getCategoryList, addCategory, editCategory, deleteCategory } from '@/modules/category'
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
const Option = Select.Option;

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


class CategoryManage extends React.Component {
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
  }

  static getDerivedStateFromProps(props, state) {
    if (props.categoryList !== state.categoryList) {
      return { categoryList: props.categoryList }
    }

    return null
  }

  componentDidMount() {
    const testData = [
      { id: 1, name: '文章管理', pId: 0, pName: '顶级', sort: 1, children:
        [
          { id: 11, name: '原创文章', pId: 1, pName: '文章管理', sort: 1 },
          { id: 12, name: '转载文章', pId: 1, pName: '文章管理', sort: 2 },
          { id: 13, name: '开源项目', pId: 1, pName: '文章管理', sort: 3 },
          { id: 14, name: '个人简介', pId: 1, pName: '文章管理', sort: 4 },
        ],
      },
      { id: 2, name: '分类管理', pId: 0, pName: '顶级', sort: 2, children:
        [],
      },
      { id: 3, name: '系统管理', pId: 0, pName: '顶级', sort: 3, children:
        [
          { id: 31, name: '导航列表', pId: 3, pName: '系统管理', sort: 1 },
          { id: 32, name: '节点管理', pId: 3, pName: '系统管理', sort: 2 },
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

  // 添加或编辑分类
  addCategory = (isEdit) => {
    const { getFieldsValue } = this.props.form
    const { name } = getFieldsValue()

    const param = { name }

    if(isEdit) {
      param.id = this.editData.id
      this.props.editCategory(param).then((res) => {
        if (res instanceof Error) return
        message.success('修改成功', 1, () => {
          this.setState({ currentPage: 1 }, this.getCategoryList)
          this.setState({ visible: false })
          this.editData = {}
        })
      })
    } else {
      this.props.addCategory(param).then((res) => {
        if (res instanceof Error) return
        message.success('添加成功', 1, () => {
          this.setState({ currentPage: 1 }, this.getCategoryList)
          this.setState({ visible: false })
        })
      })
    }
  }

  editHandler = (record) => {
    this.editData = record
    console.log(record)
    const { name } = record
    this.props.form.setFieldsValue({ name })

    this.setState({
      isEdit: true,
      visible: true,
    });
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

  onCancel = () => {
    this.setState({ visible: false })
    this.editData = {}
  }

  onOk = (isEdit) => {
    this.props.form.validateFieldsAndScroll((err) => {
      if (!err) {
        this.addCategory(isEdit)
      }
    })
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

  /** 拖动组件 */
  components = {
    body: {
      row: DragableBodyRow,
    },
  };

  /** 拖动行 */
  moveRow = (dragIndex, hoverIndex, isChildrenDragable, record) => {
    const { data } = this.state;

    if (isChildrenDragable === false) {
      const dragRow = data[dragIndex];
      const { data: newData } = update(this.state, {
        data: {
          $splice: [[dragIndex, 1], [hoverIndex, 0, dragRow]],
        },
      })
      this.setState({ data: newData },
        () => this.setOrder(data, this.state.data))

    } else {
      const pId = record.pId
      const index = data.findIndex(item => item.id === pId)
      const dragRow = data[index].children[dragIndex]

      const { data: newData } = update(this.state, {
        data: { [index]: { children: {
          $splice: [[dragIndex, 1], [hoverIndex, 0, dragRow]],
        }}},
      })

      this.setState({ data: newData },
        () => this.setOrder(data[index].children, this.state.data[index].children))
    }
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
    const { getFieldDecorator } = this.props.form

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
              dataSource={data || []}
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
                {getFieldDecorator('labelSizeLevel', {
                  rules: [{
                    required: true,
                    message: '请选择父级',
                    whitespace: true,
                    type: 'number',
                  }],
                })(
                  <Select placeholder="请选择父级" style={{ width: 360 }}>
                    <Option key={1} value={1}>顶级</Option>
                    <Option key={2} value={2}>文章管理</Option>
                    <Option key={3} value={3}>分类管理</Option>
                    <Option key={4} value={4}>标签管理</Option>
                    <Option key={5} value={5}>账号管理</Option>
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
            </div>
          </Modal>
        </div>
      </React.Fragment>
    )
  }
}

export default CategoryManage
