import productMixin from '@/mixins/productMixin';
import BasePrice from '../BasePrice/BasePrice.vue';
import cartMixin from '../../../mixins/cartMixin';
import { addLine } from '../shared';

export default {
  props: {
    product: {
      type: Object,
      required: true,
    },
  },
  components: {
    BasePrice,
  },
  mixins: [productMixin, cartMixin],
  methods: {
    async addLineItem() {
      return addLine(this)
        .then(() => this.$store.dispatch('openMiniCart'));
    },
    openModal() {
      this.$emit('open-modal', { slug: this.currentProduct.slug, sku: this.matchingVariant.sku });
    },
  },
  computed: {
    matchingVariant() {
      // with query endpoint we cannot really determine
      return this.currentProduct.masterVariant || {};
    },
    sku() {//needed for addLine to work
      return this.matchingVariant.sku;
    },
    hasMoreColors() {
      // with sunrise data it is not possible to determine
      return false;
    },
    hasDiscount() {
      return this.matchingVariant.price.discounted;
    },
    hasImages() {
      return Array.isArray(this.matchingVariant.images) && this.matchingVariant.images.length > 0;
    },
  },
};
