<template>
  <div>
    <section>
      <b-container class="contract-call main py-5">
        <div v-if="loading" class="text-center py-4">
          <Loading />
        </div>
        <NotFound
          v-else-if="!extrinsic"
          text="Contract transaction not found"
        />
        <Card v-else class="list-view">
          <Headline>Contract Transaction</Headline>
          <contract-transaction :contract="contract" :extrinsic="extrinsic" />
          <extrinsic-events
            :block-number="parseInt(extrinsic.block_number)"
            :extrinsic-index="parseInt(extrinsic.extrinsic_index)"
          />
        </Card>
      </b-container>
    </section>
  </div>
</template>
<script>
import { toChecksumAddress } from 'web3-utils'
import { gql } from 'graphql-tag'
import Loading from '@/components/Loading.vue'
import commonMixin from '@/mixins/commonMixin.js'
import ContractTransaction from '@/components/ContractTransaction.vue'

export default {
  components: {
    Loading,
    ContractTransaction,
  },
  mixins: [commonMixin],
  data() {
    return {
      loading: true,
      extrinsicHash: this.$route.params.hash,
      extrinsic: undefined,
      contractId: undefined,
      contract: undefined,
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
      this.extrinsicHash = this.$route.params.hash
    },
  },
  apollo: {
    extrinsic: {
      query: gql`
        query extrinsic($hash: String!) {
          extrinsic(where: { hash: { _eq: $hash } }) {
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
        return !this.extrinsicHash
      },
      variables() {
        return {
          hash: this.extrinsicHash,
        }
      },
      result({ data }) {
        this.extrinsic = data.extrinsic[0]
        this.contractId = toChecksumAddress(JSON.parse(this.extrinsic.args)[0])
      },
    },
    contract: {
      query: gql`
        query contract($contractId: String!) {
          contract(where: { contract_id: { _eq: $contractId } }) {
            contract_id
            verified
            abi
            is_erc20
            token_name
            token_symbol
            token_decimals
          }
        }
      `,
      skip() {
        return !this.contractId
      },
      variables() {
        return {
          contractId: this.contractId,
        }
      },
      result({ data }) {
        this.contract = data.contract[0]
        this.loading = false
      },
    },
  },
}
</script>
