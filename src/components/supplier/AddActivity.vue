<template>
  <div class="pa-3">
    <v-row class="fill-height">
      <v-col>
        <v-sheet height="64">
          <v-toolbar
            flat
          >
            <v-btn
              fab
              text
              small
              color="grey darken-2"
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
            <v-autocomplete
              v-model="selectedConsultant"
              class="mt-5"
              :items="consultants"
              label="Danışman"
            />
          </v-toolbar>
        </v-sheet>
        <v-sheet height="600">
          <v-calendar
            ref="calendar"
            v-model="focus"
            color="primary"
            :events="events"
            :event-color="getEventColor"
            type="month"
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
                    ></v-text-field>
                  </template>
                </v-slider>
              </v-card-text>
            </v-card>
          </v-menu>
        </v-sheet>
      </v-col>
    </v-row>
    <v-row>
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
      <v-col class="text-right">
        <v-btn
          class="white--text mr-3"
          color="green"
          depressed
        >
          Onayla
        </v-btn>

        <v-dialog
          v-model="dialog"
          persistent
          max-width="600px"
        >
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              color="error"
              dark
              v-bind="attrs"
              depressed
              v-on="on"
            >
              Reddet
            </v-btn>
          </template>
          <v-card>
            <v-card-title class="text-h5 primary white--text">
              Red Nedeni
            </v-card-title>
            <v-card-text>
              <v-container>
                <v-row>
                  <v-col>
                    <v-textarea
                      outlined
                      name="input-7-4"
                      label="Reason of deny"
                      placeholder="Please enter the reason of deny"
                      messages="Cannot be empty"
                      :value="reasonOfDeny"
                    />
                  </v-col>
                </v-row>
              </v-container>
            </v-card-text>
            <v-card-actions>
              <v-btn
                color="green"
                text
                @click="dialog = false"
              >
                Send
              </v-btn>
              <v-btn
                color="error"
                text
                @click="dialog = false"
              >
                Cancel
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-col>
    </v-row>
  </div>
</template>

<script>
  export default {
    name: 'AddActivity',
    data: () => ({
      focus: '',
      dialog: false,
      reasonOfDeny: '',
      selectedEvent: {},
      selectedElement: null,
      selectedOpen: false,
      selectedMonth: 'September',
      selectedConsultant: [],
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
      },
      next () {
        this.$refs.calendar.next()
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
      updateRange ({start, end}) {
        const events = []

        for (let i = 0; i < end.day; i++) {
          const startDate = new Date(start.year, start.month - 1, i + 1)

          if(startDate.getDay() !== 0 && startDate.getDay() !== 6) {
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
      setEventTime(event) {
        event.name = event.hours + ' saat ' + (event.shiftType === 0 ? 'mesai' : 'fazla mesai')
        this.calculateTotalHours()
      },
      calculateTotalHours() {
        this.totalWorkHours = 0
        this.totalExtraHours = 0
        this.events.forEach(e => {
          e.shiftType === 0 ? this.totalWorkHours += e.hours : this.totalExtraHours += e.hours
        })
      }
    },
  }
</script>

<style lang="scss" scoped></style>
