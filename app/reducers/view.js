const defaultState = {
  width : document.body.clientWidth,
  height : document.body.clientHeight > 500? document.body.clientHeight: 500,
}

const viewState = (state = defaultState, action) => {
  switch(action.type) {
    case 'SET_SIZE':
      let minHeight = action.height > 500?action.height:500
      return Object.assign({}, state, {
        width: action.width,
        height: minHeight
      })
    default:
      return state
  }
}

export default viewState