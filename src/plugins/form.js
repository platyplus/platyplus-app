import {
  saveForm,
  smartQueryHelper,
  queryHelper,
  deleteMutation
} from 'plugins/hasura'
import { settings } from 'plugins/platyplus'

import ButtonBar from 'components/ButtonBar.vue'

export const mixin = ({
  table,
  fragment = 'base',
  formField = 'form',
  unique = false
}) => {
  return {
    props: ['id', 'createFlag', 'editFlag'],
    data () {
      return {
        [formField]: {},
        relations: settings[table].relations
          ? Object.keys(settings[table].relations).reduce((aggr, curr) => {
            aggr[curr] = []
            return aggr
          }, {})
          : {},
        list: [],
        item: settings[table].defaultValues || {}
      }
    },
    methods: {
      create () {
        this.$router.push(this.$route.path + '/create')
      },
      async save (e) {
        // Customize the save method in the component if needed
        await this._mixinPreSave()
        this._mixinPostSave()
      },
      edit () {
        this.$router.replace(this.$route.path + '/edit')
      },
      cancel () {
        this.$router.replace(
          this.$route.path.replace(this.createFlag ? '/create' : '/edit', '')
        )
      },
      reset (e) {
        if (!this.id) {
          this.item = settings[table].defaultValues || {}
        }
        // Copy the initial data to the form data
        this[formField] = { ...this.item }
        // Flatten the M2M relation fields with the corresponding IDs
        settings[table].relations &&
          Object.keys(settings[table].relations).map(relation => {
            if (this.item[relation]) {
              this.relations[relation] = this.item[relation].map(
                item => item[settings[table].relations[relation].to].id
              )
            }
          })
        // Focus on the input referenced as 'firstInput' in the template
        if (!this.reading) {
          this.$nextTick(
            () => this.$refs.firstInput && this.$refs.firstInput.focus()
          )
        }
      },
      async remove () {
        await deleteMutation({
          apollo: this.$apollo,
          table,
          data: this.id
        })
        this.$router.go(-1)
      },
      _mixinPreSave () {
        // this.submitted = true TODO: loading button
        return saveForm({
          apollo: this.$apollo,
          table,
          fragment,
          oldValues: this.item,
          newValues: this[formField],
          relations: this.relations
        })
      },
      _mixinPostSave () {
        this.$router.replace(
          this.$route.path.replace(this.createFlag ? '/create' : '/edit', '')
        )
      }
    },
    computed: {
      reading () {
        return !this.editFlag && !this.createFlag
      },
      details () {
        return this.item.id || this.createFlag
      }
    },
    apollo: {
      ...(unique
        ? {}
        : {
          list: smartQueryHelper({ table })
        }),
      item: {
        // TODO: code the subscription as well => make it generic in the hasura plugin?
        query: queryHelper({
          table,
          fragment
        }),
        variables () {
          return {
            where: { id: { _eq: this.id } }
          }
        },
        skip () {
          return !this.id
        },
        update: data => data[Object.keys(data)[0]][0]
      }
    },
    created () {
      this.reset()
    },
    watch: {
      // TODO: calling reset at so many occasion is too broad and not optimal
      // call again the method if the route changes
      $route: 'reset',
      item: 'reset',
      id: 'reset'
    }
  }
}
export default ({ app, router, Vue }) => {
  Vue.component('button-bar', ButtonBar)
}
