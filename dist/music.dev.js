"use strict";

var _songList = _interopRequireDefault(require("./songList"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

var playerButton = document.getElementById('play--button');
var volumeButton = document.getElementById('player--volume');
var volumeInput = document.getElementById('player--control__volume');
var musicProgress = document.getElementById('player--control__process');
var songTitle = document.getElementById('player--info__title');
var songInfo = document.getElementById('player--info__song');
var songTime = document.getElementById('player--info__time'); // 声音按钮调控

volumeButton.addEventListener('click', function () {
  var curVolume = volumeInput.value;
  console.log(volumeButton.classList);
  volumeButton.classList.toggle('fa-volume-up');
  volumeButton.classList.toggle('fa-volume-mute');
  volumeInput.value = '0'; // if (curVolume === '0' || curVolume === '100') {
  //     console.log(curVolume, 1);
  //     volumeButton.classList.toggle('fa-volume-mute');
  //     volumeButton.classList.toggle('fa-volume-up');
  // } else {
  //     volumeButton.classList.toggle('fa-volume-down');
  //     volumeButton.classList.toggle('fa-volume-mute');
  // }
});
window.onload = playSong; // 播放音乐

var songSrc = '';
var song = new Audio();
var songDuration = 0;
var isPlaying = false;

function playSong() {
  song.src = _songList["default"][0].src;
  songTime.innerText = "".concat(formatSecondsAsTime(song.currentTime), "/").concat(formatSecondsAsTime(songDuration)); // 改变暂停按钮和播放按钮

  playerButton.addEventListener('click', function () {
    playerButton.classList.toggle('fa-play');
    playerButton.classList.toggle('fa-pause');

    if (!isPlaying) {
      song.play();
      isPlaying = true;
      songDuration = song.duration;
      musicProgress.max = songDuration;
      songTitle.innerText = _songList["default"][0].title;
      songInfo.innerText = _songList["default"][0].singer;
    } else {
      song.pause();
      isPlaying = false;
    }
  }); // 音乐进度条变化

  song.addEventListener('timeupdate', function () {
    var curTime = song.currentTime;
    musicProgress.value = curTime;
    songTime.innerText = "".concat(formatSecondsAsTime(curTime), "/").concat(formatSecondsAsTime(songDuration)); // song.currentTime = Number(musicProgress.value) / songDuration;
    // console.log(song.currentTime);
  });

  musicProgress.onchange = function () {
    song.currentTime = Number(musicProgress.value);
    console.log(_typeof(song.currentTime), formatSecondsAsTime(song.currentTime));
    songTime.innerText = "".concat(formatSecondsAsTime(song.currentTime), "/").concat(formatSecondsAsTime(songDuration));

    if (song.currentTime === songDuration) {
      playerButton.classList.toggle('fa-pause');
    }
  }; // 根据音量变化 改变icon


  volumeInput.onchange = function () {
    console.log(volumeInput.value);
    var classes = volumeButton.classList;

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
  }; // 按下M键实现静音


  document.onkeydown = function (event) {
    var e = event || window.event || arguments.callee.caller.arguments[0];
    var classes = volumeButton.classList;

    if (e && e.keyCode == 77) {
      if (classes.contains('fa-volume-mute')) {
        classes.contains('fa-volume-mute') && classes.remove('fa-volume-mute');
        classes.add('fa-volume-up');
      } else {
        classes.contains('fa-volume-up') && classes.remove('fa-volume-up');
        classes.contains('fa-volume-down') && classes.remove('fa-volume-down');
        classes.add('fa-volume-mute');
        volumeInput.value = '0';
        song.volume = 0;
      }
    }
  };
}

function formatSecondsAsTime(time) {
  var sec = new Number();
  var min = new Number();
  sec = Math.floor(time);
  min = Math.floor(sec / 60);
  min = min >= 10 ? min : '0' + min;
  sec = Math.floor(sec % 60);
  sec = sec >= 10 ? sec : '0' + sec;
  return min + ':' + sec;
}

console.log(formatSecondsAsTime(1000));