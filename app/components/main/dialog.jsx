import React from 'react'
import { withStyles } from '@material-ui/core/styles'
import { Paper, Button, Checkbox } from '@material-ui/core'
import css from 'Css/main'

class Dialog extends React.Component {
  constructor() {
    super()
    this.state = {
      step: 'isDelete',
      inputType: 'text',
      password: '',
      isDelete: true
    }
  }

  render() {
    let { classes, close } = this.props
    let { step, inputType } = this.state
    let buttonText = '下一步'
    return (
      <div id={css.dialogFrame}>
        <Paper className={css.dialog} classes={{
          root: classes.root
        }}>
          <img src={require('Image/1305.png')} className={css.close} onClick={close} />
          {/* password */}
          {step == 'password'? (
            <div>
              {getTitle(step)}
              <div className={css.passwordContainer}>
                <input className={css.password} type={inputType} placeholder='密码'
                  onChange={this.updatePassword.bind(this)} />
                <img src={require('Image/1304.png')} onClick={this.changeType.bind(this)} />
              </div>
            </div>
          ) : null}
          {/* isDelete */}
          {step == 'isDelete'? (
            <div>
              {getTitle(step)}
              {getCheckbox.call(this, step, this.radioSelect)}
            </div>
          ):null}

          <Button onClick={this.submit.bind(this, step)} classes={{
            root: classes.buttonRoot, // class name, e.g. `classes-nesting-root-x`
            label: classes.buttonLabel, // class name, e.g. `classes-nesting-label-x`
          }}>{buttonText}</Button>
        </Paper>
      </div>
    )
  }

  submit(step) {
    if (step == 'password') {
      this.setState({ step: 'isDelete'})
    } else if (step == 'isDelete') {
      this.setState({ step: 'cleanWay'})
    }
  }
  // password
  updatePassword(event) {
    this.setState({ password: event.target.value })
  }

  changeType() {
    let { inputType } = this.state
    let str = inputType == 'text' ? 'password' : 'text'
    this.setState({ inputType: str })
  }

  radioSelect(event) {
    let isDelete = event.target.value == 'true'? true: false
    this.setState({ isDelete })
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
  'isDelete': {
    title: '解绑手机',
    des: '解除成功，此帐号将无法访问本设备'
  },
  clear: {
    title: '数据擦除方式',
    des: '解除成功，此帐号将无法访问本设备'
  }
}

const checkboxs = {
  'isDelete': [
    {des: '删除存储在本设备中的所有数据', value: true},
    {des: '不删除存储在本设备中的所有数据', value: false},
  ]
}

const getTitle = (step) => {
  return (
    <div className={css.titleFrame}>
      <div>{describe[step].title}</div>
      <div>{describe[step].des}</div>
    </div>
  )
}

const getCheckbox = function(step, radioSelect) {
  return (
    <div>
      {checkboxs[step].map(item => (
        <div key={item.value} className={css.radio}>
          <input type='radio' name={step} value={item.value} id={step+item.value} 
            checked={item.value==this.state.isDelete} onChange={radioSelect.bind(this)}/>
          <label className={item.value==this.state.isDelete?css.selected:css.notSelected} 
            htmlFor={step+item.value}>{item.des}</label>
        </div>
      )
        
      )}
    </div>
  )
}

module.exports = withStyles(styles)(Dialog)
