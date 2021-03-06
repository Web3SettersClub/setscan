<template>
  <div>
    <section>
      <b-container class="extrinsic-page main py-5">
        <div v-if="loading" class="text-center py-4">
          <Loading />
        </div>
        <NotFound v-else-if="!parsedExtrinsic" text="Extrinsic not found" />
        <Extrinsic v-else :extrinsic="parsedExtrinsic" />
      </b-container>
    </section>
  </div>
</template>
<script>
import { gql } from 'graphql-tag'
import Loading from '@/components/Loading.vue'
import Extrinsic from '@/components/Extrinsic.vue'
import commonMixin from '@/mixins/commonMixin.js'

export default {
  components: {
    Loading,
    Extrinsic,
  },
  mixins: [commonMixin],
  data() {
    return {
      loading: true,
      blockNumber: this.$route.params.block,
      extrinsicIndex: this.$route.params.index,
      parsedExtrinsic: undefined,
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
  watch: {
    $route() {
      this.blockNumber = this.$route.params.block
      this.extrinsicIndex = this.$route.params.index
    },
  },
  apollo: {
    extrinsic: {
      query: gql`
        query extrinsic($block_number: bigint!, $extrinsic_index: Int!) {
          extrinsic(
            where: {
              block_number: { _eq: $block_number }
              extrinsic_index: { _eq: $extrinsic_index }
            }
          ) {
            block_number
            extrinsic_index
            is_signed
            signer
            section
            method
            args
            hash
            doc
            fee_info
            fee_details
            success
            timestamp
          }
        }
      `,
      skip() {
        return !this.blockNumber || !this.extrinsicIndex
      },
      variables() {
        return {
          block_number: this.blockNumber,
          extrinsic_index: this.extrinsicIndex,
        }
      },
      result({ data }) {
        this.parsedExtrinsic = data.extrinsic[0]
        this.loading = false
      },
    },
  },
}
</script>
