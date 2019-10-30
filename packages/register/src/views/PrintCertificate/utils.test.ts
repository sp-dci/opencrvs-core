import {
  calculateDays,
  timeElapsed,
  getCountryTranslations
} from '@register/views/PrintCertificate/utils'

describe('calculateDays, timeElapsed tests', () => {
  it('timeElapsedInWords function returns required time duration in words', () => {
    // @ts-ignore
    Date.now = jest.fn(() => new Date('2019-01-01'))

    let days = calculateDays('1985-08-18')

    let time = timeElapsed(days)
    expect(time.value).toBe(33)
    expect(time.unit).toBe('Year')
    days = calculateDays('2018-12-16')
    time = timeElapsed(days)
    expect(time.value).toBe(16)
    expect(time.unit).toBe('Day')

    days = calculateDays('2018-10-16')
    time = timeElapsed(days)
    expect(time.value).toBe(2)
    expect(time.unit).toBe('Month')
  })
  it('returns an object with available transaltions for countries', () => {
    // @ts-ignore
    const languageState = {
      en: {
        lang: 'en',
        displayName: 'English',
        messages: {
          'countries.BGD': 'Bangladesh'
        }
      },
      bn: {
        lang: 'bn',
        displayName: 'বাংলা',
        messages: {
          'countries.BGD': 'বাংলাদেশ'
        }
      }
    }
    const countries = [
      {
        value: 'BGD',
        label: {
          id: 'BGD',
          defaultMessage: 'Bangladesh',
          description: 'A label for Bangladesh'
        }
      }
    ]
    const availableCountries = getCountryTranslations(languageState, countries)
    expect(availableCountries).toMatchObject([
      { countries: [{ value: 'BGD', name: 'Bangladesh' }], language: 'en' },
      { countries: [{ value: 'BGD', name: 'বাংলাদেশ' }], language: 'bn' }
    ])
  })
})
