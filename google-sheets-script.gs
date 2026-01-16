
// =================================================================================================
// GOOGLE APPS SCRIPT pour connecter votre formulaire à Google Sheets
// =================================================================================================
//
// INSTRUCTIONS :
//
// 1.  **CRÉER UN NOUVEAU SCRIPT GOOGLE APPS :**
//     -   Allez à https://script.google.com/
//     -   Cliquez sur "Nouveau projet".
//     -   Supprimez tout le contenu de l'éditeur de code.
//     -   Copiez et collez l'intégralité de ce code dans l'éditeur.
//
// 2.  **CONFIGURER VOTRE GOOGLE SHEET :**
//     -   Ouvrez votre Google Sheet (ou créez-en un nouveau).
//     -   Récupérez l'ID de votre feuille de calcul à partir de l'URL.
//         -   Exemple : `https://docs.google.com/spreadsheets/d/THIS_IS_THE_ID/edit`
//     -   Collez cet ID dans la variable `SHEET_ID` ci-dessous.
//     -   Assurez-vous que la première ligne de votre feuille contient les en-têtes
//         correspondant aux noms des champs de votre formulaire HTML :
//         `Timestamp`, `lastname`, `firstname`, `email`, `company`, `phone`, `profile`, `newsletter`, `consent`
//
// 3.  **DÉPLOYER LE SCRIPT COMME UNE APPLICATION WEB :**
//     -   En haut à droite, cliquez sur "Déployer" > "Nouveau déploiement".
//     -   Dans la fenêtre qui s'ouvre :
//         -   Cliquez sur l'icône d'engrenage à côté de "Sélectionner le type".
//         -   Choisissez "Application web".
//         -   Dans la section "Configuration de l'application web" :
//             -   **Description :** (Optionnel) "API pour formulaire de contact"
//             -   **Exécuter en tant que :** "Moi (votre.email@gmail.com)"
//             -   **Qui a accès :** "Tout le monde"
//     -   Cliquez sur "Déployer".
//
// 4.  **AUTORISER LES PERMISSIONS :**
//     -   Une fenêtre "Autorisation requise" apparaîtra. Cliquez sur "Autoriser l'accès".
//     -   Choisissez votre compte Google.
//     -   Vous verrez peut-être un avertissement "Google n'a pas validé cette application".
//         C'est normal. Cliquez sur "Paramètres avancés", puis sur "Accéder à [Nom de votre projet]".
//
// 5.  **RÉCUPÉRER L'URL DE L'APPLICATION WEB :**
//     -   Après le déploiement, une fenêtre affichera une **URL de l'application web**.
//     -   Copiez cette URL. Vous en aurez besoin pour la prochaine étape.
//
// =================================================================================================

// Remplacez cette valeur par l'ID de votre Google Sheet.
const SHEET_ID = 'YOUR_GOOGLE_SHEET_ID';

/**
 * Traite les requêtes POST envoyées à l'URL de l'application web.
 * @param {Object} e - L'objet d'événement de la requête.
 */
function doPost(e) {
  let lock = LockService.getScriptLock();
  lock.waitLock(30000); // Attendre jusqu'à 30 secondes pour obtenir le verrou.

  try {
    // Ouvrir la feuille de calcul
    const sheet = SpreadsheetApp.openById(SHEET_ID).getActiveSheet();

    // Récupérer les données du formulaire
    const data = JSON.parse(e.postData.contents);

    // Créer une nouvelle ligne avec les données
    const newRow = [
      new Date(), // Timestamp
      data.lastname || '',
      data.firstname || '',
      data.email || '',
      data.company || '',
      data.phone || '',
      data.profile || '',
      data.newsletter ? 'Oui' : 'Non',
      data.consent ? 'Oui' : 'Non',
    ];

    // Ajouter la nouvelle ligne à la feuille
    sheet.appendRow(newRow);

    // Retourner une réponse de succès
    return ContentService
      .createTextOutput(JSON.stringify({ result: 'success' }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    // En cas d'erreur, l'enregistrer dans la feuille de calcul si possible
    // et retourner une réponse d'erreur.
    try {
      const errorSheet = SpreadsheetApp.openById(SHEET_ID).getSheetByName('Errors') || SpreadsheetApp.openById(SHEET_ID).insertSheet('Errors');
      errorSheet.appendRow([new Date(), error.toString()]);
    } catch (e) {
      // Si l'enregistrement de l'erreur échoue, ne rien faire.
    }
    
    return ContentService
      .createTextOutput(JSON.stringify({ result: 'error', message: error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);

  } finally {
    // Libérer le verrou
    lock.releaseLock();
  }
}
