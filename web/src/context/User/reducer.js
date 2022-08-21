export const reducer = (state, action) => {
  switch (action.type) {
    case "login":
      return {
        ...state,
        user: action.payload
      }

    default:
      return state
  }
}

export const initialState = {
  user: undefined
}