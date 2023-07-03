var selectedCount = 0;
var mistakeCounter = 0;
var selectedWords = [];
var startTime;
var elapsedTime = 0;
var timerInterval;
var words = [];
var answers = new Map();

answers.set('Word 1', '1')
answers.set('Word 2', '1')
answers.set('Word 3', '1')
answers.set('Word 4', '1')

answers.set('Word 5', '2')
answers.set('Word 6', '2')
answers.set('Word 7', '2')
answers.set('Word 8', '2')

answers.set('Word 9', '3')
answers.set('Word 10', '3')
answers.set('Word 11', '3')
answers.set('Word 12', '3')

answers.set('Word 13', '4')
answers.set('Word 14', '4')
answers.set('Word 15', '4')
answers.set('Word 16', '4')

function initializeWords() {
    words = Array.from(document.querySelectorAll('.word'));
    var grid = document.querySelector('.grid');

    var answerKeys = answers.keys();
    
    for (var i = 0; i < words.length; i++) {
        words[i].textContent = answerKeys.next().value;
    }

    shuffle(words);

    for (var i = 0; i < words.length; i++) {
        grid.appendChild(words[i]);
    }
}

function shuffle(array) {
    for (var i = array.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
}

function handleClick(element) {
    if (element.classList.contains('solved')) {
        return; // Ignore already solved words
    }
    
    if (element.classList.contains('selected')) {
        element.classList.remove('selected');
        selectedCount--;
        selectedWords = selectedWords.filter(word => word !== element);
        document.getElementById('submitBtn').disabled = true;

    } else if (selectedCount < 4) {
        element.classList.add('selected');
        selectedCount++;
        selectedWords.push(element);
        if (selectedCount === 4) {
            document.getElementById('submitBtn').disabled = false;
        }
    }
}

function submitWords() {
    if (selectedCount === 4) {
        var category = answers.get(selectedWords[0].textContent);
        var sameCategory = selectedWords.every(word => answers.get(word.textContent) === category);
        if (sameCategory) {
            for (var i = 0; i < selectedWords.length; i++) {
                selectedWords[i].classList.remove('selected');
                selectedWords[i].classList.add('solved');
                selectedWords[i].setAttribute('data-category', category);
            }
            reorderGrid();
        } else {
            mistakeCounter++;
            for (var i = 0; i < selectedWords.length; i++) {
                selectedWords[i].classList.remove('selected');
            }
        }
        
        selectedCount = 0;
        selectedWords = [];
        document.getElementById('submitBtn').disabled = true;
        document.getElementById('mistakeCounter').textContent = mistakeCounter;
        
        if (document.querySelectorAll('.solved').length === 16) {
            stopTimer();
        }
    }
}

function reorderGrid() {
    var grid = document.querySelector('.grid');
    var solvedWords = document.querySelectorAll('.solved');
    if (solvedWords.length > 0) {
        solvedWords.forEach(word => grid.appendChild(word));
    }
}

function startTimer() {
    startTime = Date.now();
    timerInterval = setInterval(updateTimer, 1000);
}

function updateTimer() {
    var currentTime = Date.now();
    elapsedTime = Math.floor((currentTime - startTime) / 1000);
    document.getElementById('timer').textContent = elapsedTime;
}

function stopTimer() {
    clearInterval(timerInterval);
}

initializeWords();
startTimer();
