if (!customElements.get('bundle-pricing')) {
  customElements.define(
    'bundle-pricing',
    class BundlePricing extends HTMLElement {
      constructor() {
        super();

        this.radios = Array.from(this.querySelectorAll('.bundle-pricing__radio'));
        this.quantityInput = this.querySelector('.bundle-pricing__quantity-input');
        this.priceEl = this.querySelector('.bundle-pricing__submit-price');
        this.originalEl = this.querySelector('.bundle-pricing__submit-original');
        this.submitButton = this.querySelector('.bundle-pricing__submit');
        this.spinner = this.querySelector('.loading__spinner');

        this.radios.forEach((radio) => {
          radio.addEventListener('change', this.onTierChange.bind(this));
        });

        const form = document.getElementById(this.dataset.formId);
        if (form) {
          this.variantIdInput = form.querySelector('.product-variant-id');
          form.addEventListener('submit', this.onFormSubmit.bind(this));
        }

        // Ensure the form submits the variant matching whichever tier is
        // selected by default on page load, not just the product's first variant.
        const checkedRadio = this.radios.find((radio) => radio.checked);
        if (checkedRadio) this.applyTier(checkedRadio);
      }

      onTierChange(event) {
        this.applyTier(event.target);
      }

      applyTier(radio) {
        if (this.quantityInput) this.quantityInput.value = radio.value;
        if (this.priceEl) this.priceEl.textContent = radio.dataset.currentFormatted || '';
        if (this.originalEl) this.originalEl.textContent = radio.dataset.originalFormatted || '';
        if (this.variantIdInput && radio.dataset.variantId) {
          this.variantIdInput.value = radio.dataset.variantId;
        }
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
