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
import { loop, Cmd, Loop, LoopReducer } from 'redux-loop'
import { storage } from '@client/storage'
import * as actions from '@client/forms/configuration/configFields/actions'
import * as offlineActions from '@client/offline/actions'
import { Event, IQuestionConfig } from '@client/forms'
import { getConfiguredForm } from '@client/forms/configuration'
import { ISectionFieldMap, getSectionFieldsMap } from './utils'

export type IConfigFieldsState =
  | {
      state: 'LOADING'
      questions: IQuestionConfig[]
      birth: null
      death: null
    }
  | {
      state: 'READY'
      questions: IQuestionConfig[]
      birth: ISectionFieldMap
      death: ISectionFieldMap
    }

export const initialState: IConfigFieldsState = {
  state: 'LOADING',
  questions: [],
  birth: null,
  death: null
}

async function saveConfigFields(configFields: IConfigFieldsState) {
  return storage.setItem('configFields', JSON.stringify(configFields))
}

async function loadConfigFields() {
  return storage.getItem('configFields')
}

async function clearConfigFields() {
  return storage.removeItem('configFields')
}

type Actions = actions.ConfigFieldsActions | offlineActions.Action

export const configFieldsReducer: LoopReducer<IConfigFieldsState, Actions> = (
  state: IConfigFieldsState = initialState,
  action: Actions
): IConfigFieldsState | Loop<IConfigFieldsState, Actions> => {
  switch (action.type) {
    case offlineActions.READY:
    case offlineActions.UPDATED:
      return loop(
        {
          ...state,
          questions: action.payload.formConfig.questionConfig
        },
        Cmd.run<
          actions.GetStorageConfigFieldsFailedAction,
          actions.GetStorageConfigFieldsSuccessAction
        >(loadConfigFields, {
          successActionCreator: actions.getStorageConfigFieldsSuccess,
          failActionCreator: actions.getStorageConfigFieldsFailed
        })
      )
    case actions.GET_STORAGE_CONFIG_FIELDS_SUCCESS:
      if (action.payload) {
        const configFieldsState: IConfigFieldsState = JSON.parse(action.payload)
        return { ...configFieldsState }
      }

      const birthForm = getConfiguredForm(state.questions, Event.BIRTH)
      const deathForm = getConfiguredForm(state.questions, Event.DEATH)

      const newState: IConfigFieldsState = {
        ...state,
        state: 'READY',
        birth: getSectionFieldsMap(Event.BIRTH, birthForm),
        death: getSectionFieldsMap(Event.DEATH, deathForm)
      }

      return loop(newState, Cmd.action(actions.storeConfigFields(newState)))

    case actions.STORE_CONFIG_FIELDS:
      return loop(
        state,
        Cmd.run<
          actions.StoreConfigFieldsFailedAction,
          actions.StoreConfigFieldsSuccessAction
        >(saveConfigFields, {
          successActionCreator: actions.storeConfigFieldsSuccess,
          failActionCreator: actions.storeConfigFieldsFailed,
          args: [action.payload]
        })
      )

    case actions.STORE_CONFIG_FIELDS_SUCCESS:
      if (action.payload) {
        const configFieldsState: IConfigFieldsState = JSON.parse(action.payload)
        return {
          ...configFieldsState
        }
      }
      return state
    case actions.UPDATE_QUESTION_CONFIG:
      const { questionConfig } = action.payload
      return loop(
        state,
        Cmd.list([
          Cmd.run(clearConfigFields),
          Cmd.action(offlineActions.updateOfflineQuestionConfig(questionConfig))
        ])
      )
    default:
      return state
  }
}
