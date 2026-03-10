describe('Analyse des anomalies - TaskTimer', () => {
  it('identifie le bug de doublon visuel (B-01)', () => {
    cy.visit('/'); // Utilise la baseUrl définie plus haut

    const taskTitle = 'Test Anomalie B-01';
    
    // Saisie de la tâche
    cy.get('input[placeholder="Titre…"]').type(taskTitle);
    
    // Clic sur ajouter
    cy.contains('+ Ajouter une tâche').click();

    // Vérification : Le test doit échouer si le bug B-01 est présent
    // car .should('have.length', 1) trouvera 2 éléments (l'optimiste + le réel)
    cy.get('li.item').filter(`:contains("${taskTitle}")`).should('have.length', 1);
  });
});