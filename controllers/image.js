// Image Route Handlers

const clarifaiRequest = (req, res) => {
    // Clarifai API: gRPC 
    const PAT = '';         // Enter Your Personal Access Token HERE...!
    const USER_ID = '';
    const APP_ID = 'face-detection';
    const MODEL_ID = 'face-detection';
    const MODEL_VERSION_ID = '6dc7e46bc9124c5c8824be4822abe105';
    const IMAGE_URL = req.body.input;

    const { ClarifaiStub, grpc } = require("clarifai-nodejs-grpc");

    const stub = ClarifaiStub.grpc();

    // This will be used by every Clarifai endpoint call
    const metadata = new grpc.Metadata();
    metadata.set("authorization", "Key " + PAT);

    stub.PostModelOutputs(
        {
            user_app_id: {
                "user_id": USER_ID,
                "app_id": APP_ID
            },
            model_id: MODEL_ID,
            version_id: MODEL_VERSION_ID, // This is optional. Defaults to the latest model version
            inputs: [
                { data: { image: { url: IMAGE_URL, allow_duplicate_url: true } } }
            ]
        },
        metadata,
        (err, response) => {
            if (err) {
                throw new Error(err);
            }

            if (response.status.code !== 10000) {
                // console.log(IMAGE_URL)
                throw new Error("Post model outputs failed, status: " + response.status.description);
            }

            // Since we have one input, one output will exist here
            const output = response.outputs[0];

            // console.log("Predicted concepts:");
            // for (const concept of output.data.concepts) {
            //     console.log(concept.name + " " + concept.value);
            // }
            // console.log(output)
            return res.json(output)
        }

    );
}

const handleImage = (req, res, db) => {
    const { id } = req.body;
    if (!id) {
        return res.status(400).json("Invalid Form Submission...!");
    }
    db('users').where({ id })
        .returning('entries')
        .increment('entries', 1)
        .then(entries => {
            (entries.length) ? res.json(entries[0].entries)
                : res.status(400).json("Entry not found...!");
        })
        .catch(err => res.status(400).json("Error updating entries..."));
}

module.exports = {
    handleImage,
    clarifaiRequest
}

/* 
Sample Images URLs:

    - https://samples.clarifai.com/metro-north.jpg

    - https://cdna.artstation.com/p/assets/images/images/072/167/834/large/eunice-ye-.jpg?1706752364

    - https://cdna.artstation.com/p/assets/images/images/072/178/120/large/alex-gray-tbrender-camera-38.jpg?1706781629

    - https://cdnb.artstation.com/p/assets/images/images/072/184/959/4k/hwng-edric-nguyen-tbrender-viewport-009.jpg?1706793715

*/
