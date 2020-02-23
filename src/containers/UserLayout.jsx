import React from 'react'
import { connect } from 'react-redux'
import { Form, Icon, Input, Button, Row, Col } from 'antd'
import { setLogin } from '../components/Authentication/util'
import { login } from '@/modules/login'
import './style/UserLayout.less'

const FormItem = Form.Item
const baseUrl = 'http://bigswitch314.cn:80'

@connect(
  state => ({
    loading: state.loading['login/login'],
  }),
  { login },
)
@Form.create()
class UserLayout extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      codeSrc: `${baseUrl}/blog/public_controller/getCaptcha?date=${Math.random()}`,
    }
    this.code = null
  }

  componentDidMount() {
    // this.loadAccountInfo()
  }

  componentWillUnmount() {
    clearTimeout(this.code)
  }

  handleSubmit = (e) => {
    e.preventDefault()
    this.props.form.validateFields((err, values) => {
      if (!err) {
        const { userName, password, validCode } = values
        this.props.login({
          username: userName,
          password,
          valid_code: validCode,
        }).then(
          res => {
            if (res instanceof Error) return
            setLogin(res.payload)
            if (window.currentUrl) {
              this.props.history.push(window.currentUrl)
              delete window.currentUrl
              return
            }
            this.props.history.push('/')
          },
        )
      }
    })
  }

  getCodeSrc = () => {
    clearTimeout(this.code)
    this.code = setTimeout(() => {
      this.setState({
        codeSrc: `${baseUrl}/blog/public_controller/getCaptcha?date=${Math.random()}`,
      })
    }, 200)
  }

  render() {
    const { getFieldDecorator } = this.props.form
    const { codeSrc } = this.state
    return (
      <div className="user-layout">
        <div className="login-container">
          <div className="login-info">
            <div className="login-content">
              <Form onSubmit={this.handleSubmit} className="login-form">
                <FormItem><p className="login-name">博客管理平台</p></FormItem>
                <FormItem>
                  {getFieldDecorator('userName', {
                    rules: [{ required: true, message: '请输入用户名' }],
                  })(
                    <Input
                      prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
                      placeholder="用户名"
                      autoComplete="off"
                    />,
                  )}
                </FormItem>
                <FormItem>
                  {getFieldDecorator('password', {
                    rules: [{ required: true, message: '请输入密码' }],
                  })(
                    <Input
                      prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
                      type="password"
                      placeholder="密码"
                    />,
                  )}
                </FormItem>
                <Row>
                  <Col>
                    <div className="img-wrap">
                      <div className="img-input">
                        <FormItem>
                          {getFieldDecorator('validCode', {
                            rules: [{ required: true, message: '请输入验证码' }],
                          })(
                            <Input
                              prefix={<Icon type="safety-certificate" style={{ color: 'rgba(0,0,0,.25)' }} />}
                              placeholder="验证码"
                              autoComplete="off"
                            />,
                          )}
                        </FormItem>
                      </div>
                      <div className="img-box" title="换一张">
                        <img alt="验证码" src={codeSrc} onClick={this.getCodeSrc} />
                      </div>
                    </div>
                  </Col>
                </Row>
                <Row>
                  <Button type="primary" htmlType="submit" className="login-form-button" style={{ height: 45 }}>
                    登录
                  </Button>
                </Row>
              </Form>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default UserLayout
