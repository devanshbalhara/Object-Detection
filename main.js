
function computeColorforLabels(className) {
    if (className == 'person') {
        color = [85, 45, 255, 200];
    }
    else if (className = 'cup') {
        color = [255, 111, 0, 200]
    }
    else if (className = 'cellphone') {
        color = [200, 204, 255, 200]
    }
    else {
        color = [0, 255, 0, 200];
    }
    return color;
}

function drawBoundingBox(predictions, image) {
    predictions.forEach(
        prediction => {
            const bbox = prediction.bbox;
            const x = bbox[0];
            const y = bbox[1];
            const width = bbox[2];
            const height = bbox[3];
            const className = prediction.class;
            const confScore = prediction.score;
            const color = computeColorforLabels(className)
            console.log(x, y, width, height, className, confScore);
            let point1 = new cv.Point(x, y);
            let point2 = new cv.Point(x + width, y + height);
            cv.rectangle(image, point1, point2, color, 2);
            const text = `${className} : ${Math.round(confScore * 100)}%`;
            const font = cv.FONT_HERSHEY_SIMPLEX;
            const fontsize = 0.4;
            const thickness = 1;
            const canvas = document.createElement('canvas');
            const context = canvas.getContext('2d');
            const textMetrics = context.measureText(text);
            const twidth = textMetrics.width;
            console.log("Text Width", twidth);
            cv.rectangle(image, new cv.Point(x, y - 20), new cv.Point(x + twidth + 50, y), color, -1);
            cv.putText(image, text, new cv.Point(x, y - 5), font, fontsize, new cv.Scalar(255, 255, 255, 255), thickness);
        }
    )
}


var loadFile = function (event) {
    var image = document.getElementById('img-out');
    image.src = URL.createObjectURL(event.target.files[0]);
    document.getElementById("runmdl").disabled = false
    document.getElementById("prev-img").textContent = 'Preview of the input image : '
};

function openCV() {
    Module["onRuntimeInitialized"] = () => {
        console.log("openCV loaded")
        document.getElementById("runmdl").onclick = () => {
            console.log("objectDetection")
            document.getElementById("runmdl").disabled = true
            document.getElementById("runmdl").textContent = 'Running Model...'
            const image = document.getElementById("img-out")
            let inputImage = cv.imread(image)
            cocoSsd.load().then(model => {
                model.detect(image).then(predictions => {
                    console.log("Predictions : ", predictions)
                    console.log("Length of predictions : ", predictions.length)
                    if (predictions.length > 0) {
                        drawBoundingBox(predictions, inputImage)
                        cv.imshow("main-canvas", inputImage)
                        inputImage.delete()
                    }
                    else {
                        cv.imshow("main-canvas", inputImage)
                        inputImage.delete()
                    }
                })
                document.getElementById("inf-img").textContent = 'Inference by the model : '
                document.getElementById("runmdl").textContent = 'Run Model';
                document.getElementById("runmdl").disabled = false
            })
        }
    }
}