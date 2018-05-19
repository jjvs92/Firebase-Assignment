  // Initialize Firebase
var config = {
apiKey: "AIzaSyBj7Vt9c3OkQio470RqzN2w6nXxF5HxLWI",
authDomain: "choo-choo-train-92850.firebaseapp.com",
databaseURL: "https://choo-choo-train-92850.firebaseio.com",
projectId: "choo-choo-train-92850",
storageBucket: "choo-choo-train-92850.appspot.com",
messagingSenderId: "951386958711"
};
firebase.initializeApp(config);

$(document).ready(function(){

  var database= firebase.database();
  // console.log(database);
  var trainName = "";
  var destination= "";
  var initailTrainTime= "";
  var frequency= "";

  database.ref().on("child_added", function(childSnapshot){
    var returnedName = childSnapshot.val().nameTrain;
    var returnedDestination = childSnapshot.val().whereTo;
    var returnedTrainTime = childSnapshot.val().firstOut;
    var returnedFrequency = childSnapshot.val().howOften;
    var firstTimeConverted = moment(returnedTrainTime, "HH:mm").subtract(1, "years");
    console.log(firstTimeConverted);   
    // Current Time
    var currentTime = moment();
    console.log("CURRENT TIME: " + moment(currentTime).format("hh:mm"));  
    // Difference between the times
    var diffTime = moment().diff(moment(firstTimeConverted), "minutes");
    console.log("DIFFERENCE IN TIME: " + diffTime);  
    // // Time apart (remainder)
    var tRemainder = diffTime % returnedFrequency;
    console.log(tRemainder);    
    var tMinutesTillTrain = returnedFrequency - tRemainder;
    console.log("MINUTES TILL TRAIN: " + tMinutesTillTrain);
    // Next Train
    var nextTrain = moment().add(tMinutesTillTrain, "minutes");
    console.log("ARRIVAL TIME: " + moment(nextTrain).format("hh:mm"));    

    $("#tableInfo").append("<tr><td>" + returnedName + "</td><td>" + returnedDestination + "</td><td>" + returnedFrequency + "</td><td>" + moment(nextTrain).format("hh:mm") + "</td><td>" + tMinutesTillTrain + "</td>") 
  })
  
  
  $("body").on("click", ".submitBtn", function(){
    event.preventDefault();
    console.log("test");
    trainName = $("#trainName").val().trim();
    destination = $("#destination").val().trim();
    initialTrainTime = $("#initialTrainTime").val().trim();
    frequency = $("#frequency").val().trim();            

    if(trainName === "" || destination === "" || initialTrainTime === "" || frequency === ""){
        alert("please fill all fields");
    }else {
        console.log(trainName);
        console.log(destination);
        console.log(initialTrainTime);
        console.log(frequency);

        database.ref().push({
            nameTrain: trainName,
            whereTo: destination,
            firstOut: initialTrainTime,
            howOften: frequency,
            dateAdded: firebase.database.ServerValue.TIMESTAMP            
        })
        $("#trainName").val("");
        $("#destination").val("");
        $("#initialTrainTime").val("");
        $("#frequency").val("");                        
    }
  })

})