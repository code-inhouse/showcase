export class State {
    constructor(elementId, ctrlValidatorPairs={}, saveFn) {
        this.elementId = elementId
        this.behaviors = ctrlValidatorPairs
        this.nextStepTry = false
        for (let key of Reflect.ownKeys(ctrlValidatorPairs)) {
            let {controller, validator, validation} = this.behaviors[key]
            if (validation) {
                this[`${key}Validation`] = validation
            } else {
                this[`${key}Validation`] = (goToNextStep=false, behaviors) => (
                    validator.isValid(
                        controller.map(), controller.state, goToNextStep)
                )
            }
            if (controller) {
                controller.init(this.onChange)
            }
        }
        this.saveFn = saveFn
    }

    save() {
        if (this.saveFn) {
            this.saveFn()
        }
    }

    isValid(goToNextStep=false) {
        if (goToNextStep) {
            this.nextStepTry = true
        }
        return Reflect.ownKeys(this.behaviors).reduce((isValid, key) => {
            return isValid &&
                   this[`${key}Validation`](
                      this.nextStepTry,
                      this.behaviors).valid
        }, true)
    }

    displayErrors(goToNextState=false) {
        if (goToNextState) {
            this.nextStepTry = true
        }
        for (let key of Reflect.ownKeys(this.behaviors)) {
            let validation = this[`${key}Validation`](
                this.nextStepTry, this.behaviors)
            let {validator} = this.behaviors[key]
            validator.displayErrors(validation.reason)
        }
    }

    onChange = () => {
        this.displayErrors()
    }

    onNextStep() {}
}


export class AuthDataStep extends State {
    constructor(elementId, ctrlValidatorPairs, saveFn, passKey, passRepKey) {
        super(elementId, ctrlValidatorPairs, saveFn)
        Object.defineProperty(this, `${passRepKey}Validation`, {
            get() {
                return (goToNextStep=false, behaviors) => (
                    this.behaviors[passRepKey].validator.isValid({
                        password: this.behaviors[passKey].controller.map(),
                        repeated: this.behaviors[passRepKey].controller.map()
                    }, {
                        wasFocused: this.behaviors[passRepKey].controller.state.wasFocused,
                        isFocused: this.behaviors[passRepKey].controller.state.isFocused
                    }, goToNextStep)
                )
            },
            configurable: true
        })
    }

    onNextStep() {
        document.body.classList.remove('registration--step-2')
        document.body.classList.add('registration--step-3')
        if (window.VK_AUTH) {
            window.yaCounter42711874.reachGoal('SocialRegistration Step 2')
        } else {
            window.yaCounter42711874.reachGoal('Registration Step 3')
        }
    }
}


export class QuestionnaireStep extends State {
    constructor(elementId, ctrlValidatorPairs, saveFn,
                dayKey, monthKey, yearKey, bdayKey) {
        super(elementId, ctrlValidatorPairs, saveFn)
        Object.defineProperty(this, `${bdayKey}Validation`, {
            get() {
                let wasFocused = [dayKey, monthKey, yearKey].reduce(
                    (acc, key) => (acc &&
                                   this.behaviors[key]
                                   .controller.state.wasFocused),
                    true
                )
                return (goToNextStep=false, behaviors) => (
                    this.behaviors[bdayKey].validator.isValid({
                        day: this.behaviors[dayKey].controller.map(),
                        month: this.behaviors[monthKey].controller.map(),
                        year: this.behaviors[yearKey].controller.map()
                    }, {
                        wasFocused
                    }, goToNextStep)
                )
            }
        })
    }

    onNextStep() {
        document.body.classList.remove('registration--step-3')
        document.body.classList.add('registration--step-4')
        if (window.VK_AUTH) {
            yaCounter42711874.reachGoal('SocialRegistration Step 3')
        } else {
            yaCounter42711874.reachGoal('Registration Step 4')
        }
    }
}




export class DummyQuestionsStep extends State {

