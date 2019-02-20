import React from 'react'
import css from 'Css/main'

class Card extends React.Component {
  constructor() {
    super()
  }

  render() {
    let { info } = this.props
    let date = new Date(info.time)
    let time = `${date.getFullYear()}-${date.getMonth()}-${date.getDay()}`
    if (!info.time) time = '未知'
    return (
      <div className={css.card}>
        <div className={css.cardTop}>
          <div className={css.topPart}/>
          <div className={css.name}>{info.name}</div>
          <div className={css.lastTime}>最后一次使用：{time}</div>
        </div>

        <div className={css.cardCenter}>
          <span onClick={this.props.deleteStation}>从帐户中移除该设备</span>
        </div>
        
        <div className={css.cardBottom}>
          <div className={css.describe}>设备信息</div>
          <div>
            <span>型号</span>
            <span>{info.type}</span>
          </div>

          <div>
            <span>序列号</span>
            <span title={info.sn}>{info.sn}</span>
          </div>
        </div>
      </div>
    )
  }
}

module.exports = Card