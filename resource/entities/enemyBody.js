class EnemyBody extends Entity {
    constructor() {
        super();

        this.moveX = 0;
        this.moveY = 0;
        this.speed = 0;
        this.angle = 0;

        this.difficulty = 0.1;
    }

    draw() {
        if(this.difficulty >= 0.5) {
            getSpriteManager().drawSprite(context, 'enemy-body2', this.posX, this.posY, this.angle);
        } else {
            getSpriteManager().drawSprite(context, 'enemy-body', this.posX, this.posY, this.angle);
        }


    }

    update() {}

    onTouchEntity(entity) {}

    kill() {
        getGameManager().kill(this);
    }
}