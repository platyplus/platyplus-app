import fr from 'vee-validate/dist/locale/fr.json'
/*eslint-disable @typescript-eslint/camelcase */
export default {
  title: 'Platyplus',
  validation: fr.messages,
  yes: 'Oui',
  no: 'Non',
  ok: 'OK',
  cancel: 'Annuler',
  reset: 'Réinitialiser',
  edit: 'Editer',
  create: 'Créer',
  remove: 'Supprimer',
  select: 'Sélectionner',
  index: {
    title: 'Accueil'
  },
  location: {
    message: 'Votre emplacement: {location}.',
    select: 'Choisissez votre emplacement:',
    change: "Changez d'emplacement"
  },
  language: 'Langue',
  login: {
    button: 'Se connecter'
  },
  logout: {
    message: 'Êtes-vous sûr de vouloir vous déconnecter?'
  },
  authentication: {
    title: 'Identification',
    labels: {
      username: '@:user.labels.username',
      password: '@:user.labels.password'
    },
    helpers: {
      username: '@:user.helpers.username',
      password: '@:user.helpers.password'
    },
    errors: {
      username: {
        not_found: 'Utilisateur introuvable'
      },
      password: {
        invalid: 'Mot de passe incorrect'
      }
    }
  },
  user: {
    labels: {
      username: "Nom d'utilisateur",
      password: 'Mot de passe',
      created_at: 'Membre depuis',
      roles: 'Roles globaux',
      membership: 'Membre des emplacements',
      preferred_org_unit: 'Emplacement préféré',
      attributes: {
        first_name: 'Prénom',
        last_name: 'Nom de famille'
      }
    },
    helpers: {
      username: "Nom d'utilisateur",
      password: 'Mot de passe',
      roles: 'Rôles globaux',
      membership: 'Emplacements',
      language: 'Langue',
      preferred_org_unit: 'Choisir un emplacement',
      first_name: 'Prénom',
      last_name: 'Nom de famille'
    },
    profile: {
      title: 'Profil'
    }
  }
}
