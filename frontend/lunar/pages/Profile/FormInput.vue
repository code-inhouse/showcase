<template>
  <div class="form-group form-group--profile">
    <label :for="inputId" class="col-lg-12 control-label">{{ label }}</label>
    <div class="col-lg-12">
      <input
        class="form-control input-type-1"
        :id="inputId"
        :value="value"
        @change="$emit('change', $event.target.value)"
        :placeholder="placeholder"
        :disabled="disabled"
        :type="type"
      />
    </div>
  </div>
</template>

<style>
  .form-group--profile .form-control {
    color: white;
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
      disabled: {
        type: Boolean,
        default: false,
      },
      error: String,
      value: String,
      placeholder: String,
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
    }
  }
</script>
