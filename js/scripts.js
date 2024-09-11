const content = document.querySelector(".content"),
Playimage = content.querySelector(".music-image img"),
musicName = content.querySelector(".music-titles .name"),
musicArtist = content.querySelector(".music-titles .artist"),
Audio = document.querySelector(".main-song"),
playBtn = content.querySelector(".play-pause"),
playBtnIcon = content.querySelector(".play-pause span"),
prevBtn = content.querySelector("#prev"),
nextBtn = content.querySelector("#next"),
progressBar = content.querySelector(".progress-bar"),
progressDetails = content.querySelector(".progress-details"),
repeatBtn = content.querySelector("#repeat"),
Shuffle = content.querySelector("#shuffle");

let index = 1;

window.addEventListener("load", ()=>{
    loadData(index);
    Audio.play();
});

function loadData(indexValue){
    musicName.innerHTML = songs[indexValue - 1].name;
    musicArtist.innerHTML = songs[indexValue - 1].artist;
    Playimage.src = "images/"+songs[indexValue - 1].img+".jpg";
    Audio.src ="music/"+songs[indexValue - 1].audio+".mp3";
}

playBtn.addEventListener("click", ()=>{
    const isMusicPaused = content.classList.contains("paused");
    if(isMusicPaused){
        pauseSong();
    }
    else{
        playSong();
    }
});
function playSong(){
    content.classList.add("paused");
    playBtnIcon.innerHTML = "pause";
    Audio.play();
}
function pauseSong(){
    content.classList.remove("paused");
    playBtnIcon.innerHTML = "play_arrow";
    Audio.pause();
}
nextBtn.addEventListener("click", ()=>{
    nextSong();
});
prevBtn.addEventListener("click", ()=>{
    prevSong();
});
function nextSong(){
    index++;
    if(index > songs.length){
        index = 1;
    }
    loadData(index);
    playSong();
}
function prevSong(){
    index--;
    if(index <= 0){
        index = songs.length;
    }
    else{
        index = index;
    }
    loadData(index);
    playSong();
}
Audio.addEventListener("timeupdate", (e)=>{
    const initialTime = e.target.currentTime;
    const finalTime = e.target.duration;
    let BarWidth = (initialTime / finalTime) * 100;
    progressBar.style.width = BarWidth+"%";

    progressDetails.addEventListener("click", (e)=>{
        let progressValue = progressDetails.clientWidth;
        let clickedOffsetX = e.offsetX;
        let MusicDuration = Audio.duration;

        Audio.currentTime = (clickedOffsetX / progressValue) * MusicDuration;
    });

    //timer-logic
    Audio.addEventListener("loadeddata", ()=>{
        let finalTimeData = content.querySelector(".final");

        //update-finalDuration
        let AudioDuration = Audio.duration;
        let finalMinutes = Math.floor(AudioDuration / 60);
        let finalSeconds = Math.floor(AudioDuration % 60);
        if(finalSeconds < 10){
            finalSeconds = "0"+finalSeconds;
        }
        finalTimeData.innerText = finalMinutes+":"+finalSeconds;
    });

    //update current duration
    let currentTimeData = content.querySelector(".current");
    let CurrentTime = Audio.currentTime;
    let currentMinutes = Math.floor(CurrentTime / 60);
    let currentSeconds = Math.floor(CurrentTime % 60);
    if(currentSeconds < 10){
    currentSeconds = "0"+currentSeconds;
    }
    currentTimeData.innerText = currentMinutes+":"+currentSeconds

    //repeat button logic
    repeatBtn.addEventListener("click", ()=>{
        Audio.currentTime = 0;
    });
});

Shuffle.addEventListener("click", ()=>{
    var randIndex = Math.floor(Math.random() * songs.length) + 1;
    loadData(randIndex);
    playSong();
});

Audio.addEventListener("ended", ()=>{
    index++;
    if(index > songs.length){
        index = 1;
    }
    loadData(index);
    playSong();
});

window.addEventListener("load", () => {
  loadData(index);
  Audio.play();
  displayTrackList();
});

function displayTrackList() {
  const trackListContainer = document.getElementById("track-list-container");
  trackListContainer.innerHTML = "";

  songs.forEach((song, idx) => {
    const listItem = document.createElement("li");

    const imageWrapper = document.createElement("div");
    imageWrapper.classList.add("image-wrapper");

    const image = document.createElement("img");
    image.src = `images/${song.img}.jpg`;
    image.title = song.name;
    image.classList.add("song-image");

    imageWrapper.appendChild(image);
    listItem.appendChild(imageWrapper);

    const songInfo = document.createElement("div");
    songInfo.classList.add("song-info");

    const songTitle = document.createElement("p");
    songTitle.textContent = song.name;
    songTitle.classList.add("song-title");

    const songArtist = document.createElement("p");
    songArtist.textContent = song.artist;
    songArtist.classList.add("song-artist");

    const songDuration = document.createElement("p");
    songDuration.textContent = formatTime(song.duration);
    songDuration.classList.add("song-duration");
    songInfo.appendChild(songTitle);
    songInfo.appendChild(songDuration);
    songInfo.appendChild(songArtist);
    

    listItem.appendChild(songInfo);

    listItem.addEventListener("click", () => {
      index = idx + 1;
      loadData(index);
      playSong();
    });

    trackListContainer.appendChild(listItem);
  });
}

function formatTime(seconds) {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
}

// Get the necessary elements
const volumeSlider = document.getElementById('volume-slider');
const muteButton = document.getElementById('mute');
const audioElement = document.querySelector('audio.main-song');

// Function to toggle mute
function toggleMute() {
  if (volumeSlider.value === '1') {
    volumeSlider.value = '0';
    muteButton.innerHTML = 'volume_up';
    audioElement.muted = true;
  } else {
    volumeSlider.value = '1';
    muteButton.innerHTML = 'volume_off';
    audioElement.muted = false;
  }
}

// Event listener for volume slider
volumeSlider.addEventListener('input', function() {
  audioElement.volume = volumeSlider.value;
  if (volumeSlider.value === '0') {
    muteButton.innerHTML = 'volume_up';
  } else {
    muteButton.innerHTML = 'volume_off';
  }
});