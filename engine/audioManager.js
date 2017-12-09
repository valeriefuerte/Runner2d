class audioManager {
    constructor() {
        this.clips = {};
        this.context = null;
        this.gainNode = null;
        this.loaded = false;
        this.filter = null;
        this.defaultFrequency = 6600;
        this.lowFrequency = 150;
    }
    // инициализация менеджера звука
    init() {
        this.context = new AudioContext(); // создание контекста звука
        this.gainNode = this.context.createGain ? this.context.createGain() : this.context.createGainNode();
        this.filter = this.context.createBiquadFilter();
        this.filter.connect(this.gainNode);
        this.gainNode.connect(this.context.destination); // подключение к динамикам
        this.filter.type = "lowpass";
        this.filter.frequency.value = this.defaultFrequency;
    }
    load(path, callback) {
        if(this.clips[path]) {
            callback(this.clips[path]);
            return;
        }

        let clip = {
            path: path,
            buffer: null,
            loaded: false
        };

        clip.play = function(volume, loop) {
            getAudioManager().play(this.path, { looping: loop ? loop : false, volume: volume ? volume : 1 } );
        }

        this.clips[path] = clip;

        let request = new XMLHttpRequest(); // создание контекста звука
        request.open('GET', path, true);
        request.responseType = 'arraybuffer';
        // тип результата байты
        request.onload = function() {
            getAudioManager().context.decodeAudioData(request.response, // будет выполнена после загрузки файла в браузере
                // клип буфер хагружен
                function(buffer) {
                    clip.buffer = buffer; // звуковые эффекты
                    clip.loaded = true;
                    callback(clip);
                }
            );
        };

        request.send();
    }

    loadArray(array) {
        for(let sound of array) {

            this.load(sound, function() {

                if(array.length === Object.keys(getAudioManager().clips).length) {

                    for(let sd in getAudioManager().clips) {
                        if(!getAudioManager().clips[sd].loaded) {
                            return;
                        }
                    }
                    getAudioManager().loaded = true;
                }

            });

        }
    }

    play(path, settings) {
        if(!getAudioManager().loaded)
            return false;

        let looping = false;
        let volume = 1;

        if(settings) {
            if(settings.looping)
                looping = settings.looping; // зациклено

            if(settings.volume)
                volume = settings.volume; //громкость
        }

        let sd = this.clips[path];

        if(sd === null)
            return false;


        // новый экземпляр проигрывателя в бафферсорсе
        let sound = this.context.createBufferSource();
        sound.buffer = sd.buffer;
        sound.connect(getAudioManager().filter);
        sound.loop = looping;
        getAudioManager().gainNode.gain.value = volume;
        sound.start(0);
        return true;

    }

    playWorldSound(path, x, y) {
        if(getGameManager().player === null) {
            return;
        }

        // определяем расстояние до источника звука

        let viewSize = Math.max(getMapManager().view.w, getMapManager().view.h) * 0.5;


        // изменение громкости идет по линейному закону
        let dx = Math.abs(getGameManager().player.posX - x);
        let dy = Math.abs(getGameManager().player.posY - y);

        let distance = Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2));

        let norm = distance / viewSize;

        if(norm > 1)
            norm = 1;

        let volume = 1.0 - norm;

        if(!volume)
            return;

        getAudioManager().play(path, { looping: false });
    }

    stopAll() {
        this.gainNode.disconnect();
        this.filter.disconnect();

        this.gainNode = this.context.createGain ? this.context.createGain() : this.context.createGainNode();
        this.filter = this.context.createBiquadFilter();
        this.filter.connect(this.gainNode);
        this.gainNode.connect(this.context.destination);

        this.filter.type = "lowpass";
        this.filter.frequency.value = this.defaultFrequency;
    }

    frequencyRamp(fr, time) {
        getAudioManager().filter.frequency.exponentialRampToValueAtTime(fr, getAudioManager().context.currentTime + time);
    }
}