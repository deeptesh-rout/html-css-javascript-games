const cardArray = [
    {
        name: 'burger',
        img: 'images/burger.png'
    },
    {
        name: 'doughnut',
        img: 'images/doughnut.png'
    },
    {
        name: 'ice-cream',
        img: 'images/ice-cream.png'
    },
    {
        name: 'ice-cream-2',
        img: 'images/ice-cream-2.png'
    },
    {
        name: 'ice-cream-3',
        img: 'images/ice-cream-3.png'
    },
    {
        name: 'ketchup',
        img: 'images/ketchup.png'
    },
    {
        name: 'pineapple',
        img: 'images/pineapple.png'
    },
    {
        name: 'pizza',
        img: 'images/pizza.png'
    },
    {
        name: 'strawberry',
        img: 'images/strawberry.png'
    },
    {
        name: 'watermelon',
        img: 'images/watermelon.png'
    },
];


let cardSpawner = () => {
    let index = 0;
    const numberOfCards = 20;
    for(let i=0;i<numberOfCards;i++){
        const max = 9;
        let card = document.createElement('div');
        card.className = 'card-wrapper';
        card.setAttribute('data-name',cardArray[index].name);
        card.innerHTML = `<div class="card-front"><img src="${cardArray[index].img}"></div><div class="card-back"></div>`;
        document.getElementById('grid').appendChild(card);
        index++;
        if(index>9){index=0};
    }
}

cardSpawner();





//Timer function

let timerWin = false;
let timeLimit = 59; //time limit in seconds

let timer = () => {
    let mil = 0;
    let sec = 0;
    let timeRemaining = 0;
    
    let interval = setInterval(() => {
        mil+=10;
        if(mil==1000){
            mil=0;
            sec++;
        }
        timeRemaining = timeLimit-sec;
        if(timeRemaining==0||timerWin==true){
            clearInterval(interval);
            youLoose();
        }
        document.getElementById('time').innerHTML = `Time:<br>${timeRemaining}:${mil/10}`
    },10);
}




//Main gameplay logic

let hasFlipped = false;
let lockBoard = false;
let firstCard, secondCard;
const cardsList = document.querySelectorAll('.card-wrapper');

function flipCard(){
    if(lockBoard) return;
    if(this === firstCard) return;

    this.classList.add('flip');

    if(!hasFlipped){
        hasFlipped = true;
        firstCard = this;
    }
    else{
        hasFlipped = false;
        secondCard = this;

        checkForMatch();
    }

    let count = 0;
    for(let i=0;i<cardsList.length;i++){
        if(cardsList[i].classList.contains('flip')){
            count++;
        }
    }

    if(count==cardsList.length){
        setTimeout(() => {
            youWin();
        },500);
    }
}

let checkForMatch = () => {
    firstCard.dataset.name === secondCard.dataset.name ? disableCards() : unflipCards();
}

let disableCards = () => {
    firstCard.removeEventListener('click',flipCard);
    secondCard.removeEventListener('click',flipCard);
}

let unflipCards = () => {
    lockBoard = true;
    setTimeout(() => {
        firstCard.classList.remove('flip');
        secondCard.classList.remove('flip');
        
        resetBaord();
    },700)
}

let resetBaord = () => {
    hasFlipped = false;
    lockBoard = false;
    firstCard = null;
    secondCard = null;
}


let youWin = () => {
    console.log('you win');
    document.getElementById('you-win').style.display = 'flex'
    timerWin = true;
}

let youLoose = () => {
    console.log('you loose');
    document.getElementById('you-loose').style.display = 'flex'
}


//Function to shuffle the cards each time the webpage is reloaded
(function shuffle (){
    cardsList.forEach(cardsList => {
        let randomPos = Math.floor(Math.random()*20);
        cardsList.style.order = randomPos;
    });
})();


cardsList.forEach(cardsList => cardsList.addEventListener('click',flipCard));


//Function to start the game
function play(){
    document.getElementById('welcome-screen').style.display = 'none';
    timer();
}