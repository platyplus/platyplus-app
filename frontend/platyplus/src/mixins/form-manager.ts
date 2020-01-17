import { Route } from 'vue-router'
import { Component, Watch } from 'vue-property-decorator'

import { ObjectMap } from '../modules/common'

Component.registerHooks([
  'beforeRouteEnter',
  'beforeRouteLeave',
  'beforeRouteUpdate'
])

interface VeeOberverComponent extends Element {
  validate: () => boolean
  reset: () => void
}

export class FormManagerMixin {
  // extends Mixins(ElementLoaderMixin) {
  public form: ObjectMap = {}

  /**
   * 1. Insert
   * a. Basic scalar columns: object { x: "abc", y: true, z: 123 }
   * b. ManyToOne keys (e.g. org_unit.parent)
   *    => object { relationship_id } IF THE TARGET ALREADY EXISTS
   *    => object { relationship: { data : { ... } } } IF THE TARGET HAS TO BE CREATED
   * c. OneToMany keys (e.g. org_unit.children)
   *    => update_relationship_name (set: [ { parent_id: <object_id> } ] where: { id: { _in: <children_ids> } } ) { affected_rows } ID TARGETS ALREADY EXISTS
   *    => object { relationship: { data: [ { ... }, { ... }] } } IF TARGETS HAVE TO BE CREATED
   * d. ManyToMany
   *    =>  - add:    insert_join_table
   *        - remove: delete_join_table
   *    => IF TARGETS NEED TO BE CREATED? -> in the main insert
   *
   * 2. Update
   * a. Basic scalar columns update (set, where id)
   * b. ManyToOne
   *
   *
   * CONCLUSION:
   * - Mettre de côté la création de nested objects pour le moment
   * - faire la distinction insert/update
   * - 1: insert/update les scalars + les xxxToOne
   * - 2: add/delete les M2M
   *
   * RESTERA:
   * - Mise à jour du cache (prioritaire)
   * - Insertion de nested objects lors d'une insertion et lors d'une mise à jour
   */
  public async submit() {
    // const validator = this.$refs.validator as VeeOberverComponent
    // if (!!validator && !(await validator.validate())) return
    // const changes = this.changes
    // if (Object.keys(changes).length > 0) {
    //   console.warn('IMPLEMENT SAVE') // TODO recode
    //   // const data = await saveMutation(
    //   //   this.tableClass,
    //   //   this.element,
    //   //   this.form,
    //   //   changes
    //   // )
    //   // this.reset() // Reset is required to then check if any field changed in the beforeRouteLeave hook
    //   // this.read(pick(data, this.tableClass.idColumnNames))
    // } else this.read()
  }

  public reset() {
    // TODO sort the following todos either in the 'reset' method (when the user can still modify the field) or in the 'save' method (when the user is not allowed to modify its value)
    // TODO set 'fixed' values from the route query e.g. query: {parent_id: '1234'} when creating a child org_unit -> field component
    // TODO set default values from the initial element -> on save
    // TODO set default values from the hasura permissions and from the backend schema -> on save
    /**
     * Every field is checked with the user's ability before being added
     */
    // TODO complicated and not really usefull here to filter allowed fields.
    // TODO Do it at field validation level/save level
    // ! https://sam.beckham.io/wrote/deep-copying-and-the-immutability-issue.html
    // this.form = JSON.parse(JSON.stringify(this.element))
    // const validator = this.$refs.validator as VeeOberverComponent
    // this.$nextTick(() => !!validator && validator.reset())
  }

  /**
   * Watches if the element has been loaded, so it can set the initial form.
   */
  @Watch('element')
  public onElementChanged() {
    this.reset()
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public beforeRouteEnter(to: Route, from: Route, next: any) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    next((vm: any) => {
      vm.reset()
      if (!vm.canSave) {
        console.log(`cannot ${vm.action}`) // TODO navigation guard insert + update
      }
    })
  }

  /**
   * * Returns the changes made in the form based on the initial element
   * ! The objects are compared with JSON.stringify, which requires a strict manipulation
   * TODO the many2many selected options are not correctly generated (returns all the columns instead of id + label columns)
   */
  public get changes(): ObjectMap {
    const newValue: ObjectMap = {}
    // TODO recode
    // for (const property of this.fields(this.action)) {
    //   const name = property.name
    //   if (property.isColumn) {
    //     if (this.form[name] !== this.element[name])
    //       newValue[name] = this.form[name]
    //   } else {
    //     const relationship = property as RelationshipProperty
    //     if (relationship.isMultiple) {
    //       const oldArray = (this.element[name] || []) as ObjectMap[]
    //       const newArray = (this.form[name] || []) as ObjectMap[]
    //       const oldStrArray = oldArray.map(item => JSON.stringify(item))
    //       const newStrArray = newArray.map(item => JSON.stringify(item))
    //       const _add = newStrArray
    //         .filter(item => !oldStrArray.includes(item))
    //         .map(item => JSON.parse(item))
    //       const _remove = oldStrArray
    //         .filter(item => !newStrArray.includes(item))
    //         .map(item => JSON.parse(item))
    //       if (_add.length || _remove.length) {
    //         newValue[name] = { _add, _remove }
    //       }
    //     } else {
    //       if (
    //         JSON.stringify(this.element[name]) !==
    //         JSON.stringify(this.form[name])
    //       )
    //         newValue[name] = this.form[name]
    //     }
    //   }
    // }
    return newValue
  }

  /**
   * * Returns true if any modification has been done in the form
   */
  public get formChanged(): boolean {
    return Object.keys(this.changes).length > 0
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public beforeRouteLeave(to: Route, from: Route, next: any) {
    //* See https://router.vuejs.org/guide/advanced/navigation-guards.html#in-component-guards
    if (this.formChanged) {
      console.log('Confirm leaving the page if modifications done') // TODO
    }
    next()
  }
}
