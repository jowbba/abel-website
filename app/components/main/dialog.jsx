import React from 'react'
import { connect } from 'react-redux'
import { withStyles } from '@material-ui/core/styles'
import { Paper, Button, Snackbar } from '@material-ui/core'
import api from '../../lib/api'
import css from 'Css/main'

class Dialog extends React.Component {
  constructor() {
    super()
    this.state = {
      open: false,
      message: '',
      step: 'ticket',
      inputType: 'text',
      password: '',
      ticketTime: 0,
      ticket: [],
      isDelete: true,
      clean: 'fast',
      manager: null,
      color: null,

    }
  }

  render() {
    let { classes, close, user, station } = this.props
    let { step, inputType, password, ticketTime, open, message } = this.state
    return (
      <div id={css.dialogFrame}>
        <Snackbar onClose={this.handleClose.bind(this)} anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }} open={open} autoHideDuration={3000} message={message} />

        <Paper className={css.dialog} classes={{
          root: classes.root
        }}>
          <img src={require('Image/1305.png')} className={css.close} onClick={close} />
          {/* password */}
          {step == 'password'? (
            <div>
              {getTitle(step)}
              <div className={css.passwordContainer}>
                <input value={password} className={css.password} type={inputType} placeholder='密码'
                  onChange={this.updatePassword.bind(this)} />
                <img src={require('Image/1304.png')} onClick={this.changeType.bind(this)} />
              </div>
            </div>
          ) : null}
          {/* ticket */}
          {step == 'ticket'? (
            <div>
              {getTitle(step, user.user.username)}
              <div className={css.ticketInput}>
              {[0,1,2,3].map(item => 
                <input ref={item} type="text" key={item}
                maxLength={1} onChange={this.inputTicket.bind(this, item)}/> 
              )}
              <span onClick={this.sendCode.bind(this)}>{ticketTime==0?'发送验证码':`${ticketTime}秒`}</span>
              </div>
            </div>
          ): null}
          {/* isDelete */}
          {step == 'isDelete'? (
            <div>
              {getTitle(step)}
              {getCheckbox.call(this, step, this.radioSelect)}
            </div>
          ):null}
          {/* clean mode */}
          {step == 'clean'?(
            <div>
              {getTitle(step)}
              {getCheckbox.call(this, step, this.changeMode)}
            </div>
          ):null}
          {/* finish */}
          {step == 'success' || step == 'failed'?(
            <div className={css.message}>
              <img src={step=='success'?require('Image/1273.png'):require('Image/1.png')}/>
                <div className={css.messageTitle}> 移除“
                  <span>{`${station.name?station.name:''}`}” 设备{step=='success'?'完成':'失败'}</span>
                </div>
              <div className={css.messageDes}>{step=='success'?'您已无法访问该设备':'移除失败，您可稍后再次尝试'}</div>
            </div>
          ):null}
          {step == 'success' || step == 'failed'? null: <Button onClick={this.submit.bind(this, step)} classes={{
            root: classes.buttonRoot, // class name, e.g. `classes-nesting-root-x`
            label: classes.buttonLabel, // class name, e.g. `classes-nesting-label-x`
          }}>下一步</Button>}
        </Paper>
      </div>
    )
  }

  handleClose() { this.setState({ open: false })}

  async submit(step) {
    let { password, ticket } = this.state
    let { station, user } = this.props
    let username = user.user.username
    let { mark } = station
    if (step == 'password') {
      // 验证密码
      try {
        let result = await api.login(username, password)
        this.setState({ step: 'ticket'})
      } catch (error) {
        let message = '密码验证失败'
        this.setState({ open: true, message })
      }
      
      
    } else if (step == 'ticket') {
      // 验证手机验证码
      try {
        let code = ''
        ticket.forEach(item => {
          if (!item) throw new Error()
          code += item
        })
        let result = await api.getTicket(username, code)
        this.setState({ step: 'isDelete'})
      } catch (error) {
        let message = '验证码错误'
        this.setState({ open: true, message})
      }
      
    }else if (step == 'isDelete') {
      // 是否删除本地数据
      this.setState({ step: 'clean'})
    } else if (step == 'clean') {
      // 删除模式
      if (mark == 'share') {
        this.setState({ step: 'success'})
      } else if (mark == 'own') {

      }
    } else if (step == 'success' || step == 'failed') {
      this.props.close()
    }
  }
  // 输入密码
  updatePassword(event) {
    this.setState({ password: event.target.value })
  }

  // 显示密码
  changeType() {
    let { inputType } = this.state
    let str = inputType == 'text' ? 'password' : 'text'
    this.setState({ inputType: str })
  }

  // 发送验证码
  sendCode() {
    if (this.state.ticketTime !== 0) return
    this.setState({ ticketTime: 60}, async () => {
      // api
      try {
        let username = this.props.user.user.username
        let result = await api.sendCode(username)
      } catch (error) {
        console.log('error,.,...........................')
        let message = '发送验证码失败'
        this.setState({ open: true, message })
      }
      // timer
      let timer = setInterval(() => {
        let { ticketTime } = this.state
        if(ticketTime == 1) {
          clearInterval(timer)
        } 
        let nextTime = ticketTime - 1
        this.setState({ ticketTime: nextTime})
      }, 1000)
    })
    
  }

  // 输入验证码
  inputTicket(index, event) {
    let target = event.target
    let { value } = target
    if (index < 3) this.refs[`${index + 1}`].focus()
    let ticket = [].concat(this.state.ticket)
    ticket[index] = value
    this.setState({ ticket })
  }
  
  // 选择框
  radioSelect(event) {
    let isDelete = event.target.value == 'true'? true: false
    this.setState({ isDelete })
  }

  changeMode() {
    let clean = event.target.value
    this.setState({ clean })
  }

  // radio

}

