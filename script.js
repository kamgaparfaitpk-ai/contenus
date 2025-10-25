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

    // --- Fonctionnalité WYSIWYG pour les MENUS DÉROULANTS (Police, Taille) ---
    toolbarSelects.forEach(select => {
        select.addEventListener('change', (e) => {
            const command = select.getAttribute('data-command');
            const value = select.value;
            
            // Les commandes AVEC valeur (fontName, fontSize)
            document.execCommand(command, false, value);
            
            topTextArea.focus();

            // Réinitialise la sélection pour permettre de réappliquer la commande
            if (select.id === 'font-family-select') {
                select.value = 'Roboto';
            } else if (select.id === 'font-size-select') {
                select.value = '3'; 
            }
        });
    });


    // --- Fonctionnalité Aperçu ---
    previewButton.addEventListener('click', () => {
        const topTextContent = topTextArea.innerHTML;
        const questionTextContent = questionInput.value;

        previewTopText.innerHTML = topTextContent;
        previewQuestionText.textContent = questionTextContent; 
    });

    // --- Fonctionnalité Télécharger en JPG (avec html2canvas) ---
    downloadButton.addEventListener('click', () => {
        previewButton.click();

        html2canvas(previewArea, { 
            scale: 2, 
            useCORS: true 
        }).then(canvas => {
            const imageURL = canvas.toDataURL('image/jpeg', 0.9); 

            const link = document.createElement('a');
            link.href = imageURL;
            link.download = 'apercu_tcf.jpg';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        });
    });
});