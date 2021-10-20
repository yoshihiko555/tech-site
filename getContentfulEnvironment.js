const contentfulManagement = require('contentful-management')
require('dotenv').config()

module.exports = function () {
  const contentfulClient = contentfulManagement.createClient({
    accessToken: process.env.CTF_MANAGE_TOKEN
  })
  return contentfulClient
    .getSpace(process.env.CTF_SPACE_ID)
    .then(space => space.getEnvironment(process.env.CTF_ENVIRONMENT))
}
