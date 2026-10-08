// 全局变量
const BIRTHDAY_MONTH = 9; // JavaScript中月份从0开始，所以5月是4
const BIRTHDAY_DAY = 9;
const CELEBRATION_DAYS = 3; // 生日庆祝持续3天

// DOM元素
const countdownContainer = document.getElementById('countdown-container');
const birthdayContainer = document.getElementById('birthday-container');
const giftSection = document.getElementById('gift-section');
const giftBox = document.querySelector('.gift-box');
const daysElement = document.getElementById('days');
const hoursElement = document.getElementById('hours');
const minutesElement = document.getElementById('minutes');
const secondsElement = document.getElementById('seconds');
const musicToggle = document.getElementById('music-toggle');
const bgm = document.getElementById('bgm');
const canvas = document.getElementById('starry-sky');
const ctx = canvas.getContext('2d');
const fireworksCanvas = document.getElementById('fireworks-canvas');
const fireworksCtx = fireworksCanvas ? fireworksCanvas.getContext('2d') : null;
const loveTree = document.getElementById('love-tree');
const loveTreeCtx = loveTree ? loveTree.getContext('2d') : null;
const makeWishBtn = document.getElementById('make-wish-btn');

// 设置Canvas大小
function setCanvasSize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    if (fireworksCanvas) {
        fireworksCanvas.width = window.innerWidth;
        fireworksCanvas.height = window.innerHeight;
    }
}

