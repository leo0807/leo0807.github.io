const playerButton = document.getElementById('play--button');
playerButton.addEventListener('click', function () {
    playerButton.classList.toggle('fa-play');
    playerButton.classList.toggle('fa-pause');
})

const volumeButton = document.getElementById('player--volume');
const volumeInput = document.getElementById('player--control__volume');
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
})
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
}



document.onkeydown = function (event) {
    const e = event || window.event || arguments.callee.caller.arguments[0];
    // 按下M键
    if (e && e.keyCode == 77) {
        alert('下键');
    }
}