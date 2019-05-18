import React from 'react'
import { connect } from 'react-redux'
import { Table, Form, Switch, Row, Col, Input, Button, Select, DatePicker } from 'antd'
import OperatorIcons from 'components/shared/OperatorIcon'
import Pagination from 'components/shared/Pagination'
import HeaderBar from 'components/shared/HeaderBar'
import ArticleModal from './modal/ArticleModal'
import './style/OriginalArticle.less'

import { getCategoryList } from '../../../modules/category'
import { getLabelList } from '../../../modules/label'
import { getArticleList, changeReleaseStatus, getArticle } from '../../../modules/article'

const FormItem = Form.Item
const Option = Select.Option;
const InputGroup = Input.Group;
const { RangePicker } = DatePicker

// @Form.create()

@connect(
  state => ({
    categoryList: state.article.categoryList,
    articleList: state.article.articleList,
    loading: state.loading['article/getArticleList'],
  }), {
    getCategoryList,
    getLabelList,
    getArticleList,
    changeReleaseStatus,
    getArticle,
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
      editData: null,
    }
  }

  static getDerivedStateFromProps(props, state) {
    if (props.userList !== state.userList) {
      return { userList: props.userList }
    }

    return null
  }

  componentDidMount() {
    this.getArticleList()
  }

  // 获取文章
  getArticle = (id) => {
    return this.props.getArticle({ id })
  }

  // 获取文章列表
  getArticleList = () => {
    const { currentPage, pageSize } = this.state
    this.props.getArticleList({
      page_no: currentPage,
      page_size: pageSize,
      back_ground: 1,
    })
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

  /** 文章弹窗显示（添加） */
  addArticle = () => {
    this.setState({ visible: true })
    this.props.getCategoryList({})
    this.props.getLabelList({})
  }

  /** 文章弹窗显显示（编辑） */
  editArticle = (record) => {
    this.getArticle(record.id).then(res => {
      if (res instanceof Error) return
      this.setState({
        visible: true,
        isEdit: true,
        editData: res,
      })
    })
    
    this.props.getCategoryList({})
    this.props.getLabelList({})
  }

  /** 保存文章  */
  handleOk = () => {
    this.setState({ visible: false })
  }

  /** 关闭文章弹窗 */
  handleCancel = () => {
    this.setState({ visible: false })
  }

  changeSwitchStatus = (checked, record) => {
    this.props.changeReleaseStatus({
      id: record.id,
      release: Number(checked),
    }).then(res => {
      if (res instanceof Error) return
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
      editData,
    } = this.state
    const { getFieldDecorator } = this.props.form
    const { articleList = {}, loading } = this.props

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
      title: '分类',
      dataIndex: 'category_name',
    }, {
      title: '标签',
      dataIndex: 'label_name',
    }, {
      title: '阅读次数',
      dataIndex: 'read_number',
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
      title: '创建时间',
      dataIndex: 'create_time',
    },{
      title: '操作',
      key: 'operation',
      dataIndex: 'operation',
      render: (text, record) => {
        return (
          <OperatorIcons>
            <OperatorIcons.Icon title="预览" type="eye" onClick={() => this.modalVisbileChange(record)} />
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

    console.log(this.props.articleList)

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
            <Col span={5} style={{ left: '-2px' }}>
              <FormItem labelCol={{ span: 4 }} wrapperCol={{ span: 12 }} >
                {getFieldDecorator('category', {
                  rules: [{}],
                })(
                  <Select placeholder="请选择分类" style={{ width: '180px' }}>
                    <Option value="Zhejiang">php</Option>
                    <Option value="Jiangsu">js</Option>
                    <Option value="Jiangsu">redis</Option>
                  </Select>
                )}
              </FormItem>
            </Col>
            <Col span={5} style={{ left: '-4px' }}>
              <FormItem labelCol={{ span: 4 }} wrapperCol={{ span: 12 }} >
                {getFieldDecorator('label', {
                  rules: [],
                })(
                  <Select
                    mode="multiple"
                    style={{ width: '180px' }}
                    placeholder='请选择标签'
                    onChange={this.handleChange}
                  >
                    {children}
                  </Select>,
                )}
              </FormItem>
            </Col>
            <Col span={8} style={{ left: '-6px' }}>
              <InputGroup compact style={{ width: '310px' }}>
                <FormItem labelCol={{ span: 4 }} wrapperCol={{ span: 12 }} className='query-time' >
                  {getFieldDecorator('time', {
                    rules: [{}],
                  })(
                    <RangePicker style={{ width: '210px' }} />
                  )}
                </FormItem>
                <FormItem labelCol={{ span: 4 }} wrapperCol={{ span: 12 }} className='query-time-type' >
                  {getFieldDecorator('time2', {
                    rules: [{}],
                    initialValue: '1'
                  })(
                    <Select style={{ width: '100px' }}>
                      <Option value="1">创建时间</Option>
                      <Option value="2">更新时间</Option>
                    </Select>
                  )}
                </FormItem>
              </InputGroup>
            </Col>
            <Col span={1}>
              <FormItem>
                <Button type="primary" onClick={this.handleQuery}>查询</Button>
              </FormItem>
            </Col>
          </Row>
        </div>
        <hr className="line-hr" />
        <HeaderBar>
          <HeaderBar.Left>
            <Button type="primary" onClick={() => this.addArticle()}>添加</Button>
          </HeaderBar.Left>
          <HeaderBar.Left>
            <Button onClick={null}>批量删除</Button>
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
          dataSource={articleList.list}
          // rowSelection={rowSelection}
          pagination={false}
        />
        <Pagination
          current={currentPage}
          pageSize={pageSize}
          pageSizeOptions={['5', '10', '15', '20']}
          total={articleList.count}
          onChange={this.changePage}
          onShowSizeChange={this.onShowSizeChange}
        />
        <ArticleModal
          isEdit={isEdit}
          editData={editData}
          visible={visible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
        />
      </div>
    )
  }
}

export default Form.create()(OriginalArticle)
