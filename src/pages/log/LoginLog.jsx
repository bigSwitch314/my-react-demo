import React from 'react'
// import { Icon, Avatar } from 'antd'
// import img from '@/assets/images/luo.jpg'
// import RcViewer from '@/components/viewer/RcViewer'


class LoginLog extends React.Component {
  constructor(props) {
    super(props)
    this.state = {

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
    return (
      <div>
        <div>登录日志</div>
        {/* <RcViewer>
          <img src={img} width="200px"/>
        </RcViewer> */}
      </div>
    )
  }
}

export default LoginLog
