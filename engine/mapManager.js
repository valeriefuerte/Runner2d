class mapManager {

    constructor() {
        this.mapData = null; // переменная для хранения карты
        this.tLayer = null; //переменная для хранения ссылки на блоки карты (весь json tilelayer)
        this.xCount = 0; //количество блоков по горизонтали
        this.yCount = 0; //количество блоков по вертикали
        this.tSize = {x: 32, y: 32}; //размер блока
        this.scale = 1;
        this.mapSize = {x: 32, y: 32};//размер карты
        this.tilesets = new Array();
        this.view = {x: 0, y: 0, w: 800, h: 600};
        this.imgLoadCounter = 0;
        this.imagesLoaded = false;
        this.jsonLoaded = false;
    }

    loadMap(path) { // загрузка json-а карты с помощью асинхронного запроса
        let request = new XMLHttpRequest();
        request.onreadystatechange = () => {
            if (request.readyState === 4 && request.status === 200) {
                // получен корректный результат
                this.parseMap(request.responseText);
            }
        };

        //отправка запроса
        request.open('GET', path, true);
        request.send();

        this.view.w = getCurrentCanvas().width;
        this.view.h = getCurrentCanvas().height;
    }


    parseMap(tilesJSON) {
        this.mapData = JSON.parse(tilesJSON);

        this.xCount = this.mapData.width;
        this.yCount = this.mapData.height;

        this.tSize.x = this.mapData.tileheight;
        this.tSize.y = this.mapData.tilewidth;

        this.mapSize.x = this.xCount * this.tSize.x; //вычисление размера карты
        this.mapSize.y = this.yCount * this.tSize.y;

        for(let tile of this.mapData.tilesets) {
            let img = new Image();
            img.onload = () => { //при загрузке изображений
                this.imgLoadCounter++;
                if(this.imgLoadCounter === this.mapData.tilesets.length) {
                    this.imagesLoaded = true;
                    console.log('Tilesets loaded');
                }
            };

            img.src = 'resource/images/' + tile.image;// путь
            let t = tile; // забираем тайлсет из карты

            let ts = { //создам свой тайлсет
                firstgid: tile.firstgid,
                image: img,
                name: tile.name,
                xCount: Math.floor(tile.imagewidth / this.tSize.x),
                yCount: Math.floor(tile.imageheight / this.tSize.y)
            };

            this.tilesets.push(ts); // сохраняем тайлсет в массив
        }

        // проверяем что тайлеер настроен
        for(let layer of this.mapData.layers) {
            if(layer.type === "tilelayer") {
                // если не леер то пропускаем
                this.tLayer = layer;
                break;
            }
        }

        this.jsonLoaded = true;

    }
    //проходимся по всей карте
    draw(ctx) {
        if(!this.imagesLoaded || !this.jsonLoaded) {
            setTimeout( () => this.draw(ctx), 100 );
        } else {
            if(this.tLayer === null) {
                for(let layer of this.mapData.layers) {
                    if(layer.type === "tilelayer") {
                        this.tLayer = layer;
                        break;
                    }
                }
            }

            for(let i = 0; i < this.tLayer.data.length; i++) {
                let tileData = this.tLayer.data[i];

                if(tileData !== 0) {
                    let tile = this.getTile(tileData);

                    //получаем блок остатком
                    let pX = (i % this.xCount) * this.tSize.x;
                    let pY = Math.floor(i / this.xCount) * this.tSize.y;

                    pX *= this.scale;
                    pY *= this.scale;

                    let tileSizeX = this.tSize.x * this.scale;
                    let tileSizeY = this.tSize.y * this.scale;

                    // не рассматриваем за пределами видимой зоны
                    if( !this.isVisible(pX, pY, tileSizeX, tileSizeY) )
                        continue;

                    // двигаем камеру
                    pX -= this.view.x;
                    pY -= this.view.y;

                    //отрисовываем
                    ctx.drawImage(tile.img,
                                  tile.px, tile.py,
                                  this.tSize.x, this.tSize.y,
                                  pX, pY,
                                  tileSizeX, tileSizeY);
                }
            }
        }
    }

    // разбор слоя objectgroups
    parseEntities() {
        if(!this.imagesLoaded || !this.jsonLoaded) {
            return false;

        } else {
            for(let layer of this.mapData.layers) {
                if(layer.type === 'objectgroup') {
                    // слой который следует разобрать
                    for(let entity of layer.objects) {
                        try {
                            let obj = null;

                            // в соответствии с типом создаем экземпляр объекта
                            switch(entity.type) {
                                case 'Player':
                                    obj = new Player();
                                    obj.ammo = entity.properties.ammo;
                                    break;

                                case 'Enemy':
                                    obj = new Enemy();
                                    obj.difficulty = entity.properties.difficulty;
                                    break;

                                case 'PlayerTrigger':
                                    obj = new Trigger();
                                    break;
                            }

                            if(obj === null) continue;


                            obj.name = entity.name;
                            obj.posX = entity.x;
                            obj.posY = entity.y - entity.height; // КОСТЫЛЬ!!!
                            obj.sizeX = entity.width;
                            obj.sizeY = entity.height;

                            getGameManager().entities.push(obj);

                            if(obj.name === 'player') {
                                getGameManager().initPlayer(obj);
                            }

                        } catch(ex) {
                            console.log(`Ошибка создания объектов [${entity.gid}] ${entity.type}, ${ex}`);
                        }
                    }
                }
            }
        }
    }

    // камера
    centerAt(x, y) {
        if(x < this.view.w / 2) {
            this.view.x = 0;
        } else if(x > this.mapSize.x - this.view.w / 2) {
            this.view.x = this.mapSize.x - this.view.w;
        } else {
            this.view.x = x - (this.view.w / 2);
        }

        if(y < this.view.h / 2) {
            this.view.y = 0;
        } else if(y > this.mapSize.y - this.view.h / 2) {
            this.view.y = this.mapSize.y - this.view.h;
        } else {
            this.view.y = y - (this.view.h / 2);
        }
    }

    // координата тайла
    getTile(tileIndex) {
        let tile = {
            img: null,
            px: 0,
            py: 0
        };

        let tileset = this.getTileset(tileIndex);
        tile.img = tileset.image;
        let id = tileIndex - tileset.firstgid;
        let x = id % tileset.xCount;
        let y = Math.floor(id / tileset.xCount);

        tile.px = x * this.tSize.x;
        tile.py = y * this.tSize.y;

        return tile;
    }

    // блок
    getTileset(tileIndex) {
        for(let i = this.tilesets.length-1; i >= 0; i--) {
            if(this.tilesets[i].firstgid <= tileIndex) {
                return this.tilesets[i];
            }
        }

        return null;
    }
    // используя размеры блока функция высчитывает блок с индексом idx и возвращает его
    getTilesetIdx(x, y) {
        let wX = x;
        let wY = y;
        let idx = Math.floor(wY / this.tSize.y) * this.xCount + Math.floor(wX / this.tSize.x);

        return this.tLayer.data[idx];
    }

    // блоки в пределах карты
    isVisible(x, y, width, height) {
        if(x + width < this.view.x
        || y + height < this.view.y
        || x > this.view.x + this.view.w
        || y > this.view.y + this.view.h)
            return false;

        return true;
    }
}


