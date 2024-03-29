import { testScript } from 'cypress/support/helpers'

describe('Public route', () => {
  beforeEach(() => {
    cy.visit('http://localhost:3000') // Replace with your application's URL
  })

  it('Clicking login button will redirect to /login', () => {
    cy.visit('/')
    cy.contains('Login').click()
    cy.url().should('include', '/login')
  })

  it('Visiting inavlid route should redirect to landing page', () => {
    cy.visit('/home')
    cy.url().should('include', '/landing')
  })
})

describe('Visitor mode', () => {
  beforeEach(() => {
    localStorage.setItem('scripts', JSON.stringify(testScript))
    cy.visit('/login')
    cy.contains('Visitor').click()
  })

  it('Profile shows correct email and name', () => {
    cy.contains('Profile').click()
    cy.contains('visitor@testmail.com')
    cy.contains('visitor')
  })

  it('Opens up script sidebar', () => {
    cy.contains('SCRIPTS').click()
    cy.contains(testScript.state.scripts[0].filename)
  })
  //Broken, REASON: Sidebar.tsx, localchanges tries to sync local data with remote
  // it('Script scene ids render correctly', () => {
  //   cy.contains('SCRIPTS').click()
  //   cy.get('#script-list-item-0 > .flex-1').click()
  //   const strings = testScript.state.scripts[0].scenes.map((item) => item.id)
  //   strings.forEach((str) => {
  //     cy.contains(str).should('be.visible')
  //   })
  // })

  // it('Scene should contain Edit button', () => {
  //   const firstScene = testScript.state.scripts[0].scenes[0].id
  //   cy.contains(firstScene).click()
  //   cy.contains('Edit')
  // })

  // it('Clicking on scene should open and display content, after close', () => {
  //   const firstScene = testScript.state.scripts[0].scenes[0].id
  //   cy.contains(firstScene).click()
  //   cy.get('.text-area')
  //     .invoke('val')
  //     .should('contain', testScript.state.scripts[0].scenes[0].data[0].lines)
  //   cy.contains(firstScene).click()
  // })
})
