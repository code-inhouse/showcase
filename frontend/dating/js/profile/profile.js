import {russianAge} from '../utils/localization'


export default class Profile {
    constructor(config) {
        for (let key of Reflect.ownKeys(config)) {
            this[key] = config[key]
        }
    }

    get selfEnDescription() {
        let sex = this.sex == 'male' ? 'Man' : 'Woman'
        let age = this.age + ' years old'
        let bodyTypeMapper = {
            'thin': 'thin',
            'average': 'average',
            'sport': 'athletic',
            'fat': 'plump'
        }
        let body = `${bodyTypeMapper[this.bodyType]} body`
        let alcohol
        if (this.attitudes.alcohol == 'no_drink') {
            alcohol = "don't drink alcohol"
        } else if (this.attitudes.alcohol == 'company') {
            alcohol = "drink alcohol in company"
        } else if (this.attitudes.alcohol == 'rarely') {
            alcohol = "drink alcohol rarely"
        } else {
            alcohol = "drink alcohol often"
        }
        let smoking
        if (this.attitudes.smoking == 'negative') {
            smoking = "can't bear smokin"
        } else if (this.attitudes.smoking == 'rarely') {
            smoking = "smoke rarely"
        } else {
            smoking = "smoke often"
        }
        return `${sex}, ${age}, ${alcohol}, ${smoking}`
    }

    get selfRuDescription() {
        let sex = this.sex == 'male' ? 'Мужчина' : 'Женщина'
        let age_str = russianAge(this.age)
        const bodyTypeMapper = {
            'thin': 'худощавое',
            'average': 'среднее',
            'sport': 'спортивное',
            'fat': 'полноватое'
        }
        let bodyType = bodyTypeMapper[this.bodyType]
        const alcoholMapper = {
            'no_drink': 'не употребляю',
            'company': '- только в компании',
            'rarely': 'пью редко',
            'often': 'пью часто'
        }
        let alcoholDesc = alcoholMapper[this.attitudes.alcohol]
        const smokingMapper = {
            'negative': 'негативноe',
            'rarely': 'курю редко',
            'often': 'курю часто'
        }
        let smokingDesc = smokingMapper[this.attitudes.smoking]
        return `${sex}, ${age_str}, ${bodyType} телосложение,
            алкоголь ${alcoholDesc}, отношение к курению - ${smokingDesc}`
    }

    get selfDescription() {
        if (window.LOCALE == 'en') {
            return this.selfEnDescription
        } else {
            return this.selfRuDescription
        }
    }

    get lookingForEnDescription() {
        let sex = this.lookingFor.sex == 'male' ? 'Man' : 'Woman'
        let {from, to} = this.lookingFor.age
        let purpose
        if (this.purpose == 'long_term') {
            purpose = 'for serious relationship'
        } else if (this.purpose == 'short_term') {
            purpose = 'for fast relationships'
        } else {
            purpose = 'to meet new friends'
        }
        return `${sex}, ${from}-${to} years old, ${purpose}`
    }

    get lookingForRuDescription() {
        let sex = this.lookingFor.sex == 'male' ? 'Мужчину' : 'Женщину'
        let {from, to} = this.lookingFor.age
        const purposeMapper = {
            'long_term': 'для серьёзных отношений',
            'short_term': 'для быстрых отношений',
            'new_friends': 'чтобы завести новые знакомства'
        }
        let purpose = purposeMapper[this.purpose]
        return `${sex}, ${from}-${to} лет, ${purpose}`
    }

    get lookingForDescription() {
        if (window.LOCALE == 'en') {
            return this.lookingForEnDescription
        } else {
            return this.lookingForRuDescription
        }
    }

    get russianAge() {
        return russianAge(this.age)
    }

}
