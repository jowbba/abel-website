import React from 'react'
import { Avatar, Popper, Grow, Paper, ClickAwayListener, MenuList, MenuItem, Button } from '@material-ui/core'
import css from 'Css/common'
import { withStyles } from '@material-ui/core/styles'

const styles = {
  menu: { width: '140px' },
  menuItem: { fontSize: '14px' }
}

class Nav extends React.Component {
  constructor() {
    super()
    this.state = { anchorEl: null, open: false }
  }

  render() {
    let { height, bgColor, color } = this.props
    let style = { height, background: bgColor }
    let style1 = { color }
    let { anchorEl, open } = this.state
    let { classes } = this.props
    return (
      <nav style={style} className={css.nav}>
        <span>
          <Avatar src={require('Image/logo.png')} className={css.logo} />
          <ul className={css.title}>
            <li style={style1}>WISNUC</li>
            <li style={style1}>设备管理</li>
          </ul>
        </span>

        <span>
          <span className={css.username}>13621766832</span>
          <span className={css.menu} onClick={this.handleToggle.bind(this)}>
            <img className={css.userLogo} src={require('Image/1241-2.png')} alt="" />
            <span className={`${css.arrow } ${open?css.up:css.down}`}>
            </span>
          </span>
          
          <img className={css.question} 
            src={require('Image/1296.svg')} onClick={this.props.faq}
          />
        </span>

        <Popper open={open} anchorEl={this.anchorEl} transition disablePortal>
            {({ TransitionProps, placement }) => (
              <Grow
                {...TransitionProps}
                id="menu-list-grow"
                style={{ transformOrigin: placement === 'bottom' ? 'center top' : 'center bottom' }}
              >
                <Paper>
                  <ClickAwayListener onClickAway={this.handleClose.bind(this)}>
                    <MenuList classes={{
                      root: classes.menu
                    }}>
                      <MenuItem classes={{
                        root: classes.menuItem
                      }} onClick={this.handleClose.bind(this)}>退出</MenuItem>
                    </MenuList>
                  </ClickAwayListener>
                </Paper>
              </Grow>
            )}
          </Popper>
      </nav>
    )
  }


  handleToggle(event) {
    this.anchorEl = event.currentTarget
    this.setState(state => ({ open: !state.open }));
  };


  handleClose(event) {
    if (this.anchorEl.contains(event.target)) {
      return;
    }

    this.setState({ open: false });
  }
}

module.exports = withStyles(styles)(Nav)