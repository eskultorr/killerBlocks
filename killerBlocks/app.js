const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const menu = document.querySelector('.menu');
const button = document.querySelector('.btn');
const scoreSpan = document.querySelector('.score');
let animationId;
let score = 0;


//tamaño
canvas.width = 900;
canvas.height = 500;


//clases
//particles
class Particle
{
    constructor(size,position,color, velocity)
    {
        this.position = position;
        this.velocity = velocity;
        this.size = size;
        this.color= color;
    }

    update()
    {
        this.draw();
        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;
        this.size -= 0.5;
    }

    draw()
    {
        ctx.beginPath();
        ctx.fillStyle = this.color;
        ctx.fillRect(this.position.x, this.position.y, this.size, this.size);
        ctx.closePath();
    }
}


//enemigos
class Enemies
{
    constructor(position,size,color, velocity)
    {
        this.position = position;
        this.velocity = velocity;
        this.size = size;
        this.color= color;
        this.frame =0;
        this.maxFrame = Math.floor(Math.random() * 41)+40;
    }

    shoot(Projectiles)
    {
        if(this.frame > this.maxFrame)
        {
            let proyectil = new Projectile(
                {
                    x:(this.position.x + this.size.width/2) -5,
                    y:(this.position.y + this.size.height/2) -5

                },

                {
                    width: 10,
                    height: 20
                },
                this.color, 8);
            Projectiles.push(proyectil);
            this.frame = 0;
        }
    }

    update()
    {
        this.draw();
        this.position.x += this.velocity;
        if(this.position.x + this.size.width > canvas.width)
        {
            this.position.x = canvas.width - this.size.width;
            this.velocity *= -1;
        }
        if(this.position.x < 0)
        {
            this.position.x = 0;
            this.velocity *=-1;
        }
        this.frame++;
    }

    draw()
    {
        ctx.beginPath();
        ctx.fillStyle = this.color;
        ctx.fillRect(this.position.x, this.position.y, this.size.width, this.size.height);
        ctx.closePath();
    }
}
//disparos
class Projectile
{
    constructor(position,size,color, velocity)
    {
        this.position = position;
        this.velocity = velocity;
        this.size = size;
        this.color= color;
    }

    update()
    {
        this.draw();
        this.position.y += this.velocity;
    }

    collisions(object)
    {
        if(this.position.y <=0 || this.position.y >= canvas.height)
        {
            return 1;
        }
        if(this.position.x < object.position.x + object.size.width
            && this.position.x + this.size.width > object.position.x
            && this.position.y < object.position.y + object.size.height
            && this.position.y + this.size.height > object.position.y)
            {
                return 2;
            }
            return 0;
    }

    draw()
    {
        ctx.beginPath();
        ctx.fillStyle = this.color;
        ctx.fillRect(this.position.x, this.position.y, this.size.width, this.size.height);
        ctx.closePath();
    }
    
}


//player
class Player
{
    constructor(position,size,color, velocity)
    {
        this.position = position;
        this.velocity = velocity;
        this.size = size;
        this.color= color;
        this.keys = {
            left:false,
            right:false,
            shoot:true
        }

        this.bullet = [];

        this.keyBoard();
    }

    draw()
    {
        ctx.beginPath();
        ctx.fillStyle = this.color;
        ctx.fillRect(this.position.x, this.position.y, this.size.width, this.size.height);
        ctx.closePath();
        
    }

    update()
    {
        this.draw();
        if(this.keys.right)
        {
            this.position.x += this.velocity;
            if(this.position.x + this.size.width > canvas.width)
            {
                this.position.x = canvas.width - this.size.width;
            }
            // console.log('se movio derecha');
        }
        if(this.keys.left)
        {
            this.position.x -= this.velocity;
            if(this.position.x < 0)
            {
                this.position.x = 0;
            }
            // console.log('se movio izkierda');
        }
    }

