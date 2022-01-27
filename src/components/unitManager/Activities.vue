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
                :item-text="e => e.firstname + ' ' + e.lastname"
                item-value="id"
                label="Danışman"
                return-object
                @change="selectConsultant"
              />
            </v-stepper-content>

            <!-- Calendar -->
            <v-stepper-content
              step="2"
              class="pa-0 mx-0"
            >
              <v-sheet height="64">
                <v-toolbar flat>
                  <v-btn
                    fab
                    text
                    small
                    color="grey darken-2"
                    @click="changeDate('prev')"
                  >
                    <v-icon small>
                      mdi-chevron-left
                    </v-icon>
                  </v-btn>
                  <v-btn
                    fab
                    text
                    small
                    color="grey darken-2"
                    @click="changeDate('next')"
                  >
                    <v-icon small>
                      mdi-chevron-right
                    </v-icon>
                  </v-btn>
                  <v-toolbar-title v-if="$refs.calendar">
                    {{ $refs.calendar.title }}
                  </v-toolbar-title>
                  <v-spacer />
                  <v-tooltip left>
                    <template v-slot:activator="{ on, attrs }">
                      <v-chip
                        class="ma-2"
                        color="primary"
                        v-bind="attrs"
                        v-on="on"
                        @click="e1=1; selectedConsultant = null"
                      >
                        {{ selectedConsultant ? selectedConsultant.firstname + ' ' + selectedConsultant.lastname : '' }}
                        <v-icon
                          class="ml-4"
                          size="18"
                        >
                          mdi-restore
                        </v-icon>
                      </v-chip>
                    </template>
                    <span>Danışmanı değiştir</span>
                  </v-tooltip>
                </v-toolbar>
              </v-sheet>
              <v-sheet
                height="600"
                width="100%"
              >
                <v-calendar
                  ref="calendar"
                  v-model="focus"
                  style="border-left:none"
                  color="primary"
                  type="month"
                  event-overlap-mode="column"
                  :events="activities"
                  :event-color="getEventColor"
                />
              </v-sheet>
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
    name: 'Activities',
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
      period: '',
      Statuses,
    }),
    computed: {
      ...get('consultant', ['consultants']),
      ...get('activity', ['activities']),
    },
    mounted () {
      this.$store.dispatch('consultant/getConsultantsByManagerId')
    },
    methods: {
      selectConsultant () {
        const { date } = this.$refs.calendar.lastEnd
        this.period = date.split('-')[0] + '-' + date.split('-')[1]
        const payload = {
          consultantId: this.selectedConsultant.id,
          yearMonth: this.period,
          activityStatus: Statuses.PENDING,
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

        this.activities.forEach(el => {
          this.totalWorkHours += el.shiftHours
          this.totalExtraHours += el.overShiftHours
          if (new Date(el.date).getDay() !== 0 && new Date(el.date).getDay() !== 6 && el.shiftHours === 0 && el.overShiftHours === 0) {
            this.totalDaysOff++
          }
        })
      },
      showConfirmation (type) {
        this.confirmationType = type
        this.confirmationDialog = true
      },
      async confirm () {
        this.$store.dispatch('app/setLoading', true)
        this.calculateTotalHours()
        this.confirmationDialog = false

        const status = this.confirmationType === 'approve' ? Statuses.APPROVED : Statuses.REVISED
        this.activities.forEach(obj => {
          obj.activityStatus = status
          this.$store.dispatch('activity/updateActivity', obj)
        })

        await this.sleep(1000)

        const activityPeriodObj = {
          name: this.period,
          consultantId: this.selectedConsultant.id,
          totalShiftHours: this.totalWorkHours,
          totalOverShiftHours: this.totalExtraHours,
          isInvoiced: false,
        }

        this.$store.dispatch('activityPeriod/createActivityPeriod', activityPeriodObj)

        await this.sleep(500)

        this.selectConsultant()
      },
      async changeDate (type) {
        type === 'next' ? this.$refs.calendar.next() : this.$refs.calendar.prev()
        this.$store.dispatch('app/setLoading', true)

        await this.sleep(250)

        const { date } = this.$refs.calendar.lastEnd
        this.period = date.split('-')[0] + '-' + date.split('-')[1]
        const consultantId = this.selectedConsultant.id
        const activityStatus = Statuses.PENDING

        this.$store.dispatch('activity/getActivitiesByConsultantIdAndYearMonthAndStatus', { consultantId, yearMonth: this.period, activityStatus })

        setTimeout(() => {
          this.$store.dispatch('app/setLoading', false)
        }, 750)
      },
    },
  }
</script>

<style lang="scss" scoped></style>
