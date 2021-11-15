<template>
  <v-form>
    <v-container class="py-3">
      <v-row>
        <v-col
          cols="12"
          md="4"
        >
          <v-text-field
            disabled
            color="purple"
            label="Birim Müdürü"
            value="Fatih Cigeroglu"
          />
        </v-col>

        <!-- Supplier -->
        <v-col
          cols="12"
          md="4"
        >
          <v-select
            v-model="supplier"
            :hint="`${supplier.company}, ${supplier.abbr}`"
            :items="suppliers"
            item-text="company"
            item-value="abbr"
            label="Tedarikçi Firma"
            persistent-hint
            return-object
            single-line
            @change="selectTarget('supplierId', supplier)"
          />
        </v-col>

        <!-- Cost Center -->
        <v-col
          cols="12"
          md="4"
        >
          <v-select
            v-model="costCenter"
            :items="costCenters"
            item-text="center"
            item-value="abbr"
            label="Masraf Merkezi"
            return-object
            @change="selectTarget('costCenterId', costCenter)"
          />
        </v-col>

        <!-- Job Title -->
        <v-col
          cols="12"
          md="4"
        >
          <v-select
            v-model="jobTitle"
            :items="jobTitles"
            item-text="title"
            item-value="abbr"
            label="Ünvan"
            return-object
            @change="selectTarget('jobTitleId', jobTitle)"
          />
        </v-col>

        <!-- Experience -->
        <v-col
          cols="12"
          md="4"
        >
          <v-select
            v-model="experience"
            :items="experiences"
            item-text="exp"
            item-value="value"
            label="Tecrübe Aralığı"
            return-object
            @change="selectTarget('experienceId', experience)"
          />
        </v-col>

        <!-- Monthly Budget -->
        <v-col
          cols="12"
          md="4"
        >
          <v-text-field
            color="purple"
            disabled
            label="Aylık Bütçe"
            type="number"
            :value="monthlyBudget"
          />
        </v-col>

        <!-- Starting Date -->
        <v-col
          cols="12"
          md="4"
        >
          <v-menu
            ref="menu1"
            v-model="menu1"
            :close-on-content-click="false"
            transition="scale-transition"
            offset-y
            max-width="290px"
            min-width="auto"
          >
            <template v-slot:activator="{ on, attrs }">
              <v-text-field
                v-model="request.startingDate"
                label="Başlangıç Tarihi"
                persistent-hint
                prepend-icon="mdi-calendar"
                v-bind="attrs"
                v-on="on"
              />
            </template>
            <v-date-picker
              v-model="request.startingDate"
              no-title
              @input="menu1 = false"
            />
          </v-menu>
        </v-col>

        <!-- Due Date -->
        <v-col
          cols="12"
          md="4"
        >
          <v-menu
            ref="menu2"
            v-model="menu2"
            :close-on-content-click="false"
            transition="scale-transition"
            offset-y
            max-width="290px"
            min-width="auto"
          >
            <template v-slot:activator="{ on, attrs }">
              <v-text-field
                v-model="request.endingDate"
                label="Bitiş Tarihi"
                persistent-hint
                prepend-icon="mdi-calendar"
                v-bind="attrs"
                v-on="on"
              />
            </template>
            <v-date-picker
              v-model="request.endingDate"
              no-title
              @input="menu2 = false"
            />
          </v-menu>
        </v-col>

        <!-- Total Budget -->
        <v-col
          cols="12"
          md="4"
        >
          <v-text-field
            color="purple"
            disabled
            label="Toplam Bütçe"
            type="number"
            :value="totalBudget"
          />
        </v-col>

        <!-- Project -->
        <v-col
          cols="6"
          md="4"
          class="text-right"
        >
          <v-select
            v-model="project"
            :items="projects"
            item-text="label"
            item-value="code"
            label="Hedef Proje"
            return-object
            @change="selectTarget('projectId', project)"
          />
        </v-col>

        <v-col
          cols="6"
          md="8"
          class="text-right"
        >
          <v-btn
            color="primary"
            width="100%"
            x-large
            depressed
            @click="createRequest"
          >
            Oluştur
          </v-btn>
        </v-col>
      </v-row>
      <v-row justify="center">
        <v-alert
          :value="notFilled"
          color="warning"
          dark
          border="top"
          icon="mdi-alert"
          transition="scale-transition"
        >
          Lütfen tüm alanları doldurduğunuzdan emin olunuz.
        </v-alert>
        <v-alert
          :value="createdAlert"
          color="success"
          dark
          border="top"
          icon="mdi-alert"
          transition="scale-transition"
        >
          Talep başarılya oluşturuldu.
        </v-alert>
      </v-row>
    </v-container>
  </v-form>
