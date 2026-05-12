//  DECLARAÇÕES DO ELEMENTOS USANDO DOM

const videoElemento = document.getElementById('video');
const botaoScanear = document.getElementById('btn-texto');
const resultado = document.getElementById('saida');
const canvas = document.getElementById('canvas');

// FUNÇÃO QUE VAI HABILITAR A CÂMERA

async function configurarCamera() {
    try{
        const midia = await navigator.mediaDevices.getUserMedia({
            video: {facingMode: "environment"}, //Habilitando a câmera traseira
            audio: false
        })

        videoElemento.srcObject = midia;
        videoElemento.play(); //Garante que o video começe
    }catch(error){
        resultado.innerHTML="Erro ao acessar a câmera", error;
    }
    
}

// Executando a função da câmera

configurarCamera();

// Função para ler o texto da imagem e mostrar na tela

botaoScanear.onclick = async()=>{
    botaoScanear.disable = true;
    resultado.innerHTML = "Fazendo a leitura... Aguarde";

    // Chama a estrutura do canvas
    const context = canvas.getContext('2d');

    // Ajusta o tamanho da tela
    canvas.width = videoElemento.videoWidth;
    canvas.height = videoElemento.videoHeight;

    // reset de qualquer transformção para garantir que a foto não fique invertida
    context.setTransform(1, 0, 1, 0, 0);

    // Aplica efeito de contraste e escala de cinza no canva antes de tirar a foto (ajuda a evitar letras aleatorias)
    context.filter = 'contrast(1.2) grayscale(1)';

    // Construindo a tela para tirar a foto
    context.drawImage (videoElemento, 0,0, canvas.width, canvas.height);

    try{
        const {data: { text }} = await Tesseract.recognize{
            canvas,
            'por'
        };

        // Remove espaços excessivos e caracteres especiais
        const textoFinal = text.trim();

        resultado.innerHTML = textoFinal.length > 0 ? textoFinal : "Não foi possivel identificar o texto";

    } catch (error){
        console.error(error);
        resultado.innerText = "Erro ao processar", error;
        
    } finally{
        // Desabilita o botão para começar nova leitura
        botaoScanear.disable = false
    }
}