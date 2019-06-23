import React from 'react'
import { Table, Switch, Row, Col, Form, Select, Input, DatePicker, Button } from 'antd'
import OperatorIcons from 'components/shared/OperatorIcon'
import HeaderBar from 'components/shared/HeaderBar'
import './style/OpenSourceProject.less'

const FormItem = Form.Item
const Option = Select.Option
const InputGroup = Input.Group
const { RangePicker } = DatePicker

@Form.create()
class OpenSourceProject extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      currentPage: 1,
      pageSize: 5,
    }
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

  expandedRowRender(record) {
    return (
      <p style={{ margin: 0 }}>{record.name}</p>
    )
  }

  render() {
    const {
      currentPage,
      pageSize,
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
          const index = record.level + 1
          return levelArr.slice(index, index + 1)
        },
      },
      { title: '地址', dataIndex: 'url', key: 'url', width: '30px' },
      { title: '版本', dataIndex: 'version', key: 'version' },
      {
        title: '是否开源',
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
              <OperatorIcons.Icon title="编辑" type="edit" onClick={() => this.editArticle(record)} />
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
            <Button type="primary" onClick={() => this.addArticle()}>添加</Button>
          </HeaderBar.Left>
        </HeaderBar>
        <Table
          columns={columns}
          expandedRowRender={record => this.expandedRowRender(record)}
          dataSource={data}
        />
      </div>
    )
  }
}

export default OpenSourceProject
