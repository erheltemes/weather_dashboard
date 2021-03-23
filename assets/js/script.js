var searchBar = $("#searchBar")
var cityList = $("#cityList")
var currentWeather = $("#currentWeather")
var fiveDay = $("#fiveDay")
var submitBtn = $("#submitBtn")

var localSave = JSON.parse(localStorage.getItem("localSave"))
if (localSave === null) {
    localSave = []
}

//called data temporary globals
var globalData1 
var globalData2 


propagateCityList()

displaySetup(0)

//on submit, save city name to local storage cityList
submitBtn.on("click", function() {
    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${searchBar.val()}&appid=dfe4ebdd4d39c7b24392dc4d6ca41b3c`)

    .then(function(response) {
        if (response.status === 200) {
            return response.json()
        }
    })
    
    .then(function(data) {
        if (localSave.includes(data.name)) {
            window.alert("City already saved.")
            searchBar.val("")
            return
        }
        else {
            localSave.push(data.name)
            localStorage.setItem("localSave", JSON.stringify(localSave))
            localSave = JSON.parse(localStorage.getItem("localSave"))
            propagateCityList()
            displaySetup(localSave.indexOf(data.name))
        }
    })   
}) 

function displayWeather() {
    currentWeather.empty()
    currentWeather
        .append($("<h2>").text(globalData1.name)
        )
        .append($("<p>").text(`Date and time at lcoation: ${moment().add(18000 + globalData1.timezone, "s").format('MMMM Do YYYY, h:mm:ss a')}`)
        )
        .append($("<img>").attr("src", `http://openweathermap.org/img/wn/${globalData1.weather[0].icon}@2x.png`)
        )
        .append($("<p>").text(`Temperature: ${globalData2.current.temp} \u00B0F`)
        )
        .append($("<p>").text(`Humidity: ${globalData2.current.humidity}%`)
        )
        .append($("<p>").text(`Wind Speed: ${globalData2.current.wind_speed} MPH`)
        )
        .append($("<p>").text(`UVI: `)
            .append($("<span>").addClass("uvi").text(globalData2.current.uvi))
        )
    
    if (globalData2.current.uvi <= 5) {
        currentWeather.children().eq(6).children().eq(0).attr("style",`background: rgb(${globalData2.current.uvi*255/5},255,0);"`)
    }
    if (globalData2.current.uvi > 5 && globalData2.current.uvi <= 10){
        currentWeather.children().eq(6).children().eq(0).attr("style", `background: rgb(255,${5/globalData2.current.uvi*255},0);`) 
    }
    if (globalData2.current.uvi > 10 && globalData2.current.uvi <= 15){
        currentWeather.children().eq(6).children().eq(0).attr("style", `background: rgb(255,0,${globalData2.current.uvi*255/5});`)
    }
    if (globalData2.current.uvi > 15) {
        currentWeather.children().eq(3).children().eq(0).attr("style", `background: rgb(0,0,255);`)
    }
}

function displayForcast() {
    fiveDay.empty()
    for (i = 1; i < 6; i++) {
        fiveDay
        .append($("<div>").addClass("forcastCard")
            .append($("<h2>").text(moment().add(i, "days").format('MMM Do'))
            )
            .append($("<img>").attr("src", `http://openweathermap.org/img/wn/${globalData2.daily[i].weather[0].icon}@2x.png`)
            )
            .append($("<p>").text(`High: ${globalData2.daily[i].temp.max} \u00B0F`)
            )
            .append($("<p>").text(`Low: ${globalData2.daily[i].temp.min} \u00B0F`)
            )
            .append($("<p>").text(`Himidity: ${globalData2.daily[i].humidity}%`)
            ) 
        )   
    }
}      

function displaySetup(index) {
    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${localSave[index]}&units=imperial&appid=dfe4ebdd4d39c7b24392dc4d6ca41b3c`)
    .then(function(response) {
        if (response.status === 200) { 
        return response.json()
        }
    })

    .then(function(data) {
        globalData1 = data
        console.log(globalData1)
        return fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${data.coord.lat}&lon=${data.coord.lon}&units=imperial&appid=dfe4ebdd4d39c7b24392dc4d6ca41b3c`)
    })

    .then(function(response) {
        if (response.status === 200) { 
            return response.json()
        }
    })

    .then(function(data) {
        globalData2 = data
        console.log(globalData2)
        displayForcast()
        displayWeather()
    })

    return 
}

function propagateCityList() {
    cityList.empty()
    localSave.forEach(function(object, i) {
        cityList
        .append($("<div>").addClass("btnContainer")    
            .append($('<button>').attr("id", i).addClass("cityBtn").text(object)
            ) 
            .append($("<button>").addClass("deleteBtn").text("X")
            )  
        )
    })
}

cityList.on("click", ".cityBtn", function() {
    displaySetup($(this).attr("id"))
})

//deletes from display and local storage and reassigns new index
cityList.on("click", ".deleteBtn", function() {
    $(this).parent().remove()
    localSave.splice($(this).siblings().eq(0).attr("id"), 1)
    localStorage.setItem("localSave", JSON.stringify(localSave))
    localSave = JSON.parse(localStorage.getItem("localSave"))
    propagateCityList()

})




