var initGame = function() {
    var zoomScale = 2;
    var zoomLevel = 0;
    var getCursorPosition = function(e, bounds) {
        var data = {};
        if (e.pageX != undefined && e.pageY != undefined) {
            data.x = e.pageX;
            data.y = e.pageY;
        }
        else {
            data.x = e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
            data.y = e.clientY + document.body.scrollTop + document.documentElement.scrollTop;
        }
        data.x = Math.min(data.x, canvas.width);
        data.y = Math.min(data.y, canvas.height);
        return data;
    };

    var xOff = 0;
    var yOff = 0;

    var mouseDown = false;
    var mouseDownHandler = function(e) {
        mouseDown = true;
    };

    var mouseUpHandler = function(e) {
        mouseDown = false;
    };

    var lastMousePos;
    var mouseMoveHandler = function(e) {
        var xy = getCursorPosition(e);
        if (mouseDown && lastMousePos != undefined) {
            xOff += xy.x - lastMousePos.x;
            yOff += xy.y - lastMousePos.y;
        }
        lastMousePos = xy;
    };

    var mouseWheelHandler = function(e) {
        var zoomChange = 1;
        if (zoomLevel < 20 && e.deltaY > 0) {
            zoomLevel++;
            zoomChange = 0.9;
        } else if (zoomLevel > 0 && e.deltaY < 0) {
            zoomLevel--;
            zoomChange = 1 / 0.9;
        }

        zoomScale *= zoomChange;
        xOff = e.pageX - (e.pageX - xOff) * zoomChange;
        yOff = e.pageY - (e.pageY - yOff) * zoomChange;
    };

    var sizeWindow = function() {
        // Resize current canvas
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    };

    // Hook events
    document.addEventListener('mousedown', function(e) { mouseDownHandler(e); });
    document.addEventListener('mousemove', function(e) { mouseMoveHandler(e); });
    document.addEventListener('mouseup', function(e) { mouseUpHandler(e); });
    document.addEventListener('wheel', function(e) { mouseWheelHandler(e); }, false);
    window.addEventListener('resize', function(e) { sizeWindow(); }, false);

    // Create canvas
    var canvas = document.createElement('canvas');
    canvas.id     = "CursorLayer";
    canvas.width  = 640;
    canvas.height = 480;
    canvas.style.display = "block";
    canvas.style.margin = "0";
    canvas.style.padding = "0";
    document.body.appendChild(canvas);

    var context = canvas.getContext('2d');

    // Image loading
    var assetsLoaded = 0;
    var images = [
        "images/turnip.png",
        "images/turnip2.png",
        "images/onion.png",
        "images/pumpkin.png",
        "images/radish.png"
    ];

    var imageCache = {};
    var loadSprite = function(src, callback) {
        var sprite = new Image();
        sprite.onload = callback;
        sprite.src = src;
        imageCache[src] = sprite;
    };

    var loadImages = function() {
        var assetLoaded = function() {
            assetsLoaded++;
        };

        for (var i = 0; i < images.length; i++) {
            loadSprite(images[i], assetLoaded);
        }
    };

    // Draw function
    var draw = function() {
        context.save();
        context.clearRect(0, 0, canvas.width, canvas.height);

        context.translate(xOff, yOff);
        context.scale(zoomScale, zoomScale);

        if (assetsLoaded < images.length) {
            context.font = "Calibri 12pt";
            context.fillStyle = "black";
            context.fillText(assetsLoaded + " of " + images.length + " assets loaded", 20, 20);
        }
        else {
            var size = 32;
            for (var i = 0; i < 16; i++) {
                for (var j = 0; j < 16; j++) {
                    context.drawImage(imageCache[images[0]], i * size, j * size, size, size);
                }
            }
        }

        context.restore();
    };

    // Draw loop
    var drawLoop = function() {
        requestAnimationFrame(drawLoop);
        draw();
    };

    sizeWindow();
    loadImages();
    drawLoop();
};

window.onload = initGame;