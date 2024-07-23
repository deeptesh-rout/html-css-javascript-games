let hands = [
	{
		hand: 'Rock',
		address: 'images/rock.png',
	},
	{
		hand: 'Paper',
		address: 'images/paper.png',
	},
	{
		hand: 'Scissor',
		address: 'images/scissors.png',
	},
];

let buttons = document.querySelectorAll('.player-option');

let player = document.getElementById('player-hand');
let computer = document.getElementById('computer-hand');

let displayPlayerScore = document.getElementById('player-score');
let displayComputerScore = document.getElementById('computer-score');

let playerScore = 0;
let computerScore = 0;

buttons.forEach(e => {
	e.addEventListener('click', playGame);
});

function playGame() {
	buttons.forEach(e => {
		e.removeEventListener('click', playGame);
	});

	player.style.animation = 'shakePlayer 2s ease';
	computer.style.animation = 'shakeComputer 2s ease';

	let computerChoice = Math.floor(Math.random() * 3);
	setTimeout(() => {
		computer.src = hands[computerChoice].address;

		if (this.innerHTML === 'Rock') {
			player.src = hands[0].address;
			if (computerChoice == 2) {
				playerScore++;
			} else if (computerChoice == 1) {
				computerScore++;
			}
		} else if (this.innerHTML === 'Paper') {
			player.src = hands[1].address;
			if (computerChoice == 0) {
				playerScore++;
			} else if (computerChoice == 2) {
				computerScore++;
			}
		} else if (this.innerHTML === 'Scissor') {
			player.src = hands[2].address;
			if (computerChoice == 0) {
				computerScore++;
			} else if (computerChoice == 1) {
				playerScore++;
			}
		}

		displayPlayerScore.innerHTML = `Player: ${playerScore}`;
		displayComputerScore.innerHTML = `Computer: ${computerScore}`;

		player.style.animation = '';
		computer.style.animation = '';

		setTimeout(() => {
			player.src = hands[0].address;
			computer.src = hands[0].address;
			buttons.forEach(e => {
				e.addEventListener('click', playGame);
			});
		}, 4000);
	}, 2000);
}
