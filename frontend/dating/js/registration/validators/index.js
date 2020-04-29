import Validator from '../../utils/validator'


function genderValidatorFactory(formSel) {
    return new Validator((value, state, goToNextStep) => {
        if (!goToNextStep) {
            return {valid: true}
        }
        let valid = /^(male|female)$/.test(value)
        if (valid) {
            return {valid}
        }
        return {
            valid,
            reason: 'Field is required'
        }
    }, reason => {
        if (reason) {
            document.querySelector(formSel).classList.add('has-error')
        } else {
            document.querySelector(formSel).classList.remove('has-error')
        }
    })
}


export let sexValidator = genderValidatorFactory('#sex-control')
export let lookingForValidator = genderValidatorFactory('#looking-for-control')


export let bdayValidator = new Validator(
    (value, state={
        isFocused: false,
        wasFocused: false
    }, goToNextStep) => {
        if (!goToNextStep && !state.wasFocused) {
            return {valid: true}
        }
        let {day, month, year} = value
        let date = new Date(year, month, day)
        if (isNaN(date)) {
            return {
                valid: false,
                reason: __('Введите, пожалуйста, настоящую дату')
            }
        }
        let timedelta = Date.now() - date
        const MILISECS_IN_YEAR = 1000 * 60 * 60 * 24 * 365
        let age = timedelta / MILISECS_IN_YEAR
        if (age < 18 || age > 100) {
            return {
                valid: false,
                reason: __(`Вы должны быть старше 18 лет, чтобы зарегистрироваться`)
            }
        }
        return {valid: true}
    }, reason => {
        let error = document.querySelector('.birthday .errors .date-error')
        if (reason) {
            error.removeAttribute('hidden')
        } else {
            error.setAttribute('hidden', true)
        }
    }
)

export let ageSearchValidator = new Validator(() => ({valid: true}), () => {})


export function lengthValidatorFactory(formSel, predicate, errMsg) {
    return new Validator(
        (value, state={
            isFocused: false,
            wasFocused: false
        }, goToNextStep) => {
            if (!goToNextStep && !state.wasFocused) {
                return {valid: true}
            }
            if (!predicate(value.length)) {
                return {
                    valid: false,
                    reason: errMsg
                }
            }
            return {valid: true}
        }, reason => {
            if (reason) {
                document.querySelector(formSel).classList.add('has-error')
            } else {
                document.querySelector(formSel).classList.remove('has-error')
            }
        }
    )
}


export let nameValidator = lengthValidatorFactory(
    '#name-control', length => length >= 2,
    __(`Минимальная длина имени - 2 символа`))


export function emailValidatorFactory(formSel) {
    return new Validator(
        (value, state={
            isFocused: false,
            wasFocused: false
        }, goToNextStep) => {
            console.log('here')
            console.log(window.VK_AUTH)
            if (window.VK_AUTH) {
                return {valid: true}
            }
            if (!goToNextStep && !state.wasFocused) {
                return {valid: true}
            }
            let emailRe = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
            if (!emailRe.test(value)) {
                return {
                    valid: false,
                    reason: __('Пожалуйста, введите действительный email адрес')
                }
            }
            let takenEmails = (localStorage.getItem('takenEmails') || '')
                .split(',')
            for (let email of takenEmails) {
                if (email == value) {
                    return {
                        valid: false,
                        reason: __(`Пользователь с таким email уже зарегистрирован`)
                    }
                }
            }
            return {valid: true}
        }, reason => {
            let container = document.querySelector(formSel)
            if (reason) {
                container.classList.add('has-error')
                container.querySelector('.error-message').textContent = reason
            } else {
                container.classList.remove('has-error')
                container.querySelector('.error-message').textContent = ''
            }
        }
    )
}


export let emailValidator = emailValidatorFactory('#email-control')


export let passwordValidator = new Validator(
    (value, state={
        wasFocused: false,
        isFocused: false
    }, goToNextStep) => {
        const MIN_PASSWORD_LENGTH = 8
        if (!goToNextStep && !state.wasFocused) {
            return {valid: true}
        }
        if (value.length < MIN_PASSWORD_LENGTH) {
            return {
                valid: false,
                reason: __('Пароль должен быть не менее') + MIN_PASSWORD_LENGTH + __('символов в длину')
            }

        }
        if (/^\d+$/.test(value)) {
            return {
                valid: false,
                reason: __(`Пароль не должен состоять только из цифр`)
            }
        }
        if (!/^[a-zA-Z0-9]+$/.test(value)) {
            return {
                valid: false,
                reason: __(`Пароль может состоять только из латинских букв или цифр`)
            }
        }
        return {valid: true}
    }, reason => {
        const passwordSel = '#password-control'
        const passwordErrMessageSel = '#password-err-message'
        if (reason) {
            document.querySelector(passwordSel)
                .classList.add('has-error')
            document.querySelector(passwordErrMessageSel)
                .textContent = reason
        } else {
            document.querySelector(passwordSel)
                .classList.remove('has-error')
            document.querySelector(passwordErrMessageSel)
                .textContent = ''
        }
    }
)


