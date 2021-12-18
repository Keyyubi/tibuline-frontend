<template>
  <v-container
    class="center fill-height login"
    fluid
  >
    <div class="imge">
      <v-img
        width="80"
        height="40"
        contain
        src="~@/assets/logo.png"
      />
    </div>
    <v-row>
      <v-sheet
        rounded
        class="mx-auto pa-4"
        width="400"
      >
        <v-form
          ref="form"
          v-model="valid"
          lazy-validation
        >
          <v-text-field
            v-model="user.email"
            :rules="emailRules"
            label="E-mail"
            required
          />

          <v-text-field
            v-model="user.password"
            :append-icon="!showPwd ? 'mdi-eye' : 'mdi-eye-off'"
            :type="!showPwd ? 'password' : 'text'"
            :rules="passwordRules"
            counter
            label="Şifre"
            required
            @click:append="() => (showPwd = !showPwd)"
          />

          <v-checkbox
            v-model="rememberMe"
            label="Beni Hatırla"
            color="success"
          />

          <v-btn
            width="100%"
            color="success"
            class="mr-4"
            :disabled="isLoading"
            depressed
            @click="validate"
          >
            <v-progress-circular
              v-if="isLoading"
              width="3"
              color="success"
              indeterminate
            />
            {{ isLoading ? '' : 'Giriş Yap' }}
          </v-btn>
        </v-form>
      </v-sheet>
    </v-row>
  </v-container>
</template>

<script>
  import { get } from 'vuex-pathify'
  export default {
    data: () => ({
      valid: true,
      showPwd: false,
      user: {
        email: '',
        password: '',
      },
      emailRules: [
        v => !!v || 'Lütfen e-mail adresinizi girin',
        v => /.+@.+\..+/.test(v) || 'Lütfen geçerli bir e-mail girin',
      ],
      passwordRules: [
        v => !!v || 'Şifrenizi girin',
        v => (v && v.length >= 8) || 'Şifre minimum 8 karakter olmalıdır',
      ],
      rememberMe: false,
    }),
    computed: {
      ...get('app', ['isLoading']),
    },
    methods: {
      validate () {
        const val = this.$refs.form.validate()
        if (val) {
          this.$store.dispatch('user/login', this.user)
        }
      },
    },
  }
</script>

<style lang="scss" scoped>
.login {
  width: 100%;
  height: 100%;
  margin: 0;
  padding: 0;
  background-image: url('~@/assets/lock.jpg');
  background-size: cover;
  overflow: hidden;
}
.imge {
  position: absolute;
  bottom: 20px;
  right: 20px;
}
</style>
