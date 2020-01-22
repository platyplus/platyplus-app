/* eslint-disable @typescript-eslint/no-explicit-any */
interface VeeOberverComponent extends Element {
  validate: () => boolean
  reset: () => void
}

export class FormManagerMixin {
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
    // const data = await saveMutation(
    //   this.tableClass,
    //   this.element,
    //   this.form,
    //   changes
    // )
    // this.reset() // Reset is required to then check if any field changed in the beforeRouteLeave hook
    // this.read(pick(data, this.tableClass.idColumnNames))
    // } else this.read()
  }

  public beforeRouteEnter(_to: any, _from: any, next: any) {
    next((vm: any) => {
      vm.reset()
      if (!vm.canSave) {
        console.warn(`cannot ${vm.action}`) // TODO navigation guard insert + update
      }
    })
  }

  public beforeRouteLeave(_to: any, _from: any, next: any) {
    //* See https://router.vuejs.org/guide/advanced/navigation-guards.html#in-component-guards
    // if (this.formChanged) {
    //   console.log('Confirm leaving the page if modifications done') // TODO
    // }
    next()
  }
}
