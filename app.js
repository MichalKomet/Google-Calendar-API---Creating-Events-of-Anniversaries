const {google} = require('googleapis');
require('dotenv').config();

const CREDENTIALS = JSON.parse(process.env.CREDENTIALS);
const calendarId1 = process.env.CALENDAR_ID1;
const calendarId2 = process.env.CALENDAR_ID2;

const SCOPES = 'https://www.googleapis.com/auth/calendar';
const calendar = google.calendar({version: "v3"});

const auth = new google.auth.JWT(
    CREDENTIALS.client_email,
    null,
    CREDENTIALS.private_key,
    SCOPES
);

const dateTimeForCalander = () => {

    const date = new Date();

    const month = ((date.getMonth() + 2) > 12)
        ? 1
        : date.getMonth() + 2;

    const startEventYearAgo = `${date.getFullYear() - 1}-${
        (date.getMonth() + 1) < 10
            ? '0' + (date.getMonth() + 1)
            : (date.getMonth() + 1)}-${
        date.getDate() < 10
            ? '0' + date.getDate()
            : date.getDate()}`;

    const endEventYearAgo = `${date.getFullYear() - 1}-${
        (month < 10)
            ? '0' + month
            : month}-15`;

    const startYearAgo = new Date(Date.parse(startEventYearAgo));
    const endYearAgo = new Date(Date.parse(endEventYearAgo));

    const startEventThisYear = `${date.getFullYear()}-${
        date.getMonth() < 10
            ? '0' + date.getMonth()
            : date.getMonth()}-15`;

    const endEventThisYear = `${date.getFullYear()}-${
        month < 10
            ? '0' + month
            : month}-15`;

    const startThisYear = new Date(Date.parse(startEventThisYear));
    const endThisYear = new Date(Date.parse(endEventThisYear));

    return {
        startYearAgo,
        endYearAgo,
        startThisYear,
        endThisYear,
    }
};
const dateTime = dateTimeForCalander();

class Event {
    constructor(title, start, end, description) {
        this.summary = title;
        this.description = description;
        this.start = {
            date: start,
            timeZone: "Europe/Warsaw"
        }
        this.end = {
            date: end,
            timeZone: "Europe/Warsaw"
        }
    };
}

const insertEvent = async (event) => {

    try {
        const response = await calendar.events.insert({
            auth: auth,
            calendarId: calendarId2,
            resource: event
        });

        if(response.status === 200 && response.statusText === 'OK') {
            return 1;
        } else {
            return 0;
        }
    } catch (error) {
        console.log(`Error at insertEvent --> ${error}`);
        return 0;
    }
};

const getEvents = async (dateTimeStart, dateTimeEnd, calendarId) => {

    try {
        let response = await calendar.events.list({
            auth: auth,
            calendarId: calendarId,
            timeMin: dateTimeStart,
            timeMax: dateTimeEnd,
            timeZone: 'Europe/Warsaw'
        });
        return response.data.items;
    } catch (error) {
        console.log(`Error at getEvents --> ${error}`);
        return 0;
    }
};

const startDateYearAgo = dateTime.startYearAgo;
const endDateYearAgo = dateTime.endYearAgo;

const startDateThisYear = dateTime.startThisYear;
const endDateThisYear = dateTime.endThisYear;

let eventsLastYear;
let eventsThisYear;
const retriveDate = (dateObj) => dateObj.dateTime ? dateObj.dateTime.split('T')[0] : dateObj.date;

getEvents(startDateThisYear, endDateThisYear, calendarId2)
    .then((res) => {
        eventsThisYear = res.map(el => el.description);
    })
    .then(() => {
        getEvents(startDateYearAgo, endDateYearAgo, calendarId1)
            .then((res) => {
                eventsLastYear = res;
                eventsLastYear.forEach(el => {
                    if(!eventsThisYear.includes(el.id)) {
                        const retrivedDate = retriveDate(el.start);
                        const startDate = `${(new Date(retrivedDate)).getFullYear() + 1}-${
                            ((new Date(retrivedDate)).getMonth() + 1) < 10
                                ? '0' + ((new Date(retrivedDate)).getMonth() + 1)
                                : ((new Date(retrivedDate)).getMonth() + 1)}-${
                            (new Date(retrivedDate)).getDate() < 10
                                ? '0' + (new Date(retrivedDate)).getDate()
                                : (new Date(retrivedDate)).getDate()}`;

                        const endDate = `${(new Date(startDate)).getFullYear()}-${
                            ((new Date(startDate)).getMonth() + 1) < 10
                                ? '0' + ((new Date(startDate)).getMonth() + 1)
                                : ((new Date(startDate)).getMonth() + 1)}-${
                            (new Date(startDate)).getDate() < 10
                                ? '0' + (new Date(startDate)).getDate()
                                : (new Date(startDate)).getDate()}`;

                        //To change Title of creating event repleace argument "el.summary" one line below
                        const event = new Event(el.summary, startDate, endDate, el.id);

                        insertEvent(event)
                            .then((res) => {
                                console.log(res);
                            })
                            .catch((err) => {
                                console.log(err);
                            });
                    } else {
                        console.log('This event already exist...');
                    }

                });
            })
            .catch((err) => {
                console.log(2, err);
            });
    })
    .catch((err) => {
        console.log(1, err);
    });


