/**
 * Demo programe for K-means clustering algorithm
 * BY Riko
 * Begin on 2018.8.14
 */

// Get canvas
let canvas = document.getElementById('canvas');
let pen = canvas.getContext('2d');
const WIDTH = document.getElementById('canvas').width;
const HEIGHT = document.getElementById('canvas').height;
const PI = 3.1415926;

// Canvas initiation
pen.beginPath();
pen.lineWidth = 5;
pen.strokeStyle = 'black';
pen.moveTo(0, 0);
pen.rect(0, 0, WIDTH, HEIGHT);
pen.stroke();

// Draw mesh
pen.beginPath();
pen.lineWidth = 1;
pen.strokeStyle = 'grey';
for(let i = 100; i < WIDTH; i += 100){
    pen.moveTo(i, 0);
    pen.lineTo(i, HEIGHT);
    pen.stroke();
    pen.beginPath();
    pen.fillStyle = 'black';
    pen.font = '15px Arial';
    pen.fillText(i.toString(), i+3, 16);
}
for(let i = 100; i < HEIGHT; i += 100){
    pen.moveTo(0, i);
    pen.lineTo(WIDTH, i);
    pen.stroke();
    pen.beginPath();
    pen.fillStyle = 'black';
    pen.font = '15px Arial';
    pen.fillText(i.toString(), 7, i-2);
}
//-------------------------------------------------------------
// Initiate training data
let x0 = 100,
    y0 = 100,
    x1 = 700,
    y1 = 400,
    radius = 300,
    each_size = 120;
let train_data = trainDataGen(x0, y0, x1, y1, radius, each_size);

// Initiate random centers for each tag
let center_array =[
    {x: Math.random() * WIDTH, y: Math.random() * HEIGHT, class: 'Class_0'},
    {x: Math.random() * WIDTH, y: Math.random() * HEIGHT, class: 'Class_1'}
];
let g_counter = 0;  // Generation counter
printPoints(train_data);
printCenters(center_array);
document.getElementById('generation-display').innerHTML = 'Current generation: ' + g_counter;
document.getElementById('k-display').innerHTML = 'K: 2';



/** Functions */
function trainDataGen(x1, y1, x2, y2, radius, each_size){
    let result_array = [];
    for(let i = 0; i < each_size; i++){
        let angle = Math.random()*2*PI;
        let random_data = {
            x: x1+radius*Math.cos(angle)*Math.random(),
            y: y1+radius*Math.sin(angle)*Math.random(),
            tag: 'red'
        };
        result_array[i] = random_data;
    }
    for(let i = each_size; i < 2*each_size; i++){
        let angle = Math.random()*2*PI;
        let random_data = {
            x: x2+radius*Math.cos(angle)*Math.random(),
            y: y2+radius*Math.sin(angle)*Math.random(),
            tag: 'blue'
        };
        result_array[i] = random_data;
    }
    return result_array;
}

function printPoints(point_array){
    for(let i = 0; i < point_array.length; i++){
        let x = point_array[i].x,
        y = point_array[i].y;
        pen.beginPath();
        if(point_array[i].tag === 'red')
            pen.fillStyle = 'red';
        else
            pen.fillStyle = 'blue';
        pen.arc(x, y, 3, 0, 360);
        pen.fill();
    }
}

function clustering(training_set){
    // For each point in training dataset
    for(let i = 0; i < training_set.length; i++){
        // Calculate distance to centers
        dist1 = Math.sqrt((training_set[i].x-center_array[0].x)**2 + (training_set[i].y-center_array[0].y)**2);
        dist2 = Math.sqrt((training_set[i].x-center_array[1].x)**2 + (training_set[i].y-center_array[1].y)**2);
        training_set[i].class = (dist1 < dist2) ? center_array[0].class : center_array[1].class;
    }
    
    let class0_num = 0,
        class1_num = 0,
        avg_x_c0 = 0,
        avg_y_c0 = 0,
        avg_x_c1 = 0,
        avg_y_c1 = 0;

    let sum_x_c0 = 0,
        sum_y_c0 = 0,
        sum_x_c1 = 0,
        sum_y_c1 = 0;

    // For each center, calculate average center position
    for(let i = 0; i < center_array.length; i++){
        for(let j = 0; j < training_set.length; j++){
            if(center_array[i].class === 'Class_0' && training_set[j].class === 'Class_0'){
                sum_x_c0 += training_set[j].x;
                sum_y_c0 += training_set[j].y;
                class0_num++;
            }
            else if(center_array[i].class === 'Class_1' && training_set[j].class === 'Class_1'){
                sum_x_c1 += training_set[j].x;
                sum_y_c1 += training_set[j].y;
                class1_num++;
            }
        }
        avg_x_c0 = sum_x_c0 / (class0_num+1);
        avg_y_c0 = sum_y_c0 / (class0_num+1);
        avg_x_c1 = sum_x_c1 / (class1_num+1);
        avg_y_c1 = sum_y_c1 / (class1_num+1);
    }
    center_array[0].x = avg_x_c0;
    center_array[0].y = avg_y_c0;
    center_array[1].x = avg_x_c1;
    center_array[1].y = avg_y_c1;
    console.log('c0x: '+avg_x_c0+' c0y: '+avg_y_c0);
    console.log(sum_x_c0);
    console.log(class0_num);
}

function printCenters(center_array){
    for(let i = 0; i < center_array.length; i++){
        let x = center_array[i].x,
            y = center_array[i].y;
        pen.beginPath();
        if(center_array[i].class === 'Class_0')
            pen.fillStyle = 'pink';
        else
            pen.fillStyle = 'yellow';
        pen.arc(x, y, 10, 0, 360);
        pen.fill();
        pen.beginPath();
        pen.fillStyle = 'black';
        pen.font = '20px Arial';
        pen.fillText(g_counter, x-6, y+8);
    }
}

function next(){
    g_counter++;
    clustering(train_data);
    printCenters(center_array);
    document.getElementById('generation-display').innerHTML = 'Current generation: ' + g_counter;
}

function refresh(){
    location.reload();
}