import React from 'react'
import { Form, Modal, Input, Radio, Row, Col, Checkbox, Button } from 'antd'
import '../style/ArticleModal.less'

const FormItem = Form.Item
const RadioGroup = Radio.Group
const CheckboxGroup = Checkbox.Group
const { TextArea } = Input;


const formItemLayout = {
  labelCol: {
    sm: { span: 2 },
  },
  wrapperCol: {
    sm: { span: 12 },
  },
}

const formItemLayoutRadio = {
  labelCol: {
    sm: { span: 2 },
  },
  wrapperCol: {
    sm: { span: 20 },
  },
}

const formItemLayoutContent = {
  labelCol: {
    sm: { span: 2 },
  },
  wrapperCol: {
    sm: { span: 21 },
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
      category: null
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

  onRadioChange = (e) => {
    console.log('radio checked', e.target.value);
    this.setState({
      value: e.target.value,
    });
  }

  render() {
    const { category, type} = this.state
    const { visible, onOk, onCancel } = this.props
    const { getFieldDecorator } = this.props.form

    const CategoryOptions = [
      { label: 'A', value: 1 },
      { label: 'B', value: 2 },
      { label: 'C', value: 3 },
      { label: 'D', value: 4 },
      { label: 'E', value: 5 },
      { label: 'F', value: 6 },
      // { label: 'G', value: 7 },
      // { label: 'H', value: 8 },
      // { label: 'I', value: 9 },
      // { label: 'J1', value: 10 },
      // { label: 'J2', value: 11 },
      // { label: 'J3', value: 12 },
      // { label: 'J4', value: 13 },
      // { label: 'J5', value: 10 },
      // { label: 'J6', value: 11 },
      // { label: 'J7', value: 12 },
      // { label: 'J8', value: 13 },
    ]

    const labelOptions = [
      { label: 'labelB', value: 2 },
      { label: 'labelC', value: 3 },
      { label: 'labelD', value: 4 },
      { label: 'labelE', value: 5 },
      { label: 'labelF', value: 6 },
      { label: 'labelA', value: 1 },
      { label: 'labelG', value: 7 },
      { label: 'labelH', value: 8 },
      { label: 'labelI', value: 9 },
      { label: 'labelJ1', value: 10 },
      { label: 'labelJ2', value: 11 },
      { label: 'labelJ3', value: 12 },
      { label: 'labelJ4', value: 13 },
    ]

    return (
      <Modal
        width={920}
        title="添加文章"
        visible={visible}
        onOk={onOk}
        onCancel={onCancel}
        okText="保存"
      >
        <div className="article-modal">
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
            {...formItemLayoutRadio}
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
              <RadioGroup
                onChange={this.onRadioChange}
                value={category}
              >
                <Row align="center">
                  {CategoryOptions.map(item => (
                    <Col key={item.value} span={4} style={{ height: 30 }}>
                      <Radio value={item.value}>{item.label}</Radio>
                    </Col>
                  ))}
                </Row>
              </RadioGroup>,
            )}
          </FormItem>
          <FormItem
            label="标签"
            {...formItemLayoutRadio}
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
              <CheckboxGroup
                // options={acsOptions}
                value={[1,3]}
                onChange={this.onLabelChange}
              >
                <Row align="center">
                  {labelOptions.map(item => (
                    <Col key={item.value} span={4} style={{ height: 30 }}>
                      <Checkbox value={item.value}>
                        {item.label}
                      </Checkbox>
                    </Col>
                  ))}
                </Row>
              </CheckboxGroup>,
            )}
          </FormItem>
          <FormItem
            label="发布"
            {...formItemLayoutRadio}
          >
            {getFieldDecorator('category', {
              rules: [{
                required: true,
                message: '请选择类型',
                whitespace: true,
              }, {
                // validator: this.validateToNextPassword,
              }],
            })(
              <RadioGroup
                onChange={this.onTypeChange}
                value={type}
              >
                <Radio value={1}>是</Radio>
                <Radio value={2}>否</Radio>
              </RadioGroup>,
            )}
          </FormItem> 
          <span className="edit">编辑</span>
          <FormItem
            label="内容"
            {...formItemLayoutContent}
          >
            {getFieldDecorator('content', {
              rules: [{
                required: true,
                message: '请输入标题',
                whitespace: true,
              }, {
                // validator: this.validateOldPassword,
              }],
            })(
              <TextArea autosize={{ minRows: 4 }}/>,
            )}
          </FormItem>
        </div>
      </Modal>
    )
  }
}

export default Form.create()(AddArticle)

