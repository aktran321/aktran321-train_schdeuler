const config = {
    apiKey: "AIzaSyDekVP5x9XPKFTr9GbXEUSc2TpcKnodsVM",
    authDomain: "train-schedule-db-58176.firebaseapp.com",
    databaseURL: "https://train-schedule-db-58176.firebaseio.com",
    projectId: "train-schedule-db-58176",
    storageBucket: "train-schedule-db-58176.appspot.com",
    messagingSenderId: "560596663464",
    appId: "1:560596663464:web:1bec35d14ee1028109569d"
  };

firebase.initializeApp(config);

var database = firebase.database();
var train = database.ref("/train");

// --------------------------------------------------------------
// At the initial load and subsequent value changes, get a snapshot of the stored data.
// This function allows you to update your page in real-time when the firebase database changes.
database.ref().on("value", function(snapshot) {
    $(".train-schedule").empty();

    // Creates a new row element that will be use to add the form variables and calculated variables
    var trRow = $("<tr>");

    // Creates column elements that will be used for the header
    var thEntryTrain = $("<th>");
    var thEntryDestination = $("<th>");
    var thEntryFrequency = $("<th>");
    var thNextArrival = $("<th>");
    var thMinutesAway = $("<th>");
    
    // Writes the table headers
    thEntryTrain.text("Train Name");
    thEntryDestination.text("Destination");
    thEntryFrequency.text("Frequency");
    thNextArrival.text("Next Arrival");
    thMinutesAway.text("Minutes Away");

    // Appends column elements to the row
    trRow.append(thEntryTrain);
    trRow.append(thEntryDestination);
    trRow.append(thEntryFrequency);
    trRow.append(thNextArrival);
    trRow.append(thMinutesAway);

    // Appends the row to the table
    $(".train-schedule").append(trRow);

    for(var key in snapshot.val().train){
      // Creates a new row element that will be use to add the form variables and calculated variables
      var trRow = $("<tr>");

      // Creates column elements that will be used to add to the row
      var thEntryTrain = $("<td>");
      var thEntryDestination = $("<td>");
      var thEntryFrequency = $("<td>");
      var thNextArrival = $("<td>");
      var thMinutesAway = $("<td>");

      // Retrieves database values
      var train = snapshot.val().train[key].train;
      var destination = snapshot.val().train[key].destination;
      var frequency = snapshot.val().train[key].frequency;

      // Adds text to the column elements
      thEntryTrain.text(train);
      thEntryDestination.text(destination);
      thEntryFrequency.text(frequency);
          
      //Creates the current moment in time. This will be used to calculate the time the train will be arriving at.
      var timeNow = moment();

      //The first time the given train took a trip. This value will be compared against timeNow to establish the next train arrival.
      var timeFirstTrain = moment(snapshot.val().train[key].first_flight_time,"MM/DD/YYYY HH:mm");
      var diffMinutesTrains = timeNow.diff(timeFirstTrain,'minutes');
      

      //The difference between the frequency and the the variable diff minutes modulus the frequency gives time remaining till train arrives
      var timeRemaining = frequency - diffMinutesTrains % frequency;

      // Adds the time remaining till next train to the current time to give the expected time the train will arrive
      var nextArrival = timeNow.add(timeRemaining,'minutes');


      thNextArrival.text(nextArrival.format("hh:mm a"));
      thMinutesAway.text(timeRemaining);

      trRow.append(thEntryTrain);
      trRow.append(thEntryDestination);
      trRow.append(thEntryFrequency);
      trRow.append(thNextArrival);
      trRow.append(thMinutesAway);

      $(".train-schedule").append(trRow);
 
    }
  
// Else Firebase doesn't have a highPrice/highBidder, so use the initial local values.
//If any errors are experienced, log them to console.
}, function(errorObject) {
  console.log("The read failed: " + errorObject.code);
});

// Whenever a user clicks the submit-bid button
$("#submit-schedule").on("click", function(event) {
  // Prevent form from submitting
  event.preventDefault();

  var train = $("#name-input-id").val().trim();
  var destination = $("#destination-input-id").val().trim();
  var firstTrainTime = $("#time-input-id").val().trim();
  var frequency = $("#frequency-input-id").val().trim();
  
  writeNewTrainSchedule(train,destination,firstTrainTime,frequency);

});

// Write a scheduling to the train table
function writeNewTrainSchedule(nameInput,destinationInput,firstflightInput,frequencyInput) {
  
  // Form the object that will be saved to DB
  var scheduleData = {
    train: nameInput,
    destination: destinationInput,
    first_flight_time: firstflightInput,
    frequency: frequencyInput};

  // Get a key uniquely identify the object that will be saved to DB
  var trainAdd = train.push(scheduleData);

  // Writes the object formed to the databases and link this to the unique key
  
}