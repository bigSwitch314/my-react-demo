import React from 'react'
import { connect } from 'react-redux'
import {
  Table,
  Switch,
  Row,
  Col,
  Form,
  Select,
  Input,
  DatePicker,
  Button,
  List,
  Icon,
  Pagination,
  message,
  Popover,
} from 'antd'
import moment from 'moment'

import OperatorIcons from 'components/shared/OperatorIcon'
import MyPagination from 'components/shared/Pagination'
import HeaderBar from 'components/shared/HeaderBar'
import UpdateLogModal from './modal/UpdateLogModal'
import ProjectModal from './modal/ProjectModal'
import './style/OpenSourceProject.less'

import { deleteConfirm, removeArr } from 'components/shared/Confirm'
import {
  getOpenSourceProjectList,
  changeReleaseStatus,
  getOpenSourceProject,
  deleteOpenSourceProject,
} from '../../../modules/openSourceProject'

import { getOspUpdateLogList } from '@/modules/ospUpdateLog'

const FormItem = Form.Item
const Option = Select.Option
const InputGroup = Input.Group
const RangePicker = DatePicker.RangePicker
const ListItem = List.Item
const ListItemMeta = List.Item.Meta

let updateLog = null


@Form.create()
@connect(
  state => ({
    openSourceProjectList: state.openSourceProject.openSourceProjectList,
    ospUpdateLogList: state.ospUpdateLog.ospUpdateLogList,
    loading: state.loading['openSourceProject/getOpenSourceProjectList'],
    loadingLog: state.loading['ospUpdateLog/getOspUpdateLogList'],
  }), {
    getOpenSourceProjectList,
    changeReleaseStatus,
    getOpenSourceProject,
    deleteOpenSourceProject,
    getOspUpdateLogList,
  }
)

