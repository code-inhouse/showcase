<template>
  <div class="auth-input-wrapper">
    <span :class="{'input': true, 'input--akira': true, 'input--filled': !!value}">
      <input
        :type="type"
        class="input__field input__field--akira"
        :value="value"
        @change="$emit('change', $event.target.value)"
        :id="inputId"
      />
      <label class="input__label input__label--akira" :for="inputId">
        <span class="input__label-content input__label-content--akira">{{ label }}</span>
      </label>
    </span>
    <span v-show="error" class="input__error">
      {{ error }}
    </span>
  </div>
</template>

<style>
  .auth-input-wrapper {
    min-width: 200px;
    margin-bottom: 25px;
    display: block;
    position: relative;
  }

  .input__error {
    position: absolute;
    bottom: -8px;
    left: 24px;
    color: red !important;
  }
</style>

<script>
  let id = 0
  const prefix = 'form-input-'

  export default {
    model: {
      prop: 'value',
      event: 'change',
    },
    props: {
      error: String,
      value: String,
      label: String,
      type: {
        type: String,
        required: false,
        default: 'text',
      },
      inputId: {
        type: String,
        default() {
          return `${prefix}${id++}`
        }
      }
  },
    data() {
      return {
        inputId: id++,
      }
    }
  }
</script>
