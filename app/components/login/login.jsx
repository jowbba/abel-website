import React from 'react'
import { connect } from 'react-redux'
import Nav from '../common/nav.jsx'
import store from '../../store/store'
import Action from '../../action/action'
import { FormControlLabel, Checkbox, Snackbar } from '@material-ui/core'
import { withStyles } from '@material-ui/core/styles'
import css from 'Css/login'

const base = `https://test.nodetribe.com/c/v1`

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
      remember: false,
      open: false,
      message: ''
    }
  }

  componentDidMount() {
    let username = localStorage.getItem('username')
    if (username) {
      this.setState({ remember: true, username}, this.next)
    }
  }

  componentWillReceiveProps(props) {
    let { user, list } = props.user
    if (user && list) {
      console.log(list)
      this.props.history.push('/main')
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
    let { step, username, password, open, message } = this.state
    return (
      <div id={css.wrap} style={wrapStyle}>
        <Snackbar onClose={this.handleClose.bind(this)} anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'center',
          }} open={open} autoHideDuration={3000} message={message}/>
        {/* 主体 */}
        <div id={css.main}>
          {/* 顶部 */}
          <Nav/>
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
                onKeyDown={this.preventDefault.bind(this)}
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
                  checked={this.state.remember}
                  value="remember"
                  classes={{
                    root: classes.checkbox,
                    checked: classes.checked
                  }}
                  onChange={this.check.bind(this)}
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

  handleClose() { this.setState({ open: false })}

  preventDefault(e) {
    if (e.keyCode == '9') e.preventDefault()
  }

  keyUp(event) {
    let code = event.keyCode
    if ((code == '13' || code == '9') && this.state.step == 1) this.next()
    else if (code == '13' && this.state.step == 2) this.submit()
  }

  next(event) {
    let { step, username } = this.state
    if (step == 1) {
      let url = `${base}/user/phone/check?phone=${username}`
      let req = new XMLHttpRequest()
      req.onreadystatechange = () => {
        if (req.readyState==4 && req.status==200) {
          let result = JSON.parse(req.responseText)
          if (result.data.userExist) {
            this.setState({step: 2}, () => {
              this.refs.password.focus()
            })
          } else this.setState({open: true, message: '用户名不存在'})
          
        } else if (req.readyState == 4 && req.status !== 200) {
          this.setState({open: true, message: '用户名不存在'})
        }  
      }
      req.open('GET', url, true)
      req.send()      
    } else if (step == 2) this.submit()
  }

  focus() {
    this.setState({step: 1})
  }

  submit() {
    let { username, password, remember } = this.state
    let url = `${base}/user/password/token?`
    url += `username=${username}`
    url += `&password=${password}`
    url += `&clientId=web&type=web`
    let req = new XMLHttpRequest()
    req.onreadystatechange = () => {
      if (req.readyState==4 && req.status==200) {
        let result = JSON.parse(req.responseText).data
        if (remember) localStorage.setItem('username', username)
        else if (!remember) localStorage.clear()
        store.dispatch(Action.setUser(result))
        this.getStationList(result)
      } else if (req.readyState == 4 && req.status !== 200) {
        let message = JSON.parse(req.responseText).message
        this.setState({open: true, message})
      }
    }
    req.open('GET', url, true)
    req.send()
  }

  check(event, checked) {
    this.setState({ remember: checked })
  }

  getStationList(user) {
    let { token } = user
    let url = `${base}/station`
    let req = new XMLHttpRequest()
    req.onreadystatechange = () => {
      if (req.readyState==4 && req.status==200) {
        let list = JSON.parse(req.responseText).data
        store.dispatch(Action.setList(list))
      } else if (req.readyState == 4 && req.status !== 200) {
        let message = '获取设备列表错误'
        this.setState({open: true, message})
      }
    }
    req.open('GET', url, true)
    req.setRequestHeader('Authorization', token)
    req.send()
  }
}

var mapStateToProps = state => {
  return {
    user: state.user,
    view: state.view
  }
}

export default connect(mapStateToProps)(withStyles(styles)((Login)))