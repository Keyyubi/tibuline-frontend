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
                <v-toolbar
                  flat
                >
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
                  <v-chip
                    v-if="selectedConsultant != null"
                    class="ma-2"
                  >
                    {{ consultants[selectedConsultant].text }}
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
                  color="primary"
                  :events="events"
                  :event-color="getEventColor"
                  @click:event="showEvent"
                  @change="updateRange"
                />
                <v-menu
                  v-model="selectedOpen"
                  :close-on-content-click="false"
                  :activator="selectedElement"
                  offset-x
                >
                  <v-card
                    color="grey lighten-4"
                    min-width="350px"
                    flat
                  >
                    <v-toolbar
                      :color="selectedEvent.color"
                      dark
                    >
                      <v-toolbar-title v-html="selectedEvent.name" />
                      <v-spacer />
                      <v-icon>mdi-calendar-clock</v-icon>
                    </v-toolbar>
                    <v-card-text>
                      <v-slider
                        v-model="selectedEvent.hours"
                        class="align-center"
                        max="12"
                        min="0"
                        @change="setEventTime(selectedEvent)"
                      >
                        <template v-slot:append>
                          <v-text-field
                            v-model="selectedEvent.hours"
                            class="mt-0 pt-0"
                            hide-details
                            single-line
                            min="0"
                            max="12"
                            type="number"
                            style="width: 60px"
                          />
                        </template>
                      </v-slider>
                    </v-card-text>
                  </v-card>
                </v-menu>
              </v-sheet>
            </v-stepper-content>
          </v-stepper-items>
        </v-stepper>
      </v-col>
    </v-row>
    <v-row v-if="selectedConsultant != null">
      <v-col>
        <v-chip
          class="ma-2"
          label
        >
          <b>{{ selectedMonth }}</b>
        </v-chip>
      </v-col>
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
      <v-col class="d-flex text-right">
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
      selectedEvent: {},
      selectedElement: null,
      selectedOpen: false,
      selectedMonth: 'September',
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
    methods: {
      viewDay ({ date }) {
        this.focus = date
        this.type = 'day'
      },
      getEventColor (event) {
        return event.color
      },
      setToday () {
        this.focus = ''
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
      showEvent ({ nativeEvent, event }) {
        const open = () => {
          this.selectedEvent = event
          this.selectedElement = nativeEvent.target
          requestAnimationFrame(() => requestAnimationFrame(() => {
            this.selectedOpen = true
          }))
        }

        if (this.selectedOpen) {
          this.selectedOpen = false
          requestAnimationFrame(() => requestAnimationFrame(() => open()))
        } else {
          open()
        }

        nativeEvent.stopPropagation()
      },
      updateRange ({ start, end }) {
        const events = []

        for (let i = 0; i < end.day; i++) {
          const startDate = new Date(start.year, start.month - 1, i + 1)

          if (startDate.getDay() !== 0 && startDate.getDay() !== 6) {
            const workHour = {
              hours: this.shiftHours,
              name: `${this.shiftHours} saat mesai`,
              start: startDate,
              end: startDate,
              shiftType: 0,
              color: 'green',
              timed: false,
            }
            workHour.start.setHours(this.shiftStartAt, 0, 0)
            workHour.end.setHours(this.shiftStartAt + this.shiftHours, 0, 0)

            const extraHour = {
              ...workHour,
              hours: 0,
              name: '0 saat fazla mesai',
              shiftType: 1,
              color: 'red',
            }
            extraHour.end.setHours(extraHour.end.getHours() + extraHour.hours)

            events.push(workHour, extraHour)
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
    },
  }
</script>

<style lang="scss" scoped></style>
