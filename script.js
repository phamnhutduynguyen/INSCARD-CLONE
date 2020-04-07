const CANVAS_WIDTH = 960;
const CANVAS_HEIGHT = 960;
const BLUR_LEVEL = 5;
const CARD_WIDTH = 470;
const CARD_HEIGHT = 740;

var fileSelect = document.getElementById('fileSelect');

fileSelect.addEventListener('change', function(){
    if(!fileSelect.files){
        return;
    }
    // console.log("file selected");
    let insC = new insCard();

    // let fl = new fileLoader(fileSelect);
    // fl.load(function(img){

    // });
});

class fileLoader{
    constructor(inputId){
        this.input = document.getElementById(inputId);
        this.load();
    }
    load(callback){
        let reader = new FileReader();
        reader.onload = (event) => {
            let img = new Image();
            img.onload = () => {
                // document.body.appendChild(img);
                callback(img);
            }
            img.src = event.target.result;
            // console.log(event.target.result);
        }
        reader.readAsDataURL(this.input.files[0]);
    }
}

class insCard{
    constructor(){
        this.canvas = document.getElementById('result');
        this.canvas.width = CANVAS_WIDTH;
        this.canvas.height = CANVAS_HEIGHT;
        this.ctx = this.canvas.getContext('2d'); 
        this.img = new Image();
        this.img.onload = () => this.imageLoaded();
        this.bgImg = null;
        this.cardImg = null;

        this.loadImage();
        var self = this;
    }

    start(){
        this.loadImage('fileSelect', (img) => {
            // console.console.log('img');
            self.img = img;
            self.drawBlurImage();
        });
    }

    loadImage(){
        let input = document.getElementById('fileSelect');
        let reader = new FileReader();
        reader.onload = (event) => {
            // let img = new Image();
            // img.onload = () => {
            //     // document.body.appendChild(img);
            //     callback(img);
            // }
            this.img.src = event.target.result;
            // console.log(event.target.result);
        }
        reader.readAsDataURL(input.files[0]);
    }

    cropBgImage(){
        let newBgSize = Math.min(this.img.width, this.img.height);
        
        let cutPosX = (this.img.width/2) - (newBgSize/2);
        let cutPosY = (this.img.height/2) - (newBgSize/2);

        this.bgImg = document.createElement('canvas');
        this.bgImg.width = CANVAS_WIDTH;
        this.bgImg.height = CANVAS_HEIGHT;

        this.bgImg.getContext('2d').drawImage(this.img, -cutPosX, -cutPosY);

        // document.body.appendChild(this.bgImg);
    }

    cropCardImage(){
        // let newBgSize = Math.min(this.img.width, this.img.height);
        
        // let cutPosX = (this.img.width/2) - (newBgSize/2);
        // let cutPosY = (this.img.height/2) - (newBgSize/2);

        let cardRatio = CARD_WIDTH / CARD_HEIGHT;
        let imgRatio = this.img.width / this.img.height;
        if(imgRatio = cardRatio){
            this.cardImg = this.img;
        }
        let newWidth = 0;
        let newHeight = 0;
        let cutPosX = 0;
        let cutPosY = 0;
        if(imgRatio > cardRatio){
            newHeight = this.img.height;
            newWidth = newHeight * cardRatio;
            cutPosX = (this.img.width / 2) - (newWidth / 2);
        }else if(imgRatio < cardRatio){
            newWidth = this.img.width;
            newHeight = newWidth / cardRatio;
            cutPosY = (this.img.height / 2) - (newHeight / 2);
        }

        this.cardImg = document.createElement('canvas');
        this.cardImg.width = CARD_WIDTH;
        this.cardImg.height = CARD_HEIGHT;

        this.cardImg.getContext('2d').drawImage(this.img, -cutPosX, -cutPosY);

        // document.body.appendChild(this.cardImg);
    }

    imageLoaded(){
        this.cropBgImage();
        this.cropCardImage();
        this.drawBgBlurImage();
        this.drawMask();
        this.drawCardImage();
    }

    drawCardImage(){
        let radius = 50;
        let x = 245;
        let y = 100;
        this.ctx.beginPath();

        this.ctx.moveTo(x + radius, y);

        this.ctx.lineTo(x + CARD_WIDTH - radius, y);
        this.ctx.quadraticCurveTo(x + CARD_WIDTH, y, x + CARD_WIDTH, y + radius);

        this.ctx.lineTo(x + CARD_WIDTH, y + CARD_HEIGHT - radius);
        this.ctx.quadraticCurveTo(x + CARD_WIDTH, y + CARD_HEIGHT, x + CARD_WIDTH - radius, y + CARD_HEIGHT);

        this.ctx.lineTo(x+ radius, y + CARD_HEIGHT);
        this.ctx.quadraticCurveTo(x, y + CARD_HEIGHT, x, y + CARD_HEIGHT - radius);
        
        this.ctx.lineTo(x, y + radius);
        this.ctx.quadraticCurveTo(x, y, x + radius, y);

        this.ctx.closePath();
        this.ctx.clip();

        this.ctx.drawImage(this.cardImg, 245, 100, CARD_WIDTH, CARD_HEIGHT);
    }

    drawMask(){
        this.ctx.globalAlpha = 0.4;
        this.ctx.fillStyle = "#000000";
        this.ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
        this.ctx.globalAlpha = 1;
    }

    drawBgBlurImage(){
        this.ctx.globalAlpha = 0.1;
        for(let y = -BLUR_LEVEL; y <= BLUR_LEVEL; y++){
            for(let x = -BLUR_LEVEL; x <= BLUR_LEVEL; x++){
                this.ctx.drawImage(this.img, x, y,CANVAS_WIDTH, CANVAS_HEIGHT);
            }
        }  
        this.ctx.globalAlpha = 1;
    }
}