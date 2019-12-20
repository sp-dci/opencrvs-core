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
  constantsMessages,
  errorMessages,
  userMessages
} from '@client/i18n/messages'
import { messages } from '@client/i18n/messages/views/search'
import {
  CERTIFICATE_DATE_FORMAT,
  CERTIFICATE_MONEY_RECEIPT_DATE_FORMAT,
  LANG_EN,
  REJECTED
} from '@client/utils/constants'
import { createNamesMap } from '@client/utils/data-formatting'
import {
  StatusGray,
  StatusGreen,
  StatusOrange,
  StatusRejected
} from '@opencrvs/components/lib/icons'
import { Spinner } from '@opencrvs/components/lib/interface'
import { ITheme } from '@opencrvs/components/lib/theme'
import {
  GQLBirthEventSearchSet,
  GQLDeathEventSearchSet,
  GQLEventSearchSet,
  GQLHumanName
} from '@opencrvs/gateway/src/graphql/schema.d'
import moment from 'moment'
import * as React from 'react'
import { injectIntl, WrappedComponentProps as IntlShapeProps } from 'react-intl'
import styled, { withTheme } from 'styled-components'

const ExpansionContent = styled.div`
  background: ${({ theme }) => theme.colors.white};
  margin-bottom: 1px;
  border-top: ${({ theme }) => `2px solid ${theme.colors.background}`};
`
const QuerySpinner = styled(Spinner)`
  width: 50px;
  height: 50px;
  margin: 30px;
`
const SpinnerContainer = styled.div`
  min-height: 70px;
  min-width: 70px;
  display: flex;
  justify-content: center;
`
const ExpansionContainer = styled.div`
  flex: 1;
  display: flex;
  flex-direction: row;
  color: ${({ theme }) => theme.colors.copy};
  ${({ theme }) => theme.fonts.bodyStyle};
  margin-bottom: 8px;
  &:last-child {
    margin-bottom: 0;
  }
  &.history {
    margin-left: 8px;
  }
`
const ExpansionContentContainer = styled.div`
  flex: 1;
  margin-left: 16px;
`
const StatusIcon = styled.div`
  margin-top: 3px;
`
const StyledLabel = styled.label`
  ${({ theme }) => theme.fonts.bodyBoldStyle};
  margin-right: 3px;
`
const StyledValue = styled.span`
  ${({ theme }) => theme.fonts.bodyStyle};
  text-transform: capitalize !important;
`
const ValueContainer = styled.div`
  display: inline-flex;
  flex-wrap: wrap;
  & span:not(:last-child) {
    border-right: 1px solid ${({ theme }) => theme.colors.placeholder};
    margin-right: 10px;
    padding-right: 10px;
  }
`
const HistoryWrapper = styled.div`
  margin: 24px;
`
const PaddedContent = styled.div`
  padding: 24px;
`
const BorderedPaddedContent = styled(PaddedContent)`
  border-bottom: ${({ theme }) => `2px solid ${theme.colors.background}`};
`
const BoldSpan = styled.span`
  ${({ theme }) => theme.fonts.bodyBoldStyle};
  padding: 0 10px;
`
const ErrorText = styled.div`
  color: ${({ theme }) => theme.colors.error};
  ${({ theme }) => theme.fonts.bodyStyle};
  text-align: center;
  margin: 24px;
`

function LabelValue({
  label,
  value,
  id
}: {
  id?: string
  label: string
  value: string
}) {
  return (
    <div id={id}>
      <StyledLabel>{label}:</StyledLabel>
      <StyledValue>{value}</StyledValue>
    </div>
  )
}

function ValuesWithSeparator(props: { strings: string[] }): JSX.Element {
  return (
    <ValueContainer>
      {props.strings.map((value, index) => (
        <span key={index}>{value}</span>
      ))}
    </ValueContainer>
  )
}

function formatRoleCode(str: string) {
  const sections = str.split('_')
  const formattedString: string[] = []
  sections.map(section => {
    section = section.charAt(0) + section.slice(1).toLowerCase()
    formattedString.push(section)
    return section
  })

  return formattedString.join(' ')
}

type IProps = IntlShapeProps & {
  theme: ITheme
  eventDetails?: GQLEventSearchSet | null
}

type ISODateString = string