export let passwordRepValidator = new Validator(
    (value, state={
        isFocused: false,
        wasFocused: false
    }, goToNextStep) => {
        if (!goToNextStep && !state.wasFocused) {
            return {valid: true}
        }
        if (!value.repeated) {
            return {
                valid: false,
                reason: __(`Пожалуйста, введите пароль ещё раз`)
            }
        }
        if (value.password != value.repeated) {
            return {
                valid: false,
                reason: __(`Пароли не совпадают`)
            }
        }
        return {valid: true}
    }, reason => {
        const passwordRepSel = '#password-rep-control'
        const passwordRepErrMsgSel = '#password-rep-err-message'
        if (reason) {
            document.querySelector(passwordRepSel)
                .classList.add('has-error')
            document.querySelector(passwordRepErrMsgSel)
                .textContent = reason
        } else {
            document.querySelector(passwordRepSel)
                .classList.remove('has-error')
            document.querySelector(passwordRepErrMsgSel)
                .textContent = ''
        }
    }
)


function optionValidatorFactory(options, formSel) {
    const regex = new RegExp(`^(${options.join('|')})$`)
    return new Validator(
        (value, state={
            isFocused: false,
            wasFocused: false
        }, goToNextStep) => {
            if (!goToNextStep && !state.wasFocused) {
                return {valid: true}
            }
            if (regex.test(value)) {
                return {valid: true}
            }
            return {
                valid: false,
                reason: 'Please, select one of available options'
            }
        }, reason => {
            if (reason) {
                document.querySelector(formSel).classList.add('has-error')
            } else {
                document.querySelector(formSel).classList.remove('has-error')
            }
        }
    )
}


export let purposeValidator = optionValidatorFactory(
    ['long_term', 'short_term', 'new_friends'], '#purpose-control')

export let alcoholValidator = optionValidatorFactory(
    ['no_drink', 'company', 'rarely', 'often'], '#alcohol-control')

export let smokingValidator = optionValidatorFactory(
    ['negative', 'rarely', 'often'], '#smoking-control')

export let bodyTypeValidator = optionValidatorFactory(
    ['thin', 'average', 'sport', 'fat'], '#body-type-control')


export let photoSizeValidator = new Validator(
    (value, state={}, goToNextStep) => {
        if (value == null) {
            return {valid: true}
        }
        const BYTES_IN_MAGABYTE = 1024 * 1024
        let mbSize = value.size / BYTES_IN_MAGABYTE
        if (mbSize > 5) {
            return {
                valid: false,
                reason: __(`Размер фото не должен превышать 5 мегабайт`)
            }
        }
        return {valid: true}
    }, reason => {
        let error = document.getElementById('photo-size-error')
        if (reason) {
            error.removeAttribute('hidden')
        } else {
            error.setAttribute('hidden', true)
        }
    }
)


export let bdayDayValidator = new Validator(
    (day, state={
        isFocused: false,
        wasFocused: false
    }, goToNextStep) => {
        if (!state.wasFocused && !goToNextStep) {
            return {valid: true}
        }
        if (isNaN(day)) {
            return {
                valid: false,
                reason: __('Введите настоящий день')
            }
        }
        if (day < 1 || day > 31) {
            return {
                valid: false,
                reason: __('Введите настоящий день')
            }
        }
        return {valid: true}
    }, reason => {
        let error = document.querySelector('.birthday .errors .day-error')
        if (reason) {
            error.removeAttribute('hidden')
        } else {
            error.setAttribute('hidden', true)
        }
    }
)


export let bdayMonthValidator = new Validator(
    (month, state={
        isFocused: false,
        wasFocused: false
    }, goToNextStep) => {
        if (!state.wasFocused && !goToNextStep) {
            return {valid: true}
        }
        if (isNaN(month)) {
            return {
                valid: false,
                reason: __('Введите настоящий месяц')
            }
        }
        if (month < 1 || month > 12) {
            return {
                valid: false,
                reason: __('Введите настоящий месяц')
            }
        }
        return {valid: true}
    }, reason => {
        let error = document.querySelector('.birthday .errors .month-error')
        if (reason) {
            error.removeAttribute('hidden')
        } else {
            error.setAttribute('hidden', true)
        }
    }
)


export let bdayYearValidator = new Validator(
    (year, state={
        isFocused: false,
        wasFocused: false
    }, goToNextStep) => {
        if (!state.wasFocused && !goToNextStep) {
            return {valid: true}
        }
        if (isNaN(year)) {
            return {
                valid: false,
                reason: __('Введите настоящий год')
            }
        }
        if (year < 1920) {
            return {
                valid: false,
                reason: __('Введите настоящий год')
            }
        }
        return {valid: true}
    }, reason => {
        let error = document.querySelector('.birthday .errors .year-error')
        if (reason) {
            error.removeAttribute('hidden')
        } else {
            error.setAttribute('hidden', true)
        }
    }
)