class OpenSourceProject extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      currentPage: 1,
      pageSize: 5,
      isEdit: false,
      UpdateLogModalVisible: false,
      projectVisible: false,
      expandedRowKeys: [],
      ospId: null,
      updateLogItem: null,
      expandedRowRenderAgain: 1,
      addLogSuccess: 1,
      currentPageLog: 1,
      pageSizeLog: 5,
    }
    this.projectModelRef = React.createRef()
    this.updateLogModelRef = React.createRef()
  }

  static getDerivedStateFromProps(props, state) {
    if (props.userList !== state.userList) {
      return { userList: props.userList }
    }

    return null
  }

  componentDidMount() {
    this.getOpenSourceProjectList()

  }

  // 获取开源项目列表
  getOpenSourceProjectList = () => {
    const { currentPage, pageSize } = this.state
    const { getFieldsValue } = this.props.form
    const { name='', time, timeType=1 } = getFieldsValue()

    const beginTime = time ? time[0].format('YYYY-MM-DD HH:mm:ss') : ''
    const endTime = time ? time[1].format('YYYY-MM-DD HH:mm:ss') : ''

    if (beginTime && endTime && moment(beginTime).valueOf() >= moment(endTime).valueOf()) {
      message.error('结束时间必须大于开始时间')
      return
    }
    this.props.getOpenSourceProjectList({
      page_no: currentPage,
      page_size: pageSize,
      begin_time: beginTime,
      end_time: endTime,
      time_type: timeType,
      name,
    })
  }

  // 获取更新日志列表
  getOspUpdateLogList(osp_id) {
    this.props.getOspUpdateLogList({ osp_id })
  }

  showUpdateLogModal(ospId, item=null) {
    this.setState({
      UpdateLogModalVisible: true,
      ospId,
    })
    this.updateLogModelRef.setFieldsValue(item !== null, item)
  }

  onOkUpdateLogModal() {
    this.setState({ UpdateLogModalVisible: false })
  }

  onCancelUpdateLogModal() {
    this.setState({ UpdateLogModalVisible: false })
  }
  
  onDoSuccess(ospId) {
    this.onExpand(true, ospId, true)
  }

  /** 开源项目弹窗显示（添加） */
  addProject = () => {
    this.setState({
      projectVisible: true,
      isEdit: false,
    })
    this.projectModelRef.setFieldsValue(false, null)
  }

  /** 开源项目弹窗显示（编辑） */
  editProject = (record) => {
    this.setState({
      projectVisible: true,
      isEdit: true,
    })
    this.projectModelRef.setFieldsValue(true, record)
  }

  /** 保存开源项目  */
  handleOk = () => {
    this.setState({
      currentPage: 1,
      projectVisible: false,
    }, () => this.getOpenSourceProjectList())
  }

  /** 关闭开源项目弹窗 */
  handleCancel = () => {
    this.setState({ projectVisible: false })
  }

  async onExpand(expanded, ospId, page_1=false) {
    const { currentPageLog, pageSizeLog } = this.state
    this.setState({
      loadingLog: true,
    })
    const result = await this.props.getOspUpdateLogList({
      osp_id: ospId,
      page_no: page_1 ? 1 : currentPageLog,
      page_size: pageSizeLog,
    })
    updateLog = result ? result.payload : []

    this.setState({
      expandedRowRenderAgain: ospId,
      loadingLog: false,
      currentPageLog: page_1 ? 1 : currentPageLog,
      ospId,
    })
  }

  expandedRowRender(record) {
    let data = []
    let count = 0
    if (updateLog) {
      data = updateLog.list
      count = updateLog.count
    }

    const { currentPageLog, pageSizeLog, loadingLog } = this.state

    const getDescription = (updateLog) => {
      const log = updateLog || ['文章列表样式修正', '添加文章失败修复', '新增开源项目']
      return (
        <div>
          <ul>
            {log.map(item => <li key={item}>{item}</li>)}
          </ul>
        </div>
      )
    }

    const getHeadr = () => {
      return (
        <React.Fragment>
          <div>更新日志 </div>
          <div className="add-log">
            <Icon
              type="plus"
              title="添加"
              onClick={() => this.showUpdateLogModal(record.id)}
            />
          </div>
          <div className="pagination">
            <span style={{ left: '-46px', position: 'absolute' }}>
              共{count}条
            </span>
            <Pagination
              simple
              current={currentPageLog}
              pageSize={pageSizeLog}
              total={count}
              onChange={this.onChangePageLog}
            />
            <Pagination simple defaultCurrent={2} total={50} />
          </div>
        </React.Fragment>
      )
    }

    const getTitle = (item) => {
      return (
        <div className="title">
          <span>{item.version}</span>
          <span style={{ marginLeft: 20 }}>{item.create_time}</span>
          <Icon
            type="edit"
            title="编辑"
            onClick={() => this.showUpdateLogModal(record.id, item)}
            style={{ margin: '0px 20px' }}
            className="title-icon"
          />
          <Icon
            type="delete"
            title="删除"
            onClick={null}
            className="title-icon"
          />
        </div>
      )
    }

    return (
      <List
        loading={loadingLog}
        header={getHeadr()}
        itemLayout="horizontal"
        dataSource={data}
        renderItem={item => (
          <ListItem>
            <ListItemMeta
              title={getTitle(item)}
              description={getDescription(item.content)}
            />
          </ListItem>
        )}
      />
    )
  }

  onExpandedRowsChange(expandedRows) {
    this.setState({
      expandedRowKeys: [expandedRows.pop()],
    })
  }

  handleQuery = (e) => {
    e && e.preventDefault()
    this.setState({ currentPage: 1 }, () => this.getOpenSourceProjectList())
  }

  handleReset = () => {
    const { resetFields } = this.props.form
    resetFields()
    this.handleQuery()
  }

  /** 删除弹框 */
  showConfirm = (id) => {
    deleteConfirm(() => this.deleteData(id))
  }

  /** 删除数据方法 */
  deleteData = (id) => {
    let idArr = []
    id instanceof Array ? idArr = id : idArr.push(id)
    this.props.deleteOpenSourceProject({
      id: idArr.join(','),
    }).then((res) => {
      if (res instanceof Error) { return }
      message.success('删除成功', 1, () => {
        this.getOpenSourceProjectList()
      })
      const selectedRowKeys = removeArr(this.state.selectedRowKeys, id)
      this.setState({ selectedRowKeys })
    })
  }

  changeSwitchStatus = (checked, record) => {
    this.props.changeReleaseStatus({
      id: record.id,
      release: Number(checked),
    }).then(res => {
      if (res instanceof Error) { return }
      this.getOpenSourceProjectList()
    })
  }

  onShowSizeChange = (currentPage, pageSize) => {
    this.setState({ currentPage: 1, pageSize }, () => {
      this.getOpenSourceProjectList()
    })
  }

  changePage = (currentPage, pageSize) => {
    this.setState({ currentPage, pageSize }, () => {
      this.getOpenSourceProjectList()
    })
  }

  onShowSizeChangeLog = (currentPage, pageSize) => {
    const { ospId } = this.state
    this.setState({ currentPageLog: 1, pageSizeLog: pageSize }, () => {
      this.onExpand(true, ospId)
    })
  }

  onChangePageLog = (currentPage, pageSize) => {
    const { ospId } = this.state
    debugger
    this.setState({ currentPageLog: currentPage, pageSizeLog: pageSize }, () => {
      this.onExpand(true, ospId)
    })
  }

  render() {
    const {
      currentPage,
      pageSize,
      UpdateLogModalVisible,
      projectVisible,
      isEdit,
      expandedRowKeys,
      ospId,
      expandedRowRenderAgain,
      addLogSuccess,
    } = this.state

    log()

    const { openSourceProjectList, ospUpdateLogList, form, loading } = this.props
    const { getFieldDecorator } = form

    log(ospUpdateLogList)

    const levelArr = ['系统', '插件', '组件', '其他']

    const columns = [
      {
        title: '序号',
        key: 'xuhao',
        render(text, record, index) {
          return (
            <span>{(currentPage - 1) * pageSize + index + 1}</span>
          )
        },
      },
      {
        title: '项目名称',
        dataIndex: 'name',
        key: 'name',
        render(text, record) {
          const { introduction } = record
          return (
            <Popover
              content={introduction ? `简介：${introduction}` : '简介：暂无'}
              placement="right"
              trigger="hover"
              className="popover"
              overlayClassName="osp-popover"
            >
              <span style={{color: '#0366d6' }}>{text}</span>
            </Popover>
          )
        },
      },
      {
        title: '级别',
        dataIndex: 'level',
        key: 'level',
        render: (text, record) => {
          const index = record.level - 1
          return levelArr[index]
        },
      },
      { title: '地址', dataIndex: 'url', key: 'url', width: '30px' },
      { title: '版本', dataIndex: 'version', key: 'version' },
      {
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
      }, {
        title: '操作',
        key: 'operation',
        dataIndex: 'operation',
        render: (text, record) => {
          return (
            <OperatorIcons>
              <OperatorIcons.Icon title="编辑" type="edit" onClick={() => this.editProject(record)} />
              <OperatorIcons.Icon title="删除" type="delete" onClick={() => this.showConfirm(record.id)} />
            </OperatorIcons>
          )
        },
      },
    ];

    return (
      <div className="container">
        <div className="serch-area">
          <Row style={{ width: '1000px'}}>
            <Col span={5}>
              <FormItem labelCol={{ span: 4}} wrapperCol={{ span: 12}} >
                {getFieldDecorator('name', {
                  rules: [{}],
                })(
                  <Input placeholder="请输入项目名称" style={{ width: '180px' }} />,
                )}
              </FormItem>
            </Col>
            <Col span={7} style={{ left: '-7px' }}>
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
                      <Option value="1">创建时间</Option>
                      <Option value="2">更新时间</Option>
                    </Select>
                  )}
                </FormItem>
              </InputGroup>
            </Col>
            <Col span={1} style={{ left: '32px' }}>
              <FormItem>
                <Button type="primary" onClick={this.handleQuery}>查询</Button>
              </FormItem>
            </Col>
            <Col span={1} style={{ left: '76px' }}>
              <FormItem>
                <Button onClick={this.handleReset}>重置</Button>
              </FormItem>
            </Col>
          </Row>
        </div>
        <hr className="line-hr" />
        <HeaderBar>
          <HeaderBar.Left>
            <Button type="primary" onClick={() => this.addProject()}>添加</Button>
          </HeaderBar.Left>
        </HeaderBar>
        <Table
          loading={loading}
          columns={columns}
          expandedRowKeys={expandedRowKeys}
          onExpand={(expanded, record) => this.onExpand(expanded, record.id, true)}
          expandedRowRender={record => addLogSuccess && this.expandedRowRender(record)}
          onExpandedRowsChange={expandedRows => expandedRowRenderAgain && this.onExpandedRowsChange(expandedRows)}
          dataSource={openSourceProjectList.list}
          pagination={false}
        />
        <MyPagination
          current={currentPage}
          pageSize={pageSize}
          pageSizeOptions={['5', '10', '15', '20']}
          total={openSourceProjectList.count}
          onChange={this.changePage}
          onShowSizeChange={this.onShowSizeChange}
        />

        {/* 开源项目弹窗 */}
        <ProjectModal
          isEdit={isEdit}
          visible={projectVisible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
          wrappedComponentRef={(node) => this.projectModelRef = node}
        />

        {/* 更新日志弹窗 */}
        <UpdateLogModal
          onOk={() => this.onOkUpdateLogModal()}
          onCancel={() => this.onCancelUpdateLogModal()}
          visible={UpdateLogModalVisible}
          ospId={ospId}
          onDoSuccess={() => this.onDoSuccess(ospId)}
          wrappedComponentRef={(node) => this.updateLogModelRef = node}
        />
      </div>
    )
  }
}

export default OpenSourceProject