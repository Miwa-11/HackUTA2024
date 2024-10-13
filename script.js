let mediaRecorder;
let recordedChunks = [];
const video = document.getElementById('video');
const playButton = document.getElementById('play-button');
const stopButton = document.getElementById('stop-button');

// 録画開始関数
function startRecording(stream) {
    const options = { mimeType: 'video/webm; codecs=vp9' };
    mediaRecorder = new MediaRecorder(stream, options);

    mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
            recordedChunks.push(event.data);
        }
    };

    mediaRecorder.onstop = () => {
        const blob = new Blob(recordedChunks, { type: 'video/webm' });
        const url = URL.createObjectURL(blob);
        console.log('Completed record', url);
        
       
        video.srcObject = null; 
        recordedChunks = []; 
    };

    mediaRecorder.start();
}

function stopRecording() {
    if (mediaRecorder && mediaRecorder.state === 'recording') {
        mediaRecorder.stop();
    }
}


playButton.addEventListener('click', async () => {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        video.srcObject = stream;
        startRecording(stream);
        
     
        playButton.style.display = 'none';
    } catch (err) {
        console.error('Error:', err);
    }
});


stopButton.addEventListener('click', stopRecording);


document.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
        stopRecording();
    }
});
