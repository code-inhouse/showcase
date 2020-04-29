let constantManager = new class {
  constructor() {
    this.constants = {}
  }

  set(constantName, constantValue) {
    if (constantName in this.constants) {
      throw `Constant ${constantName} is already defined`
    }
    if (!constantValue) {
      constantValue = constantName
    }
    this.constants[constantName] = constantValue
  }

  get(constantName) {
    if (constantName in this.constants) {
      return this.constants[constantName]
    }
    throw `Constant ${constantName} is not defined`
  }
}


constantManager.set('POST_SUBMITTING')
constantManager.set('POST_SUBMISSION_SUCC')
constantManager.set('POST_SUBMISSION_ERR')

constantManager.set('POSTS_FETCHED')
constantManager.set('POSTS_FETCHING')

constantManager.set('POST_DELETED')


export default constantManager
