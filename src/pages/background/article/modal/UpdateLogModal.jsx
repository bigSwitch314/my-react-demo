import React from 'react'
import { connect } from 'react-redux'
import { Modal, Form, Input, Icon, Button, DatePicker } from 'antd'
import { addOspUpdateLog } from '@/modules/ospUpdateLog'
import '../style/UpdateLogModal.less'
import moment from 'moment'

const FormItem = Form.Item
let id = 1


@Form.create()
@connect(
  state => ({
    categoryList: state.category.categoryList,
  }),
  { addOspUpdateLog },
  null,
  { forwardRef: true },
)

class PreviewModal extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      article: null,
      categoryName: null,
      keyArr: [0],
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

  setFieldsValue = (isEdit, editData) => {
    const { setFieldsValue } = this.props.form
    if(isEdit) {
      setFieldsValue({
        version: editData.version,
        time: moment(editData.create_time, 'YYYY/MM/DD'),
      })
      const keyArr = Array(editData.content.length).fill().map((e, i) => i)
      this.setState({ editData, keyArr }, () => {
        setFieldsValue({names: editData.content})
      })
    } else {
      setFieldsValue({
        version: '',
        time: null,
      })
    }
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

  onOkHandler(e) {
    e.preventDefault();
    const { ospId, form, onOk, addOspUpdateLog, onDoSuccess } = this.props
    const { validateFields, resetFields } = form

    validateFields((err, values) => {
      if (!err) {
        const { names, time, version } = values;
        const createTime = time ? time.format('YYYY-MM-DD HH:mm:ss') : ''
        const params = {
          osp_id: ospId,
          version,
          create_time: createTime,
          content: names,
        }
        addOspUpdateLog(params).then(res => {
          // debugger
          // if (res.errcode === 0) onDoSuccess()
          onDoSuccess()
        })
      }
    });

    onOk()
    setTimeout(() => {
      resetFields()
    }, 1000)
  }


  render() {
    const { visible, onCancel } = this.props
    const { keyArr } = this.state
    const { getFieldDecorator, getFieldValue } = this.props.form;

    const formItemLayoutWithOutLabel = {
      wrapperCol: {
        xs: { span: 24, offset: 0 },
        sm: { span: 20, offset: 4 },
      },
    };

    getFieldDecorator('keys', { initialValue: keyArr });
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
        })(<Input placeholder="请输入更新日志" style={{ width: '60%', marginRight: 8 }} />)}
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
        onOk={(e) => this.onOkHandler(e)}
        title={'添加更新日志'}
        maskClosable={false}
        className="container"
      >
        <Form>
          <FormItem {...formItemLayoutWithOutLabel} >
            {getFieldDecorator('version', {
            })(
              <Input placeholder="请输入版本号" style={{ width: '60%', marginRight: 8 }} />
            )}
          </FormItem>
          <FormItem {...formItemLayoutWithOutLabel} >
            {getFieldDecorator('time', {
            })(
              <DatePicker placeholder="请选择日期" style={{ width: '60%', marginRight: 8 }} />
            )}
          </FormItem>
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

