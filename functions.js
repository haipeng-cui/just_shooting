//CPSC 1045 Project name: Crazy man
//Student Name: Haipeng Cui
//Student ID:100321948
//Part of codes is reused from hot cheese and bubble pop.

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const CENTRE_X = canvas.width / 2;
const CENTRE_Y = canvas.height / 2;
const FPS = 60;
const BGFPS =24;//numbers of background frames

/**********************These consts are for bitmaps*******************/
//hero initialization
const HERO_STATUS = ["attack","stand","walk","dead"];
const MONSTER_STATUS = ["walk","attack"];
const MAP_HERO_WIDTH = 66;// the width from bitmap for getting hero;
const MAP_HERO_WALK =135;// the height from bitmap for getting hero;
const WALK_ACTION_NUM =8;// the action loop number;
const MAP_HERO_ATTACK = 693;
const ATTACK_ACTION_NUM = 5;
const MAP_HERO_STAND = 193;
const STAND_ACTION_NUM =15;
const MAP_HERO_DEAD = 386;
const DEAD_ACTION_NUM =2;
const HERO_SIZE = 50;// how big the hero is
const HEROX =100;//The initial position of hero
const HEROY = 300//The initial position of hero
const HERO_MOVE_SPEED = 20; //The hero moving speed
const GAP_X =5;// not important, adjust the position of hero
const GAP_Y =7;// not important,adjust the position of hero
const ZOOM = 0.7;//adjust the size of hero
//bullet initialization
const BULLET_ACTION_NUM =4;
const MAP_BULLET = 755;//the height from bitmap
const BULLET_SIZE = 40;
const BULLET_SPEED = 5;
//monster initialization
const MONSTER_WIDTH = 65;
const MONSTER_HEIGHT =30;
const MONSTER_WALK_ACTION_NUM =2;
const MAP_MONSTER_WALK = 665;// the height from bitmap
const MONSTER_SPEED =2;  //moving speed
const MONSTER_NUMBER =5; //  how many monsters are made in 1 sec
const MONSTER_INCREASE_SPEED = 0.125; //acceleration of monster making speed
//boss initialization
const BOSS_NUMBER =2;
const BOSS_INCREASE_SPEED = 0.2;
const BOSS_SPEED = 6;
/****************************Bitmaps's consts declaration finish*************/

/****************************These are images resources*********************/
//Image cite:
//Hero:https://www.spriters-resource.com/3ds/azurestrikergunvolt/sheet/78647/
//Monster:https://www.spriters-resource.com/3ds/azurestrikergunvolt/sheet/84543/
//background:https://twistedsifter.com/2013/05/animated-gifs-of-fighting-game-backgrounds/
let hero = new Image();
hero.src = "images/hero.png";
let monster = new Image();
monster.src = "images/monster.png";
let bgs = [];// keep each frame of background
let bgCount = 0;// for looping the background
/*****************************Images recources declaration finish***********/

/*****************************These are variable initiallizations***********/
let bullets = [];// all bullets
let monsters = [];//all monsters
let bosses = []
let gameTimes = [];// keep each game time;
let scores =[];//keep each game score;
let numMonster = MONSTER_NUMBER;// initial the monster maker
let numBoss = BOSS_NUMBER;
let colorMaker = 0; //get a loop number;
let gameCount = 0;//times of play;
let myHero;//my hero
let gameTime ;//how long has the game played
let score ; //how many monster were killed
let time1;//time for game start--object
let time_start;//time for game start--value
let clock; //the main clock of game--hero,bullet,and background
let clockNewMonsters;// the clock of monster
let clockNewBosses;
let clockWelcome;
let storyCharCount = 0;// for welcome story introduction
let story = "This is a sad story... After Crazy man was back to his home,      he found his wife was killed. He has to fight to death...                   ";//spaces for time delay
/*************************Variable initiallizations finish******************/

