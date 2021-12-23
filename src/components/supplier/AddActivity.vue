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
                label="Danışman"
                @change="e1 = 2"
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
                    :disabled="isMinMonth"
                    @click="prev"
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
                    @click="next"
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
                    @click="updateRange"
                  >
                    <v-icon small>
                      mdi-calender
                    </v-icon>
                    Aylık Aktiviteleri Doldur
                  </v-btn>
                  <v-spacer />
                  <v-chip
                    v-if="selectedConsultant != null"
                    class="ma-2"
                  >
                    Çalışan: {{ consultants[selectedConsultant].text }}
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
                  :events="events"
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
                              v-model="selectedElement.shiftEvent.hours"
                              :min="0"
                              :step="1"
                              :max="shiftHours"
                              append-icon="mdi-plus"
                              prepend-icon="mdi-minus"
                              @change="setEventTime(selectedElement.shiftEvent)"
                            />
                          </v-col>
                          <v-col
                            cols="2"
                            class="mt-4"
                          >
                            <v-text-field
                              v-model="selectedElement.shiftEvent.hours"
                              type="number"
                              required
                            />
                          </v-col>
                        </v-row>
                        <v-row>
                          <v-col cols="10">
                            <v-subheader>Fazla Mesai saati</v-subheader>
                            <v-slider
                              v-model="selectedElement.overShiftEvent.hours"
                              :min="0"
                              :step="1"
                              :max="shiftHours"
                              append-icon="mdi-plus"
                              prepend-icon="mdi-minus"
                              @change="setEventTime(selectedElement.overShiftEvent)"
                            />
                          </v-col>
                          <v-col
                            cols="2"
                            class="mt-4"
                          >
                            <v-text-field
                              v-model="selectedElement.overShiftEvent.hours"
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
      <v-col class="d-flex justify-flex-end ">
        <v-btn
          class="white--text mr-3"
          color="green"
          depressed
        >
          Onayla
        </v-btn>
        <v-btn
          color="error"
          dark
          depressed
          @click="selectedConsultant = null; e1 = 1"
        >
          Vazgeç
        </v-btn>
      </v-col>
    </v-row>
  </div>
</template>

<script>
  export default {
    name: 'AddActivity',
    data: () => ({
      e1: 1,
      focus: '',
      dialog: false,
      isMinMonth: true,
      reasonOfDeny: '',
      selectedElement: { shiftEvent: null, overShiftEvent: null },
      selectedConsultant: null,
      consultants: [
        { value: 0, text: 'Murathan Karayaz' },
        { value: 1, text: 'Busra Yargi' },
        { value: 2, text: 'Furkan Reyhan' },
        { value: 3, text: 'John Doe ' },
      ],
      totalWorkHours: 0,
      totalExtraHours: 0,
      totalDaysOff: 0,
      events: [],
      shiftStartAt: 9, // 0-23 as o'clock of the day
      shiftHours: 8, // as working hours
    }),
    beforeMount () {
      this.selectedElement.shiftEvent = this.newShiftEvent()
      this.selectedElement.overShiftEvent = this.newShiftEvent()
    },
    methods: {
      getEventColor (event) {
        return event.color
      },
      prev () {
        this.$refs.calendar.prev()
        const current = new Date(this.$refs.calendar.value)
        this.isMinMonth = new Date(current.getFullYear(), current.getMonth() - 1, 1) < new Date()
      },
      next () {
        this.$refs.calendar.next()
        this.isMinMonth = false
      },
      newShiftEvent (date, type = 0) {
        return {
          date,
          hours: 0,
          name: '0 saat fazla mesai',
          start: new Date(date),
          end: new Date(date),
          shiftType: type,
          color: type ? 'green' : 'grey',
          timed: false,
        }
      },
      openDialog (item) {
        const shiftEvent = this.events.find(e => e.date === item.date)
        const overShiftEvent = this.events.find(e => e.date === item.date && e.shiftType === 1)

        this.selectedElement.shiftEvent = shiftEvent || this.newShiftEvent(item.date, 0)
        this.selectedElement.overShiftEvent = overShiftEvent || this.newShiftEvent(item.date, 0)

        this.dialog = !this.dialog
      },
      updateRange () {
        const events = []
        const end = this.$refs.calendar.lastEnd

        for (let i = 0; i < end.day; i++) {
          const date = `${end.year}-${end.month}-${i < 9 ? '0' + (i + 1) : i + 1}`
          const startDate = new Date(end.year, end.month - 1, i + 1)

          if (startDate.getDay() !== 0 && startDate.getDay() !== 6) {
            const workHour = {
              date,
              hours: this.shiftHours,
              name: `${this.shiftHours} saat mesai`,
              start: startDate,
              end: startDate,
              shiftType: 0,
              color: 'green',
              timed: false,
            }

            events.push(workHour)
          }
        }

        this.events = events
        this.calculateTotalHours()
      },
      setEventTime (event) {
        event.name = event.hours + ' saat ' + (event.shiftType === 0 ? 'mesai' : 'fazla mesai')
        this.calculateTotalHours()
      },
      calculateTotalHours () {
        this.totalWorkHours = 0
        this.totalExtraHours = 0
        this.events.forEach(e => {
          e.shiftType === 0 ? this.totalWorkHours += e.hours : this.totalExtraHours += e.hours
        })
      },
      creteOrUpdateEvent () {
        if (this.selectedElement.shiftEvent.date && this.selectedElement.overShiftEvent.date) {
          console.log('yes', this.selectedElement)
        } else console.log('bulunamadi')
        this.dialog = false
      },
    },
  }
</script>

<style lang="scss" scoped></style>
