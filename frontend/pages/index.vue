<template>
  <div>
    <section>
      <Search
        v-model="search"
        label="Setheum Blockchain Explorer"
        placeholder="Search by block number, block hash, extrinsic hash or account address"
        show-stats
        @keydown="doSearch"
      />
      <b-container class="main py-5 dashboard">
        <LastBlocks />
        <LastTransfers />
        <div class="row" style="margin-top: 50px">
          <div class="col-md-6 mb-4">
            <LastExtrinsics />
          </div>
          <div class="col-md-6 mb-4">
            <LastEvents />
          </div>
        </div>
      </b-container>
    </section>
  </div>
</template>
<script>
import LastBlocks from '@/components/LastBlocks.vue'
import LastTransfers from '@/components/LastTransfers.vue'
import LastExtrinsics from '@/components/LastExtrinsics.vue'
import LastEvents from '@/components/LastEvents.vue'
import Search from '@/components/Search.vue'
import { network } from '@/frontend.config.js'
import commonMixin from '@/mixins/commonMixin.js'

export default {
  components: {
    LastBlocks,
    LastTransfers,
    LastExtrinsics,
    LastEvents,
    Search,
  },
  mixins: [commonMixin],
  data: () => {
    return {
      network,
      search: '',
    }
  },
  head() {
    return {
      title: 'Explorer | Setheum Network',
      meta: [
        {
          hid: 'description',
          name: 'description',
          content: 'Setheum Chain is an EVM compatible chain for DeFi',
        },
      ],
    }
  },
  methods: {
    async doSearch(event) {
      if (event.keyCode === 13) {
        if (await this.isExtrinsicHash(this.search)) {
          this.$router.push({
            path: `/extrinsic/${this.search}`,
          })
        } else if (await this.isBlockHash(this.search)) {
          this.$router.push({
            path: `/block/${this.search}`,
          })
        } else if (this.isAddress(this.search)) {
          this.$router.push({
            path: `/account/${this.search}`,
          })
        } else if (this.isBlockNumber(this.search)) {
          this.$router.push({
            path: `/block?blockNumber=${this.search}`,
          })
        }
      }
    },
  },
}
</script>
