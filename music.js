const playerButton = document.getElementById('play--button');
const volumeButton = document.getElementById('player--volume');
const volumeInput = document.getElementById('player--control__volume');
const musicProgress = document.getElementById('player--control__process');

const songTitle = document.getElementById('player--info__title');
const songInfo = document.getElementById('player--info__song');
const songTime = document.getElementById('player--info__time');

// 声音按钮调控
volumeButton.addEventListener('click', function () {

    let curVolume = volumeInput.value;
    console.log(volumeButton.classList);
    volumeButton.classList.toggle('fa-volume-up');
    volumeButton.classList.toggle('fa-volume-mute');
    volumeInput.value = '0';
    // if (curVolume === '0' || curVolume === '100') {
    //     console.log(curVolume, 1);
    //     volumeButton.classList.toggle('fa-volume-mute');
    //     volumeButton.classList.toggle('fa-volume-up');
    // } else {
    //     volumeButton.classList.toggle('fa-volume-down');
    //     volumeButton.classList.toggle('fa-volume-mute');
    // }
});



window.onload = playSong;
// 播放音乐
let songSrc = '';
let song = new Audio();
let songDuration = 0;
let isPlaying = false;
const songList = [
    {
        src: '/music/Gymnopédies.mp3',
        img: '/music-img/Gymnopédies.jpg',
        title: 'Gymnopédies',
        singer: 'Erik Satie',
    },
    {
        src: '/music/Old Town Road.mp3',
        img: '/music-img/Lil Nas X.png',
        title: 'Old Town Road',
        singer: 'Lil Nas X',
    },
    {
        src: '/music/Daddy.mp3',
        img: '/music-img/Daddy.png',
        title: 'Daddy',
        singer: 'Coldplay',
    },
];
function playSong() {
    song.src = songList[0].src;
    // 改变暂停按钮和播放按钮
    playerButton.addEventListener('click', function () {
        playerButton.classList.toggle('fa-play');
        playerButton.classList.toggle('fa-pause');

        if (!isPlaying) {
            song.play();
            isPlaying = true;
            songDuration = song.duration;
            musicProgress.max = songDuration;
            songTitle.innerText = songList[0].title;
            songInfo.innerText = songList[0].singer;
        } else {
            song.pause();
            isPlaying = false;
        }
    });

    // 音乐进度条变化
    song.addEventListener('timeupdate', function () {
        const curTime = song.currentTime;
        musicProgress.value = curTime;

        songTime.innerText = `${formatSecondsAsTime(curTime)}/${formatSecondsAsTime(songDuration)}`;
        // song.currentTime = Number(musicProgress.value) / songDuration;
        // console.log(song.currentTime);
    });

    musicProgress.onchange = function () {
        song.currentTime = Number(musicProgress.value);
        console.log(typeof song.currentTime, formatSecondsAsTime(song.currentTime));

        songTime.innerText = `${formatSecondsAsTime(song.currentTime)}/${formatSecondsAsTime(songDuration)}`;
        if (song.currentTime === songDuration) {
            playerButton.classList.toggle('fa-pause');
        }
    };


    // 根据音量变化 改变icon
    volumeInput.onchange = function () {
        console.log(volumeInput.value);
        let classes = volumeButton.classList;
        if (volumeInput.value > '80') {
            classes.contains('fa-volume-mute') && classes.remove('fa-volume-mute');
            classes.contains('fa-volume-down') && classes.remove('fa-volume-down');
            classes.add('fa-volume-up');
        } else if (volumeInput.value === '0') {
            classes.contains('fa-volume-up') && classes.remove('fa-volume-up');
            classes.contains('fa-volume-down') && classes.remove('fa-volume-down');
            classes.add('fa-volume-mute');
        } else {
            classes.contains('fa-volume-mute') && classes.remove('fa-volume-mute');
            classes.contains('fa-volume-up') && classes.remove('fa-volume-up');
            classes.add('fa-volume-down');
        }
        song.volume = Number(volumeInput.value / 100);
    };


    // 按下M键实现静音
    document.onkeydown = function (event) {
        const e = event || window.event || arguments.callee.caller.arguments[0];
        let classes = volumeButton.classList;
        if (e && e.keyCode == 77) {
            if (classes.contains('fa-volume-mute')) {
                classes.contains('fa-volume-mute') && classes.remove('fa-volume-mute');
                classes.add('fa-volume-up');
            } else {
                classes.contains('fa-volume-up') && classes.remove('fa-volume-up');
                classes.contains('fa-volume-down') && classes.remove('fa-volume-down');
                classes.add('fa-volume-mute');
                volumeInput.value = '0';
            }

        }
    };
}

function formatSecondsAsTime(time) {
    let sec = new Number();
    let min = new Number();
    sec = Math.floor(time);
    min = Math.floor(sec / 60);
    min = min >= 10 ? min : '0' + min;
    sec = Math.floor(sec % 60);
    sec = sec >= 10 ? sec : '0' + sec;
    return min + ':' + sec;
}
console.log(formatSecondsAsTime(1000));