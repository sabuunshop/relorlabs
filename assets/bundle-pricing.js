if (!customElements.get('bundle-pricing')) {
  customElements.define(
    'bundle-pricing',
    class BundlePricing extends HTMLElement {
      constructor() {
        super();

        this.radios = Array.from(this.querySelectorAll('.bundle-pricing__radio'));
        this.purchaseOptionRadios = Array.from(this.querySelectorAll('.bundle-pricing__purchase-radio'));
        this.quantityInput = this.querySelector('.bundle-pricing__quantity-input');
        this.sellingPlanInput = this.querySelector('.bundle-pricing__selling-plan-input');
        this.priceEl = this.querySelector('.bundle-pricing__submit-price');
        this.originalEl = this.querySelector('.bundle-pricing__submit-original');
        this.submitButton = this.querySelector('.bundle-pricing__submit');
        this.spinner = this.querySelector('.loading__spinner');
        this.purchaseOption = 'onetime';

        this.radios.forEach((radio) => {
          radio.addEventListener('change', this.onTierChange.bind(this));
        });

        this.purchaseOptionRadios.forEach((radio) => {
          radio.addEventListener('change', this.onPurchaseOptionChange.bind(this));
        });

        const form = document.getElementById(this.dataset.formId);
        if (form) {
          this.variantIdInput = form.querySelector('.product-variant-id');
          form.addEventListener('submit', this.onFormSubmit.bind(this));
        }

        const checkedPurchaseOption = this.purchaseOptionRadios.find((radio) => radio.checked);
        if (checkedPurchaseOption) this.purchaseOption = checkedPurchaseOption.value;

        // Ensure the form submits the variant matching whichever tier is
        // selected by default on page load, not just the product's first variant.
        const checkedRadio = this.radios.find((radio) => radio.checked);
        if (checkedRadio) this.applyTier(checkedRadio);
      }

      onTierChange(event) {
        this.applyTier(event.target);
      }

      onPurchaseOptionChange(event) {
        this.purchaseOption = event.target.value;
        if (this.sellingPlanInput) {
          this.sellingPlanInput.value =
            this.purchaseOption === 'subscribe' ? event.target.dataset.sellingPlanId || '' : '';
        }

        this.updateAllTierPrices();

        const checkedRadio = this.radios.find((radio) => radio.checked);
        if (checkedRadio) this.applyTier(checkedRadio);
      }

      priceFor(radio) {
        const priceKey = this.purchaseOption === 'subscribe' ? 'subscribeFormatted' : 'onetimeFormatted';
        return radio.dataset[priceKey] || '';
      }

      updateAllTierPrices() {
        this.radios.forEach((radio) => {
          const tierPriceEl = radio.closest('.bundle-pricing__tier')?.querySelector('.bundle-pricing__price-current');
          if (tierPriceEl) tierPriceEl.textContent = this.priceFor(radio);
        });
      }

      applyTier(radio) {
        if (this.quantityInput) this.quantityInput.value = radio.value;
        if (this.variantIdInput && radio.dataset.variantId) {
          this.variantIdInput.value = radio.dataset.variantId;
        }

        const currentFormatted = this.priceFor(radio);
        if (this.priceEl) this.priceEl.textContent = currentFormatted;
        if (this.originalEl) this.originalEl.textContent = radio.dataset.originalFormatted || '';

        const tierPriceEl = radio.closest('.bundle-pricing__tier')?.querySelector('.bundle-pricing__price-current');
        if (tierPriceEl) tierPriceEl.textContent = currentFormatted;
      }

      onFormSubmit() {
        if (!this.submitButton) return;

        this.submitButton.classList.add('loading');
        this.submitButton.setAttribute('aria-disabled', 'true');
        if (this.spinner) this.spinner.classList.remove('hidden');

        window.setTimeout(() => {
          this.submitButton.classList.remove('loading');
          this.submitButton.removeAttribute('aria-disabled');
          if (this.spinner) this.spinner.classList.add('hidden');
        }, 3000);
      }
    }
  );
}
