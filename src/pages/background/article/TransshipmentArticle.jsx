import React from 'react'
import { connect } from 'react-redux'
import { Table, Form, Switch, Row, Col, Input, Button, Select, DatePicker, message } from 'antd'
import OperatorIcons from 'components/shared/OperatorIcon'
import Pagination from 'components/shared/Pagination'
import HeaderBar from 'components/shared/HeaderBar'
import { deleteConfirm, deleteBatchConfirm, removeArr } from 'components/shared/Confirm'
import ArticleModal from './modal/ArticleModal'
import PreviewModal from './modal/PreviewModal'
import moment from 'moment'
import './style/TransshipmentArticle.less'

import { getCategoryList } from '../../../modules/category'
import { getLabelList } from '../../../modules/label'
import { getArticleList, changeReleaseStatus, getArticle, deleteArticle } from '../../../modules/article'

const FormItem = Form.Item
const Option = Select.Option;
const InputGroup = Input.Group;
const { RangePicker } = DatePicker

// @Form.create()

@connect(
  state => ({
    categoryList: state.category.categoryList,
    labelList: state.label.labelList,
    articleList: state.article.articleList,
    loading: state.loading['article/getArticleList'],
  }), {
    getCategoryList,
    getLabelList,
    getArticleList,
    changeReleaseStatus,
    getArticle,
    deleteArticle,
  }
)
class OriginalArticle extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      currentPage: 1,
      pageSize: 5,
      selectedRowKeys: [],
      visible: false,
      isEdit: false,
      previewVisible: false,
    }
    this.articleModelRef = React.createRef()
    this.previewModelRef = React.createRef()
  }

  static getDerivedStateFromProps(props, state) {
    if (props.userList !== state.userList) {
      return { userList: props.userList }
    }

    return null
  }

  componentDidMount() {
    this.getArticleList()
    this.props.getCategoryList({})
    this.props.getLabelList({})
  }

  // 获取文章
  getArticle = (id) => {
    return this.props.getArticle({ id })
  }

  // 获取文章列表
  getArticleList = () => {
    const { currentPage, pageSize } = this.state
    const { getFieldsValue } = this.props.form
    const { title='', category='', label=[], time, timeType=1 } = getFieldsValue()

    const beginTime = time ? time[0].format('YYYY-MM-DD HH:mm:ss') : ''
    const endTime = time ? time[1].format('YYYY-MM-DD HH:mm:ss') : ''

    if (beginTime && endTime && moment(beginTime).valueOf() >= moment(endTime).valueOf()) {
      message.error('结束时间必须大于开始时间')
      return
    }
    this.props.getArticleList({
      page_no: currentPage,
      page_size: pageSize,
      back_ground: 1,
      category_id: category,
      label_ids: label.join(','),
      begin_time: beginTime,
      end_time: endTime,
      time_type: timeType,
      title,
    })
  }

  handleQuery = (e) => {
    e && e.preventDefault()
    this.setState({ currentPage: 1 }, () => this.getArticleList())
  }

  handleReset = () => {
    const { resetFields } = this.props.form
    resetFields()
    this.handleQuery()
  }

  /** 表格复选框选中 */
  onSelectChange = (selectedRowKeys) => {
    this.setState({
      selectedRowKeys,
      delLength: selectedRowKeys.length,
    })
  }

  getCheckboxProps = record => ({
    disabled: record.name === 'system',
    name: record.name,
  })

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
    this.props.deleteArticle({
      id: idArr.join(','),
    }).then((res) => {
      if (res instanceof Error) { return }
      message.success('删除成功', 1, () => {
        this.getArticleList()
      })
      const selectedRowKeys = removeArr(this.state.selectedRowKeys, id)
      this.setState({ selectedRowKeys })
    })
  }

  /** 文章弹窗显示（添加） */
  addArticle = () => {
    this.setState({
      visible: true,
      isEdit: false,
    })
    this.articleModelRef.setFieldsValue(false, null)
  }

  /** 预览文章 */
  preview(record) {
    this.getArticle(record.id).then(res => {
      if (res instanceof Error) { return }
      this.setState({
        previewVisible: true,
      })
      console.log(this.previewModelRef)
      this.previewModelRef.getRecord(res.payload)
    })
  }

  /** 文章弹窗显显示（编辑） */
  editArticle = (record) => {
    this.getArticle(record.id).then(res => {
      if (res instanceof Error) { return }
      this.setState({
        visible: true,
        isEdit: true,
      })
      this.articleModelRef.setFieldsValue(true, res.payload)
    })
  }

  /** 保存文章  */
  handleOk = () => {
    this.setState({
      currentPage: 1,
      visible: false,
    }, this.getArticleList)
  }

  /** 关闭文章弹窗 */
  handleCancel = () => {
    this.setState({ visible: false })
  }

  /** 文章预览关闭  */
  handlePreviewOk = () => {
    this.setState({ previewVisible: false })
  }

  /** 文章预览关闭 */
  handlePreviewCancel = () => {
    this.setState({ previewVisible: false })
  }

  changeSwitchStatus = (checked, record) => {
    this.props.changeReleaseStatus({
      id: record.id,
      release: Number(checked),
    }).then(res => {
      if (res instanceof Error) { return }
      this.getArticleList()
    })
  }

  onShowSizeChange = (currentPage, pageSize) => {
    this.setState({ currentPage: 1, pageSize }, () => {
      this.getArticleList()
    })
  }

  changePage = (currentPage, pageSize) => {
    this.setState({ currentPage, pageSize }, () => {
      this.getArticleList()
    })
  }

  render() {
    const {
      currentPage,
      pageSize,
      selectedRowKeys,
      visible,
      isEdit,
      previewVisible,
    } = this.state
    const { getFieldDecorator } = this.props.form
    const { loading } = this.props

    const testData = [{
      id: 1,
      title: 'react进阶',
      author: '秋雨',
      link: 'https://www.cnblogs.com/gxp69/p/7251767.html',
      release: 1,
      edit_time: '2019-05-22 14:32',
      create_time: '2019-05-14 09:19',
    }, {
      id: 2,
      title: 'react进阶2',
      author: '秋雨',
      link: 'https://www.cnblogs.com/gxp69/p/7251767.html',
      release: 1,
      edit_time: '2019-05-22 14:32',
      create_time: '2019-05-14 09:19'
    }, {
      id: 3,
      title: 'react进阶3',
      author: '秋雨',
      link: 'https://www.cnblogs.com/gxp69/p/7251767.html',
      release: 1,
      edit_time: '2019-05-22 14:32',
      create_time: '2019-05-14 09:19'
    }, {
      id: 4,
      title: 'react进阶4',
      author: '秋雨',
      link: 'https://www.cnblogs.com/gxp69/p/7251767.html',
      release: 1,
      edit_time: '2019-05-22 14:32',
      create_time: '2019-05-14 09:19'
    }]

    const columns = [{
      title: '序号',
      key: 'xuhao',
      render(text, record, index) {
        return (
          <span>{(currentPage - 1) * pageSize + index + 1}</span>
        )
      },
    }, {
      title: '标题',
      dataIndex: 'title',
    }, {
      title: '作者',
      dataIndex: 'author',
    }, {
      title: '原文链接',
      dataIndex: 'link',
    }, {
      title: '是否发布',
      dataIndex: 'release',
      render: (text, record) => (
        <Switch
          checked={!!record.release}
          onChange={(checked) => this.changeSwitchStatus(checked, record)}
        />
      ),
    }, {
      title: '更新时间',
      dataIndex: 'edit_time',
    }, {
      title: '转载时间',
      dataIndex: 'create_time',
    },{
      title: '操作',
      key: 'operation',
      dataIndex: 'operation',
      render: (text, record) => {
        return (
          <OperatorIcons>
            <OperatorIcons.Icon title="预览" type="eye" onClick={() => this.preview(record)} />
            <OperatorIcons.Icon title="编辑" type="edit" onClick={() => this.editArticle(record)} />
            <OperatorIcons.Icon title="删除" type="delete" onClick={() => this.showConfirm(record.id)} />
          </OperatorIcons>
        )
      },
    }]

    const children = [];
    for (let i = 10; i < 36; i++) {
      children.push(<Option key={i.toString(36) + i.toString()}>{i.toString(36) + i.toString()}</Option>);
    }

    return (
      <div className="origin-article">
        <div className="serch-area">
          <Row style={{ width: '1000px'}}>
            <Col span={5}>
              <FormItem labelCol={{ span: 4}} wrapperCol={{ span: 12}} >
                {getFieldDecorator('title', {
                  rules: [{}],
                })(
                  <Input placeholder="请输入标题" style={{ width: '180px' }} />,
                )}
              </FormItem>
            </Col>
            <Col span={7} style={{ left: '-18px' }}>
              <InputGroup compact style={{ width: '310px' }}>
                <FormItem labelCol={{ span: 4 }} wrapperCol={{ span: 12 }} className='query-time' >
                  {getFieldDecorator('time', {
                  })(
                    <RangePicker style={{ width: '210px' }} />
                  )}
                </FormItem>
                <FormItem labelCol={{ span: 4 }} wrapperCol={{ span: 12 }} className='query-time-type' >
                  {getFieldDecorator('timeType', {
                    initialValue: '1'
                  })(
                    <Select style={{ width: '100px' }}>
                      <Option value="1">转载时间</Option>
                    </Select>
                  )}
                </FormItem>
              </InputGroup>
            </Col>
            <Col span={1} style={{ left: '21px' }}>
              <FormItem>
                <Button type="primary" onClick={this.handleQuery}>查询</Button>
              </FormItem>
            </Col>
            <Col span={1} style={{ left: '65px' }}>
              <FormItem>
                <Button onClick={this.handleReset}>重置</Button>
              </FormItem>
            </Col>
          </Row>
        </div>
        <hr className="line-hr" />
        <HeaderBar>
          <HeaderBar.Left>
            <Button type="primary" onClick={this.addArticle.bind(this)}>添加</Button>
          </HeaderBar.Left>
          <HeaderBar.Left>
            <Button onClick={this.batchDelete.bind(this)}>批量删除</Button>
          </HeaderBar.Left>
        </HeaderBar>
        <Table
          rowSelection={{
            selectedRowKeys,
            onChange: this.onSelectChange,
            getCheckboxProps: this.getCheckboxProps,
          }}
          rowKey={record => record.id}
          loading={loading}
          columns={columns}
          // dataSource={articleList.list}
          dataSource={testData}
          pagination={false}
        />
        <Pagination
          current={currentPage}
          pageSize={pageSize}
          pageSizeOptions={['5', '10', '15', '20']}
          // total={articleList.count}
          total={testData.length}
          onChange={this.changePage}
          onShowSizeChange={this.onShowSizeChange}
        />
        <ArticleModal
          isEdit={isEdit}
          visible={visible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
          wrappedComponentRef={(node) => this.articleModelRef = node}
        />
        <PreviewModal
          visible={previewVisible}
          onOk={this.handlePreviewOk}
          onCancel={this.handlePreviewCancel}
          ref={(node) => this.previewModelRef = node}
        />
      </div>
    )
  }
}

export default Form.create()(OriginalArticle)
