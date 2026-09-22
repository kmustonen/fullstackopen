const User = require('../models/user')

const getSomeUser = async () => {
  const user = await User.findById('6ab2a42339b37fca5337cb1c')
  return user
}

module.exports = { getSomeUser }