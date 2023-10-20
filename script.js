let currentRound = 0;
let userResponses = [];
let timerInterval;

const rounds = [
    { words: ['McDonalds', 'Pizza', 'Ernährung', 'Gastronomie', 'Bestellung', 'Kalorien', 'Nährwerte'], expected: ['McDonalds', 'Pizza'] },
    { words: ['Fußball', 'Hantel', 'Kondition', 'Protein', 'Geschwindigkeit', 'Motivation', 'Aminosäure'], expected: ['Fußball', 'Hantel'] },
    { words: ['Schule', 'Lehrer', 'Bildung', 'Forschung', 'Abschluss', 'Pädagogik', 'Master'], expected: ['Schule', 'Lehrer'] },
    { words: ['Media Markt', 'iPhone', 'Digitalisierung', 'Künstliche Intelligenz', 'Algorithmus', 'Big Data', 'Machine Learning'], expected: ['Media Markt', 'iPhone'] },
    { words: ['Angela Merkel', 'Reichstag', 'Demokratie', 'Anarchie', 'Legislaturperiode', 'Diplomatie', 'Exekutive'], expected: ['Angela Merkel', 'Reichstag'] },
];

function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

function startExperiment() {
    document.getElementById("welcomeMessage").style.display = "none";
    document.getElementById("intro").style.display = "block";
}

function beginTrials() {
    document.getElementById("intro").style.display = "none";
    showWords();
}

function showWords() {
    const round = rounds[currentRound];
    shuffle(round.words);

    let wordIndex = 0;
    timerInterval = setInterval(() => {
        if (wordIndex >= round.words.length) {
            clearInterval(timerInterval);
            document.getElementById("wordInput").style.display = "block";
            document.getElementById("wordResponse").value = '';
            return;
        }
        
        const wordList = document.getElementById("wordList");
        wordList.textContent = round.words[wordIndex];
        wordIndex++;
    }, 1000);
}

function submitResponse() {
    const userWord = document.getElementById("wordResponse").value;
    const isExpected = rounds[currentRound].expected.includes(userWord);
    userResponses.push({ response: userWord, correct: isExpected });
    currentRound++;
    document.getElementById("wordResponse").value = "";
    document.getElementById("wordInput").style.display = "none";
    if (currentRound < rounds.length) {
        showWords();
    } else {
        endExperiment();
    }
}

function endExperiment() {
    document.getElementById("endMessage").style.display = "block";
}

function downloadCSV() {
    const id = document.getElementById("participantID").value;
    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += "ID," + id + "\n";
    csvContent += "Runde,Antwort,Korrekt\n";

    userResponses.forEach((response, index) => {
        csvContent += (index+1) + "," + response.response + "," + response.correct + "\n";
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "experiment_ergebnisse.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}
