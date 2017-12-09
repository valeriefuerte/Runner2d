class hudManager {
    constructor() {
    }

    drawGameHud() {
        let ctx = getCurrentContext();
        let playerAmmo = getGameManager().player.ammo;
        let hudAmmoImage = getSpriteManager().getSprite('bullet-hud');
        let hudAmmoPadding = 10;
        let ammoPos = { x: hudAmmoPadding, y: 60 };
        for(let i = 0; i < playerAmmo; i++) {
            ctx.drawImage(getSpriteManager().image,
                hudAmmoImage.x, hudAmmoImage.y,
                hudAmmoImage.w, hudAmmoImage.h,
                ammoPos.x + ( (hudAmmoImage.w + 3) * i), ammoPos.y,
                hudAmmoImage.w, hudAmmoImage.h
            );
        }
        ctx.textBaseline = "top";
        context.textAlign = "left";
        ctx.fillStyle = 'black';
        ctx.fillText(getScoreManager().currentScore(), 30, 30);
    }

    drawText(text, size, x, y, baseline) {
        let ctx = getCurrentContext();
        ctx.font = `${size}px arial`;
        ctx.textBaseline = baseline;
        context.textAlign = 'center';
        let lineheight = size;
        let lines = text.split('\n');
        for (var i = 0; i<lines.length; i++)
            ctx.fillText(lines[i], x, y + (i*lineheight)- 100);
    }

    drawTitleText(text) {
        getCurrentContext().fillStyle = 'black';
        this.drawText(text, 30, getCurrentCanvas().width / 2, getCurrentCanvas().height / 2, 'bottom');
    }

    drawSubtitleText(text) {
        getCurrentContext().fillStyle = 'black';
        this.drawText(text, 20, getCurrentCanvas().width / 2, getCurrentCanvas().height / 2, 'top');
    }

    drawPressFireText() {
        getCurrentContext().fillStyle = 'black';
        this.drawText('Нажмите ЛКМ чтобы перейти далее', 18, getCurrentCanvas().width / 2, getCurrentCanvas().height - 30, 'bottom');
    }

    drawEndLevel() {
        this.drawSubtitleText(`Убито врагов:  ${getScoreManager().currentKills()}\n Время:  ${getScoreManager().getTimeString(getScoreManager().getCurrentTime())}\n Счет:  ${getScoreManager().currentScore()}\n Очки за попадания:  ${getScoreManager().getCurrentAmmoBonus()}\n Очки за время:  ${getScoreManager().getCurrentTimeBonus()}\n\n Итог:  ${getScoreManager().getCurrentTotalScore()}`);
        this.drawPressFireText();
    }

    drawLoadingScreen() {
        getGameManager().clearScreen();
        this.drawTitleText(`Загрузка файлов`);
        this.drawSubtitleText(`Это займет некоторое время`);
    }

    drawHero(spritename) {
        let sprite = getSpriteManager().getSprite(spritename);
        getCurrentContext().drawImage(getSpriteManager().image,
            sprite.x, sprite.y, sprite.w, sprite.h,
            getCurrentCanvas().width / 2 - 150,
            getCurrentCanvas().height / 2 - 120,
            300,
            85
        );
    }

    drawFinalText() {

        getCurrentContext().fillStyle = 'black';
        this.drawText('Конец', 18, getCurrentCanvas().width / 2, getCurrentCanvas().height - 50, 'bottom');
    }

}