const styles = {
  root: {
    boxSizing: 'border-box',
    width: '480px',
    height: '360px',
    boxShadow: '0px 9px 13.2px 0.8px rgba(0, 105, 92, 0.24), 0px 4px 18.6px 0.4px rgba(0, 105, 92, 0.16)'
  },
  buttonRoot: {
    width: '72px',
    height: '36px',
    background: 'linear-gradient(45deg, #00695c 30%, #00695c 90%)',
    color: '#ffffff',
    fontSize: '14px',
    position: 'absolute',
    right: '24px',
    bottom: '24px'
  },
  buttonLabel: {
    textTransform: 'capitalize'
  }
}

const describe = {
  'password': {
    title: '身份验证',
    des: '请输入用户登录密码'
  },
  'ticket': {
    title: '输入验证码',
    des: '验证码将会发送至：'
  },
  'isDelete': {
    title: '解绑手机',
    des: '解除成功，此帐号将无法访问本设备'
  },
  clean: {
    title: '数据擦除方式',
    des: '解除成功，此帐号将无法访问本设备'
  }
}

const checkboxs = {
  'isDelete': [
    {des: '删除存储在本设备中的所有数据', value: true},
    {des: '不删除存储在本设备中的所有数据', value: false},
  ],
  'clean': [
    {des: '快速擦除', subDes: '耗时短，数据有概率可被专业工具恢复', value: 'fast'},
    {des: '深度擦除', subDes: '耗时长，数据不可恢复', value: 'slow'},
  ]
}

const getTitle = (step, phone) => {
  return (
    <div className={css.titleFrame}>
      <div>{describe[step].title}</div>
      <div>{`${describe[step].des}${phone?phone:''}`}</div>
    </div>
  )
}

const getCheckbox = function(step, handle) {
  return (
    <div>
      {checkboxs[step].map(item => (
        <div key={item.value} className={css.radio}>
          <input type='radio' name={step} value={item.value} id={step+item.value} 
            checked={item.value==this.state[step]} onChange={handle.bind(this)}/>
          <span>
            <label className={item.value==this.state[step]?css.selected:css.notSelected} 
              htmlFor={step+item.value}>{item.des}</label>
          </span>
        </div>
      )
        
      )}
    </div>
  )
}

var mapStateToProps = state => {
  return {
    user: state.user
  }
}

module.exports = connect(mapStateToProps)(withStyles(styles)(Dialog))
