import {
  DataSection,
  IDataProps,
  ActionPageLight
} from '@opencrvs/components/lib/interface'
import {
  FIELD_GROUP_TITLE,
  IFormField,
  IFormSection,
  IFormSectionData
} from '@register/forms'
import { goToCreateUserSection, goBack } from '@register/navigation'
import * as React from 'react'
import { defineMessages, InjectedIntlProps, injectIntl } from 'react-intl'
import { connect } from 'react-redux'
import { FormTitle, Action } from '@register/views/SysAdmin/views/UserForm'
import { PrimaryButton } from '@opencrvs/components/lib/buttons'
import { Dispatch } from 'redux'
import { submitUserFormData } from '@register/views/SysAdmin/forms/userReducer'
import ApolloClient from 'apollo-client'
import { createUserMutation } from '@register/views/SysAdmin/user/mutations'
import { draftToGqlTransformer } from '@register/transformer'
import { userSection } from '@register/views/SysAdmin/forms/fieldDefinitions/user-section'

export interface IUserReviewFormProps {
  section: IFormSection
  formData: IFormSectionData
  client: ApolloClient<unknown>
}

interface IDispatchProps {
  goToCreateUserSection: (sec: string, fieldName: string) => void
  submitForm: () => void
  goBack: typeof goBack
}

interface ISectionData {
  title: string
  items: IDataProps[]
}

type IFullProps = IUserReviewFormProps & InjectedIntlProps

const messages = defineMessages({
  actionChange: {
    id: 'action.change',
    defaultMessage: 'Change',
    description: 'Change action'
  },
  submit: {
    id: 'createUser.buttons.submit',
    defaultMessage: 'Create user',
    description: 'Label for submit button of user creation form'
  }
})

class UserReviewFormComponent extends React.Component<
  IFullProps & IDispatchProps
> {
  transformSectionData = () => {
    const { intl, formData } = this.props
    const dataEntries = Object.entries(formData)
    const sections: ISectionData[] = []
    dataEntries.forEach(([key, value]: [string, unknown]) => {
      const field = this.getField(key)
      if (field && field.type === FIELD_GROUP_TITLE) {
        sections.push({ title: intl.formatMessage(field.label), items: [] })
      } else if (field && sections.length > 0) {
        sections[sections.length - 1].items.push({
          label: intl.formatMessage(field.label),
          value: value as string,
          action: {
            id: `btn${field.name}`,
            label: intl.formatMessage(messages.actionChange),
            handler: () => this.props.goToCreateUserSection('user', field.name)
          }
        })
      }
    })

    return sections
  }

  getField = (fieldName: string) => {
    const { section } = this.props
    const foundField = section.fields.find(
      (field: IFormField) => field.name === fieldName
    )
    return foundField
  }

  render() {
    const { intl, section } = this.props

    return (
      <ActionPageLight
        title={intl.formatMessage(section.title)}
        goBack={this.props.goBack}
      >
        <FormTitle>{intl.formatMessage(section.name)}</FormTitle>
        {this.transformSectionData().map((sec, index) => (
          <DataSection key={index} {...sec} />
        ))}
        <Action>
          <PrimaryButton onClick={this.props.submitForm}>
            {intl.formatMessage(messages.submit)}
          </PrimaryButton>
        </Action>
      </ActionPageLight>
    )
  }
}

const mapDispatchToProps = (dispatch: Dispatch, props: IFullProps) => {
  return {
    goToCreateUserSection: (sec: string, fieldName: string) =>
      dispatch(goToCreateUserSection(sec, fieldName)),
    goBack: () => dispatch(goBack()),
    submitForm: () => {
      const variables = draftToGqlTransformer(
        { sections: [userSection] },
        { user: props.formData }
      )
      dispatch(submitUserFormData(props.client, createUserMutation, variables))
    }
  }
}
export const UserReviewForm = connect(
  null,
  mapDispatchToProps
)(injectIntl<IFullProps & IDispatchProps>(UserReviewFormComponent))
