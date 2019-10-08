  var config = {
    apiKey: "AIzaSyDg2nua3QaWEnwa22kzx5IGrQmdW-mzcqI",
    authDomain: "traintimes-c86ac.firebaseapp.com",
    databaseURL: "https://traintimes-c86ac.firebaseio.com",
    projectId: "traintimes-c86ac",
    storageBucket: "traintimes-c86ac.appspot.com",
    messagingSenderId: "525567775607",
    appId: "1:525567775607:web:6271f90c714262a6ed4772"
  };
  
  firebase.initializeApp(config);
  var database = firebase.database();
  var train = database.ref("/train");
  
  
  database.ref().on("value", function(snapshot) {
      $("#train-info").empty();
  
      // Creates a new row element that will be use to add the form variables and calculated variables
      var masterRow = $("<tr>");
  
      // Creates column elements that will be used for the header
      var train_name = $("<th>");
      var destination_name = $("<th>");
      var initialFrequency = $("<th>");
      var initialArrival = $("<th>");
      var initialMinutesAway = $("<th>");
      
      // Writes the table headers
      train_name.text("Train Name");
      destination_name.text("Destination");
      initialFrequency.text("Frequency");
      initialArrival.text("Next Arrival");
      initialMinutesAway.text("Minutes Away");
  
      // Appends column elements to the row
      masterRow.append(train_name);
      masterRow.append(destination_name);
      masterRow.append(initialFrequency);
      masterRow.append(initialArrival);
      masterRow.append(initialMinutesAway);
  
      // Appends the row to the table
      $("#train-info").append(masterRow);
  
      for(var key in snapshot.val().train){
        // Creates a new row element that will be use to add the form variables and calculated variables
        var masterRow = $("<tr>");
  
        // Creates column elements that will be used to add to the row
        var train_name = $("<td>");
        var destination_name = $("<td>");
        var initialFrequency = $("<td>");
        var initialArrival = $("<td>");
        var initialMinutesAway = $("<td>");
  
        // Retrieves database values
        var train = snapshot.val().train[key].train;
        var destination = snapshot.val().train[key].destination;
        var frequency = snapshot.val().train[key].frequency;            
        //current time
        var currentTime = moment();
  
        //Very first trip
        var timeFirstTrain = moment(snapshot.val().train[key].first_flight_time,"MM/DD/YYYY HH:mm");

        //This takes the difference in time between now and the very first train in minutes...
        var diffMinutesTrains = currentTime.diff(timeFirstTrain,'minutes');
        
        var timeRemaining = frequency - diffMinutesTrains % frequency;
  
        // expected time that the train will arrive
        var nextArrival = currentTime.add(timeRemaining,'minutes');
  


        // Adds text to the table
        train_name.text(train);
        destination_name.text(destination);
        initialFrequency.text(frequency);
        initialArrival.text(nextArrival.format("hh:mm a"));
        initialMinutesAway.text(timeRemaining);
  
        masterRow.append(train_name);
        masterRow.append(destination_name);
        masterRow.append(initialFrequency);
        masterRow.append(initialArrival);
        masterRow.append(initialMinutesAway);
        $("#train-info").append(masterRow);
   console.log(currentTime);
   console.log(timeFirstTrain);
   console.log(diffMinutesTrain);
   console.log(timeRemaining);
   console.log(nextArrival);
   
      }
  }, function(errorObject) {
    console.log("The read failed: " + errorObject.code);

  });
  
  
  $("#submit").on("click", function(event) {
    
    event.preventDefault();
  
    var train = $("#name-input").val().trim();
    var destination = $("#destination-input").val().trim();
    var firstTrainTime = $("#time-input").val().trim();
    var frequency = $("#frequency-input").val().trim();
    
    newSchedule(train,destination,firstTrainTime,frequency);
  
  });
  
  // Write a scheduling to the train table
  function newSchedule(nameInput,destinationInput,firstflightInput,frequencyInput) {
    
    // Form the object that will be saved to DB
    var newData = {
      train: nameInput,
      destination: destinationInput,
      first_flight_time: firstflightInput,
      frequency: frequencyInput};
  
    
    var add = train.push(newData);
  
    
    
  }