// 星星类
class Star {
    constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 2;
        this.blinkSpeed = Math.random() * 0.05;
        this.alpha = Math.random();
        this.alphaChange = this.blinkSpeed;
    }

    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${this.alpha})`;
        ctx.fill();
    }

    update() {
        // 闪烁效果
        this.alpha += this.alphaChange;
        if (this.alpha <= 0 || this.alpha >= 1) {
            this.alphaChange = -this.alphaChange;
        }
        // 微小移动
        this.x += (Math.random() - 0.5) * 0.3;
        this.y += (Math.random() - 0.5) * 0.3;
        // 边界检查
        if (this.x < 0) this.x = canvas.width;
        if (this.x > canvas.width) this.x = 0;
        if (this.y < 0) this.y = canvas.height;
        if (this.y > canvas.height) this.y = 0;
        this.draw();
    }
}

// 流星类
class ShootingStar {
    constructor() {
        this.reset();
    }

    reset() {
        this.x = Math.random() * canvas.width;
        this.y = 0;
        this.length = Math.random() * 80 + 50;
        this.speed = Math.random() * 10 + 10;
        this.angle = Math.PI / 4 + (Math.random() * Math.PI / 4);
        this.alpha = 1;
        this.active = true;
    }

    draw() {
        if (!this.active) return;

        ctx.strokeStyle = `rgba(255, 255, 255, ${this.alpha})`;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(this.x, this.y);
        const endX = this.x + Math.cos(this.angle) * this.length;
        const endY = this.y + Math.sin(this.angle) * this.length;
        ctx.lineTo(endX, endY);
        ctx.stroke();
    }

    update() {
        if (!this.active) {
            if (Math.random() < 0.005) { // 控制流星出现的频率
                this.reset();
            }
            return;
        }

        this.x += Math.cos(this.angle) * this.speed;
        this.y += Math.sin(this.angle) * this.speed;

        // 淡出效果
        this.alpha -= 0.01;

        if (this.y > canvas.height || this.x < 0 || this.x > canvas.width || this.alpha <= 0) {
            this.active = false;
        }

        this.draw();
    }
}

// 爱心类
class Heart {
    constructor() {
        this.reset();
    }

    reset() {
        this.x = Math.random() * canvas.width;
        this.y = canvas.height + 50;
        this.size = Math.random() * 15 + 15;
        this.speed = Math.random() * 3 + 1;
        this.color = `hsl(${340 + Math.random() * 40}, 100%, ${60 + Math.random() * 20}%)`;
        this.rotation = Math.random() * Math.PI * 2;
        this.rotationSpeed = (Math.random() - 0.5) * 0.05;
    }

    draw() {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rotation);
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.bezierCurveTo(0, -this.size / 2, this.size, -this.size, 0, this.size);
        ctx.bezierCurveTo(-this.size, -this.size, 0, -this.size / 2, 0, this.size / 2);
        ctx.fill();
        ctx.restore();
    }

    update() {
        this.y -= this.speed;
        this.rotation += this.rotationSpeed;

        if (this.y < -this.size) {
            this.reset();
        }

        this.draw();
    }
}

// 烟花粒子类
class FireworkParticle {
    constructor(x, y, color) {
        this.x = x;
        this.y = y;
        this.color = color || `hsl(${Math.random() * 360}, 100%, 70%)`;
        this.velocity = {
            x: (Math.random() - 0.5) * 6,
            y: (Math.random() - 0.5) * 6
        };
        this.alpha = 1;
        this.decay = Math.random() * 0.02 + 0.01;
        this.gravity = 0.1;
        this.size = Math.random() * 3 + 1;
    }

    draw() {
        fireworksCtx.beginPath();
        fireworksCtx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        fireworksCtx.fillStyle = `rgba(${this.color}, ${this.alpha})`;
        fireworksCtx.fill();
    }

    update() {
        this.velocity.y += this.gravity;
        this.x += this.velocity.x;
        this.y += this.velocity.y;
        this.alpha -= this.decay;
        this.draw();
    }
}

// 烟花类
class Firework {
    constructor() {
        this.reset();
    }

    reset() {
        this.x = Math.random() * fireworksCanvas.width;
        this.y = fireworksCanvas.height;
        this.targetY = Math.random() * (fireworksCanvas.height * 0.6);
        this.speed = Math.random() * 2 + 2;
        this.particles = [];
        this.color = `${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}`;
        this.exploded = false;
    }

    explode() {
        this.exploded = true;
        // 创建爆炸粒子
        for (let i = 0; i < 100; i++) {
            this.particles.push(new FireworkParticle(this.x, this.y, this.color));
        }
        // 播放爆炸声音效果（可选，合成音效，不依赖音频文件）
        if (Math.random() > 0.7) { // 不是每个烟花都播放声音，以避免声音重叠
            playPopSound();
        }
    }

    draw() {
        if (!this.exploded) {
            fireworksCtx.beginPath();
            fireworksCtx.arc(this.x, this.y, 3, 0, Math.PI * 2);
            fireworksCtx.fillStyle = `rgb(${this.color})`;
            fireworksCtx.fill();
        }
    }

    update() {
        if (!this.exploded) {
            this.y -= this.speed;

            // 到达目标位置，爆炸
            if (this.y <= this.targetY) {
                this.explode();
            }
            this.draw();
        } else {
            // 更新粒子
            for (let i = this.particles.length - 1; i >= 0; i--) {
                this.particles[i].update();
                if (this.particles[i].alpha <= 0) {
                    this.particles.splice(i, 1);
                }
            }

            // 当所有粒子消失，重新生成烟花
            if (this.particles.length === 0) {
                this.reset();
            }
        }
    }
}

// 爱心树类
class LoveTree {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.branches = [];
        this.hearts = [];

        // 创建初始树干
        this.addBranch(canvas.width / 2, canvas.height, canvas.width / 2, canvas.height - 100, 10);

        // 添加树枝
        this.growTree(canvas.width / 2, canvas.height - 100, 270, 8, 3);

        // 设置点击事件
        this.canvas.addEventListener('click', (e) => {
            const rect = this.canvas.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            this.addHeart(x, y);
        });
    }

    addBranch(startX, startY, endX, endY, width) {
        this.branches.push({
            startX,
            startY,
            endX,
            endY,
            width
        });
    }

    growTree(x, y, angle, width, depth) {
        if (depth === 0) return;

        const length = 30 + Math.random() * 20;
        const endX = x + Math.cos(angle * Math.PI / 180) * length;
        const endY = y + Math.sin(angle * Math.PI / 180) * length;

        this.addBranch(x, y, endX, endY, width);

        const branchCount = 2 + Math.floor(Math.random() * 2);
        for (let i = 0; i < branchCount; i++) {
            const newAngle = angle + (-20 + Math.random() * 40);
            this.growTree(endX, endY, newAngle, width * 0.7, depth - 1);
        }
    }

    addHeart(x, y) {
        this.hearts.push({
            x,
            y,
            size: 5 + Math.random() * 10,
            color: `hsl(${340 + Math.random() * 40}, 100%, 60%)`,
            alpha: 1,
            rotation: Math.random() * Math.PI * 2
        });
    }

    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // 绘制树枝
        for (const branch of this.branches) {
            this.ctx.beginPath();
            this.ctx.moveTo(branch.startX, branch.startY);
            this.ctx.lineTo(branch.endX, branch.endY);
            this.ctx.strokeStyle = '#573b1f';
            this.ctx.lineWidth = branch.width;
            this.ctx.stroke();
        }

        // 绘制爱心
        for (const heart of this.hearts) {
            this.ctx.save();
            this.ctx.translate(heart.x, heart.y);
            this.ctx.rotate(heart.rotation);
            this.ctx.fillStyle = heart.color;
            this.ctx.globalAlpha = heart.alpha;

            this.ctx.beginPath();
            this.ctx.bezierCurveTo(0, -heart.size / 2, heart.size, -heart.size, 0, heart.size);
            this.ctx.bezierCurveTo(-heart.size, -heart.size, 0, -heart.size / 2, 0, heart.size / 2);
            this.ctx.fill();

            this.ctx.restore();
        }
    }

    update() {
        // 更新爱心状态
        for (let i = this.hearts.length - 1; i >= 0; i--) {
            const heart = this.hearts[i];
            heart.alpha -= 0.003;
            heart.rotation += 0.01;

            if (heart.alpha <= 0) {
                this.hearts.splice(i, 1);
            }
        }

        this.draw();
    }
}

// 创建星星
let stars = [];
let shootingStars = [];
let hearts = [];
let fireworks = [];
let loveTreeObj = null;
let isBirthday = false;

function initStars() {
    stars = [];
    for (let i = 0; i < 200; i++) {
        stars.push(new Star());
    }
}

function initShootingStars() {
    shootingStars = [];
    for (let i = 0; i < 3; i++) {
        const shootingStar = new ShootingStar();
        shootingStar.active = false; // 初始设置为不活跃
        shootingStars.push(shootingStar);
    }
}

function initHearts() {
    hearts = [];
    if (isBirthday) {
        for (let i = 0; i < 20; i++) {
            hearts.push(new Heart());
        }
    }
}

function initFireworks() {
    if (!fireworksCtx) return;

    fireworks = [];
    for (let i = 0; i < 5; i++) {
        fireworks.push(new Firework());
    }
}

function initLoveTree() {
    if (loveTree) {
        loveTreeObj = new LoveTree(loveTree);
    }
}

// 渲染星空
function renderStarrySky() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // 绘制星空背景
    const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
    gradient.addColorStop(0, '#0a0e2c');
    gradient.addColorStop(1, '#1a1b3a');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // 更新星星
    stars.forEach(star => star.update());

    // 更新流星
    shootingStars.forEach(shootingStar => shootingStar.update());

    // 更新爱心
    if (isBirthday) {
        hearts.forEach(heart => heart.update());
    }

    requestAnimationFrame(renderStarrySky);
}

// 渲染烟花
function renderFireworks() {
    if (!fireworksCtx) return;

    fireworksCtx.fillStyle = 'rgba(0, 0, 0, 0.2)';
    fireworksCtx.fillRect(0, 0, fireworksCanvas.width, fireworksCanvas.height);

    fireworks.forEach(firework => firework.update());

    if (isBirthday) {
        requestAnimationFrame(renderFireworks);
    }
}

// 更新爱心树
function updateLoveTree() {
    if (loveTreeObj) {
        loveTreeObj.update();
    }

    if (isBirthday) {
        requestAnimationFrame(updateLoveTree);
    }
}

// 检查是否是生日
function checkBirthday() {
    const now = new Date();
    const currentYear = now.getFullYear();
    const birthdayDate = new Date(currentYear, BIRTHDAY_MONTH, BIRTHDAY_DAY);
    const nextDay = new Date(birthdayDate);
    nextDay.setDate(nextDay.getDate() + CELEBRATION_DAYS);

    // 检查当前日期是否在生日范围内（包括额外庆祝天数）
    if (now >= birthdayDate && now < nextDay) {
        // 是生日期间，显示祝福
        isBirthday = true;
        countdownContainer.classList.add('hidden');
        birthdayContainer.classList.remove('hidden');

        // 只显示第一个部分greeting-section，其他部分完全隐藏
        document.getElementById('greeting-section').classList.remove('hidden');

        // 隐藏其他所有部分
        document.querySelectorAll('.fullscreen-section:not(#greeting-section)').forEach(section => {
            section.style.display = "none"; // 使用display:none完全隐藏，而不仅是添加hidden类
        });

        initHearts(); // 初始化爱心

        // 初始化生日特效
        if (fireworksCtx) {
            initFireworks();
            renderFireworks();
        }

        // 初始化礼物盒点击事件
        if (giftBox) {
            setupGiftBox();
        }
    } else {
        // 不是生日，显示倒计时
        isBirthday = false;
        countdownContainer.classList.remove('hidden');
        birthdayContainer.classList.add('hidden');
        updateCountdown();
    }
}

// 设置礼物盒开启效果
function setupGiftBox() {
    giftBox.addEventListener('click', () => {
        giftBox.classList.add('opened');

        // 礼物盒动画后显示内容
        setTimeout(() => {
            giftSection.classList.add('opened');

            // 显示祝福信息和滚动指示器
            const birthdayMessage = document.querySelector('#greeting-section .birthday-message');
            const scrollIndicator = document.querySelector('#greeting-section .scroll-indicator');

            if (birthdayMessage) birthdayMessage.classList.remove('hidden');
            if (scrollIndicator) {
                scrollIndicator.classList.remove('hidden');
                scrollIndicator.classList.add('scroll-indicator-visible'); // 添加可见类
            }

            // 显示所有全屏部分
            setTimeout(() => {
                // 先恢复其他部分的display属性，再移除hidden类
                document.querySelectorAll('.fullscreen-section:not(#greeting-section)').forEach(section => {
                    section.style.display = ""; // 恢复默认显示
                    section.classList.remove('hidden');

                    // 同时显示其他部分的滚动指示器（最后一个部分除外，由setupScrollIndicators隐藏）
                    const sectionIndicator = section.querySelector('.scroll-indicator');
                    if (sectionIndicator) {
                        sectionIndicator.classList.add('scroll-indicator-visible');
                    }
                });

                // 初始化爱心树
                if (loveTree) {
                    initLoveTree();
                    updateLoveTree();
                }

                // 额外的祝贺效果
                showSpecialWishes();
            }, 500);
        }, 1000);
    });
}

// 许愿功能
function setupWishMaking() {
    if (!makeWishBtn) return;

    makeWishBtn.addEventListener('click', () => {
        const flame = document.querySelector('.flame');
        const wishResult = document.getElementById('wish-result');

        if (flame) {
            // 蜡烛熄灭效果
            flame.style.animation = 'none';
            flame.style.opacity = '0';
            flame.style.transform = 'translateY(10px) scale(0.5)';
            flame.style.filter = 'blur(8px)';

            // 播放风吹声音效果（用 Web Audio 合成，无需音频文件；
            // 原来是 new Audio() 且没设 src，在 iOS 上必然报 NotAllowedError/无源错误）
            playBlowSound();

            // 许愿成功动画
            setTimeout(() => {
                // 创建并显示漂亮的成功提示
                if (wishResult) {
                    const wishMessageEl = document.createElement('div');
                    wishMessageEl.className = 'wish-success';
                    wishMessageEl.innerHTML = '✨ 生日愿望已送出 ✨<br>愿你心想事成!';
                    wishResult.appendChild(wishMessageEl);
                    wishResult.style.opacity = '1';

                    // 添加烟花庆祝效果
                    if (fireworks && fireworks.length) {
                        for (let i = 0; i < 5; i++) {
                            setTimeout(() => {
                                fireworks.push(new Firework());
                            }, i * 300);
                        }
                    }
                }

                // 禁用按钮，防止重复点击
                makeWishBtn.disabled = true;
                makeWishBtn.textContent = '愿望已送出';
                makeWishBtn.style.background = '#ccc';

                // 添加特殊效果：散落的金色粒子
                createGoldParticles();
            }, 500);
        }
    });
}

// 创建金色粒子效果
function createGoldParticles() {
    const cakeContainer = document.querySelector('.cake-container');
    if (!cakeContainer) return;

    for (let i = 0; i < 30; i++) {
        const particle = document.createElement('div');
        particle.className = 'gold-particle';

        // 随机位置和大小
        const size = 3 + Math.random() * 5;
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        particle.style.position = 'absolute';
        particle.style.backgroundColor = `hsl(${40 + Math.random() * 20}, 100%, ${70 + Math.random() * 20}%)`;
        particle.style.borderRadius = '50%';
        particle.style.boxShadow = '0 0 10px rgba(255, 215, 0, 0.8)';

        // 初始位置（从蜡烛处发散）
        particle.style.left = '50%';
        particle.style.top = '0';
        particle.style.transform = 'translate(-50%, -50%)';

        // 随机动画
        const duration = 1 + Math.random() * 2;
        const delay = Math.random() * 0.5;

        // 设置运动方向（随机角度）
        const angle = Math.random() * Math.PI * 2;
        const distance = 50 + Math.random() * 100;
        const endX = Math.cos(angle) * distance;
        const endY = Math.sin(angle) * distance + 50; // 让粒子大致向下落

        // 应用动画
        particle.style.animation = `moveParticle ${duration}s ease-out ${delay}s forwards`;

        // 添加关键帧动画样式
        const style = document.createElement('style');
        style.textContent = `
            @keyframes moveParticle {
                0% {
                    transform: translate(-50%, -50%);
                    opacity: 1;
                }
                100% {
                    transform: translate(calc(-50% + ${endX}px), calc(-50% + ${endY}px));
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(style);

        // 添加到容器
        cakeContainer.appendChild(particle);

        // 动画结束后移除
        setTimeout(() => {
            particle.remove();
            style.remove();
        }, (duration + delay) * 1000 + 100);
    }
}

