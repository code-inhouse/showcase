import Vue from 'vue'
import { Hedgehog } from '@audius/hedgehog'

const setAuthFn = async (obj) => {
  await Vue.http.post('/api/hedgehog/authentication/', {
    iv: obj.iv,
    cipher_text: obj.cipherText,
    lookup_key: obj.lookupKey,
  }, {
    emulateJSON: true
  })
}

const setUserFn = async (obj) => {
  await Vue.http.post('/api/hedgehog/users/', {
    username: obj.username,
    address: obj.walletAddress
  }, {
    emulateJSON: true
  })
}

const getFn = async (obj) => {
  const { body } = await Vue.http.get(`/api/hedgehog/lookup/?lookup_key=${obj.lookupKey}`)
  return body
}

export const hedgehog = new Hedgehog(getFn, setAuthFn, setUserFn)