/************************These are the classes******************************/
class Point {//akn from 1045 Assignments:bublle pop
	constructor(x, y) {
		this.x = x;
		this.y = y;
	}
	translate(dx, dy) {
		this.x += dx;
		this.y += dy;
	}
	distance(other) {
		console.assert(other instanceof Point);
		return Math.hypot(this.x - other.x, this.y - other.y);
	}
}
const POINT_ZERO = new Point(0, 0);
const CANVAS_MAX = new Point(canvas.width, canvas.height);
//class of hero,//akn from 1045 Assignment:bublle pop
class Hero{
	constructor(x, y, radius,dx,dy,status) {
		console.assert(radius >= 0);
		// pos is the position of the centre of the hero. type: Point
		// radius is the logical range of hero
		// dx,dy are the move speed of hero
		//status is the hero status
		// cycle is the hero animation speed
		this.pos = new Point(x,y);
		this.radius = radius;
        this.status = status;
        this.dx =dx;
        this.dy = dy;
        this.cycle =0;
	}
	update() {
		this.pos.x +=this.dx;
		this.pos.y +=this.dy;
        this.dx = 0;
        this.dy = 0;
	}
	//Collision checking
    hasCollision(others) {
        console.assert(Array.isArray(others));
        for(let i=0;i<others.length;i++){
            if(this.isCollision(others[i]) && this != others[i]){
                return true;
            }
        }
        return false;
    }
    isCollision(other) {
        // a collision occurs when the distance between two bubbles centre's is less then the sum of their radius
        if(this.pos.distance(other.pos) < this.radius+other.radius-20){
            return true;
        } else{
            false;
        }
    }
	//draws this hero on the given context using the image provided.
	draw(ctx) {
		ctx.save();
		ctx.shadowBlur =10;
		ctx.shadowColor = "white";
		ctx.fillStyle = "white";
        if(this.status == "walk"){
			this.cycle = (this.cycle+0.2)%WALK_ACTION_NUM;
            ctx.drawImage(hero,GAP_X+MAP_HERO_WIDTH*Math.floor(this.cycle),MAP_HERO_WALK,HERO_SIZE,HERO_SIZE,this.pos.x-this.radius,this.pos.y-this.radius,HERO_SIZE*ZOOM,HERO_SIZE*ZOOM);
        } else if(this.status == "stand"){
			this.cycle = (this.cycle+0.2)%WALK_ACTION_NUM;
            ctx.drawImage(hero,GAP_X+MAP_HERO_WIDTH*Math.floor(this.cycle),MAP_HERO_STAND,HERO_SIZE*1.1,HERO_SIZE*1.1+GAP_Y,this.pos.x-this.radius,this.pos.y-this.radius,HERO_SIZE*ZOOM,HERO_SIZE*ZOOM);
        }else if(this.status == "attack"){
			this.cycle = (this.cycle+0.2)%ATTACK_ACTION_NUM;
            ctx.drawImage(hero,GAP_X+1.4*MAP_HERO_WIDTH*Math.floor(this.cycle),MAP_HERO_ATTACK,1.4*HERO_SIZE,HERO_SIZE+GAP_Y,this.pos.x-this.radius,this.pos.y-this.radius,HERO_SIZE*ZOOM,HERO_SIZE*ZOOM);

        } else if(this.status == "dead"){
			this.cycle = (this.cycle+0.2)%DEAD_ACTION_NUM;
            ctx.drawImage(hero,GAP_X+MAP_HERO_WIDTH*Math.floor(this.cycle),MAP_HERO_DEAD,HERO_SIZE,HERO_SIZE+GAP_Y,this.pos.x-this.radius,this.pos.y-this.radius,HERO_SIZE*ZOOM,HERO_SIZE*ZOOM);

        }
		ctx.restore();
	}

}
//class of monster,//akn from 1045 Assignment:bublle pop
class Monster{
    //Creates monster at the given position with the given argus
    constructor(x, y, radius, dx, dy, status) {
        console.assert(radius >= 0);
        // pos is the position of the centre of the Monster
        // radius : the logical range
        // status monster status
        // dx,dy are the monster moving speed
		//cycle: monster animation speed
        this.pos = new Point(x,y);
        this.radius = radius;
        this.status = status;
        this.dx = dx;
        this.dy = dy;
        this.cycle = 0;
    }
    update() {
        this.pos.x +=this.dx;
        this.pos.y +=this.dy;

    }

