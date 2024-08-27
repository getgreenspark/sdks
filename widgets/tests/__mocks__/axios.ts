const post = jest.fn()
const get = jest.fn()
const put = jest.fn()

const axios = {
  create: () => ({
    defaults: {
      headers: {
        common: {},
      },
    },
    post,
    get,
    put,
  }),
  post,
  get,
  put,
}

export default axios
