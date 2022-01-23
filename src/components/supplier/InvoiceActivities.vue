<template>
  <div class="pa-3">
    <v-row class="fill-height">
      <v-col>
        <v-stepper
          v-model="e1"
          vertical
        >
          <v-stepper-header>
            <v-stepper-step
              :complete="e1 > 1"
              step="1"
            >
              Danışman Seçiniz
            </v-stepper-step>

            <v-divider />

            <v-stepper-step
              :complete="e1 > 2"
              step="2"
            >
              Aktiviteleri giriniz
            </v-stepper-step>
          </v-stepper-header>

          <v-stepper-items>
            <!-- Select Consultant -->
            <v-stepper-content
              step="1"
              class="mx-0"
              style="border-left: none"
            >
              <v-autocomplete
                v-model="selectedConsultant"
                class="mt-5"
                :items="consultants.filter(e => e.isActive === true)"
                :item-text="e => e.firstName + ' ' + e.lastName"
                item-value="id"
                label="Danışman"
                @change="selectConsultant"
              />
            </v-stepper-content>
          </v-stepper-items>
        </v-stepper>
      </v-col>
    </v-row>

    <!-- Info and Actions Footer -->
    <v-row
      v-if="selectedConsultant != null"
      class="d-flex justify-space-between"
    >
      <v-col class="d-flex">
        <v-chip
          class="ma-2"
          color="green"
          label
          outlined
        >
          Toplam Mesai: {{ totalWorkHours }} Saat
        </v-chip>

        <v-chip
          class="ma-2"
          color="orange"
          label
          outlined
        >
          Toplam İzinler: {{ totalDaysOff }} gün
        </v-chip>

        <v-chip
          class="ma-2"
          color="red"
          label
          outlined
        >
          Toplam Fazla Mesai: {{ totalExtraHours }} saat
        </v-chip>
      </v-col>
      <v-spacer />
      <!-- Actions -->
      <v-col class="d-flex justify-flex-end">
        <v-btn
          class="white--text mr-3"
          color="green"
          depressed
          :disabled="!(activities.length > 0)"
          @click="showConfirmation('approve')"
        >
          Onayla
        </v-btn>
        <v-btn
          color="error"
          dark
          depressed
          :disabled="!(activities.length > 0)"
          @click="showConfirmation('deny')"
        >
          Reddet
        </v-btn>
      </v-col>
    </v-row>

    <!-- Confirmation dialog -->
    <v-dialog
      v-model="confirmationDialog"
      persistent
      width="460"
    >
      <v-card>
        <v-card-title class="text-h5 primary white--text">
          {{ confirmationType === 'approve' ? 'Onay' : 'Red Nedeni' }}
        </v-card-title>
        <v-card-text
          v-if="confirmationType === 'approve'"
          class="text-h5 py-3"
        >
          <v-icon large>
            mdi-alert
          </v-icon>
          Aktiviteler, onaylandıktan sonra değiştirilemezler. Danışmanın bu dönemki aktivitelerini onaylıyor musunuz?
        </v-card-text>
        <v-card-text
          v-else
          class="text-h5 py-3"
        >
          <v-textarea
            v-model="reasonOfDeny"
            label="Red Nedeni"
            placeholder="Lütfen tedarikçinize gönderilecek red mesajını giriniz. (Örn. 01/03/2022 günündeki aktivite yanlış girilmiş. )"
          />
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn
            class="white--text mr-3"
            color="green"
            depressed
            small
            @click="confirm"
          >
            Onayla
          </v-btn>
          <v-btn
            color="error"
            dark
            depressed
            small
            @click="confirmationDialog = false"
          >
            Vazgeç
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
  import { get } from 'vuex-pathify'
  import { ACTIVITY_STATUSES as Statuses } from '@/util/globals'
  export default {
    name: 'InvoiceActivities',
    data: () => ({
      focus: '',
      e1: 1,
      confirmationType: '',
      confirmationMsg: '',
      confirmationDialog: false,
      reasonOfDeny: '',
      selectedConsultant: null,
      totalWorkHours: 0,
      totalExtraHours: 0,
      totalDaysOff: 0,
      shiftStartAt: 9, // 0-23 as o'clock of the day
      shiftHours: 8, // as working hours
      Statuses,
      approvedPeriods: {
        id: 0,
        name: '2022-01',
        consultantId: 1,
        totalShiftHours: 180,
        totalOverShiftHours: 40,
        isInvoiced: false,
      },
    }),
    computed: {
      ...get('consultant', ['consultants']),
      ...get('activity', ['activities']),
    },
    mounted () {
      this.$store.dispatch('consultant/getConsultants')
    },
    methods: {
      selectConsultant () {
        const { date } = this.$refs.calendar.lastEnd
        const yearMonth = date.split('-')[0] + '-' + date.split('-')[1]
        const payload = {
          consultantId: this.selectedConsultant,
          yearMonth,
          activityStatus: Statuses.APPROVED,
        }
        this.$store.dispatch('activity/getActivitiesByConsultantIdAndYearMonthAndStatus', payload)
        this.calculateTotalHours()
        this.e1 = 2
      },
      getEventColor (event) {
        return event.color
      },
      sleep (ms) {
        return new Promise(resolve => setTimeout(resolve, ms))
      },
      calculateTotalHours () {
        this.totalWorkHours = 0
        this.totalExtraHours = 0
        this.totalDaysOff = 0

        const end = this.$refs.calendar.lastEnd

        for (let i = 0; i < end.day; i++) {
          const date = `${end.year}-${end.month}-${i < 9 ? '0' + (i + 1) : i + 1}`
          const event = this.activities.find(e => e.date === date)
          if (event && event.date) {
            this.totalWorkHours += event.shiftHours
            this.totalExtraHours += event.overShiftHours
            if (new Date(date).getDay() !== 0 && new Date(date).getDay() !== 6 && event.shiftHours === 0 && event.overShiftHours === 0) {
              this.totalDaysOff++
            }
          }
        }
      },
      showConfirmation (type) {
        this.confirmationType = type
        this.confirmationDialog = true
      },
      async confirm () {
        this.$store.dispatch('app/setLoading', true)
        this.confirmationDialog = false

        const status = this.confirmationType === 'approve' ? Statuses.APPROVED : Statuses.REVISED
        this.activities.forEach(obj => {
          obj.activityStatus = status
          this.$store.dispatch('activity/updateActivity', obj)
        })

        await this.sleep(1000)

        this.selectConsultant()
      },
      async changeDate (type) {
        type === 'next' ? this.$refs.calendar.next() : this.$refs.calendar.prev()
        this.$store.dispatch('app/setLoading', true)

        await this.sleep(250)

        const { date } = this.$refs.calendar.lastEnd
        const yearMonth = date.split('-')[0] + '-' + date.split('-')[1]
        const consultantId = this.selectedConsultant
        const activityStatus = Statuses.PENDING

        this.$store.dispatch('activity/getActivitiesByConsultantIdAndYearMonthAndStatus', { consultantId, yearMonth, activityStatus })

        setTimeout(() => {
          this.$store.dispatch('app/setLoading', false)
        }, 750)
      },
    },
  }
</script>

<style lang="scss" scoped></style>
