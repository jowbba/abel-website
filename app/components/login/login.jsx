import React from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import store from '../../store/store'
import Action from '../../action/action'
import { FormControlLabel, Avatar, Checkbox } from '@material-ui/core'
import { withStyles } from '@material-ui/core/styles';
import green from '@material-ui/core/colors/green';
import css from 'Css/login'

const styles = {
  checkBoxLabel: {
    color: 'rgba(255, 255, 255, .87)',
    fontSize: '12px',
    fontFamily: 'NotoSansCJKsc'
  },
  checkbox: {
    color: 'rgba(255, 255, 255, .87)',
    '&$checked': {
      color: 'rgba(255, 255, 255, .87)',
    },
  },
  checked: { }
}

class Login extends React.Component {
  constructor() {
    super()
    this.state = {
      username: '',
      password: '',
      step: 1,
      remember: false
    }
  }

  render() {
    let width = this.props.view.width
    let height = this.props.view.height
    let size = width / height >= 1.5 ? '100%' : 'auto 100%'
    let wrapStyle = {
      background: `url(${require('Image/bg.jpg')}) no-repeat`,
      backgroundSize: size
    }
    let { classes } = this.props
    let { step, username, password } = this.state
    return (
      <div id={css.wrap} style={wrapStyle}>
        {/* 主体 */}
        <div id={css.main}>
          {/* 顶部 */}
          <nav>
            <Avatar src={require('Image/logo.png')} className={css.logo} />
            <ul className={css.title}>
              <li>WISNUC</li>
              <li>设备管理</li>
            </ul>
          </nav>
          {/* 标题 */}
          <div className={css.mainTitle}>账户登录</div>
          {/* 输入框 */}
          <div className={css.inputBox}>
            <div>
              <input className={step!==1?css.finish:''} 
                type="text" placeholder='输入帐号' value={username}
                onChange={this.input.bind(this, 'username')}
                onFocus={this.focus.bind(this)}
                onKeyUp={this.keyUp.bind(this)}
                />
              <img src={require('Image/arrow.png')} onClick={this.next.bind(this)}/>
            </div>
            <div>
              <input ref='password' className={step==1?css.hidden:''} 
                type="password" placeholder='输入密码' value={password}
                onChange={this.input.bind(this, 'password')}
                onKeyUp={this.keyUp.bind(this)}
              />
              <img src={require('Image/arrow.png')} onClick={this.submit.bind(this)}/>
            </div>
          </div>
          {/* 记住账号选项 */}
          <div className={css.remember}>
            <FormControlLabel
              classes={{
                label: classes.checkBoxLabel
              }}
              control={
                <Checkbox
                  value="remember"
                  classes={{
                    root: classes.checkbox,
                    checked: classes.checked
                  }}
                />
              }
              label="记住帐户"
            />
          </div>
          <footer>©上海闻上信息科技有限公司 2016-2018</footer>
        </div>
      </div>
    )
  }

  input(type, e) {
    this.setState({
      [type]: e.target.value
    })
  }

  keyUp(event) {
    let code = event.keyCode
    if (code == '13' && this.state.step == 1) this.next()
  }

  next(event) {
    let { step } = this.state
    if (step == 1) {
      this.setState({step: 2}, () => {
        this.refs.password.focus()
      })
    }
  }

  focus() {
    this.setState({step: 1})
  }

  submit() {
    
  }

}

var mapStateToProps = state => {
  return {
    user: state.user,
    view: state.view
  }
}

export default connect(mapStateToProps)(withStyles(styles)((Login)))