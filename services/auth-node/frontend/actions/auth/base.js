export const ROOT_API_URL = `${process.env.ROOT_URI}/api`

export const access = (token) => ({
  type: 'ACCESS',
  token
});

export const logout = () => ({
  type: 'LOGOUT'
});
