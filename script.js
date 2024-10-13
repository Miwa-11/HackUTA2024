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
        console.log('録画が完了しました:', url);
        
        // ビデオ要素をリセット
        video.srcObject = null; // ビデオストリームをクリア
        recordedChunks = []; // チャンクをリセット
    };

    mediaRecorder.start();
}

// 録画停止関数
function stopRecording() {
    if (mediaRecorder && mediaRecorder.state === 'recording') {
        mediaRecorder.stop();
    }
}

// 再生ボタンをクリックしたときの処理
playButton.addEventListener('click', async () => {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        video.srcObject = stream;
        startRecording(stream);
        
        // 再生ボタンを非表示にする
        playButton.style.display = 'none';
    } catch (err) {
        console.error('エラーが発生しました:', err);
    }
});

// 録画停止ボタンをクリックしたときの処理
stopButton.addEventListener('click', stopRecording);

// エンターキーを押したときに録画を停止する処理
document.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
        stopRecording();
    }
});
