<template>
  <div class="activity list-view">
    <div v-if="loading" class="text-center py-4">
      <Loading />
    </div>
    <div v-else-if="activities.length === 0" class="text-center py-4">
      <h5>{{ $t('components.activity.no_activity_found') }}</h5>
    </div>
    <div v-else>
      <div class="list-view__table-head">
        <JsonCSV
          :data="activities"
          class="list-view__download-btn"
          :name="`setheum_${accountId}_activity.csv`"
        >
          <font-awesome-icon icon="file-csv" />
          <span>{{ $t('pages.accounts.download_csv') }}</span>
        </JsonCSV>
      </div>

      <Table>
        <THead>
          <Cell :sortable="['hash', activeSort]">Hash</Cell>
          <Cell :sortable="['block_number', activeSort]">Block</Cell>
          <Cell :sortable="['timestamp', activeSort, true]">Date</Cell>
          <Cell :sortable="['signer', activeSort]">Signer</Cell>
          <Cell>Extrinsic</Cell>
          <Cell :sortable="['success', activeSort]" align="center"
            >Success</Cell
          >
        </THead>

        <Row v-for="(item, index) in list" :key="index">
          <Cell :link="`/extrinsic/${item.hash}`">
            {{ shortHash(item.hash) }}
          </Cell>

          <Cell
            :link="{
              url: `/block?blockNumber=${item.block_number}`,
              fill: false,
            }"
          >
            # {{ formatNumber(item.block_number) }}
          </Cell>

          <Cell class="list-view__age">
            <font-awesome-icon :icon="['far', 'clock']" />
            <span>{{ fromNow(item.timestamp) }}</span>
          </Cell>

          <Cell
            :link="{ url: `/account/${item.signer}`, fill: false }"
            :title="$t('pages.accounts.account_details')"
          >
            <SetheumIdenticon
              :key="item.signer"
              :address="item.signer"
              :size="20"
            />
            <span>{{ shortAddress(item.signer) }}</span>
          </Cell>

          <Cell>
            {{ item.section }} ➡
            {{ item.method }}
          </Cell>

          <Cell align="center">
            <font-awesome-icon
              v-if="item.success"
              icon="check"
              class="text-success"
            />
            <font-awesome-icon v-else icon="times" class="text-danger" />
          </Cell>
        </Row>
      </Table>

      <div class="list-view__pagination">
        <PerPage v-model="perPage" />
        <b-pagination
          v-model="currentPage"
          :total-rows="totalRows"
          :per-page="perPage"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { gql } from 'graphql-tag'
import JsonCSV from 'vue-json-csv'
import commonMixin from '@/mixins/commonMixin.js'
import SetheumIdenticon from '@/components/SetheumIdenticon.vue'
import Loading from '@/components/Loading.vue'
import { paginationOptions } from '@/frontend.config.js'
import tableUtils from '@/mixins/tableUtils'

export default {
  components: {
    SetheumIdenticon,
    JsonCSV,
    Loading,
  },
  mixins: [commonMixin, tableUtils],
  props: {
    accountId: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      loading: true,
      activities: [],
      filter: null,
      filterOn: [],
      tableOptions: paginationOptions,
      perPage: null,
      currentPage: 1,
      totalRows: 1,
    }
  },
  computed: {
    list() {
      return this.paginate(
        this.sort(this.activities),
        this.perPage,
        this.currentPage
      )
    },
  },
  methods: {
    handleNumFields(num) {
      localStorage.paginationOptions = num
      this.perPage = parseInt(num)
    },
    isFavorite(accountId) {
      return this.favorites.includes(accountId)
    },
    onFiltered(filteredItems) {
      // Trigger pagination to update the number of buttons/pages due to filtering
      this.totalRows = filteredItems.length
      this.currentPage = 1
    },
  },
  apollo: {
    $subscribe: {
      extrinsic: {
        query: gql`
          subscription extrinsic($signer: String!) {
            extrinsic(
              order_by: { block_number: desc }
              where: { signer: { _eq: $signer } }
            ) {
              block_number
              signer
              hash
              section
              method
              success
              timestamp
            }
          }
        `,
        variables() {
          return {
            signer: this.accountId,
          }
        },
        skip() {
          return !this.accountId
        },
        result({ data }) {
          this.activities = data.extrinsic
          this.totalRows = this.activities.length
          this.loading = false
        },
      },
    },
  },
}
</script>

<style>
.activity {
  background-color: white;
}
.spinner {
  color: #d3d2d2;
}
</style>