    //Determines if the monster is within bounds.
    isInBounds(topLeft, bottomRight) {
        console.assert(topLeft instanceof Point);
        console.assert(bottomRight instanceof Point);
        if(this.pos.x>=topLeft.x+this.radius-10     &&
           this.pos.x<=bottomRight.x-this.radius+10 &&
           this.pos.y>=topLeft.y+this.radius-10     &&
           this.pos.y<=bottomRight.y-this.radius+10){
               return true;
           }else {
               return false;
           }
    }
    //Collision checking
    hasCollision(others) {
        console.assert(Array.isArray(others));
        for(let i=0;i<others.length;i++){
            if(this.isCollision(others[i]) && this != others[i]){
                return true;
            }
        }
        return false;
    }

	isCollision(other) {
        if(this.pos.distance(other.pos) < this.radius+other.radius-20){
            return true;
        } else{
            false;
        }
    }
    draw(ctx) {
		ctx.save();
		ctx.shadowBlur =10;
		ctx.shadowColor = "indigo";
		ctx.fillStyle = "indigo";
        if(this.status == "walk"){
            ctx.drawImage(monster,MONSTER_WIDTH*Math.floor(this.cycle),MAP_MONSTER_WALK,MONSTER_WIDTH,MONSTER_HEIGHT,this.pos.x-0.5*MONSTER_WIDTH,this.pos.y-0.5*MONSTER_HEIGHT,MONSTER_WIDTH,MONSTER_HEIGHT);
            this.cycle = (this.cycle+0.125)%MONSTER_WALK_ACTION_NUM;
        }
		ctx.restore();
    }
}
//class of boss,//akn from 1045 Assignment:bublle pop
class Boss{
	//Creates boss at the given position with the given argus
	constructor(x, y, radius, dxy, status) {
        console.assert(radius >= 0);
        // pos is the position of the centre of the Monster
        // radius : the logical range
        // status monster status
        // dxy are the monster moving speed
		//cycle: monster animation speed
        this.pos = new Point(x,y);
        this.radius = radius;
        this.status = status;
        this.dxy= dxy;
        this.cycle = 0;
    }
	update() {
		if(this.pos.distance(myHero.pos)>0){
			//cosx siny the ratio of distance and path
		   let cosX = (myHero.pos.x-this.pos.x)/this.pos.distance(myHero.pos);
		   let sinY = (myHero.pos.y-this.pos.y)/this.pos.distance(myHero.pos);
		   //calculate the x and y move amout
		   let dx = this.dxy * cosX;
		   let dy = this.dxy * sinY;
		   this.pos.x += dx;
		   this.pos.y += dy;

    }
	}
	//Determines if the monster is within bounds.
	isInBounds(topLeft, bottomRight) {
		console.assert(topLeft instanceof Point);
		console.assert(bottomRight instanceof Point);
		if(this.pos.x>=topLeft.x+this.radius-10     &&
			this.pos.x<=bottomRight.x-this.radius+10 &&
			this.pos.y>=topLeft.y+this.radius-10     &&
			this.pos.y<=bottomRight.y-this.radius+10){
				return true;
			}else {
				return false;
				}
			}
	//Collision checking
	hasCollision(others) {
		console.assert(Array.isArray(others));
		for(let i=0;i<others.length;i++){
            if(this.isCollision(others[i]) && this != others[i]){
                return true;
            }
        }
        return false;
    }

