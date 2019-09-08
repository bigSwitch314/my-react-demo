import React from 'react'
import { connect } from 'react-redux'
import { Modal, Form, Input, Icon, Button } from 'antd'
import '../style/UpdateLogModal.less'

let id = 3;


@Form.create()
@connect(
  state => ({
    categoryList: state.category.categoryList,
  }),
  null,
  null,
  { forwardRef: true },
)

class PreviewModal extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      article: null,
      categoryName: null,
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

  remove = k => {
    const { form } = this.props;
    // can use data-binding to get
    const keys = form.getFieldValue('keys');
    // We need at least one passenger
    if (keys.length === 1) {
      return;
    }

    // can use data-binding to set
    form.setFieldsValue({
      keys: keys.filter(key => key !== k),
    });
  };

  add = () => {
    const { form } = this.props;
    // can use data-binding to get
    const keys = form.getFieldValue('keys');
    const nextKeys = keys.concat(id++);
    // can use data-binding to set
    // important! notify form to detect changes
    form.setFieldsValue({
      keys: nextKeys,
    });
  };

  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        const { keys, names } = values;
        console.log('Received values of form: ', values);
        console.log('Merged values:', keys.map(key => names[key]));
      }
    });
  };


  render() {
    const { visible, onCancel, onOk } = this.props
    const { getFieldDecorator, getFieldValue } = this.props.form;

    const formItemLayoutWithOutLabel = {
      wrapperCol: {
        xs: { span: 24, offset: 0 },
        sm: { span: 20, offset: 4 },
      },
    };
    getFieldDecorator('keys', { initialValue: [0, 1, 2] });
    const keys = getFieldValue('keys');
    const formItems = keys.map(k => (
      <Form.Item
        {...formItemLayoutWithOutLabel}
        required={false}
        key={k}
      >
        {getFieldDecorator(`names[${k}]`, {
          validateTrigger: ['onChange', 'onBlur'],
          rules: [
            {
              required: true,
              whitespace: true,
              message: "Please input passenger's name or delete this field.",
            },
          ],
        })(<Input placeholder="Update Log" style={{ width: '60%', marginRight: 8 }} />)}
        {keys.length > 1 ? (
          <Icon
            className="dynamic-delete-button"
            type="minus-circle-o"
            onClick={() => this.remove(k)}
          />
        ) : null}
      </Form.Item>
    ));

    return (
      <Modal
        width={600}
        visible={visible}
        onCancel={onCancel}
        onOk={onOk}
        title={'添加更新日志'}
        maskClosable={false}
        className="container"
      >
        <Form onSubmit={this.handleSubmit}>
          {formItems}
          <Form.Item {...formItemLayoutWithOutLabel}>
            <Button type="dashed" onClick={this.add} style={{ width: '60%' }}>
              <Icon type="plus" /> Add
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    )
  }
}

export default PreviewModal