    QUESTIONS = [
        __('Могли бы вы встречаться с кем-то неряшливым?'),
        __('Вам нравятся фильмы ужасов?'),
        __('Курение отвратительно?'),
        __('Ревность помогает отношениям?'),
        __('Вас раздражают грамматичекие ошибки?'),
        __('Вы верите в то, что все события имеют причину?'),
        __('Вам нравится вкус пива?'),
        __('Вам нравятся интеллектуальные беседы?'),
        __('Вы вегетарианец?'),
        __('Вы верите в судьбу?'),
    ]

    QUESTIONS_TO_ANSWER = 7


    constructor(elementId, onFinish=()=>{}) {
        super(elementId)
        this.questions = this.QUESTIONS.slice()  // copy
        this.answeredCount = 0
        this.curQuestionIndex = 0
        this.onFinish = onFinish
        let yesBtns = document.querySelectorAll('.test__btn--first')
        let noBtns = document.querySelectorAll('.test__btn--second')
        let skipBtns = document.querySelectorAll('.skip-question')
        for (let btn of yesBtns) {
            btn.addEventListener('click', this.onYes)
        }
        for (let btn of noBtns) {
            btn.addEventListener('click', this.onNo)
        }
        for (let btn of skipBtns) {
            btn.addEventListener('click', this.onSkip)
        }
    }

    get curQuestion() {
        return this.questions[this.curQuestionIndex]
    }

    answerQuestion() {
        this.questions.splice(this.curQuestionIndex, 1)
        this.answeredCount++
        this.curQuestionIndex = this.curQuestionIndex % this.questions.length
        if (this.answeredCount >= this.QUESTIONS_TO_ANSWER) {
            this.onFinish()
        }
    }

    animate(deletedClass) {
        let current = document.querySelector('.question-current')
        let secondToFirst = document.querySelector('.question-second-to-first')
        let thirdToSecond = document.querySelector('.question-third-to-second')
        let deleted = document.querySelector('.question-delete-yes') ||
                    document.querySelector('.question-delete-no') ||
                    document.querySelector('.question-delete-skip')
        secondToFirst.querySelector('.test__title').textContent =
            `${__('Вопрос')} ${this.answeredCount+1} ${__("из")} ${this.QUESTIONS_TO_ANSWER}`
        secondToFirst.querySelector('.test__content').textContent =
            this.curQuestion
        current.classList.remove('question-current')
        current.classList.add(deletedClass)
        secondToFirst.classList.remove('question-second-to-first')
        secondToFirst.classList.add('question-current')
        thirdToSecond.classList.remove('question-third-to-second')
        thirdToSecond.classList.add('question-second-to-first')
        deleted.classList.remove('question-delete-yes',
                               'question-delete-no',
                               'question-delete-skip')
        deleted.classList.add('question-third-to-second')
    }

    formQuestion() {
        let q = `input[name="form-dummy-question-${this.answeredCount+1}"]`
        return document.querySelector(q)
    }

    formAnswer() {
        let q = `input[name="form-dummy-question-answer-${this.answeredCount+1}"]`
        return document.querySelector(q)
    }

    onYes = e => {
        this.answerQuestion()
        this.formQuestion().value = this.curQuestion
        this.formAnswer().value = 'yes'
        this.animate('question-delete-yes')
    }

    onNo = e => {
        this.answerQuestion()
        this.formQuestion().value = this.curQuestion
        this.formAnswer().value = 'no'
        this.animate('question-delete-no')
    }

    onSkip = e => {
        this.curQuestionIndex =
            (this.curQuestionIndex + 1) % this.questions.length
        this.animate('question-delete-skip')
    }

    onNextStep() {
        document.body.classList.remove('registration--step-4')
        document.body.classList.add('registration--step-5')
        if (window.VK_AUTH) {
            yaCounter42711874.reachGoal('SocialRegistration Step 4')
        } else {
            yaCounter42711874.reachGoal('Registration Step 5')
        }
    }
}
