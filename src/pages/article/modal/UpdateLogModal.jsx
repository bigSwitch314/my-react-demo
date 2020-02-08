import React from 'react'
import { connect } from 'react-redux'
import { Modal, Form, Input, Icon, Button, DatePicker } from 'antd'
import { addOspUpdateLog, editOspUpdateLog } from '@/modules/ospUpdateLog'
import '../style/UpdateLogModal.less'
import moment from 'moment'
import { noSpecialChar } from '@/utils/validator'

const FormItem = Form.Item


@Form.create()
@connect(
  state => ({
    categoryList: state.category.categoryList,
  }),
  {
    addOspUpdateLog,
    editOspUpdateLog,
  },
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
      editData: null,
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
      const keyArr = Array(editData.content.length).fill().map((e, i) => i)
      setFieldsValue({ keys: keyArr })
      this.setState({ editData }, () => {
        setFieldsValue({
          names: editData.content,
          version: editData.version,
          time: moment(editData.create_time, 'YYYY/MM/DD'),
        })
      })
    } else {
      setFieldsValue({ keys: [0] })
      this.setState({ editData: null }, () => {
        setFieldsValue({
          names: [''],
          version: '',
          time: null,
        })
      })
    }
  }

  remove = k => {
    const { form } = this.props;
    const keys = form.getFieldValue('keys')
    if (keys.length === 1) {
      return
    }
    form.setFieldsValue({
      keys: keys.filter(key => key !== k),
    });
  };

  add = () => {
    const { form } = this.props;
    const keys = form.getFieldValue('keys')
    const max = Math.max(...keys)
    const nextKeys = keys.concat(max + 1)
    form.setFieldsValue({
      keys: nextKeys,
    })
  }

  onOkHandler(e) {
    e.preventDefault();
    const { editData } = this.state
    const { ospId, form, onOk, addOspUpdateLog, editOspUpdateLog, onDoSuccess } = this.props
    const { validateFieldsAndScroll, resetFields, getFieldsValue } = form

    validateFieldsAndScroll((err) => {
      if (!err) {
        const { names, time, version } = getFieldsValue()
        const createTime = time ? time.format('YYYY-MM-DD HH:mm:ss') : ''
        const params = {
          osp_id: ospId,
          version,
          create_time: createTime,
          content: names.filter(Boolean),
        }
        if (editData) {
          params.id = editData.id
          editOspUpdateLog(params).then(res => {
            if (res instanceof Error) return
            onDoSuccess(true)
            onOk()
            setTimeout(() => {
              resetFields()
            }, 1000)
          })
        } else {
          addOspUpdateLog(params).then(res => {
            if (res instanceof Error) return
            onDoSuccess(false)
            onOk()
            setTimeout(() => {
              resetFields()
            }, 1000)
          })
        }
      }
    })
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
          rules: [{
            required: true,
            message: '请输入更新日志',
            whitespace: true,
          }, noSpecialChar],
        })(
          <Input
            placeholder="请输入更新日志"
            style={{ width: '60%', marginRight: 8 }}
            maxLength={32}
          />)}
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
        destroyOnClose={true}
      >
        <Form>
          <FormItem {...formItemLayoutWithOutLabel} >
            {getFieldDecorator('version', {
              rules: [{
                required: true,
                message: '请输入版本号',
                whitespace: true,
              }],
            })(
              <Input placeholder="请输入版本号" style={{ width: '60%', marginRight: 8 }} />
            )}
          </FormItem>
          <FormItem {...formItemLayoutWithOutLabel} >
            {getFieldDecorator('time', {
              rules: [{
                required: true,
                message: '请选择日期',
                type: 'object',
                whitespace: true,
              }],
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

