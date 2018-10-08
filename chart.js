
//functions

// convert string to date
function formatDate(a) {
    var b = [a.slice(0, 4), "-", a.slice(4, 6), "-", a.slice(6, 8)].join('');
    var newDate = new Date(b)
    return newDate;
}

//select max of points
function getMaxPoints(playersArr){
	var maxArr = [];
	for(let player in playersArr ){
		maxArr.push(Math.max.apply(null, playersArr[player].points))
	}
	var max = Math.max.apply(null, maxArr);
	max = max + ( 100 - ( max % 100 ));
	return max;  
}

//get bar height 
function getBarHeightPercentage(MaxY,score){
	return (score/MaxY);
}



const req = new XMLHttpRequest();
req.open('GET', 'http://cdn.55labs.com/demo/api.json', false); 
req.send(null);

if (req.status === 200) {
	var chartjson = JSON.parse(req.responseText);
    console.log("Réponse reçue: %s", chartjson.data.DAILY.dataByMember.players.larry.points);
} else {
    console.log("Status de la réponse: %d (%s)", req.status, req.statusText);
} 


//set colors for bars
var colors = {"john":{'color':"#999",'left':'13px'},"larry":{'color':"#b61924",'left':'23px'}};
//get the chart canvas by ID
var barChart = document.getElementById('q-graph');

// players points
var players = chartjson.data.DAILY.dataByMember.players;

// games's daily dates
var dates = chartjson.data.DAILY.dates;

// settings
var settings = chartjson.settings;

//get max point of players
var maxPoint = getMaxPoints(players);

//creaate title of the graph
var title = document.createElement('caption');
title.innerText = settings.label;

barChart.appendChild(title);
//create the bar row
var barRow = [];

//lets add data to the chart
for (let i = 0; i < dates.length; i++) {
	//create ligne xAxis
	barRow[i]= document.createElement('tr');
	//the title of our ligne id the date 
	var xAxis = document.createElement('th');
	var dataDate = null;
	var day = null;
	if(dates[i]!== null)
	{
		dataDate = formatDate(dates[i]);
		day = dataDate.getDate();
	}
	xAxis.innerText = i+1;

	barRow[i].setAttribute('class','qtr');
	if(i == 0)
	{
		barRow[i].style.left = 10 ;
	}
	else {
		barRow[i].style.left = 30  + parseInt(barRow[i - 1].style.left) ;
	}
	var graphHeight = barChart.offsetHeight;
	for (let player in players) {
		let barData = document.createElement('td');
		barData.setAttribute('class','bar');
		barData.style.backgroundColor =  colors[player].color;
		barData.style.left =  colors[player].left;
		barData.style.borderColor = 'transparent';

		barData.style.height = (getBarHeightPercentage(getMaxPoints(players),players[player].points[i]) * graphHeight) + "px";
		//create details div
		let divDetails = document.createElement('div'); 
		//set a uniqueID to the div
		divDetails.setAttribute('id','div' + players[player].points[i] + i + player);
		
		//div content
		let barText = document.createElement('p');
		barText.innerText = 'Score : '  + players[player].points[i];
		
		//set a uniqueID to pElement
		barText.setAttribute('id','p'+players[player].points[i] + i + player)
		
		// add date to the detail div
		let barDate = document.createElement('p');
		barDate.innerText = dataDate;
		
		// Initialize the diplay property if the berText
		divDetails.style.display = "none";
		
		divDetails.appendChild(barText);
		divDetails.appendChild(barDate);
		
		//Set onClick event listner
		// When the user clicks the bar, show details
		barData.onclick = function(event) {
			
			
			//get the details element by ID
			let pElement = document.getElementById(event.srcElement.firstChild.id);
			/*	
				check if the element is alredy visible
				if yes make it hidden 
				else make it visible
			*/
			if(pElement.style.display == 'block'){
					pElement.style.display = 'none';
					window.location.href  =  window.location.href.split('#')[0];
			}
			else{
					//check if their is an other div visible we should hide it and remove it from the URL
					var idPerviousDiv = window.location.href.split('#')[1]
					console.log(idPerviousDiv)
					if(idPerviousDiv){
						let previousDiv = document.getElementById(idPerviousDiv);
						previousDiv.style.display = 'none';
						pElement.style.display = 'block';
					}
					pElement.style.display = 'block';
					window.location.href = window.location.href.split('#')[0] + "#" + event.srcElement.firstChild.id;			
				}
		};
		window.onload = function(){ 
			let idDiv = window.location.href.split('#')[1];
			if(idDiv){
				let pElement = document.getElementById(idDiv);
				pElement.style.display = 'block';
			}
		}
		
		barData.appendChild(divDetails);
		barRow[i].appendChild(barData);

	}


	barRow[i].appendChild(xAxis);
	barChart.appendChild(barRow[i]);
}

var barchartTemplate = document.getElementById('ticks');
var maxY = getMaxPoints(players);
var step = maxY/5;
for (let i = 0 ; i < 5 ; i++){
	var templateRow = document.createElement('div');
	templateRow.setAttribute('class','tick');
	templateRow.style.height = '60px';
	var yAxis = document.createElement('p');
	yAxis.innerText = maxY;
	templateRow.appendChild(yAxis);
	barchartTemplate.appendChild(templateRow);
	maxY -= step;
	
}

//legend
var legendEle = document.getElementById('legend');

for(let player in settings.dictionary){
	var _li= document.createElement('li');
	var _span = document.createElement('span');
	_span.setAttribute('id',player);
	_span.setAttribute('class','paid');
	_span.style.backgroundColor = colors[player].color;
	_li.innerText = settings.dictionary[player].firstname + ' ' + settings.dictionary[player].lastname ;
	_li.appendChild(_span);
	legendEle.appendChild(_li);
}

document.getElementById('barchart').innerHTML = barChart.outerHTML;
document.getElementById('ticks').innerHTML = barchartTemplate.outerHTML;
document.getElementById('legend').innerHTML = legendEle.outerHTML;

