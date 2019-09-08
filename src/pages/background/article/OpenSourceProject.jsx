import React from 'react'
import { Table, Switch, Row, Col, Form, Select, Input, DatePicker, Button, List, Icon, Pagination } from 'antd'
import OperatorIcons from 'components/shared/OperatorIcon'
import HeaderBar from 'components/shared/HeaderBar'
import UpdateLogModal from './modal/UpdateLogModal'
<<<<<<< HEAD
=======
import ProjectModal from './modal/ProjectModal'
>>>>>>> fed644f73e4fa13c70b7d0cb8918fa2dd412bb0e
import './style/OpenSourceProject.less'

const FormItem = Form.Item
const Option = Select.Option
const InputGroup = Input.Group
const RangePicker = DatePicker.RangePicker
const ListItem = List.Item
const ListItemMeta = List.Item.Meta

@Form.create()
class OpenSourceProject extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      currentPage: 1,
      pageSize: 5,
<<<<<<< HEAD
      UpdateLogModalVisible: false,
=======
      isEdit: false,
      UpdateLogModalVisible: false,
      projectVisible: false,
>>>>>>> fed644f73e4fa13c70b7d0cb8918fa2dd412bb0e
    }
    this.projectModelRef = React.createRef()
  }

  static getDerivedStateFromProps(props, state) {
    if (props.userList !== state.userList) {
      return { userList: props.userList }
    }

    return null
  }

  componentDidMount() {
    log('4444444444444444444444444')

  }

  showUpdateLogModal() {
    this.setState({ UpdateLogModalVisible: true })
  }

  onOkUpdateLogModal() {
    this.setState({ UpdateLogModalVisible: false })
  }

  onCancelUpdateLogModal() {
    this.setState({ UpdateLogModalVisible: false })
  }

<<<<<<< HEAD
=======
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
    }, {})
  }

  /** 关闭开源项目弹窗 */
  handleCancel = () => {
    this.setState({ projectVisible: false })
  }

>>>>>>> fed644f73e4fa13c70b7d0cb8918fa2dd412bb0e
  expandedRowRender(record) {
    const data = [
      {
        title: 'v_2.0.12  2019-06-29',
      },
      {
        title: 'v_2.0.11  2019-06-21',
      },
      {
        title: 'v_2.0.10  2019-06-18',
      },
    ]

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
        <React.Fragment className="header">
          <div>更新日志 </div>
          <div className="add-log">
            <Icon type="plus" title="添加" onClick={() => this.showUpdateLogModal()} />
          </div>
<<<<<<< HEAD
          <div>
=======
          <div className="pagination">
>>>>>>> fed644f73e4fa13c70b7d0cb8918fa2dd412bb0e
            <Pagination simple defaultCurrent={2} total={50} />
          </div>
        </React.Fragment>
      )
    }

<<<<<<< HEAD
=======
    const getTitle = (title) => {
      return (
        <div className="title">
          <span>{title}</span>
          <Icon type="edit" title="添加" onClick={() => this.showUpdateLogModal()} style={{ margin: '0px 20px' }} className="title-icon"/>
          <Icon type="delete" title="添加" onClick={null} className="title-icon"/>
        </div>
      )
    }

>>>>>>> fed644f73e4fa13c70b7d0cb8918fa2dd412bb0e
    return (
      <List
        header={getHeadr()}
        itemLayout="horizontal"
        dataSource={data}
        renderItem={item => (
          <ListItem>
            <ListItemMeta
<<<<<<< HEAD
              title={item.title}
=======
              title={getTitle(item.title)}
>>>>>>> fed644f73e4fa13c70b7d0cb8918fa2dd412bb0e
              description={getDescription(item.updateLog)}
            />
          </ListItem>
        )}
      />
    )
  }

  render() {
    const {
      currentPage,
      pageSize,
      UpdateLogModalVisible,
<<<<<<< HEAD
=======
      projectVisible,
      isEdit,
>>>>>>> fed644f73e4fa13c70b7d0cb8918fa2dd412bb0e
    } = this.state

    const { getFieldDecorator } = this.props.form
    const { loading } = this.props

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
      { title: '项目名称', dataIndex: 'name', key: 'name' },
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
      },{
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
      }
    ];

    const data = [
      {
        key: 1,
        name: '博客系统',
        introduction: '博客系统分为前台和后台，前端采用react+antd+redux，后端使用php+mysql+redis+nginx，使用阿里云主机部署。',
        level: 1,
        url: 'https://github.com/bigSwitch314/blog-fe',
        version: 'V_2.0',
        release: 1,
        edit_time: '2019-05-23 11:29',
        create_time: '2019-03-14 16:02',
      },
      {
        key: 2,
        name: '博客系统2',
        introduction: '博客系统分为前台和后台，前端采用react+antd+redux，后端使用php+mysql+redis+nginx，使用阿里云主机部署。',
        level: 1,
        url: 'https://github.com/bigSwitch314/blog-fe',
        version: 'V_2.0',
        release: 1,
        edit_time: '2019-05-23 11:29',
        create_time: '2019-03-14 16:02',
      },
      {
        key: 3,
        name: '博客系统3',
        introduction: '博客系统分为前台和后台，前端采用react+antd+redux，后端使用php+mysql+redis+nginx，使用阿里云主机部署。',
        level: 1,
        url: 'https://github.com/bigSwitch314/blog-fe',
        version: 'V_2.0',
        release: 1,
        edit_time: '2019-05-23 11:29',
        create_time: '2019-03-14 16:02',
      },
    ];
    return (
      <div className="container">
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
            <Button type="primary" onClick={() => this.addProject()}>添加</Button>
          </HeaderBar.Left>
        </HeaderBar>
        <Table
          columns={columns}
          expandedRowRender={record => this.expandedRowRender(record)}
          dataSource={data}
        />

<<<<<<< HEAD
=======
        {/* 开源项目弹窗 */}
        <ProjectModal
          isEdit={isEdit}
          visible={projectVisible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
          wrappedComponentRef={(node) => this.projectModelRef = node}
        />

>>>>>>> fed644f73e4fa13c70b7d0cb8918fa2dd412bb0e
        {/* 更新日志弹窗 */}
        <UpdateLogModal
          onOk={() => this.onOkUpdateLogModal()}
          onCancel={() => this.onCancelUpdateLogModal()}
          visible={UpdateLogModalVisible}
        />
      </div>
    )
  }
}

export default OpenSourceProject