document.addEventListener('DOMContentLoaded', () => {
  const cont = document.querySelector('.container')
  const ball = document.querySelector('.ball')
  const paddle = document.querySelector('.paddle')


  // Score Board
  const points = document.getElementById('points')
  const lives = document.getElementById('lives')
  const fir = document.querySelector('.start')
  const finale = document.querySelector('.finale')
  const allPs = document.getElementById('tot-point')
  const allLive = document.getElementById('tot-live')
  const big = document.querySelector('.finale h1')
  const log = document.getElementById('done')

  let point, live;

  // Bricks
  const gridH = 26
  const gridW = 92
  const parentH = 34
  let bricks = []

  // Ball
  const radius = 20;
  let x = 500;
  let y = 670 - (radius + 22);
  let resy = 425;
  let resx = 500;
  let dy, dx;


  // Reset score
  reset()


  // Ball Positioning
  ballPose()


  // Paddle 
  let mouse = {
    curx: undefined
  }
  let padWidth = 120;
  let midWidthOfPad = padWidth / 2;
  let padtLeft;
  
  
  // Listening for mousemove
  cont.addEventListener('mousemove', e => {
    padLeft = e.pageX - cont.offsetLeft;
    mouse.curx = (padLeft - midWidthOfPad);

    // Paddle Left
    paddle.style.left = `${mouse.curx}px`;
  });
  
  cont.addEventListener('mouseleave', e => { padLeft = 0 });


  // Listening for Click Event
  cont.addEventListener('click', () => {
    // Remove Click to start
    fir.classList.add('edge')

    // Begin Game
    start()
  }, { once: true })


  // Listening for Click Event
  finale.addEventListener('click', () => {
    // Reset Position
    x = resx
    y = resy

    // Reset
    reset()
  })


  // Animating ball Movement
  function moveBall() {
    requestAnimationFrame(moveBall)

    // Noticing Walls
    if (y <= 0) {
      dy = -dy
    }

    if (x + radius >= cont.offsetWidth + 15 || x <= -15) {
      dx = -dx
    }


    // Noticing Fail
    if (y + radius >= cont.offsetHeight + 120) {
      if (live > 1) {
        // Reset Position
        x = resx
        y = resy

        // Reset Velocity
        dy = 3
        dx = 0

        // Recount Lives
        lives.textContent = `${live -= 1}`
      } else {
        // Display All points
        checkVic('lose')
      }
    }

    // Noticing Paddle
    let padX = parseInt(getComputedStyle(paddle).left)
    let padY = 670 - (radius)
    if (x + radius >= padX && x <= padX + padWidth && y + radius >= padY && y + radius <= padY + 13) {
      dy = -dy

      // Check Paddle
      checkPaddle(padY, padX)


      // Check Victory
      if (bricks.length < 1) {
        checkVic('win')
      }
    }

    // Noticing Bricks
    bricks.forEach(brick => {
      let top = brick.y
      let left = brick.x
      
      if (x + radius >= left + 10 && x <= left + 80 && y + radius >= top + 10 && y <= top + 14) {
        dy = -dy
        brick.child.remove()
        bricks = bricks.filter(bric => bric !== brick)

        // Increase points by 10
        points.innerHTML = `${point += 10}`


        // Check Brick
        checkBrick(left + 10)
      }
    })


    y += dy
    x += dx

    ball.style.top = `${y}px`
    ball.style.left = `${x}px`
  }



  // Function for Ball Positioning
  function ballPose() {
    ball.style.left = `${x}px`
    ball.style.top = `${y}px`
  }


  // Function to begin
  function start() {
    dy = -dy
    requestAnimationFrame(moveBall)
  }

  
  // Function for reset
  function reset() {
    // Reset Score
    point = 0
    live = 5

    // Reset Board
    lives.textContent = live
    points.textContent = point

    // Reset Bricks
    createBricks()

    // Arrange Velocity
    dy = 3
    dx = 0

    // Reset 
    finale.classList.remove('resp')
  }


  // Function to Check Victory 
  function checkVic(type) {
    let col;
    type === 'win' ? (col = 'orange', live = live) : (col = 'red', live = 0)

    // Display All points
    allPs.textContent = point

    // Display lives Left
    allLive.textContent = live

    // WIN disp
    big.style.color = col
    log.textContent = type

    // Display Current Board
    finale.classList.add('resp')
  }


  // Function for checkPaddle
  function checkPaddle(py, px) {
    //  Const y 
    const edgey = y + radius >= py && y + radius <= py + 13

    //  Check for Edges
    let edge1 = x + radius >= px && x + radius <= px + 35
    let edge2 = x <= px + padWidth && x >= px + padWidth - 35
    let edge3 = x + radius >= px + 36 && x <= px + (padWidth - 36)

    //  Check Left
    if (edge1 && edgey) {
      if (dx >= 0) {
        dx = -3 - 6
      }
    }

    //  Check right
    if (edge2 && edgey) {
      if (dx <= 0) {
        dx = 3 + 6
      }
    }

    //  Check Center 
    if (edge3 && edgey) {
      if (dx >= 0) { dx = 3 }
      else if (dx <= 0) { dx = -3 }
    }
  }


  // Function for Check Brick
  function checkBrick(left) {
    if (x + radius >= left && x + radius <= left + 10) {
      if (dx > 0) {
        dx = -dx
      }
    } else if (x <= left + 70 && x >= left + 60) {
      if (dx < 0) {
        dx = -dx
      }
    }
  }


  // Function for Creating Bricks
  function createBricks() {
    const cont_inn = document.createElement('div');
    cont_inn.setAttribute('class', 'inner')
    cont.append(cont_inn)

    for (var i = 0; i <= 170; i++) {
      const child = document.createElement('div')
      child.setAttribute('class', 'child')

      let row = Math.floor(Math.random() * 15) + 1
      let col = Math.floor(Math.random() * 11) + 1

      // Brick Collection
      let brick = {
        child,
        x: 0 + (gridW * (col - 1)),
        y: parentH + (gridH * (row - 1)),
      }

      // Set Rows & Cols
      child.style.gridRow = row;
      child.style.gridColumn = col;

      // Append Child
      cont_inn.append(child)

      // Append brick
      bricks.push(brick)
    }

    // Re-arrange Order in Case of same row & col
    arrBricks()
  }


  // Re-arrange Brick Function
  function arrBricks() {
    for (var i = 0; i < bricks.length; i++) {
      let main = bricks[i]

      for (var j = 0; j < bricks.length; j++) {
        if (i !== j) {
          if (main.x === bricks[j].x && main.y === bricks[j].y) {
            bricks[j].child.remove()
            bricks = bricks.filter(mn => mn !== bricks[j])
          }
        }
      }
    }
  }
})