import {
    State,
    AuthDataStep,
    QuestionnaireStep,
    DummyQuestionsStep
} from '../state'
import * as controllers from '../controllers'
import * as validators from '../validators'
import stateManager from '../state-manager'


export let authDataStep = new AuthDataStep(
    'auth-data-step', {
        email: {
            controller: controllers.emailController,
            validator: validators.emailValidator
        },
        password: {
            controller: controllers.passwordController,
            validator: validators.passwordValidator
        },
        passwordRep: {
            controller: controllers.passwordRepController,
            validator: validators.passwordRepValidator
        }
    }, function() {
        let behaviors = this.behaviors
        document.getElementById('id_email').value =
            behaviors.email.controller.map()
        document.getElementById('id_password1').value =
            behaviors.password.controller.map()
        document.getElementById('id_password2').value =
            behaviors.password.controller.map()
    },
    'password',
    'passwordRep'
)


export let firstStep = new class extends State {
    onNextStep() {
        document.body.classList.remove('registration--step-1')
        document.body.classList.add('registration--step-2')
        if (!window.VK_AUTH) {
            yaCounter42711874.reachGoal('Registration Step 2')
        }
    }
}('first-step-container', {
    sex: {
        controller: controllers.sexController,
        validator: validators.sexValidator
    },
    lookingFor: {
        controller: controllers.lookingForController,
        validator: validators.lookingForValidator
    },
    name: {
        controller: controllers.nameController,
        validator: validators.nameValidator
    }
}, function() {
    let behaviors = this.behaviors
    document.getElementById('id_sex').value =
        behaviors.sex.controller.map()
    document.getElementById('id_looking_for').value =
        behaviors.lookingFor.controller.map()
    document.getElementById('id_name').value =
        behaviors.name.controller.map()
})


export let questionnaireStep = new QuestionnaireStep('questionnaire-step', {
    bdayDay: {
        controller: controllers.bdayDayController,
        validator: validators.bdayDayValidator,
    },
    bdayMonth: {
        controller: controllers.bdayMonthController,
        validator: validators.bdayMonthValidator
    },
    bdayYear: {
        controller: controllers.bdayYearController,
        validator: validators.bdayYearValidator
    },
    birthday: {
        validator: validators.bdayValidator
    },
    searchAge: {
        controller: controllers.ageSearchController,
        validator: validators.ageSearchValidator
    },
    purpose: {
        controller: controllers.purposeController,
        validator: validators.purposeValidator
    },
    bodyType: {
        controller: controllers.bodyTypeController,
        validator: validators.bodyTypeValidator
    },
    alcohol: {
        controller: controllers.alcoholController,
        validator: validators.alcoholValidator
    },
    smoking: {
        controller: controllers.smokingController,
        validator: validators.smokingValidator
    }
}, function() {
    let {behaviors} = this
    document.getElementById('id_lower_age_bound').value =
        behaviors.searchAge.controller.map().lowerAgeBound
    document.getElementById('id_upper_age_bound').value =
        behaviors.searchAge.controller.map().upperAgeBound
    document.getElementById('id_purpose').value =
        behaviors.purpose.controller.map()
    document.getElementById('id_alcohol_attitude').value =
        behaviors.alcohol.controller.map()
    document.getElementById('id_smoking_attitude').value =
        behaviors.smoking.controller.map()
    document.getElementById('id_build').value =
        behaviors.bodyType.controller.map()
    let day = this.behaviors.bdayDay.controller.map(),
        month = this.behaviors.bdayMonth.controller.map(),
        year = this.behaviors.bdayYear.controller.map()
    let bday = new Date(year, month - 1, day)
    let dateDay = bday.getDate(),
        dateMonth = +bday.getMonth() + 1,
        dateYear = bday.getFullYear()
    document.getElementById('id_birthday').value =
        `${dateYear}-${dateMonth}-${dateDay}`
}, 'bdayDay', 'bdayMonth', 'bdayYear', 'birthday')


export let dummyQuestions =
    new DummyQuestionsStep('dummy-questions', () => {
        stateManager.stepForward()
    })