// 显示特别的祝福效果
function showSpecialWishes() {
    // 自动生成一些爱心在爱心树上
    if (loveTreeObj) {
        for (let i = 0; i < 5; i++) {
            setTimeout(() => {
                const x = Math.random() * loveTree.width;
                const y = Math.random() * (loveTree.height * 0.7);
                loveTreeObj.addHeart(x, y);
            }, i * 300);
        }
    }

    // 设置许愿功能
    setupWishMaking();
}

// 更新倒计时
function updateCountdown() {
    const now = new Date();
    const currentYear = now.getFullYear();
    let birthdayDate = new Date(currentYear, BIRTHDAY_MONTH, BIRTHDAY_DAY);

    // 如果今年的生日已经过了，使用明年的生日日期
    if (now > birthdayDate) {
        birthdayDate = new Date(currentYear + 1, BIRTHDAY_MONTH, BIRTHDAY_DAY);
    }

    const diffTime = birthdayDate - now;

    // 计算剩余时间
    const days = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diffTime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diffTime % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diffTime % (1000 * 60)) / 1000);

    // 更新DOM
    daysElement.textContent = days.toString().padStart(2, '0');
    hoursElement.textContent = hours.toString().padStart(2, '0');
    minutesElement.textContent = minutes.toString().padStart(2, '0');
    secondsElement.textContent = seconds.toString().padStart(2, '0');

    // 在生日即将到来时(小于7天)添加特殊效果
    const birthdayReminder = document.querySelector('.birthday-reminder');
    if (birthdayReminder) {
        if (days < 7) {
            birthdayReminder.classList.add('coming-soon');

            // 当天数小于1时更新提示文字
            if (days < 1) {
                const reminderText = birthdayReminder.querySelector('.reminder-text');
                if (reminderText) {
                    reminderText.innerHTML = "今天是特别的日子！<strong>点击刷新</strong>查看为你准备的惊喜！";

                    // 添加点击事件，刷新页面
                    if (!reminderText.hasClickHandler) {
                        reminderText.addEventListener('click', () => {
                            window.location.reload();
                        });
                        reminderText.style.cursor = 'pointer';
                        reminderText.hasClickHandler = true;
                    }
                }
            }
        } else {
            birthdayReminder.classList.remove('coming-soon');
        }
    }
}

