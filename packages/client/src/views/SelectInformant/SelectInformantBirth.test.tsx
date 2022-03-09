/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 *
 * OpenCRVS is also distributed under the terms of the Civil Registration
 * & Healthcare Disclaimer located at http://opencrvs.org/license.
 *
 * Copyright (C) The OpenCRVS Authors. OpenCRVS and the OpenCRVS
 * graphic logo are (registered/a) trademark(s) of Plan International.
 */
import {
  createDeclaration,
  IDeclaration,
  storeDeclaration
} from '@client/declarations'
import { Event } from '@client/forms'
import { SELECT_BIRTH_INFORMANT } from '@client/navigation/routes'

import { storage } from '@client/storage'
import { createTestApp, flushPromises, setPinCode } from '@client/tests/util'

import { ReactWrapper } from 'enzyme'
import { History } from 'history'
import { AppStore } from '@client/store'

beforeEach(() => {
  ;(storage.getItem as jest.Mock).mockReset()
})

describe('when user is selecting the informant', () => {
  let app: ReactWrapper
  let history: History
  let store: AppStore
  let draft: IDeclaration

  beforeEach(async () => {
    const testApp = await createTestApp()
    app = testApp.app
    history = testApp.history
    store = testApp.store

    draft = createDeclaration(Event.BIRTH)
    store.dispatch(storeDeclaration(draft))
    history.replace(SELECT_BIRTH_INFORMANT.replace(':declarationId', draft.id))

    await flushPromises()
    await setPinCode(app)
  })
  describe('when selects "Parent"', () => {
    it('takes user to the birth registration contact view', () => {
      app.find('#informant_GRANDFATHER').hostNodes().simulate('change')

      app.find('#continue').hostNodes().simulate('click')

      const expectation = `/drafts/${draft.id}/events/birth`
      expect(window.location.pathname).toContain(expectation)
    })
  })
  describe('when click continue without select anything', () => {
    it('show the error message', () => {
      app.find('#continue').hostNodes().simulate('click')

      expect(app.find('#error_text').hostNodes().text()).toBe(
        'Please select who is present and applying'
      )
    })
  })

  describe('when traverse list then continue', () => {
    it('takes user to the birth registration by parent informant view', () => {
      app.find('#informant_MOTHER').hostNodes().simulate('change')
      app.find('#informant_FATHER').hostNodes().simulate('change')

      app.find('#informant_GRANDFATHER').hostNodes().simulate('change')
      app.find('#informant_GRANDMOTHER').hostNodes().simulate('change')
      app.find('#informant_BROTHER').hostNodes().simulate('change')
      app.find('#informant_SISTER').hostNodes().simulate('change')
      app.find('#informant_LEGAL_GUARDIAN').hostNodes().simulate('change')
      app.find('#informant_SOMEONE_ELSE').hostNodes().simulate('change')

      app.find('#continue').hostNodes().simulate('click')

      const expectation = `/drafts/${draft.id}/events/birth`
      expect(window.location.pathname).toContain(expectation)
    })
  })

  describe('when clicked on cross button', () => {
    it('go back to home page', async () => {
      app.find('#crcl-btn').hostNodes().simulate('click')

      expect(window.location.href).toContain('/')
    })
  })
})
describe('when select informant page loads with existing data', () => {
  it('loads data properly while initiating', async () => {
    const testApp = await createTestApp()
    const app = testApp.app
    const history = testApp.history
    const store = testApp.store

    const draft = createDeclaration(Event.BIRTH, {
      registration: {
        presentAtBirthRegistration: 'MOTHER',
        registrationPhone: '01622688231',
        informant: {
          value: 'MOTHER',
          nestedFields: {}
        }
      }
    })
    store.dispatch(storeDeclaration(draft))
    history.replace(SELECT_BIRTH_INFORMANT.replace(':declarationId', draft.id))

    await setPinCode(app)
    expect(app.find('#informant_MOTHER').hostNodes().props().checked).toBe(true)
  })
})
