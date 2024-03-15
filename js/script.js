const canvas = document.getElementById("pongCanvas");
const ctx = canvas.getContext("2d");

// パドルのオブジェクト
let paddle = {
    x: canvas.width / 2 - 40, // キャンバスの中央に配置
    y: canvas.height + 200, // キャンバスの下部に配置
    width: 80,
    height: 10,
    dx: 12, // 移動速度
};

// キャンバスのサイズ設定
canvas.width = 600;
canvas.height = 400;

let ball = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    size: 10,
    dx: 5,
    dy: 5,
};

// ボールを描画する関数
function drawBall() {
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.size, 0, Math.PI * 2);
    ctx.fillStyle = "#0095DD";
    ctx.fill();
    ctx.closePath();
}

// ボールの位置を更新する関数
function update() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBall();
    drawPaddle();
    collideWithPaddle();
    ball.x += ball.dx;
    ball.y += ball.dy;

    // 壁に当たったら跳ね返る
    if (ball.x + ball.size > canvas.width || ball.x - ball.size < 0) {
        ball.dx *= -1;
    }
    if (ball.y + ball.size > canvas.height || ball.y - ball.size < 0) {
        ball.dy *= -1;
    }

    requestAnimationFrame(update);
}

// パドルを描画
function drawPaddle() {
    ctx.beginPath();
    ctx.rect(paddle.x, paddle.y, paddle.width, paddle.height);
    ctx.fillStyle = "#0095DD";
    ctx.fill();
    ctx.closePath();
}

// ボールとパドルの衝突検知
function collideWithPaddle() {
    if (
        ball.y + ball.size > paddle.y &&
        ball.x - ball.size > paddle.x &&
        ball.x + ball.size < paddle.x + paddle.width
    ) {
        ball.dy = -ball.dy; // ボールの垂直方向の速度を反転
    }
}

// スタートボタンを押したときにゲームを開始
document.getElementById("startButton").addEventListener("click", function () {
    update();
});

// パドル操作
document.addEventListener("keydown", function (e) {
    if (e.key === "Right" || e.key === "ArrowRight") {
        if (paddle.x < canvas.width - paddle.width) {
            paddle.x += paddle.dx;
        }
    } else if (e.key === "Left" || e.key === "ArrowLeft") {
        if (paddle.x > 0) {
            paddle.x -= paddle.dx;
        }
    }
});
