window.addEventListener("load", function () {
    //list of drivers X
    //state
    //function go get data X
    //populate data in list X
    //current state of data
    //sort list X
  
    //one top level object all api data
    //individual driver objects, also all api data
  
    //DriverList
    //driverList
    //driverList.fetchData()
    //driverList.displayData()
    //driveList.state
    //driverList.sort()
    //driverList.onComplete(function() {})
  
    /*STATE: If api data has returned, run display. if not, show error
    initial page load
    error state
    loaded
    
    */
    class Driver {
      constructor(
        givenName,
        familyName,
        dateOfBirth,
        nationality,
        team,
        points,
        wins
      ) {
        
        this.givenName = givenName;
        this.familyName = familyName;
        this.dateOfBirth = dateOfBirth;
        this.nationality = nationality;
        this.team = team;
        this.points = parseInt(points, 10);
        this.wins = parseInt(wins, 10);
      }
  
      getFullName() {
        let fullName = this.givenName + " " + this.familyName;
        return fullName;
      }
  
      getAge() {
        let dob = new Date(this.dateOfBirth);
        let dobYear = dob.getFullYear();
        let todayDate = new Date();
        let todayYear = todayDate.getFullYear();
        let age = todayYear - dobYear;
        return age;
      }
    }
  
    class DriverLineUp {
      constructor() {}
      driverData = []; //this.driverData
      state = "unloaded";
  
      handleApiResponse = function (data) {
        this.state = "loaded";
        const driverStandings =
          data["MRData"]["StandingsTable"]["StandingsLists"][0][
            "DriverStandings"
          ];
  
        for (let i = 0; i < driverStandings.length; i++) {
          let eachDriver = driverStandings[i];
          //console.log(eachDriver);
  
          const {
            position,
            points,
            wins,
            Driver: { givenName, familyName, dateOfBirth, nationality }
          } = eachDriver;
          //console.log(position, points, wins, givenName, familyName, nationality);
          const constructorsCategory = eachDriver["Constructors"];
          //console.log(constructorsCategory);
          const insideConstructorCat = constructorsCategory[0];
          const team = insideConstructorCat["name"];
          //console.log(driverTeam);
          const driver = new Driver(
            givenName,
            familyName,
            dateOfBirth,
            nationality,
            team,
            points,
            wins
          );
          //driver.getFullName();
          //driver.getAge();
          this.driverData.push(driver);
        } // end of for loop
      }; //end of handleResponse
  
      fetchData() {
        fetch("https://ergast.com/api/f1/current/driverStandings.json")
          .then((response) => {
            if (!response.ok) {
              throw new Error("Network response was not ok");
            }
            console.log(response);
            return response.json();
          })
          .then((data) => this.handleApiResponse(data))
          .catch((error) => {
            this.state = "error";
            console.log(error);
          })
          .finally(() => this.display());
      }
  
      postError = function () {
        let errorCell = document.createElement("td"); //make cell
        errorCell.setAttribute("class", "error"); //classy cell
        errorCell.innerText = "API did not load";
        errorCell.setAttribute("colspan", 6);
        let row = document.createElement("tr");
        row.appendChild(errorCell);
        console.log("error in da API");
        return row;
      };
  
      createDataCell(detail) {
        let cell = document.createElement("td"); //make cell
        cell.setAttribute("class", "cell"); //classy cell
        cell.innerText = detail;
        return cell;
        //console.log(cell);
        //cell.appendChild(textNode); //append node to cell
      }
  
      display() {
        let myTable = document.getElementById("myTable"); //gets existing table
        myTable.innerHTML = "";
        if (this.state === "loaded") {
          //let table = document.createElement('table'); //don't know what this is for
          this.driverData.forEach((driver) => {
            let row = document.createElement("tr"); //make row, row are important
            myTable.appendChild(row);
            row.setAttribute("class", "row"); //classy row
  
            //let nameCell = document.createElement("td");
            // nameCell.appendChild(this.createDataCell(driver.getFullName())); Cause of cell redundancy
            row.appendChild(this.createDataCell(driver.getFullName())); //append cell to row
  
            row.appendChild(this.createDataCell(driver.getAge())); //append cell to row
  
            row.appendChild(this.createDataCell(driver.nationality)); //append cell to row
  
            row.appendChild(this.createDataCell(driver.team)); //append cell to row
  
            row.appendChild(this.createDataCell(driver.points)); //append cell to row
  
            row.appendChild(this.createDataCell(driver.wins)); //append cell to row
  
            myTable.appendChild(row);
          });
        } else if (this.state === "error") {
          let row = this.postError();
          myTable.appendChild(row);
        }
        this.displayBackground();
      }
  
      sortResults() {
        const dropDownTargetValue = event.currentTarget.value;
  
        function dynamicSorter(property) {
          //Would like to get this working. Currently does not.
          let sortOrder = 1;
          if (property[0] === "-") {
            sortOrder = -1;
            property = property.substr(1);
          }
          return function (a, b) {
            let result =
              a[property] < b[property] ? -1 : a[property] > b[property] ? 1 : 0;
            return result * sortOrder;
          };
        }
  
        if (this.state === "unloaded") {
          //(this.driverData === [] || this.driverData === undefined) {
          console.log("Why you no work?");
          console.log(this.driverData);
          return;
        } else {
          //console.log(dropDownTargetValue);
          switch (dropDownTargetValue) {
            case "name":
              this.driverData.sort((a, b) => {
                if (a.familyName.toLowerCase() < b.familyName.toLowerCase())
                  return -1;
                if (a.familyName.toLowerCase() > b.familyName.toLowerCase())
                  return 1;
                return 0;
              });
              //console.log(this.driverData.sort());
              break;
            case "age":
              //console.log(this.driverData[0].getAge());
              this.driverData.sort((a, b) => {
                return a.getAge() - b.getAge();
              });
              break;
            case "nationality":
              this.driverData.sort((a, b) => {
                if (a.nationality.toLowerCase() < b.nationality.toLowerCase())
                  return -1;
                if (a.nationality.toLowerCase() > b.nationality.toLowerCase())
                  return 1;
                return 0;
              });
              break;
            case "team":
              this.driverData.sort((a, b) => {
                if (a.team.toLowerCase() < b.team.toLowerCase()) return -1;
                if (a.team.toLowerCase() > b.team.toLowerCase()) return 1;
                return 0;
              });
              break;
            case "points":
              this.driverData.sort((a, b) => {
                return b.points - a.points;
              });
              console.log(this.driverData[0].getFullName());
              break;
            case "wins":
              console.log(this.driverData[0].getFullName());
              this.driverData.sort((a, b) => {
                return b.wins - a.wins;
              });
          }
          //console.log(this.driverData.sort());
        }
        this.display();
      } //Closing for sortResults()
  
      compare = function (winningDriver, driver) {
        if (winningDriver.points > driver.points) {
          return winningDriver;
        } else {
          return driver;
        }
      };
  
      displayBackground() {
        console.log(this.state);
        if (this.state === "loaded") {
          this.winner = this.driverData.reduce(this.compare, { points: -1 });
          let winnerTeam = this.winner.team;
          let url = "url('https://source.unsplash.com/1600x900/?" +
            "formula-one," +
            "')";
          document.body.style.backgroundImage = url
          console.log(url);    
        } else {
          document.body.style.backgroundImage =
            "url('https://source.unsplash.com/1600x900/?" +
            "formula-one" +
            "')";
        }
      }
    } //Closing for DriverLineup
  
    const driverLineUp = new DriverLineUp();
  
    driverLineUp.fetchData();
  
    //const sortBtn = document.getElementById("sort");
    const sortDropDown = document.getElementById("sort-drop-down");
    sortDropDown.addEventListener("change", (event) => {
      driverLineUp.sortResults(event.currentTarget.value);
    });
  
    driverLineUp.display();
  });
