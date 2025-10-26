// Fonction personnalisée pour appliquer la hauteur de ligne (interligne)
function setLineHeight(value) {
    const topTextArea = document.getElementById('top-text-area');
    // Applique le style directement à l'élément conteneur
    topTextArea.style.lineHeight = value; 
}

// Fonction : Applique le font-weight (graisse) à la sélection
function setFontWeight(value) {
    // Utilise execCommand avec 'insertHTML' pour encapsuler le texte sélectionné
    // dans une balise <span> avec le style font-weight désiré.
    document.execCommand('insertHTML', false, '<span style="font-weight: ' + value + '">' + window.getSelection().toString() + '</span>');
}

document.addEventListener('DOMContentLoaded', () => {
    const topTextArea = document.getElementById('top-text-area');
    const questionInput = document.getElementById('question-input');
    const previewButton = document.getElementById('preview-button');
    const downloadButton = document.getElementById('download-button');
    const previewArea = document.getElementById('preview-area');
    const previewTopText = document.getElementById('preview-top-text');
    const previewQuestionText = document.getElementById('preview-question-text');
    
    const toolbarButtons = document.querySelectorAll('.toolbar button');
    const toolbarSelects = document.querySelectorAll('.toolbar select');

    // --- Fonctionnalité WYSIWYG pour les BOUTONS ---
    toolbarButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault(); 
            const command = button.getAttribute('data-command');
            document.execCommand(command, false, null);
            topTextArea.focus();
        });
    });

    // --- Fonctionnalité WYSIWYG pour les MENUS DÉROULANTS ---
    toolbarSelects.forEach(select => {
        select.addEventListener('change', (e) => {
            const command = select.getAttribute('data-command');
            const value = select.value;
            
            if (command === 'lineHeight') {
                setLineHeight(value);
            } else if (command === 'fontWeight') {
                setFontWeight(value);
            } else {
                document.execCommand(command, false, value);
            }
            
            topTextArea.focus();

            // Réinitialisation des sélecteurs
            if (select.id === 'font-family-select') {
                select.value = 'Roboto';
            } else if (select.id === 'font-size-select') {
                select.value = '3'; 
            } else if (select.id === 'font-color-select') {
                select.value = '#333333';
            } else if (select.id === 'line-height-select') {
                select.value = '1.5';
            } else if (select.id === 'font-weight-select') { 
                select.value = '';
            }
        });
    });


    // --- Fonctionnalité Aperçu (synchronisation des styles) ---
    previewButton.addEventListener('click', () => {
        // 1. Synchronisation des styles CSS appliqués directement au conteneur (comme l'interligne)
        // COPIE LE STYLE line-height DU CONTENEUR
        previewTopText.style.lineHeight = topTextArea.style.lineHeight || '1.5'; 

        // 2. Copie le contenu HTML (incluant les <span> pour la graisse, la couleur, etc.)
        const topTextContent = topTextArea.innerHTML;
        const questionTextContent = questionInput.value;

        previewTopText.innerHTML = topTextContent;
        previewQuestionText.textContent = questionTextContent; 
    });

    // --- Fonctionnalité Télécharger en JPG (avec html2canvas) ---
    downloadButton.addEventListener('click', () => {
        previewButton.click(); // Assure que l'aperçu est à jour avant la capture

        html2canvas(previewArea, { 
            scale: 2, 
            useCORS: true,
            allowTaint: true 
        }).then(canvas => {
            const imageURL = canvas.toDataURL('image/jpeg', 0.9); 

            const link = document.createElement('a');
            link.href = imageURL;
            link.download = 'apercu_tcf.jpg';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }).catch(error => {
            console.error("Erreur lors de la capture d'écran :", error);
            alert("Erreur lors de la capture d'écran. Veuillez vérifier la console pour plus de détails.");
        });
    });
});
