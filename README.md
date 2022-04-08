The code creates new events in one google calendar indicated by us based on the events from a year ago in another calendar. An example of destiny is to create events that are reminiscent of anniversaries. Before using a given code, you should additionally define what the created events are to be called, otherwise the created events will have the same name as the events from the year before.
###How to use </br>
The first step to connect to the google calendar is logging in to https://console.cloud.google.com/ on the google account you want to use. </br>
We create a new project there. Then select "Administration"> "Service Accounts" in the navigation menu. We need to create a service account via the "CREATE SERVICE ACCOUNT" button. When creating a service account, we must indicate the "Owner" role in granting access to the project. </br>
After creating the service account in the right, the "Action" column is the menu where we need to create the key in JSON format. After downloading the key, paste it into the project folder, then copy its entire content and paste it in the .env file next to the "CREDENTIALS" variable. </br>
Then on the same page, in the navigation menu on the left, select "APIs and services"> "Enabled APIs and services". At the top, click on "ENABLE API INTERFACES AND SERVICES", search for "
Google Calendar API "and click the" Enable "button. </br>
Next, we need to log in to the google calendar page and create a new calendar on the left side. When it appears on the left side, go to "Settings and sharing" of the newly created calendar, scroll to the option "Share with selected people" and click "Add people". There, paste the email address, which is provided in the previously downloaded JSON file with the value "client_email", and select "can change events" in the permissions. With the "CALENDAR_ID2" value, paste the "Calendar ID", which can be found in the calendar options, scrolling almost to the very end.</br>
In this calendar, the program will create new events. We perform the above operation for another calendar, from which we want to retrieve information about events from the previous year, and paste the "calendar identifier" next to the value "CALENDAR_ID1".