</template>

<script>
  export default {
    name: 'NewRequest',
    data () {
      return {
        popup: null,
        notFilled: false,
        createdAlert: false,
        menu1: false, // Staring Date Picker
        menu2: false, // Ending Date Picker
        supplier: { id: null, company: '', abbr: '' },
        costCenter: { id: null, center: '', abbr: '' },
        jobTitle: { id: null, title: '', abbr: '' },
        experience: { id: null, exp: '', value: '' },
        project: { id: null, code: '', label: '' },
        monthlyBudget: '16.606',
        totalBudget: '' + (Math.round((12 * 16.606) * 100) / 100),
        request: {
          supplierId: null,
          costCenterId: null,
          jobTitleId: null,
          experienceId: null,
          projectId: null,
          startingDate: null,
          endingDate: null,
        },
        suppliers: [
          { id: 0, company: 'Tibula', abbr: 'TBL' },
          { id: 1, company: 'Mirsis', abbr: 'MRS' },
          { id: 2, company: 'Netas', abbr: 'NE' },
        ],
        costCenters: [
          { id: 0, center: 'POS ve Üye işyerleri', abbr: 'POS' },
          { id: 1, center: 'Masraf merkezi 2', abbr: 'MER1' },
          { id: 2, center: 'Masraf merkezi 3', abbr: 'MER2' },
        ],
        jobTitles: [
          { id: 0, title: 'İş Analisti', abbr: 'BSA' },
          { id: 1, title: 'DevOps Uzmanı', abbr: 'DOPS' },
          { id: 2, title: 'Senior Backend Developer', abbr: 'SRB' },
          { id: 3, title: 'Junior Frontend Developer', abbr: 'JRF' },
        ],
        experiences: [
          { id: 0, exp: '2-3 Yıl', value: 0 },
          { id: 1, exp: '3-5 Yıl', value: 1 },
          { id: 2, exp: '5-8 Yıl', value: 2 },
          { id: 3, exp: '8-12 Yıl', value: 3 },
          { id: 4, exp: '12+ Yıl', value: 4 },
        ],
        projects: [
          { code: '001', label: 'Proje 1' },
          { code: '002', label: 'Proje 2' },
          { code: '003', label: 'Proje 3' },
          { code: '004', label: 'Proje 4' },
        ],
      }
    },
    methods: {
      createRequest () {
        let isFilled = true
        Object.keys(this.request).forEach(e => {
          if (isFilled != null) {
            isFilled = this.request[e]
          }
        })

        if (!isFilled) {
          this.notFilled = !this.notFilled
          setTimeout(() => {
            this.notFilled = !this.notFilled
          }, 2500)
        } else {
          this.createdAlert = !this.createdAlert
          this.supplier = { id: null, company: '', abbr: '' }
          this.costCenter = { id: null, center: '', abbr: '' }
          this.jobTitle = { id: null, title: '', abbr: '' }
          this.experience = { id: null, exp: '', value: '' }
          this.project = { id: null, code: '', label: '' }
          this.request.startingDate = null
          this.request.endingDate = null

          setTimeout(() => {
            this.createdAlert = !this.createdAlert
          }, 3500)
        }
      },
      selectTarget (target, obj) {
        this.request[target] = obj.id || obj.code
      },
    },
  }
</script>

<style lang="scss" scoped></style>
