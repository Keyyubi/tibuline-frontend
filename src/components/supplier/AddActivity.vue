<template>
  <div class="pa-3">
    <v-sheet
      v-if="isLoading"
      width="100%"
      height="400"
      class="d-flex justify-center align-center"
    >
      <v-progress-circular
        size="100"
        width="10"
        indeterminate
        color="primary"
      />
    </v-sheet>

    <v-row
      v-else
      class="fill-height"
    >
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
            <!-- Consultant Selection Step -->
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

            <!-- Calendar Step -->
            <v-stepper-content
              step="2"
              class="pa-0 mx-0"
            >
              <!-- Toolbar -->
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
                  <v-btn
                    outlined
                    small
                    color="primary darken-1"
                    @click="showConfirmation('fill-monthly')"
                  >
                    <v-icon small>
                      mdi-calendar-month
                    </v-icon>
                    Aylık Aktiviteleri Doldur
                  </v-btn>
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

              <!-- Calendar -->
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
                  @click:date="openDialog"
                />
                <!-- Event Dialog -->
                <v-dialog
                  v-model="dialog"
                  width="460"
                >
                  <v-card>
                    <v-card-title class="text-h5 primary white--text">
                      Aktivite Girişi
                      <v-spacer />
                      <v-icon color="white">
                        mdi-calendar-clock
                      </v-icon>
                    </v-card-title>
                    <v-card-text>
                      <v-container>
                        <v-row>
                          <v-col cols="10">
                            <v-subheader>Mesai saati</v-subheader>
                            <v-slider
                              v-model="selectedEvent.shiftHours"
                              :min="0"
                              :step="1"
                              :max="customerCompany.dailyShiftHours"
                              append-icon="mdi-plus"
                              prepend-icon="mdi-minus"
                              :disabled="selectedEvent.activityStatus === Statuses.INVOICED"
                              @change="setEventTime(selectedEvent, 'shift')"
                            />
                          </v-col>
                          <v-col
                            cols="2"
                            class="mt-4"
                          >
                            <v-text-field
                              v-model="selectedEvent.shiftHours"
                              type="number"
                              :disabled="selectedEvent.activityStatus === Statuses.INVOICED"
                              required
                            />
                          </v-col>
                        </v-row>
                        <v-row>
                          <v-col cols="10">
                            <v-subheader>Fazla Mesai saati</v-subheader>
                            <v-slider
                              v-model="selectedEvent.overShiftHours"
                              :min="0"
                              :step="1"
                              :max="customerCompany.dailyShiftHours"
                              append-icon="mdi-plus"
                              prepend-icon="mdi-minus"
                              :disabled="selectedEvent.activityStatus === Statuses.INVOICED"
                              @change="setEventTime(selectedEvent)"
                            />
                          </v-col>
                          <v-col
                            cols="2"
                            class="mt-4"
                          >
                            <v-text-field
                              v-model="selectedEvent.overShiftHours"
                              type="number"
                              :disabled="selectedEvent.activityStatus === Statuses.INVOICED"
                              required
                            />
                          </v-col>
                        </v-row>
                        <v-row>
                          <v-col cols="10">
                            <v-subheader>İzin saati</v-subheader>
                            <v-slider
                              v-model="selectedEvent.dayOffHours"
                              :min="0"
                              :step="1"
                              :max="customerCompany.dailyShiftHours"
                              append-icon="mdi-plus"
                              prepend-icon="mdi-minus"
                              :disabled="selectedEvent.activityStatus === Statuses.INVOICED"
                              @change="setEventTime(selectedEvent, 'dayOff')"
                            />
                          </v-col>
                          <v-col
                            cols="2"
                            class="mt-4"
                          >
                            <v-text-field
                              v-model="selectedEvent.dayOffHours"
                              type="number"
                              :disabled="selectedEvent.activityStatus === Statuses.INVOICED"
                              required
                            />
                          </v-col>
                        </v-row>
                      </v-container>
                    </v-card-text>
                    <v-divider />
                    <v-card-actions>
                      <v-spacer />
                      <v-btn
                        color="green darken-1"
                        text
                        @click="creteOrUpdateEvent"
                      >
                        Oluştur
                      </v-btn>
                      <v-btn
                        color="error darken-1"
                        text
                        @click="dialog = false"
                      >
                        Vazgeç
                      </v-btn>
                    </v-card-actions>
                  </v-card>
                </v-dialog>
              </v-sheet>
            </v-stepper-content>
          </v-stepper-items>
        </v-stepper>
      </v-col>
    </v-row>

    <!-- Info and actions Footer -->
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
          Toplam Mesai: {{ totalShiftHours }} Saat
        </v-chip>

        <v-chip
          class="ma-2"
          color="orange"
          label
          outlined
        >
          Toplam İzinler: {{ totalDayOffHours }} Saat
        </v-chip>

        <v-chip
          class="ma-2"
          color="red"
          label
          outlined
        >
          Toplam Fazla Mesai: {{ totalOverShiftHours }} saat
        </v-chip>
      </v-col>
      <v-spacer />
      <v-col class="d-flex justify-flex-end">
        <v-btn
          class="white--text mr-3"
          color="green"
          depressed
          @click="showConfirmation('send')"
        >
          Onaya Gönder
        </v-btn>
        <v-btn
          color="error"
          dark
          depressed
          @click="showConfirmation('delete')"
        >
          Tüm Aktiviteleri Sil
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
          Onay
        </v-card-title>
        <v-card-text class="text-h5 py-3">
          <v-icon large>
            mdi-alert
          </v-icon>
          {{ confirmationMsg }}
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
    name: 'AddActivity',
    data: () => ({
      focus: '',
      e1: 1,
      dialog: false,
      confirmationType: '',
      confirmationMsg: '',
      confirmationDialog: false,
      reasonOfDeny: '',
      selectedEvent: {},
      selectedConsultant: null,
      totalShiftHours: 0,
      totalOverShiftHours: 0,
      totalDayOffHours: 0,
      Statuses,
    }),
    computed: {
      ...get('user', ['user', 'customerCompany']),
      ...get('activity', ['activities', 'isLoading']),
      ...get('activityPeriod', ['activityPeriods']),
      ...get('consultant', ['consultants']),
    },
    async mounted () {
      // To be sure current user update at store
      this.$store.dispatch('activity/setLoading', true)
      await new Promise(resolve => setTimeout(resolve, 1000))
      this.$store.dispatch('consultant/getConsultants')
      this.$store.dispatch('activity/setLoading', false)
    },
    methods: {
      selectConsultant () {
        const { date } = this.$refs.calendar.lastEnd
        const yearMonth = date.split('-')[0] + '-' + date.split('-')[1]
        const payload = {
          consultantId: this.selectedConsultant.id,
          yearMonth,
        }
        this.$store.dispatch('activity/getActivitiesByConsultantIdAndYearMonth', { ...payload })
        this.$store.dispatch('activityPeriod/getActivityPeriodsByConsultantId', payload.consultantId)
        setTimeout(() => {
          this.calculateTotalHours()
        }, 500)
        this.e1 = 2
      },
      getEventColor (event) {
        return event.color
      },
      newShiftEvent (date, name = `${this.customerCompany.dailyShiftHours}s mesai`, shiftHours = this.customerCompany.dailyShiftHours, overShiftHours = 0) {
        const yearMonth = `${date.split('-')[0]}-${date.split('-')[1]}`
        const consultantId = this.selectedConsultant.id

        return {
          date,
          name,
          shiftHours,
          overShiftHours,
          start: new Date(date),
          end: new Date(date),
          color: 'green',
          timed: false,
          yearMonth,
          consultantId,
          activityStatus: this.Statuses.CREATED,
        }
      },
      openDialog (item) {
        const shiftEvent = this.activities.find(e => e.date === item.date)

        this.selectedEvent = shiftEvent || this.newShiftEvent(item.date)
        this.dialog = !this.dialog
      },
      sleep (ms) {
        return new Promise(resolve => setTimeout(resolve, ms))
      },
      setEventTime (event, type = null) {
        if (type === 'dayOff') {
          event.shiftHours = this.customerCompany.dailyShiftHours - event.dayOffHours
        } else if (type === 'shift') {
          event.dayOffHours = this.customerCompany.dailyShiftHours - event.shiftHours
        }
        let str = `${event.shiftHours}s mesai ${event.overShiftHours}`
        str += event.overShiftHours ? ' - ' + event.overShiftHours + 's fazla mesai' : ''
        str += event.dayOffHours ? ' - ' + event.dayOffHours + 's fazla mesai' : ''

        event.name = str
      },
      calculateTotalHours () {
        this.totalShiftHours = 0
        this.totalOverShiftHours = 0
        this.totalDayOffHours = 0

        const end = this.$refs.calendar.lastEnd

        for (let i = 0; i < end.day; i++) {
          const date = `${end.year}-${end.month < 9 ? '0' + end.month : end.month}-${i < 9 ? '0' + (i + 1) : i + 1}`
          const event = this.activities.find(e => e.date === date)
          if (event && event.date) {
            this.totalShiftHours += event.shiftHours
            this.totalOverShiftHours += event.overShiftHours
            this.totalDayOffHours += event.dayOffHours
          }
        }
      },
      checkIsPeriodInvoiced () {
        const { date } = this.$refs.calendar.lastEnd
        const yearMonth = date.split('-')[0] + '-' + date.split('-')[1]
        const period = this.activityPeriods.find(e => e.name === yearMonth)

        return period && period.isInvoiced
      },
      showConfirmation (type) {
        this.confirmationType = type

        if (this.activities.length > 0) {
          switch (type) {
            case 'delete':
              this.confirmationMsg = 'Tüm aktiviteler silinecektir. Onaylıyor musunuz?'
              this.confirmationDialog = true
              break
            case 'send':
              if (this.checkIsPeriodInvoiced()) {
                this.$store.dispatch('app/showAlert', { message: 'Bu dönemin aktiviteleri faturalandırıldığı için değişiklik yapılamaz.', type: 'warning' })
              } else {
                this.confirmationMsg = 'Aktiviteler yönetici onayına gönderilecektir. Onaylıyor musunuz?'
                this.confirmationDialog = true
              }
              break
            case 'fill-monthly':
              this.confirmationMsg = `Varolan aktiviteler ${this.customerCompany.dailyShiftHours} saat olarak güncellenecektir. Onaylıyor musunuz?`
              this.confirmationDialog = true
              break
          }
        } else {
          switch (type) {
            case 'delete':
            case 'send':
              this.$store.dispatch('app/showAlert', { message: 'Bu dönem için aktivite bulunmuyor.', type: 'warning' })
              break
            case 'fill-monthly':
              this.createMonthly()
              break
          }
        }
      },
      async createMonthly () {
        const arr = []
        const end = this.$refs.calendar.lastEnd
        for (let i = 0; i < end.day; i++) {
          const date = `${end.year}-${end.month < 10 ? '0' + end.month : end.month}-${i < 9 ? '0' + (i + 1) : i + 1}`
          const startDate = new Date(end.year, end.month - 1, i + 1)

          if (startDate.getDay() !== 0 && startDate.getDay() !== 6) {
            arr.push(this.newShiftEvent(date, `${this.customerCompany.dailyShiftHours}s mesai`))
          }
        }

        this.$store.dispatch('activity/createActivities', arr)

        await this.sleep(1000)

        this.selectConsultant()
        this.calculateTotalHours()
      },
      async deleteActivitiesMonthly () {
        const arr = this.activities.map(e => e.id)

        this.$store.dispatch('activity/deleteActivities', arr)

        await this.sleep(1000)

        this.selectConsultant()
      },
      async creteOrUpdateEvent () {
        if (this.selectedEvent.date) {
          this.$store.dispatch('app/setLoading', true)
          this.dialog = false
          const index = this.activities.findIndex(e => e.date === this.selectedEvent.date)

          if (this.checkIsPeriodInvoiced()) {
            this.$store.dispatch('app/showAlert', { message: 'Bu dönemin aktiviteleri faturalandırıldığı için değişiklik yapılamaz.', type: 'warning' })
          } else {
            if (index !== -1) {
              this.$store.dispatch('activity/updateActivity', this.selectedEvent)
            } else {
              this.$store.dispatch('activity/createActivity', this.selectedEvent)
            }

            this.createOrUpdateActivityPeriod()

            this.calculateTotalHours()
            await this.sleep(300)
            this.selectConsultant()
          }
        }
      },
      async confirm () {
        this.confirmationDialog = false

        switch (this.confirmationType) {
          case 'delete':
            this.deleteActivitiesMonthly()
            break
          case 'send':
            this.createOrUpdateActivityPeriod()
            await this.sleep(1000)
            // this.selectConsultant()
            break
          case 'fill-monthly':
            if (this.activities.length > 0) this.deleteActivitiesMonthly()
            this.createMonthly()
            break
        }
      },
      async changeDate (type) {
        type === 'next' ? this.$refs.calendar.next() : this.$refs.calendar.prev()
        this.$store.dispatch('app/setLoading', true)

        await this.sleep(250)

        const { date } = this.$refs.calendar.lastEnd
        const yearMonth = date.split('-')[0] + '-' + date.split('-')[1]
        const consultantId = this.selectedConsultant.id

        this.$store.dispatch('activity/getActivitiesByConsultantIdAndYearMonth', { consultantId, yearMonth })
      },
      async createOrUpdateActivityPeriod () {
        const { date } = this.$refs.calendar.lastEnd
        const yearMonth = date.split('-')[0] + '-' + date.split('-')[1]
        const period = this.activityPeriods.find(e => e.name === yearMonth)

        if (period) {
          period.totalShiftHours = this.totalShiftHours
          period.totalOverShiftHours = this.totalOverShiftHours
          period.dayOffHours = this.totalDayOffHours
          period.status = Statuses.PENDING

          this.$store.dispatch('activityPeriod/updateActivityPeriod', period)
        } else {
          const newPeriod = {
            name: yearMonth,
            consultantId: this.selectedConsultant.id,
            totalShiftHours: this.totalShiftHours,
            totalOverShiftHours: this.totalOverShiftHours,
            isInvoiced: false,
            supplierId: this.user.company.id,
            dayOffHours: this.totalDayOffHours,
            status: Statuses.PENDING,
          }

          this.$store.dispatch('activityPeriod/createActivityPeriod', newPeriod)
        }
      },
    },
  }
</script>

<style lang="scss" scoped></style>