	isCollision(other) {
		if(this.pos.distance(other.pos) < this.radius+other.radius-20){
            return true;
        } else{
            false;
        }
    }
	draw(ctx) {
		ctx.save();
		ctx.shadowBlur =10;
		ctx.shadowColor = "red";
		ctx.fillStyle = "red";
        if(this.status == "walk"){
            ctx.drawImage(monster,MONSTER_WIDTH*Math.floor(this.cycle),MAP_MONSTER_WALK,MONSTER_WIDTH,MONSTER_HEIGHT,this.pos.x-0.5*MONSTER_WIDTH,this.pos.y-0.5*MONSTER_HEIGHT,MONSTER_WIDTH*1.7,MONSTER_HEIGHT*1.7);
            this.cycle = (this.cycle+0.125)%MONSTER_WALK_ACTION_NUM;
        }
		ctx.restore();
    }
}
//the class of bullet,//akn from 1045 Assignment:bublle pop
class Bullet{
    //Creates a Bubble from the position of hero
    constructor(x, y, radius, dx, dy) {
        console.assert(radius >= 0);
        // pos is the position of Bullet
        // radius is the logical size
        // dx,dy are the speed of bullet
        // status is the status of bullet
        this.pos = new Point(x,y);
        this.radius = radius;
        this.status = status;
        this.dx = dx;
        this.dy = dy;
    }
    update() {
        this.pos.x +=this.dx;
        this.pos.y +=this.dy;

    }
	//check if bullet is in canvas
    isInBounds(topLeft, bottomRight) {
        console.assert(topLeft instanceof Point);
        console.assert(bottomRight instanceof Point);
        if(this.pos.x>=topLeft.x+this.radius -10    &&
           this.pos.x<=bottomRight.x-this.radius+10 &&
           this.pos.y>=topLeft.y+this.radius -10    &&
           this.pos.y<=bottomRight.y-this.radius+10){
               return true;
           }else {
               return false;
           }
    }
    //check collison
    hasCollision(others) {
        console.assert(Array.isArray(others));
        for(let i=0;i<others.length;i++){
            if(this.isCollision(others[i]) && this != others[i]){
                return true;
            }
        }
        return false;
    }
    isCollision(other) {

        if(this.pos.distance(other.pos) < this.radius+other.radius-20){
            return true;
        } else{
            false;
        }
    }
    draw(ctx) {
		ctx.save();
		ctx.shadowBlur =50;
		ctx.shadowColor = "white";
		ctx.fillStyle = "white";
        ctx.drawImage(hero,2.6*BULLET_SIZE,MAP_BULLET,HERO_SIZE*0.6,HERO_SIZE*0.5,this.pos.x-this.radius,this.pos.y-this.radius,HERO_SIZE*0.6,HERO_SIZE*0.5);
		ctx.restore();
    }
}
/*************************Classes definition finish************************/

/**************************game engine*************************************/
gameEngine();
/**************************game engine finish*****************************/

//game engine
function gameEngine(){
	clockWelcome = setInterval(welcome,1000/30);//show welcome page
	canvas.addEventListener("click",startGame);//start playing
}

//start game
function startGame(){
	if(gameCount == 0){
		clearInterval(clockWelcome);
		canvas.removeEventListener("click",startGame);
	}
	gameCount++;
	myHero = new Hero(HEROX, HEROY, 0.5*HERO_SIZE*ZOOM,0,0,"stand");
	bullets = [];
	monsters= [];
	bosses =[];
	score = 0;
	gameTime = 0;
	numMonster = MONSTER_NUMBER;
	numBoss = BOSS_NUMBER;
	// time1 = null;
	time1 = new Date();
	time_start = time1.getTime();
	//the main clock;
	clock = setInterval(tick,1000/FPS);
	//make random monster,monsters maker;
	clockNewMonsters = setInterval(newMonsters,1000);
	clockNewBosses = setInterval(newBosses,2000);
	addEventListener("keydown",heroMove);
	addEventListener("keyup",heroActionChange);
	addEventListener("keydown",newBullets);

}

