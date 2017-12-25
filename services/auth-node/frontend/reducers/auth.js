export default (state = {}, action) => {
  switch(action.type) {
    case 'ACCESS':
      return {
        token: action.token
      };
    case 'LOGOUT':
      return {};
    default:
      return state;
  }
};
