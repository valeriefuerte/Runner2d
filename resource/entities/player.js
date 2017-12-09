class Player extends Entity {
    constructor() {
        super();

        this.ammo = 2;
        this.moveX = 0;
        this.moveY = 0;
        this.speed = 3;
        this.canFire = true;
    }

    draw() {
        let mouseDelta = getEventsManager().getMouseDelta();
        let angle = Math.atan2(mouseDelta.y, mouseDelta.x);
        getSpriteManager().drawSprite(context, 'player-shooting', this.posX, this.posY, angle);
    }

    update() {
        getPhysicManager().update(this);
    }

    // Взаимодействие игрока с другими предметами
    onTouchEntity(entity) {
       if(entity.name.includes('trigger_levelend')) {
           // Уровень пройден
            getScoreManager().recordTime();
            getScoreManager().calculateTotal();
            getGameManager().levelCompleted();
        } else if(entity.name.includes('trigger_killeveryone')) {
            //Уровень пройден
            for(let entity of getGameManager().entities) {
                if(entity.name.includes('enemy')) {
                    // Недобитые
                    return;
                }
            }

            getScoreManager().recordTime();
            getScoreManager().calculateTotal();
            getGameManager().levelCompleted();
        }
    }

    kill() {}

    fire() {
        if(this.canFire && this.ammo !== 0) {
            let bullet = new Cartridges();

            bullet.sizeX = 8;
            bullet.sizeY = 4;
            bullet.name = 'bullet' + (++getGameManager().fireNum);

            let mouseDelta = getEventsManager().getMouseDelta();
            let angle = Math.atan2(mouseDelta.y, mouseDelta.x);
            bullet.angle = angle;
            bullet.posX = this.posX + this.sizeX / 2 - 4 + Math.cos(angle) * 4;
            bullet.posY = this.posY + this.sizeY / 2 - 4 + Math.sin(angle) * 4;

            getGameManager().entities.push(bullet);
                this.ammo--;

            getAudioManager().play('resource/sounds/shot.mp3');
            getScoreManager().shotFired();

            this.canFire = false;
            setTimeout( () => { getGameManager().player.canFire = true; }, bullet.delay);
        }

    }
}