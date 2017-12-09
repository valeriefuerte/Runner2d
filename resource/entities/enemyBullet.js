class EnemyBullet extends Entity {
    constructor() {
        super();

        this.moveX = 0;
        this.moveY = 0;
        this.delay = 600;
        this.angle = 0;
        this.speed = 13;
    }

    draw() {
        getSpriteManager().drawSprite(context, 'bullet', this.posX, this.posY, this.angle);
    }

    update() {
        getPhysicManager().update(this);
    }

    kill() {
        getGameManager().kill(this);
    }
    onTouchMap(idx) {
        this.kill();
    }
    onTouchEntity(entity) {
        if(entity.name.includes('player')) {
            let distance = Math.sqrt(Math.pow( (this.posX + this.sizeX/2) - (entity.posX + entity.sizeX/2), 2) + Math.pow( (this.posY + this.sizeY/2) - (entity.posY + entity.sizeY/2) , 2));
            if( distance < 15 ) {
                this.kill();
                getGameManager().reloadScene();
            } else {
                let missSounds = [
                    'resource/sounds/miss.mp3',
                    'resource/sounds/miss2.mp3',

                ];
                getAudioManager().play(missSounds[Math.floor(Math.random() * 2)]);
            }

        }
    }



}