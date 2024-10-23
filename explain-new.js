export const cours = {
    title: "Programmation en Python",
    content: [
      {
        type: "partie",
        title: "Introduction",
        content: [
          {
            type: "chapitre",
            title: "Présentation du langage",
            content: [
              {
                type: "paragraphe",
                text: "Histoire de Python"
              },
              {
                type: "paragraphe",
                text: "Caractéristiques principales"
              },
              {
                type: "notion",
                text: "Philosophie de Python"
              }
            ]
          },
          {
            type: "notion",
            text: "Evolution de Python"
          },
          {
            type: "chapitre",
            title: "Installation et configuration",
            content: [
              {
                type: "paragraphe",
                text: "Télécharger Python"
              },
              {
                type: "paragraphe",
                text: "Configurer l'environnement de développement"
              },
              {
                type: "notion",
                text: "Différentes versions de Python"
              }
            ]
          }
        ]
      },
      {
        type: "notion",
        text: "Importance de la programmation"
      },
      {
        type: "partie",
        title: "Bases du langage",
        content: [
          {
            type: "chapitre",
            title: "Syntaxe de base",
            content: [
              {
                type: "paragraphe",
                text: "Variables et types de données"
              },
              {
                type: "paragraphe",
                text: "Opérateurs"
              },
              {
                type: "notion",
                text: "Style de code en Python (PEP 8)"
              }
            ]
          },
          {
            type: "notion",
            text: "Bonnes pratiques de programmation"
          },
          {
            type: "chapitre",
            title: "Structures de contrôle",
            content: [
              {
                type: "paragraphe",
                text: "Les boucles"
              },
              {
                type: "notion",
                text: "Utilisation des boucles en Python"
              },
              {
                type: "paragraphe",
                text: "Les conditions"
              }
            ]
          }
        ]
      },
      {
        type: "notion",
        text: "Comparaison avec d'autres langages de programmation"
      },
      {
        type: "partie",
        title: "Fonctions",
        content: [
          {
            type: "chapitre",
            title: "Définition et appel de fonctions",
            content: [
              {
                type: "paragraphe",
                text: "Syntaxe des fonctions"
              },
              {
                type: "paragraphe",
                text: "Arguments et paramètres"
              }
            ]
          },
          {
            type: "notion",
            text: "Importance des fonctions en programmation"
          },
          {
            type: "chapitre",
            title: "Fonctions lambda",
            content: [
              {
                type: "paragraphe",
                text: "Syntaxe des lambda"
              },
              {
                type: "paragraphe",
                text: "Utilisations courantes"
              }
            ]
          },
          {
            type: "notion",
            text: "Portée des variables"
          }
        ]
      },
      {
        type: "notion",
        text: "Bonnes pratiques en programmation"
      }
    ]
  };
  
  function generateHTML(content, level = 1) {
    let html = '';
  
    content.forEach(item => {
      if (item.type === 'partie') {
        html += `<h2>${item.title}</h2>`;
        if (item.content) {
          html += generateHTML(item.content, level + 1);
        }
      } else if (item.type === 'chapitre') {
        html += `<h3>${item.title}</h3>`;
        if (item.content) {
          html += generateHTML(item.content, level + 1);
        }
      } else if (item.type === 'paragraphe') {
        html += `<h4>${item.text}</h4>`;
      } else if (item.type === 'notion') {
        html += `<p>${item.text}</p>`;
      }
    });
  
    return html;
  }
  
  function renderCourse(course) {
    let html = `<h1>${course.title}</h1>`;
    html += generateHTML(course.content);
    return html;
  }
  
  // Appel de la fonction pour afficher le cours
  //console.log(renderCourse(cours));
  