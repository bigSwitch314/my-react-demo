import React from 'react'
import { connect } from 'react-redux'
import { Table, Form, Switch, Row, Col, Input, Button, Select, DatePicker, message } from 'antd'
import OperatorIcons from 'components/shared/OperatorIcon'
import Pagination from 'components/shared/Pagination'
import HeaderBar from 'components/shared/HeaderBar'
import { deleteConfirm, deleteBatchConfirm, removeArr } from 'components/shared/Confirm'
import TransshipmentModal from './modal/TransshipmentModal'
import TransshipmentPreviewModal from './modal/TransshipmentPreviewModal'

import moment from 'moment'
import './style/TransshipmentArticle.less'

import { getTransshipmentArticleList, changeReleaseStatus, getTransshipmentArticle, deleteTransshipmentArticle } from '@/modules/transshipmentArticle'

const FormItem = Form.Item
const Option = Select.Option;
const InputGroup = Input.Group;
const { RangePicker } = DatePicker

// @Form.create()

@connect(
  state => ({
    transshipmentArticleList: state.transshipmentArticle.transshipmentArticleList,
    loading: state.loading['transshipmentArticle/getTransshipmentArticleList'],
  }), {
    getTransshipmentArticleList,
    changeReleaseStatus,
    getTransshipmentArticle,
    deleteTransshipmentArticle,
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
    this.TransshipmentModalRef = React.createRef()
    this.previewModelRef = React.createRef()
  }

  static getDerivedStateFromProps(props, state) {
    if (props.userList !== state.userList) {
      return { userList: props.userList }
    }

    return null
  }

  componentDidMount() {
    this.getTransshipmentArticleList()
  }

  // 获取文章
  getArticle = (id) => {
    return this.props.getTransshipmentArticle({ id })
  }

  // 获取文章列表
  getTransshipmentArticleList = () => {
    const { currentPage, pageSize } = this.state
    const { getFieldsValue } = this.props.form
    const { title='', time, timeType=1 } = getFieldsValue()

    const beginTime = time ? time[0].format('YYYY-MM-DD') : ''
    const endTime = time ? time[1].format('YYYY-MM-DD') : ''

    if (beginTime && endTime && moment(beginTime).valueOf() >= moment(endTime).valueOf()) {
      message.error('结束时间必须大于开始时间')
      return
    }
    this.props.getTransshipmentArticleList({
      page_no: currentPage,
      page_size: pageSize,
      begin_time: beginTime,
      end_time: endTime,
      time_type: timeType,
      title,
    })
  }

  handleQuery = (e) => {
    e && e.preventDefault()
    this.setState({ currentPage: 1 }, () => this.getTransshipmentArticleList())
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
    this.props.deleteTransshipmentArticle({
      id: idArr.join(','),
    }).then((res) => {
      if (res instanceof Error) { return }
      message.success('删除成功', 1, () => {
        this.getTransshipmentArticleList()
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
    this.TransshipmentModalRef.setFieldsValue(false, null)
  }

  /** 预览文章 */
  preview(record) {
    this.setState({
      previewVisible: true,
    })
    this.previewModelRef.getRecord(record)
  }

  /** 文章弹窗显显示（编辑） */
  editArticle = (record) => {
    this.getArticle(record.id).then(res => {
      if (res instanceof Error) { return }
      this.setState({
        visible: true,
        isEdit: true,
      })
      this.TransshipmentModalRef.setFieldsValue(true, res.payload)
    })
  }

  /** 保存文章  */
  handleOk = () => {
    this.setState({
      currentPage: 1,
      visible: false,
    }, this.getTransshipmentArticleList)
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
      this.getTransshipmentArticleList()
    })
  }

  onShowSizeChange = (currentPage, pageSize) => {
    this.setState({ currentPage: 1, pageSize }, () => {
      this.getTransshipmentArticleList()
    })
  }

  changePage = (currentPage, pageSize) => {
    this.setState({ currentPage, pageSize }, () => {
      this.getTransshipmentArticleList()
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
    const { transshipmentArticleList = {}, loading } = this.props
    const { list = [], count = 0 } = transshipmentArticleList

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
      width: 240,
    }, {
      title: '作者',
      dataIndex: 'author',
      width: 80,
      render: (text) => (
        <div style={{ wordWrap: 'break-word', wordBreak: 'break-word' }}>
          {text}
        </div>
      ),
    }, {
      title: '原文链接',
      dataIndex: 'link',
      width: 200,
      render: (text) => (
        <div style={{ wordWrap: 'break-word', wordBreak: 'break-word' }}>
          {text}
        </div>
      ),
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
    }, {
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
                  <Input
                    placeholder="请输入标题"
                    style={{ width: '180px' }}
                    maxLength={26}
                  />,
                )}
              </FormItem>
            </Col>
            <Col span={7} style={{ left: '-6px' }}>
              <InputGroup compact style={{ width: '310px' }}>
                <FormItem labelCol={{ span: 4 }} wrapperCol={{ span: 12 }} className='query-time' >
                  {getFieldDecorator('time', {
                  })(
                    <RangePicker style={{ width: '210px' }} />
                  )}
                </FormItem>
                <FormItem labelCol={{ span: 4 }} wrapperCol={{ span: 12 }} className='query-time-type' >
                  {getFieldDecorator('timeType', {
                    initialValue: '1',
                  })(
                    <Select style={{ width: '100px' }}>
                      <Option value="1">转载时间</Option>
                      <Option value="2">更新时间</Option>
                    </Select>
                  )}
                </FormItem>
              </InputGroup>
            </Col>
            <Col span={1} style={{ left: '33px' }}>
              <FormItem>
                <Button type="primary" onClick={this.handleQuery}>查询</Button>
              </FormItem>
            </Col>
            <Col span={1} style={{ left: '77px' }}>
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
          dataSource={list}
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
        <TransshipmentModal
          isEdit={isEdit}
          visible={visible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
          wrappedComponentRef={(node) => this.TransshipmentModalRef = node}
        />

        {/* 文章预览弹窗 */}
        <TransshipmentPreviewModal
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
