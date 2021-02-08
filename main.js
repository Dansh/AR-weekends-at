// Get reference to Canvas
var canvas = document.getElementById('canvas');

// Get refernce to Canvas Context
var context = canvas.getContext('2d');

// Get reference to loading screen
var loading_screen = document.getElementById('loading')

// Initalize loading variables
var loaded = false;
var load_counter = 0;

// Initalize images for layers
var background = new Image();
var trees_1 = new Image();
var trees_and_castle = new Image();
var trees_2 = new Image();
var trees_and_vampire = new Image();
var trees_3 = new Image();
var trees_4 = new Image();
var mask = new Image();
var bats = new Image();




// Create a list of layer objects
var layer_list = [
    {
        'image':background,
        'src': "Layers/Layer-1-1.png", 
        'z_index': 0, 
        'position': {x: 0, y:0}, 
        'blend': null, 
        'opacity': 1
    },
    {
        'image':trees_1,
        'src': "Layers/Layer-2-1.png", 
        'z_index': -2, 
        'position': {x: 0, y:0}, 
        'blend': null, 
        'opacity': 1
    },
    {
        'image':trees_and_castle,
        'src': "Layers/Layer-3-1.png", 
        'z_index': -1.7, 
        'position': {x: 0, y:0}, 
        'blend': null, 
        'opacity': 1
    },
    {
        'image':trees_2,
        'src': "Layers/Layer-4-1.png", 
        'z_index': -1.5, 
        'position': {x: 0, y:0}, 
        'blend': null, 
        'opacity': 1
    },
    {
        'image':trees_and_vampire,
        'src': "Layers/Layer-5-1.png", 
        'z_index': -0.9, 
        'position': {x: 0, y:0}, 
        'blend': null, 
        'opacity': 1
    },
    {
        'image':trees_3,
        'src': "Layers/Layer-6-1.png", 
        'z_index': -0.4, 
        'position': {x: 0, y:0}, 
        'blend': null, 
        'opacity': 1
    },
    {
        'image':trees_4,
        'src': "Layers/Layer-7-1.png", 
        'z_index': -0.1, 
        'position': {x: 0, y:0}, 
        'blend': null, 
        'opacity': 1
    },
    {
        'image':mask,
        'src': "Layers/Layer-8-1.png", 
        'z_index': 0, 
        'position': {x: 0, y:0}, 
        'blend': null, 
        'opacity': 1
    },
    {
        'image':bats,
        'src': "Layers/Layer-9-1.png", 
        'z_index': 0.5, 
        'position': {x: 0, y:0}, 
        'blend': null, 
        'opacity': 1
    }
];

layer_list.forEach(function(layer, index){
    layer.image.onload = function() {
        load_counter += 1;
        if (load_counter >= layer_list.length) {
            // hide the loading screen
            hideLoading();
            requestAnimationFrame(drawCanvas);
        }
    }
    layer.image.src = layer.src;
});


function hideLoading() {
    loading_screen.classList.add('hidden');
}


function drawCanvas()  {
    //clear whatever in the canvas
    context.clearRect(0,0, canvas.width, canvas.height);

    // Calculate how much the canvas should rotate
    var rotate_x = (pointer.y * -0.1) + (motion.y * -0.1);
    var rotate_y = (pointer.x * 0.1) + (motion.x * 0.1);

    var transform_string = "rotateX(" + rotate_x + "deg) rotateY(" + rotate_y + "deg)";

    canvas.style.transform = transform_string;
    //loop through each layer and draw it to the canvas
    layer_list.forEach(function(layer, index) {
        
        var offSet = getOffset(layer);
        layer.position = offSet;

        if (layer.blend){
            context.globalCompositeOperation = layer.blend;
        } else {
            context.globalCompositeOperation = 'normal';
        }
        context.globalAlpha = layer.opacity;

        context.drawImage(layer.image, layer.position.x, layer.position.y);
    });

    requestAnimationFrame(drawCanvas);
}

function getOffset(layer) {
    var touch_multiplier = 0.5;
    var touch_offset_x = pointer.x * layer.z_index * touch_multiplier;
    var touch_offset_y = pointer.y * layer.z_index * touch_multiplier;  

    var motion_multiplier = 2.5;
    var motion_offset_x = motion.x * layer.z_index * motion_multiplier;
    var motion_offset_y = motion.y * layer.z_index * motion_multiplier;

    var offset = {
        x: touch_offset_x,
        y: touch_offset_y
    };

    return offset;
}


// TOUCH AND MOUSE CONTROLS //

var moving = false;


//Initalize touch and mouse position

var pointer_initial = {
    x: 0 , 
    y: 0
}

var pointer = {
    x: 0,
    y: 0
}

canvas.addEventListener('touchstart', pointerStart);
canvas.addEventListener('mousedown', pointerStart);

function pointerStart(event){
    moving = true;
    if (event.type === 'touchstart') {
        pointer_initial.x = event.touches[0].clientX;
        pointer_initial.y = event.touches[0].clientY;
    } else if (event.type === 'mousedown'){
        pointer_initial.x = event.clientX;
        pointer_initial.y = event.clientY;
    }
}

window.addEventListener('touchmove', pointerMove);
window.addEventListener('mousemove', pointerMove);

function pointerMove(event){
    event.preventDefault();
    if (moving === true){
        var current_x = 0;
        var current_y = 0;
        if (event.type === 'touchmove')
        {
            current_x = event.touches[0].clientX;
            current_y = event.touches[0].clientY;
        }
        else if (event.type === 'mousemove')
        {
            current_x = event.clientX;
            current_y = event.clientY;
        }
        pointer.x = current_x - pointer_initial.x;
        pointer.y = current_y - pointer_initial.y;
    }
}


canvas.addEventListener('touchmove', function(event) {
    event.preventDefault();
});
canvas.addEventListener('mousemove', function(event) {
    event.preventDefault();
});

window.addEventListener('touchend', function(event){
    endGesture();
});

window.addEventListener('mouseup', function(event){
    endGesture();
});

function endGesture() {
    moving = false;

    pointer.x = 0;
    pointer.y = 0;
}


// MOTION CONTROLS //

// Initalize variabels for motion-based parallax


var motion_initial = {
    x: null, 
    y: null
}

var motion= {
    x: 0,
    y: 0
}

// Listen to gyroscope events
wnidow.addEventListener('deviceorientation', function(event){
    // if this is the first time through
    if (!motion_initial.x && !motion_initial.y){
        motion_initial.x = event.beta;
        motion_initial.y = event.gamma;
    }

    if (window.orientation === 0)
    {
        // The decive is in portrait orientation
        motion.x = event.gamma - motion_initial.y;
        motion.y = event.beta - motion_initial.x;
    }
    else if (window.orientation === 90) 
    {
        // The device is in landscape on its left side
        motion.x = event.beta - motion_initial.x;
        motion.y = -event.gamma + motion_initial.y;
    }
    else if (window.orientation === -90) 
    {
        // The device is in landscape on its right side
        motion.x = -event.beta - motion_initial.x;
        motion.y = event.gamma + motion_initial.y;
    }
    else
    {
        // The device is upside down
        motion.x = -event.gamma + motion_initial.y;
        motion.y = -event.beta + motion_initial.x;
    }
});

window.addEventListener('orientationchange', function(event){
    motion_initial.x = 0;
    motion_initial.y = 0;
});