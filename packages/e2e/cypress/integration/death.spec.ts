/// <reference types="Cypress" />

context('Death Registration Integration Test', () => {
  beforeEach(() => {
    indexedDB.deleteDatabase('OpenCRVS')
  })
  it('Tests from application to registration', () => {
    cy.login('fieldWorker')
    cy.get('#createPinBtn', { timeout: 30000 }).should('be.visible')
    cy.get('#createPinBtn').click()
    for (let i = 0; i < 8; i++) {
      cy.get('#keypad-1').click()
    }
    cy.get('#new_event_declaration', { timeout: 30000 }).should('be.visible')
    cy.get('#new_event_declaration').click()
    cy.get('#select_vital_event_view').should('be.visible')
    cy.get('#select_death_event').click()
    // APPLICATION FORM
    // DECEASED DETAILS
    cy.selectOption('#iDType', 'National ID', 'National ID')
    cy.get('#iD').type('1020607910288')
    cy.get('#firstNames').type('ক ম আব্দুল্লাহ আল আমিন ')
    cy.get('#familyName').type('খান')
    cy.get('#firstNamesEng').type('K M Abdullah al amin')
    cy.get('#familyNameEng').type('Khan')
    cy.selectOption('#gender', 'Male', 'Male')
    cy.selectOption('#maritalStatus', 'Married', 'Married')
    cy.get('#birthDate-dd').type('16')
    cy.get('#birthDate-mm').type('06')
    cy.get('#birthDate-yyyy').type('1988')
    cy.selectOption('#statePermanent', 'Dhaka', 'Dhaka')
    cy.selectOption('#districtPermanent', 'Gazipur', 'Gazipur')
    cy.selectOption('#addressLine4Permanent', 'Kaliganj', 'Kaliganj')
    cy.selectOption('#addressLine3Permanent', 'Bahadursadi', 'Bahadursadi')
    cy.get('#addressLine2Permanent').type('Bahadur street')
    cy.get('#addressLine1Permanent').type('40 Ward')
    cy.get('#postCodePermanent').type('1024')
    cy.get('#currentAddressSameAsPermanent_false').click()
    cy.selectOption('#country', 'Bangladesh', 'Bangladesh')
    cy.selectOption('#state', 'Dhaka', 'Dhaka')
    cy.selectOption('#district', 'Gazipur', 'Gazipur')
    cy.selectOption('#addressLine4', 'Kaliganj', 'Kaliganj')
    cy.selectOption('#addressLine3', 'Bahadursadi', 'Bahadursadi')
    cy.get('#addressLine2').type('My street')
    cy.get('#addressLine1').type('40')
    cy.get('#postCode').type('1024')
    cy.wait(1000)
    cy.get('#next_section').click()
    // APPLICANT DETAILS
    cy.selectOption('#iDType', 'Drivers License', 'Drivers License')
    cy.get('#applicantID').type('JS0013011C00001')
    cy.get('#applicantFirstNames').type('জামাল উদ্দিন খান')
    cy.get('#applicantFamilyName').type('খান')
    cy.get('#applicantFirstNamesEng').type('Jamal Uddin Khan')
    cy.get('#applicantFamilyNameEng').type('Khan')
    cy.get('#applicantBirthDate-dd').type('17')
    cy.get('#applicantBirthDate-mm').type('10')
    cy.get('#applicantBirthDate-yyyy').type('1956')
    cy.selectOption('#applicantsRelationToDeceased', 'Father', 'Father')
    cy.get('#applicantPhone').type('01712345678')
    cy.selectOption('#state', 'Dhaka', 'Dhaka')
    cy.selectOption('#district', 'Gazipur', 'Gazipur')
    cy.selectOption('#addressLine4', 'Kaliganj', 'Kaliganj')
    cy.selectOption('#addressLine3', 'Bahadursadi', 'Bahadursadi')
    cy.get('#addressLine2').type('My street')
    cy.get('#addressLine1').type('48')
    cy.get('#postCode').type('1024')
    cy.wait(1000)
    cy.get('#next_section').click()
    // EVENT DETAILS
    cy.get('#deathDate-dd').type('18')
    cy.get('#deathDate-mm').type('01')
    cy.get('#deathDate-yyyy').type('2019')
    cy.selectOption('#manner', 'Homicide', 'Homicide')
    cy.get('#deathPlaceAddress_CURRENT').click()
    cy.wait(1000)
    cy.get('#next_section').click()
    // CAUSE OF DEATH DETAILS
    cy.get('#causeOfDeathEstablished_true').click()
    cy.selectOption(
      '#methodOfCauseOfDeath',
      'Medically Certified Cause of Death',
      'Medically Certified Cause of Death'
    )
    cy.get('#causeOfDeathCode').type('1009')
    cy.wait(1000)
    cy.get('#next_section').click()
    // DOCUMENT DETAILS
    cy.wait(1000)
    cy.get('#next_section').click()
    // PREVIEW
    cy.get('#next_button_deceased').click()
    cy.get('#next_button_informant').click()
    cy.get('#next_button_deathEvent').click()
    cy.get('#submit_form').click()
    // MODAL
    cy.get('#submit_confirm').click()
    // APPLICATION SUBMITTED
    cy.get('#tracking_id_viewer').then($track => {
      cy.wait(1000)
      const trackingIDText = $track.text()
      cy.log('trackingID: ', trackingIDText)
      cy.logout()
      cy.login('registrar')
      cy.wait(1000)
      // WORK QUEUE
      cy.contains(`${trackingIDText}`)
        .siblings('#ActionWrapper')
        .children('#ListItemAction')
        .children('#Review')
        .click()
      // REVIEW
      cy.get('#next_button_deceased').click()
      cy.get('#next_button_informant').click()
      cy.get('#next_button_deathEvent').click()
      cy.get('#registerApplicationBtn').click()
      // MODAL
      cy.get('#register_confirm').click()
      // REGISTRATION SUBMITTED
      cy.get('#tracking_id_viewer').then($track => {
        cy.wait(1000)
        const registrationNumberText = $track.text()
        cy.log('registrationNumberText: ', registrationNumberText)
        cy.get('#go_to_homepage_button').click()
      })
    })
  })
})