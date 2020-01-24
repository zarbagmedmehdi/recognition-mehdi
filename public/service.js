
async function getListDis() {
    let list=[];
    var disparitionRef = db.collection("disparition");
    var query =await  disparitionRef.where("état", "==", "").get()
        .then(function (querySnapshot) {
            querySnapshot.forEach(function (doc) {
                list.push(doc.id);
            });
        })
        .catch(function (error) {
            console.log("Error getting data: ", error);
        });
    return list ;

}

async  function getDisparition(string){
    let id=  string.substr(0,string.indexOf(' '));
    var docRef = db.collection("disparition").doc(id);

    await docRef.get().then(function(doc) {
        if (doc.exists) {
            console.log("Document data:", doc.data());
            document.getElementById('description').innerHTML = doc.data().description;
            var t = new Date(1970, 0, 1); // Epoch
            t.setSeconds(doc.data().vu_le.seconds);
            document.getElementById('vu').innerHTML ='vu le :'+t.toString().substr(0,28) ;

        } else {
            console.log("No such document!");
        }
    }).catch(function(error) {
        console.log("Error getting document:", error);
    });
}
async  function getTelRespo(idresponsable){
    var docRef = db.collection("responsable").doc(idresponsable);
let numTel="";
    await docRef.get().then(function(doc) {
        if (doc.exists) {
             numTel=doc.data().numTel;
        } else {
            console.log("No such document!");
        }
    }).catch(function(error) {
        console.log("Error getting document:", error);
    });
    return numTel;
}
async   function getIdresposable(idAccompagné){
    var docRef = db.collection("accompagné").doc(idAccompagné);
    let id="";
    await docRef.get().then(function(doc) {
        if (doc.exists) {
            id=doc.id;
        } else {
            console.log("No such document!");
        }
    }).catch(function(error) {
        console.log("Error getting document:", error);
    });
    return id;
}

function loadLabeledImages(labels) {
    return Promise.all(
        labels.map(async label => {
            const descriptions = []
            for (let i = 1; i <= 2; i++) {
                const link = `https://firebasestorage.googleapis.com/v0/b/finek-63040.appspot.com/o/perdu%2F${label}%2F${i}.jpg?alt=media`;
                console.log(link);
                try {
                    const image = await faceapi.fetchImage(link)
                    const detections = await faceapi.detectSingleFace(image).withFaceLandmarks().withFaceDescriptor()
                    descriptions.push(detections.descriptor)
                } catch (e) {}
            }
            return new faceapi.LabeledFaceDescriptors(label, descriptions)


        })

    );


}

