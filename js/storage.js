var db;
var loser;
var winner;
var winnerScore;
var winnerPic;
/**************************************/
//CREATING A NEW DATABASE OR OPENING IT
/**************************************/
function createDataBase() {
  if (!window.indexedDB) {
    window.alert("Your browser does not support a stable version of IndexedDb");
  }
  var dbName = "Ranking";
  var request = indexedDB.open("GameScores", 1);

  request.onerror = function(evt) {
    alert("request.onerror errorcode =" + evt.target.error.name);
  };

  request.onupgradeneeded = function(evt) {
    console.log("Creating a new version of the dataBase");

    db = evt.target.result;

    var objectStore = db.createObjectStore("Ranking", {
      keyPath: "name"
    });
  };

  request.onsuccess = function(evt) {
    console.log("dataBase opened");
    db = evt.target.result;
    checkStore();
  };
}
/****************************************/
//CHECKING NUM OF PLAYERS IN OBJECT STORE
/****************************************/
function checkStore() {
  if (db === null) {
    alert("No Database!");
  }
  var transaction = db.transaction(["Ranking"], "readwrite");
  transaction.oncomplete = function(evt) {
    console.log("All done!");
  };
  transaction.onerror = function(evt) {
    console.log(evt.target.errorCode);
  };
  var objectStore = transaction.objectStore("Ranking");
  //Retrieving and storing Players
  /*******************************/
  var topPlayers = [];
  objectStore.openCursor().onsuccess = function(evt) {
    var cursor = evt.target.result;
    if (cursor) {
      topPlayers.push(cursor.value);
      cursor.continue();
    } else {
      if (topPlayers.length < 3) {
        addPlayer(objectStore);
      } else {
        console.log("Maximum players already saved. Checking scores.");
        compareScores(objectStore, topPlayers);
      }
    }
  };
}
//*************************************//
//ADDING A NEW PLAYER IN THE STORE
//*************************************//
function addPlayer(objectStore) {
  if (db === null) {
    alert("No Database!");
  }
  var newPlayer = {};
  newPlayer.name = nameEntered.value;
  newPlayer.score = score;
  newPlayer.picture = picture;
  var request = objectStore.add(newPlayer);
  request.onsuccess = function(evt) {
    console.log("New player " + evt.target.result + " added.");
  };
  request.onerror = function(evt) {
    console.log("error : " + evt.target.error.name + " This name is already used.");
  }

}
/***********************************************/
//COMPARING SCORES IF MAX PLAYERS STORED REACHED
/***********************************************/
function compareScores(objectStore, array) {
  if (db === null) {
    alert("No Database!");
  }
  //Retrieving and storing Players
  /*******************************/
  objectStore.openCursor().onsuccess = function(evt) {
    var cursor = evt.target.result;
    if (cursor) {
      array.push(cursor.value);
      cursor.continue();
    } else {
      console.log("Scores are being checked.");
    }
  }
  var lowest = Number.POSITIVE_INFINITY;
  var highest = Number.NEGATIVE_INFINITY;
  var myScore;

  for (var i = array.length - 1; i >= 0; i--) {
    myScore = array[i].score;
    if (myScore < lowest) {
      lowest = myScore;
      loser = array[i].name;
    }
    if (myScore > highest) {
      highest = myScore;
      winner = array[i].name;
    }
  }
  if (score > lowest) {
    deletePlayer(loser);
    addPlayer(objectStore);
  }
}

function deletePlayer(player) {
  var transaction = db.transaction(["Ranking"], "readwrite");
  transaction.oncomplete = function() {
    console.log(player + " deleted with success.");
  };
  transaction.onerror = function(evt) {
    console.log("transaction.onerror errcode= " + evt.target.error.name);
  };
  var objectStore = transaction.objectStore("Ranking");
  var request = objectStore.delete(player);

  request.onsuccess = function() {};
  request.onerror = function(evt) {
    console.log(evt.target.error.name);
  };
}
//DISPLAY THE TOP SCORER IN THE MAIN CANVAS
//NEW REQUEST AND TRANSACTION AFTER THE PLAYER SAVED HIS SCORE//
//TO MAKE SURE TOP SCORE IS UP TO DATE//
function topScorer() {
  var request = indexedDB.open("GameScores", 1);
  request.onerror = function(evt) {
    alert("request.onerror errorcode =" + evt.target.error.name);
  };
  request.onupgradeneeded = function(evt) {
    console.log("Creating a new version of the dataBase");
    db = evt.target.result;
    var objectStore = db.createObjectStore("Ranking", {
      keyPath: "name"
    });
  };
  request.onsuccess = function(evt) {
    console.log("dataBase opened after update");
    db = evt.target.result;

    var transaction = db.transaction(["Ranking"], "readwrite");
    transaction.oncomplete = function() {
      console.log("Ranking Sorted.");
    };
    transaction.onerror = function(evt) {
      console.log(evt.target.errorCode);
    };
    var objectStore = transaction.objectStore("Ranking");
    var topPlayers = [];
    objectStore.openCursor().onsuccess = function(evt) {
      var cursor = evt.target.result;
      if (cursor) {
        topPlayers.push(cursor.value);
        cursor.continue();
      } else {
        console.log("Checking Top Scorer");
        rankPlayer(topPlayers, objectStore);
      }
    }
  };
}

function rankPlayer(array) {
  var highest = Number.NEGATIVE_INFINITY;
  for (var i = array.length - 1; i >= 0; i--) {
    var totalScore = array[i].score;
    if (totalScore > highest) {
      highest = totalScore;
      winner = array[i].name;
      winnerScore = array[i].score;
      winnerPic = array[i].picture;
    }
  }
  bestScorer();
  scoreSaved = true;
}
