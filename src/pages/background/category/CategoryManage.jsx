import React from 'react'
import { Table, Button, Modal, Input, message, Form } from 'antd'
import { getCategoryList, addCategory, editCategory, deleteCategory } from '@/modules/category'
import { connect } from 'react-redux'
import OperatorIcons from '@/components/shared/OperatorIcon'
import Pagination from '@/components/shared/Pagination'
import HeaderBar from '@/components/shared/HeaderBar'
import { deleteConfirm, deleteBatchConfirm, removeArr } from 'components/shared/Confirm'
import { noSpecialChar } from '@/utils/validator'
import './index.less'

const formItemLayout = {
  labelCol: { span: 4, offset: 0 },
  wrapperCol: { span: 20, offset: 0 },
}

const FormItem = Form.Item

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
    this.getCategoryList()
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

  render() {
    const {
      visible,
      currentPage,
      pageSize,
      selectedRowKeys,
      isEdit,
    } = this.state

    const { categoryList, loading } = this.props
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
        title: '分类名称',
        dataIndex: 'name',
      }, {
        title: '文章数量',
        dataIndex: 'article_number',
      }, {
        title: '更新时间',
        dataIndex: 'edit_time',
      }, {
        title: '创建时间',
        dataIndex: 'create_time',
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
            loading={loading}
            columns={columns}
            dataSource={categoryList.list || []}
            rowKey={record => record.id}
            pagination={false}
          />
          <Pagination
            current={currentPage}
            pageSize={pageSize}
            pageSizeOptions={['5', '10', '15', '20']}
            total={categoryList.count || 0}
            onChange={this.changePage}
            onShowSizeChange={this.onShowSizeChange}
          />
          <Modal
            title={isEdit ? '编辑分类' : '添加分类'}
            visible={visible}
            width={740}
            maskClosable={false}
            onCancel={this.onCancel}
            onOk={() => this.onOk(isEdit)}
          >
            <div>
              <FormItem
                label="分类名称"
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
