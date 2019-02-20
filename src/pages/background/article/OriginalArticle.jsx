import React from 'react'
import { Table, Form, Switch, Row, Col, Input } from 'antd'
import OperatorIcons from 'components/shared/OperatorIcon'
import Pagination from 'components/shared/Pagination'

const FormItem = Form.Item

// @Form.create()

class OriginalArticle extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      currentPage: 1,
      pageSize: 10,
    }
  }

  static getDerivedStateFromProps(props, state) {
    if (props.userList !== state.userList) {
      return { userList: props.userList }
    }

    return null
  }

  componentDidMount() {

  }

  render() {
    const { currentPage, pageSize } = this.state
    const { getFieldDecorator } = this.props.form

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
      dataIndex: 'category',
    }, {
      title: '标签',
      dataIndex: 'label',
    }, {
      title: '阅读次数',
      dataIndex: 'readNumber',
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
      dataIndex: 'updateTime',
    }, {
      title: '创建时间',
      dataIndex: 'createTime',
    },{
      title: '操作',
      key: 'operation',
      dataIndex: 'operation',
      render: (text, record) => {
        return (
          <OperatorIcons>
            <OperatorIcons.Icon title="预览" type="eye" onClick={() => this.modalVisbileChange(record)} />
            <OperatorIcons.Icon title="编辑" type="edit" onClick={() => this.modalVisbileChange(record)} />
            <OperatorIcons.Icon title="删除" type="delete" onClick={() => this.showConfirm(record.id)} />
          </OperatorIcons>
        )
      },
    }]

    const data = [{
      'title': 'php函数进阶',
      'category': 'php',
      'label': 'fn',
      'readNumber': 21,
      'release': 1,
      'updateTime': '2019-01-15',
      'createTime': '2019-01-11',
    }, {
      'title': 'redis锁应用',
      'category': 'redis',
      'label': 'ssa',
      'readNumber': 9,
      'release': 0,
      'updateTime': '2019-01-24',
      'createTime': '2019-01-07',
    }]


    return (
      <React.Fragment>
        <div className="role-manage">
          <div className="serchArea">
            <Row>
              <Col span={8}>
                <FormItem label="标题" lableCol={{ span: 0}} wrapperCol={{ span: 6}} >
                  {getFieldDecorator('title', {
                    rules: [{}],
                  })(
                    <Input style={{ width: '200px' }} />,
                  )}
                </FormItem>
              </Col>
              <Col span={8}>col-8</Col>
              <Col span={8}>col-8</Col>
            </Row>
          </div>
          <Table
            rowKey={record => record.id}
            // loading={loading}
            columns={columns}
            dataSource={data}
            // rowSelection={rowSelection}
            pagination={false}
          />
          <Pagination
            current={currentPage}
            pageSize={pageSize}
            pageSizeOptions={['5', '10', '15', '20']}
            total={20}
            onChange={this.changePage}
            onShowSizeChange={this.onShowSizeChange}
          />
        </div>
      </React.Fragment>
    )
  }
}

export default Form.create()(OriginalArticle)
