import { defineConfig } from 'cypress'

require('dotenv').config()
export default defineConfig({
  e2e: {
    baseUrl: 'http://localhost:3000',
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
  env: {
    googleRefreshToken: process.env.GOOGLE_REFRESH_TOKEN,
    googleClientId: process.env.REACT_APP_GOOGLE_CLIENT_ID,
    googleClientSecret: process.env.REACT_APP_GOOGLE_CLIENT_SECRET,
    google_email: process.env.GOOGLE_EMAIL,
    google_password: process.env.GOOGLE_PASSWORD,
  },
})
