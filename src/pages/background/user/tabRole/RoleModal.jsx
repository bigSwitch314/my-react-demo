import React from 'react'
import { connect } from 'react-redux'
import { Modal, Form, Table, Switch, Checkbox, Input } from 'antd'
import { transform, getCheckedNodeId, setNodeStatus } from './util'
import { cloneDeep, indexOf, filter, isEmpty } from 'lodash'
import { noSpecialChar } from '@/utils/validator'

const CheckboxGroup = Checkbox.Group;

const data = [
  {
    id: 1,
    name: '文章管理',
    pId: 0,
    children: [
      {
        id: 11,
        name: '原创文章',
        pId: 1,
        children: [
          { id: 1101, name: '添加', pId: 11, children: [] },
          { id: 1102, name: '删除', pId: 11, children: [] },
          { id: 1103, name: '导入', pId: 11, children: [] },
        ],
      },
      {
        id: 12,
        name: '转载文章',
        pId: 1,
        children: [
          { id: 1201, name: '编辑', pId: 12, children: [] },
          { id: 1202, name: '导出', pId: 12, children: [] },
        ],
      },
    ],
  },
  {
    id: 2,
    name: '系统设置',
    pId: 0,
    children: [
      {
        id: 21,
        name: '权限节点',
        pId: 2,
        children: [
          { id: 2101, name: '添加', pId: 21, children: [] },
          { id: 2102, name: '编辑', pId: 21, children: [] },
          { id: 2103, name: '删除', pId: 21, children: [] },
          { id: 2104, name: '批量导出', pId: 21, children: [] },
        ],
      },
    ],
  },
  {
    id: 3,
    name: '日志管理',
    pId: 0,
    children: [
      {
        id: 31,
        name: '登陆日志',
        pId: 3,
        children: [
          { id: 3101, name: '查看', pId: 31, children: [] },
          { id: 3102, name: '删除', pId: 31, children: [] },
          { id: 3103, name: '导出', pId: 31, children: [] },
        ],
      },
      {
        id: 32,
        name: '操作日志',
        pId: 3,
        children: [
          { id: 3201, name: '查看', pId: 32, children: [] },
          { id: 3202, name: '导出', pId: 32, children: [] },
        ],
      },
      {
        id: 33,
        name: '系统日志',
        pId: 3,
        children: [
          { id: 3301, name: '查看', pId: 33, children: [] },
          { id: 3302, name: '导出', pId: 33, children: [] },
        ],
      },
    ],
  },
];

@Form.create()
@connect(
  state => ({
    categoryList: state.category.categoryList,
  }),
)

class RoleModal extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      newData: [],
    };
  }

  static getDerivedStateFromProps(props, state) {
    if (props.userList !== state.userList) {
      return { userList: props.userList }
    }

    return null
  }

  componentDidMount() {
    let newData = transform(data);
    // 默认勾选
    const defaultChecked = [1, 11, 1103, 2, 21, 2101, 2103];
    newData = setNodeStatus(newData, defaultChecked);

    this.setState({ newData });
  }

  /** 一二级菜单 开启/关闭 */
  changeSwitchStatus(checked, index, type) {
    const { newData } = this.state;
    const cloneNewData = cloneDeep(newData);

    if (type === 1) {
      cloneNewData[index].menu_1_status = checked ? 1 : 0;
      for (let i = index + 1; i < cloneNewData.length; i++) {
        if (cloneNewData[i].menu_1_id === cloneNewData[index].menu_1_id) {
          cloneNewData[i].menu_1_status = checked ? 1 : 0;
        }
      }
      // 联动关闭
      if (checked === false) {
        cloneNewData[index].menu_2_status = 0;
        cloneNewData[index].node = cloneNewData[index].node.map(item => {
          item.status = 0;
          return item;
        });
        for (let j = 1; j < cloneNewData[index].rowSpan; j++) {
          cloneNewData[index + j].menu_2_status = 0;
          cloneNewData[index + j].node = cloneNewData[index + j].node.map(
            item => {
              item.status = 0;
              return item;
            }
          );
        }
      }
    } else if (type === 2) {
      cloneNewData[index].menu_2_status = checked ? 1 : 0;
      if (checked === false) {
        cloneNewData[index].node = cloneNewData[index].node.map(item => {
          item.status = 0;
          return item;
        });
      }
    }

    this.setState({ newData: cloneNewData })
  }

  /** 功能权限勾选 */
  onNodeChange(checkedKeys, index) {
    const { newData } = this.state;
    const cloneNewData = cloneDeep(newData);
    cloneNewData[index].node.map(item => {
      const result = indexOf(checkedKeys, item.id)
      item.status = result === -1 ? 0 : 1;
      return item;
    });

    this.setState({ newData: cloneNewData })
  }

  onOk() {
    const { newData } = this.state;
    const checkedId = getCheckedNodeId(newData)

    alert(checkedId);
    console.log('checkedId----------------------', checkedId)
  }

  render() {
    const { visible, onCancel, onOk, editData } = this.props
    const { getFieldDecorator } = this.props.form;
    const { newData } = this.state;

    const columns = [
      {
        title: '一级菜单',
        dataIndex: 'menu_1_name',
        render: (text, row, index) => {
          console.log(row.rowSpan);
          return {
            children: (
              <div>
                <span style={{ marginRight: 8 }}>{row.menu_1_name}</span>
                <Switch
                  checked={row.menu_1_status}
                  onChange={checked =>
                    this.changeSwitchStatus(checked, index, 1)
                  }
                />
              </div>
            ),
            props: { rowSpan: row.rowSpan },
          }
        },
      },
      {
        title: '二级菜单',
        dataIndex: 'menu_2_name',
        render: (text, row, index) => {
          return (
            <div>
              <span style={{ marginRight: 8 }}>{row.menu_2_name}</span>
              <Switch
                disabled={row.menu_1_status === 0}
                checked={row.menu_2_status}
                onChange={checked => this.changeSwitchStatus(checked, index, 2)}
              />
            </div>
          );
        },
      },
      {
        title: '功能权限',
        dataIndex: 'node',
        render: (text, row, index) => {
          const nodeFilter = filter(row.node, item => item.status === 1);
          const value = nodeFilter.length
            ? nodeFilter.map(item => item.id)
            : [];
          return (
            <div>
              <CheckboxGroup
                disabled={row.menu_2_status === 0}
                value={value}
                onChange={checkedKeys => this.onNodeChange(checkedKeys, index)}
              >
                {row.node &&
                  row.node.map(item => (
                    <Checkbox value={item.id} key={item.id}>{item.name}</Checkbox>
                  ))}
              </CheckboxGroup>
            </div>
          );
        },
      },
    ];

    const formItemLayout = {
      labelCol: {
        sm: { span: 2 },
      },
      wrapperCol: {
        sm: { span: 20 },
      },
    }

    return (
      <Modal
        width={900}
        visible={visible}
        onCancel={onCancel}
        onOk={onOk}
        title={isEmpty(editData) ? '添加角色' : '编辑角色'}
        maskClosable={false}
        className='container'
      >
        <Form >
          <Form.Item label="角色名" {...formItemLayout} >
            {getFieldDecorator('roleName', {
              rules: [{
                required: true,
                message: '请输入角色名',
                whitespace: true,
              }, {
                message: '不能超过50个字符',
                max: 50,
              }, noSpecialChar],
            })(<Input style={{ width: 300 }}/>)}
          </Form.Item>
        </Form>
        <Table
          columns={columns}
          dataSource={newData}
          bordered
          pagination={false}
        />
      </Modal>
    )
  }
}

export default RoleModal

