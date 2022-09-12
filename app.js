// task
// 1.Render song --> OK
// 2.Scroll to top --> OK
// 3.Play / pause / seek --> OK
// 4.CD rorate --> OK
// 5.Next / Prev
// 6.Random --> OK
// 7.Next / Repeat --> OK
// 8.Active song --> OK
// 9.Scroll active song into view -->
// 10.Play song when click --> OK
const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const PLAYER_STORAGE_KEY = 'F8_Player';
const heading = $('header h2');
const cdThumb = $('.cd-thumb');
const audio = $('#audio');
const cd = $('.cd');
const playBtn = $('.btn-toggle-play');
const player = $('.player');
const progress = $('.progress');
const nextBtn = $('.btn-next');
const prevBtn = $('.btn-prev');
const randomBtn = $('.btn-random');
const repeatBtn = $('.btn-repeat');
const playList = $('.playlist');
const app = {
    currentIndex:0,
    isPlaying: false,
    isRandom: false,
    isRepeat: false,
    config: JSON.parse(localStorage.getItem(PLAYER_STORAGE_KEY)) || {},
    songs: [
        {
            name: 'San Francisco',
            singer: 'Sun Rai',
            path: './assets/music/song1.mp4',
            img: './assets/image/song1.jpg'
        },
        {
            name: 'Lạc Trôi',
            singer: 'Sơn Tùng MTP',
            path: './assets/music/song2.mp3',
            img: './assets/image/song2.jpg'
        },
        {
            name: 'Dancing with my phone',
            singer: 'HYBS',
            path: './assets/music/song3.mp4',
            img: './assets/image/song3.jpg'
        },
        {
            name: 'Day 1',
            singer: 'HONNE',
            path: './assets/music/song4.mp4',
            img: './assets/image/song4.jpg'
        },
        {
            name: 'Only',
            singer: 'LeeHi',
            path: './assets/music/song5.mp4',
            img: './assets/image/song5.jpg'
        },
        {
            name: 'Love Me Like That',
            singer: 'Sam Kim',
            path: './assets/music/song6.mp4',
            img: './assets/image/song6.jpg'
        },
    ],
    setConfig: function(key,value){
        this.config[key] = value;
        localStorage.setItem(PLAYER_STORAGE_KEY, JSON.stringify(this.config))
    },
    render: function () {
        const htmls = this.songs.map(function (song, index) {
            return `
            <div class="song ${index === app.currentIndex ? 'active' : ''}" data-index="${index}">
            <div class="thumb" style="background-image: url('${song.img}')">
            </div>
            <div class="body">
              <h3 class="title">${song.name}</h3>
              <p class="author">${song.singer}</p>
            </div>
            <div class="option">
              <i class="fas fa-ellipsis-h"></i>
            </div>
          </div>`
        })
        playList.innerHTML = htmls.join('');
    },
    defineProperties: function () {
        Object.defineProperty(this, 'currentSong',{
            get: function(){
                return this.songs[this.currentIndex];
            }
        })
    },
    handleEvents: function () {
        const _this = this;
        const cdWidth = cd.offsetWidth;
        // xử lý quay đĩa nhạc / dừng đĩa nhạc
        const cdThumbanimated = cdThumb.animate([
            {transform: 'rotate(360deg)'}
        ],{
            duration:10000,
            iterations:Infinity
        })
        cdThumbanimated.pause();
        // Xử lý phóng to / thu nhỏ image
        document.onscroll = function () {
            const scrollTop = window.scrollY || document.documentElement.scrollTop;
            const newcdWidth = cdWidth - scrollTop;

            cd.style.width = newcdWidth > 0 ? newcdWidth + 'px' :0;
            cd.style.opacity = newcdWidth / cdWidth;
        }
        // Xử lý click play song
        playBtn.onclick = function () {
            // không dùng this trong đây được vì sử dụng this thì this nó lại là playBtn chứ không phải là this(app)
            if(_this.isPlaying)
            {
                audio.pause();
            }
            else{
                audio.play();
            }
        },
        // khi song được play thì
        audio.onplay = function () {
            _this.isPlaying = true;
            player.classList.add('playing');
            cdThumbanimated.play();
        }
        // khi song bị pause thì
        audio.onpause = function() {
            _this.isPlaying = false;
            player.classList.remove('playing');
            cdThumbanimated.pause();
        }
        // khi phát nhạc thanh tiến hành thay đổi theo time
        audio.ontimeupdate = function() {
            if(audio.duration){
                const progressPercent = Math.floor(audio.currentTime / audio.duration*100);
                progress.value = progressPercent;
            }
        }
        // xử lý khi tua
        progress.oninput = function(e) {
           const seekTime = (audio.duration / 100)*e.target.value;
           audio.currentTime = seekTime;
        }
        // next song
        nextBtn.onclick = function() {
            if(_this.isRandom){
                _this.playRandomSong();
            }else{
                _this.nextSong();
            }
            audio.play(); 
            _this.render();
            _this.scrollToActiveSong();
        }
        // prev song
        prevBtn.onclick = function() {
            if(_this.isRandom){
                _this.playRandomSong();
            }else{
                _this.prevSong();
            }
            audio.play();
            _this.render();
        }
        // xử lý bật / tắt random song
        randomBtn.onclick = function() {
            _this.isRandom = !_this.isRandom;
            _this.setConfig('isRandom', _this.isRandom);
            randomBtn.classList.toggle('active', _this.isRandom);
        }
        // xử lý lặp lại 1 bài hát
        repeatBtn.onclick = function() {
            _this.isRepeat = !_this.isRepeat;
            _this.setConfig('isRepeat', _this.isRepeat);
            repeatBtn.classList.toggle('active', _this.isRepeat);
        }
        // xử lý next song khi audio ended
        audio.onended = function() {
            if(_this.isRepeat){
                audio.play();
            }else{
                nextBtn.click();
            }
        },
        playList.onclick = function(e) {
            const songNode = e.target.closest('.song:not(.active)');
            const optionNode = e.target.closest('.option');
            if(songNode || optionNode){
                // xử lý khi click vào song
                if(songNode){
                    _this.currentIndex = Number(songNode.dataset.index);
                    _this.loadCurrentSong();
                    _this.render();
                    audio.play();
                }
                // xử lý khi click vào option
                if(optionNode)
                {

                }
            }
        }
    },
    scrollToActiveSong: function(){
        setTimeout(() => {
            $('.song.active').scrollIntoView({
                    behavior: 'smooth',
                    block: 'end',
                    inline: 'nearest'
            })
        },300)
    },
    loadCurrentSong: function () {
        heading.textContent = this.currentSong.name;
        cdThumb.style.backgroundImage = `url('${this.currentSong.img}')`;
        audio.src = this.currentSong.path;
    },
    loadConfig: function() {
        this.isRandom = this.config.isRandom;
        this.isRepeat = this.config.isRepeat;
       
    },
    nextSong: function() {
            this.currentIndex++;
            if(this.currentIndex >= this.songs.length)
            {
                this.currentIndex = 0;
            }
            this.loadCurrentSong();
    },
    prevSong: function() {
        this.currentIndex--;
        if(this.currentIndex < 0)
        {
            this.currentIndex = this.songs.length - 1;
        }
        this.loadCurrentSong();
    },  
    playRandomSong: function() {
        let newIndex;
        do
        {
            newIndex = Math.floor(Math.random() * this.songs.length)
        }while(newIndex === this.currentIndex)
        this.currentIndex = newIndex;
        this.loadCurrentSong();
    },
    start: function () {
        // Gán cấu hình từ config vào ứng dụng
        this.loadConfig();
        // Định nghĩa các thuộc tính cho Object
        this.defineProperties();

        // Lắng nghe / xử lý các sự kiện DOM
        this.handleEvents();

        // Tải bài hát đầu tiên vào UI khi chạy ứng dụng
        this.loadCurrentSong();
        // Render playlist
        this.render();

        // Hiển thị trạng thái ban đầu của button random & repeat 
        randomBtn.classList.toggle('active', this.isRandom);
        repeatBtn.classList.toggle('active', this.isRepeat);
    }
}
app.start();
