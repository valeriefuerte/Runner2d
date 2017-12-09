//Настройки игры
var levelBriefDuration = 8000;
var gameSpeed = 15;
var map  = new mapManager();
var sprite  = new spriteManager();
var events  = new eventsManager();
var physic  = new physicManager();
var game  = new gameManager();
var hud  = new hudManager();
var audio  = new audioManager();
var score = new scoreManager();

function getCurrentContext() { return context; }
function getCurrentCanvas() { return canvas; }
function getEventsManager() { return events; }
function getSpriteManager() { return sprite; }
function getGameManager() { return game; }
function getPhysicManager() { return physic; }
function getMapManager() { return map; }
function getHudManager() { return hud; }
function getAudioManager() { return audio; }
function getScoreManager() { return score; }

function completedLevel(l) { //конец уровня и переход к следующему
    startLevel(l + 1);
}

function startLevel(lvl) { //уровень
    if(lvl < gameScenes.length) {
        getAudioManager().stopAll();
        getAudioManager().play(gameScenes[lvl].music, { looping: true });
        getAudioManager().filter.frequency.value = getAudioManager().lowFrequency;

        getScoreManager().currentLevel = lvl;
        getScoreManager().save();

        getGameManager().clearScreen();
        getHudManager().drawHero(gameScenes[lvl].hero);
        getHudManager().drawTitleText(gameScenes[lvl].title);
        getHudManager().drawSubtitleText(gameScenes[lvl].subtitle);


        setTimeout( () => {
            getAudioManager().frequencyRamp(getAudioManager().defaultFrequency, 1);
            getGameManager().loadScene(gameScenes[lvl]);
        }, levelBriefDuration);

    } else {

        let totalScore = 0;
        for(let s of getScoreManager().storage) {
            totalScore += s.score;
        }

        getScoreManager().save();

        getGameManager().clearScreen();
        getHudManager().drawHero('endlevel');
        getHudManager().drawTitleText('Игра закончена!');
        getHudManager().drawSubtitleText('Ваш счет: ${totalScore}');

    }
}

// Загрузка ресурсов игры
function resourcesLoaded() {
    // Начало игры
    setTimeout( () => { startLevel(getScoreManager().currentLevel) }, 100 );
    console.log('loaded all');
}

function storageAvailable(type) {
    try {
        var storage = window[type],
            x = '__storage_test__';
        storage.setItem(x, x);
        storage.removeItem(x);
        return true;
    }
    catch(e) {
        return e instanceof DOMException && (
            e.code === 22 ||
            e.code === 1014 ||
            e.name === 'QuotaExceededError' ||
            e.name === 'NS_ERROR_DOM_QUOTA_REACHED') &&

            storage.length !== 0;
    }
}

function div(val, by){
    return (val - val % by) / by;
}
//Таблица рекордов
function scoreboard(scoreTable) {
    let scoreboardElement = document.getElementById('scoreboard');
    let scoreboardTextElement = document.getElementById('scoreboard-text');

    if(scoreTable) {
        scoreboardTextElement.innerHTML = '';
        scoreboardElement.style.display = 'block';

        for(let i = 0; i < gameScenes.length; i++) {
            scoreboardTextElement.innerHTML += (`<b>${gameScenes[i].title}</b><br />`);
            scoreboardTextElement.innerHTML += (`Убито: ${getScoreManager().storage[i].killed}<br />`);
            scoreboardTextElement.innerHTML += (`Потрачено: ${getScoreManager().storage[i].fired}<br />`);
            scoreboardTextElement.innerHTML += (`Время: ${getScoreManager().getTimeString(getScoreManager().storage[i].time)}<br />`);
            scoreboardTextElement.innerHTML += (`Счет: ${getScoreManager().storage[i].total}<br /><br />`);
        }
    } else {
        scoreboardElement.style.display = 'none';
    }
}


function launch() {
        getScoreManager().load();
        getGameManager().loadResources();
        document.getElementById('overlay').style.display = 'none';
}
