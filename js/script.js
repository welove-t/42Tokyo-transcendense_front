const canvas = document.getElementById("pongCanvas");
const ctx = canvas.getContext("2d");

// キャンバスのサイズ設定
canvas.width = 800;
canvas.height = 600;

let gameStarted = false; // ゲームが開始しているかのフラグ
let gameState = "startScreen"; // 'startScreen', 'gameOn', 'gameOver' のいずれか
let animationFrameId; // requestAnimationFrameから返されるIDを保存する変数

// パドルのオブジェクト
let paddle = {
    x: canvas.width / 2 - 40, // キャンバスの中央に配置
    y: canvas.height - 30, // キャンバスの下部に配置
    width: 120,
    height: 16,
    dx: 12, // 移動速度
};

// キーの押下状態を追跡
let keyDown = {
    right: false,
    left: false,
};

let ball = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    size: 16,
    dx: 5,
    dy: 5,
    speed: 8,
};

// スタート画面
function showStartScreen() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.font = "30px Arial";
    ctx.fillStyle = "#0095DD";
    ctx.textAlign = "center";
    ctx.fillText("ストップ", canvas.width / 2, canvas.height / 2);

    document.getElementById("resetButton").disabled = true; // リセットボタンを非活性化
}

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
    if (gameState !== "gameOn") {
        return;
    }
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBall();
    drawPaddle();
    collideWithPaddle();

    // パドルの動きを更新
    if (keyDown.right && paddle.x < canvas.width - paddle.width) {
        paddle.x += paddle.dx;
    } else if (keyDown.left && paddle.x > 0) {
        paddle.x -= paddle.dx;
    }

    ball.x += ball.dx;
    ball.y += ball.dy;

    // 壁に当たったら跳ね返る
    if (ball.x + ball.size > canvas.width || ball.x - ball.size < 0) {
        ball.dx *= -1;
    }
    if (ball.y + ball.size > canvas.height || ball.y - ball.size < 0) {
        ball.dy *= -1;
    }
    animationFrameId = requestAnimationFrame(update);
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
    // ボールがパドルの範囲内にあるかチェック
    if (
        ball.y + ball.size > paddle.y &&
        ball.x > paddle.x &&
        ball.x < paddle.x + paddle.width
    ) {
        // パドルに衝突した場合、ボールの反射角度を調整
        let collidePoint = ball.x - (paddle.x + paddle.width / 2); // パドルの中心からの衝突点までの距離
        collidePoint = collidePoint / (paddle.width / 2); // -1 から 1 の範囲に正規化

        let angleRad = (collidePoint * Math.PI) / 4; // 最大反射角度をラジアンで設定（ここでは45度）

        ball.dx = ball.speed * Math.sin(angleRad);
        ball.dy = -ball.speed * Math.cos(angleRad);
    }
}

// リセット
function resetGame() {
    gameStarted = false; // ゲームの実行フラグをリセット
    cancelAnimationFrame(animationFrameId); // 進行中のゲームループを停止
    // キャンバスをクリア
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    // ボールの位置を中央にリセット
    ball.x = canvas.width / 2;
    ball.y = canvas.height / 2;
    ball.dx = 5; // ここでの値はゲーム開始時の値に戻す
    ball.dy = -5; // 通常、初期速度は負の値に設定して上向きにする

    // パドルの位置を中央にリセット
    paddle.x = canvas.width / 2 - paddle.width / 2;
    paddle.y = canvas.height - 30; // 初期値に戻す

    gameStarted = false;
    gameState = "startScreen"; // ゲーム状態をスタート画面に戻す
    showStartScreen(); // スタート画面を表示
    document.getElementById("startButton").disabled = false; // スタートボタンを活性化
    document.getElementById("resetButton").disabled = true; // リセットボタンを非活性化
}

// スタートボタンを押したときにゲームを開始
document.getElementById("startButton").addEventListener("click", function () {
    if (!gameStarted && gameState === "startScreen") {
        gameStarted = true;
        gameState = "gameOn";
        this.disabled = true; // スタートボタンを非活性化
        document.getElementById("resetButton").disabled = false; // リセットボタンを活性化
        update(); // ゲームの更新関数を呼び出し
    }
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

// キーボードイベントリスナーを更新
document.addEventListener("keydown", (e) => {
    if (e.key === "Right" || e.key === "ArrowRight") {
        keyDown.right = true;
    } else if (e.key === "Left" || e.key === "ArrowLeft") {
        keyDown.left = true;
    }
});

document.addEventListener("keyup", (e) => {
    if (e.key === "Right" || e.key === "ArrowRight") {
        keyDown.right = false;
    } else if (e.key === "Left" || e.key === "ArrowLeft") {
        keyDown.left = false;
    }
});

document.getElementById("resetButton").addEventListener("click", resetGame);
