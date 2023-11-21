const AWS = require('aws-sdk');
const filebase = new AWS.S3({
    endpoint: 'https://s3.filebase.com', 
    signatureVersion: 'v4',
    accessKeyId: process.env.NEXT_PUBLIC_AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.NEXT_PUBLIC_AWS_SECRET_ACCESS_KEY,
});

const uploadTempo = (caller,content,title,media) => {
    const params = {
        Key: `aerx-Tempo-for-${caller}`,
        Bucket: "aerx-tempo",
    };
    try {
        filebase.getObject(params, (err, data) => {
            if (err) {
            const aerx_tempo = {
                Bucket: "aerx-tempo",
                Key: `aerx-Tempo-for-${caller}`,
                Body :"[" +
                `"${Date.now()}",` +
                " " +
                `"${title}",` +
                " " +
                `"${media}",` +
                " " +
                `"${content}"` +
                "]",
                ContentType: "aerx-Tempo",
                Metadata : {
                    owner : `${caller}`
                }
            }
            filebase.putObject(aerx_tempo, (err, data) => {
                if(err) {
                    console.log("Error! unable to upload Tempo", err.stack)
                }else{
                    console.log("Tempo uploaded successfully ", data)
                }
            })
            } else {
            const prevTempos = Buffer.from(data.Body, "utf8").toString();
            const aerx_tempo = {
                Bucket: "aerx-tempo",
                Key: `aerx-Tempo-for-${caller}`,
                Body:
                "[" +
                `"${Date.now()}",` +
                " " +
                `"${title}",` +
                " " +
                `"${media}",` +
                " " +
                `"${content}"` +
                "]" +
                "##aerx-tempo##" +
                `${prevTempos}`,
                ContentType: "aerx-Tempo",
                Metadata : {
                owner : `${caller}`
                }
            };
            filebase.putObject(aerx_tempo, (err, data) => {
                if (err) {
                console.log("Error! unable to upload Tempo ", err.stack);
                } else {
                console.log("Tempo uploaded succesfully ", data);
                }
            });
            }
        });
        return true
    } catch (err) {
        console.error("try caught error: ", err);
        return false
    }
    
}



const getTempo = (userId) => {
    const params = {
        Key: `aerx-Tempo-for-${userId}`,
        Bucket: "aerx-tempo",
    };
    return filebase.getObject(params, (err, data) => {
        if (err) {     
        } else {
            const tempos = Buffer.from(data.Body, 'utf8').toString();
            console.log(tempos);
            return tempos;
        }
    })
}

export{uploadTempo, getTempo}
