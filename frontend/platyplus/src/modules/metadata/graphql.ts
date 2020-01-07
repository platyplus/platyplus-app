import gql from 'graphql-tag'

export const LIST_TABLES = gql`
  query listTables {
    _metadata {
      name
      schema
    }
  }
`

const ruleFragment = gql`
  fragment ruleFragment on Rule {
    type
    parameters
    paths
  }
`
const columnFragment = gql`
  fragment columnFragment on Column {
    name
    type
    domain
    insertDefault
    insertReadonly
    insertRules {
      ...ruleFragment
    }
    updateDefault
    updateReadonly
    updateRules {
      ...ruleFragment
    }
  }
  ${ruleFragment}
`

const mappingFragment = gql`
  fragment mappingFragment on ColumnMapping {
    from {
      ...columnFragment
    }
    to {
      ...columnFragment
    }
  }
  ${columnFragment}
`

const targetFragment = gql`
  # // TODO relationship permissions
  fragment targetFragment on Table {
    id
    name
    schema
    listQuery # // TODO remove and add optionsQuery to Relationship
  }
`

export const TABLE_QUERY = gql`
  query tableQuery($id: String!) {
    _metadataTable(id: $id) {
      id
      name
      schema
      label {
        template
      }
      canSelect
      canInsert
      canUpdate
      canDelete
      listQuery
      elementQuery
      insertRules {
        ...ruleFragment
      }
      updateRules {
        ...ruleFragment
      }
      deleteRules {
        ...ruleFragment
      }
      idFields {
        ...columnFragment
      }
      fields {
        id
        name
        kind
        ... on Column {
          ...columnFragment
        }
        ... on SingleRelationship {
          comment
          target {
            ...targetFragment
          }
          mapping {
            ...mappingFragment
          }
        }
        ... on OneToManyRelationship {
          comment
          target {
            ...targetFragment
          }
          mapping {
            ...mappingFragment
          }
        }
        ... on ManyToManyRelationship {
          comment
          target {
            ...targetFragment
          }
          mapping {
            ...mappingFragment
          }
          through {
            ...targetFragment
          }
          throughMapping {
            ...mappingFragment
          }
        }
      }
    }
  }
  ${columnFragment}
  ${mappingFragment}
  ${targetFragment}
`
