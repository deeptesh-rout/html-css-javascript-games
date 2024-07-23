const countries = [
    { name: "France", flag: "https://flagcdn.com/fr.svg" },
    { name: "Germany", flag: "https://flagcdn.com/de.svg" },
    { name: "Italy", flag: "https://flagcdn.com/it.svg" },
    { name: "Japan", flag: "https://flagcdn.com/jp.svg" },
    { name: "Brazil", flag: "https://flagcdn.com/br.svg" },
    { name: "United States", flag: "https://flagcdn.com/us.svg" },
    { name: "Canada", flag: "https://flagcdn.com/ca.svg" },
    { name: "United Kingdom", flag: "https://flagcdn.com/gb.svg" },
    { name: "Australia", flag: "https://flagcdn.com/au.svg" },
    { name: "China", flag: "https://flagcdn.com/cn.svg" },
    { name: "India", flag: "https://flagcdn.com/in.svg" },
    { name: "Mexico", flag: "https://flagcdn.com/mx.svg" },
    { name: "Russia", flag: "https://flagcdn.com/ru.svg" },
    { name: "South Africa", flag: "https://flagcdn.com/za.svg" },
    { name: "Argentina", flag: "https://flagcdn.com/ar.svg" },
    { name: "South Korea", flag: "https://flagcdn.com/kr.svg" },
    { name: "Nigeria", flag: "https://flagcdn.com/ng.svg" },
    { name: "Egypt", flag: "https://flagcdn.com/eg.svg" },
    { name: "Spain", flag: "https://flagcdn.com/es.svg" },
    { name: "Portugal", flag: "https://flagcdn.com/pt.svg" },
    { name: "Netherlands", flag: "https://flagcdn.com/nl.svg" },
    { name: "Sweden", flag: "https://flagcdn.com/se.svg" },
    { name: "Norway", flag: "https://flagcdn.com/no.svg" },
    { name: "Greece", flag: "https://flagcdn.com/gr.svg" },
    { name: "Turkey", flag: "https://flagcdn.com/tr.svg" },
    { name: "Saudi Arabia", flag: "https://flagcdn.com/sa.svg" },
    { name: "New Zealand", flag: "https://flagcdn.com/nz.svg" },
    { name: "Switzerland", flag: "https://flagcdn.com/ch.svg" },
    { name: "Poland", flag: "https://flagcdn.com/pl.svg" },
    { name: "Ukraine", flag: "https://flagcdn.com/ua.svg" },
    { name: "Malaysia", flag: "https://flagcdn.com/my.svg" },
    { name: "Thailand", flag: "https://flagcdn.com/th.svg" },
    { name: "Vietnam", flag: "https://flagcdn.com/vn.svg" },
    { name: "Indonesia", flag: "https://flagcdn.com/id.svg" },
    { name: "Philippines", flag: "https://flagcdn.com/ph.svg" },
    { name: "Pakistan", flag: "https://flagcdn.com/pk.svg" },
    { name: "Bangladesh", flag: "https://flagcdn.com/bd.svg" },
    { name: "Iran", flag: "https://flagcdn.com/ir.svg" },
    { name: "Iraq", flag: "https://flagcdn.com/iq.svg" },
    { name: "Israel", flag: "https://flagcdn.com/il.svg" },
    { name: "Cuba", flag: "https://flagcdn.com/cu.svg" },
    { name: "Venezuela", flag: "https://flagcdn.com/ve.svg" },
    { name: "Colombia", flag: "https://flagcdn.com/co.svg" },
    { name: "Peru", flag: "https://flagcdn.com/pe.svg" },
    { name: "Chile", flag: "https://flagcdn.com/cl.svg" },
    { name: "Morocco", flag: "https://flagcdn.com/ma.svg" },
    { name: "Algeria", flag: "https://flagcdn.com/dz.svg" },
    { name: "Ethiopia", flag: "https://flagcdn.com/et.svg" },
    { name: "Kenya", flag: "https://flagcdn.com/ke.svg" },
    { name: "Tanzania", flag: "https://flagcdn.com/tz.svg" },
    { name: "Uganda", flag: "https://flagcdn.com/ug.svg" },
    { name: "Austria", flag: "https://flagcdn.com/at.svg" },
    { name: "Belgium", flag: "https://flagcdn.com/be.svg" },
    { name: "Finland", flag: "https://flagcdn.com/fi.svg" },
    { name: "Denmark", flag: "https://flagcdn.com/dk.svg" },
    { name: "Ireland", flag: "https://flagcdn.com/ie.svg" },
    { name: "Singapore", flag: "https://flagcdn.com/sg.svg" },
    { name: "Sri Lanka", flag: "https://flagcdn.com/lk.svg" },
    { name: "Nepal", flag: "https://flagcdn.com/np.svg" },
    { name: "Bhutan", flag: "https://flagcdn.com/bt.svg" },
    { name: "Maldives", flag: "https://flagcdn.com/mv.svg" },
    { name: "Afghanistan", flag: "https://flagcdn.com/af.svg" },
    { name: "Kazakhstan", flag: "https://flagcdn.com/kz.svg" },
    { name: "Uzbekistan", flag: "https://flagcdn.com/uz.svg" },
    { name: "Turkmenistan", flag: "https://flagcdn.com/tm.svg" },
    { name: "Kyrgyzstan", flag: "https://flagcdn.com/kg.svg" },
    { name: "Tajikistan", flag: "https://flagcdn.com/tj.svg" },
    { name: "Mongolia", flag: "https://flagcdn.com/mn.svg" },
    { name: "Myanmar", flag: "https://flagcdn.com/mm.svg" },
    { name: "Cambodia", flag: "https://flagcdn.com/kh.svg" },
    { name: "Laos", flag: "https://flagcdn.com/la.svg" },
    { name: "Brunei", flag: "https://flagcdn.com/bn.svg" },
    { name: "Papua New Guinea", flag: "https://flagcdn.com/pg.svg" },
    { name: "Fiji", flag: "https://flagcdn.com/fj.svg" },
    { name: "Samoa", flag: "https://flagcdn.com/ws.svg" },
    { name: "Solomon Islands", flag: "https://flagcdn.com/sb.svg" },
    { name: "Vanuatu", flag: "https://flagcdn.com/vu.svg" },
    { name: "Tonga", flag: "https://flagcdn.com/to.svg" },
    { name: "Micronesia", flag: "https://flagcdn.com/fm.svg" },
    { name: "Marshall Islands", flag: "https://flagcdn.com/mh.svg" },
    { name: "Palau", flag: "https://flagcdn.com/pw.svg" },
    { name: "Kiribati", flag: "https://flagcdn.com/ki.svg" },
    { name: "Nauru", flag: "https://flagcdn.com/nr.svg" },
    { name: "Tuvalu", flag: "https://flagcdn.com/tv.svg" }
];

