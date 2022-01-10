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
import { Meta, Story } from '@storybook/react'
import { Loader, ILoader } from './Loader'
import React from 'react'

const Template: Story<ILoader> = (args) => <Loader {...args} />

export const LoaderView = Template.bind({})
LoaderView.args = {
  id: 'Loader',
  loadingText: 'Loading all data',
  marginPercent: 15,
  spinnerDiameter: 24
}

export default {
  title: 'Components/Interface/Loader',
  component: Loader
} as Meta
