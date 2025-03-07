let layer;
let presence;
let sky;
let moon;
let stars;
let building;
let floor;
let pond;
let highlights;
let underwater;
let score = 0;
let enemy;
let backgroundMusic;
let deathSe;
let waterSplash;
let killSe;
let backPlay;
let soundPlay;
let countCanyons = 1;
let canyons = [];

function preload() {
    soundFormats('mp3', 'wav');
    backgroundMusic = loadSound('assets/sounds/background_music.wav');
    waterSplash = loadSound('assets/sounds/water_splash.mp3');
    killSe = loadSound('assets/sounds/kill-se.wav');
    deathSe = loadSound('assets/sounds/death-se.wav');
    backPlay = true;
}

function setup() {
    createCanvas(1024, 576);
    backgroundMusic.loop();
    backPlay = true;
    
    
    player = {
        x: 470,
        y: 210,
        width: 80,
        height: 80,
        speedGravity: -5,
        colorBody: color("#000000"),
        colorEyes: color("#efff00"),
        auraColor: color("rgba(234, 255, 0, 0.45)"),
        grounded: false,
        dead: false,
        drown: false,
        splashIsPlayed: false,
        drawPlayer: function() {
            noStroke();
            fill(this.colorBody);
            ellipse(this.x, this.y, this.width, this.height);
            fill(this.colorEyes);
            ellipse(this.x-13, this.y-10, this.width-65, this.height-60);
            ellipse(this.x+13, this.y-10, this.width-65, this.height-60);
            fill("#000000");
            ellipse(this.x-13, this.y-10, this.width-70, this.height-70);
            ellipse(this.x+13, this.y-10, this.width-70, this.height-70);
        },
        gravity: function(floor) {
            if (this.speedGravity > -5)
                this.speedGravity--;
            if (this.y + 40 < height - floor.height)
                this.y -= this.speedGravity;
            else 
            {
                this.grounded = true;
            }
        },
        jump: function() {
            this.speedGravity = 15;
            this.y -= this.speedGravity;
            this.grounded = false;
        },
        moveLeft: function() {   
            this.x = this.x - 5;
            
                noStroke();
                fill(this.colorBody);
                ellipse(this.x, this.y, this.width, this.height);
                fill(this.colorEyes);
                ellipse(this.x+2, this.y-10, this.width-65, this.height-50);
                ellipse(this.x-18, this.y-10, this.width-65, this.height-50);
                fill("#000000");
                ellipse(this.x-18, this.y-10, this.width-70, this.height-70);
                ellipse(this.x+2, this.y-10, this.width-70, this.height-70);
        },
        moveRight: function() { 
            this.x = this.x + 5;
            
                noStroke();
                fill(this.colorBody);
                ellipse(this.x, this.y, this.width, this.height);
                fill(this.colorEyes);
                ellipse(this.x+18, this.y-10, this.width-65, this.height-50);
                ellipse(this.x-2, this.y-10, this.width-65, this.height-50);
                fill("#000000");
                ellipse(this.x+18, this.y-10, this.width-70, this.height-70);
                ellipse(this.x-2, this.y-10, this.width-70, this.height-70);
        },
        movement: function() {
            if (!this.dead && !this.drown) {
                if (this.grounded && keyIsDown(32)) {
                    this.jump();
                }
                if (keyIsDown(68)) {
                    this.moveRight();
                }
                if (keyIsDown(65)) {
                    this.moveLeft();
                }
            }
        },
        deathAnimation: function() {
            if (this.dead) {
                if (this.y < height) {
                    this.y -= this.speedGravity;
                }
                else {
                    this.y = height - floor.height - this.width;
                    this.x = 400;
                    this.grounded = true;
                    this.dead = false;
                }
            }
        },
        drownAnimation: function() {
            if (this.drown) {
                if (score > 0) {
                score = 0;
                }
                if (this.y < height) {
                    this.y -= this.speedGravity;
                }
                else {
                    this.y = height - floor.height - this.width;
                    this.x = 400;
                    this.grounded = true;
                    this.drown = false;
                    this.isSplashPlayed = false;
                }
            }
        },
        checkEnemy: function () {
            if (this.x >= enemy.x && this.x <= enemy.x + enemy.width) {
                if (this.y + 10 <= enemy.y && this.y + 10 >= enemy.y - enemy.height / 2)  {
                    this.dead = true;
                    score -= 1;
                    deathSe.play();
                    enemy.speed = 2;
                    }
                if (this.y + 10 <= enemy.y - enemy.height / 2 && this.y + 10 >= enemy.y - enemy.height) {
                    enemy.dead = true;
                    score += 1;
                    killSe.play();
                    enemy.speed += 0.5;
                   }
                
                
            }

            if (this.dead) this.deathAnimation();
            if (enemy.dead) enemy.deathAnimation();
        },
        checkOutside: function() {
            if (this.x < -10)
                this.x = width - this.width + 10;
            if (this.x > width + 10)
                this.x = -10;
        },
        checkCanyon: function() {
            for(let i = 0; i < canyons.length; i++) {
                if(this.y + this.height >= height - floor.height && this.x >= canyons[i].x && this.x + this.width <= canyons[i].x + canyons[i].width) {
                    if (!this.isSplashPlayed) {
                        waterSplash.play();
                        this.isSplashPlayed = true;
                    }
                    this.grounded = false;   
                    this.drown = true;
                }
            }
            
            if (this.drown) this.drownAnimation();
        }
        
    };

    sky = {
        x:0,
        y:0,
        width: 1024,
        height: 410,
        color: color("#0f1c3d"),
        drawSky: function() {
            fill(this.color);
            rect(this.x, this.y, this.width, this.height-82);
        },
    };
    
    moon = {
        x: 75,
        y: 225,
        w: 70,
        h: 70,
        color1: color("#8cc2d1"),
        color2: color("rgba(49, 151, 178, 0.44)"),
        color3: color("rgba(113, 181, 199, 0.73)"),
        color4: color("rgba(85, 43, 165, 0.28)"),
        drawMoon: function() {
            noStroke();
            fill(this.color1);
            ellipse(this.x, this.y, this.w, this.h);
            fill(this.color2);
            ellipse(this.x-12, this.y+12, this.w-45, this.h-50);
            ellipse(this.x+20, this.y+10, this.w-50, this.h-40);
            ellipse(this.x-10, this.y-20, this.w-45, this.h-50);
            fill(this.color3);
            ellipse(this.x+12, this.y-20, this.w-55, this.h-50);
            fill(this.color4);
            ellipse(this.x, this.y, this.w - 15, this.h - 15);
            
        },
    };
    
    stars = {
        x: 0,
        y: 0,
        drawStars: function() {
            strokeWeight(2);
            stroke(218, 225, 227);
            point(this.x+220, this.y+160);
            point(this.x+70, this.y+50);
            point(this.x+120, this.y+280);
            point(this.x+350, this.y+110);
            point(this.x+600, this.y+110);
            point(this.x+790, this.y+60);
            point(this.x+860, this.y+170);
            point(this.x+700, this.y+220);
            point(this.x+500, this.y+270);
        },
    };

    building = {
        x: 730,
        y: 100,
        a: 870,
        b: 135,
        width: 120,
        height1: 436,
        height2: 401,
        color: color("rgb(55, 52, 68)"),
        color2: color("rgb(19, 21, 40)"),
        lightsColor: color("rgba(255, 246, 0, 0.57)"),
        lightsColor2: color("rgba(255, 246, 0, 0.21)"),
        drawBuilding: function() {
            noStroke();
            fill(this.color);
            triangle(this.x - 291, this.y + 336, this.x - 100, this.y + 336, this.x - 196, this.y + 250);
            rect(this.x, this.y, this.width, this.height1);
            rect(this.a, this.b, this.width, this.height2);
            triangle(this.a, this.b, this.a + this.width, this.b, this.a + this.width, this.b - 60);
            fill(this.color2);
            triangle(this.x - 271, this.y + 336, this.x - 120, this.y + 336, this.x - 196, this.y + 270);
            rect(this.x + 20, this.y + 20, this.width - 40, this.height1 - 20);
            rect(this.a + 20, this.b + 20, this.width - 40, this.height2 - 20);
            triangle(this.a + 20, this.b + 20, this.a - 20 + this.width, this.b + 20, this.a - 20 + this.width, this.b - 20);
            stroke(this.color);
            strokeWeight(3);
            line(this.a + this.width, this.b + 201, this.a + this.width, this.b - 90);
            noStroke();
            fill(this.lightsColor);
            circle(this.a + this.width, this.b - 90, 15);
            fill(this.lightsColor2);
            triangle(this.x - 251, this.y + 336, this.x - 140, this.y + 336, this.x - 196, this.y + 290);
            rect(this.x + 40, this.y + 40, this.width - 80, this.height1 - 40);
            rect(this.a + 40, this.b + 40, this.width - 80, this.height2 - 40);
            triangle(this.a + 40, this.b + 40, this.a - 40 + this.width, this.b + 40, this.a - 40 + this.width, this.b + 20);
            strokeWeight(5);
            stroke(this.color);
            line(this.x - 196, this.y + 290, this.x - 196, this.y + 336);
            stroke(this.lightsColor2);
            line(this.x - 196, this.y + 290, this.x - 196, this.y);
        },
    };
    
    floor = {
        height: 140,
        color: color("#060c1e"),
        drawFloor: function() {
            noStroke();
            fill(this.color);
            rect(0, height - this.height, width, this.height); 
        },
    };
    
    pool = {
        x1: 0,
        y1: 436,
        y2: 576,
        y3: 576,
        border_color: color("rgb(93, 59, 131)"),
        border2_color: color("rgba(0, 53, 255, 0.29)"),
        shade_color: color("rgb(5, 8, 44)"),
        drawPool: function() {
            noStroke();
            fill(this.border_color);
            quad(this.x1, this.y1, this.x1+330, this.y1, this.x1+440, this.y2, this.x1, this.y3);
            fill(this.border2_color);
            quad(this.x1, this.y1, this.x1+310, this.y1, this.x1+420, this.y2, this.x1, this.y3);
            fill(this.shade_color);
            quad(this.x1, this.y1, this.x1+290, this.y1, this.x1+400, this.y2, this.x1, this.y3);
        },
    };
    
    shine = {
        a: 0,
        b: 0,
        c: 0,
        d: 0,
        shineColor: color("rgba(157, 89, 233, 0.41)"),
        drawShine: function() {
            strokeWeight(3);
            stroke(this.shineColor);
            line(this.a+30, this.b+436, this.c+100, this.d+436);
            line(this.a+150, this.b+436, this.c+230, this.d+436);
            line(this.a+30, this.b+472, this.c+130, this.d+472);
            line(this.a+160, this.b+502, this.c+250, this.d+502);
            line(this.a+100, this.b+535, this.c+180, this.d+535);
            line(this.a+35, this.b+555, this.c+70, this.d+555);
        },
    };

    underwater = {
        a: 0,
        b: 436,
        c: 290,
        d: 144,
        underwaterColor: color("rgba(59, 0, 92, 0.29)"),
        drawUnderwater: function() {
            noStroke();
            fill(this.underwaterColor);
            rect(this.a, this.b, this.c, this.d);
        },
    };
    
    presence = {
        x: 430,
        y: 290,
        color: color("rgb(244, 255, 0)"),
        drawPresence: function() {
            noStroke();
            fill(this.color);
            textSize(20);
            text('0_0', this.x, this.y); 
        },
        
    };
    
    enemy = {
        x: 700,
        y: 410,
        width: 60,
        height: 60,
        borderLeft: 400,
        borderRight: 900,
        speed: 2,
        enemyColor: color("rgba(255, 85, 153, 0.53)"),
        fallSpeed: 4,
        direction: 1,
        dead: false,

        draw: function () {
            noStroke();
            fill(this.enemyColor);
            ellipse(this.x, this.y, this.width, this.height);
            fill(presence.color);
            textSize(20);
            text('0_0', this.x-16, this.y-40);
        },

        movement: function () {
            this.x += this.speed * this.direction;
            if (this.x <= this.borderLeft) {
                this.x += this.borderLeft - this.x;
                this.direction *= -1;
            } 
            else if (this.x >= this.borderRight) {
                this.x -= this.x - this.borderRight;
                this.direction *= -1;
            }
        },

        deathAnimation: function () {
            if (this.dead) {
                this.fallSpeed += 1.2;
                this.y += this.fallSpeed;
            }
        },

        respawn: function () {
            if (this.dead) {
                this.x = random(this.borderLeft, this.borderRight);
                this.y = 410; 
                this.dead = false;
                this.fallSpeed = 4;
            }
        },
    };

    for(let i = 0; i < countCanyons; i++) {
        canyons.push ({
                x: 0 + i * 400,
                y: height-floor.height,
                width: 340,
                drawCanyon: function() {
                    fill(21, 36, 51);
                    rect(this.x, this.y, 290, floor.height);
                }
            });
    }
    
    backgroundMusic.setVolume(1);
    deathSe.setVolume(0.8);  
    killSe.setVolume(0.8);
    waterSplash.setVolume(5);
}

function keyPressed() {
    if (key === 'M' || key === 'm') {
        changeMuteMusic();
    }
}

function changeMuteMusic() {
    if (!backPlay) {
        backgroundMusic.loop();
        backPlay = true;
    } else {
        backgroundMusic.pause();
        backPlay = false;
    }
}

function draw() {
    background("rgb(24, 31, 65)");
    sky.drawSky();
    moon.drawMoon();
    stars.drawStars();
    building.drawBuilding();
    floor.drawFloor();
    pool.drawPool();
    for(let i = 0; i < canyons.length; i++)
        canyons[i].drawCanyon();
    shine.drawShine();
    
    enemy.draw();
    enemy.movement();
    enemy.respawn(); 
    
    player.drawPlayer();
    player.checkEnemy();
    player.checkCanyon();
    player.checkOutside();
    player.gravity(floor);
    player.movement();
    underwater.drawUnderwater();
    fill(presence.color);
    textSize(15);
    text(score, 480, 30);
    text("Press M to toggle background noise", 480, 50);
    if (!backPlay) {
        text("Music: OFF", 480, 70);
    } 
    else {
        text("Music: ON", 480, 70);
    }
}