import React from 'react'
import { Form, Modal, Input } from 'antd'
import '../style/ArticleModal.less'

const FormItem = Form.Item

const formItemLayout = {
  labelCol: {
    sm: { span: 2 },
  },
  wrapperCol: {
    sm: { span: 12 },
  },
}

// @Form.create()

class AddArticle extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      currentPage: 1,
      pageSize: 10,
      selectedRowKeys: [],
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
    const { visible, onOk, onCancel } = this.props
    const { getFieldDecorator } = this.props.form
    return (
      <div className="origin-article">
        <Modal
          width={800}
          title="添加文章"
          visible={visible}
          onOk={onOk}
          onCancel={onCancel}
          okText="保存"
        >
          <div style={{ position: 'relative' }}>
            <FormItem
              label="标题"
              {...formItemLayout}
            >
              {getFieldDecorator('title', {
                rules: [{
                  required: true,
                  message: '请输入标题',
                  whitespace: true,
                }, {
                  // validator: this.validateOldPassword,
                }],
              })(
                <Input />,
              )}
            </FormItem>
            <FormItem
              label="分类"
              {...formItemLayout}
            >
              {getFieldDecorator('category', {
                rules: [{
                  required: true,
                  message: '请选择分类',
                  whitespace: true,
                }, {
                  // validator: this.validateToNextPassword,
                }],
              })(
                <Input />,
              )}
            </FormItem>
            <FormItem
              label="标签"
              {...formItemLayout}
            >
              {getFieldDecorator('label', {
                rules: [{
                  required: false,
                  // message: '请选择标签',
                  // whitespace: true,
                }, {
                  //  validator: this.compareToFirstPassword
                }],
              })(
                <Input />,
              )}
            </FormItem>
          </div>
        </Modal>
      </div>
    )
  }
}

export default Form.create()(AddArticle)

{/* <Checkbox
  indeterminate={linkageAcs.indeterminate}
  onChange={this.onAcsCheckAllChange}
  checked={linkageAcs.checkAll}
>
  门禁点
</Checkbox>
<CheckboxGroup
  // options={acsOptions}
  value={linkageAcs.ids}
  onChange={this.onAcsChange}
>
  <Row align="center">
    {acsOptions.map(item => (
      <Col key={item.value} span={24} style={{ height: 30 }}>
        <Checkbox value={item.value}>
          <span title={getStrLength(item.label) > 12 ? item.label : ''}>
            {cutStr(item.label, 12)}
          </span>
        </Checkbox>
        <Switch
          checkedChildren="开"
          unCheckedChildren="关"
          style={{ position: 'relative', left: 155, top: -34, width: 54 }}
          checked={acsAction && (acsAction[item.value] || false)}
          onChange={(value) => this.onSwitchChange(value, item.value)}
        />
      </Col>
    ))}
  </Row>
</CheckboxGroup> */}

