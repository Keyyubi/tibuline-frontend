<template>
  <v-card>
    <v-card-title
      v-if="formType !== 'create'"
      class="text-h5 primary white--text"
    >
      Kullanıcı Güncelle
    </v-card-title>

    <v-card-text>
      <v-container class="my-4">
        <v-row>
          <!-- Username -->
          <v-col
            cols="12"
            md="4"
          >
            <v-text-field
              v-model="user.username"
              label="Kullanıcı Adı"
              :rules="[v => !!v || 'Kullanıcı adı boş geçilemez',]"
              required
              @change="user.email = user.username + '@'"
            />
          </v-col>

          <!-- Email -->
          <v-col
            cols="12"
            md="4"
          >
            <v-text-field
              v-model="user.email"
              label="E-mail"
              :rules="Rules.EMAIL"
              required
            />
          </v-col>

          <!-- Password -->
          <v-col
            v-if="formType === 'create'"
            cols="12"
            md="4"
          >
            <v-text-field
              v-model="user.password"
              label="Şifre"
              :append-icon="!showPwd ? 'mdi-eye' : 'mdi-eye-off'"
              :type="!showPwd ? 'password' : 'text'"
              :rules="Rules.PASSWORD"
              counter
              required
              @click:append="() => (showPwd = !showPwd)"
            />
          </v-col>

          <!-- Role -->
          <v-col
            cols="12"
            md="4"
          >
            <v-select
              v-model="user.roleId"
              :items="roles"
              item-text="label"
              item-value="value"
              label="Kullanıcı Rolü"
              :rules="[v => (!!v || v === 0) || 'Rol seçmelisiniz']"
              required
            />
          </v-col>

          <!-- Firstname -->
          <v-col
            cols="12"
            md="4"
          >
            <v-text-field
              v-model="user.firstname"
              label="Adı"
              :rules="[v => !!v || 'Ad boş geçilemez',]"
              required
            />
          </v-col>

          <!-- Lastname -->
          <v-col
            cols="12"
            md="4"
          >
            <v-text-field
              v-model="user.lastname"
              label="Soyadı"
              :rules="[v => !!v || 'Soyad boş geçilemez',]"
              required
            />
          </v-col>

          <!-- Phone -->
          <v-col
            cols="12"
            md="4"
          >
            <v-text-field
              v-model="user.phone"
              v-mask="'(###) ### ####'"
              label="Cep Telefonu"
              append-icon="mdi-close"
              prepend-icon="mdi-phone"
              :rules="Rules.PHONE"
              required
              @click:append="user.phone = ''"
            />
          </v-col>

          <!-- TCKN -->
          <v-col
            cols="12"
            md="4"
          >
            <v-text-field
              v-model="user.tckn"
              v-mask="'###########'"
              label="TCKN"
              :rules="Rules.TCNO"
              required
            />
          </v-col>

          <!-- Supplier -->
          <v-col
            v-if="this.user.roleId === 2"
            cols="12"
            md="4"
          >
            <v-select
              v-model="user.supplierId"
              :items="suppliers"
              item-text="name"
              item-value="id"
              label="Şirket"
              :rules="[v => (!!v || v === 0) || 'Şirket seçmelisiniz']"
              required
            />
          </v-col>
        </v-row>
      </v-container>
    </v-card-text>

    <v-divider />

    <!-- Card Actions -->
    <v-card-actions>
      <v-row>
        <v-col
          v-if="formType === 'create'"
          cols="6"
        >
          <v-btn
            color="warning"
            width="100%"
            depressed
            outlined
            @click="reset()"
          >
            Formu Temizle
          </v-btn>
        </v-col>
        <v-col
          cols="6"
          class="text-right"
        >
          <v-btn
            color="primary"
            width="100%"
            depressed
            @click="updateUser"
          >
            {{ formType === 'create' ? 'Oluştur' : 'Güncelle' }}
          </v-btn>
        </v-col>
        <v-col
          v-if="formType !== 'create'"
          cols="6"
          class="text-right"
        >
          <v-btn
            color="error"
            width="100%"
            depressed
            @click="$emit('close-dialog')"
          >
            Vazgeç
          </v-btn>
        </v-col>
      </v-row>
    </v-card-actions>
  </v-card>
</template>

<script>
  import { RULES as Rules } from '@/util/globals'
  import { CheckIsNull } from '@/util/helpers'
  import { get } from 'vuex-pathify'
  export default {
    name: 'UserForm',
    props: {
      formType: { type: String, default: 'create' },
      user: { type: Object, default: null },
    },
    data: () => ({
      showPwd: false,
      roles: [
        { label: 'Tam yetkili', value: 99 },
        { label: 'Sistem yöneticisi', value: 0 },
        { label: 'Birim Müdürü', value: 1 },
        { label: 'Tedarikçi', value: 2 },
      ],
      Rules,
    }),
    computed: {
      ...get('supplier', ['suppliers']),
    },
    mounted () {
      this.$store.dispatch('supplier/getSuppliers')
    },
    methods: {
      reset () {
        this.user.username = null
        this.user.email = null
        this.user.password = null
        this.user.tckn = null
        this.user.phone = null
        this.user.firstname = null
        this.user.lastname = null
        this.user.roleId = null
        this.user.supplierId = null
      },
      updateUser () {
        const fields = [
          this.user.username,
          this.user.email,
          this.user.tckn,
          this.user.phone,
          this.user.firstname,
          this.user.lastname,
          this.user.roleId,
        ]

        if (this.formType === 'create') fields.push(this.user.password)

        if (!CheckIsNull(fields)) {
          const target = this.formType === 'create' ? 'user/createUser' : 'user/updateUser'
          this.$store.dispatch(target, this.user)
          this.reset()
          this.$emit('close-dialog')
        }
      },
    },
  }
</script>

<style lang="scss" scoped></style>
