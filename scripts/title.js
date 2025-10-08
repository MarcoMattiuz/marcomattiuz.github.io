window.initVara = function(color) {
    // Distruggi l'istanza precedente se esiste
    if (window.vara) {
        const container = document.querySelector("#vara-container");
        container.innerHTML = '';
    }
    
    window.vara = new Vara("#vara-container", "../libs/font.json", [{
        text: "Marco Mattiuz",
        fontSize: 30,
        strokeWidth: 2,
        color: color
    }], {
        textAlign: "center"
    });
}

