class scoreManager {
    constructor() {

        this.storage = [];
        this.clearAll();
        this.load();

        this.tempTimer = 0;

        this.pauseTimer = 0;
    }

    clearCurrentRecording() {
        this.storage[this.currentLevel].score = 0;
        this.storage[this.currentLevel].killed = 0;
        this.storage[this.currentLevel].fired = 0;
        this.storage[this.currentLevel].time = 0;
        this.storage[this.currentLevel].total = 0;
    }

    enemyKilled(hardness) {
        this.storage[this.currentLevel].score += Math.floor(200 * hardness);
        this.storage[this.currentLevel].killed++;
    }

    shotFired() {
        this.storage[this.currentLevel].fired++;
    }

    currentScore() {
        return this.storage[this.currentLevel].score;
    }

    currentShots() {
        return this.storage[this.currentLevel].fired;
    }

    currentKills() {
        return this.storage[this.currentLevel].killed;
    }

    startTimer() {
        this.tempTimer = Date.now();
    }

    // timerPause() {
    //     this.pauseTimer = Date.now();
    // }
    //
    // timerUnpause() {
    //     let pause = Date.now() - this.pauseTimer;
    //     this.tempTimer += pause;
    //     this.pauseTimer = 0;
    // }

    recordTime() {
        this.storage[this.currentLevel].time = this.currentTime();
    }

    getCurrentTime() {
        return this.storage[this.currentLevel].time;
    }

    currentTime() {
        return Date.now() - this.tempTimer;
    }

    calculateTotal() {
        this.storage[this.currentLevel].total = this.storage[this.currentLevel].score + this.getCurrentAmmoBonus() + this.getCurrentTimeBonus();
    }

    getCurrentTotalScore() {
        return this.storage[this.currentLevel].total;
    }

    getCurrentAmmoBonus() {
        if(this.currentKills() > this.currentShots()) {
            return 0;
        }

        return  Math.floor(500 / (this.currentShots() / (this.currentKills()*1.0)));
    }

    getCurrentTimeBonus() {
        return  Math.floor(300 / ( div(this.getCurrentTime(), 100) / 40 ));
    }

    clearAll() {
        this.storage = [];

        for(let i = 0; i < gameScenes.length; i++) {
            this.storage[i] = {};
            this.storage[i].score = 0;
            this.storage[i].killed = 0;
            this.storage[i].fired = 0;
            this.storage[i].time = 0;
            this.storage[i].total = 0;
        }

        this.currentLevel = 0;
    }

    save() {
        if(storageAvailable('localStorage')) {
            localStorage.setItem('score_data', JSON.stringify(this.storage));
       //     localStorage.setItem('current_level', this.currentLevel);
        }
    }

    load() {
        if(storageAvailable('localStorage')) {
            let scoreData = localStorage.getItem('score_data');
            let currentLevel = localStorage.getItem('current_level');
            if(scoreData !== null && currentLevel !== null) {
                this.storage = JSON.parse(scoreData);
                this.currentLevel = currentLevel * 1;
            }
        }
    }

    getTimeString(ms) {
        let timePassed = div( ms, 1000 );

        let hours = div( timePassed, 3600 );
        timePassed -= (3600 * hours);
        let minutes = div( timePassed, 60 );
        if(minutes < 10) minutes = '0' + minutes;
        timePassed -= (60 * minutes);
        if(timePassed < 10) timePassed = '0' + timePassed;

        if(hours > 0) {
            return `${hours}:${minutes}:${timePassed}`;
        } else {
            return `${minutes}:${timePassed}`;
        }
    }

    clearSaves() {
        if(storageAvailable('localStorage')) {
            localStorage.removeItem('score_data');
            localStorage.removeItem('current_level');
        }
    }
}