const { google } = require('googleapis');
const express = require('express');
const bodyParser = require('body-parser');
const cors=require('cors');

const app = express();
const PORT = 8080;

app.use(bodyParser.json());
const options = {
    origin: '*',
    }
app.use(cors(options))

const calendarId = 'primary'; // Replace with your Google Calendar ID

const credentials = {
  client_id: '554879703409-7pvhq0svirotdjh73oh3sgnpam9g3vo4.apps.googleusercontent.com',
  client_secret: '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',
  redirect_uris: ['http://localhost:8080/auth/redirect'],
};

const auth = new google.auth.OAuth2(
  credentials.client_id,
  credentials.client_secret,
  credentials.redirect_uris[0]
);

// Get authorization URL
app.get('/auth/url', (req, res) => {
  const authUrl = auth.generateAuthUrl({
    access_type: 'offline',
    scope: ['https://www.googleapis.com/auth/calendar'],
  });
  res.send({authUrl});
});

// Callback to exchange code for access token
app.get('/auth/redirect', async (req, res) => {
  const code = req.query.code;
  const { tokens } = await auth.getToken(code);
  auth.setCredentials(tokens);
  console.log(tokens)
  res.send('Authentication successful! You can now add events.');
});
function generateMockData(){
  const currentDate = new Date();
  const startTime = new Date(currentDate.getTime() + 2 * 60 * 60 * 1000);
  const endTime = new Date(currentDate.getTime() + 3 * 60 * 60 * 1000); 
  const formattedStartTime = startTime.toISOString();
  const formattedEndTime = endTime.toISOString();
  return {startDateTime:formattedStartTime,endDateTime:formattedEndTime,summary:"This is a test summary",description:"This is a test description"}
}


app.post('/setEvents', async (req, res) => {
  const { summary, description, startDateTime, endDateTime } = req.body;
  const calendar = google.calendar({ version: 'v3', auth });
  const event = {
    summary,
    description,
    start: {
      dateTime: startDateTime,
    },
    end: {
      dateTime: endDateTime,
    },
  };

  console.log("event",event)

  calendar.events.insert(
    {
      calendarId,
      resource: event,
    },
    (err, event) => {
      if (err) {
        console.log(err)
        res.status(500).send('Error adding event to calendar');
      } else {
        res.status(200).send('Event added to calendar');
      }
    }
  );
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
