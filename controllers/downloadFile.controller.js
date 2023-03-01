const fs = require('fs');
const ytdl = require('ytdl-core');
const path = require("path");
module.exports = {
    downloadFileList: async (req, res) => {
        try {
            const bodyData = req.query
            if(!bodyData.url) {
                return res.json(200, { "statusCode": 400, "apiStatus": false, "Message": "url mandatory" });
            } 
            let videoAudioFormat = []
            let videoInfo = await ytdl.getInfo(bodyData.url);
            // ytdl('https://youtu.be/QeqS3vO_HeQ').pipe(fs.createWriteStream('video.mp4'));
            // res.end();
            // let format = ytdl.chooseFormat(videoInfo.formats, { quality: '134' });
            console.log('Format found!', videoInfo.formats.length);
            for (let index = 0; index < videoInfo.formats.length; index++) {
                const element = videoInfo.formats[index];
                let resultObj = {};
                if(element.hasVideo && element.hasAudio) {
                    resultObj.type = "video";
                    resultObj.format = element.container
                    resultObj.quality = element.qualityLabel
                    resultObj.id = element.itag
                }
                if(!element.hasVideo && element.hasAudio) {
                    resultObj.type = "audio";
                    resultObj.format = element.container
                    resultObj.id = element.itag
                }
                console.log(resultObj ? resultObj : "no data found");
                if(resultObj && resultObj.type) {
                    console.log(resultObj);
                    videoAudioFormat.push(resultObj)
                }
            }
            res.json(200, { "statusCode": 200, "apiStatus": true, "Result": videoAudioFormat });
        } catch (error) {
            console.log(error);
            res.json(500, { "statusCode": 500, "apiStatus": false, "result": error.toString() });
        }
    },

    downloadFile: async(req, res) => {
        try {
            const bodyData = req.query
            if(!bodyData.url || !bodyData.id) {
                return res.json(200, { "statusCode": 400, "apiStatus": false, "Message": "url mandatory" });
            } 
            let info = await ytdl.getInfo(bodyData.url);
            let format = ytdl.chooseFormat(info.formats, { quality: bodyData.id });
            console.log('Format found!', format);
            let downloadpath = `skDownload.${format.container}`
            await ytdl(bodyData.url, { filter: format => format.itag == bodyData.id }).pipe(fs.createWriteStream(downloadpath));
            let filepath = path.join(__dirname + `/../${downloadpath}`);
            if (filepath) {
                // res.sendFile(filepath);
                res.download(filepath)
            }
            // res.json(200, { "statusCode": 200, "apiStatus": true, "Result": format });

            // ytdl('https://youtu.be/QeqS3vO_HeQ').pipe(fs.createWriteStream('video.mp4'));
            // res.end();
            // if (fs.existsSync(filepath)) {
            //     await fs.unlink(filepath, async function (err, data) {
            //         if (err) {
            //             console.log('error', err);
            //         };
            //     });
            // }
            
        } catch (error) {
            console.log(error);
            res.json(500, { "statusCode": 500, "apiStatus": false, "result": error.toString() });
        }
    }
}