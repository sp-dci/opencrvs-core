import { LoopReducer, Loop } from 'redux-loop'
import * as actions from './actions'
import { ENGLISH_STATE } from './locales/en'
import { BENGALI_STATE } from './locales/bn'

export interface IntlMessages {
  [key: string]: string
}

export interface ILanguage {
  lang: string
  messages: IntlMessages
}

export interface ILanguageState {
  [key: string]: ILanguage
}

export const languages: ILanguageState = {
  en: ENGLISH_STATE,
  bn: BENGALI_STATE
}

export type IntlState = {
  language: string
  messages: IntlMessages
  languages: ILanguageState
}

export const initialState: IntlState = {
  // @ts-ignore
  language: window.config.LANGUAGE,
  // @ts-ignore
  messages: languages[window.config.LANGUAGE].messages,
  languages
}

const getNextMessages = (language: string): IntlMessages => {
  return languages[language].messages
}

export const intlReducer: LoopReducer<IntlState, actions.Action> = (
  state: IntlState = initialState,
  action: actions.Action
): IntlState | Loop<IntlState, actions.Action> => {
  switch (action.type) {
    case actions.CHANGE_LANGUAGE:
      const messages = getNextMessages(action.payload.language)

      return {
        ...state,
        language: action.payload.language,
        messages
      }
    case actions.ADD_OFFLINE_KEYS:
      let updatedMessages = getNextMessages(state.language)
      updatedMessages = {
        ...updatedMessages,
        ...action.payload[state.language].messages
      }
      return {
        ...state,
        messages: updatedMessages,
        languages: action.payload
      }
    default:
      return state
  }
}