/* ---------- 音乐状态（集中声明，避免函数引用到尚未初始化的 let/const）---------- */

// 首页/祝福首段的背景音乐
const INITIAL_TRACK = 'assets/audio/birthday-music.mp3';

// 各段对应的音频文件，按 section id 索引；进入蛋糕段时切换
const TRACKS = {
    'cake-section': 'assets/audio/only%20one%20AKA.MP3',
    'rose-section': 'assets/audio/only%20one%20AKA.MP3'
};

let currentTrack = '';      // 当前已设置的音频源
let bgmWantPlay = false;    // 用户是否希望音乐在播（换源后续播、重试都以它为准）
let bgmRetryLeft = 0;       // 剩余重试次数，避免无限轮询
let bgmRetryTimer = null;

// 音乐控制
function setupMusicControl() {
    // 点击音乐按钮：显式开/关
    musicToggle.addEventListener('click', () => {
        if (bgm.paused) {
            bgmWantPlay = true;
            playBgm();
        } else {
            bgmWantPlay = false;
            cancelBgmRetry();
            bgm.pause();
            musicToggle.classList.remove('playing');
        }
    });

    // 源就绪（含换源后的重新加载）→ 若用户想听就补播
    ['loadedmetadata', 'loadeddata', 'canplay', 'canplaythrough'].forEach(evt => {
        bgm.addEventListener(evt, onBgmReady);
    });

    // 点页面任意位置时，如果音乐还没播起来就再试一次（手势内调用才有效）
    ['touchstart', 'click'].forEach(evt => {
        document.addEventListener(evt, () => {
            if (bgmWantPlay && bgm && bgm.paused) playBgm();
        }, { passive: true });
    });
}

