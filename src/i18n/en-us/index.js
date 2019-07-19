// This is just an example,
// so you can safely delete all default props below

export default {
  yes: 'Yes',
  no: 'No',
  ok: 'OK',
  cancel: 'Cancel',
  reset: 'Reset',
  edit: 'Edit',
  create: 'Create',
  remove: 'Remove',
  select: 'Select',
  location: {
    message: 'You are in {location}.',
    select: 'Select your location:',
    change: 'Change location'
  },
  language: 'Language',
  logout: {
    message: 'Are you sure to want to sign out?'
  },
  org_unit: {
    labels: {
      name: 'Name',
      parent: 'Parent',
      children: 'Children',
      type: 'Type',
      role_attributions: 'Role attributions',
      workflows: '@:workflow.label_plural'
    },
    actions: {
      children: {
        create: 'Create a new child org unit'
      },
      role_attributions: {
        create: '@:role_attribution.actions.create'
      }
    }
  },
  org_unit_type: {
    label: 'Type',
    label_plural: 'Types'
  },
  role_attribution: {
    label_plural: 'Role attributions',
    actions: {
      create: 'Create a new role attribution'
    }
  },
  user: {
    labels: {
      username: 'User name',
      password: 'Password',
      created_at: 'Member since',
      roles: 'Global roles',
      membership: 'Membership',
      preferred_org_unit: 'Preferred location',
      first_name: 'First name',
      last_name: 'Last name',
      language: '@:language',
      role_attributions: '@:role_attribution.label_plural'
    },
    helpers: {
      username: 'Enter your user name',
      password: 'Enter your password',
      roles: 'Select the global roles',
      membership: 'Pick org units',
      language: 'Pick a language',
      preferred_org_unit: 'Pick an org unit',
      first_name: 'Enter a first name',
      last_name: 'Enter a last name'
    },
    errors: {
      username: 'User name is required',
      password: 'Password is required',
      first_name: 'Invalid first name',
      last_name: 'Invalid last name',
      language: 'You must select a language',
      preferred_org_unit: 'You must select a preferred org uni'
    },
    actions: {
      role_attributions: {
        create: '@:role_attribution.actions.create'
      }
    },
    profile: {
      title: 'Profile'
    }
  },
  workflow: {
    label: 'Workflow',
    label_plural: 'Workflows'
  }
}
