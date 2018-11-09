import * as React from 'react'
import styled from 'styled-components'

import { Select, ISelectOption } from '../forms/Select'

export enum SelectFieldType {
  Date
}
export interface ISelectGroupOption {
  name: string
  options: ISelectOption[]
  value: string
  type?: SelectFieldType.Date
}

export interface ISelectGroupProps {
  name: string
  values: ISelectGroupValue
  onChange: (
    value: ISelectGroupValue,
    changedValue: ISelectGroupValue,
    type?: SelectFieldType
  ) => void
  options: ISelectGroupOption[]
}

export interface ISelectGroupValue {
  [key: string]: string
}

const Wrapper = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
`

const StyledSelect = styled(Select)`
  width: 200px;
  margin: 10px;
  margin-left: 0;
`
export class SelectGroup extends React.Component<ISelectGroupProps> {
  change = ({ name, value }: ISelectGroupValue, type?: SelectFieldType) => {
    const change: ISelectGroupValue = {}
    change[name] = value
    const newValue: ISelectGroupValue = { ...this.props.values, ...change }
    if (this.props.onChange) {
      this.props.onChange(newValue, change, type)
    }
  }

  render() {
    const { options, values, name, onChange, ...otherProps } = this.props

    return (
      <Wrapper>
        {options.map(option => {
          return (
            <StyledSelect
              id={`${name}_${option.value}`}
              key={option.name}
              value={values[option.name]}
              options={option.options}
              onChange={(selectedValue: string) =>
                this.change(
                  { name: option.name, value: selectedValue },
                  option.type
                )
              }
              {...otherProps}
            />
          )
        })}
      </Wrapper>
    )
  }
}
