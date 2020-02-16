import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { Modal, Form, Table, Switch, Checkbox, Input, message } from 'antd'
import { transform, getCheckedNodeId, setNodeStatus, resetNodeStatus } from './util'
import { cloneDeep, indexOf, filter, isEmpty } from 'lodash'
import { noSpecialChar } from '@/utils/validator'
import { getMenuNodeTree, addRole, editRole } from '@/modules/role'

import './Index.less'

const CheckboxGroup = Checkbox.Group;

@Form.create()
@connect(
  state => ({
    menuNodeTree: state.role.menuNodeTree,
  }),
  dispatch => bindActionCreators({
    getMenuNodeTree,
    addRole,
    editRole,
  }, dispatch),
  null,
  { forwardRef: true },
)

class RoleModal extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      newData: [],
      editData: null,
    };
  }

  static getDerivedStateFromProps(props, state) {
    if (props.userList !== state.userList) {
      return { userList: props.userList }
    }

    return null
  }

  componentDidMount() {
    this.props.getMenuNodeTree().then(res => {
      if (res instanceof Error) return

      const data = res.payload && res.payload.tree || []
      let newData = transform(data);
      // 默认勾选
      const defaultChecked = [1, 11, 1103, 2, 21, 2101, 2103];
      newData = setNodeStatus(newData, defaultChecked);

      this.setState({ newData });
    })
  }

  /** 初始值设置 */
  setFieldsValue = (record) => {
    const { setFieldsValue } = this.props.form
    const { newData } = this.state
    if(record) {
      setFieldsValue({ name: record.name })
      const data = setNodeStatus(newData, record.nodes);
      this.setState({
        editData: record,
        newData: data,
      })
    } else {
      setFieldsValue({ name: null })
      const data = resetNodeStatus(newData);
      this.setState({
        editData: null,
        newData: data,
      })
    }
  }

  /** 添加/编辑 角色 */
  addRole(isEdit) {
    const { onOk, onChange } = this.props
    const { newData, editData } = this.state
    const checkedId = getCheckedNodeId(newData)

    const { getFieldsValue } = this.props.form
    const { name } = getFieldsValue()

    const param = {
      name,
      status: 1,
      nodes: checkedId,
    }

    if(isEdit) {
      param.id = editData.id
      param.status = editData.status
      this.props.editRole(param).then((res) => {
        if (res instanceof Error) return
        message.success('修改成功', 1, () => {
          this.setState({ editData: null })
          onOk()
          onChange()
        })
      })
    } else {
      this.props.addRole(param).then((res) => {
        if (res instanceof Error) return
        message.success('添加成功', 1, () => {
          onOk()
          onChange()
        })
      })
    }
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

  onOk(isEdit) {
    this.props.form.validateFieldsAndScroll((err) => {
      if (!err) {
        this.addRole(isEdit)
      }
    })
  }

  render() {
    const { visible, onCancel } = this.props
    const { getFieldDecorator } = this.props.form;
    const { newData, editData } = this.state;

    const columns = [
      {
        title: '一级菜单',
        dataIndex: 'menu_1_name',
        render: (text, row, index) => {
          return {
            children: (
              <div>
                <span style={{ marginRight: 8 }}>{row.menu_1_name}</span>
                <Switch
                  checked={row.menu_1_status ===1 }
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
                checked={row.menu_2_status ===1 }
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
        onOk={() => this.onOk(editData)}
        title={isEmpty(editData) ? '添加角色' : '编辑角色'}
        maskClosable={false}
        className='container'
      >
        <Form >
          <Form.Item label="角色名" {...formItemLayout} >
            {getFieldDecorator('name', {
              rules: [{
                required: true,
                message: '请输入角色名',
                whitespace: true,
              }, {
                message: '不能超过12个字符',
                max: 12,
              }, noSpecialChar],
            })(<Input style={{ width: 300 }} maxLength={12} />)}
          </Form.Item>
        </Form>
        <Table
          columns={columns}
          dataSource={newData}
          bordered
          rowKey={record => record.menu_2_id}
          pagination={false}
        />
      </Modal>
    )
  }
}

export default RoleModal

