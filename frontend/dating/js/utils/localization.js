export function russianAge(age) {
  if (window.LOCALE == 'en') {
    return `${age} years`
  } else {
    const endingMap = ['лет', 'год', 'года', 'года', 'года',
                       'лет', 'лет', 'лет', 'лет', 'лет']
    let ageEnding = endingMap[age % 10]
    return `${age} ${ageEnding}`
  }
}
