<template>
  <div class="pa-3">
    <v-row class="fill-height">
      <v-col>
        <v-sheet height="64">
          <v-toolbar
            flat
          >
            <v-btn
              outlined
              class="mr-4"
              color="grey darken-2"
              @click="setToday"
            >
              Today
            </v-btn>
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
            <v-btn
              outlined
              class="mr-4"
              color="grey darken-2"
              @click="type = 'day'"
            >
              Day
            </v-btn>
            <v-btn
              outlined
              class="mr-4"
              color="grey darken-2"
              @click="type = 'week'"
            >
              Week
            </v-btn>
            <v-btn
              outlined
              class="mr-4"
              color="grey darken-2"
              @click="type = 'month'"
            >
              Month
            </v-btn>
          </v-toolbar>
        </v-sheet>
        <v-sheet height="600">
          <v-calendar
            ref="calendar"
            v-model="focus"
            color="primary"
            :events="events"
            :event-color="getEventColor"
            :type="type"
            @click:event="showEvent"
            @click:more="viewDay"
            @click:date="viewDay"
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
                <v-btn icon>
                  <v-icon>mdi-pencil</v-icon>
                </v-btn>
                <v-toolbar-title v-html="selectedEvent.name" />
                <v-spacer />
                <v-btn icon>
                  <v-icon>mdi-heart</v-icon>
                </v-btn>
                <v-btn icon>
                  <v-icon>mdi-dots-vertical</v-icon>
                </v-btn>
              </v-toolbar>
              <v-card-text>
                <span v-html="selectedEvent.details" />
              </v-card-text>
              <v-card-actions>
                <v-btn
                  text
                  color="secondary"
                  @click="selectedOpen = false"
                >
                  Cancel
                </v-btn>
              </v-card-actions>
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
          Total Activities: 21 Days
        </v-chip>

        <v-chip
          class="ma-2"
          color="orange"
          label
          outlined
        >
          Total Day Offs: 1 Days
        </v-chip>

        <v-chip
          class="ma-2"
          color="red"
          label
          outlined
        >
          Total Extra Workdays: 3 Days
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
    name: 'Activities',
    data: () => ({
      focus: '',
      dialog: false,
      reasonOfDeny: '',
      type: 'month',
      typeToLabel: {
        month: 'Month',
        week: 'Week',
        day: 'Day',
      },
      selectedEvent: {},
      selectedElement: null,
      selectedOpen: false,
      selectedMonth: 'September',
      events: [],
      colors: ['green', 'blue', 'orange', 'red'],
      names: ['Workday', 'Day Off', 'Health', 'Annual Leave', 'Holiday'],

      shiftStartAt: 9, // 0-23 as o'clock of the day
      shiftHours: 8, // as working hours
      dates: [
        {
          name: 'Workday',
          start: new Date('2021-09-13'),
          shiftType: 'workday',
          extraHours: 0,
        },
        {
          name: 'Extra',
          start: new Date('2021-09-13'),
          shiftType: 'extra',
          extraHours: 3,
        },
        {
          name: 'Holiday',
          start: new Date('2021-09-14'),
          shiftType: 'holiday',
          extraHours: 0,
        },
        {
          name: 'Day Off',
          start: new Date('2021-09-15'),
          shiftType: 'dayoff',
          extraHours: 0,
        },
        {
          name: 'Workday',
          start: new Date('2021-09-16'),
          shiftType: 'workday',
          extraHours: 0,
        },
        {
          name: 'Workday',
          start: new Date('2021-09-17'),
          shiftType: 'workday',
          extraHours: 0,
        },
        {
          name: 'Annual Leave',
          start: new Date('2021-09-20'),
          shiftType: 'annual',
          extraHours: 0,
        },
        {
          name: 'Annual Leave',
          start: new Date('2021-09-21'),
          shiftType: 'annual',
          extraHours: 0,
        },
        {
          name: 'Annual Leave',
          start: new Date('2021-09-22'),
          shiftType: 'annual',
          extraHours: 0,
        },
        {
          name: 'Annual Leave',
          start: new Date('2021-09-23'),
          shiftType: 'annual',
          extraHours: 0,
        },
        {
          name: 'Annual Leave',
          start: new Date('2021-09-24'),
          shiftType: 'annual',
          extraHours: 0,
        },
      ],
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
      createCalendarObject (obj) {
        obj.start.setHours(this.shiftStartAt, 0, 0)
        obj.end = new Date(obj.start)

        // To ensure adding shift hours to hour of the beginning of the shift
        obj.end.setTime(obj.end.getTime() + (this.shiftHours * 3600000))
        obj.timed = true

        switch (obj.shiftType) {
          case 'workday':
            obj.color = 'green'
            break
          case 'dayoff':
            obj.color = 'orange'
            break
          case 'holiday':
            obj.color = 'orange'
            break
          case 'extra':
            obj.start.setHours(obj.start.getHours() + this.shiftHours)
            obj.end.setHours(obj.end.getHours() + obj.extraHours)
            obj.color = 'red'
            break

          case 'annual':
            obj.color = 'cyan'
            break

          default:
            break
        }
        return obj
      },
      updateRange ({ start, end }) {
        const events = []

        // const min = new Date(`${start.date}T00:00:00`)
        // const max = new Date(`${end.date}T23:59:59`)
        // const days = (max.getTime() - min.getTime()) / 86400000
        // const eventCount = this.rnd(days, days + 20)

        // for (let i = 0; i < eventCount; i++) {
        // const allDay = this.rnd(0, 3) === 0
        // const firstTimestamp = this.rnd(min.getTime(), max.getTime())
        // const first = new Date(firstTimestamp - (firstTimestamp % 900000))
        // const secondTimestamp = this.rnd(2, allDay ? 288 : 8) * 900000
        // const second = new Date(first.getTime() + secondTimestamp)

        // events.push({
        //   name: this.names[this.rnd(0, this.names.length - 1)],
        //   start: first,
        //   end: second,
        //   color: this.colors[this.rnd(0, this.colors.length - 1)],
        //   timed: !allDay,
        // })
        // }

        for (let i = 0; i < this.dates.length; i++) {
          const element = this.dates[i]
          events.push(this.createCalendarObject(element))
        }

        this.events = events
      },
      rnd (a, b) {
        return Math.floor((b - a + 1) * Math.random()) + a
      },
    },
  }
</script>

<style lang="scss" scoped></style>
