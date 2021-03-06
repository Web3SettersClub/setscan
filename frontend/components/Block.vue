<template>
  <Card class="list-view block-details">
    <Headline>
      {{ $t('details.block.block') }} #
      {{ formatNumber(parsedBlock.block_number) }}
    </Headline>

    <Data>
      <Row>
        <Cell>{{ $t('details.block.timestamp') }}</Cell>
        <Cell class="list-view__age">
          <font-awesome-icon :icon="['far', 'clock']" />
          <span>{{ getAge(parsedBlock.timestamp) }}</span>
          <span>({{ formatTimestamp(parsedBlock.timestamp) }})</span>
        </Cell>
      </Row>

      <Row>
        <Cell>Status</Cell>
        <Cell>
          <font-awesome-icon
            :icon="parsedBlock.finalized ? 'check' : 'spinner'"
            :class="
              parsedBlock.finalized
                ? 'text-success'
                : 'list-view__processing-icon'
            "
            style="margin-right: 5px"
          />
          <span>{{ parsedBlock.finalized ? 'Finalized' : 'Processing' }}</span>
        </Cell>
      </Row>

      <Row>
        <Cell>{{ $t('details.block.block_hash') }}</Cell>
        <Cell>{{ parsedBlock.block_hash }}</Cell>
      </Row>

      <Row>
        <Cell>{{ $t('details.block.extrinsic_root') }}</Cell>
        <Cell>{{ parsedBlock.extrinsics_root }}</Cell>
      </Row>

      <Row>
        <Cell>{{ $t('details.block.parent_hash') }}</Cell>
        <Cell>
          <span v-if="parsedBlock.block_number === 0"> -- </span>
          <nuxt-link
            v-else
            :to="`/block?blockNumber=${parsedBlock.block_number - 1}`"
          >
            {{ parsedBlock.parent_hash }}
          </nuxt-link>
        </Cell>
      </Row>

      <Row>
        <Cell>{{ $t('details.block.state_root') }}</Cell>
        <Cell>{{ parsedBlock.state_root }}</Cell>
      </Row>
    </Data>

    <Tabs v-model="tab" :options="tabs" />

    <Table v-if="tab === 'extrinsics'">
      <THead>
        <Cell>ID</Cell>
        <Cell>{{ $t('details.block.hash') }}</Cell>
        <Cell>{{ $t('details.block.signer') }}</Cell>
        <Cell>{{ $t('details.block.section') }}</Cell>
        <Cell>{{ $t('details.block.method') }}</Cell>
        <Cell>{{ $t('details.block.args') }}</Cell>
        <Cell align="center">{{ $t('details.block.success') }}</Cell>
      </THead>

      <Row
        v-for="(extrinsic, index) in parsedExtrinsics"
        :key="'extrinsic-' + index"
      >
        <Cell
          :link="`/extrinsic/${extrinsic.block_number}/${extrinsic.extrinsic_index}`"
          >{{ extrinsic.block_number }}-{{ extrinsic.extrinsic_index }}</Cell
        >
        <Cell>{{ shortHash(extrinsic.hash) }}</Cell>
        <Cell
          v-if="extrinsic.signer"
          :link="{ url: `/account/${extrinsic.signer}`, fill: false }"
          :title="$t('details.block.account_details')"
        >
          <SetheumIdenticon
            :key="extrinsic.signer"
            :address="extrinsic.signer"
            :size="20"
          />
          <span>{{ shortAddress(extrinsic.signer) }}</span>
        </Cell>
        <Cell v-else />
        <Cell>{{ extrinsic.section }}</Cell>
        <Cell>{{ extrinsic.method }}</Cell>
        <Cell>{{ extrinsic.args }}</Cell>
        <Cell align="center">
          <font-awesome-icon
            v-if="extrinsic.success"
            icon="check"
            class="text-success"
          />
          <font-awesome-icon v-else icon="times" class="text-danger" />
        </Cell>
      </Row>
    </Table>

    <Table v-if="tab === 'events'">
      <THead>
        <Cell>{{ $t('details.block.section') }}</Cell>
        <Cell>{{ $t('details.block.method') }}</Cell>
        <Cell>{{ $t('details.block.phase') }}</Cell>
        <Cell>{{ $t('details.block.data') }}</Cell>
      </THead>

      <Row v-for="(event, index) in parsedEvents" :key="'event-' + index">
        <Cell>{{ event.section }}</Cell>
        <Cell>{{ event.method }}</Cell>
        <Cell>{{ event.phase }}</Cell>
        <Cell>
          <template
            v-if="event.section === `balances` && event.method === `Transfer`"
          >
            <SetheumIdenticon
              :key="JSON.parse(event.data)[0]"
              :address="JSON.parse(event.data)[0]"
              :size="20"
            />
            <nuxt-link
              v-b-tooltip.hover
              :to="`/account/${JSON.parse(event.data)[0]}`"
              :title="$t('details.block.account_details')"
            >
              {{ shortAddress(JSON.parse(event.data)[0]) }}
            </nuxt-link>
            <font-awesome-icon icon="arrow-right" />
            <SetheumIdenticon
              :key="JSON.parse(event.data)[1]"
              :address="JSON.parse(event.data)[1]"
              :size="20"
            />
            <nuxt-link
              v-b-tooltip.hover
              :to="`/account/${JSON.parse(event.data)[1]}`"
              :title="$t('details.block.account_details')"
            >
              {{ shortAddress(JSON.parse(event.data)[1]) }}
            </nuxt-link>
            <font-awesome-icon icon="arrow-right" />
            <span class="amount">
              {{ formatAmount(JSON.parse(event.data)[2]) }}
            </span>
          </template>
          <template v-else>
            {{ event.data }}
          </template>
        </Cell>
      </Row>
    </Table>
  </Card>
</template>

<script>
import SetheumIdenticon from '@/components/SetheumIdenticon.vue'
import commonMixin from '@/mixins/commonMixin.js'
import '@/components/Details'

export default {
  components: {
    SetheumIdenticon,
  },
  mixins: [commonMixin],
  props: {
    parsedBlock: {
      type: Object,
      default: () => {},
    },
    parsedExtrinsics: {
      type: Array,
      default: () => [],
    },
    parsedEvents: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      tab: 'extrinsics',
    }
  },
  computed: {
    tabs() {
      return {
        extrinsics: this.$t('details.block.extrinsics'),
        events: this.$t('details.block.system_events'),
      }
    },
  },
}
</script>

<style lang="scss">
.block-details {
  .tabs {
    margin: 25px 0;
  }
}
</style>