// 统一的首次手势解锁：iOS Safari 上音频/视频都必须在用户手势里 init 一次
let audioUnlocked = false;
function unlockAudio() {
    if (audioUnlocked) return;
    audioUnlocked = true;

    // 初始音频（<audio> 已不写死 src，切歌靠换源实现）
    if (bgm && !bgm.getAttribute('src')) {
        currentTrack = INITIAL_TRACK;
        bgm.setAttribute('src', INITIAL_TRACK);
        bgm.load();
    }

    /* 注意：这里不能先调"播放再暂停"式的解锁（unlockAudioElement），
       否则它的 cleanup pause 会紧跟在 playBgm() 的 play 之后执行，
       把刚开始的背景音乐立刻掐断（实测两者在同一个 microtask 里结算）。
       playBgm() 本身就在用户手势调用栈内，play() 成功即等于完成解锁。 */
    if (bgm && bgm.paused) playBgm();
}

// 播放背景音乐，并把按钮状态与真实播放状态对齐（只在真的播起来时才标记 playing）
function playBgm() {
    if (!bgm) return;
    bgmWantPlay = true;

    // 源还没就绪（load() 之后 readyState 会归零）：等 canplay 再试，不要空转
    if (bgm.readyState < 2 && bgm.networkState !== 3) {
        musicToggle.classList.remove('playing');
        scheduleBgmRetry();
        return;
    }

    cancelBgmRetry();

    const p = bgm.play();
    if (!p || typeof p.catch !== 'function') {
        musicToggle.classList.add('playing');
        hideSoundHint();
        markAudioUnlocked();
        return;
    }

    p.then(() => {
        musicToggle.classList.add('playing');
        hideSoundHint();
        markAudioUnlocked();
    }).catch(() => {
        // 被策略拦截（例如还没有用户手势）：保持按钮为"未播放"，等下一次手势
        musicToggle.classList.remove('playing');
        showSoundHint();
        scheduleBgmRetry();
    });
}

