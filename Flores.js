const canvas = document.getElementById("miCanvas");
const PantallaInicio = document.getElementById("PantallaInicio");
const Boton = document.getElementById("boton");
const musica = document.getElementById("Musica");
const ctx=canvas.getContext("2d");

/*
Boton.addEventListener('click', () => {
    PantallaInicio.style.display="none";
    canvas.style.display="block"; 
})
*/

Boton.addEventListener('click', () => {
    PantallaInicio.classList.add('oculto');
    setTimeout(() => {
    PantallaInicio.style.display = 'none';
    musica.play();
    }, 1000); // Espera a que termine la animación antes de ocultar
});
canvas.height=window.innerHeight;
canvas.width=window.innerWidth;

const ramo= [];
const cantidad=70;

function colorRandom(){
    const hue=Math.floor(Math.random()*60)+30;
    return `hsl(${hue},100%, 50%)`;
}

function crearflores(){
    for(let i=0; i<cantidad; i++){
    const x= Math.random()*canvas.width;
    const y= Math.random()*canvas.height;
    const tamaño= 20 + Math.random()*20;
    const fase= Math.random()* Math.PI*2
    const velCrecimiento= 0.005 + Math.random() * 0.02;
    const gravedad= 0.002 + Math.random() * 0.01;
    const vy= 0;
    ramo.push({x, y, tamaño, colorpetalo: colorRandom(), colorcentro: "#8B4513", 
        fase, escala:0, crecimiento: velCrecimiento, gravedad, vy});
    }
}

function fondo(){
    const grad = ctx.createLinearGradient(0, 0, 0, canvas.height);
    grad.addColorStop(0, "#001f3f");
    grad.addColorStop(1, "#3399ff");
    ctx.fillStyle=grad;
    ctx.fillRect(0, 0,canvas.width, canvas.height);
}

function draw(flor,tiempo){
    const {x, y, tamaño, colorpetalo,colorcentro,fase, escala, crecimiento, gravedad, vy}= flor;
    
    if(flor.escala<1) flor.escala += flor.crecimiento;

    const radiopetalo= tamaño * flor.escala;
    const radioCentro= tamaño/2 * flor.escala;
    const oscilacion= Math.sin(tiempo/300+fase)*3;

    ctx.shadowBlur= 15;
    ctx.shadowColor=colorpetalo;
    ctx.fillStyle= colorpetalo;

    flor.vy += flor.gravedad;
    flor.y += flor.vy;

    for(let i= 0; i<5; i++){
        const angulo= (i * Math.PI*2)/5;
        const py = y + Math.sin(angulo)* (radiopetalo+oscilacion);
        const px = x + Math.cos(angulo) * (radiopetalo+ oscilacion);

        ctx.beginPath();
        ctx.arc(px, py, radiopetalo, 0, Math.PI*2);
        ctx.fill();
    }

    ctx.shadowBlur=0;

    ctx.beginPath();
    ctx.arc(x, y, radioCentro, 0, Math.PI*2);
    ctx.fillStyle=colorcentro;
    ctx.fill();
}

function animar(tiempo){
    fondo();
    for(let flor of ramo){
        draw(flor, tiempo);
    }

    for(let i = ramo.length-1; i >= 0; i--){
        if(ramo[i].y - ramo[i].tamaño/2 > canvas.height){
            ramo.splice(i,1);
        }
    }

    while(ramo.length < cantidad+20){
        crearflores();
    }

    requestAnimationFrame(animar);
}

crearflores();
animar();

canvas.addEventListener('click', (e)=>{
    const rect=canvas.getBoundingClientRect();
    const x= e.clientX - rect.left;
    const y= e.clientY - rect.top;

    const tamaño= 20 + Math.random()*20;
    const fase= Math.random()* Math.PI*2
    const velCrecimiento= 0.005 + Math.random() * 0.02;
    const gravedad = 0.002 + Math.random() * 0.01;
    const vy = 0;
    ramo.push({x, y, tamaño, colorpetalo: colorRandom(), colorcentro: "#8B4513", 
        fase, escala: 0, crecimiento: velCrecimiento, gravedad, vy});
})

window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});