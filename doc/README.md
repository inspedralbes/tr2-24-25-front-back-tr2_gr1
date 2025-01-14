# Documentació
Llistat d'alguns dels punts que han de quedar explicats en aquesta carpeta. Poden ser tots en aquest fitxer o en diversos fitxers enllaçats.

És obligatori modificar aquest document!!

## Documentació bàsica MÍNIMA
 * Objectius
 * Arquitectura bàsica
   * Tecnologies utilitzades
   * Interrelació entre els diversos components
 * Com crees l'entorn de desenvolupament
 * Com desplegues l'aplicació a producció
 * Llistat d'endpoints de l'API de backend
    * Rutes
   * Exemples de JSON de peticó
   * Exemples de JSON de resposta i els seus codis d'estat 200? 404?
 * Aplicació Android
 * Altres elements importants.
 * ...

# Backend
  El backend (Node.js) del projecte té un arxiu principal index.js amb un servidor express, des d'aquest arxiu es fan connexions amb les bases de dades (MongoDB i MySQL) i s'estableixen endpoints per obtenir-ne i/o modificar-ne la informació.

  L'arxiu token.js gestiona la creació i verificació de tokens de sessió usant la llibreria jsonwebtoken.

  Aquest backend també compta amb un sistema de microserveis (/back/services) que s'aixequen des de l'app d'Android:
  
  * El directori /activity gestiona el sistema de comentaris i votacions de la pàgina d'activitats del front.
  * El directori /chat gestiona el sistema de xat de l'aplicació, creant sales per cada associació i guardant els missatges a MongoDB. Implementa també web Sockets per la actualització d'informació en temps real.
  * El directori /news gestiona la pàgina de notícies de l'aplicació permetent-ne un CRUD.
  * El directori /stats gestiona les estadístiques que es generen de l'aplicació. L'arxiu index.js escriu les dades de MongoDB en un arxiu json i executa l'script de python.

# Frontend del Projecte

El teu frontend està desenvolupat amb **Vue 3** i **Vite**, utilitzant tecnologies addicionals com **Tailwind CSS** i **PrimeVue** per al disseny i els components de la interfície d'usuari. Aquí tens una visió general dels components clau i l'estructura:

## Estructura del Projecte
- **src**: Conté el codi font principal del frontend.  
- **assets**: Conté els fitxers CSS i altres recursos estàtics.  
- **primevue**: Conté els estils específics de PrimeVue.  
- **components**: Conté els components de Vue utilitzats en tota l'aplicació.  
- **views**: Conté els components de Vue que representen diferents pàgines o vistes de l'aplicació.  
- **services**: Conté fitxers JavaScript per gestionar la comunicació amb l'API.  
- **stores**: Conté els magatzems de **Pinia** per a la gestió de l'estat.  
- **router**: Conté la configuració del **Vue Router**.  
- **App.vue**: El component arrel de l'aplicació.  
- **main.js**: El punt d'entrada de l'aplicació, on es crea i munta la instància de Vue.  

## Components i Vistes Clau
- **NavigationBar.vue**: Un component de barra de navegació que proporciona enllaços a diferents seccions de l'aplicació, com "Notícies", "Propostes", "Xat" i "Calendari".   
- **PropostaDetall.vue**: Una vista detallada per mostrar una proposta específica, incloent comentaris i funcionalitat de votació.  
- **PerfilView.vue**: Una vista per mostrar i editar la informació del perfil de l'usuari.  
- **NewActivity.vue**: Una vista per crear una nova proposta o activitat.  
- **XatView.vue**: Una vista per a la funcionalitat de xat, incloent un component de xat i una barra de navegació.  
- **Calendar.vue**: Una vista per mostrar un calendari amb esdeveniments.  

## Estilització
- **Tailwind CSS**: Utilitzat per a un estil de CSS basat en utilitats.  
- **PrimeVue**: Proporciona un conjunt de components d'interfície d'usuari estilitzats amb Tailwind CSS.  

## Gestió de l'Estat
- **Pinia**: Utilitzat per a la gestió de l'estat, amb magatzems definits al directori *stores*.  

## Navegació
- **Vue Router**: Configurat a *index.js* per gestionar la navegació entre diferents vistes.  

## Comunicació amb l'API
- **comunicationManager.js**: Conté funcions per fer sol·licituds a l'API del backend, com obtenir propostes, enviar vots i gestionar l'autenticació d'usuaris.

# Base de Dades
El projecte fa servir dues BBDD, MySql i MongoDB. Totes les connexions amb aquestes BBDD es gestionen del del backend.

## MySQL
A MySQL emmagatzamem la següent informació:
- Usuaris
- Associacions
- Activitats
- Propostes
- Notícies

Amb totes les interrelacions necessàries.

## MongoDB
A MongoDB guardem la següent informació:
- Sales de xats
- Missatges de xats
- Votacions de propostes

# Esquema de pantalles
- PENPOT: https://design.penpot.app/#/view/a0a8e792-b2d2-818e-8005-5cde9cd6dfe5?page-id=a0a8e792-b2d2-818e-8005-5cde9cd6dfe6&section=interactions&frame-id=e9c0f044-26f2-8008-8005-5e4f1c789fff&index=0&share-id=a0a8e792-b2d2-818e-8005-5f7d9dc41abf