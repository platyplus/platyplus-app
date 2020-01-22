import { VariableType } from 'json-to-graphql-query'

const graphQlTypes: Record<string, string> = {
  uuid: 'uuid',
  text: 'String',
  bool: 'Boolean'
}
export const graphQlType = (type: string) => graphQlTypes[type] || 'String'

export const whereCondition = (idColumnNames: string[]) => ({
  _and: idColumnNames.map(name => ({ [name]: { _eq: new VariableType(name) } }))
})

// export const idVariables = (tableClass: TableClass) =>
//   tableClass.idProperties.reduce<ObjectMap>((result, property) => {
//     result[property.name] = graphQlType(property.type) + '!'
//     return result
//   }, {})

// export const uniqueGraphQlId = (object: ObjectMap) => {
//   // * Maps the tableClasses 'composed' ids when they are loaded and available from the Vuex store
//   if (store && object.__typename) {
//     const tableClass: TableClass | undefined = store.getters['hasura/class'](
//       object.__typename
//     )
//     if (tableClass) {
//       const idColumnNames = tableClass.idColumnNames
//       if (idColumnNames.length > 1)
//         // * Generates the ID only for objects with multiple primary key columns
//         return `${tableClass.name}:${idColumnNames
//           .map(colName => object[colName])
//           .join('.')}`
//     }
//   }
//   return defaultDataIdFromObject(object)
// }

/**
 * * This function adds two generated fields to an element:
 * _label, based on the template of the property
 * _id, baed on the primary key fields of the property.
 * This function is used to create a standard label and a standard key
 * regardless of the underlying table class
 * @param element
 * @param property
 */
// export const elementAsOption = (
//   element?: GenericObject,
//   tableClass?: TableClass
// ): GenericObject | undefined => {
//   if (Array.isArray(element)) {
//     return element.map(item => elementAsOption(item, tableClass)) as ObjectArray
//   } else if (element && typeof element === 'object' && tableClass) {
//     return {
//       ...element,
//       _id: uniqueGraphQlId(element as ObjectMap),
//       _label: tableClass.label(element as ObjectMap)
//     }
//   }
//   return element
// }

/**
 * * Converts an 'option element' that has been enriched by the above function
 * * in removing the _id and _label fields
 * @param option
 */
// export const optionAsElement = (
//   option?: GenericObject
// ): GenericObject | undefined => {
//   if (Array.isArray(option)) {
//     return option.map(item => optionAsElement(item)) as ObjectArray
//   } else if (option && typeof option === 'object') {
//     // eslint-disable-next-line @typescript-eslint/no-unused-vars
//     const { _id, _label, ...result } = option
//     return result
//   }
//   return option
// }