export class RowHistoryViewComponent extends React.Component<IProps> {
  transformer = () => {
    const eventDetails = this.props.eventDetails as GQLEventSearchSet

    const { locale } = this.props.intl
    const type = eventDetails.type || ''
    const contactNumber =
      eventDetails.registration && eventDetails.registration.contactNumber

    let name
    let dateOfEvent
    if (type.toLowerCase() === 'birth') {
      const birthEventDetails = eventDetails as GQLBirthEventSearchSet
      name = birthEventDetails.childName || []
      dateOfEvent = birthEventDetails.dateOfBirth
    } else {
      const deathEventDetails = eventDetails as GQLDeathEventSearchSet
      name = deathEventDetails.deceasedName || []
      dateOfEvent = deathEventDetails.dateOfDeath
    }

    return {
      type,
      name: createNamesMap(name as GQLHumanName[])[locale] as string,
      dateOfEvent:
        (dateOfEvent &&
          moment(dateOfEvent.toString(), 'YYYY-MM-DD').format(
            CERTIFICATE_MONEY_RECEIPT_DATE_FORMAT
          )) ||
        '',
      contactNumber,
      operationHistories:
        (eventDetails.operationHistories &&
          eventDetails.operationHistories.map(operationHistory => {
            return {
              type: operationHistory && operationHistory.operationType,
              practitionerName:
                (operationHistory &&
                  (createNamesMap(
                    operationHistory.operatorName as GQLHumanName[]
                  )[locale] as string)) ||
                '',
              timestamp:
                operationHistory &&
                (operationHistory.operatedOn as ISODateString),
              practitionerRole:
                operationHistory && operationHistory.operatorRole
                  ? this.props.intl.formatMessage(
                      userMessages[operationHistory.operatorRole as string]
                    )
                  : '',
              officeName:
                locale === LANG_EN
                  ? operationHistory && operationHistory.operatorOfficeName
                  : operationHistory && operationHistory.operatorOfficeAlias,
              rejectReasons:
                (operationHistory &&
                  operationHistory.operationType === REJECTED &&
                  operationHistory.rejectReason) ||
                '',
              comment:
                (operationHistory &&
                  operationHistory.operationType === REJECTED &&
                  operationHistory.rejectComment) ||
                ''
            }
          })) ||
        []
    }
  }

  getDeclarationStatusIcon = (status: string) => {
    switch (status) {
      case 'DECLARED':
        return (
          <StatusIcon>
            <StatusOrange />
          </StatusIcon>
        )
      case 'VALIDATED':
        return (
          <StatusIcon>
            <StatusGray />
          </StatusIcon>
        )
      case 'WAITING_VALIDATION':
        return (
          <StatusIcon>
            <StatusGray />
          </StatusIcon>
        )
      case 'REGISTERED':
        return (
          <StatusIcon>
            <StatusGreen />
          </StatusIcon>
        )
      case 'REJECTED':
        return (
          <StatusIcon>
            <StatusRejected />
          </StatusIcon>
        )
      default:
        return (
          <StatusIcon>
            <StatusOrange />
          </StatusIcon>
        )
    }
  }

  getWorkflowDateLabel = (status: string) => {
    switch (status) {
      case 'DECLARED':
        return constantsMessages.applicationSubmittedOn
      case 'VALIDATED':
        return constantsMessages.applicationValidatedOn
      case 'WAITING_VALIDATION':
        return constantsMessages.applicationWaitingForValidationOn
      case 'REGISTERED':
        return constantsMessages.applicationRegisteredOn
      case 'REJECTED':
        return constantsMessages.applicationRejectedOn
      default:
        return constantsMessages.applicationSubmittedOn
    }
  }

  getRenderedData() {
    const { intl } = this.props
    const transformedData = this.transformer()

    return (
      <>
        <BorderedPaddedContent>
          <ExpansionContainer>
            <label>{intl.formatMessage(constantsMessages.name)}:</label>
            <BoldSpan>{transformedData.name}</BoldSpan>
          </ExpansionContainer>
          <ExpansionContainer>
            <label>
              {intl.formatMessage(
                transformedData.type.toLowerCase() === 'birth'
                  ? constantsMessages.dob
                  : constantsMessages.dod
              )}
              :
            </label>
            <BoldSpan>{transformedData.dateOfEvent}</BoldSpan>
          </ExpansionContainer>
          <ExpansionContainer>
            <label>{intl.formatMessage(messages.informantContact)}:</label>
            <BoldSpan>{transformedData.contactNumber}</BoldSpan>
          </ExpansionContainer>
        </BorderedPaddedContent>
        <>
          {transformedData.operationHistories
            .map((operationHistory, index) => {
              const {
                practitionerName,
                practitionerRole,
                rejectReasons,
                comment
              } = operationHistory
              const type = operationHistory.type as string
              const officeName = operationHistory.officeName as string
              const timestamp = moment(operationHistory.timestamp!).format(
                CERTIFICATE_DATE_FORMAT
              )
              return (
                <HistoryWrapper key={index}>
                  <ExpansionContainer
                    id={type + '-' + index}
                    className="history"
                  >
                    {this.getDeclarationStatusIcon(type)}
                    <ExpansionContentContainer>
                      <LabelValue
                        id="expanded_history_item_timestamp"
                        label={intl.formatMessage(
                          this.getWorkflowDateLabel(type)
                        )}
                        value={timestamp}
                      />
                      <ValueContainer>
                        <StyledLabel>
                          {this.props.intl.formatMessage(constantsMessages.by)}:
                        </StyledLabel>
                        <ValuesWithSeparator
                          strings={[
                            practitionerName,
                            formatRoleCode(practitionerRole),
                            officeName
                          ]}
                        />
                      </ValueContainer>
                      {rejectReasons && (
                        <>
                          <LabelValue
                            label={intl.formatMessage(constantsMessages.update)}
                            value={rejectReasons}
                          />
                          <LabelValue
                            label={intl.formatMessage(
                              constantsMessages.comment
                            )}
                            value={comment}
                          />
                        </>
                      )}
                    </ExpansionContentContainer>
                  </ExpansionContainer>
                </HistoryWrapper>
              )
            })
            .reverse()}
        </>
      </>
    )
  }

  render() {
    return <ExpansionContent>{this.getRenderedData()}</ExpansionContent>
  }
}

export const RowHistoryView = injectIntl(withTheme(RowHistoryViewComponent))
