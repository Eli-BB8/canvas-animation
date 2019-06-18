let canvas = document.querySelector('canvas');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let c = canvas.getContext('2d');

// c.fillStyle = 'rgba(255, 0, 0, 0.5)';
// c.fillRect(100, 100, 100, 100);

// c.fillStyle = 'rgba(0, 0, 255, 0.5)';
// c.fillRect(400, 100, 100, 100);

// c.fillStyle = 'rgba(0, 255, 0, 0.5)';
// c.fillRect(300, 300, 100, 100);

// console.log(canvas);

// // Line

// c.beginPath();
// c.moveTo(50, 300);
// c.lineTo(300, 100);
// c.lineTo(400, 300);
// c.strokeStyle = '#fa34a3';
// c.stroke();

// Arc / Circle

// for (let i = 0; i < 100; i++) {
//     let x = Math.random() * window.innerWidth; 
//     let y = Math.random() * window.innerHeight;
//     let r = Math.floor(Math.random() * 255);
//     let g = Math.floor(Math.random() * 255);
//     let b = Math.floor(Math.random() * 255);
//     // let a = Math.random();

//     c.beginPath();
//     c.arc(x, y, 30, 0, Math.PI * 2, false);
//     c.strokeStyle = `rgb(${r},${g},${b})`;
//     c.stroke();
// }

let mouse = {
    x: undefined,
    y: undefined,
}

let maxRadius = 40;
let minRadius = 2;
let clickSpeedFactor = 18;
let slowDown = 1.05;
let circleAmount = 950;

let colorArray = [
    '#3D5A80',
    '#98C1D9',
    '#5AA873',
    '#EE6C4D',
    '#293241'
];

window.addEventListener('mousemove', (event) => {
    if (event.x < 30 || event.y < 30) {
        mouse.x = undefined;
        mouse.y = undefined;
    } else {
        mouse.x = event.x;
        mouse.y = event.y;
    }
});

window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    init();
});

window.addEventListener('mousedown', (event) => {
    circleArray.forEach(element => {
        if ((event.x - element.x < 50) && 
            (event.x - element.x > -50) &&
            (event.y - element.y < 50) && 
            (event.y - element.y > -50)) {
            if (event.x - element.x < 0 && event.y - element.y < 0) {
                element.dx = Math.random() * clickSpeedFactor;
                element.dy = Math.random() * clickSpeedFactor;
            } else if (event.x - element.x < 0 && event.y - element.y > 0) {
                element.dx = Math.random() * clickSpeedFactor;
                element.dy = -Math.random() * clickSpeedFactor;
            } else if (event.x - element.x > 0 && event.y - element.y > 0) {
                element.dx = -Math.random() * clickSpeedFactor;
                element.dy = -Math.random() * clickSpeedFactor;
            } else if (event.x - element.x > 0 && event.y - element.y < 0) {
                element.dx = -Math.random() * clickSpeedFactor;
                element.dy = Math.random() * clickSpeedFactor;
            }
        }
    });
});

function Circle(x, y, dx, dy ,radius) {
    this.x = x;
    this.y = y;
    this.dx = dx;
    this.dy = dy;
    this.minDx = dx;
    this.minDy = dy;
    this.radius = radius;
    this.minRadius = radius;
    this.color = colorArray[Math.floor(Math.random() * colorArray.length)];

    this.draw = () => {
        c.beginPath();
        c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
        c.fillStyle = this.color;
        c.fill();
    }

    this.update = () => {
        if (this.x + this.radius > innerWidth || this.x - this.radius < 0) {
            this.dx = -this.dx;
        }
    
        if (this.y + this.radius > innerHeight || this.y - this.radius < 0) {
            this.dy = -this.dy;
        }
    
        this.x += this.dx;
        this.y += this.dy;

        // interactivty
        if ((mouse.x - this.x < 50) && 
            (mouse.x - this.x > -50) &&
            (mouse.y - this.y < 50) && 
            (mouse.y - this.y > -50)) {
                if (this.radius < maxRadius) {
                    this.radius += 1;
                }
        } else {
            // Shrink circle to the original size
            if (this.radius > this.minRadius) {
                this.radius--;
            }

            if (Math.abs(this.dx) > Math.abs(this.minDx)) {
                this.dx /= slowDown;
            }

            if (Math.abs(this.dy) > Math.abs(this.minDy)) {
                this.dy /= slowDown; 
            }
        }
            

        this.draw();
    }
}

let circleArray = [];

function init() {
    circleArray = [];

    for (let i = 0; i < circleAmount; i++) {
        let radius = Math.random() * 6 + 1;
        let x = Math.random() * (innerWidth - radius * 2) + radius;
        let y = Math.random() * (innerHeight - radius * 2) + radius;
        let dx = (Math.random() - 0.5) * 5;
        let dy = (Math.random() - 0.5) * 5;
    
        circleArray.push(new Circle(x, y, dx, dy, radius));
    }
}

let circle = new Circle(200, 200, 3, 3, 30);

function animate() {
    requestAnimationFrame(animate);
    c.clearRect(0, 0, innerWidth, innerHeight);

    circleArray.forEach(element => {
        element.update();
    });
}

init();
animate();