// 源就绪后自动补播（只在用户确实想要播放时）
function onBgmReady() {
    if (bgmWantPlay && bgm && bgm.paused) playBgm();
}

// 有限次重试，避免无限轮询
function scheduleBgmRetry() {
    if (bgmRetryTimer || bgmRetryLeft >= 10) return;
    bgmRetryLeft++;
    bgmRetryTimer = setTimeout(() => {
        bgmRetryTimer = null;
        if (bgmWantPlay && bgm && bgm.paused) playBgm();
    }, 800);
}

function cancelBgmRetry() {
    if (bgmRetryTimer) {
        clearTimeout(bgmRetryTimer);
        bgmRetryTimer = null;
    }
    bgmRetryLeft = 0;
}

// play() 成功即说明该元素已被浏览器允许播放（iOS 上等于完成解锁）
function markAudioUnlocked() {
    if (bgm) bgm.dataset.unlocked = '1';
}

/* ---------- 音乐切换：进入蛋糕板块时换成第二首 ---------- */

// 换源并续播。iOS Safari 上 <audio> 只需解锁一次（首次用户手势），
// 之后换源仍然可以直接播放。先缓冲新源再切，避免出现静音空档。
function switchTrack(src, autoplay) {
    if (!bgm || !src || currentTrack === src) return;
    currentTrack = src;

    if (autoplay) bgmWantPlay = true;

    bgm.setAttribute('src', src);
    bgm.load();

    // load() 之后 readyState 归零，playBgm 会先返回并安排重试；
    // 这里再补一次，等新源可播时立刻续上（setupMusicControl 的 canplay 监听也会触发补播）
    setTimeout(() => { if (bgmWantPlay && bgm && bgm.paused) playBgm(); }, 600);
    setTimeout(() => { if (bgmWantPlay && bgm && bgm.paused) playBgm(); }, 1600);
}

/* 用"哪个 section 占据视口中心"来判断当前处于哪一段。
   不用 IntersectionObserver 的 threshold：section 都是 100vh，
   相邻两段会同时满足阈值，导致音乐来回切换。
   注意：页面真正的滚动容器是 #birthday-container（overflow:auto），
   在它上面监听 scroll，window 的 scroll 事件不会有任何触发。 */
function setupMusicSwitching(sections) {
    const scroller = document.getElementById('birthday-container') || window;
    let ticking = false;

    function apply() {
        ticking = false;
        const birthday = document.getElementById('birthday-container');
        if (birthday && birthday.classList.contains('hidden')) return;

        const mid = window.innerHeight / 2;
        let active = null;
        sections.forEach(s => {
            const r = s.getBoundingClientRect();
            if (r.top <= mid && r.bottom > mid) active = s;
        });
        if (!active) return;

        const src = TRACKS[active.id];
        if (src && currentTrack !== src) switchTrack(src, true);
    }

    const onScroll = () => {
        if (ticking) return;
        ticking = true;
        requestAnimationFrame(apply);
    };

    scroller.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('scroll', onScroll, { passive: true }); // 兼容将来改成整页滚动
    window.addEventListener('resize', apply);

    // 点滚动指示器跳屏用的是 smooth scroll，滚动事件可能不触发，补一次延迟检查
    document.querySelectorAll('.scroll-indicator').forEach(el => {
        el.addEventListener('click', () => {
            setTimeout(apply, 400);
            setTimeout(apply, 900);
        });
    });

    apply();
}

/* ---------- 封面页的声音提示 ---------- */

// 隐藏右下角"点 ♪ 打开声音"的提示（用户已经开了声音，或已经离开封面页）
function hideSoundHint() {
    const hint = document.getElementById('sound-hint');
    if (!hint || hint.classList.contains('hidden')) return;

    hint.classList.add('hidden');
    setTimeout(() => { if (hint.parentNode) hint.parentNode.removeChild(hint); }, 700);
}

// 自动播放被拦时重新显示提示
function showSoundHint() {
    const hint = document.getElementById('sound-hint');
    if (!hint) return;
    hint.classList.remove('hidden');
}

