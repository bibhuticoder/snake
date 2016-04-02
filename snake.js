(function (window, document) {

    window.onload = function () {

        var i, j;

        var gameMan = {

            gameStarted: true,

            drawScore: function () {

                canvas.ctx.fillStyle = 'black';
                canvas.ctx.font = "bolder 30px Cursive"
                canvas.ctx.fillText("Score : " + snake.score, 50, 50);

                //                canvas.ctx.beginPath();
                //                canvas.ctx.strokeStyle = 'black';
                //                canvas.ctx.moveTo(0, 60);
                //                canvas.ctx.lineTo(canvas.width, 60);
                //                canvas.ctx.stroke();

            },

            drawStartMsg: function () {

                canvas.ctx.font = "80px Cursive";
                var msg = "Snake";
                var maxlength = 200;
                canvas.ctx.fillStyle = 'black';
                canvas.ctx.fillText(msg, canvas.width / 2 - maxlength / 2, canvas.height / 2, maxlength);

                canvas.ctx.font = "20px Cursive";
                canvas.ctx.fillStyle = 'purple';
                msg = "Press SPACEBAR to begin";
                maxlength = 250;
                canvas.ctx.fillText(msg, canvas.width / 2 - maxlength / 2, canvas.height / 2 + 50, maxlength);

            },

            restartGame: function () {

                canvas.clear();
                this.drawStartMsg();

                this.gameStarted = false;
                timer.interval = 100;

                snake.setValues();
                snake.generateSnake();

                food.setValues();
                food.randomFood();
                food.randomSpeed();

            }
        };

        var canvas = {

            width: 0,
            height: 0,
            ctx: 0,
            cnv: 0,

            createCanvas: function () {

                this.cnv = document.createElement("canvas");
                this.ctx = this.cnv.getContext('2d');
                document.getElementsByTagName('body')[0].appendChild(this.cnv);

                this.setCanvas();

            },

            setCanvas: function () {

                this.width = window.innerWidth;
                this.height = window.innerHeight;
                this.cnv.setAttribute("width", this.width);
                this.cnv.setAttribute("height", this.height);
                this.cnv.style.position = "absolute";
                this.cnv.style.left = 0;
                this.cnv.style.top = 0;
            },

            clear: function () {
                this.ctx.clearRect(0, 0, canvas.width, canvas.height);
            }
        }

        var snake = {

            bodyImg: new Image(),
            headImg: new Image(),
            status: 0,
            score: 0,
            size: 10,
            minTailSize: 5,
            speed: 0,
            length: 5,
            startPosX: 0,
            startPosY: 0,
            direction: 'right',
            snakeArr: [],

            gun: {

                color: 'red',
                size: 5,
                x: 0,
                y: 0,
                status: 0,
                speedX: 0,
                speedY: 0,

                drawGun: function () {
                    snake.gun.x += snake.gun.speedX;
                    snake.gun.y += snake.gun.speedY;

                    canvas.ctx.beginPath();
                    canvas.ctx.fillStyle = snake.gun.color;
                    canvas.ctx.arc(snake.gun.x, snake.gun.y, snake.gun.size, 0, 2 * Math.PI);
                    canvas.ctx.fill();

                    //check timeout 
                    if (snake.gun.x > canvas.width || snake.gun.x < 0 || snake.gun.y < 0 || snake.gun.y > canvas.height)
                        snake.gun.status = 0;

                }
            },

            setValues: function () {

                this.bodyImg.src = 'images/body.png';
                this.headImg.src = 'images/head_right.png';
                this.speed = snake.size * 2;
                this.startPosX = canvas.width / 2;
                this.startPosY = canvas.height / 2;

                this.score = 0;
                this.direction = 'right';
                this.snakeArr = [];

            },

            generateSnake: function () {
                for (i = 0; i < snake.length; i++) {
                    var newCir = {
                        x: snake.startPosX - i * snake.size * 2,
                        y: snake.startPosY,
                        size: this.size
                    };
                    snake.snakeArr.push(newCir);
                }

            },

            drawSnake: function drawSnake() {

                for (var length = snake.snakeArr.length - 1, i = length; i >= 0; i--) {

                    //snake body
                    if (i != 0) {
                        snake.snakeArr[i].x = snake.snakeArr[i - 1].x;
                        snake.snakeArr[i].y = snake.snakeArr[i - 1].y;

                        canvas.ctx.drawImage(snake.bodyImg, snake.snakeArr[i].x - snake.snakeArr[i].size, snake.snakeArr[i].y - snake.snakeArr[i].size, snake.snakeArr[i].size * 2, snake.snakeArr[i].size * 2);

                    }

                    //snake head
                    else {

                        if (snake.direction === 'right') {
                            snake.snakeArr[i].x += snake.speed;
                        } else if (snake.direction === 'left') {
                            snake.snakeArr[i].x -= snake.speed;
                        } else if (snake.direction === 'up') {
                            snake.snakeArr[i].y -= snake.speed;
                        } else if (snake.direction === 'down') {
                            snake.snakeArr[i].y += snake.speed;
                        }

                        canvas.ctx.drawImage(snake.headImg, snake.snakeArr[i].x - snake.size, snake.snakeArr[i].y - snake.size, snake.size * 2, snake.size * 2);


                    }

                    //check collission

                    if (snake.snakeArr[i].x + snake.size > canvas.width) gameMan.gameStarted = false;
                    else if (snake.snakeArr[i].x - snake.size < 0) gameMan.gameStarted = false;
                    else if (snake.snakeArr[i].y - snake.size < 0) gameMan.gameStarted = false;
                    else if (snake.snakeArr[i].y + snake.size > canvas.height) gameMan.gameStarted = false;

                    //collission with body
                    //collission can happen only from the fourth circle
                    for (j = 3; j < snake.snakeArr.length; j++) {
                        if (checkCollissionCir(snake.snakeArr[0], snake.snakeArr[j])) {
                            gameMan.gameStarted = false;
                        }

                    }

                }

                if (snake.gun.status === 1) {
                    snake.gun.drawGun();
                }


            },

            checkDeath: function () {

                //if snake is dead
                if (gameMan.gameStarted === false) {

                    canvas.ctx.beginPath();
                    canvas.ctx.strokeStyle = 'red';
                    canvas.ctx.arc(snake.snakeArr[0].x, snake.snakeArr[0].y, snake.size * 4, 0, 2 * Math.PI);
                    canvas.ctx.stroke();

                    timer.stop();
                    gameMan.drawStartMsg();

                }

            }
        }

        var food = {

            x: 0,
            y: 0,
            image: new Image(),
            speedX: 0,
            speedY: 0,
            maxSpeed: 10,
            size: 15,

            apple: {
                image: new Image(),
                defaultAge: 10,
                age: 0,
                x: 0,
                y: 0,
                size: 10,
                status: false,

                addApple: function () {

                    food.apple.x = generateRandom(2 * food.apple.size, canvas.width - 2 * food.apple.size);
                    food.apple.y = generateRandom(2 * food.apple.size, canvas.height - 2 * food.apple.size);
                    food.apple.size = food.apple.size;
                    food.apple.age = food.apple.defaultAge;
                    food.apple.status = true;

                },

                drawApple: function () {
                    if (food.apple.status) {

                        if (Math.floor(food.apple.age <= 0)) food.apple.status = false;
                        else food.apple.age -= ((1 / 1000) * timer.interval);

                        if (checkCollissionCir(snake.snakeArr[0], food.apple)) {

                            food.apple.status = false;
                            snake.score += 10;
                            timer.interval -= 5;

                        }


                        // draw age bar
                        canvas.ctx.fillStyle = "white";
                        canvas.ctx.fillRect(food.apple.x - food.apple.size, food.apple.y + food.apple.size + 5, food.apple.size * 2, 5);
                        canvas.ctx.fillStyle = "red";
                        var diff = ((food.apple.size * 2 - 2) / food.apple.defaultAge) * food.apple.age;
                        canvas.ctx.fillRect(food.apple.x - food.apple.size + 1, food.apple.y + food.apple.size + 6, diff, 3);

                        //canvas.ctx.fillText(food.apple.age, food.apple.x, food.apple.y);


                        canvas.ctx.drawImage(food.apple.image, food.apple.x - food.apple.size, food.apple.y - food.apple.size, food.apple.size * 2, food.apple.size * 2);

                    }


                }
            },

            bomb: {

                image: new Image(),
                speedX: 0,
                speedY: 0,
                maxspeed: 10,
                size: 10,
                bombs: [],

                addBomb: function () {

                    var newBomb = {};
                    newBomb.x = generateRandom(2 * food.bomb.size, canvas.width - 2 * food.bomb.size);
                    newBomb.y = generateRandom(2 * food.bomb.size, canvas.height - 2 * food.bomb.size);
                    newBomb.size = food.bomb.size;
                    newBomb.speedX = generateRandom(-food.bomb.maxspeed, food.bomb.maxspeed);
                    newBomb.speedY = generateRandom(-food.bomb.maxspeed, food.bomb.maxspeed);
                    newBomb.age = generateRandom(food.bomb.minAge, food.bomb.maxAge);

                    food.bomb.bombs.push(newBomb);

                },

                drawBomb: function () {

                    if (food.bomb.bombs.length > 0) {
                        var tempBomb;
                        for (i = food.bomb.bombs.length - 1; i >= 0; i--) {

                            tempBomb = food.bomb.bombs[i];
                            tempBomb.x += tempBomb.speedX;
                            tempBomb.y += tempBomb.speedY;


                            if (tempBomb.x > canvas.width || tempBomb.x < 0) tempBomb.speedX *= -1;
                            else if (tempBomb.y > canvas.height || tempBomb.y < 0) tempBomb.speedY *= -1;

                            if (checkCollissionCir(tempBomb, snake.snakeArr[0])) gameMan.gameStarted = false;

                            // collission with gun
                            if (snake.gun.status === 1) {
                                if (checkCollissionCir(snake.gun, food.bomb.bombs[i])) {
                                    snake.gun.status = 0;
                                    snake.score += 20;
                                    food.bomb.bombs.splice(i, 1);
                                }
                            }

                            canvas.ctx.drawImage(food.bomb.image, tempBomb.x - tempBomb.size, tempBomb.y - tempBomb.size, tempBomb.size * 2, tempBomb.size * 2);

                        }
                    }

                }

            },

            randomFood: function () {
                this.x = generateRandom(2 * this.size, canvas.width - 2 * this.size);
                this.y = generateRandom(2 * this.size, canvas.height - 2 * this.size);
            },

            randomSpeed: function () {
                this.speedX = generateRandom(-this.maxSpeed, this.maxSpeed);
                this.speedY = generateRandom(-this.maxSpeed, this.maxSpeed);

            },

            drawFood: function () {

                food.x += food.speedX;
                food.y += food.speedY;

                canvas.ctx.drawImage(this.image, food.x - food.size, food.y - food.size, food.size * 2, food.size * 2);

                food.apple.drawApple();

                //check food collission
                if (food.x > canvas.width || food.x < 0) food.speedX *= -1;
                else if (food.y > canvas.height || food.y < 0) food.speedY *= -1;

                if (checkCollissionCir(snake.snakeArr[0], food)) {
                    snake.score++;

                    var lastCir = snake.snakeArr[snake.snakeArr.length - 1];
                    snake.snakeArr.push({
                        x: lastCir.x,
                        y: lastCir.y,
                        size: (lastCir.size >= snake.minTailSize) ? lastCir.size - 0.1 : lastCir.size
                    });
                    this.randomFood();
                    this.randomSpeed();

                    if (generateRandom(0, 100) % 2 === 0 && !food.apple.status) {
                        food.apple.addApple();
                    } else if (generateRandom(0, 100) % 5 === 0) {
                        food.bomb.addBomb();
                    }

                }


                food.bomb.drawBomb();

            },

            setValues: function () {
                this.image.src = 'images/demon.png';
                this.apple.image.src = 'images/apple.png';
                this.bomb.image.src = 'images/bomb.png';
                this.apple.status = false;
                this.bomb.bombs = [];
            }
        }

        var timer = {

            interval: 100,
            tick: 0,

            update: function () {

                if (gameMan.gameStarted) {

                    canvas.clear();
                    snake.drawSnake();
                    food.drawFood();
                    door.drawDoor();

                    gameMan.drawScore();

                    snake.checkDeath();
                }

            },

            start: function () {

                gameMan.restartGame();
                timer.tick = setInterval(timer.update, timer.interval);
            },

            stop: function () {
                clearInterval(this.tick);
            }

        }

        var door = {

            width: 100,
            height: 30,
            image: new Image(),

            doors: [],

            setValues: function () {

                this.image.src = 'images/door.png';
                this.doors = [];

                //up
                this.doors.push({
                    x: canvas.width / 2 - this.width / 2,
                    y: 0,
                    width: this.width,
                    height: this.height
                });

                //down
                this.doors.push({
                    x: canvas.width / 2 - this.width / 2,
                    y: canvas.height - this.height,
                    width: this.width,
                    height: this.height
                });

                //right
                this.doors.push({
                    x: canvas.width - this.height,
                    y: canvas.height / 2 - this.width / 2,
                    width: this.height,
                    height: this.width
                });

                this.doors.push({
                    x: 0,
                    y: canvas.height / 2 - this.width / 2,
                    width: this.height,
                    height: this.width
                });

            },

            drawDoor: function () {

                for (i = 0; i < this.doors.length; i++) {
                    canvas.ctx.drawImage(this.image, this.doors[i].x, this.doors[i].y, this.doors[i].width, this.doors[i].height);

                    //check collission

                    //up
                    var head = snake.snakeArr[0];

                    var dr = this.doors[0];
                    if (head.x > dr.x && head.x < dr.x + this.width && head.y - head.size < dr.height) head.y = canvas.height - head.size * 4;

                    //down                    
                    dr = this.doors[1];
                    if (head.x > dr.x && head.x < dr.x + this.width && head.y + head.size > canvas.height - dr.height) head.y = head.size * 4;

                    //right                    
                    dr = this.doors[2];
                    if (head.y > dr.y && head.y < dr.y + this.width && head.x + head.size > dr.x) head.x = head.size * 4;

                    //left                    
                    dr = this.doors[3];
                    if (head.y > dr.y && head.y < dr.y + this.width && head.x - head.size < dr.width) head.x = canvas.width - head.size * 4;

                }

            }

        }

        function checkCollissionCir(cir1, cir2) {

            var x1 = cir1.x,
                y1 = cir1.y,
                x2 = cir2.x,
                y2 = cir2.y;

            var distance = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));

            var r1r2 = cir1.size + cir2.size;

            return (distance < r1r2);

        }

        function checkCollissionRect(cir, rect) {

            return (cir.x - cir.size > rect.x && cir.x + cir.size < rect.x + rect.width && cir.y > rect.y && cir.y < rect.y + rect.height)

        }

        function generateRandom(min, max) {
            return Math.floor(Math.random() * (max - min + 1)) + min;
        }

        window.onresize = function () {
            canvas.setCanvas();
            door.setValues();

        }

        function setEventHandlers() {

            $(document).keydown(function (e) {

                if (e.keyCode === 39 && snake.direction != 'left') {
                    snake.direction = 'right';
                    snake.headImg.src = 'images/head_right.png';
                } else if (e.keyCode === 37 && snake.direction != 'right') {
                    snake.direction = 'left';
                    snake.headImg.src = 'images/head_left.png';
                } else if (e.keyCode === 38 && snake.direction != 'down') {
                    snake.direction = 'up';
                    snake.headImg.src = 'images/head_up.png';
                } else if (e.keyCode === 40 && snake.direction != 'up') {
                    snake.direction = 'down';
                    snake.headImg.src = 'images/head_down.png';
                } else if (e.keyCode === 32) {
                    // snake.status = 1;

                    if (!gameMan.gameStarted) {
                        timer.start();
                        gameMan.gameStarted = true;
                    } else {
                        timer.stop();
                        gameMan.gameStarted = false;
                    }

                } else if (e.keyCode === 17) {

                    if (snake.gun.status === 0 && gameMan.gameStarted) {

                        snake.gun.status = 1;
                        snake.gun.x = snake.snakeArr[0].x;
                        snake.gun.y = snake.snakeArr[0].y;

                        if (snake.direction === 'right') {
                            snake.gun.speedX = snake.speed * 2;
                            snake.gun.speedY = 0;
                        } else if (snake.direction === 'left') {
                            snake.gun.speedX = -snake.speed * 2;
                            snake.gun.speedY = 0;
                        } else if (snake.direction === 'up') {
                            snake.gun.speedX = 0;
                            snake.gun.speedY = -snake.speed * 2;
                        } else if (snake.direction === 'down') {
                            snake.gun.speedX = 0;
                            snake.gun.speedY = snake.speed * 2;
                        }


                    }
                }


            });

            $(document).keyup(function (e) {



            });

        }

        canvas.createCanvas();
        gameMan.restartGame();
        door.setValues();
        setEventHandlers();

    };

}(window, document));