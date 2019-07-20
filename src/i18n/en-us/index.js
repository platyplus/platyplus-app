export default {
  yes: 'Yes',
  no: 'No',
  ok: 'OK',
  cancel: 'Cancel',
  previous: 'Previous',
  next: 'Next',
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
  encounter_type: {
    label_plural: 'Encounter types',
    labels: {
      name: 'Name',
      create: 'Creation label',
      isolated_uses: 'Isolated uses',
      entity_type: '@:entity_type.label',
      encounter_schema: 'Schema'
    },
    helpers: {
      name: 'Name fo the encounter type',
      create: 'Label used for creating an encounter',
      isolated_uses:
        'Org units using this encounter type outside of a workflow',
      entity_type: 'Type of the entity with which the encounter type works'
    },
    errors: {
      name: 'Invalid name',
      create: 'Invalid label',
      isolated_uses: 'Invalid list of isolated used',
      entity_type: 'Invalid entity type'
    },
    actions: {
      create: 'Create a new encounter type'
    }
  },
  entity_type: {
    label: 'Entity type',
    labels: {
      name: 'Name',
      encounter_types: '@:encounter_type.label_plural'
    },
    helpers: {
      name: 'Name of the entity type'
    },
    errors: {
      name: 'Invalid name'
    },
    actions: {
      encounter_types: {
        create: '@:encounter_type.actions.create'
      }
    }
  },
  org_unit: {
    label: 'Org Unit',
    label_plural: 'Org Units',
    labels: {
      name: 'Name',
      parent: 'Parent',
      children: 'Children',
      type: '@:org_unit_type.label',
      role_attributions: '@:role_attribution.label_plural',
      workflows: '@:workflow.label_plural'
    },
    helper: 'Choose an org unit',
    helpers: {
      name: 'Enter the name of the org unit',
      type: 'Select the type of the org unit',
      parent:
        "Select the org unit's parent. Choose none if this is a root org unit",
      workflows: 'Select the available workflows for this org unit'
    },
    error: 'Invalid org unit',
    errors: {
      name: 'Invalid name',
      type: 'Invalid type',
      parent: 'Invalid parent',
      workflows: 'Invalid workflows selection'
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
    label_plural: 'Types',
    labels: {
      name: 'Name',
      from: 'Possible parents',
      to: 'Possible children'
    },
    helpers: {
      name: 'Enter the name of the Org Unit Type',
      from:
        'Select the possible types of parents this type can get. No parents means a root type.',
      to: 'Select the possible types of children this type can get'
    },
    errors: {
      name: 'Invalid name',
      from: 'Invalid list of parents',
      to: 'Invalid list of children'
    }
  },
  role: {
    label: 'Role',
    labels: {
      name: 'Name',
      role_attributions: '@:role_attribution.label_plural'
    },
    helper: 'Choose a role',
    helpers: {
      name: 'Enter the name of the role'
    },
    error: 'Invalid role',
    errors: {
      name: 'Invalid name'
    },
    actions: {
      role_attributions: {
        create: '@:role_attribution.actions.create'
      }
    }
  },
  role_attribution: {
    label_plural: 'Permissions',
    labels: {
      user: '@:user.label',
      role: '@:role.label',
      org_unit: '@:org_unit.label'
    },
    helpers: {
      user: '@:user.helper',
      role: '@:role.helper',
      org_unit: '@:org_unit.helper'
    },
    errors: {
      user: '@:user.error',
      role: '@:role.error',
      org_unit: '@:org_unit.error'
    },
    actions: {
      create: 'Create a new role attribution'
    }
  },
  stage: {
    label_plural: 'Stages',
    labels: {
      name: 'Name',
      previous: 'Previous stages',
      next: 'Next stages'
    },
    helpers: {
      name: 'Name of the stage',
      previous: 'Possible previous stages',
      next: 'Possible next stages'
    },
    errors: {
      name: 'Invalid name',
      previous: 'Invalid previous stages',
      next: 'Invalid next stages'
    },
    actions: {
      create: 'Create a new stage'
    }
  },
  user: {
    label: 'User',
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
    helper: 'Choose a user',
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
    error: 'Invalid user',
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
    label_plural: 'Workflows',
    labels: {
      name: 'Name',
      stages: '@:stage.label_plural',
      org_units: '@:org_unit.label_plural'
    },
    helpers: {
      name: 'Name of the workflow',
      org_units: 'Org Units using the workflow'
    },
    errors: {
      name: 'Invalid name',
      org_units: 'Invalid org units'
    },
    actions: {
      stages: {
        create: '@:stage.actions.create'
      }
    }
  }
}