//welcome page;
function welcome(){
	colorMaker = (colorMaker+0.125)%DEAD_ACTION_NUM;
	ctx.clearRect(0,0,canvas.width,canvas.height);
	drawBg();
	ctx.save();
	ctx.shadowBlur =10;
	ctx.font = '15px verdana';
	ctx.fillStyle = "white";
	ctx.shadowColor = "cyan";
	ctx.translate(200,140);
	myHero = new Hero(350+colorMaker*20, 110, 0.5*HERO_SIZE*ZOOM,1,1,"walk");
	drawHero();
	ctx.beginPath();
	ctx.moveTo(0,0);
	ctx.lineTo(450,0);
	ctx.lineTo(450,150);
	ctx.lineTo(0,150);
	ctx.lineTo(0,0);
	ctx.stroke();
	ctx.closePath();
	ctx.save();
	ctx.font = '32px verdana';
	ctx.shadowBlur =20;
	ctx.fillStyle = "cyan";
	ctx.shadowColor = "cyan";
	ctx.fillText("Crazy Man",130,-30);
	ctx.restore();
	ctx.fillText("Press \"A\", \"S\", \"D\", \"W\" to control hero's moving .",30,20);
	ctx.fillText("Press \"J\" to fire. Keep challenging yourself. ",30,40);
	ctx.fillText("You will never win the game.",30,60);
	ctx.save();
	ctx.font = '25px verdana';
	ctx.fillText("Caution: Boss can lock on you!!!",30,87);
	ctx.restore();
	if(Math.floor(colorMaker) == 0){
		ctx.fillStyle = "white";
		ctx.shadowColor = "white";
	} else{
		ctx.fillStyle = "mediumTurquoise";
		ctx.shadowColor = "mediumTurquoise";
	}
	ctx.font = '25px verdana';
	ctx.fillText("CLICK TO START...",30,120);
	ctx.restore();
	ctx.save();
	ctx.font = '20px verdana';
	ctx.fillStyle = "cyan";
	ctx.shadowColor = "mediumTurquoise";
    storyCharCount = (storyCharCount+0.25)%story.length;
	if(storyCharCount<=64)
		ctx.fillText(story.substring(0,Math.floor(storyCharCount)),120,320);
	else
		ctx.fillText(story.substring(65,Math.floor(storyCharCount)),120,320);
	ctx.restore();
}

//replay game;
function replayGame(){
	clearInterval(clockNewBosses);
	clearInterval(clock);
	clearInterval(clockNewMonsters);
	removeEventListener("keypress",heroMove);
	removeEventListener("keyup",heroActionChange);
	removeEventListener("keydown",newBullets);
	canvas.removeEventListener("click",replayGame);
	startGame();
}

//end game
function endGame(){
	if(myHero.status =="dead"){
		showResult();
		canvas.addEventListener("click",replayGame);
	}
	colorMaker = (colorMaker+0.125)%DEAD_ACTION_NUM;
}

//game components
function tick(){
    update();
    drawBg();
    drawHero()
    drawBullet();
	drawBoss();
    drawMonster();
    drawScore();
	drawTimer();
	endGame();
}

