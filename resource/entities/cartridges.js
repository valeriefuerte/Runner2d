// Поведение патронов

class Cartridges extends Entity {

    // Создание патрона
    constructor() {
        super();
        this.moveX = 0;
        this.moveY = 0;
        this.delay = 150;
        this.angle = 0;
        this.speed = 14;
    }

    // Отрисовка патронов
    draw() {
        getSpriteManager().drawSprite(context, 'bullet', this.posX, this.posY, this.angle);
    }

    // Обновление патронов
    update() {
        getPhysicManager().update(this);
    }

    // Попадание во врага
    onTouchEntity(entity) {
        if(entity.name.includes('enemy')) {
            let e = getGameManager().entity(entity.name);
            if(e !== null) {
                if(e.alive) {
                    getScoreManager().enemyKilled(entity.difficulty);
                    e.kill();
                }
            }
            this.kill();
        }
    }


    // Касание стенок карты
    onTouchMap(idx) {
        this.kill();
    }


    // Удаление
    kill() {
        getGameManager().kill(this);
    }
}