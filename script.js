// Função para virar os cards de competência
function flipCard(card) {
    card.classList.toggle('flipped');
}

// Função para alternar a exibição do card de contato
function toggleContact(element) {
    document.querySelectorAll('.contato-card').forEach(item => {
        if (item !== element) {
            item.classList.remove('active');
        }
    });
    element.classList.toggle('active');
}

// Função para copiar o texto para a área de transferência
function copyContact(textToCopy, event) {
    event.stopPropagation();
    if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(textToCopy).then(() => {
            showFeedback(event.target.closest('.contato-card'));
        }).catch(err => {
            console.error('Falha ao copiar: ', err);
        });
    } else {
        const textarea = document.createElement('textarea');
        textarea.value = textToCopy;
        document.body.appendChild(textarea);
        textarea.select();
        try {
            document.execCommand('copy');
            showFeedback(event.target.closest('.contato-card'));
        } catch (err) {
            console.error('Falha ao copiar (execCommand): ', err);
        }
        document.body.removeChild(textarea);
    }
}

function showFeedback(element) {
    const originalContent = element.innerHTML;
    element.innerHTML = `
        <div class="text-center">
            <i class="fa-solid fa-check-circle text-2xl text-green-500 mb-2"></i>
            <div class="text-xs text-zinc-500 uppercase font-semibold tracking-wide">Copiado!</div>
        </div>`;
    
    setTimeout(() => {
        element.innerHTML = originalContent;
    }, 1500);
}

// Fechar cards de contato ao clicar fora
document.addEventListener('click', (e) => {
    if (!e.target.closest('.contato-card')) {
        document.querySelectorAll('.contato-card.active').forEach(item => {
            item.classList.remove('active');
        });
    }
});

// --- Funções para a API do Gemini (Refatorado) ---

// Função centralizada para chamar a API
async function callGeminiApi(prompt) {
    const apiUrl = "/api/gemini"; // A URL da sua API no Vercel

    try {
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ prompt: prompt })
        });

        if (!response.ok) {
            throw new Error(`Erro na API: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        return data.text;
    } catch (error) {
        console.error("Erro ao chamar a API:", error);
        return "Ocorreu um erro. Por favor, tente novamente.";
    }
}

async function generateAutomationPlan() {
    const prompt = document.getElementById('automation-prompt').value;
    if (!prompt) return;

    const resultDiv = document.getElementById('automation-response');
    const loadingDiv = document.getElementById('automation-loading');
    const resultTextDiv = document.getElementById('automation-text-result');

    resultDiv.classList.remove('hidden');
    loadingDiv.style.display = 'block';
    resultTextDiv.innerText = '';
    
    const llmPrompt = `Matheus Melo, especialista em IA e Automação, recebeu o seguinte pedido de um cliente: "${prompt}". Como especialista, elabore um plano de automação básico e profissional para resolver este problema. O plano deve incluir: uma breve introdução, a solução proposta em 2-3 pontos-chave, e um breve resumo do impacto esperado. Responda em português.`;

    const text = await callGeminiApi(llmPrompt);
    resultTextDiv.innerText = text;

    loadingDiv.style.display = 'none';
}

async function explainBlockchainConcept() {
    const term = document.getElementById('blockchain-term').value;
    if (!term) return;

    const resultDiv = document.getElementById('blockchain-response');
    const loadingDiv = document.getElementById('blockchain-loading');
    const resultTextDiv = document.getElementById('blockchain-text-result');

    resultDiv.classList.remove('hidden');
    loadingDiv.style.display = 'block';
    resultTextDiv.innerText = '';

    const llmPrompt = `Explique o seguinte conceito de blockchain ou cripto de forma simples, direta e profissional, como se estivesse explicando para alguém que é novo no assunto. O conceito é: "${term}". Responda em português.`;

    const text = await callGeminiApi(llmPrompt);
    resultTextDiv.innerText = text;

    loadingDiv.style.display = 'none';
}

// Funções para abrir e fechar os modais
function showAutomationModal() {
    document.getElementById('automation-modal').classList.remove('hidden');
}

function showBlockchainModal() {
    document.getElementById('blockchain-modal').classList.remove('hidden');
}

function closeModal(id) {
    document.getElementById(id).classList.add('hidden');
}
