import gql from 'graphql-tag'
// import jexl from 'jexl'
// import { templateStringToExpression } from 'boot/formGenerator'
import entity from './entity'

const settings = {
  // TODO: not correct anymore, remove the entire file?
  defaultValues: {
    data: {}
  }
}

const minimal = gql`
  fragment encounter_minimal on encounter {
    id
  }
`

const fragments = {
  minimal,
  list: gql`
    fragment encounter_list on encounter {
      ...encounter_minimal
      # TODO
      data
    }
    ${minimal}
  `,
  base: gql`
    fragment encounter_base on encounter {
      ...encounter_minimal
      type_id
      type {
        id
        name
        encounter_schema
      }
      entity_id
      entity {
        ...entity_base
      }
      org_unit_id
      org_unit {
        id
        name
      }
      data
      # label @client
    }
    ${entity.fragments.base}
    ${minimal}
  `
}

const queries = {
  form: gql`
    query encounter($where: encounter_bool_exp) {
      encounter(where: $where) {
        # TODO: order by
        ...encounter_base
      }
    }
    ${fragments.base}
  `,
  list: gql`
    query encounter($where: encounter_bool_exp) {
      encounter(where: $where) {
        # TODO: order by
        ...encounter_list
      }
    }
    ${fragments.list}
  `
}

const mutations = {
  delete: gql`
    mutation delete_encounter($where: encounter_bool_exp!) {
      delete_encounter(where: $where) {
        affected_rows
      }
    }
  `,
  insert: gql`
    mutation insert_encounter(
      $type_id: uuid
      $org_unit_id: uuid
      $data: jsonb
    ) {
      result: insert_encounter(
        objects: [{ type_id: $type_id, org_unit_id: $org_unit_id, data: $data }]
      ) {
        returning {
          ...encounter_base
        }
      }
    }
    ${fragments.base}
  `,
  update: gql`
    mutation update_encounter($id: uuid!, $data: jsonb) {
      result: update_encounter(
        where: { id: { _eq: $id } }
        _append: { data: $data }
      ) {
        affected_rows
        returning {
          ...encounter_base
        }
      }
    }
    ${fragments.base}
  `
}

// const resolvers = {
//   label: (item, args, ctx) => {
//     try {
//       const expression = templateStringToExpression(
//         item.type.encounter_schema.label
//       )
//       return jexl.evalSync(expression, item.data)
//     } catch (e) {
//       console.warn(e)
//       return item.id
//     }
//   }
// }

// export default { settings, fragments, queries, mutations, resolvers }
export default { settings, fragments, queries, mutations }
