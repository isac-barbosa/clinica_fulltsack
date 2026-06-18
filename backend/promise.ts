// Exemplo de Promise simulando tempo de espera
function esperarTempo(ms) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve(`Esperou ${ms}ms`);
            // Para simular erro: 
            reject(new Error('Falhou'));
        }, ms);
    });
}
esperarTempo(2000).then(resultado => console.log(resultado)).catch(erro => console.error(erro)).finally(() => console.log('Finalizado'));
