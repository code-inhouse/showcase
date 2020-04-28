import * as constants from '../constants'

import genderControllerFactory from './gender-controller-factory'
import {sexValidator, lookingForValidator} from '../validators'
import InputController from './input-controller'
import NumberInputController from './number-input-controller'


export {default as InputTrimmedController} from './input-trimmed-controller'
export {default as nameController} from './name-controller'
export {default as ageSearchController} from './age-search-controller'

export let sexController = genderControllerFactory(
    '#sex-male-btn', '#sex-female-btn', constants.LS_SEX)

export let lookingForController = genderControllerFactory(
    '#looking-for-male-btn',
    '#looking-for-female-btn',
    constants.LS_LOOKING_FOR)

export let passwordController = new InputController('#password-input')
export let passwordRepController = new InputController('#password-rep-input')

export let bdayDayController = new NumberInputController(
    '.birthday .day', constants.LS_BDAY_DAY)
export let bdayMonthController = new NumberInputController(
    '.birthday .month', constants.LS_BDAY_MONTH)
export let bdayYearController = new NumberInputController(
    '.birthday .year', constants.LS_BDAY_YEAR)

export let emailController = new class extends InputController {
    map() {
        return this.state.inputVal.trim()
    }
}('#email-input', constants.LS_MAIL)

export let photoController = new class extends InputController {
    map() {
        return this.input.files[0]
    }
}('#id_image')

export let bdayController = new InputController('#bday-input')
export let purposeController = new InputController(
    '#purpose-input', constants.LS_PURPOSE)
export let alcoholController = new InputController(
    '#alcohol-input', constants.LS_ALCOHOL)
export let smokingController = new InputController(
    '#smoking-input', constants.LS_SMOKING)
export let bodyTypeController = new InputController(
    '#body-type-input', constants.LS_BUILD)
