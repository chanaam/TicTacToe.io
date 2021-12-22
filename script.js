//---------main----------------

let defult = 3;
let counter = 1;

document.getElementById("btnNewGame").onclick = game;
document.getElementById("btnChangeSize").onclick = changeSize;
document.getElementById("btnSaveGame").onclick = saveGame;
document.getElementById("btnLoadGame").onclick = loadGame;
document.getElementById("btnDeleteLastStep").onclick = deleteLastStep;
document.getElementById("btnTimer").onclick = startCount;
document.getElementById("btnShowRecord").onclick = ShowRecord;


let combinations = creatCombinations(defult);

let board = [];
let indexStep = [];
let record = defult * defult;


let p1 = new player("player_1", "x", "x", 0,0);
let p2 = new player("player_2", "o", "o", 0,0);

let players = [p1, p2];

let currentPlayer = p1;


function player(name, shape, style, record,win) {
    return {
        name,
        shape,
        style,
        record,
        win
    }
}

function getPlayerByShape(shape) {
    return players.find(p => p.shape == shape);

}


function game() {
    buildsGameBoard(defult);
    startGame();
}

function buildsGameBoard(num) {

    clear();
    createBoard(num)

}

function createBoard(num) {

    let counter = 0;
    for (i = 0; i < num; i++) {
        xo.innerHTML += `<div id="line${i}" class="flex-container">`;
        for (j = 0; j < num; j++) {
            document.getElementById(`line${i}`).innerHTML += `<div id="box${counter}"></div>`;
            counter++;
        }
        xo.innerHTML += `</div>`;
    }
}

function createDesign(){

    //for(i=0;i<3;i++)
    //{


    //}
}


function startGame() {

    stopCount();

    //document.getElementById('xo').addEventListener("click", doClick);
    for(i=0;i<defult*defult;i++)
        document.getElementById(`box${i}`).addEventListener("click",doClick);

}

function doClick(e) {

    let index = Number(e.target.id.slice(3)) // get id from element

    if (board[index])
        return;


    board[index] = currentPlayer.shape; //push to board js

    e.target.classList.add(currentPlayer.style) // to UI

    currentPlayer.record++;
    //console.log(`${currentPlayer.name} => ${currentPlayer.record}`);

    indexStep.push(index);

    let isWin = checksWin(index);
    if (isWin) 
       winner();

    changePlayer(index);

}

function winner()
{
    alert(currentPlayer.name + ` is the winner`);
    recordCalculation();
    currentPlayer.win++;
    document.getElementById("players").innerText=`${p1.name}:  ${p1.win} |  ${p2.name}:  ${p2.win}`;

}

function recordCalculation() {

    if (currentPlayer.record < record)
        record = currentPlayer.record;

    document.getElementById("showRecord").innerText=`${currentPlayer.name} win with ${currentPlayer.record} steps`;

}

function ShowRecord() {

    document.getElementById("showRecord").innerText=`The record is ${record} steps`;

}


function changePlayer() {
    currentPlayer = currentPlayer == p2 ? p1 : p2;
}


function checksWin(index) {

    let comb = combinations.filter(cmb => cmb.includes(index))
    for (cmb of comb) {
        if (cmb.every(p => board[p] == currentPlayer.shape))
            return true;
    }
}

function creatCombinations(num) {

    let arrCombinations = [];
    let row=[],col=[],slantR=[],slantL=[];
    let counterRow = 0, counterCol = 0,  counterSlantR = 0 ,counterSlantL = num - 1;

    for (i = 0; i < num; i++) {
        counterCol = i;
        for (j = 0; j < num; j++) {
            row.push(counterRow);
            col.push(counterCol);

            counterRow++;
            counterCol = counterCol + num;
        }
        slantR.push(counterSlantR);
        counterSlantR = counterSlantR + num + 1;

        slantL.push(counterSlantL);
        counterSlantL = counterSlantL + num - 1;

        arrCombinations.push(row)
        arrCombinations.push(col)

        row = [];
        col = [];

    }
    arrCombinations.push(slantR);
    arrCombinations.push(slantL);

    //console.log(arrCombinations);
    return arrCombinations;
}


function clear() {
    for (i of players)
        i.record = 0;
    xo.innerHTML = ``;
    while (board.length)
        board.pop();
    while (indexStep.length)
        indexStep.pop();
}

function changeSize() {

    let size = prompt("enter a new size");
    buildsGameBoard(size);
    combinations = creatCombinations(Number(size));
    startGame();

}

function saveGame() {
    localStorage.db = JSON.stringify(board);
    localStorage.saveStap = JSON.stringify(indexStep);
}

function loadGame() {

    if (Math.sqrt(getBordFromeDb().length) <= 3)
        buildsGameBoard(defult);
    else
        buildsGameBoard(Math.sqrt(getBordFromeDb().length));

    indexStep = getStepsFromeDb();
    board = getBordFromeDb();


    for (i in indexStep) {

        let styleBox = getPlayerByShape(board[indexStep[i]]).style;
        document.getElementById(`box${indexStep[i]}`).classList.add(styleBox);

    }

    startGame();
}

function getBordFromeDb() {
    return JSON.parse(localStorage.db);
}

function getStepsFromeDb() {
    return JSON.parse(localStorage.saveStap);
}

function deleteLastStep() {

    if (indexStep.length == 0)
        return;

    changePlayer()
    board[(indexStep[indexStep.length - 1])] = undefined; // remove from board
    document.getElementById(`box${indexStep[indexStep.length-1]}`).classList = []

    indexStep.pop(); //remove from steps

}

var second = 0;
var idTime;
var minute=0;
var timer_is_on = 0;

function startCount()
{
    if (!timer_is_on) 
    {
        timer_is_on = 1;
        timedCount();
    }
}

function timedCount() 
{
    time.innerText =`${minute}:${second}`;
    second = second + 1;
    if(second==60)
    {
        second=0;
        minute=minute+1;
    }
    idTime = setTimeout(timedCount, 1000); //מפעיל פונקציה פעם אחת לאחר מרווח זמן
}




function stopCount() {
    minute=0,second=0;
    clearTimeout(idTime); //מבטל את הזמן
    timer_is_on = 0;
    time.innerText = "";
}


/*דקה 60000 שנייה -1000ק*/
/*set interval-מפעיל פונקציה שוב ושוב ולאחר מרווח זמן  */

/*function displayStatusGame() {
    arrDiv.forEach((i, index) => {
        if (board[index].value != "") {
            console.log("hy");
            if (board[index].value == "x")
                i.setAttribute("style", " background-image: url(x.JPG);")
            else
                i.setAttribute("style", " background-image: url(o.jpg);")
        } else
            i.innerHTML = board[index].value;

    })

}*/


/*function validation(index) {
    if (indexStep.length >= board.length) {
        alert("game over");
        stopCount();
        return false;
    }
    if (board[index].value != "") {
        alert("The square is full");
        return false;
    } else
        return true;

}*/


/*function displayBord(num) {
    for (i = 0; i < num; i++) {
        xo.innerHTML += `<div id="line${i}" class="flex-container">`;
        for (j = 0; j < num; j++) {
            document.getElementById(i).innerHTML += `<div id="box${i}${j}"></div>`;
            board.push(square(i, j));
        }
        xo.innerHTML += `</div>`;
    }

}*/

/*function square(x, y, value = "") {

    return {
        x,
        y,
        value
    }
};*/

//let arrDiv = [];

// displayBord(num);
//arrDiv = document.querySelectorAll(".flex-container > div")
// console.log(board);


 /* console.log(arrDiv);
     arrDiv.forEach((i, index) => {
         i.addEventListener
     })*/