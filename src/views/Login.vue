<template>
  <v-container
    class="center fill-height"
    fluid
  >
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
            :rules="passwordRules"
            counter
            label="Şifre"
            required
            type="password"
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
            @click="validate"
          >
            Giriş Yap
          </v-btn>
        </v-form>
      </v-sheet>
    </v-row>
  </v-container>
</template>

<script>
  export default {
    data: () => ({
      valid: true,
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

    methods: {
      validate () {
        const val = this.$refs.form.validate()
        if (val) {
          this.$store.dispatch('user/login', this.user)
          this.$router.replace({ path: '/' })
        }
      },
    },
  }
</script>

<style></style>