// 进入生日祝福（离开封面页）后就不再需要这个提示
function setupSoundHint() {
    const birthday = document.getElementById('birthday-container');
    const countdown = document.getElementById('countdown-container');
    if (!birthday || !countdown) return;

    const observer = new MutationObserver(() => {
        if (!birthday.classList.contains('hidden')) hideSoundHint();
    });
    observer.observe(birthday, { attributes: true, attributeFilter: ['class'] });
}

/* 用 Web Audio 合成短音效，不依赖任何音频文件。
   说明：页面唯一的持续声音来源是 #bgm（assets/audio/birthday-music.mp3），
   这里只生成两个交互瞬时音效（吹蜡烛 / 烟花爆开），且只在
   用户手势调用栈内触发，iOS Safari 才允许出声。
   （原来用 new Audio() 但没设 src，在所有浏览器上都必然失败并报 NotAllowedError） */
let fxAudioCtx = null;
function getFxAudioContext() {
    const Ctx = window.AudioContext || window.webkitAudioContext;
    if (!Ctx) return null;

    // 复用同一个 AudioContext：iOS 上每创建一次都要重新 resume，且数量有上限
    if (!fxAudioCtx || fxAudioCtx.state === 'closed') fxAudioCtx = new Ctx();
    if (fxAudioCtx.state === 'suspended' && typeof fxAudioCtx.resume === 'function') {
        fxAudioCtx.resume();
    }
    return fxAudioCtx;
}

/* 白噪声 + 低通扫频 + 指数衰减包络，用来合成"呼"声或"噗"声
   @param duration   时长（秒）
   @param volume     峰值音量
   @param startFreq  低通起始频率
   @param endFreq    低通结束频率
   @param decayPower 包络衰减指数，越大衰减越快（更短促） */
function playNoiseBurst(duration, volume, startFreq, endFreq, decayPower) {
    try {
        const ctx = getFxAudioContext();
        if (!ctx) return;

        const sampleRate = ctx.sampleRate;
        const buffer = ctx.createBuffer(1, Math.max(1, Math.floor(sampleRate * duration)), sampleRate);
        const data = buffer.getChannelData(0);

        for (let i = 0; i < data.length; i++) {
            const t = i / data.length;
            // 快速淡入 + 幂次衰减，模拟气流
            const envelope = Math.pow(1 - t, decayPower) * (1 - Math.exp(-t * 30));
            data[i] = (Math.random() * 2 - 1) * envelope;
        }

        const source = ctx.createBufferSource();
        source.buffer = buffer;

        const filter = ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(startFreq, ctx.currentTime);
        filter.frequency.exponentialRampToValueAtTime(Math.max(1, endFreq), ctx.currentTime + duration);

        const gain = ctx.createGain();
        gain.gain.setValueAtTime(volume, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);

        source.connect(filter);
        filter.connect(gain);
        gain.connect(ctx.destination);
        source.start();
        source.stop(ctx.currentTime + duration);
        // 不 close 共享的 AudioContext，只让节点自然结束被回收
    } catch (e) {
        // 音效失败不影响主流程
    }
}

// 吹蜡烛：较长、较柔的"呼——"
function playBlowSound() {
    playNoiseBurst(0.5, 0.28, 1200, 320, 2.2);
}

// 烟花爆开：短促的"噗"
function playPopSound() {
    playNoiseBurst(0.16, 0.16, 2400, 500, 4.5);
}

// 窗口调整大小处理
window.addEventListener('resize', () => {
    setCanvasSize();
    initStars();
    initShootingStars();
    initHearts();

    if (isBirthday && fireworksCtx) {
        fireworksCanvas.width = window.innerWidth;
        fireworksCanvas.height = window.innerHeight;
        initFireworks();
    }
});

// 处理滚动指示器显示逻辑
function setupScrollIndicators() {
    const sections = document.querySelectorAll('.fullscreen-section');
    // 最后一个部分不需要滚动指示器（当前为 #cake-section）
    const lastSection = sections[sections.length - 1];
    const lastSectionIndicator = lastSection ? lastSection.querySelector('.scroll-indicator') : null;

    if (lastSectionIndicator) {
        lastSectionIndicator.style.display = 'none';
    }

    // 点击滚动指示器时，滚动到下一部分
    document.querySelectorAll('.scroll-indicator').forEach((indicator, index) => {
        indicator.addEventListener('click', () => {
            if (index < sections.length - 1) {
                sections[index + 1].scrollIntoView({ behavior: 'smooth' });
            }
        });
    });
}

/* 视频板块的 iOS Safari 播放策略适配
   Safari/iOS 规则：
   - inline 自动播放必须同时满足 muted + playsinline（HTML 属性已声明，这里再兜一次 DOM 属性，
     因为部分老版本只认属性、不认 HTML 解析结果）；
   - 一旦被策略拦截，必须由"用户手势"的同步调用栈里再次调用 play() 才能恢复；
   - 切后台/来回跳转（Safari 往返缓存）后元素会暂停，需要重新 play()。
   因此这里做三件事：起播兜底 + 全局首次手势解锁 + 回前台恢复。 */
