import * as React from 'react'
import styled from 'styled-components'

export interface IInvertSpinner {
  id: string
  baseColor?: string
  className?: string
}

const styledSpinner = styled.div.attrs<IInvertSpinner>({})

const StyledSpinner = styledSpinner`
  font-size: 10px;
  text-indent: -9999em;
  width: 6em;
  height: 6em;
  border-radius: 50%;
  background: ${({ theme }) => theme.colors.white};
  background: -moz-linear-gradient(left, ${({ theme }) =>
    theme.colors.gradientLight} 10%, ${({ theme }) => theme.colors.white} 42%);
  background: -webkit-linear-gradient(left, ${({ theme }) =>
    theme.colors.gradientLight} 10%, ${({ theme }) => theme.colors.white} 42%);
  background: -o-linear-gradient(left, ${({ theme }) =>
    theme.colors.gradientLight} 10%, ${({ theme }) => theme.colors.white} 42%);
  background: linear-gradient(to right, ${({ theme }) =>
    theme.colors.gradientLight} 10%, ${({ theme }) => theme.colors.white} 42%);
  position: relative;
  -webkit-animation: load3 0.4s infinite linear;
  animation: load3 0.4s infinite linear;
  -webkit-transform: translateZ(0);
  -ms-transform: translateZ(0);
  transform: translateZ(0);
  &:before {
    width: 50%;
    height: 50%;
    background: ${({ baseColor }) => (baseColor ? baseColor : '#4C68C1')};
    border-radius: 100% 0 0 0;
    position: absolute;
    top: 0;
    left: 0;
    content: '';
  }
  &:after {
    background: ${({ baseColor }) => (baseColor ? baseColor : '#4C68C1')};
    width: 80%;
    height: 80%;
    border-radius: 50%;
    content: '';
    margin: auto;
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
  }
}

@-webkit-keyframes load3 {
  0% {
    -webkit-transform: rotate(0deg);
    transform: rotate(0deg);
  }
  100% {
    -webkit-transform: rotate(360deg);
    transform: rotate(360deg);
  }
}
@keyframes load3 {
  0% {
    -webkit-transform: rotate(0deg);
    transform: rotate(0deg);
  }
  100% {
    -webkit-transform: rotate(360deg);
    transform: rotate(360deg);
  }
}`

export class InvertSpinner extends React.Component<IInvertSpinner> {
  render() {
    const { children, id, className, baseColor } = this.props
    return (
      <StyledSpinner id={id} className={className} baseColor={baseColor}>
        {children}
      </StyledSpinner>
    )
  }
}