let currentCountryIndex = 0;
let currentScore = 0;

document.addEventListener('DOMContentLoaded', () => {
    const flagElement = document.getElementById('country-flag');
    const guessInput = document.getElementById('guess');
    const submitGuessButton = document.getElementById('submitGuess');
    const resultElement = document.getElementById('result');
    const nextCountryButton = document.getElementById('nextBtn');
    const emptyErrorVal = document.querySelector("#empty-error");
    const userScoreVal = document.querySelector("#user-score-val")
    userScoreVal.textContent = currentScore;

    function showCountry(index) {
        flagElement.src = countries[index].flag;
        guessInput.value = '';
        resultElement.textContent = '';
        emptyErrorVal.textContent = '';
    }

    function checkGuess() {
        const userGuess = guessInput.value.trim().toLowerCase();
        const correctAnswer = countries[currentCountryIndex].name.toLowerCase();
        if (userGuess === correctAnswer) {
            resultElement.textContent = 'Correct!';
            resultElement.style.color = 'green';
            currentScore += 10;
            userScoreVal.textContent = currentScore;
            nextCountry();
        } else {
            resultElement.textContent = `Wrong! The correct answer is ${countries[currentCountryIndex].name}.`;
            resultElement.style.color = 'red';
        }

    }

    function nextCountry() {
        currentCountryIndex = (currentCountryIndex + 1) % countries.length;
        showCountry(currentCountryIndex);
    }

    submitGuessButton.addEventListener('click', () => {
        if (guessInput.value == "") {
            emptyErrorVal.textContent = "Input field cannot be empty";
        } else {
            checkGuess();
            emptyErrorVal.textContent = "";
        }
    });

    guessInput.addEventListener('keyup', (e) => {
        if (e.key === 'Enter') {
            if (guessInput.value == "") {
                emptyErrorVal.textContent = "Input field cannot be empty";
            } else {
                checkGuess();
                emptyErrorVal.textContent = "";
            }
        }
    });
    
    nextCountryButton.addEventListener('click', nextCountry);

    // Show the first country on page load
    showCountry(currentCountryIndex);
});
