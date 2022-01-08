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
            <v-stepper-content
              step="1"
              class="mx-0"
              style="border-left: none"
            >
              <v-autocomplete
                v-model="selectedConsultant"
                class="mt-5"
                :items="consultants"
                :item-text="e => e.firstName + ' ' + e.lastName"
                item-value="id"
                label="Danışman"
                @change="selectConsultant"
              />
            </v-stepper-content>

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
                  <v-chip
                    v-if="selectedConsultant != null"
                    class="ma-2"
                  >
                    Çalışan: {{ consultants.find(e => e.id === selectedConsultant).firstName + ' ' + consultants.find(e => e.id === selectedConsultant).lastName }}
                  </v-chip>
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
                  @click:date="openDialog"
                />
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
                              :max="shiftHours"
                              append-icon="mdi-plus"
                              prepend-icon="mdi-minus"
                              @change="setEventTime(selectedEvent)"
                            />
                          </v-col>
                          <v-col
                            cols="2"
                            class="mt-4"
                          >
                            <v-text-field
                              v-model="selectedEvent.shiftHours"
                              type="number"
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
                              :max="shiftHours"
                              append-icon="mdi-plus"
                              prepend-icon="mdi-minus"
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
      <v-col class="d-flex justify-flex-end">
        <v-btn
          class="white--text mr-3"
          color="green"
          depressed
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

    <!-- Alert Message -->
    <v-row justify="center">
      <v-alert
        v-if="responseMsg.length > 0"
        :color="isErrorMsg ? 'error' : 'success'"
        dark
        border="top"
        :icon="isErrorMsg ? 'mdi-alert' : 'mdi-check-circle'"
        transition="scale-transition"
      >
        {{ responseMsg }}
      </v-alert>
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
  import { ACTIVITY_STATUSES as statuses } from '@/util/globals'
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
      totalWorkHours: 0,
      totalExtraHours: 0,
      totalDaysOff: 0,
      shiftStartAt: 9, // 0-23 as o'clock of the day
      shiftHours: 8, // as working hours
      statuses,
    }),
    computed: {
      ...get('app', ['responseMsg', 'isErrorMsg']),
      ...get('supplier', ['activities', 'consultants']),
    },
    mounted () {
      this.$store.dispatch('supplier/getConsultants')
    },
    methods: {
      selectConsultant () {
        const { date } = this.$refs.calendar.lastEnd
        const yearMonth = date.split('-')[0] + '-' + date.split('-')[1]
        const payload = {
          consultantId: this.selectedConsultant,
          yearMonth,
        }
        this.$store.dispatch('supplier/getConsultantActivities', payload)
        this.calculateTotalHours()
        this.e1 = 2
      },
      getEventColor (event) {
        return event.color
      },
      newShiftEvent (date, name = `${this.shiftHours}s mesai`, shiftHours = this.shiftHours, overShiftHours = 0) {
        const yearMonth = `${date.split('-')[0]}-${date.split('-')[1]}`
        const consultantId = this.selectedConsultant

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
          activityStatus: this.statuses.EDITABLE,
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
      async updateRange () {
        this.$store.dispatch('app/setLoading', true)
        if (this.activities.length > 0) {
          for (let i = 0; i < this.activities.length; i++) {
            this.$store.dispatch('supplier/deleteActivity', this.activities[i].id)
          }
          await this.sleep(1000)
        }

        const end = this.$refs.calendar.lastEnd
        console.log('end.mont', end.month)
        for (let i = 0; i < end.day; i++) {
          const date = `${end.year}-${end.month < 10 ? '0' + end.month : end.month}-${i < 9 ? '0' + (i + 1) : i + 1}`
          const startDate = new Date(end.year, end.month - 1, i + 1)

          if (startDate.getDay() !== 0 && startDate.getDay() !== 6) {
            this.$store.dispatch('supplier/createActivity', this.newShiftEvent(date, `${this.shiftHours}s mesai`))
          }
        }

        await this.sleep(1000)
        this.selectConsultant()
        this.calculateTotalHours()
        this.$store.dispatch('app/setLoading', false)
      },
      setEventTime (event) {
        event.name = `${event.shiftHours}s mesai ${event.overShiftHours ? ' - ' + event.overShiftHours + 's fazla mesai' : ''}`
        this.calculateTotalHours()
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
      async creteOrUpdateEvent () {
        if (this.selectedEvent.date) {
          this.$store.dispatch('app/setLoading', true)
          this.dialog = false
          const index = this.activities.findIndex(e => e.date === this.selectedEvent.date)

          if (index !== -1) {
            this.$store.dispatch('supplier/updateActivity', this.selectedEvent)
          } else {
            this.$store.dispatch('supplier/createActivity', this.selectedEvent)
          }

          this.calculateTotalHours()
          await this.sleep(300)
          this.selectConsultant()
        } else console.log('bulunamadi')
      },
      showConfirmation (type) {
        this.confirmationType = type

        if (type === 'delete') {
          if (this.activities.length > 0) {
            this.confirmationMsg = 'Tüm aktiviteler silinecektir. Onaylıyor musunuz?'
            this.confirmationDialog = true
          } else {
            this.$store.dispatch('app/updateAlertMsg', { message: 'Silinecek aktivite bulunamadı', isError: false })
          }
        } else {
          if (this.activities.length > 0) {
            this.confirmationMsg = `Varolan aktiviteler ${this.shiftHours} saat olarak güncellenecektir. Onaylıyor musunuz?`
            this.confirmationDialog = true
          } else {
            this.updateRange()
          }
        }
      },
      async confirm () {
        if (this.confirmationType === 'delete') {
          this.$store.dispatch('app/setLoading', true)
          this.confirmationDialog = false
          const arr = this.activities.map(e => e.id)
          for (let i = 0; i < arr.length; i++) {
            this.$store.dispatch('supplier/deleteActivity', arr[i])
          }
          await this.sleep(500)
          this.selectConsultant()
        } else {
          this.confirmationDialog = false
          this.updateRange()
        }
      },
      async changeDate (type) {
        type === 'next' ? this.$refs.calendar.next() : this.$refs.calendar.prev()
        this.$store.dispatch('app/setLoading', true)

        await this.sleep(250)

        const { date } = this.$refs.calendar.lastEnd
        const yearMonth = date.split('-')[0] + '-' + date.split('-')[1]
        const consultantId = this.selectedConsultant

        this.$store.dispatch('supplier/getConsultantActivities', { consultantId, yearMonth })

        setTimeout(() => {
          this.$store.dispatch('app/setLoading', false)
        }, 750)
      },
    },
  }
</script>

<style lang="scss" scoped></style>