function initSectionVideos() {
    const videos = Array.from(document.querySelectorAll('.video-section video'));
    if (!videos.length) return;

    /* 强制静音：视频板块一律不出声，所有声音只由 #bgm（assets/audio/birthday-music.mp3）负责。
       除了元素属性，运行时再把 volume 归零，并且每次 play 都重新确认一次，
       这样即使以后换成带音轨的素材也不会突然出声。 */
    function enforceSilent(video) {
        video.muted = true;
        video.defaultMuted = true;
        video.volume = 0;
        video.setAttribute('muted', '');
        video.setAttribute('playsinline', '');
        video.setAttribute('webkit-playsinline', '');
        video.setAttribute('disablepictureinpicture', ''); // iOS 不弹画中画浮层
    }

    // 关键：保证内联静音播放的前提
    videos.forEach(enforceSilent);

    function tryPlay(video) {
        if (!video || !video.paused) return;

        enforceSilent(video); // play() 前确保仍是静音，否则 iOS 直接拒绝
        let p;
        try {
            p = video.play();
        } catch (e) {
            return; // 同步抛错：等下一次手势或 canplay
        }
        if (p && typeof p.catch === 'function') {
            p.catch(() => {
                // 被自动播放策略拦截：保持静音不报错，等用户手势或回前台时再试
            });
        }
    }

    videos.forEach(video => {
        // 任何原因导致播放开始时，都再确认一次静音
        video.addEventListener('play', () => enforceSilent(video));
        video.addEventListener('playing', () => enforceSilent(video));

        if (video.readyState >= 2) {
            tryPlay(video);
        } else {
            video.addEventListener('canplay', () => tryPlay(video), { once: true });
            video.addEventListener('loadeddata', () => tryPlay(video), { once: true });
        }

        // 首次元数据就绪后再试一次（iOS 分段加载，这时才真正可播）
        video.addEventListener('loadedmetadata', () => tryPlay(video), { once: true });

        // 视频自身被暂停时兜底恢复（例如系统中断、来电）
        video.addEventListener('pause', () => {
            if (!document.hidden) setTimeout(() => tryPlay(video), 300);
        });

        // 用户手势重试：绑在所属 section 上，成功即解绑
        const section = video.closest('.video-section');
        if (section) {
            const onGesture = () => {
                tryPlay(video);
                if (!video.paused) {
                    section.removeEventListener('click', onGesture);
                    section.removeEventListener('touchstart', onGesture);
                }
            };
            section.addEventListener('click', onGesture);
            section.addEventListener('touchstart', onGesture, { passive: true });
        }
    });

    // 全局首次手势解锁：iOS 对"自动播放被拒"的媒体，只认手势调用栈里的 play()
    function unlockAll() {
        videos.forEach(tryPlay);
        unlockAudio();
    }
    const gestureOpts = { once: true, passive: true };
    document.addEventListener('touchstart', unlockAll, gestureOpts);
    document.addEventListener('click', unlockAll, { once: true });
    document.addEventListener('keydown', unlockAll, { once: true });

    // 切后台回来 / Safari 往返缓存恢复
    document.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'visible') videos.forEach(tryPlay);
    });
    window.addEventListener('pageshow', () => videos.forEach(tryPlay));
    window.addEventListener('focus', () => videos.forEach(tryPlay));
}

/* 初次播放完全由 playBgm() 在有用户手势时触发，play() 成功即为解锁成功，
   因此不再需要"先 play 再 pause"式的解锁辅助函数
   （那套做法会把它自己的 cleanup pause 排在 playBgm 的 play 之后，导致音乐被掐断）。 */

// 初始化函数
function init() {
    // 设置Canvas大小
    setCanvasSize();
    window.addEventListener('resize', setCanvasSize);

    // 初始化星空
    initStars();
    initShootingStars();

    // 检查是否是生日
    checkBirthday();

    // 设置音乐控制
    setupMusicControl();

    // 进入蛋糕/玫瑰板块时切换音乐
    setupMusicSwitching(Array.from(document.querySelectorAll('.fullscreen-section')));

    // 封面页的声音提示
    setupSoundHint();

    // 设置滚动指示器
    setupScrollIndicators();

    // 初始化视频板块（粒子玫瑰 / 生日蛋糕）的播放兜底
    initSectionVideos();

    // 渲染星空动画
    renderStarrySky();

    // 每秒更新倒计时
    if (!isBirthday) {
        setInterval(updateCountdown, 1000);
    }

    // 每小时检查一次是否是生日（以防用户长时间不刷新页面）
    setInterval(checkBirthday, 60 * 60 * 1000);
}

// 加载完成后启动
window.addEventListener('load', init); 