//update every components position and status
function update() {
	ctx.clearRect(0,0,canvas.width,canvas.height);
	//update boss
	let tempBosses = [];//for checking collison of bullets;
	for(i=0;i<bosses.length;i++){
		tempBosses.push(bosses[i]);
	}
	for(i=0;i<bosses.length;i++){
		if(!bosses[i].isInBounds(POINT_ZERO, CANVAS_MAX) || bosses[i].hasCollision(bullets))
		{
			if(bosses[i].hasCollision(bullets)) {
				score++;
			}
			bosses.splice(i,1);
			i--;
		} else if(myHero.status == "dead"){
			bosses = [];
		}
	}
	//update monster
    let tempMonsters = []//for checking collison of bullets;
    for(i=0;i<monsters.length;i++){
        tempMonsters.push(monsters[i]);
    }
    for(i=0;i<monsters.length;i++){
        if(!monsters[i].isInBounds(POINT_ZERO, CANVAS_MAX) || monsters[i].hasCollision(bullets))
        {
            if(monsters[i].hasCollision(bullets)) {
				score++;
			}
            monsters.splice(i,1);
            i--;
        } else if(myHero.status == "dead"){
            monsters = [];
        }
    }
    // update bullet;
    for(i=0;i<bullets.length;i++){
        if(!bullets[i].isInBounds(POINT_ZERO, CANVAS_MAX) || bullets[i].hasCollision(tempMonsters)|| bullets[i].hasCollision(tempBosses))
        {
            bullets.splice(i,1);
            i--;
        }
    }
    //update hero

    if(myHero.hasCollision(monsters) || myHero.hasCollision(bosses)){
        myHero.status = "dead";
		scores.push(score);
    }

}

//draw background
function drawBg(){
	for(i=0;i<24;i++){
		let bg = new Image();
		if(i<10){
			bg.src = "backgrounds/frame_0"+i+"_delay-0.08s.gif";
		}else {
			bg.src = "backgrounds/frame_"+i+"_delay-0.08s.gif";
		}
		bgs.push(bg);
	}

    bgCount = (bgCount+0.25)%BGFPS;
    ctx.drawImage(bgs[Math.floor(bgCount)],0,0);
	bgs = [];
}

//draw my hero
function drawHero(){
    myHero.update();
    myHero.draw(ctx);
 }

//draw bullets
function drawBullet(){
    for(i=0;i<bullets.length;i++){
        bullets[i].update();
        bullets[i].draw(ctx);

    }

}

//draw monsters
function drawMonster(){
    for(i=0;i<monsters.length;i++){
        monsters[i].update();
        monsters[i].draw(ctx);

    }
}

//draw monsters
function drawBoss(){
    for(i=0;i<bosses.length;i++){
        bosses[i].update();
        bosses[i].draw(ctx);

    }
}

//get random monsters of given number
function makeRandomMonsters(howMany) {
	if(howMany === undefined) { howMany = 1; }
	let count = monsters.length + howMany;
	while(monsters.length < count) {
        let dx =rand(-MONSTER_SPEED,MONSTER_SPEED);
        let dy = rand(-MONSTER_SPEED,MONSTER_SPEED);
		let m = new Monster(rand(0,CANVAS_MAX.x), rand(0,CANVAS_MAX.y/5),
			0.5*MONSTER_WIDTH, dx, dy,"walk");
			monsters.push(m);
	}
}
//get random bosses of given number
function makeRandomBosses(howMany) {
	if(howMany === undefined) { howMany = 1; }
	let count = bosses.length + howMany;
	while(bosses.length < count) {
        let dxy =rand(1,BOSS_SPEED);
		let m = new Boss(rand(CENTRE_X,CANVAS_MAX.x), rand(0,CANVAS_MAX.y),
			0.7*MONSTER_WIDTH, dxy,"walk");
			bosses.push(m);
	}
}

//helper function get random number;
function rand(min, max) {
	if(min === undefined) {
		min = 0;
		max = 1;
	} else if(max === undefined) {
		max = min;
		min = 0;
	}
	return Math.random() * (max - min) + min;
}
//helper function to get max
function getMax(list){
	let max = 0;
	for(i=0;i<list.length;i++){
		if(list[i] >max){
			max= list[i];
		}
	}
	return max;
}

//output Socre
function drawScore(){
	ctx.save();
    ctx.strokeStyle = "white";
	ctx.fillStyle = "white";
    ctx.font = "bold 20px Serif";
    ctx.fillText("Score: " + score, 5, 30);
    ctx.strokeText("Score: " + score, 5, 30);
	ctx.restore();
}

