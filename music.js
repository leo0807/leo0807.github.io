
const playerButton = document.getElementById('play--button');
const volumeButton = document.getElementById('player--volume');
const volumeInput = document.getElementById('player--control__volume');
const musicProgress = document.getElementById('player--control__process');

// 音乐信息 按钮
const songTitle = document.getElementById('player--info__title');
const songInfo = document.getElementById('player--info__song');
const songTime = document.getElementById('player--info__time');

// 播放按钮
const prev = document.getElementById('prev--button');
const next = document.getElementById('next--button');

// disk
const disk = document.getElementById('disk');
const diskp = document.querySelector('.player');

// 声音按钮调控
volumeButton.addEventListener('click', function () {

    let curVolume = volumeInput.value;
    volumeButton.classList.toggle('fa-volume-up');
    volumeButton.classList.toggle('fa-volume-mute');
    volumeInput.value = '0';
    // if (curVolume === '0' || curVolume === '100') {
    //     volumeButton.classList.toggle('fa-volume-mute');
    //     volumeButton.classList.toggle('fa-volume-up');
    // } else {
    //     volumeButton.classList.toggle('fa-volume-down');
    //     volumeButton.classList.toggle('fa-volume-mute');
    // }
});

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

// 页面加载完成后启动函数
window.onload = playSong;

// 全局变量存储， 进度和音量设置
let prevVolumeSet = volumeInput.value;
let preMusicSet = musicProgress.value;

// 播放音乐
let song = new Audio();
let songDuration = 0;
let isPlaying = false;
songTitle.innerText = songList[0].title;
songInfo.innerText = songList[0].singer;

let index = 0;
next.addEventListener('click', function () {
    console.log(disk.classList);
    console.log(disk.style.backgroundImage, typeof disk.style.backgroundImage, 1111);
    ++index;
    if (index >= songList.length - 1) {
        index = 0;
    }

    playSong();
    playerButton.click();
});

prev.addEventListener('click', function () {
    --index;
    if (index < 0) {
        index = songList.length - 1;
    }
    playSong();
    // playerButton.click();
});

function playSong() {
    song.src = songList[index].src;
    getDuration(song.src)
        .then(function (length) {
            songTime.innerText = `${formatSecondsAsTime(song.currentTime)}/${formatSecondsAsTime(length)}`;
        });
    // 改变暂停按钮和播放按钮
    playerButton.addEventListener('click', function () {
        playerButton.classList.toggle('fa-play');
        playerButton.classList.toggle('fa-pause');

        if (!isPlaying) {
            song.play();
            isPlaying = true;
            songDuration = song.duration;

            musicProgress.max = songDuration;
            disk.src = songList[1].img;
            songTitle.innerText = songList[index].title;
            songInfo.innerText = songList[index].singer;
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
    });

    // 当前音乐播放完毕
    song.addEventListener('ended', function () {
        song.currentTime = 0;
        song.pause();
        isPlaying = false;
        musicProgress.value = 0;
        playerButton.classList.contains('fa-pause') && playerButton.classList.remove('fa-pause');
        playerButton.classList.add('fa-play');
    });

    musicProgress.addEventListener('change', function () {
        song.currentTime = Number(musicProgress.value);

        songTime.innerText = `${formatSecondsAsTime(song.currentTime)}/${formatSecondsAsTime(songDuration)}`;
        if (song.currentTime === songDuration) {
            playerButton.classList.toggle('fa-pause');
        }
    });


    // 根据音量变化 改变icon
    volumeInput.onchange = function () {
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
                volumeInput.value = prevVolumeSet;
                song.volume = Number(prevVolumeSet / 100);
            } else {
                classes.contains('fa-volume-up') && classes.remove('fa-volume-up');
                classes.contains('fa-volume-down') && classes.remove('fa-volume-down');
                classes.add('fa-volume-mute');
                prevVolumeSet = volumeInput.value;
                volumeInput.value = '0';
                song.volume = 0;
            }

        }
    };
}

function formatSecondsAsTime(time) {
    let sec, min;
    sec = Math.floor(time);
    min = Math.floor(sec / 60);
    min = min >= 10 ? min : '0' + min;
    sec = Math.floor(sec % 60);
    sec = sec >= 10 ? sec : '0' + sec;
    return min + ':' + sec;
}



function getDuration(src) {
    return new Promise(function (resolve) {
        var audio = new Audio();
        audio.addEventListener("loadedmetadata", function () {
            resolve(audio.duration);
        });
        audio.src = src;
    });
}
