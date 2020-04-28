<template>
  <div>
    <div id="user-image" @click="onClick">
      <img :src="avatar" alt="user-image">
      <i class="fa fa-camera change--caption" aria-hidden="true"> Change</i>
      <div class="change--spinner" v-if="uploading">
        <i class="fa fa-spinner" aria-hidden="true" />
      </div>
    </div>
    <h3 class="text-bold" style="text-align: center;">{{ name }}</h3>
    <input
      type="file"
      style="display: none;"
      @change="onChange"
      ref="input"
      accept="image/*"
    />
  </div>
</template>

<style>
  #user-image {
    width: 150px;
    height: 150px;
  }

  @keyframes rotating {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }

  .change--spinner {
    position: absolute;
    width: 150px;
    height: 150px;
    top: 0;
    left: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    background: rgba(0, 0, 0, 0.5);
  }

  .change--spinner i.fa-spinner {
    animation: rotating 2s linear infinite;
  }

  .section1 {
    padding: 16px;
    display: flex;
    justify-content: center;
  }

  #user-image:hover {
    cursor: pointer;
  }

  #user-image {
      position: relative;
      border-radius: 50%;
      overflow: hidden;
  }

  #user-image i.fa-camera {
    position: absolute;
    top: 110px;
    left: 10px;
    background: rgba(37,37,37,0.6);
    padding: 10px 30px 15px;
    color: white;
    opacity: 0.5;
    cursor: pointer;
  }

  #user-image:hover i.fa-camera {
    opacity: 1;
  }
</style>

<script>
  export default {
    props: ['initialName', 'initialAvatar'],
    data() {
      return {
        name: this.initialName,
        avatar: this.initialAvatar,
        uploading: false,
      }
    },
    methods: {
      async onChange(e) {
        const file = e.target.files[0]
        this.uploading = true
        const form = new FormData()
        form.append('avatar', file)
        try {
          const { body } = await this.$http.post('/api/upload_avatar/', form, {
            emulateJSON: true
          })
          this.avatar = body
          this.$notify({
            type: 'success',
            title: 'Saved'
          })
        } catch (e) {
          this.$notify({
            type: 'error',
            title: 'Error updating avatar'
          })
        }
        this.uploading = false

      },
      onClick() {
        if (this.uploading) {
          return
        }
        this.$refs.input.click()
      }
    }
  }
</script>
