var mistakeCounter = 0;
var selectedWords = [];
var startTime;
var elapsedTime = 0;
var timerInterval;

var groupings = {
    'Category 1': ['Word 1', 'Word 2', 'Word 3', 'Word 4'],
    'Category 2': ['Word 5', 'Word 6', 'Word 7', 'Word 8'],
    'Category 3': ['Word 9', 'Word 10', 'Word 11', 'Word 12'],
    'Category 4': ['Word 13', 'Word 14', 'Word 15', 'Word 16']
}

var categories = Object.keys(groupings);

var wordToCategory = new Map();

function initialiseWords() {
    var wordElements = Array.from(document.querySelectorAll('.word'));
    var wordTexts = Object.values(groupings).flat();

    for (var i = 0; i < categories.length; i++) {
        var words = groupings[categories[i]]
        for (var j = 0; j < words.length; j++) {
            wordToCategory.set(words[j], categories[i]);
        }
    }
    
    shuffle(wordTexts);

    for (var i = 0; i < wordElements.length; i++) {
        wordElements[i].textContent = wordTexts[i]
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
        selectedWords = selectedWords.filter(word => word !== element);
        document.getElementById('submitBtn').disabled = true;

    } else if (selectedWords.length < 4) {
        element.classList.add('selected');
        selectedWords.push(element);
        if (selectedWords.length === 4) {
            document.getElementById('submitBtn').disabled = false;
        }
    }
}

function submitWords() {
    if (selectedWords.length === 4) {
        var category = wordToCategory.get(selectedWords[0].textContent);
        var sameCategory = selectedWords.every(word => wordToCategory.get(word.textContent) === category);
        if (sameCategory) {
            replaceWithGroupElement(category);
        } else {
            mistakeCounter++;
            for (var i = 0; i < selectedWords.length; i++) {
                selectedWords[i].classList.remove('selected');
            }
        }
        
        selectedWords = [];
        document.getElementById('submitBtn').disabled = true;
        document.getElementById('mistakeCounter').textContent = mistakeCounter;
        
        if (document.querySelectorAll('.group-element').length === 4) {
            stopTimer();
        }
    }
}

function replaceWithGroupElement(category) {
    var words = [];
    for (var i = 0; i < selectedWords.length; i++) {
            words.push(selectedWords[i].textContent);
            selectedWords[i].remove();
    }

    var index = categories.indexOf(category);
    
    var grid = document.querySelector('.grid');
    var groupElement = document.createElement('div');
    groupElement.classList.add('group-element');
    groupElement.textContent = `${category}: ${words.join(', ')}`;
    groupElement.setAttribute('category', index);
    grid.appendChild(groupElement);
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

initialiseWords();
startTimer();
