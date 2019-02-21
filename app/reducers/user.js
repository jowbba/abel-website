const defaultState = {
    user: null,
    list: null
}

const userState = (state = defaultState, action) => {
  switch(action.type) {
    case 'SET_USER':
      return Object.assign({}, state, { user: action.user })

    case 'SET_LIST':
      return Object.assign({}, state, { list: action.list })

    case 'LOGOUT':
      return Object.assign({}, state, { user: null, list: null })
    default:
      return state
  }
}

export default userState