import * as React from 'react'
import { default as ReactSelect, components } from 'react-select'
import styled from 'styled-components'
import { Props } from 'react-select/lib/Select'
import { Omit } from '../omit'
import { ArrowDownBlue } from '../icons'

export interface ISelectOption {
  value: string
  label: string
}

export interface IStyledSelectProps extends Props<ISelectOption> {
  id: string
  error?: boolean
  touched?: boolean
  options: ISelectOption[]
}

const DropdownIndicator = (props: any) => {
  return (
    components.DropdownIndicator && (
      <components.DropdownIndicator {...props}>
        <ArrowDownBlue />
      </components.DropdownIndicator>
    )
  )
}

const IndicatorSeparator = () => null

const StyledSelect = styled(ReactSelect).attrs<IStyledSelectProps>({})`
  width: 100%;

  ${({ theme }) => theme.fonts.defaultFontStyle};
  .react-select__control {
    background: ${({ theme }) => theme.colors.inputBackground};
    border-radius: 0;
    border: 0;
    box-shadow: none;
    font-size: 16px;
    padding: 0 5px;
    border-bottom: solid 1px
      ${({ error, touched, theme }) =>
        error && touched ? theme.colors.error : theme.colors.disabled};
  }

  .react-select__option {
    color: ${({ theme }) => theme.colors.copy};
    font-size: 14px;
  }

  .react-select__control--is-focused {
    border: 0;
    border-bottom: solid 1px ${({ theme }) => theme.colors.accent};
  }
`

function getSelectedOption(
  value: string,
  options: ISelectOption[]
): ISelectOption | null {
  const selectedOption = options.find((x: ISelectOption) => x.value === value)
  if (selectedOption) {
    return selectedOption
  }

  return null
}

interface ISelectProps extends Omit<IStyledSelectProps, 'value' | 'onChange'> {
  onChange: (value: string) => void
  value: string
}

export class Select extends React.Component<ISelectProps> {
  change = (selectedOption: ISelectOption) => {
    if (this.props.onChange) {
      this.props.onChange(selectedOption.value)
    }
  }
  render() {
    return (
      <StyledSelect
        classNamePrefix="react-select"
        components={{ DropdownIndicator, IndicatorSeparator }}
        {...this.props}
        onChange={this.change}
        value={getSelectedOption(this.props.value, this.props.options)}
      />
    )
  }
}
