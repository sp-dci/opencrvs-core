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
import * as React from 'react'
import { colors } from '../colors'

export const Phone = (props: React.HTMLAttributes<SVGElement>) => {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M18 20.175C17.925 20.175 17.85 20.175 17.775 20.175C15.375 19.875 12.975 19.05 10.95 17.775C9.07495 16.575 7.42495 14.925 6.22495 13.05C4.87495 11.025 4.04995 8.625 3.82495 6.225C3.82495 5.625 3.97495 5.025 4.34995 4.575C4.72495 4.125 5.24995 3.825 5.84995 3.75C5.92495 3.75 5.99995 3.75 6.07495 3.75H8.32495C9.44995 3.75 10.425 4.575 10.575 5.7C10.65 6.375 10.8 7.05 11.025 7.65C11.325 8.475 11.1 9.375 10.5 10.05L9.97495 10.575C10.875 11.925 12 13.125 13.425 14.025L13.95 13.5C14.55 12.9 15.525 12.675 16.35 12.975C16.95 13.2 17.625 13.35 18.3 13.425C19.425 13.575 20.25 14.55 20.25 15.675V17.925C20.25 18.525 20.025 19.125 19.575 19.5C19.125 19.875 18.6 20.175 18 20.175ZM8.32495 5.25H6.07495C5.84995 5.25 5.62495 5.4 5.47495 5.55C5.39995 5.7 5.32495 5.85 5.32495 6.075C5.54995 8.25 6.29995 10.35 7.49995 12.225C8.62495 13.95 10.05 15.45 11.775 16.5C13.65 17.7 15.75 18.45 17.925 18.675C18.225 18.675 18.375 18.6 18.525 18.45C18.675 18.3 18.75 18.15 18.75 17.925V15.675C18.75 15.3 18.45 15 18.075 14.925C17.325 14.85 16.575 14.625 15.825 14.325C15.525 14.25 15.225 14.25 15 14.475L14.025 15.45C13.8 15.675 13.425 15.75 13.125 15.6C11.1 14.475 9.44995 12.825 8.32495 10.8C8.24995 10.5 8.32495 10.125 8.54995 9.9L9.52495 8.925C9.67495 8.775 9.74995 8.4 9.67495 8.175C9.37495 7.425 9.22495 6.675 9.07495 5.925C9.07495 5.55 8.69995 5.25 8.32495 5.25Z"
        fill="#222222"
      />
    </svg>
  )
}
