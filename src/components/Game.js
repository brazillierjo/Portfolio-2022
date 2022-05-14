import React, { useEffect } from "react"
import platform from '../images/assets-game/platform.png'
import hills from '../images/assets-game/hills.png'
import background from '../images/assets-game/background.png'

export default function Game() {
    useEffect(() => {
        launchGame()
    }, [])

    window.addEventListener("keydown", function (e) {
        if (["Space", "ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].indexOf(e.code) > -1) {
            e.preventDefault()
        }
    }, false)

    const launchGame = () => {
        const canvas = document.getElementById('game')
        canvas.width = 1024
        canvas.height = 576
        const ctx = canvas.getContext('2d')

        // gravity strength
        const gravity = 1.5

        // default models
        class Player {
            constructor() {
                this.speed = 10
                this.position = {
                    x: 100,
                    y: 0
                }
                this.velocity = {
                    x: 0,
                    y: 1
                }
                this.width = 30
                this.height = 30
            }
            draw() {
                ctx.fillStyle = 'red'
                ctx.fillRect(this.position.x, this.position.y, this.width, this.height)
            }

            update() {
                this.draw()
                this.position.y += this.velocity.y
                this.position.x += this.velocity.x
                if (this.position.y + this.height + this.velocity.y <= canvas.height) this.velocity.y += gravity
            }
        }

        class Platform {
            constructor({ x, y, image }) {
                this.position = {
                    x,
                    y
                }
                this.image = image
                this.width = image.width
                this.height = image.height
            }
            draw() {
                ctx.fillStyle = 'blue'
                ctx.drawImage(this.image, this.position.x, this.position.y)
            }
        }

        class Assets {
            constructor({ x, y, image }) {
                this.position = {
                    x,
                    y
                }
                this.image = image
                this.width = image.width
                this.height = image.height

            }

            draw() {
                ctx.fillStyle = 'blue'
                ctx.drawImage(this.image, this.position.x, this.position.y)
            }
        }
        // ******************** //

        // create imgs
        function createImgs(imageSrc) {
            const image = new Image()
            image.src = imageSrc
            return image
        }
        let platformImg = createImgs(platform)
        const backgroundImg = createImgs(background)
        const hillsImg = createImgs(hills)
        // ******************* //

        // create plateform and player
        let player = new Player()
        let platforms = [new Platform({ x: 0, y: 470, image: platformImg }),
        new Platform({ x: platformImg.width - 2, y: 470, image: platformImg }),
        new Platform({ x: platformImg.width * 2 + 100, y: 400, image: platformImg }),
        new Platform({ x: platformImg.width * 3 + 300, y: 320, image: platformImg }),
        new Platform({ x: platformImg.width * 4 + 600, y: 200, image: platformImg }),
        new Platform({ x: platformImg.width * 5 + 800, y: 120, image: platformImg }),
        new Platform({ x: platformImg.width * 6 + 1000, y: 470, image: platformImg }),
        new Platform({ x: platformImg.width * 7 + 1200, y: 470, image: platformImg }),
        new Platform({ x: platformImg.width * 8 + 1400, y: 390, image: platformImg }),
        new Platform({ x: platformImg.width * 9 + 1600, y: 300, image: platformImg }),
        new Platform({ x: platformImg.width * 10 + 1800, y: 200, image: platformImg }),
        new Platform({ x: platformImg.width * 11 + 2000, y: 430, image: platformImg }),
        new Platform({ x: platformImg.width * 12 + 2200, y: 470, image: platformImg }),
        ]
        let assets = [new Assets({ x: -1, y: -1, image: backgroundImg }), new Assets({ x: -1, y: -1, image: hillsImg })]
        // ********************* //

        // movement x axis
        const keys = {
            right: {
                pressed: false
            },
            left: {
                pressed: false
            }
        }
        // ********************* //

        // finish event
        let scrollOffset = 0
        // ********************* //

        // reset game when lose
        const resetGame = () => {
            platformImg = createImgs(platform)
            player = new Player()
            platforms = [new Platform({ x: 0, y: 470, image: platformImg }),
            new Platform({ x: platformImg.width - 2, y: 470, image: platformImg }),
            new Platform({ x: platformImg.width * 2 + 100, y: 400, image: platformImg }),
            new Platform({ x: platformImg.width * 3 + 300, y: 320, image: platformImg }),
            new Platform({ x: platformImg.width * 4 + 600, y: 200, image: platformImg }),
            new Platform({ x: platformImg.width * 5 + 800, y: 120, image: platformImg }),
            new Platform({ x: platformImg.width * 6 + 1000, y: 470, image: platformImg }),
            new Platform({ x: platformImg.width * 7 + 1200, y: 470, image: platformImg }),
            new Platform({ x: platformImg.width * 8 + 1400, y: 390, image: platformImg }),
            new Platform({ x: platformImg.width * 9 + 1600, y: 300, image: platformImg }),
            new Platform({ x: platformImg.width * 10 + 1800, y: 200, image: platformImg }),
            new Platform({ x: platformImg.width * 11 + 2000, y: 430, image: platformImg }),
            new Platform({ x: platformImg.width * 12 + 2200, y: 470, image: platformImg }),
            ]
            assets = [new Assets({ x: -1, y: -1, image: backgroundImg }), new Assets({ x: -1, y: -1, image: hillsImg })]
            scrollOffset = 0
        }

        // loop game and update player and platform
        function animate() {
            requestAnimationFrame(animate)
            ctx.fillStyle = 'white'
            ctx.clearRect(0, 0, canvas.width, canvas.height)
            assets.forEach(asset => asset.draw())
            platforms.forEach(platform => platform.draw())
            player.update()

            if (keys.right.pressed && player.position.x < 400) player.velocity.x = player.speed
            else if (keys.left.pressed && player.position.x > 100) player.velocity.x = -player.speed
            else {
                player.velocity.x = 0

                if (keys.right.pressed) {
                    scrollOffset += 5
                    platforms.forEach(platform => platform.position.x -= player.speed)
                    assets.forEach(asset => asset.position.x -= player.speed * .66)
                }
                else if (keys.left.pressed) {
                    scrollOffset -= player.speed
                    platforms.forEach(platform => platform.position.x += player.speed)
                    assets.forEach(asset => asset.position.x += player.speed * .66)
                }
            }

            // display score in div
            const score = document.getElementById('score')
            score.innerHTML = scrollOffset

            // colision detection
            platforms.forEach(platform => {
                if (player.position.y + player.height <= platform.position.y && player.position.y + player.height + player.velocity.y >= platform.position.y && player.position.x + player.width >= platform.position.x && player.position.x <= platform.position.x + platform.width) player.velocity.y = 0
            })

            // win event
            if (scrollOffset > 4650) {
                const popup = document.getElementById('popup')
                popup.style.display = 'block'
            }

            // lose event
            if (player.position.y + player.height > canvas.height) {
                resetGame()
            }
        }
        animate()
        // ********************* //

        // trigger keys
        window.addEventListener('keydown', ({ keyCode }) => {
            switch (keyCode) {
                // left
                case 37:
                    keys.left.pressed = true
                    break
                // up (arrow)
                case 38:
                    player.velocity.y -= 30
                    break
                // up (space)
                case 32:
                    player.velocity.y -= 30
                    break
                // right
                case 39:
                    keys.right.pressed = true
                    break
                // down
                case 40:
                    console.log('down')
                    break
            }
        })

        window.addEventListener('keyup', ({ keyCode }) => {
            switch (keyCode) {
                // left
                case 37:
                    keys.left.pressed = false
                    break
                // right
                case 39:
                    keys.right.pressed = false
                    break
                // down
                case 40:
                    console.log('down')
                    break
            }
        })

        // reset game when click on button
        const reset = document.getElementById('reset')
        reset.addEventListener('click', () => {
            resetGame()
            const popup = document.getElementById('popup')
            popup.style.display = 'none'

        })
        // ********************* //
    }

    return (
        <>
            <div className="text-game">
                <h1>HTML | JavaScript vanilla video-game 👇</h1>
                <p>Use arrows to move, and space or arrow up to jump !</p>
            </div>
            <div className="game">
                <div id="popup">
                    <h2>Congratulations 🥳</h2>
                    <div className="reload">
                        <button id="reset">Reset game 🔄</button>
                    </div>
                </div>
                <div id="score"></div>
                <canvas id="game"></canvas>
                <script src="./index.js" type="module"></script>
            </div>
        </>
    )
}