//output time
function drawTimer(){
	ctx.save();
	ctx.strokeStyle = "white";
	ctx.fillStyle = "white";
	ctx.font = "bold 20px Serif";
	let time2 =new Date();
	let time_end = time2.getTime();
	let time_total = (time_end - time_start)/1000;
	if(myHero.status == "dead" && gameTime == 0){
		 gameTime = time_total;
		 gameTimes.push(gameTime);
	}
	if(myHero.status == "dead"){
		ctx.fillText("Time: " + gameTime, 5, 60);
		ctx.strokeText("Time: " + gameTime, 5, 60);
	}else{
	ctx.fillText("Time: " + time_total, 5, 60);
	ctx.strokeText("Time: " + time_total, 5, 60);
	}
	// time2 = null;
	ctx.restore();
}

//output score board
function showResult(){
	ctx.save();
	ctx.shadowBlur =10;
	ctx.fillStyle = "white";
	ctx.shadowColor = "cyan";
	//draw score board;
	ctx.save();
	ctx.translate(200,140);
	ctx.beginPath();
	ctx.moveTo(0,0);
	ctx.lineTo(450,0);
	ctx.lineTo(450,150);
	ctx.lineTo(0,150);
	ctx.lineTo(0,0);
	ctx.restore();
	ctx.stroke();
	ctx.closePath();
	ctx.save();
	//draw score and time;
	ctx.font = '40px verdana';
	ctx.fillText("GAME OVER",canvas.width*0.5-100,canvas.height*0.5+20);
	ctx.font = '20px verdana';
	ctx.fillText("BEST SCORE: "+ getMax(scores),canvas.width*0.5-58,canvas.height*0.5+80);
	ctx.fillText("BEST TIME: "+ Math.floor(getMax(gameTimes))+"S",canvas.width*0.5-58,canvas.height*0.5+110);
	ctx.save();
	if(Math.floor(colorMaker) == 0){
		ctx.fillStyle = "white";
		ctx.shadowColor = "white";
	} else{
		ctx.fillStyle = "mediumTurquoise";
		ctx.shadowColor = "mediumTurquoise";
	}
	ctx.fillText("CLICK TO RESTART",canvas.width*0.5-75,canvas.height*0.5+50);
	ctx.restore();
	ctx.restore();
}

//to control hero move;
function heroMove(){
	if(myHero.status != "dead") {
		switch(event.which){
			case 87: if(myHero.pos.y>canvas.height*0.35)
						myHero.dy = -1*HERO_MOVE_SPEED;
						myHero.status = "walk";
						break;
			case 83: if(myHero.pos.y<canvas.height-0.75*HERO_SIZE)
						myHero.dy = HERO_MOVE_SPEED;
						myHero.status = "walk";
						break;
			case 65: if(myHero.pos.x>HERO_SIZE)
						myHero.dx = -1*HERO_MOVE_SPEED;
						myHero.status = "walk";
						break;
			case 68: if(myHero.pos.x<canvas.width-0.7*HERO_SIZE)
						myHero.dx = HERO_MOVE_SPEED;
						myHero.status = "walk";
						break;
		}
	}
}

//the temp changing of hero action;
function heroActionChange(){
	if((event.keyCode == 74 ||
		event.keyCode == 87 ||
		event.keyCode == 83 ||
		event.keyCode == 65 ||
		event.keyCode == 68) &&
		myHero.status != "dead"){
		myHero.status = "stand";
	}
}

//make new bullets
function newBullets(){
	if(event.which == 74 && myHero.status != "dead"){
        let bullet = new Bullet(myHero.pos.x+50, myHero.pos.y, 0.2*HERO_SIZE, BULLET_SPEED, 0);
        bullets.push(bullet);
		myHero.status = "attack";
        //console.log(bullets);
    }
}

//make new monsters
function newMonsters(){
	makeRandomMonsters(parseInt(numMonster));
	numMonster += MONSTER_INCREASE_SPEED;
}
//make new bosses
function newBosses(){
	makeRandomBosses(parseInt(numBoss));
	numBoss += BOSS_INCREASE_SPEED;
}