    keyBoard()
    {
        document.addEventListener('keydown', (evt)=>
        {
            if( evt.key == 'ArrowLeft')
            {
                this.keys.left = true;
            }
            if( evt.key == 'ArrowRight')
            {
                this.keys.right = true;
            }
            //disparar
            if(evt.key == 'w' && this.keys.shoot)
            {
                let proyectil = new Projectile(
                    {
                        x:(this.position.x + this.size.width/2)-5,
                        y:this.position.y,
                    },
                    {
                        width:10,
                        height:20
                    },
                    this.color,-8);
                    this.bullet.push(proyectil);
                    this.keys.shoot = false;

                // console.log('disparo');
            }
            // console.log('tecla pulsada')
        })
        document.addEventListener('keyup', (evt)=>
        {
            if( evt.key == 'ArrowLeft')
            {
                this.keys.left = false;
                // console.log('se paro');
            }
            if( evt.key == 'ArrowRight')
            {
                this.keys.right = false;
                // console.log('se paro');
            }
            //disparo
            if(evt.key == 'w')
            {
                this.keys.shoot = true;
            }
        })
    }
}

const player = new Player({x:200, y:480}, {width:80, height:20},'white',7);
const enemys =[];
const particles =[];
const proyectilEnemy=[];

//crear enemigos
function createEnemy(color)
{
    let enemy = new Enemies(
        {
            x: Math.floor(Math.random() * (canvas.width-61)),
            y: Math.floor(Math.random() * (201))
            
        },
        {width:80,height:20}, color, 1,
    );
    enemys.push(enemy);
};

//iniciar enemigos disntistos color
function initEnemies()
{
    let colors = ['red','green','yellow','cyan','pink','brown'];
    for(let i = 0; i < colors.length;i++)
    {
        createEnemy(colors[i]);
    }
}


//bucle proyectil
function updateObjetcs()
{
    for(let i = 0; i < player.bullet.length;i++)
    {
        player.bullet[i].update();
        for(let j = 0;j< enemys.length;j++)
        {
            if(player.bullet[i].collisions(enemys[j])==1)
            {
                player.bullet.splice(i,1);
                break;
            }
            if(player.bullet[i].collisions(enemys[j])==2)
            {
                explosion(enemys[j]);
                //para que aparezca otro enemigo despues de eleminar uno
                let colorEnemy = enemys[j].color;
                setTimeout(()=>
                {
                    createEnemy(colorEnemy);
                }, 5000)
                player.bullet.splice(i,1);
                enemys.splice(j,1);
                score++;
                scoreSpan.innerHTML = score;
                break;
            }

        }
    }
    enemys.forEach((p)=>
    {
        p.update();
        p.shoot(proyectilEnemy);
    })

    particles.forEach((p,i)=>
    {
        p.update();
        if(p.size <=0)
        {
            particles.splice(i,1);
        }
    });
    for(let i = 0; i < proyectilEnemy.length;i++)
    {
        proyectilEnemy[i].update();
        if(proyectilEnemy[i].collisions(player) ==1)
        {
            proyectilEnemy.splice(i,1);
        }
        else if(proyectilEnemy[i].collisions(player) ==2)
        {
            proyectilEnemy.splice(i,1);
            explosion(player);
                //desaparece jugador
            player.position.x =-50;
            player.position.y =-50;
            setTimeout(()=>
            {
                cancelAnimationFrame(animationId);
                gameOver();
            },2000);
            // console.log("te han dado pedazo de tonto");
        }
    }
}

//explosion
function explosion(object)
{
    for(let k =0; k < 50;k++)
                {
                    let particle = new Particle(
                        Math.floor(Math.random() *16)+15,
                        {
                            x:object.position.x +object.size.width/2,
                            y:object.position.y +object.size.height/2
                        },

                        object.color,
                        {
                            x:(Math.random()* 0.8 - 0.8)* 8,
                            y:(Math.random()* 0.8 - 0.8)* 8
                        }
                    );
                    particle.position.x -= particle.size/2;
                    particle.position.y -= particle.size/2;
                    particles.push(particle);
                }
};

function gameOver()
{
    ctx.fillStyle = '#262626';
    ctx.fillRect(0,0,canvas.width,canvas.height);
    enemys.length = 0;
    particles.length = 0;
    proyectilEnemy.length = 0;
    menu.style.display = 'flex';
}

button.addEventListener("click", ()=>
{
    score=0;
    scoreSpan.innerHTML = score;
    menu.style.display = 'none';
    player.position = {x:200, y:480};
    initEnemies();
    animate();
})

//animacion o poder mover el objeto 
function animate()
{
    animationId =  requestAnimationFrame(animate);
    //fondo canvas
    ctx.fillStyle = '#262626';
    ctx.fillRect(0,0,canvas.width,canvas.height);
    player.update();
    updateObjetcs();
    // console.log(player.bullet.length);
};

initEnemies();
animate();