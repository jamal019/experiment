let currentRound = 0;
let userResponses = [];
let timerInterval;

const rounds = [
    { words: ['Hose', 'Schnitt', 'Größe'], expected: ['Hose'] },
    { words: ['McDonalds', 'Ernährung', 'Gastronomie', 'Bestellung', 'Kalorien'], expected: ['McDonalds'] },
    { words: ['Fußball', 'Kondition', 'Protein', 'Geschwindigkeit', 'Niederlage', 'Wettkampf', 'Motivation'], expected: ['Fußball'] },
    { words: ['Gitarre', 'Dirigent', 'Stimme', 'Rythmus', 'Melodie', 'G-Dur', 'Epoche', 'Akkord', 'Resonanz'], expected: ['Gitarre', 'Dirigent'] },
    { words: ['Flugzeug', 'Koffer', 'Freiheit', 'Fernweh', 'Erholung', 'Sightseeing', 'Erlebnis', 'Abenteuer', 'Kultur', 'Buchung', 'Klima'], expected: ['Flugzeug', 'Koffer'] },
    { words: ['Schule', 'Bücher', 'Lehrer', 'Bildung', 'Wissen', 'Forschung', 'Abschluss', 'Lernen', 'Pädagogik', 'Unterricht', 'Theorie', 'Bachelor', 'Master'], expected: ['Schule', 'Bücher', 'Lehrer'] },
    { words: ['König', 'Pyramide', 'Abraham Lincoln', 'Epoche', 'Zeitrechnung', 'Jahrhundert', 'Revolution', 'Dynastie', 'Renaissance', 'Monarchie', 'Historie', 'Qual', 'Feindschaft', 'Alliierte', 'Verbündete'], expected: ['König', 'Pyramide', 'Abraham Lincoln'] },
    { words: ['Media Markt', 'iPhone', 'Google', 'Sicherheit', 'Daten', 'WLAN', 'Hotspot', 'Digitalisierung', 'Cloud', 'Algorithmus', 'Informatik', '5G', 'Krypto', 'Big Data', 'Machine Learning', 'Künstliche Intelligenz', 'Account'], expected: ['Media Markt', 'iPhone', 'Google'] },
    { words: ['Angela Merkel', 'Bundestag', 'AFD', 'Barack Obama', 'Demokratie', 'Anarchie', 'Konservativ', 'Liberal', 'Gewaltenteilung', 'Ideologie', 'Extremismus', 'Legislaturperiode', 'Diplomatie', 'Gesetzgebung', 'DSGVO', 'Exekutive', 'Legislative', 'Gegner', 'Offensive'], expected: ['Angela Merkel', 'Bundestag', 'AFD', 'Barack Obama'] },
    { words: ['Bakterien', 'Albert Einstein', 'Charles Darwin', 'Vulkan', 'Protonen', 'Elektronen', 'Temperatur', 'Versuch', 'Element', 'Gravitation', 'Klima', 'Forschung', 'Leben', 'Erkenntnis', 'Untersuchung', 'Relativität', 'Theorie', 'Entropie', 'Photosynthese', 'Kernschmelze', 'Wissenschaft'], expected: ['Bakterien', 'Albert Einstein', 'Charles Darwin', 'Vulkan'] }
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
    nextRound();
}

function startTimer(duration, display) {
    clearInterval(timerInterval);  // Vorherigen Timer stoppen
    let timeLeft = duration;

    timerInterval = setInterval(() => {
        display.textContent = "Verbleibende Zeit: " + timeLeft + "s";
        timeLeft--;

        if (timeLeft < 0) {
            clearInterval(timerInterval);
            display.textContent = "Verbleibende Zeit: 0s";
        }
    }, 1000);
}

function nextRound() {
    // Wortliste und Timer anzeigen
    document.getElementById("wordDisplay").style.display = "block";
    document.getElementById("timer").style.display = "block";
    document.getElementById("wordList").style.display = "block"; // Diese Zeile hinzufügen
    
    if (currentRound >= rounds.length) {
        endExperiment();
        return;
    }

    const round = rounds[currentRound];
    shuffle(round.words);
    const wordList = document.getElementById("wordList");
    wordList.innerHTML = round.words.map(word => `<li>${word}</li>`).join('');

    let timeLeft = 10;  // Startzeit

    timerInterval = setInterval(() => {
        document.getElementById("timer").textContent = "Verbleibende Zeit: " + timeLeft + "s";
        timeLeft--;

        // Wenn der Timer abgelaufen ist
        if (timeLeft < 0) {
            clearInterval(timerInterval);  // Timer stoppen
            document.getElementById("timer").textContent = "Verbleibende Zeit: 0s";
            document.getElementById("timer").style.display = "none";  // Timer ausblenden
            wordList.style.display = "none";  // Wortliste ausblenden
            document.getElementById("wordInput").style.display = "block";
            document.getElementById("wordResponse").value = '';  // Eingabefeld leeren
        }
    }, 1000);
}

function submitResponse() {
    const userWord = document.getElementById("wordResponse").value;
    const isExpected = rounds[currentRound].expected.includes(userWord);
    userResponses.push({ response: userWord, correct: isExpected });
    currentRound++;
    document.getElementById("wordResponse").value = ""; // Eingabefenster leeren
    document.getElementById("wordInput").style.display = "none";
    nextRound();
}

function endExperiment() {
    document.getElementById("wordDisplay").style.display = "none";
    document.getElementById("endMessage").style.display = "block";
}

function downloadCSV() {
    const name = document.getElementById("participantName").value;
    const age = document.getElementById("participantAge").value;

    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += "Name," + name + "\n";
    csvContent += "Alter," + age + "\n";
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