const imageUpload = document.getElementById('imageUploadBtn')
Promise.all([
    faceapi.nets.faceRecognitionNet.loadFromUri('./models'),
    faceapi.nets.faceLandmark68Net.loadFromUri('./models'),
    faceapi.nets.ssdMobilenetv1.loadFromUri('./models')
]).then(start(getListDis))

async function start(callback) {
    hideInfo();
    const container = document.getElementById('divPhoto');
    container.style.position = 'relative';
    const labels= await callback();
    console.log();
    const labeledFaceDescriptors = await loadLabeledImages(labels);
    const faceMatcher = new faceapi.FaceMatcher(labeledFaceDescriptors, 0.6);
    let image;
    let canvas;
    document.getElementById("loading").style.visibility  = "hidden";
    document.getElementById("imageUpload").style.visibility  = "visible";
    imageUpload.addEventListener('change', async () => {
        if (image) image.remove()
        if (canvas) canvas.remove()
        image = await faceapi.bufferToImage(imageUpload.files[0])
        container.append(image)
        canvas = faceapi.createCanvasFromMedia(image)
        container.append(canvas)
        hideBrain();
        const displaySize = { width:image.width
         , height:  image.height }
        faceapi.matchDimensions(canvas, displaySize)
        const detections = await faceapi.detectAllFaces(image).withFaceLandmarks().withFaceDescriptors();
        const resizedDetections = faceapi.resizeResults(detections, displaySize);
        const results = resizedDetections.map(d => faceMatcher.findBestMatch(d.descriptor));

        results.forEach((result, i) => {

            const box = resizedDetections[i].detection.box;
            if(result.toString().substr(0,1)!="!") {

                const drawBox = new faceapi.draw.DrawBox(box, {label: result.toString()})
                drawBox.draw(canvas)
                showInfo();
                getDisparition(result.toString())

            }
            else if (result.toString().substr(0,1)=="!" && results.length==1) {
                  hideInfo();
                const drawBox = new faceapi.draw.DrawBox(box, {label: "inconnu"})
                drawBox.draw(canvas)
            }



        })
    })
}




